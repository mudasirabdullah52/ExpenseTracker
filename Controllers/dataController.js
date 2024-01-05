const path = require('path');
//Rendering home page
exports.getIndex = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Views', 'index.html'));
}