
const db = require('../db/models');
const { Op } = require('sequelize');
const UsersDBApi = require('../db/api/users');

const ValidationError = require('./notifications/errors/validation');
// const EmailSender = require('./email');
// const AuthService = require('./auth');

const bcrypt = require("bcrypt");
const config = require("../config/config");

module.exports = class UsersService {
    static async create(data, currentUser, sendInvitationEmails = true, host) {
        let transaction = await db.sequelize.transaction();
        let email = data.email;
        try {
            if (email) {
                let user = await UsersDBApi.findBy({email}, {transaction});
                if (user) {
                    throw new ValidationError(
                        'iam.errors.userAlreadyExists',
                    );
                } else {
                    await UsersDBApi.create(
                        {data},
                        {
                            currentUser,
                            transaction,
                        },
                    );
                }
            }
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    static async create(data, sendInvitationEmails = true, host) {

        let transaction = await db.sequelize.transaction();
        let email = data.email;

        try {
            if (email) {
                let user = await UsersDBApi.findBy({email}, {transaction});
                if (user) {

                    data.disabled = false
                    let id = user.id
                    let newUser = await UsersDBApi.update(id, data, {transaction})

                } else {
                    data.disabled = true;
                    let newUser = await UsersDBApi.createRequest({ data }, { transaction },);

                    data.userId = newUser.dataValues.id
                    data.city = city.name
                }
            }
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }


    static async update(data, id, currentUser) {
        const transaction = await db.sequelize.transaction();
        try {
            let users = await UsersDBApi.findBy(
                {id},
                {transaction},
            );

            if (!users) {
                throw new ValidationError(
                    'iam.errors.userNotFound',
                );
            }

            await UsersDBApi.update(
                id,
                data,
                {
                    currentUser,
                    transaction,
                },
            );

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();

            throw error;
        }
    };

    static async updateFormData(data, id, currentUser) {
        const transaction = await db.sequelize.transaction();
        try {
            let users = await UsersDBApi.findBy(
                {id},
                {transaction},
            );

            if (!users) {
                throw new ValidationError(
                    'iam.errors.userNotFound',
                );
            }

            await UsersDBApi.updateFormData(
                id,
                data,
                {
                    currentUser,
                    transaction,
                },
            );

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();

            throw error;
        }
    };

    static generatePassword() {
        let password = ''
        const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        for (let i = 0; i < 9; i++) {
            password += characters.charAt(
                Math.floor(Math.random() * characters.length)
            )
        }
        return password
    }


    static async userVerify(data, id, currentUser) {
        const transaction = await db.sequelize.transaction();

        try {
            let users = await UsersDBApi.findBy(
                {id},
                {transaction},
            );


            if (!users) {
                throw new ValidationError(
                    'iam.errors.userNotFound',
                );
            }

            if(users.password == null) {
                let password = this.generatePassword();
                const hashedPassword = await bcrypt.hash(
                    password,
                    config.bcrypt.saltRounds,
                );
                await UsersDBApi.updatePassword(
                    id,
                    hashedPassword,
                    {currentUser},
                );

                await UsersDBApi.update(
                    id,
                    data,
                    {
                        currentUser,
                        transaction,
                    },
                );

            } else {
                await UsersDBApi.update(
                    id,
                    data,
                    {
                        currentUser,
                        transaction,
                    },
                );
            }

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();

            throw error;
        }
    };

    static async remove(id, currentUser) {
        const transaction = await db.sequelize.transaction();

        try {
            if (currentUser.id === id) {
                throw new ValidationError(
                    'iam.errors.deletingHimself',
                );
            }

            if (!currentUser.role.includes('admin')) {
                throw new ValidationError(
                    'errors.forbidden.message',
                );
            }

            await UsersDBApi.remove(
                id,
                {
                    currentUser,
                    transaction,
                },
            );

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
};
