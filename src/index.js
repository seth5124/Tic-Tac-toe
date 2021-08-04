import * as game from './game.js';
import * as display from './display.js';
import * as AI from './AI.js';


/**
 * AI Handles the listener governing AI movements, and listens for the 'playerSwitch'
 * event.
 * 
 */
AI.initializeAI();
/**
 * Display handles all UI elements and click listeners
 */
display.initializeBoard();
display.initializePlayerDisplay();

/**
 * 'reset' event fires upon the game ending, or the reset button being pressed
 */
document.addEventListener('reset', ()=>{
    game.reset();
    display.updateBoard();
    display.resetActivePlayerMarker();
})