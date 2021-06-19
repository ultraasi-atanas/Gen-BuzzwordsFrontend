'use strict';

let allowedCells = ['c0', 'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9'];

let usedCells = [];

let word = ''
let letters = {}
let selectedTiles = []

const currentWord = document.getElementById('word');

const cells = document.querySelectorAll('.cell');
//alert(cells.length);
cells.forEach(c => { c.addEventListener('click', () => cellClick(c)) })

fillBoard(10)
async function fillBoard(numLetters) {

    let board = await submit('GET', `http://localhost:3000/api/rndletters/${numLetters}`)

    for (let i = 0; i < board.length; i++) {

        let id = 'c' + i
        let tile = document.getElementById(id)
        tile.innerHTML = board[i] // set tile innerhtml to each letter from the board array

    }
}

//function cellClick (c) {
//    alert('click ' + c.id); 
//}

const cellClick = cell => {
    // Check if allowedCells array includes the clicked cell and that it hasn't been clicked already
    if (allowedCells.includes(cell.id) && !usedCells.includes(cell.id)) {
        // Split neighbours string into an array of substrings
        allowedCells = cell.dataset.neighbours.split(',');
        // Add the clicked cell to the usedCells array
        usedCells.push(cell.id)
        console.log('Allowed cells (If not used) - ' + allowedCells)
        // Change background color of the clicked cell
        //cell.style.backgroundColor = 'peru';
        cell.classList.add("used")
        word = word + cell.innerHTML
        letters[cell.id] = cell.innerHTML
        selectedTiles.push(cell)
        currentWord.innerHTML = word
    } else {
        alert('Not allowed')
    }
}

function clearCell() {
    cells.forEach(c => {
        c.classList.remove("used")
        c.classList.remove("good")
        c.classList.remove("bad")

    })

}

async function submitWord() {
    let response = await submit('POST', 'http://localhost:3000/api/dict', { "letters": letters })
    console.log(response)
    const history = document.getElementById("wordHistory")
    let words = document.createElement("p")
    words.innerHTML = `${response.word} ${response.score}`
    history.appendChild(words)

    //const cells = document.querySelectorAll('.cell');
    //alert(cells.length);

    clearCell()

    if (response.match) {
        selectedTiles.forEach(t => {
            t.classList.add("good")
        })
    }
    else {
        selectedTiles.forEach(t => {
            t.classList.add("bad")
        })
    }

    letters = {}
    selectedTiles = []
    allowedCells = ['c0', 'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9'];
    usedCells = []
    word = ''
    currentWord.innerHTML = ''

    // we receive new letters as part of the response: refill the used letters
    console.log(response.letters)
    for (let k in response.letters) {
        let tile = document.getElementById(k)
        tile.innerHTML = response.letters[k]
    }
    //(textcontent appendChild)

    // TODO - multiple history items   
    // Flash/remove/animate correct letters
    // Show letters as 'bad' if there was no match (penalty??)
    // Use/show the replacement letters      
    // Show running total score (will need to come from server)

}

async function submit(method, url, requestBodyObj) {


    let payload = null

    if (method == "POST") {
        payload = JSON.stringify(requestBodyObj) // the trick here is to make an object from the formdata
        console.log("PL:" + payload)
    }


    const response = await fetch(url, { method: method, body: payload, headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' } })
    //const response = await fetch(url, {method:method,headers:{'Accept':'application/json','Content-Type':'application/json'}})

    if (response.ok) {
        const promise = await response.json()
        //console.log(obj[0].word + obj[0].meanings[0].definitions[0].definition)       
        return (promise)

        // Do something with the object we just receved

    }
    else {
        //something bad happened
        document.getElementById("message").innerHTML = + response.status
        setTimeout(() => { document.getElementById("message").innerHTML = "" }, 1000)

    }
}
