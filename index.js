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
    if(res.status == '200') {
        window.location.reload();
    }
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
    const res = await fetch(url, putMethod);
    if(res.status == '200') {
        window.location.reload();
    }
};

async function addColumn() {
    let name = 'column-new';
    const columnName = document.getElementById(name).innerHTML;
    let isValid = await validateColumnName(columnName);
    console.log(isValid);
    if(isValid) {
        const url = columnListUrl;
        var jsonBody = {
            name: columnName
        };
        const putMethod = {
            method: 'POST', 
            headers: {
                'Content-type': 'application/json; charset=UTF-8' 
            },
            body: JSON.stringify(jsonBody)
        }
        const res = await fetch(url, putMethod);
        if(res.status == '200') {
            window.location.reload();
        }
    } else {
        alert('Error: Duplicate Column Name!');
    }
};

async function validateColumnName(name) {
    const url = columnListUrl+'?name='+name;
    const res = await fetch(url);
    const json = await res.json();
    if (json.length > 0) {
        return false;
    }
    return true;
}

async function addCard(columnId) {
    let cname = 'card-new-'+columnId;
    const cardName = document.getElementById(cname).innerHTML;
    let isValid = await validateCardName(columnId, cardName);
    if(isValid) {
        let dname = 'description-new-'+columnId;
        const descriptionName = document.getElementById(dname).innerHTML;
        const url = cardListUrl;
        var jsonBody = {
            name: cardName,
            description: descriptionName,
            columnId : columnId
        };
        const putMethod = {
            method: 'POST', 
            headers: {
                'Content-type': 'application/json; charset=UTF-8' 
            },
            body: JSON.stringify(jsonBody)
        }
        const res = await fetch(url, putMethod);
        if(res.status == '200') {
            window.location.reload();
        }
    } else {
        alert('Error: Duplicate Card Name!');
    }
}

async function validateCardName(columnId, name) {
    const url = cardListUrl+'?name='+name+'&columnId='+columnId;
    const res = await fetch(url);
    const json = await res.json();
    console.log(json);
    if (json.length > 0) {
        return false;
    }
    return true;
}

async function fetchList() {
    // Column Start
    var currentUrl = document.URL;
    var query = currentUrl.split("?")[1];
    const res1 = await fetch(columnListUrl+'?'+query);
    const json1 = await res1.json();
    const main = document.querySelector('.column-list');
    json1.forEach(column => {
        const el = document.createElement('div');
        el.setAttribute('id', `col-${column.id}`);
        el.setAttribute('class', 'col-sm draggable');
        el.setAttribute('contenteditable', true);
        el.innerHTML = '<span id="column-'+`${column.id}`+'">'+`${column.name}`+'</span>';
        
        let uc = document.createElement('span');
        uc.setAttribute('id', `${column.id}`);
        uc.setAttribute('style', 'color:green; float:right;');
        uc.setAttribute('class', 'fa fa-check-circle-o');
        uc.onclick = function () {
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
        
        el.appendChild(uc);
        el.appendChild(rc);
        main.appendChild(el);
    })
    const el = document.createElement('div');
    el.setAttribute('class', 'col-sm draggable');
    el.setAttribute('contenteditable', true);
    el.innerHTML = '<span id="column-new">Add Column</span>';
    
    let addc = document.createElement('span');
    addc.setAttribute('style', 'color:green; float:right;');
    addc.setAttribute('class', 'fa fa-check-circle-o');
    addc.onclick = function () {
        addColumn();
    };
    el.appendChild(addc);
    main.appendChild(el);
    // Column End

    // Card Start
    const res2 = await fetch(cardListUrl+'?'+query);
    const json2 = await res2.json();
    
    // dynamic display for all cards and columns
    json2.forEach(card => {
        const sub = document.querySelector(`#col-${card.columnId}`);
        const el = document.createElement('div');
        el.setAttribute('class', 'card-list draggable');
        el.setAttribute('contenteditable', true);
        el.innerHTML = '<span id="card-'+`${card.id}`+'">'+`${card.name}`+'</span>';
        let accordion = document.createElement('span');
        accordion.setAttribute('id', `${card.id}`);
        accordion.setAttribute('style', 'color:green; float:right;');
        accordion.setAttribute('class', 'fa fa-arrow-down');
        accordion.setAttribute('data-toggle', 'collapse');
        accordion.setAttribute('data-target', `#description-${card.id}`);
        
        let uc = document.createElement('span');
        uc.setAttribute('id', `${card.id}`);
        uc.setAttribute('style', 'color:green; float:right;');
        uc.setAttribute('class', 'fa fa-check-circle-o');
        uc.onclick = function () {
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
        
        let cardDescription = `${card.description}`;
        let panel = document.createElement('div');
        panel.setAttribute('id', `description-${card.id}`);
        panel.setAttribute('class', 'collapse card-list');
        panel.setAttribute('contenteditable', true);
        if(cardDescription == '') {
            cardDescription = 'NA';
        }
        panel.innerHTML = cardDescription;

        el.appendChild(accordion);
        el.appendChild(uc);
        el.appendChild(rc);
        el.appendChild(panel);
        sub.appendChild(el);
    })
    // add new card
    json1.forEach(column => {
        const sub = document.querySelector(`#col-${column.id}`);
        const el = document.createElement('div');
        el.setAttribute('class', 'card-list draggable');
        el.setAttribute('contenteditable', true);
        el.innerHTML = `<span id="card-new-${column.id}">Add Card</span>`;
        
        let accordion = document.createElement('span');
        accordion.setAttribute('style', 'color:green; float:right;');
        accordion.setAttribute('class', 'fa fa-arrow-down');
        accordion.setAttribute('data-toggle', 'collapse');
        accordion.setAttribute('data-target', `#description-new-${column.id}`);
        
        let addc = document.createElement('span');
        addc.setAttribute('id', `${column.id}`);
        addc.setAttribute('style', 'color:green; float:right;');
        addc.setAttribute('class', 'fa fa-check-circle-o');
        addc.onclick = function () {
            addCard(this.id);
        };
        
        let cardDescription = 'Input Description';
        let panel = document.createElement('div');
        panel.setAttribute('id', `description-new-${column.id}`);
        panel.setAttribute('class', 'collapse card-list');
        panel.setAttribute('contenteditable', true);
        panel.innerHTML = cardDescription;

        el.appendChild(accordion);
        el.appendChild(addc);
        el.appendChild(panel);
        sub.appendChild(el);
    })
    // Card End
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