let mas = [
    {
        text: 'Asliddin'
    }, 
    {
        text: 'Asadbek'
    }
]

let findEl = mas.indexOf(mas.find(obj => obj.text == 'Asliddin'))
mas.splice(findEl, 1)
console.log(mas)
