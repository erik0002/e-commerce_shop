
const db = require('../db/models');
const ArticlesDBApi = require('../db/api/articles');
const ValidationError = require('./notifications/errors/validation');

module.exports = class ArticlesService {
    static async create(data, currentUser) {
        const transaction = await db.sequelize.transaction();
        try {
            await ArticlesDBApi.create(
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

    static async update(data, id, currentUser) {
        const transaction = await db.sequelize.transaction();
        try {
            let posts = await ArticlesDBApi.findBy(
                {id},
                {transaction},
            );

            if (!posts) {
                throw new ValidationError(
                    'postsNotFound',
                );
            }

            await ArticlesDBApi.update(
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

    static async remove(id, currentUser) {
        const transaction = await db.sequelize.transaction();

        try {
            if (!currentUser.role.includes('admin')) {
                throw new ValidationError(
                    'errors.forbidden.message',
                );
            }

            await ArticlesDBApi.remove(
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

