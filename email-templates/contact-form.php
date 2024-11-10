<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Set recipient email
    $receiver_email = "maz3jws@gmail.com";
    $subject = "New Contact Form Submission";

    // Sanitize input data to prevent XSS and injection attacks
    $name = htmlspecialchars(strip_tags(trim($_POST['name'])));
    $email = htmlspecialchars(strip_tags(trim($_POST['email'])));
    $comment = htmlspecialchars(strip_tags(trim($_POST['comment'])));

    // Check if fields are filled
    if (!empty($name) && !empty($email) && !empty($comment)) {
        // Prepare the email message
        $message = "
            <html>
            <head>
                <title>Contact Form Submission</title>
            </head>
            <body>
                <p><strong>Name:</strong> $name</p>
                <p><strong>Email:</strong> $email</p>
                <p><strong>Message:</strong><br>$comment</p>
            </body>
            </html>
        ";

        // Set the headers for HTML email
        $headers = "MIME-Version: 1.0" . "\r\n";
        $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
        $headers .= "From: <$email>" . "\r\n";

        // Send the email
        if (mail($receiver_email, $subject, $message, $headers)) {
            echo json_encode(["alert" => "alert-success", "message" => "Your message has been sent successfully!"]);
        } else {
            echo json_encode(["alert" => "alert-danger", "message" => "Failed to send your message. Please try again later."]);
        }
    } else {
        echo json_encode(["alert" => "alert-danger", "message" => "Please fill in all required fields."]);
    }
} else {
    echo json_encode(["alert" => "alert-danger", "message" => "Invalid request method."]);
}
?>
