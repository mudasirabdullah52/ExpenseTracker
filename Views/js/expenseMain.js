const showLeader = document.getElementById('leaderboard');
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

            console.log(res)
            alert('You are a Premium User Now')
            // document.getElementById('rzp-button1').style.visibility = "hidden"
            document.getElementById('rzp-button1').remove();
            document.getElementById('PremiumDiv').innerHTML = "You are a premium user "
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