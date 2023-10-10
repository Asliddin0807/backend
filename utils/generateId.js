const asyncHandler = require('express-async-handler')

function generateRandomCharacter() {
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var randomIndex = Math.floor(Math.random() * characters.length);
    return characters.charAt(randomIndex);
}

let getenratePromoCode = (length) => {
    var promoCode = '';
    for (var i = 0; i < length; i++) {
        promoCode += generateRandomCharacter();
    }
    return promoCode;
}

module.exports = { getenratePromoCode } 

