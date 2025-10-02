# back-end

Инструкция была написана с упором на работу в Unix-системе.

Все операции лучше проводить находясь в каталоге _/back_, для перехода в который нужно выполнить команду:

```shell
cd back
```

## Первый запуск

Для запуска проекта необходимо иметь скаченное и запущенное приложение Docker.

Далее нужно создать секреты, запустив команды:

```shell
openssl genrsa -out secrets/chat-server.rsa
openssl rsa -in secrets/chat-server.rsa -pubout > secrets/chat-server.rsa.pub
```

После этого нужно создать новый .env файл на основе уже имеющегося env.example:

```shell
cp .env.example .env
```

## Запуск

Для запуска проекта используется docker compose, который устанавливается вместе с Docker, требуется его скачать, если он
отсутствует и затем запустить команду:

```shell
RUN_MIGRATIONS=true docker compose --env-file .env up -d --build
```

## Тестирование

Для тестирования используется Swagger. После запуска приложение можно открыть браузер и перейти по
адресу http://localhost:8081/swagger/ для проверки работы сервер.

Для авторизации можно воспользоваться методом http://localhost:8081/user/token/anonymous, скопировав полученный token в
поле ввода Authorize, введя дополнительно слово _Bearer_ в начале. В итоге должно быть примерно следующее значение в
поле Value: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` 