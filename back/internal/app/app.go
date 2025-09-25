package app

import (
	"context"
	"errors"
	"fmt"
	"github.com/4units/mos-hack-game/back/config"
	"github.com/4units/mos-hack-game/back/internal/handler"
	"github.com/4units/mos-hack-game/back/internal/router"
	"github.com/4units/mos-hack-game/back/internal/storage/postgres"
	"github.com/4units/mos-hack-game/back/internal/usecase"
	logs "github.com/4units/mos-hack-game/back/pkg/logging"
	"github.com/gorilla/mux"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"sync"
	"syscall"
)

func Run(cfg *config.Config) error {
	log, err := logs.NewSlogLogger(cfg.App.LogMode, os.Stdout)
	if err != nil {
		return err
	}
	slog.SetDefault(log)

	log.Info("start app")

	ctx, cancel := context.WithCancelCause(context.Background())
	defer cancel(nil)

	pool, err := postgres.NewPool(ctx, cfg.Postgres)
	if err != nil {
		return err
	}
	defer pool.Close()
	log.Info("connected to postgres")

	messageUsecase := usecase.NewQizeUsecase(
		usecase.QuizUsecaseDeps{},
	)

	tokenUsecase, err := usecase.NewTokenUsecase(cfg.Authorization)
	if err != nil {
		return err
	}

	messageHandler := handler.NewMessageHandler(
		handler.MessageHandlerDeps{
			MessageProvider: messageUsecase,
			MessageSender:   messageUsecase,
			UserIDProvider:  tokenUsecase,
		},
	)

	userStorage := postgres.NewUserStorage(pool)

	userUsecase := usecase.New(
		usecase.Deps{
			TokenProvider: tokenUsecase,
			UserStorage:   userStorage,
		},
	)

	userHandler := handler.NewUserHandler(
		handler.UserHandlerDeps{
			UserAuthenticator: userUsecase,
			UserIDProvider:    tokenUsecase,
			UserDataProvider:  userUsecase,
		},
	)

	rt := mux.NewRouter()

	handler, err := router.Setup(
		rt, router.Deps{
			MessageHandler: messageHandler,
			UserHandler:    userHandler,
		},
	)
	if err != nil {
		return err
	}

	server := &http.Server{
		Handler: handler,
		Addr:    fmt.Sprintf(":%v", cfg.Host.HttpPort),
	}
	serverHostAttr := slog.String("host", server.Addr)

	go func() {
		log.Info("start server", serverHostAttr)
		serverErr := server.ListenAndServe()
		if !errors.Is(serverErr, http.ErrServerClosed) {
			select {
			case <-ctx.Done():
				err = errors.Join(err, serverErr)
			default:
				cancel(serverErr)
			}
		}
	}()

	exitCh := make(chan os.Signal, 1)
	defer close(exitCh)

	signal.Notify(
		exitCh, syscall.SIGINT, syscall.SIGTERM, syscall.SIGQUIT, syscall.SIGHUP, syscall.SIGKILL, syscall.SIGTSTP,
	)

	log.Info("app started")
	select {
	case <-exitCh:
		cancel(nil)
	case <-ctx.Done():
		err = context.Cause(ctx)
	}
	log.Info("start shutdown")

	wg := sync.WaitGroup{}
	wgch := make(chan struct{})
	go func() {
		defer close(wgch)
		wg.Wait()
	}()

	clsCtx, clsCancel := context.WithTimeout(context.Background(), cfg.App.ShutdownTimeout)
	defer clsCancel()

	wg.Add(1)
	go func() {
		defer wg.Done()
		pool.Close()
		log.Info("postgres pool is closed")
	}()

	wg.Add(1)
	go func() {
		defer wg.Done()
		if shutdownErr := server.Shutdown(clsCtx); err != nil {
			err = errors.Join(err, shutdownErr)
		}
		log.Info("stop server", serverHostAttr)
	}()

	select {
	case <-wgch:
		log.Info("wait group is finished")
	case <-clsCtx.Done():
		log.Info("timeout for wait group is finished")
	}

	log.Info("app shutdown")
	return err
}
