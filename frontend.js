'use strict';

let bigHex = document.getElementById('bigHex')

function add_img() {
	let topEdge = 3
	let stop = 6
	for (let r = topEdge; r <= stop; r++) {

		bigHex.appendChild(buildRow(r))

	}
	for (let r = stop - 1; r >= topEdge; r--) {

		bigHex.appendChild(buildRow(r))
	}

}

function buildRow(cols) {
	let row = document.createElement('div')

	for (let c = cols; c > 0; c--) {

		var img = document.createElement('img');
		img.src = 'icons/hexagon.svg'
		img.style.width = "30px"
		row.appendChild(img);


	}
	return row
}



add_img()

let images = document.getElementsByTagName("img")[0];


function attributes() {

	for (let i = 0; i <= images; i++) {
		images.setAttribute("id", counter++)

	}
}


let counter = 0

let test = document.getElementById('test')


// Case 4 =
// 	TL = n - c
// TR = (n - c) + 1
// BL = n + c
// BR = BL + 1

// Case 20 =
// 	TL = n - (c + 1)
// TR = n - c
// BL = n + (c - 1)
// BR = n + c







