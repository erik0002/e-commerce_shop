module.exports = {
    production: {
        dialect: 'mysql',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        use_env_variable: "DATABASE_URL",
    },
    development: {
        host: 'localhost',
        username: 'root',
        dialect: 'mysql',
        password: '123456',
        database: 'development',
        logging: console.log
    }
};
