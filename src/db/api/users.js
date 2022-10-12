const db = require('../models');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class UsersDBApi {

    static async create(data, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const users = await db.users.create(
            {
                id: data.id || undefined,
                firstName: data.firstName || null,
                lastName: data.lastName || null,
                role: data.data.role || 'user',
                email: data.data.email || null,
                disabled: data.data.disabled || false,
                password: data.data.password || null,
                emailVerified: data.data.emailVerified || false,
                provider: data.data.provider || null,
                createdById: currentUser.id,
                updatedById: currentUser.id
            },
            {transaction},
        );


        // await FileDBApi.replaceRelationFiles({
        //         belongsTo: db.users.getTableName(),
        //         belongsToColumn: 'docs',
        //         belongsToId: users.id,
        //     },
        //     data.data.docs,
        //     options,
        // );

        return users;
    }

    static async update(id, data, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const users = await db.users.findByPk(id, {
            transaction,
        });

        await users.update(
            {
                id: data.id || undefined,
                firstName: data.firstName || null,
                lastName: data.lastName || null,
                role: data.data.role || 'user',
                email: data.data.email || null,
                disabled: data.data.disabled || false,
                password: data.data.password || null,
                emailVerified: data.data.emailVerified || false,
                provider: data.data.provider || null,
                createdById: currentUser.id,
                updatedById: currentUser.id
            },
            {transaction}
        )

        return users;
    }

    static async remove(id, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const users = await db.users.findByPk(id, options);

        await users.update({
            deletedBy: currentUser.id
        }, {
            transaction,
        });

        await users.destroy({
            transaction
        });

        return users;
    }

    static async findBy(where, options) {
        const transaction = (options && options.transaction) || undefined;

        const users = await db.users.findOne(
            {where},
            {transaction},
        );

        if (!users) {
            return users;
        }

        const outputUsers = users.get({plain: true});


        return outputUsers;
    }

    static async findAll(filter, options) {
        let limit = 0;
        let offset = 0;
        let orderBy = null;

        const transaction = (options && options.transaction) || undefined;
        let where = {};
        let include = [
            {
                model: db.file,
                as: 'avatar',
            }
        ];

        if (filter) {
            if (filter.id) {
                where = {
                    ...where,
                    ['id']: Utils.uuid(filter.id),
                };
            }


            if (filter.firstName) {
                where = {
                    ...where,
                    [Op.and]: Utils.ilike(
                        'users',
                        'firstName',
                        filter.firstName,
                    ),
                };
            }

            if (filter.lastName) {
                where = {
                    ...where,
                    [Op.and]: Utils.ilike(
                        'users',
                        'lastName',
                        filter.lastName,
                    ),
                };
            }


            if (filter.email) {
                where = {
                    ...where,
                    [Op.and]: Utils.ilike(
                        'users',
                        'email',
                        filter.email,
                    ),
                };
            }

            if (filter.password) {
                where = {
                    ...where,
                    [Op.and]: Utils.ilike(
                        'users',
                        'password',
                        filter.password,
                    ),
                };
            }

            if (filter.provider) {
                where = {
                    ...where,
                    [Op.and]: Utils.ilike(
                        'users',
                        'provider',
                        filter.provider,
                    ),
                };
            }

            if (filter.role) {
                where = {
                    ...where,
                    role: filter.role,
                };
            }

            if (filter.disabled) {
                where = {
                    ...where,
                    disabled: filter.disabled,
                };
            }

            if (filter.emailVerified) {
                where = {
                    ...where,
                    emailVerified: filter.emailVerified,
                };
            }
        }

        let {rows, count} = await db.users.findAndCountAll(
            {
                where,
                include,
                limit: limit ? Number(limit) : undefined,
                offset: offset ? Number(offset) : undefined,
                order: orderBy
                    ? [orderBy.split('_')]
                    : [['createdAt', 'DESC']],
                transaction,
            },
        );

        return {rows, count};
    }

    static async updatePassword(id, password, options) {
        const currentUser = (options && options.currentUser) || {id: null};

        const transaction = (options && options.transaction) || undefined;

        const users = await db.users.findByPk(id, {
            transaction,
        });

        await users.update(
            {
                password,
                authenticationUid: id,
                updatedById: currentUser.id,
            },
            {transaction},
        );

        return users;
    }

    static async markEmailVerified(id, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const users = await db.users.findByPk(id, {
            transaction,
        });

        await users.update(
            {
                emailVerified: true,
                updatedById: currentUser.id,
            },
            {transaction},
        );

        return true;
    }

    static async createFromAuth(data, options) {
        const transaction = (options && options.transaction) || undefined;
        const users = await db.users.create(
            {
                email: data.email,
                firstName: data.firstName,
                authenticationUid: data.authenticationUid,
                password: data.password,
                role: 'user'
            },
            {transaction},
        );

        await users.update(
            {
                authenticationUid: users.id,
            },
            {transaction},
        );

        delete users.password;
        return users;
    }

}
