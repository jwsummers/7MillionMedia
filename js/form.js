document.getElementById("contactForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const form = this;

    console.log("reCAPTCHA script is ready.");
    grecaptcha.ready(async function() {
        try {
            const token = await grecaptcha.execute("6LdZf5EqAAAAAIfyoFf59ZWBjSemCDpxaA5GSY6C", { action: "submit" });
            console.log("reCAPTCHA Token:", token);

            // Add the token to the hidden input field
            document.getElementById("recaptchaToken").value = token;

            // Collect form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            // Send the form data
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
