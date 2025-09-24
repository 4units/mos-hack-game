package postgres

import (
	"github.com/4units/mos-hack-game/back/internal/model"
)

type UserStorage struct {
}

func NewUserStorage() *UserStorage {
	return &UserStorage{}
}

func (u *UserStorage) CreateUserByEmail(email string, hash []byte) error {
	//TODO implement me
	panic("implement me")
}

func (u *UserStorage) GetUserByEmail(email string) (model.User, error) {
	//TODO implement me
	panic("implement me")
}
