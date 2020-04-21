window.addEventListener('load', () => {
    fetchList();
})

function removeColumn(data) {
    console.log(data);
};

async function fetchList() {
    const columnListUrl = "http://localhost:3000/columns";
    const res1 = await fetch(columnListUrl);
    const json1 = await res1.json();
    const main = document.querySelector('#column-list');
    json1.forEach(column => {
        const el = document.createElement('td');
        el.setAttribute('class', 'pt-3-half');
        el.setAttribute('contenteditable', true);
        el.textContent = `${column.name}`;
        const rc = document.createElement('span');
        rc.setAttribute('id', `${column.id}`);
        rc.setAttribute('style', 'color:red;');
        rc.textContent = ' X';
        rc.onclick = function () {
            removeColumn(this.id);
        };
        el.appendChild(rc);
        main.appendChild(el);
    })

    const cardListUrl = "http://localhost:3000/cards";
    const res2 = await fetch(cardListUrl);
    const json2 = await res2.json();
    const sub = document.querySelector('#card-list');
    json2.forEach(card => {
        console.log(card.name);
        const el = document.createElement('td');
        el.setAttribute('class', 'pt-3-half');
        el.setAttribute('contenteditable', true);
        el.textContent = `${card.name}`;
        sub.appendChild(el);
    })
}

