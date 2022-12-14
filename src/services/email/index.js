const config = require('../../config/config');
const assert = require('assert');
const nodemailer = require('nodemailer');

module.exports = class EmailSender {
    constructor(email) {
        this.email = email;
    }

    async send() {
        if (!EmailSender.isConfigured) {
            console.error(
                `Email provider is not configured. Please configure it at backend/config/<environment>.json.`,
            );
            return;
        }

        assert(this.email, 'email is required');
        assert(this.email.to, 'email.to is required');
        assert(this.email.subject, 'email.subject is required');
        assert(this.email.html, 'email.html is required');

        console.log(this.transportConfig)

        const transporter = nodemailer.createTransport(
            this.transportConfig,
        );

        const mailOptions = {
            from: this.from,
            to: this.email.to,
            subject: this.email.subject,
            html: this.email.html,
        };

        return transporter.sendMail(mailOptions);
    }

    static get isConfigured() {
        return !!config.email && !!config.email.host;
    }

    get transportConfig() {
        return config.email;
    }

    get from() {
        return config.email.from;
    }
};
