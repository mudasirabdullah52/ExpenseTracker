const divAlert = document.getElementById('div-alert');
document.getElementById('passwordForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const password = document.getElementById('password1').value;
    const confirmPassword = document.getElementById('password2').value;
    const divAlert = document.getElementById('div-alert');

    // console.log(id);
    if (password === confirmPassword) {
        try {
            const id = window.location.href.split('/')[5];
            const response = await axios.post('/user/updatePasswordData', { password, id });
            await displayNotification("Password Updated Successfully!", 'success', divAlert);
            window.location.href = '/user/login';
        } catch (error) {
            console.error(error);
            await displayNotification('Failed to update password. Please try again later.', 'danger', divAlert);
        }
    } else {
        await displayNotification('Both passwords should match.', 'warning', divAlert)
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
