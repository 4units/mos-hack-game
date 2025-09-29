package http_errors

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestSendWrapped_New(t *testing.T) {
	testErrorText := "nullInputError"
	testStatus := http.StatusBadRequest
	testResponseText := "input is null"
	var nullInputError = New(testErrorText, testResponseText, testStatus)
	rr := httptest.NewRecorder()

	err := getError(nullInputError)

	if err.Error() != testErrorText {
		t.Errorf("Wrong error. Expected %v, got %v\n", err.Error(), testErrorText)
	}

	SendWrapped(rr, err)

	if rr.Code != testStatus {
		t.Errorf("Wrong response code. Expected %d, got %d\n", testStatus, rr.Code)
	}

	expectedResponse, _ := json.Marshal(
		struct {
			Error string `json:"error"`
		}{
			Error: testResponseText,
		},
	)
	if rr.Body.String() != string(expectedResponse) {
		t.Errorf("Wrong response body. Expected %s, got %s\n", expectedResponse, rr.Body.String())
	}
}

func TestSendWrapped_NewInternal(t *testing.T) {
	testErrorText := "nullInputError"
	var nullInputError = NewInternal(testErrorText)
	rr := httptest.NewRecorder()

	err := getError(nullInputError)

	if err.Error() != testErrorText {
		t.Errorf("Wrong error. Expected %v, got %v\n", err.Error(), testErrorText)
	}

	SendWrapped(rr, err)

	if rr.Code != http.StatusInternalServerError {
		t.Errorf("Wrong response code. Expected %d, got %d\n", http.StatusInternalServerError, rr.Code)
	}

	expectedResponse, _ := json.Marshal(
		struct {
			Error string `json:"error"`
		}{
			Error: InternalErrorResponseText,
		},
	)
	if rr.Body.String() != string(expectedResponse) {
		t.Errorf("Wrong response body. Expected %s, got %s\n", expectedResponse, rr.Body.String())
	}
}

func TestSendWrapped_New_Wrapped(t *testing.T) {
	testErrorText := "nullInputError"
	testStatus := http.StatusBadRequest
	testResponseText := "input is null"
	var nullInputError = New(testErrorText, testResponseText, testStatus)
	rr := httptest.NewRecorder()

	wrappedErr := fmt.Errorf("some error: %w", getError(nullInputError))

	SendWrapped(rr, wrappedErr)

	if rr.Code != testStatus {
		t.Errorf("Wrong response code. Expected %d, got %d\n", testStatus, rr.Code)
	}

	expectedResponse, _ := json.Marshal(
		struct {
			Error string `json:"error"`
		}{
			Error: testResponseText,
		},
	)
	if rr.Body.String() != string(expectedResponse) {
		t.Errorf("Wrong response body. Expected %s, got %s\n", expectedResponse, rr.Body.String())
	}
}

func TestSendWrapped_Null(t *testing.T) {
	rr := httptest.NewRecorder()

	SendWrapped(rr, errors.New("test error"))

	if rr.Code != http.StatusInternalServerError {
		t.Errorf("Wrong response code. Expected %d, got %d\n", http.StatusInternalServerError, rr.Code)
	}

	expectedResponse, _ := json.Marshal(
		struct {
			Error string `json:"error"`
		}{
			Error: InternalErrorResponseText,
		},
	)
	if rr.Body.String() != string(expectedResponse) {
		t.Errorf("Wrong response body. Expected %s, got %s\n", expectedResponse, rr.Body.String())
	}
}
func TestSend(t *testing.T) {
	rr := httptest.NewRecorder()

	testStatusCode := http.StatusBadRequest
	testErrorText := "input is null"

	Send(rr, errors.New(testErrorText), testStatusCode)

	if rr.Code != testStatusCode {
		t.Errorf("Wrong response code. Expected %d, got %d\n", testStatusCode, rr.Code)
	}

	expectedResponse, _ := json.Marshal(
		struct {
			Error string `json:"error"`
		}{
			Error: testErrorText,
		},
	)
	if rr.Body.String() != string(expectedResponse) {
		t.Errorf("Wrong response body. Expected %s, got %s\n", expectedResponse, rr.Body.String())
	}
}

func getError(err *Error) error {
	return err
}
