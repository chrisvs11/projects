const memoryGrid = document.querySelector(".memoryGrid")
const startButton = document.querySelector("button")
const timer = document.querySelector("output")
const moves = document.querySelector("output[name=moves]")
const restartButton = document.querySelector("button.restart-game")
let movesVar = 0;
let imageMemoryMatrix = shuffleArray([0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9])
let firstDraw,secondDraw
let isFirstDraw = false
const totalPairs = (imageMemoryMatrix.length)/2-1
let pairsDone = 0



var ImageDic = {
    0: "https://foursouls.com/wp-content/uploads/2022/01/b2-isaac-308x420.png",
    1:"https://foursouls.com/wp-content/uploads/2022/01/b2-maggy-308x420.png",
    2:"https://foursouls.com/wp-content/uploads/2022/01/b2-cain-308x420.png",
    3:"https://foursouls.com/wp-content/uploads/2022/01/b2-judas-308x420.png",
    4:"https://foursouls.com/wp-content/uploads/2022/01/b2-mom-308x420.png",
    5:"https://foursouls.com/wp-content/uploads/2022/01/b2-blue_baby-308x420.png",
    6:"https://foursouls.com/wp-content/uploads/2022/01/b2-eve-308x420.png",
    7:"https://foursouls.com/wp-content/uploads/2022/01/b2-samson-308x420.png",
    8:"https://foursouls.com/wp-content/uploads/2022/01/b2-lazarus-308x420.png",
    9:"https://foursouls.com/wp-content/uploads/2022/01/b2-lilith-308x420.png"

}

loadPreviousState()


//Event Listeners
startButton.addEventListener("click",startGame)
restartButton.addEventListener("click",refreshPage)

function startGame() {
    
    startButton.removeEventListener("click",startGame)

    //Create matrix
    for(let i = 0; i < imageMemoryMatrix.length; i++){
        const cardElement = document.createElement("div")
        const imageElement = document.createElement("img")
        imageElement.src = "https://foursouls.com/wp-content/uploads/2021/10/CharacterCardBack-308x420.png"
        imageElement.alt ="Image"
        imageElement.value="1"
        cardElement.classList.add("memoryCard")
        cardElement.appendChild(imageElement)
        cardElement.addEventListener("click", function () {
            turnOver(this)
        })

        memoryGrid.appendChild(cardElement)
    }

    startTimer()   
  
}

function startTimer () {
    let sec = 0;
    let min = 0;
    
    setInterval(() => {
        if(sec===60){
            min++
            sec = 0
        }
        if(min < 10){
            if(sec < 10){
                timer.innerHTML = `0${min}:0${sec}`
            } else{
                timer.innerHTML = `0${min}:${sec}`
            }  
        } else {
            if(sec < 10){
                timer.innerHTML = `${min}:0${sec}`
            } else{
                timer.innerHTML = `${min}:${sec}`
            }  
        }
        
        sec++
    }, 1000)
}

function turnOver(cardElement){
    
    const imageElement = cardElement.querySelector("img")
    imageElement.src = ImageDic[imageMemoryMatrix[getElementIndex(cardElement)]]
    MatchVerification(cardElement)

}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function getElementIndex(cardElement){
    let children = memoryGrid.children
    // console.log(cardElement)
    for(let i = 0; i < children.length; i++ ){
        if(children[i]===cardElement){
            return i
            
        }
    }
   
}

async function MatchVerification(cardElement){

    if(!isFirstDraw){
        // console.log("first draw saved")
        firstDraw = cardElement
        isFirstDraw = true
        return this
    }

    if(getElementIndex(cardElement) === getElementIndex(firstDraw)){
        console.error("Cannot choose same card")
        return this
    }
    secondDraw = cardElement
    movesVar++
    moves.textContent = movesVar

    const firstImage = firstDraw.querySelector("img").src
    const secondImage = secondDraw.querySelector("img").src

    if(secondImage === firstImage){
        if(!mommyLovesYou()){
            const audio1 = new Audio("https://static.wikia.nocookie.net/bindingofisaacre_gamepedia/images/b/bc/Dogma_angel_transform_end.wav/revision/latest?cb=20210505074536")
            audio1.play()
            isFirstDraw = false
            let tempClone = firstDraw.cloneNode(true)
            memoryGrid.replaceChild(tempClone,memoryGrid.children[getElementIndex(firstDraw)])
            tempClone = secondDraw.cloneNode(true)
            memoryGrid.replaceChild(tempClone,memoryGrid.children[getElementIndex(secondDraw)])
            endOfGame()
        }
    }else{
        const audio2 = new Audio("https://static.wikia.nocookie.net/bindingofisaacre_gamepedia/images/4/4e/Derp_0.wav/revision/latest?cb=20210512200240")
        audio2.play()
        isFirstDraw = false
        console.log("No Match")
        disableEventsClick()
        await unFlip()
        
    }
}

function unFlip()  {
    return new Promise((resolve,reject)=> {
        setTimeout(() => {
            firstDraw.querySelector("img").src = "https://foursouls.com/wp-content/uploads/2021/10/CharacterCardBack-308x420.png"
            secondDraw.querySelector("img").src = "https://foursouls.com/wp-content/uploads/2021/10/CharacterCardBack-308x420.png"
            enableEventsClick()
            resolve(console.log("Fliped"))
            reject()
        },500)
    })
}

function enableEventsClick(){
    const memoryCards=memoryGrid.querySelectorAll(".memoryCard")
    memoryCards.forEach(card => card.classList.remove("disable"))
  
 }

 function disableEventsClick(){
    const memoryCards=memoryGrid.querySelectorAll(".memoryCard")
    memoryCards.forEach(card => card.classList.add("disable"))
 }

 function refreshPage() {
    window.location.reload()
 }

 function endOfGame() {
    pairsDone++
    console.log(pairsDone,totalPairs)
    
    if(pairsDone === totalPairs){
        saveGameState()
        refreshPage()
    }
 }

 function mommyLovesYou() {
    const img = firstDraw.querySelector("img")
    if(img.src === "https://foursouls.com/wp-content/uploads/2022/01/b2-mom-308x420.png"){
        console.log("mommy loves you")
        let audio = new Audio("https://static.wikia.nocookie.net/bindingofisaacre_gamepedia/images/3/38/Mom_Evil_laugh.wav/revision/latest?cb=20210504233604")
        audio.play()
        for(let i = 0; i < memoryGrid.children.length;i++){
            const myChildren = memoryGrid.children[i]
            myChildren.querySelector("img").src = "https://foursouls.com/wp-content/uploads/2022/01/b2-mom-308x420.png"
            disableEventsClick()
            saveGameState()
            setTimeout(refreshPage,5000)
            
        }

        return true
    }
    return false
 }

 function saveGameState(){
    sessionStorage.setItem("moves",movesVar)
    sessionStorage.setItem("time",timer.innerHTML)
 }

 function loadPreviousState() {
    if(sessionStorage.getItem("time")){
        timer.innerHTML = sessionStorage.getItem("time")
        moves.innerHTML = sessionStorage.getItem("moves")
    }
   
 }