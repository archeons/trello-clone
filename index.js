const columnListUrl = "http://localhost:3000/columns";
const cardListUrl = "http://localhost:3000/cards";

window.addEventListener('load', () => {
    var query = getQueryParams('q', window.location.href);
    if(query !== null) {
        document.getElementById('searchBar').value = query;
    }
    fetchList();
})

var submit = document.getElementById("submit");
submit.addEventListener("click", function () {
    var query = '?q='+document.getElementById('searchBar').value;
    var redirectUrl = window.location.href.split('?')[0] + query;
    window.location.replace(redirectUrl);
});

async function removeColumn(id) {
    // remove column
    var jsonBody = {
        id: id,
    };
    let columnUrl = columnListUrl + '/' + id;
    var putMethod = {
        method: 'DELETE', 
        headers: {
            'Content-type': 'application/json; charset=UTF-8' 
        },
        body: JSON.stringify(jsonBody)
    }
    var res = await fetch(columnUrl, putMethod);
    
    // remove all cards under the column
    let cardUrl = cardListUrl + '?columnId=' + id;
    var cardRes = await fetch(cardUrl);
    const json = await cardRes.json();
    json.forEach(card => {
        removeCard(`${card.columnId}`, false);
    });
    if(res.status == '200') {
        window.location.reload();
    }
};

const getQueryParams = ( params, url ) => {
    let href = url;
    let reg = new RegExp( '[?&]' + params + '=([^&#]*)', 'i' );
    let queryString = reg.exec(href);
    return queryString ? queryString[1] : null;
};

async function updateColumn(id) {
    let name = 'column-'+id;
    const columnName = document.getElementById(name).innerHTML;
    const url = columnListUrl + '/' + id;
    var jsonBody = {
        id: id,
        name: columnName
    };
    const putMethod = {
        method: 'PUT', 
        headers: {
            'Content-type': 'application/json; charset=UTF-8' 
        },
        body: JSON.stringify(jsonBody)
    }
    const res = await fetch(url, putMethod);
};

async function removeCard(id, redirect) {
    var jsonBody = {
        id: id,
    };
    const url = cardListUrl + '/' + id;
    const putMethod = {
        method: 'DELETE', 
        headers: {
            'Content-type': 'application/json; charset=UTF-8' 
        },
        body: JSON.stringify(jsonBody)
    }
    const res = await fetch(url, putMethod);
    if(res.status == '200' && redirect) {
        window.location.reload();
    }
};

async function updateCard(id, card) {
    let name = 'card-'+id;
    const cardName = document.getElementById(name).innerHTML;
    let desc = 'description-'+id;
    const descName = document.getElementById(desc).innerHTML;
    const url = cardListUrl + '/' + id;
    var jsonBody = {
        id: card.id,
        name: cardName,
        description: descName,
        columnId: card.columnId
    };
    const putMethod = {
        method: 'PUT', 
        headers: {
            'Content-type': 'application/json; charset=UTF-8' 
        },
        body: JSON.stringify(jsonBody)
    }
    console.log(putMethod);
    const res = await fetch(url, putMethod);
};

