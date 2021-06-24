'use strict';

let bigHex = document.getElementById('bigHex')



function makeGrid() {
	let topEdge = 3
	let stop = 6
	let startNum = 0
	
	//top section
	for (let cols = topEdge; cols < stop; cols++) {
		bigHex.appendChild(buildRow(cols,startNum,"top",(cols==topEdge),false))       
		startNum += cols		
	}

	//middle row	
	bigHex.appendChild(buildRow(stop,startNum,"middle",false,false))       
	startNum += stop		
	
	//bottom section
	for (let cols = stop - 1; cols >= topEdge; cols--) {
		bigHex.appendChild(buildRow(cols,startNum,"bottom",false,(cols==topEdge)))
		startNum += cols
	}

}
//build a single attritube that contains all the data data-neighbours="7,11,4"
function buildRow(cols,startNum,section,isTopEdge,isBottomEdge) {
	
	let row = document.createElement('div')
	
	// for (let c = cols; c > 0; c--) 
	for (let c = 0; c < cols; c++) {
		var img = document.createElement('img');
		img.src = 'icons/hexagon.svg'
		img.style.width = "30px" 
		let id = c+startNum
		img.setAttribute("id", id)
		//empty array to hold the neighbours
		let n=[]

		if (c!=0) {
			// img.setAttribute("data-left",id -1)  // wil be ID number ...do we get rid of code that makes it
			n.push(id-1)
		}
		// we need to push id+1 into the array
		// img.setAttribute("data-right",id +1)
		if (c < cols-1){
			n.push(id+1)
		} 

		//deal with diagonal neighbours

		let isFirstColumn = (c==0)
		let isLastColumn = (c==cols-1)

		if (section=='top'){
			n.push(id+cols)   //Below left
			n.push(id+cols+1)  //below Right
			if (!isFirstColumn && !isTopEdge){
				n.push(id-cols) //Above left
			}
			if(!isLastColumn && !isTopEdge){
				n.push(id-cols+1 ) //Above right
			}
		}

		else if (section =='middle'){


		}

		else if (section =='bottom'){


		}


		img.setAttribute("data-neighbours", n.join(","))
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

// attributes()

// let counter = 0
// let test = document.getElementById('test')


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



