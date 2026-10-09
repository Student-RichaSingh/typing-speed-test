let passage = document.querySelector(".passage");
let desk_btn1 = document.querySelector(".Difficulty-desktop #easy-btn");
let desk_btn2 = document.querySelector(".Difficulty-desktop #med-btn");
let desk_btn3 = document.querySelector(".Difficulty-desktop #hard-btn");
let mob_default_btn=document.querySelector(".dropdown-btn-difficulty");
let dropdown_diff=document.querySelector(".Difficulty-mobile .dropdown-options");
let mob_btn1=document.querySelector(".dropdown-options #easy");
let mob_btn2=document.querySelector(".dropdown-options #medium");
let mob_btn3=document.querySelector(".dropdown-options #hard");
let desk_mode1=document.querySelector(".mode-desktop #timed-btn");
let desk_mode2=document.querySelector(".mode-desktop #passage-btn");
let timeid=document.querySelector(".Time #time");
let mob_default_btn_mode=document.querySelector(".dropdown-btn-mode");
let dropdown_mode=document.querySelector(".mode-mobile .dropdown-options ")
let mob_mode1=document.querySelector(".mode-mobile #timed");
let mob_mode2=document.querySelector(".mode-mobile #passage");
let input=document.querySelector("#typingInput");
let start=document.querySelector(".startbtn button");
let startbtn=document.querySelector(".startbtn");
let bestScore=document.querySelector(".bestScore #best-score");
let res =document.querySelector(".result");
let res_wpm=document.querySelector(".result-wpm #result-wpm");
let res_acc=document.querySelector(".result-accuracy #result-accuracy");
let res_characters=document.querySelector(".characters #result-characters");
let part1=document.querySelector(".stats-container-desktop");
let part2=document.querySelector(".start");
let hr=document.querySelector("#hr-line");

let correct=0;
let incorrect=0;
let currIdx=0;
    
let currentDifficulty="easy";

let mode ="timed";
//fetching the passage and returning the response as an object
let passageData;
let layout="";
function load_json() {
    return fetch("data.json").then(response => response.json()).then(data => {

        passageData = data;
        difficultySet(currentDifficulty);
    })
}
//generating random number
function generateRandom() {
    return Math.floor(Math.random() * 10);
}

//logic for different layouts
function updateLayout() {
    if (window.innerWidth >= 670 && window.innerWidth <= 1024) {
        //tab
        //desktop and tab difficulty is set only when fetching is successful
        layout="tab";
       
    }
    else if (window.innerWidth > 1024) {
        //desktop
        //desktop and tab difficulty is set only when fetching is successful
        layout="desk";
        
    }
    else {
        layout="mobile";
       
    }
     setLayout();
}


let testactive=false;



let temp_score=localStorage.getItem("wpm");
if(temp_score!=null){
    bestScore.textContent=`${temp_score}WPM`;
}

function setLayout(){

    if(layout==="desk"||layout==="tab"){

    load_json().then(desktop_difficulty);
        desk_mode();
        
}
else {
        //mobile
      /*  load_json().then(mobile_difficulty);
    mobile_mode();*/
    dropdown_mode.classList.remove("dropdown-show");
        start.addEventListener("click",()=>{
             passage.classList.remove("passage");
        startbtn.classList.add("startRemove");
        testactive=true;
            typing();
             startTimer();
        })
         
    }
   
    
}
//changing the passage as per the difficulty
let currPassage;
let curr;
function difficultySet(value) {
    passage.innerHTML = "";
    const rn = generateRandom();
    currPassage=passageData[value][rn].text;
    for(let i=0;i<currPassage.length;i++){
        let span=document.createElement("span");
        span.textContent=currPassage[i]
        passage.appendChild(span);
        if(i==0){
            span.classList.add("current");
        }
        
    }
    
    
}
//logic for desktop and tablet layout difficulty
function desktop_difficulty() {
    desk_btn1.addEventListener("click", function (e) {

        difficultySet("easy");
        currentDifficulty="easy";
    });
    desk_btn2.addEventListener("click", function (e) {

        difficultySet("medium");
        currentDifficulty="medium";
    });
    desk_btn3.addEventListener("click", function (e) {

        difficultySet("hard");
        currentDifficulty="hard";
    });

}

