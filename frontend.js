'use strict';

let bigHex = document.getElementById('bigHex')

function makeGrid() {
	let topEdge = 3
	let stop = 6
	let startNum = 0
	for (let cols = topEdge; cols <= stop; cols++) {

		bigHex.appendChild(buildRow(cols,startNum))       
		startNum += cols
	}
	for (let cols = stop - 1; cols >= topEdge; cols--) {

		bigHex.appendChild(buildRow(cols,startNum))
		startNum += cols
	}

}

function buildRow(cols,startNum) {
	let row = document.createElement('div')

	// for (let c = cols; c > 0; c--) 
	for (let c = 0; c < cols; c++) {
		var img = document.createElement('img');
		img.src = 'icons/hexagon.svg'
		img.style.width = "30px" 
		let id = c+startNum
		img.setAttribute("id", id)
		img.setAttribute("data-left",id -1)  // wil be ID number ...do we get rid of code that makes it

		row.appendChild(img);


	}
	return row
}
makeGrid()

let images = document.getElementsByTagName("img")[0];

// function attributes() {
// 	for (let i = 0; i <= images; i++) {
		

// 	}
// }

attributes()

let counter = 0
let test = document.getElementById('test')


let imgs = document.getElementsByTagName('img');  //To the look will give them each an IDThis is to give each hex an ID using IMG //seperate funtion.This will always give any element an ID regardless of its use.
for (let i = 0, length = imgs.length; i < length; i++) {
    imgs[i].setAttribute("id", i);  
}

// let tl 
// let tr
// let r
// let l
// let bl
// let br
// let n = id
// let c 	
// let col = colum loop  counter ++
// let hex 

// function neighbours (id,c){



