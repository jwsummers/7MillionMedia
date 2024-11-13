const sgMail = require('@sendgrid/mail');

// Initialize SendGrid with your API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: "Method Not Allowed" }),
        };
    }

    let parsedBody;
    try {
        parsedBody = JSON.parse(event.body); // Parse JSON body safely
    } catch (error) {
        console.error("JSON parsing error:", error);
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Invalid JSON format" }), // Inform client of error
        };
    }

    const { name, email, comment } = parsedBody;

    // Define email content
    const message = {
        to: 'Mpreston@7millionmedia.com',
        from: 'Mpreston@7millionmedia.com',
        subject: `New Contact Form Submission from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${comment}`,
        html: `<p><strong>Name:</strong> ${name}</p>
               <p><strong>Email:</strong> ${email}</p>
               <p><strong>Message:</strong><br>${comment}</p>`,
    };

    try {
        await sgMail.send(message);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Your message has been sent successfully!" }),
        };
    } catch (error) {
        console.error("SendGrid error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Failed to send message" }),
        };
    }
};
