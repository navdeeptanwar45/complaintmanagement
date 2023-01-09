let addbtn = document.querySelector(".add-btn");
let removebtn = document.querySelector(".remove-btn");
let modalcont= document.querySelector(".modal-cont");
let maincont = document.querySelector(".main-cont");
let textareacont = document.querySelector(".textarea-cont");
let allprioritycolor = document.querySelectorAll(".priority-color");
 let toolboxcolors = document.querySelectorAll(".color");

let colors = [ "red","yellow","green","black"];
let modalprioritycolor = colors[colors.length-1];

let addflag = false;
let removeflag = false;
let lockclass = "fa-lock"
let unlockclass = "fa-lock-open"
let ticketarr = [];
if(localStorage.getItem("web-ticket")){
ticketarr = JSON.parse(localStorage.getItem("web-ticket"));
ticketarr.forEach((ticketobj)=>{
    createticket(ticketobj.ticketcolor,ticketobj.tickettask,ticketobj.ticketid);
})
}



for(let i =0;i<toolboxcolors.length;i++){
    toolboxcolors[i].addEventListener("click" , (e) => {
        let currenttoolboxcolor = toolboxcolors[i].classList[0];
        let filteredtickets = ticketarr.filter((ticketobj,idx)=>{
         return currenttoolboxcolor === ticketobj.ticketcolor;
         
        })
        let alltickets = document.querySelectorAll(".ticket-cont");
        for(let i =0;i<alltickets.length;i++){
       
            alltickets[i].remove();
        }
        filteredtickets.forEach((ticketobj,idx)=>{
          
            createticket(ticketobj.ticketcolor,ticketobj.tickettask,ticketobj.ticketid);
        }) 
       

    })
    toolboxcolors[i].addEventListener("dblclick",(e)=>{
        let alltickets = document.querySelectorAll(".ticket-cont");
        for(let i =0;i<alltickets.length;i++){
       
            alltickets[i].remove();
        }
        ticketarr.forEach((ticketobj,idx)=>{
      
            createticket(ticketobj.ticketcolor,ticketobj.tickettask,ticketobj.ticketid);
        }) 

    })
}

allprioritycolor.forEach((colorelem, idx) => {
colorelem.addEventListener("click" , (e) => {
    
    allprioritycolor.forEach((prioritycolorelem, idx) => {
        prioritycolorelem.classList.remove("border");
    })
    colorelem.classList.add("border");
    modalprioritycolor = colorelem.classList[0];
})
})

addbtn.addEventListener("click",(e)=>{
addflag = !addflag
if(addflag){
    modalcont.style.display ="flex";
}else{
   modalcont.style.display="none";
}
})

removebtn.addEventListener("click",(e)=>{
    removeflag = !removeflag;
   
    })
modalcont.addEventListener("keydown",(e)=>{
    let key =e.key;
    if(key === "Shift"){
        createticket(modalprioritycolor,textareacont.value);
        
        flag =false;
        setmodaltodefault();

    }
})
function createticket( ticketcolor,tickettask,ticketid){
    let id = ticketid||shortid();
let ticketcont = document.createElement("div");
ticketcont.setAttribute("class","ticket-cont");
ticketcont.innerHTML= 
` <div class="ticket-id"> #${id}</div>
<div class="ticket-color ${ticketcolor}"></div>
<div class="task-area"> ${tickettask}</div> 
<div class="ticket-lock">
        <i class="fa-solid fa-lock"></i>
    </div>`
;
  if(!ticketid){
  ticketarr.push({ticketcolor,tickettask,ticketid:id});
localStorage.setItem("web-ticket",JSON.stringify(ticketarr));
}
maincont.appendChild(ticketcont);
handleremoval(ticketcont,id);
handlelock(ticketcont,id);
handlecolor(ticketcont,id);
}
function handleremoval(ticket,id){
    ticket.addEventListener("click",(e)=>{
        let ticketidx = getticketid(id);
        ticketarr.splice(ticketidx,1);
        localStorage.setItem("web-ticket",JSON.stringify(ticketarr));

        if(removeflag) ticket.remove();
    })
   
}
function handlelock(ticket,id){
let ticketlockelem = ticket.querySelector(".ticket-lock");
let ticketlock = ticketlockelem.children[0];
let tickettaskarea = ticket.querySelector(".task-area")
ticketlock.addEventListener("click",(e) => {
    let ticketidx = getticketid(id);
    if(ticketlock.classList.contains(lockclass)){
ticketlock.classList.remove(lockclass);
ticketlock.classList.add(unlockclass);
tickettaskarea.setAttribute("contenteditable","true");
    }else{
        ticketlock.classList.remove(unlockclass);
        ticketlock.classList.add(lockclass);
        tickettaskarea.setAttribute("contenteditable","false");
    }
    
    ticketarr[ticketidx].tickettask = tickettaskarea.innerText;
    localStorage.setItem("web-ticket",JSON.stringify(ticketarr));
})
}
function handlecolor(ticket,id){
    let ticketidx = getticketid(id);
let ticketcolor = ticket.querySelector(".ticket-color");
ticketcolor.addEventListener("click",(e)=>{
    let currentticketcolor = ticketcolor.classList[1];
    let currentticketcoloridx = colors.findIndex((color)=>{
        return currentticketcolor === color;
    })
   
    currentticketcoloridx++;
    let newticketcoloridx = currentticketcoloridx%colors.length;
    let newticketcolor = colors[newticketcoloridx];
    ticketcolor.classList.remove(currentticketcolor);
    ticketcolor.classList.add(newticketcolor);
    ticketarr[ticketidx].ticketcolor=newticketcolor;
    localStorage.setItem("web-ticket",JSON.stringify(ticketarr));
})  
}
function setmodaltodefault(){
    modalcont.style.display="none";
    textareacont.value = "";
    modalprioritycolor = colors[colors.length-1];
    allprioritycolor.forEach((prioritycolorelem, idx) => {
        prioritycolorelem.classList.remove("border");
    })
    allprioritycolor[colors.length-1].classList.add("border");
            
}
function getticketid(id){
    let ticketidx = ticketarr.findIndex((ticketobj)=>{
return ticketobj.ticketid  === id;
    })  
    return ticketidx;
}