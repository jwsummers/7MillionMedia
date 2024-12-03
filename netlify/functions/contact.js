const sgMail = require('@sendgrid/mail');
const querystring = require('querystring');
const axios = require('axios');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: 'Method Not Allowed' }),
        };
    }

    try {
        // Parse URL-encoded form data
        const { name, email, comment, website, recaptchaToken } = querystring.parse(event.body);

        // Honeypot Validation: Reject if the hidden "website" field is filled
        if (website) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Spam detected!' }),
            };
        }

        // reCAPTCHA Validation
        const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
        const recaptchaResponse = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify`,
            {},
            {
                params: {
                    secret: recaptchaSecret,
                    response: recaptchaToken,
                },
            }
        );

        if (!recaptchaResponse.data.success) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'reCAPTCHA validation failed. Please try again.' }),
            };
        }

        // Set up the email content
        const msg = {
            to: 'Mpreston@7millionmedia.com',
            from: 'Mpreston@7millionmedia.com',
            subject: `New Contact Form Submission from ${name}`,
            text: `You received a new message from your contact form:\n\nName: ${name}\nEmail: ${email}\nMessage: ${comment}`,
        };

        // Send the email
        await sgMail.send(msg);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Email sent successfully' }),
        };
    } catch (error) {
        console.error('Error sending email:', error);

        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to send email' }),
        };
    }
};
