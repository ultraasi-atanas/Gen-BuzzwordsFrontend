'use strict';

let bigHex = document.getElementById('bigHex')

function makeGrid() {
	let edgeWidth = 4
	let stop = 8
	let startNum = 0

	//top section
	for (let cols = edgeWidth; cols < stop; cols++) {
		bigHex.appendChild(buildRow(cols, startNum, "top", (cols == edgeWidth), false))
		startNum += cols
	}

	//middle row	
	bigHex.appendChild(buildRow(stop, startNum, "middle", false, false))
	startNum += stop

	for (let cols = stop - 1; cols >= edgeWidth; cols--) {
		bigHex.appendChild(buildRow(cols, startNum, "bottom", false, (cols == edgeWidth)))
		startNum += cols
	}
}
//build a single attritube that contains all the data data-neighbours="7,11,4"
function buildRow(cols, startNum, section, isTopEdge, isBottomEdge) {

	let row = document.createElement('div')
	row.classList.add("cellHolder")
	row.style.display="flex"
	row.style.justifyContent="center"
	

	// for (let c = cols; c > 0; c--) 
	for (let c = 0; c < cols; c++) {
		
		let id = c + startNum

		var cellDiv=document.createElement('div') //make a div to contain each image and letter
		cellDiv.setAttribute("id", 'c' + id)
		cellDiv.classList.add("cellDiv")
		row.appendChild(cellDiv);
		
		//var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		let svg = oneHexagon()		
		cellDiv.appendChild(svg);

		let letter = document.createElement("label")
		letter.setAttribute("id","l" + id)
		
		letter.classList.add("cellLetter")
		cellDiv.appendChild(letter)

		//empty array to hold the neighbours
		let n = []

		if (c != 0) {
			// img.setAttribute("data-left",id -1)  // wil be ID number ...do we get rid of code that makes it
			n.push(id - 1)
		}
		// we need to push id+1 into the array
		// img.setAttribute("data-right",id +1)
		if (c < cols - 1) {
			n.push(id + 1)
		}

		//deal with diagonal neighbours

		let isFirstColumn = (c == 0)
		let isLastColumn = (c == cols - 1)

		if (section == 'top') {
			n.push(id + cols)   //Below left
			n.push(id + cols + 1)  //below Right
			if (!isFirstColumn && !isTopEdge) {
				n.push(id - cols) //Above left
			}
			if (!isLastColumn && !isTopEdge) {
				n.push(id - cols + 1) //Above right
			}
		}

		else if (section == 'middle') {


			if (!isFirstColumn && !isTopEdge) {
				n.push(id - cols) //Above Left

			}
			if (!isLastColumn && !isTopEdge) {
				n.push(id - cols + 1) //Above right

			}
			if (!isFirstColumn && !isTopEdge) {
				n.push(id + cols - 1) //Below Left

			}
			if (!isLastColumn && !isTopEdge) {
				n.push(id + cols) //Below right
			}

		}

		else if (section == 'bottom') {

			n.push(id - cols)   //Below left
			n.push(id - cols - 1)  //below Right

			if (!isLastColumn && !isBottomEdge) {
				n.push(id + cols) //Below right
			}
			if (!isFirstColumn && !isBottomEdge) {

				n.push(id + cols - 1) //Above right
			}

		}
		//ADD STRING C TO DATA-NEIGHBOURS
		// option 1
		// for(let i=0;i<n.length;i++){
		// 	n[i]="C"+n[i];
		// }
		//option 2
		// n.forEach(function(element, index) {
		// 	n[index] = 'C' + element;
		// });
		//option 3
		n = n.map(i=> 'c'+i)
		
		cellDiv.setAttribute("data-neighbours", n.join( ","))
		
		
	}
	return row
}

function oneHexagon(){

	let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg"); //Ugly 'secret sauce' required for making SVG elements (without it - they don't render properly)
		
	svg.setAttribute("viewBox", '0 0 451 492')
	svg.setAttribute("xmlns", 'xmlns="http://www.w3.org/2000/svg')		
	svg.innerHTML=`<path d="M7.5 132.372L225.992 8.62403L443.5 132.362V358.655L225.992 483.359L7.5 358.645V132.372Z" stroke="#D2D54C" stroke-width="15"/>`
	
	return svg
			
}

makeGrid()

//let images = document.getElementsByTagName("img")[0];

// attributes()


// let imgs = document.getElementsByTagName('img');  //To the look will give them each an IDThis is to give each hex an ID using IMG //seperate funtion.This will always give any element an ID regardless of its use.
// for (let i = 0, length = imgs.length; i < length; i++) {
// 	imgs[i].setAttribute("id", i);
// }


