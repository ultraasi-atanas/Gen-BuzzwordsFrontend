'use strict';

const cells = document.querySelectorAll('.cell');
//alert(cells.length);
cells.forEach(c => {c.addEventListener('click', () => cellClick(c))})

function cellClick (c) {
    alert('click ' + c.id); 
}