async function fetchList() {
    var currentUrl = document.URL;
    var query = currentUrl.split("?")[1];
    const res1 = await fetch(columnListUrl+'?'+query);
    const json1 = await res1.json();
    const main = document.querySelector('.column-list');
    json1.forEach(column => {
        const el = document.createElement('div');
        el.setAttribute('class', 'col-sm draggable');
        el.setAttribute('contenteditable', true);
        el.innerHTML = '<span id="column-'+`${column.id}`+'">'+`${column.name}`+'</span>';
        
        let addc = document.createElement('span');
        addc.setAttribute('id', `${column.id}`);
        addc.setAttribute('style', 'color:green; float:right;');
        addc.setAttribute('class', 'fa fa-check-circle-o');
        addc.onclick = function () {
            updateColumn(this.id);
        };
        
        let rc = document.createElement('span');
        rc.setAttribute('id', `${column.id}`);
        rc.setAttribute('style', 'color:red; float:right;');
        rc.setAttribute('class', 'fa fa-times-circle-o');
        rc.onclick = function () {
            var r = confirm("Are you sure to delete this column?");
            if (r == true) {
                removeColumn(this.id);
            } 
        };
        
        el.appendChild(addc);
        el.appendChild(rc);
        main.appendChild(el);
    })
    
    const res2 = await fetch(cardListUrl+'?'+query);
    const json2 = await res2.json();
    const sub = document.querySelector('.card-list');
    // find the longest card no
    var countList = [];
    json2.forEach(card => {
        if(typeof(countList[`${card.columnId}`]) === 'undefined') {
            countList[`${card.columnId}`] = 1;
        } else {
            countList[`${card.columnId}`]++;
        }
    })
    // TODO dynamic display for all cards and columns
    var totalCards = Math.max(countList)*json1.length;
    var counter = 1;
    console.log(json2);
    json2.forEach(card => {
        if(`${card.columnId}` == counter) {
            const el = document.createElement('div');
            el.setAttribute('class', 'col-sm draggable');
            el.setAttribute('contenteditable', true);
            el.innerHTML = '<span id="card-'+`${card.id}`+'">'+`${card.name}`+'</span>';
            let accordion = document.createElement('span');
            accordion.setAttribute('id', `${card.id}`);
            accordion.setAttribute('style', 'color:green; float:right;');
            accordion.setAttribute('class', 'fa fa-arrow-down');
            accordion.setAttribute('data-toggle', 'collapse');
            accordion.setAttribute('data-target', `#description-${card.id}`);
            
            let addc = document.createElement('span');
            addc.setAttribute('id', `${card.id}`);
            addc.setAttribute('style', 'color:green; float:right;');
            addc.setAttribute('class', 'fa fa-check-circle-o');
            addc.onclick = function () {
                updateCard(this.id, card);
            };
            
            let rc = document.createElement('span');
            rc.setAttribute('id', `${card.id}`);
            rc.setAttribute('style', 'color:red; float:right;');
            rc.setAttribute('class', 'fa fa-times-circle-o');
            rc.onclick = function () {
                var r = confirm("Are you sure to delete this card?");
                if (r == true) {
                    removeCard(this.id, true);
                } 
            };
            
            let panel = document.createElement('div');
            panel.setAttribute('id', `description-${card.id}`);
            panel.setAttribute('class', 'collapse');
            panel.setAttribute('contenteditable', true);
            panel.innerHTML = `${card.description}`;

            el.appendChild(accordion);
            el.appendChild(addc);
            el.appendChild(rc);
            el.appendChild(panel);
            sub.appendChild(el);
        } else {
            const row = document.createElement('div');
            const editableTable = document.querySelector('.table-editable');
            row.setAttribute('class', 'row card-list');
            editableTable.appendChild(row);
        }
        if(`${card.columnId}` % json1.length == 0) counter = 1;
        counter++;
    })
}

// Accordion Start
var acc = document.getElementsByClassName("accordion");
var i;
// Editable Description
for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function () {
        this.classList.toggle("active");
        var panel = this.nextElementSibling;
        if (panel.style.display === "block") {
            panel.style.display = "none";
        } else {
            panel.style.display = "block";
        }
    });
}
// Accordion End

// TODO Draggable Start
const draggables = document.querySelectorAll('.draggable');
const containers = document.querySelectorAll('.container');

draggables.forEach(draggable => {
    draggable.addEventListener('dragstart', () => {
        draggable.classList.add('dragging');
    })
    draggable.addEventListener('dragend', () => {
        draggable.classList.remove('dragging');
    })
})

containers.forEach(container => {
    container.addEventListener('dragover', e => {
        e.preventDefault();
        const afterElement = getDragAfterElement(container, e.clientY);
        const draggable = document.querySelector('.dragging');
        if(afterElement == null) {
            container.appendChild(draggable);
        } else {
            container.insertBefore(draggable,afterElement);
        }
    }) 
})

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')];
    return draggableElements.reduce((closest, child) =>{
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        console.log(offset);
        if(offset < 0 && offset > closest.offset){
            return {offset: offset, element: child};
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY}).element;
}

// Draggable End