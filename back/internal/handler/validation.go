package handler

import (
	"errors"
	"fmt"
	http_errors "github.com/4units/mos-hack-game/back/pkg/http-errors"
	logs "github.com/4units/mos-hack-game/back/pkg/logging"
	"github.com/go-playground/validator/v10"
	"net/http"
	"strings"
)

func validationErr(w http.ResponseWriter, validate *validator.Validate, req interface{}) bool {
	if err := validate.Struct(req); err != nil {
		var validatorErr validator.ValidationErrors
		if errors.As(err, &validatorErr) {
			errs := make([]string, len(validatorErr))
			for i, fieldError := range validatorErr {
				if fieldError.Param() != "" {
					errs[i] = fmt.Sprintf(
						"failed to validate field '%s', because of tag '%s:%s'",
						strings.ToLower(fieldError.Field()),
						fieldError.Tag(), fieldError.Param(),
					)
				} else {
					errs[i] = fmt.Sprintf(
						"failed to validate field '%s', because of tag '%s'", strings.ToLower(fieldError.Field()),
						fieldError.Tag(),
					)
				}
				break
			}
			http_errors.SendBadRequest(w, strings.Join(errs, ";"))
		} else {
			http_errors.SendBadRequest(w, "failed to validate request")
		}
		logs.Error("failed to validate the request", err)
		return true
	}
	return false
}
