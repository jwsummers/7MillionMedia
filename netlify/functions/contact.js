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
        // Parse form data
        const { name, email, comment, website, recaptchaToken } = querystring.parse(event.body);

        // Honeypot check
        if (website) {
            console.warn('Honeypot triggered!');
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Spam detected!' }),
            };
        }

        // Validate required fields
        if (!name || !email || !comment || !recaptchaToken) {
            console.warn('Missing fields:', { name, email, comment, recaptchaToken });
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'All fields are required' }),
            };
        }

        // Validate email format
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            console.warn('Invalid email address:', email);
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Invalid email address' }),
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

        console.log('reCAPTCHA response:', recaptchaResponse.data);

        if (!recaptchaResponse.data.success) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'reCAPTCHA validation failed' }),
            };
        }

        // Send email
        const msg = {
            to: 'Mpreston@7millionmedia.com',
            from: 'Mpreston@7millionmedia.com',
            subject: `New Contact Form Submission from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\nMessage: ${comment}`,
        };

        await sgMail.send(msg);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Email sent successfully' }),
        };
    } catch (error) {
        console.error('Error in contact function:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to send email' }),
        };
    }
};
