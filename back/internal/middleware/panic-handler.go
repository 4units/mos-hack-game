package middleware

import (
	http_errors "github.com/4units/mos-hack-game/back/pkg/http-errors"
	logs "github.com/4units/mos-hack-game/back/pkg/logging"
	"net/http"
)

func HandlePanic(h http.Handler) http.Handler {
	return http.HandlerFunc(
		func(w http.ResponseWriter, r *http.Request) {
			defer func() {
				if err := recover(); err != nil {
					http_errors.SendInternal(w)
					logs.Panic(r.Context(), "catch panic in middleware", err)
				}
			}()
			h.ServeHTTP(w, r)
		},
	)
}
