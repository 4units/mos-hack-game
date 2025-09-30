package middleware

import (
	"context"
	"errors"
	http_errors "github.com/4units/mos-hack-game/back/pkg/http-errors"
	"github.com/4units/mos-hack-game/back/pkg/logging"
	"net/http"
	"time"
)

func HandleWithTimeOut(timeout time.Duration) func(h http.Handler) http.Handler {
	return func(h http.Handler) http.Handler {
		return http.HandlerFunc(
			func(w http.ResponseWriter, r *http.Request) {
				ctx, cancel := context.WithTimeout(r.Context(), timeout)
				defer cancel()
				ch := make(chan struct{})
				go func() {
					h.ServeHTTP(w, r)
					select {
					case <-ctx.Done():
						return
					default:
					}
					ch <- struct{}{}
				}()
				select {
				case <-ctx.Done():
					err := errors.New("response time is out")
					http_errors.Send(w, err, http.StatusRequestTimeout)
					logging.Error("middleware response time out", err)
				case <-ch:
				}
			},
		)
	}
}
