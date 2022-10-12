


module.exports = function(sequelize, DataTypes) {
    const articles = sequelize.define(
        'articles',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            belongsToId: DataTypes.UUID,
            header: {
                type: DataTypes.TEXT
            },
            time: {
                type: DataTypes.DATE
            },
            img: {
                type: DataTypes.TEXT
            },
            body: {
                type: DataTypes.TEXT
            }
        },
        {
            timestamps: true,
            paranoid: DataTypes
        }
    );

    articles.associate = (db) => {

        db.articles.belongsTo(db.users, {
            as: 'author',
            constraints: false,
        });

        db.articles.belongsTo(db.users, {
            as: 'createdBy',
        });

        db.articles.belongsTo(db.users, {
            as: 'updatedBy',
        });
    };

    return articles;
}

