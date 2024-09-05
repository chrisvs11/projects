const colorOptionSelect = document.querySelector("select#color")
const fontOptionSelect = document.querySelector("select#font")
console.log(colorOptionSelect.value)
const saveButton = document.querySelector("button") 

preferenceStyle()

function preferenceStyle(){
    const bodyHTML = document.querySelector("body")
    const preferColor = localStorage.getItem("color")
    const preferFont = localStorage.getItem("font")

    //Initial Conditions
   
   


    
    if(preferColor){
        bodyHTML.style.backgroundColor = localStorage.getItem("color")
    } else {
        bodyHTML.style.backgroundColor = "white"
    }
    if(preferFont){
        bodyHTML.style.fontFamily = localStorage.getItem("font")
    }else {
        bodyHTML.style.fontFamily = "Arial"
    }
    
    

}

function savePreferences() {

    localStorage.setItem("font",fontOptionSelect.value)
    localStorage.setItem("color",colorOptionSelect.value)

    preferenceStyle()
}

saveButton.addEventListener("click",savePreferences)