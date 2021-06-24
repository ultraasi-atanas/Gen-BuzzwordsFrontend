'use strict';

let allCells = ['c0', 'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'c10', 'c11', 'c12', 'c13', 'c14', 'c15', 'c16', 'c17', 'c18', 'c19'];

let allowedCells = allCells
let usedCells = []
let word = ''
let letters = {}
let selectedTiles = []
let cellNo = allCells.length

const currentWord = document.getElementById('word');
const cells = document.querySelectorAll('.cell');
cells.forEach(c => { c.addEventListener('click', () => cellClick(c)) })

fillBoard(cellNo)

async function getGames() {

    let games = await submit('GET', `http://localhost:3000/api/listOpenGames`)
    
}

async function signUp() {
    let user = getElementById('userName') 
    let password = getElementById('password') 
    let userinfo = {username: user, password: password} 
    let result = await submit('POST', `http://localhost:3000/api/join/`, userinfo)    
    console.log(result)
}

async function signIn() {
    let user = getElementById('si_userName') 
    let password = getElementById('si_password') 
    let userinfo = {username: user, password: password} 
    let result = await submit('POST', `http://localhost:3000/api/login/`, userinfo)    
    console.log(result)
}

async function fillBoard(numLetters) {

    let board = await submit('GET', `http://localhost:3000/api/rndletters/${numLetters}`)

    for (let i = 0; i < board.length; i++) {

        let id = 'c' + i
        let tile = document.getElementById(id)
        tile.innerHTML = board[i] // set tile innerhtml to each letter from the board array
    }
}

const cellClick = cell => {
    // Check if allowedCells array includes the clicked cell and that it hasn't been clicked already
    if (allowedCells.includes(cell.id) && !usedCells.includes(cell.id)) {
        // Split neighbours string into an array of substrings
        allowedCells = cell.dataset.neighbours.split(',');
        // Add the clicked cell to the usedCells array
        usedCells.push(cell.id)
        console.log('Allowed cells (If not used) - ' + allowedCells)
        // Change background color of the clicked cell
        cell.classList.add("used") 
        word = word + cell.innerHTML //Add letter that is chosen to word variable
        letters[cell.id] = cell.innerHTML //push to backend
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
    const history = document.getElementById("historyHolder")
    let historyEntry = document.createElement("p")
    historyEntry.classList.add("wordHistory")
    historyEntry.innerHTML = `${word} ${response.score}`
    history.appendChild(historyEntry)

    clearCell()

    if (response.match) {
        selectedTiles.forEach(t => {
            t.classList.add("good")
        })
    }
    else {
        selectedTiles.forEach(t => {
            t.classList.add("bad")     // Show letters as 'bad' if there was no match (penalty??)
        })
    }

    letters = {}
    selectedTiles = []
    allowedCells = allCells

    usedCells = []
    word = ''
    currentWord.innerHTML = ''

    // we receive new letters as part of the response: refill the used letters
    console.log(response.letters)
    for (let k in response.letters) {
        let tile = document.getElementById(k)
        tile.innerHTML = response.letters[k]
    }
    // TODO - multiple history items   
    // Flash/remove/animate correct letters
    // Use/show the replacement letters      
    // Show running total score (will need to come from server)
}

async function submit(method, url, requestBodyObj) {

    // const response = await fetch("http://localhost:3000/login", {
    //     method: "POST",
    //     credentials: "same-origin",
    //     body: JSON.stringify({ username: body[0], password: body[1] }),
    //     headers: {
    //       "Access-Control-Allow-Origin": "*",
    //       "Access-Control-Allow-Headers": "*",
    //       "Content-Type": "application/json",
    //     },
    //   });


    let payload = null

    if (method == "POST") {
        payload = JSON.stringify(requestBodyObj) // the trick here is to make an object from the formdata
        console.log("PL:" + payload)
    }

    const response = await fetch(url, { method: method, body: payload, credentials: "same-origin",headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*'} })

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
