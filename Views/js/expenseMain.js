const showLeader = document.getElementById('leaderboard');
const download = document.getElementById('downloadBtn');
const divAlert = document.getElementById('div-alert');

download.addEventListener('click', async (e) => {
    console.log('working');
    try {
        const token = localStorage.getItem('token')
        const result = await axios.get(`/expense/download`, { headers: { "Authorization": token } })
        await displayNotification("report downloded  Successfully!", 'success', divAlert);
    } catch (err) {
        console.log(err)
        await displayNotification('Failed to download reports. Please try again later.', 'danger', divAlert);
    }

    // console.log(result.data[0].category);

})
showLeader.addEventListener('click', async (e) => {
    e.preventDefault();
    window.location.href = '/premium/leaderBoard';
})

document.getElementById('rzp-button1').onclick = async function (e) {
    const token = localStorage.getItem('token')
    const response = await axios.get('http://localhost:3000/order/premiummembership', { headers: { "Authorization": token } });
    console.log(response);
    var options =
    {
        "key": response.data.key_id, // Enter the Key ID generated from the Dashboard
        "order_id": response.data.order.id,// For one time payment
        // This handler function will handle the success payment
        "handler": async function (response) {
            const res = await axios.post('http://localhost:3000/order/updatetransactionstatus', {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id,
            }, { headers: { "Authorization": token } })

            if (res.data.message === 'success') {
                await displayNotification('You are now premium user', 'success', divAlert);
                const token = res.data.token;
                localStorage.setItem('token', token)
                window.location.href = '/expense/expenseMain';
            }
            // console.log(res)
            // alert('You are a Premium User Now')
            // document.getElementById('rzp-button1').style.visibility = "hidden"
            // document.getElementById('rzp-button1').remove();
            // document.getElementById('PremiumDiv').innerHTML = "You are a premium user "
            // localStorage.setItem('token', res.data.token)
            // showLeaderboard()
        },
    };
    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on('payment.failed', function (response) {
        console.log(response)
        alert('Something went wrong')
    });
}
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
