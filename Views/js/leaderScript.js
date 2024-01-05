function showPremiumuserMessage() {
    // document.getElementById('rzp-button1').style.visibility = "hidden"
    document.getElementById('rzp-button1').remove()
    document.getElementById('PremiumDiv').innerHTML = "You are a premium user "
    document.getElementById('leaderboard').innerHTML = "Leader Board"
}

window.addEventListener("DOMContentLoaded", async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');
    const decodeToken = parseJwt(token)
    const isPremium = decodeToken.isPremium
    console.log(isPremium)
    if (isPremium) {
        showPremiumuserMessage()
        // showLeaderboard()
    }
    const userLeaderBoardArray = await axios.get('http://localhost:3000/premium/showLeaderBoard', { headers: { "Authorization": token } })
    console.log(userLeaderBoardArray)
    userLeaderBoardArray.data.forEach((userDetails) => {

        showOnDisplay(userDetails);
    })

})
function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}
// nnnnnnnnnnnnnnnnnn
function showOnDisplay(obj) {
    const tableData = document.getElementById('tableList');

    // create row 
    const row = document.createElement("tr");
    // create cells 
    const cell1 = document.createElement("td");
    const cell2 = document.createElement("td");

    // attach data to cells 
    const cellText1 = document.createTextNode(`${obj.name}`);
    const cellText2 = document.createTextNode(`${obj.totalExpense}`);

    cell1.appendChild(cellText1);
    cell2.appendChild(cellText2);

    // attach cells to rows 
    row.appendChild(cell1);
    row.appendChild(cell2);


    tableData.appendChild(row);
}
