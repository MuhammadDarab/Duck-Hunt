const socket = io('ws://192.168.10.10:8080'); //ADD YOUR IP HERE.

//-------- DOM Manipulators ----------//

let duck = document.createElement('div');
let gun = document.querySelector('.gun');
let gun2 = document.querySelector('.gun2');
let bullet = document.createElement('section');
let healthBar = document.createElement('nav');


document.body.append(duck);
duck.style.position = 'absolute';

document.body.append(healthBar);
healthBar.style.position = 'absolute';

// -------- Variables -------- //

let pointerX = -1;
let pointerY = -1;

let xVal;
let yVal;

let Dmg = 100;

//------------- Sounds -------------//

let fly = new Audio();
    fly.src = "sounds/Fly1.mp3";
    fly.autoplay = true;
    fly.load();

let shot = new Audio();
    shot.src = "sounds/shot.mp3";
    shot.load();

let soundStart = setInterval(() => fly.play() , 0);

//---------------- Duck Miss ---------------//

document.addEventListener('mousedown', () => {

    socket.emit('missed', 'sending to server');

});

socket.on('missed', (uniqueIDFire) => {

    if(uniqueIDFire === 1)
    {  
        shot.play();
        gun.src = "/app/images/shoot.gif";
        shot.currentTime = 0;

    }
    else if(uniqueIDFire === 2)
    {
        shot.play();
        gun2.src = "/app/images/shoot2.gif";
        shot.currentTime = 0;

    }
    console.log('User',uniqueIDFire,'shot');

});

//------------------ Duck Hit -----------------//

duck.addEventListener('click', () => {

    socket.emit('hit', 'sending to server');

});

socket.on('hit', (uniqueIDHit) => {

if(uniqueIDHit === 1){
    Dmg -= 5;
    console.log('health is ' + Dmg);

    if(Dmg > 0)
    {
    Miss();
    }

    else if(Dmg == 0)
    Shot();

    console.log("User 1 Killed the duck!");
    
}

if(uniqueIDHit === 2){
    
    Dmg -= 5;
    
    console.log('health is ' + Dmg);
    
    if(Dmg > 0)
    {
        Miss();
    }
    
    else if(Dmg == 0)
    Shot();
    
    console.log("User 2 Killed the duck!");

}

});

//------------ Get Crosshair Loaction ---------//

document.onmousemove = function (event) {
    
    let pointerX = event.pageX;
    let pointerY = event.pageY;

    socket.emit('cursor', pointerX, pointerY);

}

socket.on('cursor', (...text) => {

    let [ID, xpos, ypos] = text;

    console.log(ID);

    if(ID === 1){
        
        let xVal = ((xpos)/32) + 45;
        let yVal = ((ypos)/32) + 45;

        gun.style.position = 'absolute';
        gun.style.top =  yVal + '%';
        gun.style.left = xVal + '%';
    }

    else{
  
        let xVal = ((xpos)/32) - 45;
        let yVal = ((ypos)/32) + 45;
    
        gun2.style.position = 'absolute';
        gun2.style.top =  yVal + '%';
        gun2.style.left = xVal + '%';

    }

});

//------------- Duck Move Logic -----------//

    let lastTop = 0;
    let lastLeft = 0;

let gameStart = setInterval(() => {

    socket.emit('movements', 'Duck Pos Required');

    socket.on('movements', (...positons) => {

        let [value2, value1] = positons;

        duck.style.transition = '0s';
        duck.style.removeProperty = ('transition');
        duck.style.transition = '0s';
    
        healthBar.style.transition = '0s';
        healthBar.style.removeProperty = ('transition');
        healthBar.style.transition = '0s';
    
        //duck left-right logic
    
        if(lastLeft < value2)
        {
            duck.style.backgroundImage = "url('images/duckTopRight.gif')";
        }
        else{
            
            duck.style.backgroundImage = "url('images/duckTopLeft.gif')";
        }
    
        setTimeout( () => {
    
            duck.style.transitionTimingFunction = "linear";
            duck.style.transition = '1s';
    
            healthBar.style.transitionTimingFunction = "linear";
            healthBar.style.transition = '1s';
    
            duck.style.top = value1 + 'px';
            duck.style.left = value2 + 'px';
    
            healthBar.style.top = value1 - 15 + 'px';
            healthBar.style.left = value2 + 30 + 'px';
    
            lastTop = value1; 
            lastLeft = value2;
    
        } ,200);
    
    
        setTimeout(() => {
    
            duck.style.transition = '0s';
    
        },800);
    

    });

    // let value1 = randomNum(500);
    // let value2 = randomNum(1500);

}, 800);

function Shot() {

        clearInterval(gameStart);
        clearInterval(soundStart);
        
        fly.pause();
        fly.currentTime = 0;

        shot.play();
        
        socket.emit('dead', 'bird is dead!');


}

socket.on('dead', () => {

    healthBar.style.width = '0px';
    gun.src = "/app/images/shoot.gif";

    duck.style.transition = "0s";
    duck.style.backgroundImage = "url('images/duckShot.png')";

    setTimeout(() => {

        duck.style.transition = ".5s";
        duck.style.top = "600px";
        duck.style.backgroundImage = "url('images/duckDed.png')";
        
    }, 1500);

})

function Miss() {

    shot.play();
    gun.src = "/app/images/shoot.gif";

    shot.currentTime = 0;

    //--------- Health Bar ----------//
    
    healthBar.style.width = (Dmg) + 'px';


    document.body.append(bullet);

    bullet.style.left = pointerX + 'px';
    bullet.style.top = pointerY + 'px';

    setTimeout(() => {
    bullet.style.width = "0px";
    bullet.style.left = (pointerX - 50) + 'px';
    bullet.style.top = (pointerY - 50) + 'px'; 

    bullet.style.height = "0px";
    },0);


    // console.log(bullet.style.top);
    // console.log(bullet.style.left);

}

