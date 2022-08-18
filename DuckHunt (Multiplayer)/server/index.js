const http = require('http').createServer();

const io = require('socket.io')(http, {
    cors: { origin : "*" }
});

let idStore = [];
let uniqueStrMoveCheck = 'o';
let uniqueStrFireCheck = 'o';
let uniqueStrHitCheck = 'o';
let uniqueIDMove = 3;
let uniqueIDFire = 3;
let uniqueIDHit = 3;
let cb = 0;

    io.on('connection', socket => {

        console.log('A User Connected!');

        //--------------------------------------------------------//

        socket.on('movements', () => {

            let valueX = Math.trunc(Math.random() * 1500);
            let valueY = Math.trunc(Math.random() * 500);
        
            io.emit("movements", valueX, valueY);

        })
        
        //--------------------------------------------------------//

        socket.on('cursor', (...message) => {
    
            let [prX, prY] = message;
    
            uniqueStrMoveCheck = socket.id.substr(0,2);
    
            for(let i = 0; i < 2; i++)
            {
                if(idStore[i] === uniqueStrMoveCheck){
                    uniqueIDMove = i+1;
                    break;
                }
    
                else if(idStore[i] !== uniqueStrMoveCheck){
                
                    cb++;
                    if (cb === 2){
                        idStore.push(uniqueStrMoveCheck);  
                        cb = 0; 
                    }
                }
            }
    
            io.emit("cursor", uniqueIDMove, prX, prY);
    
        });
        idStore = [];

        socket.on('missed', () => {

            uniqueStrFireCheck = socket.id.substr(0,2);
    
            for(let i = 0; i < 2; i++)
            {
                if(idStore[i] === uniqueStrFireCheck){
                    uniqueIDFire = i+1;
                    break;
                }
    
                else if(idStore[i] !== uniqueStrFireCheck){
                
                    cb++;
                    if (cb === 2){
                        idStore.push(uniqueStrFireCheck);  
                        cb = 0; 
                    }
                }
            }
    
            
            io.emit("missed", uniqueIDFire);


        });
        idStore = [];

        socket.on('hit', () => {

            uniqueStrHitCheck = socket.id.substr(0,2);
    
            for(let i = 0; i < 2; i++)
            {
                if(idStore[i] === uniqueStrHitCheck){
                    uniqueIDHit = i+1;
                    break;
                }
    
                else if(idStore[i] !== uniqueStrHitCheck){
                
                    cb++;
                    if (cb === 2){
                        idStore.push(uniqueStrHitCheck);  
                        cb = 0; 
                    }
                }
            }

            io.emit("hit", uniqueIDHit);

        });
        idStore = [];

        socket.on('dead', () => {

            io.emit('dead', 'Run Dead Animns!');

        })
        
    });

http.listen(8080, () => console.log('listening on http://localhost:8080 ') );
