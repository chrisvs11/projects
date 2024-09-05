const favoriteTableBody = document.querySelector("table tbody")
const form = document.querySelector("form")
const addButton = document.querySelector("form input#submit")
const saveButton = document.querySelector("button#saveList")
const loadButton = document.querySelector("button#loadList")

// console.log(inputBookTitle,addButton,saveButton)


form.addEventListener("submit", function(event) {
    event.preventDefault()
    //Get Form Info
    const inputBookTitle = document.querySelector("input#title")
    const inputBookAuthor = document.querySelector("input#author")
    const inputBookIsbn = document.querySelector("input#isbn")
    const deleteButton = document.createElement("button")
    
    //Create Delete Button
    deleteButton.textContent = "Delete"
    deleteButton.classList.add("delete-button")
    deleteButton.addEventListener("click", function () {
        favoriteTableBody.removeChild(row)
    })
    const buttonCell = document.createElement("td")
    buttonCell.appendChild(deleteButton)
 

    //Fill Table
    const authorInformation = [inputBookTitle.value,inputBookAuthor.value,inputBookIsbn.value]
    const row = document.createElement("tr")
    authorInformation.forEach(data => {
        const cellData = document.createElement("td")
            cellData.textContent = data
            row.appendChild(cellData)
        
    })
    
    row.appendChild(buttonCell)
    favoriteTableBody.appendChild(row)
    

})

function saveFavoriteList() {
    const tableHTML = document.querySelector("table tbody").innerHTML
    localStorage.setItem("user",tableHTML)
    sessionStorage.setItem("user",tableHTML)

    const cookie_name = "user_favorite_books";
    const cookie_value = tableHTML;
    const cookie_expires = new Date(new Date().getTime() + 3600000).toUTCString();

    document.cookie = cookie_name + "=" + cookie_value + ";" + " expires=" + cookie_expires + "; path=/";
}
loadButton.addEventListener("click", loadList);

function loadList() {
   const savedBooksHTML = localStorage.getItem("user")
   favoriteTableBody.innerHTML = savedBooksHTML
   let rows = favoriteTableBody.querySelectorAll("tr")
   console.log(rows[0].childNodes[3].querySelector("button"))
   rows.forEach ( row => {
        row.childNodes[3].querySelector("button").addEventListener("click", function() {
            favoriteTableBody.removeChild(row)
        })
  })  
}

saveButton.addEventListener("click", saveFavoriteList)
loadButton.addEventListener("click",loadList)

