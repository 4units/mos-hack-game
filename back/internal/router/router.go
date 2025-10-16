package router

import (
	_ "github.com/4units/mos-hack-game/api-docs/gen"
	"github.com/4units/mos-hack-game/back/config"
	"github.com/4units/mos-hack-game/back/internal/handler"
	"github.com/4units/mos-hack-game/back/internal/middleware"
	"github.com/gorilla/mux"
	httpSwagger "github.com/swaggo/http-swagger/v2"
	"net/http"
)

type DocsWriter interface {
	WriteConfig(cfg *httpSwagger.Config)
}

type Deps struct {
	UserHandler     *handler.UserHandler
	LineGameHandler *handler.LineGameHandler
	BalanceHandler  *handler.BalanceHandler
	QuizHandler     *handler.QuizHandler
	ConfigHandler   *handler.ConfigHandler
	DocsWriter      DocsWriter
}

func Setup(rt *mux.Router, deps Deps, cfg config.Router) (http.Handler, error) {
	rt.Use(middleware.HandlePanic)
	rt.Use(middleware.HandleWithTimeOut(cfg.RequestTimeout))

	rt.HandleFunc("/user", deps.UserHandler.GetUserInfo).Methods(http.MethodGet)

	userRoute := rt.PathPrefix("/user").Subrouter()

	userRoute.HandleFunc("/register/email", deps.UserHandler.RegisterUserByEmail).Methods(http.MethodPost)
	userRoute.HandleFunc("/token/email", deps.UserHandler.GetUserTokenByEmail).Methods(http.MethodPost)
	userRoute.HandleFunc("/token/anonymous", deps.UserHandler.GetAnonymouseUserToken).Methods(http.MethodGet)

	gameRouter := rt.PathPrefix("/game").Subrouter()

	gameRouter.HandleFunc("/balance", deps.BalanceHandler.GetUserBalance).Methods(http.MethodGet)

	gameRouter.HandleFunc("/line/level", deps.LineGameHandler.GetUserLevel).Methods(http.MethodGet)
	gameRouter.HandleFunc("/line/level", deps.LineGameHandler.CompleteLevel).Methods(http.MethodPost)
	gameRouter.HandleFunc("/line/hint", deps.LineGameHandler.GetLevelHint).Methods(http.MethodGet)
	gameRouter.HandleFunc("/line/time-stop-booster", deps.LineGameHandler.GetTimeStopBooster).Methods(http.MethodGet)

	gameRouter.HandleFunc("/quiz", deps.QuizHandler.GetQuiz).Methods(http.MethodGet)
	gameRouter.HandleFunc("/quiz", deps.QuizHandler.AddQuiz).Methods(http.MethodPost)
	gameRouter.HandleFunc("/quiz", deps.QuizHandler.UpdateQuiz).Methods(http.MethodPut)
	gameRouter.HandleFunc("/quiz/answer", deps.QuizHandler.AnswerQuiz).Methods(http.MethodPost)

	configRouter := rt.PathPrefix("/config").Subrouter()

	configRouter.HandleFunc("/quiz", deps.ConfigHandler.GetQuizConfig).Methods(http.MethodGet)
	configRouter.HandleFunc("/quiz", deps.ConfigHandler.UpdateQuizConfig).Methods(http.MethodPut)
	configRouter.HandleFunc("/line", deps.ConfigHandler.GetLineGameConfig).Methods(http.MethodGet)
	configRouter.HandleFunc("/line", deps.ConfigHandler.UpdateLineGameConfig).Methods(http.MethodPut)
	configRouter.HandleFunc("/balance", deps.ConfigHandler.GetBalanceGameConfig).Methods(http.MethodGet)
	configRouter.HandleFunc("/balance", deps.ConfigHandler.UpdateBalanceGameConfig).Methods(http.MethodPut)
	configRouter.HandleFunc("/price", deps.ConfigHandler.GetPriceGameConfig).Methods(http.MethodGet)
	configRouter.HandleFunc("/price", deps.ConfigHandler.UpdatePriceGameConfig).Methods(http.MethodPut)

	rt.PathPrefix("/swagger/").Handler(
		httpSwagger.Handler(
			httpSwagger.DeepLinking(true),
			httpSwagger.DocExpansion("none"),
			httpSwagger.DomID("swagger-ui"),
		),
	).Methods(http.MethodGet)

	return rt, nil
}
