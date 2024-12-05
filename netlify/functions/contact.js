const sgMail = require('@sendgrid/mail');
const querystring = require('querystring');

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
        const { name, email, comment, website } = querystring.parse(event.body);

        // Honeypot check
        if (website) {
            console.warn('Honeypot triggered!');
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Spam detected!' }),
            };
        }

        // Validate required fields
        if (!name || !email || !comment) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'All fields are required' }),
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
        console.error('Error in contact function:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to send email' }),
        };
    }
};
