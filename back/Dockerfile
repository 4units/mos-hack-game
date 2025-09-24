# ==== Build ====
FROM golang:1.24 AS builder

ENV GOOS=linux
ENV GOARCH=amd64
ENV CGO_ENABLED=0

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o backend ./cmd/main.go

# ==== Runtime ====
FROM scratch AS backend

WORKDIR /

COPY --from=builder /app/backend /backend

EXPOSE ${HTTP_PORT}
ENTRYPOINT ["/backend"]