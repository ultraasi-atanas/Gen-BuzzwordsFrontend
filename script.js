'use strict';

let allowedCells = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'c10'];

let usedCells = [];

let word = '';

const currentWord = document.getElementById('word');

const cells = document.querySelectorAll('.cell');
//alert(cells.length);
cells.forEach(c => {c.addEventListener('click', () => cellClick(c))})

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
        cell.style.backgroundColor = 'peru';
        word = word + cell.innerHTML
        currentWord.innerHTML = word
    } else {
        alert('Not allowed')
    }
}

function submitWord() {
    submit('GET', 'http://localhost:3000/api/dict/' + word)
}

async function submit(method, url){
    
    /*let payload=null
    if (method==='POST' || method === 'PATCH'){
        if(formData instanceof FormData){
            payload = JSON.stringify(Object.fromEntries(formData)) // the trick here is to make an object from the formdata
        }
    }*/ 
    
    //const response = await fetch(url, {method:method,body:payload,headers:{'Accept':'application/json','Content-Type':'application/json'}})
    const response = await fetch(url, {method:method,headers:{'Accept':'application/json','Content-Type':'application/json'}})
  
    if (response.ok){     
        const obj = await response.json() 
        console.log(obj[0].word + obj[0].meanings[0].definitions[0].definition)       
	
	// Do something with the object we just receved

    }
    else{
	//something bad happened
	document.getElementById("message").innerHTML= + response.status
        setTimeout(()=>{document.getElementById("message").innerHTML= ""},1000)

    }
}
