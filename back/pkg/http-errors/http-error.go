package http_errors

import (
	"encoding/json"
	"errors"
	"net/http"
)

const InternalErrorResponseText string = "internal server error"

type Error struct {
	Text         string
	StatusCode   int
	ResponseText string
}

type ResponseError struct {
	Error string `json:"error" example:"internal server error"`
}

func New(text, responseText string, statusCode int) *Error {
	return &Error{
		Text:         text,
		StatusCode:   statusCode,
		ResponseText: responseText,
	}
}

func NewSame(text string, statusCode int) *Error {
	return &Error{
		Text:         text,
		StatusCode:   statusCode,
		ResponseText: text,
	}
}

func NewInternal(message string) *Error {
	return &Error{
		Text:         message,
		StatusCode:   http.StatusInternalServerError,
		ResponseText: InternalErrorResponseText,
	}
}

func (e *Error) Error() string {
	return e.Text
}

func SendWrapped(w http.ResponseWriter, err error) {
	var ownErr *Error
	ok := errors.As(err, &ownErr)
	respTest := InternalErrorResponseText
	if ok {
		w.WriteHeader(ownErr.StatusCode)
		respTest = ownErr.ResponseText
	} else {
		w.WriteHeader(http.StatusInternalServerError)
	}
	w.Write(getResponseBody(respTest))
}

func Send(w http.ResponseWriter, err error, statusCode int) {
	w.WriteHeader(statusCode)
	w.Write(getResponseBody(err.Error()))
}

func SendInternal(w http.ResponseWriter) {
	w.WriteHeader(http.StatusInternalServerError)
	w.Write(getResponseBody(InternalErrorResponseText))
}

func SendBadRequest(w http.ResponseWriter, text string) {
	w.WriteHeader(http.StatusBadRequest)
	w.Write(getResponseBody(text))
}

func getResponseBody(text string) []byte {
	body, _ := json.Marshal(
		ResponseError{
			Error: text,
		},
	)
	return body
}
