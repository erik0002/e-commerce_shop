
const db = require('../models');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class PostsDBApi {

    static async create(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const articles = await db.articles.create(
            {
                id: data.id || undefined,
                header: data.header || false,
                time: new Date(),
                body: data.body || null,
                img: data.img || null,
                createdById: currentUser.id,
                updatedById: currentUser.id,
            },
            { transaction },
        );


        await articles.setAuthor(data.author || currentUser, {
            transaction,
        });

        return articles;
    }

    static async update(id, data, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const articles = await db.articles.findByPk(id, {
            transaction,
        });

        await articles.update(
            {
                id: data.id || undefined,
                header: data.header || false,
                time: new Date(),
                body: data.body || null,
                img: data.img || null,
                createdById: currentUser.id,
                updatedById: currentUser.id,
            },
            {transaction},
        );


        await articles.setAuthor(data.author || null, {
            transaction,
        });

        return articles;
    }

    static async remove(id, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const articles = await db.articles.findByPk(id, options);

        await articles.update({
            deletedBy: currentUser.id
        }, {
            transaction,
        });

        await articles.destroy({
            transaction
        });

        return articles;
    }

    static async findBy(where, options) {
        const transaction = (options && options.transaction) || undefined;

        const articles = await db.articles.findOne(
            { where },
            { transaction },
        );

        if (!articles) {
            return articles;
        }

        const output = articles.get({plain: true});

        output.author = await articles.getAuthor({
            transaction
        });

        return output;
    }

    static async findAll(filter, options) {
        let limit = 0;
        let offset = 0;
        let orderBy = null;

        const transaction = (options && options.transaction) || undefined;
        let where = {};
        let include = [

            {
                model: db.users,
                as: 'author',
            }

        ];

        if (filter) {
            if (filter.id) {
                where = {
                    ...where,
                    ['id']: Utils.uuid(filter.id),
                };
            }


            if (filter.header) {
                where = {
                    ...where,
                    [Op.and]: Utils.ilike(
                        'articles',
                        'header',
                        filter.header,
                    ),
                };
            }

            if (filter.body) {
                where = {
                    ...where,
                    [Op.and]: Utils.ilike(
                        'articles',
                        'body',
                        filter.body,
                    ),
                };
            }


            if (filter.author) {
                var listItems = filter.author.split('|').map(item => {
                    return  Utils.uuid(item)
                });

                where = {
                    ...where,
                    authorId: {[Op.or]: listItems}
                };
            }

        }

        let { rows, count } = await db.articles.findAndCountAll(
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

        return { rows, count };
    }

    static async findAllAutocomplete(query, limit) {
        let where = {};

        if (query) {
            where = {
                [Op.or]: [
                    { ['id']: Utils.uuid(query) },
                    Utils.ilike(
                        'articles',
                        'header',
                        query,
                    ),
                ],
            };
        }

        const records = await db.articles.findAll({
            attributes: [ 'id', 'header' ],
            where,
            limit: limit ? Number(limit) : undefined,
            orderBy: [['header', 'ASC']],
        });

        return records.map((record) => ({
            id: record.id,
            label: record.header,
        }));
    }

};

