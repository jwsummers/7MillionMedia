document.getElementById("contactForm").addEventListener("submit", async function(event) {
    console.log("Form submission triggered"); // Log when the form is submitted
    event.preventDefault();

    const form = this;

    grecaptcha.ready(async function() {
        console.log("reCAPTCHA is ready"); // Log when reCAPTCHA is ready

        try {
            const token = await grecaptcha.execute("6LdZf5EqAAAAAIfyoFf59ZWBjSemCDpxaA5GSY6C", { action: "submit" });
            console.log("Generated reCAPTCHA Token:", token); // Log the generated token

            // Add token to form data
            const formData = new FormData(form);
            formData.append("recaptchaToken", token);
            console.log("Form Data with Token:", Object.fromEntries(formData.entries())); // Log form data

            // Convert to JSON
            const data = Object.fromEntries(formData.entries());

            // Send data to server
            const response = await fetch(form.action, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            console.log("Server Response:", result); // Log server response

            const formResponse = document.getElementById("formResponse");

            if (response.ok) {
                formResponse.textContent = result.message;
                formResponse.classList.remove("d-none");
                formResponse.classList.add("alert", "alert-success");

                // Clear form
                form.reset();
            } else {
                formResponse.textContent = result.message || "An error occurred.";
                formResponse.classList.remove("d-none");
                formResponse.classList.add("alert", "alert-danger");
            }
        } catch (error) {
            console.error("Error during reCAPTCHA execution or form submission:", error);
            const formResponse = document.getElementById("formResponse");
            formResponse.textContent = "An error occurred while submitting the form.";
            formResponse.classList.remove("d-none");
            formResponse.classList.add("alert", "alert-danger");
        }
    });
});
