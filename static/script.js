'use strict';

let cellCount = 52 //100 - we need a formula for this from the edge length really

let allCells = [] //'c0', 'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'c10', 'c11', 'c12', 'c13', 'c14', 'c15', 'c16', 'c17', 'c18', 'c19'];
for (let i = 0; i < cellCount; i++) {
    allCells.push('c' + i)
}

let allowedCells = allCells
let usedCells = []
let word = ''
let letters = {}
let selectedTiles = []
let countdown = -1
let handle = 0

let timeLeft = 0

let state = null  //game state object - updated in getState()
let roundIndex= -1 //we track the current round to be sure the next round has started

setInterval(getState, 1000)

//Bootstrap the getState() cycle
//getState()  //getState() will set a new timeout at the end of each call for the next cycle (debugging setInterval based code was extremely confusing)

const currentWord = document.getElementById('word');
const countDownLabel= document.getElementById('countDownLabel')
const infoPanel=document.getElementById('infoPanel')
//const bigHex = document.getElementById('bigHex')

const cells = document.querySelectorAll('.cellDiv');
cells.forEach(c => {  c.addEventListener('click', () => cellClick(c)) })

// fillBoard(cellCount)

let inRoom = -1

async function getState() {

    
    state = await submit('GET', `http://localhost:3000/api/state`)

    if (state){

        let roomList = document.getElementById("roomList")
        roomList.innerHTML = ""
        infoPanel.innerHTML=''

        //Show the room/game buttons
        let myRoom=null

        state.gameRooms.forEach(r => {

            let roomButton = document.createElement('button')
            roomButton.classList.add('btnRooms')
            roomButton.classList.add(r.roomName.toLowerCase())
            roomList.appendChild(roomButton)
            let playersList = []
            r.players.map(x => playersList.push(x.name))
            roomButton.innerHTML = `${r.roomName} ${r.players.length} ${playersList.join(',')}`
            roomButton.addEventListener('click', () => { joinGame(r) })
            if (inRoom==r.roomId ) {myRoom=r} //locate and keep a refeence to 'my' room - attempting to debug anything inside the forEach gets *extremely* confusiong
        }        
        )    
       
        if (myRoom){
            let currentRound=myRoom.rounds[myRoom.currentRoundIndex] 

            if (currentRound.startingIn != null && countdown == -1 && myRoom.currentRoundIndex != roundIndex) {    //has the game moved to the next round?
                
                roundIndex=myRoom.currentRoundIndex 

                console.log("Round:" + myRoom.currentRoundIndex)        
                console.log(currentRound.letters)

                bigHex.style.display = 'none'   //hide the board during the countdown    
                fillBoard(currentRound.letters)
                clearCells()

                countdown = currentRound.startingIn
                countDownLabel.innerText=countdown
                // start counting down
                handle = setInterval(checkCountdown, 1000) //handle is a global variable which allows us to cancel the setInterval later
                // display the countDown Label
                countDownLabel.style.display="block"
            }   

            //show the round information
            if (myRoom.roomState==0){  //awaiting players
                infoPanel.innerHTML=`Awaiting players`
            }
            else if(myRoom.roomState ==1){ //in play

                if (currentRound.finished){ //@@@ 
                    if (currentRound.winner==0){
                        infoPanel.innerHTML=`Nobody won round ${myRoom.currentRoundIndex+1}!`
                    }
                    else{
                        //infoPanel.innerHTML=`${myRoom.players[currentRound.winner].name} Wins the round !`                        
                        infoPanel.innerHTML=`${myRoom.players.filter(p=>p.id==currentRound.winner)[0].name} won round ${myRoom.currentRoundIndex+1} with ${currentRound.word.word}`
                    }
                }
                else{      //the round is still in progress

                    if (countdown>0){
                        infoPanel.innerHTML=`Prepare for round:${myRoom.currentRoundIndex+1}`
                    }
                    else {
                        infoPanel.innerHTML=`Round:${myRoom.currentRound} of ${myRoom.roundsTotal} remaining:${timeLeft}`
                    }
                }
            }
            else if(myRoom.roomState ==2){ //Game finished

                let sorted = myRoom.players.sort((a,b)=>a.score<b.score)
                infoPanel.innerHTML+=`<p>${sorted[0].name} Wins the GAME !</p><p>Scores were:-</p>`  //where/how to get the winning score ??
                
                sorted.forEach(p=>infoPanel.innerHTML += `<p>${p.name} - ${p.score}</p>`)

                console.log(state)
            }
        }        
    }
    
}

