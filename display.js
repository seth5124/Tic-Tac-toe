import * as board from './board.js';
import * as game from './game.js';
//TODO: Set alert to player name instead of letter
//TODO: add name property to players, add functionality to set name
//TODO: Possibly add a congratulatory message upon winning



// window.onload = () => {
//   displayController.initializeBoard();
//   displayController.initializePlayerDisplay();
//   game.initializeGame();
// };
/**
 * Handles all display elements
 */

  let squares = [];
  let playerDisplays = [];

  /**
   *
   * @param {String} letter Letter to retrieve a matching SVG for. Either X or O
   * @returns {Node} an img element containing the SVG image of the reqested letter
   */
  const getLetterSVG = (letter) => {
    let xSrc = "assets/x.svg";
    let oSrc = "assets/o.svg";

    let letterImg = document.createElement("img");
    letterImg.setAttribute("src", letter == "X" ? xSrc : oSrc);
    return letterImg;
  };

  /**
   * Initializes the UI board, and grabs all necessary DOM elements to do so.
   */
  export function initializeBoard(){
    const boardDiv = document.getElementById("board");
    const squareDivs = boardDiv.getElementsByTagName("div");
    squares = Array.prototype.slice.call(squareDivs, 0); //Takes an  HTML collection and converts to Array

    //Assigns a row and column attribute for each UI square 
    let squareIndex = 0;
    for (let row = 0; row < board.getRows().length; row++) {
      for (let col = 0; col < board.getRows()[row].length; col++) {
        squares[squareIndex].setAttribute("row", row);
        squares[squareIndex].setAttribute("column", col);
        squareIndex++;
      }
    }
    //adds event listeners to each square to fire inputSquare 
    squares.forEach((square) => {
      square.addEventListener("click", () => {
        inputSquare(square);
      });
    });
    //Adds listener to reset button to reset the game
    const resetButton = document.getElementById("resetButton");
    resetButton.addEventListener("click", () => {
      game.reset();
      board.resetBoard();
      updateBoard();
    });
  };

  /**
   * Sets active player marker back to the first player
   */
  export function resetActivePlayerMarker(){
    playerDisplays.forEach((display) => {
      if (
        display.sideMarker.getElementsByTagName("h1")[0].innerHTML ==
        game.getActivePlayer().side
      ) {
        display.sideMarker.classList.add("activeSide");
      } else {
        display.sideMarker.classList.remove("activeSide");
      }
    });
  };
  /**
   * Initializes all player management functions
   * Including name displays, name edits, active player display, and AI toggling
   */
  export function initializePlayerDisplay(){
    //Grabbing UI elements from each player display
    let firstPlayerDisplay = {
      player: game.getFirstPlayer(),
      box: document.getElementById("player1Box"),
      dropdownButton: document.getElementById('player1Dots'),
      dropdown: document.getElementById('player1Dropdown'),
      editButton: document.getElementById("player1Edit"),
      nameLabel: player1Box.getElementsByTagName("h1")[0],
      sideMarker: document.getElementById("sideMarkerTop"),
      AIToggle: document.getElementById("aiToggle1"),
    };
    let secondPlayerDisplay = {
      player: game.getSecondPlayer(),
      box: document.getElementById("player2Box"),
      dropdownButton: document.getElementById('player2Dots'),
      dropdown: document.getElementById('player2Dropdown'),
      editButton: document.getElementById('player2Edit'),
      nameLabel: player2Box.getElementsByTagName("h1")[0],
      sideMarker: document.getElementById("sideMarkerBottom"),
      AIToggle: document.getElementById("aiToggle2"),
    };
    playerDisplays = [firstPlayerDisplay, secondPlayerDisplay];

    //Handles AI Toggling
    playerDisplays.forEach((display) => {
      display.AIToggle.addEventListener("click", () => {
        game.toggleAIControl(display.player);
        display.AIToggle.classList.toggle("active");
      });
    });

    //Handles hiding the dropdown buttons on mouseout
    playerDisplays.forEach((display) => {
      display.box.addEventListener("mouseover", () => {
        display.box.getElementsByTagName("img")[0].classList.remove("hidden");
      });
      display.box.addEventListener("mouseout", () => {
        display.box.getElementsByTagName("img")[0].classList.add("hidden");
      });
    });

    //Player Name editing
    playerDisplays.forEach((display) => {
      display.editButton.addEventListener("click", (e) => {
        updateName(display.editButton);
      });
      function updateName() {
        display.editButton.classList.toggle("disabled");
        let nameLabel = display.box.parentNode.getElementsByTagName("h1")[0];

        let editBox = document.createElement("input");
        editBox.classList.add("nameInput");
        editBox.value = nameLabel.innerHTML;
        editBox.addEventListener("focus", () => {
          event.target.style.background = "rgba(63, 176, 221, 0.685)";
        });
        editBox.addEventListener("keypress", (e) => {
          if (e.key != "Enter") {
            return;
          }
          nameLabel.innerHTML = editBox.value;
          display.box.replaceChild(nameLabel, editBox);

          display.editButton.classList.toggle("disabled");
        });
        nameLabel.parentNode.replaceChild(editBox, nameLabel);
        editBox.focus();
        editBox.select();
      }
    });

    //Handles dropdown menus
    playerDisplays.forEach((display) =>{
      display.dropdownButton.addEventListener('click',()=>{
        display.dropdown.classList.toggle('collapsed');
        display.dropdown.childNodes.forEach((node) =>{
          if(node.classList){
            node.classList.toggle('collapsed');
          }
        })

      })
    });
  };

  /**
   * Inputs a letter into the UI board. Also makes a move in the game data
   * @param {Node} square Square div from DOM. Requires row and column attributes
   *
   */
  const inputSquare = (square) => {
    //Checks if the square has already been taken
    if (square.firstChild) {
      return;
    }
    let row = square.getAttribute("row");
    let column = square.getAttribute("column");
    let side = game.getActivePlayer().side;
    game.makeMove(row, column, side);
    switchActivePlayerMarker();
    updateBoard();
  };
  /**
   * Updates UI board based on board data
   */
  export function updateBoard(){
    //Iterates through each row and column
    let squareIndex = 0;
    for (let row = 0; row < board.getRows().length; row++) {
      for (let column = 0; column < board.getRows()[row].length; column++) {
        //if boardData shows an empty square, all child items of the squareDiv is removed
        if (board.getRows()[row][column] == "") {
          while (squares[squareIndex].firstChild) {
            squares[squareIndex].removeChild(squares[squareIndex].lastChild);
          }
        }
        //If there are no children of the squareDiv, checks board data and retrieves the proper svg image for the letter
        if (!squares[squareIndex].firstChild) {
          if (board.getRows()[row][column] == "X") {
            squares[squareIndex].appendChild(getLetterSVG("X"));
          } else if (board.getRows()[row][column] == "O") {
            squares[squareIndex].appendChild(getLetterSVG("O"));
          }
        }
        squareIndex++;
      }
    }
  };
  /**
   * Switches the highlighted UI element denoting the active player
   */
  export function switchActivePlayerMarker(){
    playerDisplays.forEach((display) => {
      display.sideMarker.classList.toggle("activeSide");
    });
  };


