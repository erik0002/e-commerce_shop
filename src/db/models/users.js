const config = require('../../config/config');
const providers = config.providers;
const bcrypt = require('bcrypt');

module.exports = function (sequelize, DataTypes) {
    const users = sequelize.define(
        'users',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            firstName: {
                type: DataTypes.TEXT
            },
            lastName: {
                type: DataTypes.TEXT
            },
            role: {
                type: DataTypes.ENUM({
                    values: ['admin', 'user', 'editor']
                })
            },
            email: {
                type: DataTypes.TEXT
            },
            password: {
                type: DataTypes.TEXT,
            },
            disabled: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            provider: {
                type: DataTypes.TEXT,
            },
            emailVerified: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            }
        },
        {
            timestamps: true,
            paranoid: true
        },
    );

    users.associate = (db) => {

        db.users.hasMany(db.articles, {
            as: 'article',
            foreignKey: 'belongsToId',
            constraints: false,
            scope: {
                belongTo: db.users.getTableName(),
                belongToColumn: 'article'
            }
        })

        db.users.belongsTo(db.users, {
            as: 'createdBy',
        });

        db.users.belongsTo(db.users, {
            as: 'updatedBy',
        });
    };

    users.beforeCreate((users, options) => {
        users = trimStringFields(users);

        if (users.provider !== providers.LOCAl && Object.values(providers).indexOf(users.provider) > -1) {
            users.emailVerified = true;

            if (!users.password) {
                const password = crypto
                    .randomBytes(20)
                    .toString('hex');

                const hashedPassword = bcrypt.hashSync(
                    password,
                    config.bcrypt.saltRounds,
                );

                users.password = hashedPassword
            }
        }
    });

    users.beforeUpdate((users, options) => {
        users = trimStringFields(users);
    });

    return users;

}

function trimStringFields(users) {
    users.email = users.email ? users.email.trim() : null;

    users.firstName = users.firstName
        ? users.firstName.trim()
        : null;

    users.lastName = users.lastName
        ? users.lastName.trim()
        : null;

    users.nickName = users.nickName
        ? users.nickName.trim()
        : null;

    return users;
}
