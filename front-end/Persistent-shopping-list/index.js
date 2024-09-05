const addIdemButton = document.querySelector("button.addItem")
const shoppingList =  document.querySelector("div ul")
const inputItem = document.querySelector("input#shopItem")
const deleteButton = document.querySelector("button.deleteHistory")
const loadButton = document.querySelector("button.loadHistory")


function addItemToList() {
    if(inputItem.value){

        const deleteButton = document.createElement("button")
        deleteButton.textContent = "Delete"
        deleteButton.classList.add("delete")
        deleteButton.addEventListener("click", function () {
            deleteItem(this)
        })
        const listItem = document.createElement("li")
        listItem.textContent = inputItem.value
        listItem.addEventListener("click", function() {
            purchaseOrder(this)
        } )

        listItem.appendChild(deleteButton)
        shoppingList.appendChild(listItem)
        inputItem.value = ""
        saveState ()
    }
  
}

function purchaseOrder (listElement) {
    listElement.classList.add("purchase")
    saveState ()
}


function saveState () {
    localStorage.setItem("shoppingList",shoppingList.innerHTML)
}

function loadState () {
    shoppingList.innerHTML = localStorage.getItem("shoppingList")
    const rows = shoppingList.querySelectorAll("li")
    rows.forEach( row => {
        row.addEventListener("click", function() {
            purchaseOrder(this)
        })
        const button = row.querySelector("button")
        button.addEventListener("click",function () {
            deleteItem(this)
        })
    })
}

function deleteHistory () {
    localStorage.removeItem("shoppingList")
}

function deleteItem(itemElement) {
    shoppingList.removeChild(itemElement.parentElement)
}

addIdemButton.addEventListener("click",addItemToList)
deleteButton.addEventListener("click",deleteHistory)
loadButton.addEventListener("click",loadState)