function checkCountdown() {
    countdown--
    if (countdown === 0) {
        // when we reach 0 reveal the grid
        bigHex.style.display = 'block'
        // Hide the countdown
        countDownLabel.style.display="none"
        clearInterval(handle)

        timeLeft = state.gameRooms[inRoom].roundDuration  //Set the time left to the length of a round

        const timeLeftHandle = setInterval(updateTimeLeft,1000)
        setTimeout(endRound,timeLeft*1000,timeLeftHandle)  //alternative to anonymous function
        //countDown=-1 set countdown to -1 to allow a new countdown
        
    }

    countDownLabel.innerText=countdown

}

function endRound(handle){

    clearInterval (handle)
    document.getElementById('submitReset').hidden=false //Show the submit/reset buttons
    countdown=-1
    bigHex.classList.remove('locked')
    clearCells()

}

function updateTimeLeft(){
    timeLeft--
}

function joinGame(room) {
    let roomInfo = {

        "roomId": room.roomId
        //"id":"60d4974c0791a35c6c6970fd"
    }

    console.log(roomInfo)
    submit('POST', `http://localhost:3000/api/room`, roomInfo)

    inRoom = room.roomId

}

// {
//     "roomid":"0", 
//     "id":"60d4974c0791a35c6c6970fd"
// }
async function signUp() {
    let user = document.getElementById('userName')
    let password = document.getElementById('password')
    let userinfo = { username: user.value, password: password.value }
    let result = await submit('POST', `http://localhost:3000/signup/`, userinfo)
    console.log(result)
}

async function signIn() {
    let user = document.getElementById('si_userName')
    let password = document.getElementById('si_password')
    let userinfo = { username: user.value, password: password.value }
    let result = await submit('POST', `http://localhost:3000/login/`, userinfo)
    console.log(result)
}

function fillBoard(letters) {

    for (let i = 0; i < letters.length; i++) {

        let id = 'l' + i
        let tile = document.getElementById(id)
        if (tile) {
            tile.innerHTML = letters[i] // set tile innerhtml to each letter from the board array
        }
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

        let letter = document.getElementById(cell.id.replace('c', 'l')) //find the 'l27' (letter) for 'c27'
        word = word + letter.innerHTML //Add letter that is chosen to word variable
        letters[cell.id] = letter.innerHTML //push to backend
        selectedTiles.push(cell)
        currentWord.innerHTML = word
    } else {
        //  alert('Not allowed')

        cell.classList.add('bad')

    }
}

function clearCells() {
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

    document.getElementById('submitReset').hidden=true //style.display="none"
    bigHex.classList.add('locked')

    clearCells()

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

    resetLetters()

    // we receive new letters as part of the response: refill the used letters
    //obsolete - we now receive a complete new board with each round
    //console.log(response.letters)
    //for (let k in response.letters) {
    //    let lid = k.replace('c', 'l')
    //    let tile = document.getElementById(lid)
    //    tile.innerHTML = response.letters[k]
    //}


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

    //const response = await fetch(url, { method: method, body: payload, credentials: "same-origin",headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*'} })
    const response = await fetch(url, { method: method, body: payload, credentials: "same-origin", headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' } })

    if (response) {
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



function resetLetters() {
    letters = {}
    selectedTiles = []
    allowedCells = allCells

    usedCells = []
    word = ''
    currentWord.innerHTML = ''
    // clearCell() // breaks the animations
}

function resetWord() {
    resetLetters()
    clearCells()
}
