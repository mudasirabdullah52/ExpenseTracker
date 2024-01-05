const divAlert = document.getElementById('div-alert');
console.log("mudasir")
document.getElementById("registrationForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const nameInput = document.getElementById("nameInput").value;
    const phoneInput = document.getElementById("phoneInput").value;
    const emailInput = document.getElementById("emailInput").value;
    const passwordInput = document.getElementById("passwordInput").value;
    const rePassInput = document.getElementById('confirmPasswordInput').value;
    console.log(nameInput)
    if (passwordInput === rePassInput) {
        const formData = {
            nameInput: nameInput,
            phoneInput: phoneInput,
            emailInput: emailInput,
            passwordInput: passwordInput
        };
        console.log(formData)


        try {
            const response = await axios.post("/user/addUser", formData, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const data = response.data;
            if (data.message === "success") {
                await displayNotification("Registration successful!", 'success', divAlert);
                window.location = '/user/login';
            }
        } catch (error) {
            if (error.response.data.message) {
                if (error.response.data.message === "exist") {
                    await displayNotification("User already exists! Check the credentials you have entered or click on login.", 'warning', divAlert);
                } else {
                    await displayNotification(error.response.data.message, 'danger', divAlert);
                }
            }
            else {
                await displayNotification("Internal Server Error!", 'danger', divAlert);
            }
        }
    } else {
        await displayNotification('Passwords do not match.', 'warning', divAlert);
    }
});
function displayNotification(message, type, container) {
    return new Promise((resolve) => {
        const notificationDiv = document.createElement('div');
        notificationDiv.className = `alert alert-${type}`;
        notificationDiv.textContent = message;
        container.appendChild(notificationDiv);
        setTimeout(() => {
            notificationDiv.remove();
            resolve();
        }, 2000);
    });
}