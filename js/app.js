import List  from '/js/components/list.js';
import checkConnectivity from '/js/connection.js';
import { openDB } from '/node_modules/idb/build/esm/index.js';



(async function(document) {
const app = document.querySelector('#app');
const skeleton = app.querySelector('.skeleton');
const listPage = app.querySelector('[page=list]');
skeleton.removeAttribute('active');
listPage.setAttribute('active', '');
listPage.removeAttribute('active');

checkConnectivity();
document.addEventListener('connection-changed', ({detail}) => {
    console.log(detail);
});

try {
    //const data = await fetch('http://localhost:3000/list');
    const data = await fetch('data/db.json');
    const json = await data.json();

const database = await openDB('app-store', 1,{
    upgrade(db) {
        db.createObjectStore('list');
    }
});
if(navigator.onLine){
    await database.put('list', json, 'list');
    var button = document.querySelector("#addBtn");
    console.log(button)
    button.addEventListener("click", function(e){
        json.push({content:document.querySelector("#item").value, done:false});
        fetch('data/db.json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({content:document.querySelector("#item").value, done:false})
        })
    });
}

const list = await database.get('list', 'list');
        return html`<div class="list">
        ${this.list.map(item => html`
        <div class = content-item">
        <input type="checkbox" id="item" ?checked="${item.complete}" onchange="${e=> this.updateListStatus(item, e.target.checked)}" value="${item.content}">
        <button onclick="${this.removeContent}">x</button>
        </div>   
        `)}
        </div>`
} catch(error) {
    console.error(error);
}



})(document);