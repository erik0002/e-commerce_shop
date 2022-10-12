const config = {
    bcrypt: {
        saltRounds: 12
    },
    admin_pass: '123456',
    admin_email: 'eleazarkazhuro20@gmail.com',
    providers: {
        LOCAl: 'local'
    },
    secret_key: '4cGbGt42nWjmxxPxUcdJZ8so3decmXCE',
    remote: 'https://unicef-frontend.herokuapp.com',
    port: process.env.NODE_ENV === "production" ? "" : "8080",
    hostUI: process.env.NODE_ENV === "production" ? "" : "http://localhost",
    portUI: process.env.NODE_ENV === "production" ? "" : "3000",
}

config.host = process.env.NODE_ENV === "production" ? config.remote : "http://localhost";
config.apiUrl = `${config.host}${config.port ? `:${config.port}` : ``}/api`;
config.uiUrl = `${config.hostUI}${config.portUI ? `:${config.portUI}` : ``}`;


module.exports = config;
