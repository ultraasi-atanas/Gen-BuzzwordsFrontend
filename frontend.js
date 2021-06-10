'use strict';

let bigHex = document.getElementById('bigHex')

function add_img() {

	let rows = 7

	let stop = 7

	const br = "\n";

	for (let r = 0; r <= rows; r++) {
		let row = document.createElement('div')
		bigHex.appendChild(row)
		for (let c = 0; c <= stop; c++) {

			var img = document.createElement('img');
			img.src = 'icons/hexagon.svg'
			//img.className = "img2"
			img.style.width = "30px"
			row.appendChild(img);

		}
	}
	}
	add_img()
