document.getElementById("contactForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevent the default form submission

    const form = this; // Reference to the form element

    // Get the reCAPTCHA token
    grecaptcha.ready(async function() {
        try {
            const token = await grecaptcha.execute("6LdZf5EqAAAAAIfyoFf59ZWBjSemCDpxaA5GSY6C", { action: "submit" });
            console.log("reCAPTCHA Token:", token);

            // Add the token to the form data
            const formData = new FormData(form);
            formData.append("recaptchaToken", token);
            
            // Convert form data to JSON
            const data = Object.fromEntries(formData.entries());

            // Send form data to the serverless function
            const response = await fetch(form.action, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            const formResponse = document.getElementById("formResponse");

            if (response.ok) {
                formResponse.textContent = result.message;
                formResponse.classList.remove("d-none");
                formResponse.classList.add("alert", "alert-success");

                // Clear the form fields
                form.reset();
            } else {
                formResponse.textContent = result.message || "An error occurred.";
                formResponse.classList.remove("d-none");
                formResponse.classList.add("alert", "alert-danger");
            }
        } catch (error) {
            console.error("Form submission error:", error);
            const formResponse = document.getElementById("formResponse");
            formResponse.textContent = "An error occurred while submitting the form.";
            formResponse.classList.remove("d-none");
            formResponse.classList.add("alert", "alert-danger");
        }
    });
});
