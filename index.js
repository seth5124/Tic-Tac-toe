import * as game from './game.js';
import * as display from './display.js';
import * as AI from './AI.js';

AI.initializeAI();
display.initializeBoard();
display.initializePlayerDisplay();


document.addEventListener('reset', ()=>{
    game.reset();
    display.updateBoard();
    display.resetActivePlayerMarker();
})