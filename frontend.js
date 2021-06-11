'use strict';

let bigHex = document.getElementById('bigHex')

function add_img() {

	let rows = 4
	let stop = 8

	// for (let r = 0; r <= rows; r++) {
	// 	let row = document.createElement('div')
	// 	bigHex.appendChild(row)
	// 	for (let c = 0; c <= stop; c++) {

	// 		var img = document.createElement('img');
	// 		img.src = 'icons/hexagon.svg'
	// 		//img.className = "img2"
	// 		img.style.width = "30px"
	// 		row.appendChild(img);

	// 	}
	// }
	for (let r = rows-1; r <= stop-1; r++) {

		let row = document.createElement('div')
		bigHex.appendChild(row)

		for (let c = r; c >= 0; c--) {

			var img = document.createElement('img');
			img.src = 'icons/hexagon.svg'
			img.style.width = "30px"
			row.appendChild(img);

		}
	}
}
add_img()

let test = document.getElementById('test')

for (let i = 3; i<8; i++){
	for (let y=i; y>=0;y-- ){
		test.append(y )
	}
	let br = document.createElement('br');
	test.appendChild(br)
}
