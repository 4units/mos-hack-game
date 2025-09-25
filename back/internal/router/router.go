package router

import (
	"fmt"
	"github.com/4units/mos-hack-game/back/internal/handler"
	"github.com/4units/mos-hack-game/back/internal/middleware"
	"github.com/4units/mos-hack-game/back/internal/model/constantce"
	"github.com/gorilla/mux"
	"net/http"
)

type Deps struct {
	UserHandler    *handler.UserHandler
}

func Setup(rt *mux.Router, deps Deps) (http.Handler, error) {
	rt.Use(middleware.HandlePanic)

	rt.HandleFunc("/user", deps.UserHandler.GetUserInfo).Methods(http.MethodGet)

	userRoute := rt.PathPrefix("/user").Subrouter()

	userRoute.HandleFunc("/register/email", deps.UserHandler.RegisterUserByEmail).Methods(http.MethodPost)
	userRoute.HandleFunc("/token/email", deps.UserHandler.GetUserTokenByEmail).Methods(http.MethodPost)
	userRoute.HandleFunc("/token/anonymous", deps.UserHandler.GetAnonymouseUserToken).Methods(http.MethodGet)

	return rt, nil
}
