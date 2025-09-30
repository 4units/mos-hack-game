package router

import (
	_ "github.com/4units/mos-hack-game-api/docs"
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
	DocsWriter      DocsWriter
}

func Setup(rt *mux.Router, deps Deps) (http.Handler, error) {
	rt.Use(middleware.HandlePanic)

	rt.HandleFunc("/user", deps.UserHandler.GetUserInfo).Methods(http.MethodGet)

	userRoute := rt.PathPrefix("/user").Subrouter()

	userRoute.HandleFunc("/register/email", deps.UserHandler.RegisterUserByEmail).Methods(http.MethodPost)
	userRoute.HandleFunc("/token/email", deps.UserHandler.GetUserTokenByEmail).Methods(http.MethodPost)
	userRoute.HandleFunc("/token/anonymous", deps.UserHandler.GetAnonymouseUserToken).Methods(http.MethodGet)

	gameRouter := rt.PathPrefix("/game").Subrouter()

	gameRouter.HandleFunc("/line/level", deps.LineGameHandler.GetUserLevel).Methods(http.MethodGet)
	gameRouter.HandleFunc("/line/level", deps.LineGameHandler.CompleteLevel).Methods(http.MethodPost)

	rt.PathPrefix("/swagger/").Handler(
		httpSwagger.Handler(
			httpSwagger.DeepLinking(true),
			httpSwagger.DocExpansion("none"),
			httpSwagger.DomID("swagger-ui"),
		),
	).Methods(http.MethodGet)

	return rt, nil
}
