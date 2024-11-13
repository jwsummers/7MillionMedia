document.getElementById("contactForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Collect form data
    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    // Send form data to the serverless function
    try {
        const response = await fetch(this.action, {
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
            this.reset();
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