//logic for mobile layout difficulty
function mobile_difficulty(){
    mob_default_btn.addEventListener("click", ()=>{
        //using toggle so that on multiple clicks response is their in alternate version
       console.log("clicked");
        dropdown_diff.classList.toggle("dropdown-show");
       })
       mob_btn1.addEventListener("click",()=>{
         difficultySet("easy");
          currentDifficulty="easy";
         dropdown_diff.classList.remove("dropdown-show");
       });
       mob_btn2.addEventListener("click",()=>{
         difficultySet("medium");
         currentDifficulty="medium";
         dropdown_diff.classList.remove("dropdown-show");
       });
       mob_btn3.addEventListener("click",()=>{
         difficultySet("hard");
         currentDifficulty="hard";
         dropdown_diff.classList.remove("dropdown-show");
       });

    
}

//countdown timer for timed passage (60s)
let timeLeft=60;
const countTime60=function (){
    timeid.style.color="hsl(49, 85%, 70%)";
    timeLeft=60;
    const id=setInterval(()=>{
    if(timeLeft<=0){
        clearInterval(timer_id); 
        timeid.textContent=`0:00`;
        timeid.style.color="hsl(354, 63%, 57%)";
        testactive=false;
        afterTyping();
        
    }else{
        timeLeft--;
        if(timeLeft<10)
        timeid.textContent=`0:0${timeLeft}`;
        else
        timeid.textContent=`0:${timeLeft}`;
    }
},1000);
return id;
}
//countdown timer for timed passage unlimited
let min=0;
let sec=0;
const countTime=function (){
    min=0;
    sec=0;
    timeid.style.color="hsl(49, 85%, 70%)";
    const id=setInterval(()=>{
    if(sec==60){
        min++;
        sec=0;
        timeid.textContent=`${String(min).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;
        sec++;
        
           }
    else{
        
        timeid.textContent=`${String(min).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;
        sec++;
    }
},1000);
return id;
}

//clear timer in both cases clear timer through id on toggle or click events in updatelayout function

//logic for desktop and tab and moile layout timed mode
let timer_id;

function desk_mode(){
    desk_mode1.addEventListener("click",()=>{

        mode="timed";
       
    });
    desk_mode2.addEventListener("click",()=>{
        mode="passage";
       
    });
    
    
}
//logic for desk , tab and mobile layout passage mode
function mobile_mode(){
    mob_default_btn_mode.addEventListener("click",()=>{
        dropdown_mode.classList.toggle("dropdown-show");
    });
    mob_mode1.addEventListener("click",()=>{
        mode="timed";
       
    });
    
    
    mob_mode2.addEventListener("click",()=>{
        mode="passage";
       
    });
}

function startTimer(){
    clearInterval(timer_id);
    if(mode==="timed"){
        timer_id=countTime60();
    }
    else if(mode==="passage"){
        timer_id=countTime();
    }
}


let live_wpm=document.querySelector("#wpm");
let live_acc=document.querySelector("#accuracy");

//function to start typing
   function startTest() {
    passage.classList.remove("passage");
    startbtn.classList.add("startRemove");
    testactive = true;
    input.focus();
    startTimer();
}

//logic for typing
function typing(event){
    
     if (!testactive) return;
    let characters = passage.querySelectorAll("span");
    if (event.key === "Backspace") {
        if (currIdx > 0) {
            characters[currIdx]?.classList.remove("current");
            currIdx--;
            characters[currIdx].classList.add("current");
            if (characters[currIdx].classList.contains("correct")) {
                correct--;
            }
            characters[currIdx].classList.remove("correct");
            characters[currIdx].classList.remove("wrong");
        }
        return;
    }
    if (event.key.length > 1) return;
    if (currIdx >= currPassage.length) return;
    if (event.key === currPassage.charAt(currIdx)) {
        characters[currIdx].classList.remove("current");
        characters[currIdx].classList.add("correct");
        correct++;
        currIdx++;
        if (currIdx < currPassage.length) {
            characters[currIdx].classList.add("current");
        }
    } else {
        characters[currIdx].classList.remove("current");
        characters[currIdx].classList.add("wrong");
        currIdx++;
        if (currIdx < currPassage.length) {
            characters[currIdx].classList.add("current");
        }
        incorrect++;
    }
    wpm_handler();
    live_wpm.textContent = Math.round(wpm);
    accuracy_handler();
    live_acc.textContent = accuracy;
    // end test when last character is typed
    if (currIdx === currPassage.length) {
        clearInterval(timer_id);
        testactive = false;
        afterTyping();
    }
   }

let wpm=0;
let accuracy=0;
let retry=document.querySelector("#retry");

function accuracy_handler(){
    if(correct+incorrect===0){
        accuracy=0;
    }else{
        accuracy=Math.round((correct/(correct+incorrect))*100);
    }
    
}

function wpm_handler(){
    //handling wpm
    if(mode=="timed"){
        if(timeid.textContent==='0:00'){
            wpm=Math.round(correct/5);
        }else{
            let minelasped=( 60-parseInt(timeid.textContent.slice(2)))/60;

            wpm=Math.round((correct/5)/minelasped);
          
        }
        
    }
    else if(mode==="passage"){
        let min=0;
        const minsec=timeid.textContent.split(":");
        min=parseInt(minsec[0])+(parseInt(minsec[1])/60);
        wpm=correct/5;
        if(min!=0)
        wpm=Math.round(wpm/min);
    }
}
//logic after typing is done
function afterTyping(){

    //handling accuracy
    accuracy_handler();

     //handling wpm
    wpm_handler();
    
    if(localStorage.getItem("wpm")==null){
        localStorage.setItem("wpm",wpm);
        bestScore.textContent=`${wpm}WPM`;
        Baseline();
    }
    else{
         let temp_wpm=parseInt(localStorage.getItem("wpm"));
         if(temp_wpm<wpm){
        localStorage.setItem("wpm",wpm);
        bestScore.textContent=`${wpm}WPM`;
       
        HighScoreSmash();
    }else{
        result();
    }
    }
    
}
function Retry(){
 clearInterval(timer_id);
    bottomImg.innerHTML = "";
    passage.classList.add("passage");
    correct = 0;
    incorrect = 0;
    currIdx = 0;
    testactive = false;
    difficultySet(currentDifficulty);
    part1.classList.remove("forall");
    part2.classList.remove("forall");
    hr.classList.remove("forall");
    res.classList.remove("result-show");
    startbtn.classList.remove("startRemove");
    live_wpm.textContent = "0";
    live_acc.textContent = "100%";
    if (mode === "timed") {
        timeLeft = 60;
        timeid.textContent = "0:60";
    } else {
        min = 0;
        sec = 0;
        timeid.textContent = "00:00";
    }
    timeid.style.color = "hsl(0, 0%, 100%)";
}
 
    
function init() {
    // load data once
    load_json().then(() => {
        desktop_difficulty();
        mobile_difficulty();
        desk_mode();
        mobile_mode();
    });

    // personal best on refresh
    let temp_score = localStorage.getItem("wpm");
    if (temp_score != null) {
        bestScore.textContent = `${temp_score}WPM`;
    }

    // START — once
    start.addEventListener("click", startTest);

    // KEYDOWN — once
    input.addEventListener("keydown", typing);

    // GO AGAIN — once
    retry.addEventListener("click", Retry);

    // layout only 
    updateLayout();
    window.addEventListener("resize", updateLayout);
}

let res_img=document.querySelector("#result-img");
//logic for result window
function result(){
    res_wpm.textContent=wpm;
    res_acc.textContent=accuracy;
    let res_char=`<span style="color: green;">${correct}</span>/<span style="color: red;">${incorrect}</span>`;
    res_characters.innerHTML=res_char;
    res_img.src="./assets/images/icon-completed.svg";
    part1.classList.add("forall");
    part2.classList.add("forall");
    hr.classList.add("forall");
    res.classList.add("result-show");
    res_msg_bold.textContent="Test Complete!";
    res_msg.textContent="Solid run. Keep pushing to beat your high score."
}

let bottomImg=document.querySelector(".bottom-img");
let res_msg_bold=document.querySelector("#result-msg-bold");
let res_msg=document.querySelector("#result-msg");

function HighScoreSmash(){
     res_wpm.textContent=wpm;
    res_acc.textContent=accuracy;
     let res_char=`<span style="color: green;">${correct}</span>/<span style="color: red;">${incorrect}</span>`;
    res_characters.innerHTML=res_char;
    res_img.src="./assets/images/icon-new-pb.svg";
     part1.classList.add("forall");
    part2.classList.add("forall");
    hr.classList.add("forall");
    res.classList.add("result-show");
    let bottom_img=document.createElement('img');
    bottom_img.src="./assets/images/pattern-confetti.svg";
    bottomImg.append(bottom_img);
    res_msg_bold.textContent="High Score Smashed!";
    res_msg.textContent="You're getting faster. That was incredible typing.";

}
function Baseline(){
     res_wpm.textContent=wpm;
    res_acc.textContent=accuracy;
     let res_char=`<span style="color: green;">${correct}</span>/<span style="color: red;">${incorrect}</span>`;
     res_characters.innerHTML=res_char;
     part1.classList.add("forall");
    part2.classList.add("forall");
    hr.classList.add("forall");
    res.classList.add("result-show");
    res_msg_bold.textContent="Baseline Established!";
    res_msg.textContent="You've set the bar.Now the real challenge begins-time to beat it."
}

init();