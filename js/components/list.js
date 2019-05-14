import { LitElement, html, css } from 'lit-element';

export default class List extends LitElement {
    constructor(){
        super();
        this.content = "";
        this.list = [];
    }
    
    static get properties(){
        return{
        content: { type: String },
        list: {type: Array}
        }
    }

    static get styles() {
        return css`
        body {
        margin: 0;
        min-width: 250px;
        }

        /* Include the padding and border in an element's total width and height */
        * {
        box-sizing: border-box;
        }

        /* Remove margins and padding from the list */
        ul {
        margin: 0;
        padding: 0;
        }

        /* Style the list items */
        ul li {
        cursor: pointer;
        position: relative;
        padding: 12px 8px 12px 40px;
        list-style-type: none;
        background: #eee;
        font-size: 18px;
        transition: 0.2s;
  
        /* make the list items unselectable */
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        }

        /* Set all odd list items to a different color (zebra-stripes) */
        ul li:nth-child(odd) {
        background: #f9f9f9;
        }

        /* Darker background-color on hover */
        ul li:hover {
        background: #ddd;
        }

        /* When clicked on, add a background color and strike out text */
        ul li.checked {
        background: #252;
        color: #fff;
        text-decoration: line-through;
        }

        /* Add a "checked" mark when clicked on */
        ul li.checked::before {
        content: '';
        position: absolute;
        border-color: #fff;
        border-style: solid;
        border-width: 0 2px 2px 0;
        top: 10px;
        left: 16px;
        transform: rotate(45deg);
        height: 15px;
        width: 7px;
        }

        /* Style the close button */
        .close {
        position: absolute;
        right: 0;
        top: 0;
        padding: 12px 16px 12px 16px;
        }

        .close:hover {
        background-color: #f44336;
        color: white;
        }

        /* Style the header */
        .header {
        background-color: #f44336;
        padding: 30px 40px;
        color: white;
        text-align: center;
        }

        /* Clear floats after the header */
        .header:after {
        content: "";
        display: table;
        clear: both;
        }

        /* Style the input */
        input {
        margin: 0;
        border: none;
        border-radius: 0;
        width: 75%;
        padding: 10px;
        float: left;
        font-size: 16px;
        }

        /* Style the "Add" button */
        .addBtn {
        padding: 10px;
        width: 25%;
        background: #d9d9d9;
        color: #555;
        float: left;
        text-align: center;
        font-size: 16px;
        cursor: pointer;
        transition: 0.3s;
        border-radius: 0;
        }

        .addBtn:hover {
        background-color: #bbb;
        }
        `;
    }

    updateContent(e) {
            this.content = e.target.value;
        }
    updateListStatus(updatedList, complete){
        this.list = this.list.map(content => 
            updatedList === content ? { 
                ... updatedList, complete
            } : content );
    }
    addContent(){
        if(this.content){
            this.list = [ 
                ... this.list,
                {
                    content: this.content,
                    complete: false
                }
            ];
        this.addItem = list => {
                fetch('http://localhost:3000/list', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(list)
                })
                .then(res => res.json())
                .then(json => {
                    list.push(json);
                    render(list);
                })
            }
            localStorage.setItem('content',this.content);
            this.content = '';
        }
    }
    listnerKey(e){
        if(e.key === 'Enter') {
            this.addContent();
        }
    }
    removeContent(e, index) {
        this.content = [ ... this.list.splice(0, index)], [ ... this.list.splice(index + 1)];
        this.requestUpdate('list');
        this.removeItem = id => {
            fetch(`http://localhost:3000/todolist/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(res => res.json())
            .then(json => {
                todoList = todoList.filter(item => item.id !== id);
                render(todoList);
            })
        }
        localStorage.removeItem('content');

    }
    clearCompleted() { 
        this.list = this.list.filter(item => !item.complete);
    }
    

render() {
    return html`
    <div id="myDIV" class="header" @keyup="${this.listnerKey}">
    <h2 style="margin:5px">My To Do List</h2>
    <input type="text" id="myInput" placeholder="TASK" aria-label="entryText" value="${this.content}" @change="${this.updateContent}">
    <span @click="${this.addContent}" class="addBtn" id="addBtn">Add</span>
    </div>
    <div class="list">
    ${this.list.map(item => html`
    <div class = content-item">
    <input type="checkbox" class="item" id="item" ?checked="${item.complete}" @change="${e=> this.updateListStatus(item, e.target.checked)}">
    <label for="item">${item.content}</label>
    <button @click="${this.removeContent}">x</button>
    </div>   
    `)}
    </div>
    `;
}
}
customElements.define('app-list', List);

