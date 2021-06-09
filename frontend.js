'use strict';

let bigHex = document.getElementById('bigHex')

function add_img() { 

	
	for (let i = 0; i < 52; i++) {
		var img = document.createElement('img'); 
		img.src = 'icons/hexagon.svg' 
		img.className = "img2"
		bigHex.appendChild(img);
		
	}

	
	

	
}
add_img()



 

console.log('asdas')

