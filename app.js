// let mas = [
//     {
//         text: 'asdasdsadasd',
//         status: true
//     },
//     {
//         text: 'asdasd',
//         status: false

//     },
//     {
//         text: 'asdasd',
//         status: true
//     }
// ]

// const app = mas.filter(obj => obj.status === true)
// console.log((app.length * 100) / mas.length)


function generateRandomCharacter() {
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var randomIndex = Math.floor(Math.random() * characters.length);
  return characters.charAt(randomIndex);
}

function generatePromoCode(length) {
  var promoCode = '';
  for (var i = 0; i < length; i++) {
      promoCode += generateRandomCharacter();
  }
  return promoCode;
}
var promoCode = generatePromoCode(10);
console.log(promoCode)
