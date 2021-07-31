import * as game from './game.js';
import * as display from './display.js';
import * as AI from './AI.js';
//TODO: Fix extra move bug
AI.initializeAI();
display.initializeBoard();
display.initializePlayerDisplay();


document.addEventListener('reset', ()=>{
    game.reset();
    display.updateBoard();
})


