//TODO: Set alert to player name instead of letter
//TODO: add name property to players, add functionality to set name
//TODO: Possibly add a congratulatory message upon winning
window.onload = () => {
  displayController.initializeBoard();
  displayController.initializePlayerDisplay();
  game.initializeGame();
};
/**
 * Handles all display elements
 */
const displayController = (() => {
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

    letterImg = document.createElement("img");
    letterImg.setAttribute("src", letter == "X" ? xSrc : oSrc);
    console.log(letterImg);
    return letterImg;
  };

  /**
   * Initializes the UI board, and grabs all necessary DOM elements to do so.
   */
  const initializeBoard = () => {
    const boardDiv = document.getElementById("board");
    const squareDivs = boardDiv.getElementsByTagName("div");
    squares = Array.prototype.slice.call(squareDivs, 0); //Takes an  HTML collection and converts to Array

    //Assigns a row and column attribute for each UI square 
    let squareIndex = 0;
    for (row = 0; row < board.getRows().length; row++) {
      for (col = 0; col < board.getRows()[row].length; col++) {
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
    });
  };

  /**
   * Sets active player marker back to the first player
   */
  const resetActivePlayerMarker = () => {
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
  const initializePlayerDisplay = () => {
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
            console.log('Found a node');
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
    if (square.firstChild) {
      return;
    }
    let row = square.getAttribute("row");
    let column = square.getAttribute("column");
    let side = game.getActivePlayer().side;
    game.makeMove(row, column, side);
  };
  /**
   * Updates UI board based on board data
   */
  const updateBoard = () => {
    //Iterates through each row and column
    let squareIndex = 0;
    for (row = 0; row < board.getRows().length; row++) {
      for (column = 0; column < board.getRows()[row].length; column++) {
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
  const switchActivePlayerMarker = () => {
    playerDisplays.forEach((display) => {
      display.sideMarker.classList.toggle("activeSide");
    });
  };
  return {
    initializeBoard,
    initializePlayerDisplay,
    switchActivePlayerMarker,
    updateBoard,
    resetActivePlayerMarker
  };
})();
/**
 * Handles reading and writing to board data
 */
const board = (() => {
  let boardData = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];

  /**
   * Updates board data with a new letter in the given space
   * @param {Index} row Row index of the chosen move
   * @param {Index} column Column index of the chosen move
   * @param {Index} side Letter that will be input
   */
  const inputSquare = (row, column, side) => {
    boardData[row][column] = side;
  };
  /**
   *
   * @returns 2D array with an array for each row of the board data
   */
  const getRows = () => {
    return boardData;
  };

  /**
   *
   * @returns An array wherein the rows and columns have been swapped
   */
  Array.prototype.transpose = function () {
    //function to transpose rows and columns of 2d array
    let newArray = [];
    for (i = 0; i < this.length; i++) {
      let newCol = [];
      for (j = 0; j < this[0].length; j++) {
        newCol.push(this[j][i]);
      }
      newArray.push(newCol);
    }
    return newArray;
  };

  /**
   *
   * @returns A 2D array with each board column as a row
   */
  const getColumns = () => {
    return boardData.transpose();
  };

  /**
   *
   * @returns array containing two arrays, one for each of the right and left diagonals
   */
  const getDiagonals = () => {
    let leftDiagonal = [];
    for (i = 0; i < boardData.length; i++) {
      leftDiagonal.push(boardData[i][i]);
    }
    let rightDiagonal = [];
    let rowIndex = 0;
    for (colIndex = boardData.length - 1; colIndex >= 0; colIndex--) {
      rightDiagonal.push(boardData[rowIndex][colIndex]);
      rowIndex++;
    }
    return [leftDiagonal, rightDiagonal];
  };

  /**
   * Overwrites board data with all empty strings
   */
  const resetBoard = () => {
    for (row = 0; row < boardData.length; row++) {
      for (column = 0; column < boardData[row].length; column++) {
        boardData[row][column] = "";
      }
    }
  };
  return {
    resetBoard,
    getRows,
    getColumns,
    getDiagonals,
    inputSquare,
  };
})();
/**
 * Handles game and player logic
 */
const game = (() => {
  const firstPlayer = {
    side: "X",
    isAIControlled: false,
  };
  const secondPlayer = {
    side: "O",
    isAIControlled: true,
  };
  let activePlayer = firstPlayer;
  let moveCount = 0;
  let isGameOver = false;

  const getActivePlayer = () => activePlayer;
  const getFirstPlayer = () => firstPlayer;
  const getSecondPlayer = () => secondPlayer;

  /**
   * Switches current active player. Fires PlayerSwitch event.
   */
  const switchActivePlayer = () => {
    activePlayer = activePlayer == firstPlayer ? secondPlayer : firstPlayer;
    displayController.switchActivePlayerMarker();
    document.dispatchEvent(new Event("playerSwitch"));
  };

  /**
   * Initializes the event listener necessary for the AI to know when to move.
   * Listens for the "PlayerSwitch" event
   */
  const initializeGame = () => {
    //If the active player is AI controlled, it makes an AI move
    document.addEventListener("playerSwitch", () => {
      if (getActivePlayer().isAIControlled) {
        if (!game.gameIsOver()) {
          setTimeout(() => {
            let AImove = AI.decideMove();
            makeMove(AImove[0], AImove[1], game.getActivePlayer().side);
          }, 250);
        }
      }
    });
  };

  /**
   * Toggles AI control on or off for the given player
   * @param {Player} player firstPlayer or secondPlayer
   */
  const toggleAIControl = (player) => {
    player.isAIControlled = player.isAIControlled ? false : true;
    document.dispatchEvent(new Event("playerSwitch"));
    console.log("Switched player to AI controlled: ", player.isAIControlled);
  };

  /**
   * Sets if the game is currently over
   * @param {Boolean} value true or false
   */
  const setGameOver = (value) => {
    isGameOver = value;
  };
  const gameIsOver = () => {
    return isGameOver;
  };

  /**
   * Writes a move to board data
   * @param {Index} row Row index of the requested move
   * @param {Index} column Column index of the requested move
   * @param {Side} side Letter to be input
   */
  const makeMove = (row, column, side) => {
    board.inputSquare(row, column, side);
    incrementMoveCount();
    displayController.updateBoard();
    switchActivePlayer();
    setTimeout(() => {
      game.checkWin(side);
      //Delayed this for browser compatibility
      //Was not showing the last letter sometimes in Edge and Chrome
    }, 20);
  };

  const resetActivePlayer = () => {
    activePlayer = firstPlayer;
  };
  /**
   * Adds 1 to the move counter. After 9 moves, a tie is called
   */
  const incrementMoveCount = () => {
    moveCount++;
  };

  const getMoveCount = () => {
    return moveCount;
  };

  /**
   * Checks if a player has won the game
   *
   * @param {Letter} side Will check for a 3-in-a-Row of this letter
   */
  const checkWin = function (side) {
    let won = false;
    //Checks rows
    board.getRows().forEach((row) => {
      if (row.every((square) => square == side && !won)) {
        won = true;
        win(side);
        return;
      }
    });
    //Checks columns
    board.getColumns().forEach((column) => {
      if (column.every((square) => square == side && !won)) {
        won = true;
        win(side);
        return;
      }
    });

    //Checks diagonals
    board.getDiagonals().forEach((diagonal) => {
      if (diagonal.every((square) => square == side && !won)) {
        won = true;
        win(side);
        return;
      }
    });

    //Ties after max amount of moves
    if (moveCount >= 9 && !won) {
      tie();
    }
  };
  /**
   * Called when a player wins
   * @param {Letter} side Side that has won
   */
  const win = (side) => {
    alert(side + " wins!");
    setGameOver(true);
    setTimeout(reset);
  };
  /**
   * Called when there is a tie
   */
  const tie = () => {
    alert("Tie!");
    setTimeout(reset, 99);
  };
  /**
   * Resets board data to all empty strings. Also resets all display elements to default
   */
  const reset = () => {
    board.resetBoard();
    displayController.updateBoard();
    resetActivePlayer();
    displayController.resetActivePlayerMarker();
    setGameOver(false);
    moveCount = 0;
    document.dispatchEvent(new Event("playerSwitch"));
  };

  return {
    initializeGame,
    checkWin,
    reset,
    makeMove,
    getMoveCount,
    gameIsOver,
    setGameOver,
    getFirstPlayer,
    getSecondPlayer,
    getActivePlayer,
    toggleAIControl,
  };
})();
/**
 * Handles move generation for any AI players
 */
const AI = (() => {
  /**
   * Generates an AI move based on the current board state
   * @returns The row and column of the chosen move
   */
  const decideMove = () => {
    let AISide = game.getActivePlayer().side;
    let opponentSide = game.getActivePlayer().side == "X" ? "O" : "X";
    let AIhasWin = checkImmediateWin(AISide, opponentSide);
    let opponentHasWin = checkImmediateWin(opponentSide, AISide);
    //If AI can win, make the move that will win
    if (AIhasWin) {
      return AIhasWin;
      //If opponent can win, make the move that will block them
    } else if (opponentHasWin) {
      return opponentHasWin;
      //All else fails, make a random move on an open space
    } else {
      return makeRandomMove();
    }
  };
  /**
   * Generates a random valid move for the AI to make.
   * @returns Array containing coordinates of the random move
   */
  const makeRandomMove = () => {
    let tries = 0;
    while (tries <= 100) {
      let move = [Math.floor(Math.random() * 3), Math.floor(Math.random() * 3)];
      if (board.getRows()[move[0]][move[1]] == "") {
        return move;
      }
      tries++;
    }
    return undefined;
  };
  /**
   * Checks for a potential win for a given player
   * @param {Letter} playerSide Letter of the potential winning player
   * @param {Letter} enemySide Letter of the opponent
   * @returns Coordinates of the space needed for a win
   */
  const checkImmediateWin = (playerSide, enemySide) => {
    let rowWin = rowsHaveAWin(playerSide, enemySide);
    if (rowWin) {
      return rowWin;
    }
    let columnWin = columnsHaveAWin(playerSide, enemySide);
    if (columnWin) {
      return columnWin;
    }
    let diagonalWin = diagonalsHaveAWin(playerSide, enemySide);
    if (diagonalWin) {
      return diagonalWin;
    }
  };
  /**
   * Helper function for checkImmediateWin.
   * Checks each row for a win
   */
  const rowsHaveAWin = (playerSide, enemySide) => {
    returnRow = false;
    board.getRows().forEach((row, index) => {
      let possibleWin = possibleWinInRow(row, playerSide, enemySide);
      //If the index of the row is 0, the check is perceived as false
      //Extra check is to ensure that this correctly reflects true
      if (possibleWin || possibleWin === 0) {
        returnRow = [index, possibleWin];
      }
    });
    return returnRow;
  };
  /**
   * Helper function for checkImmediateWin.
   * Checks each column for a win
   */
  const columnsHaveAWin = (playerSide, enemySide) => {
    returnRow = false;
    board.getColumns().forEach((column, index) => {
      let possibleWin = possibleWinInRow(column, playerSide, enemySide);
      if (possibleWin || possibleWin === 0) {
        returnRow = [possibleWin, index];
      }
    });
    return returnRow;
  };
  /**
   * Helper function for checkImmediateWin.
   * Checks each diagonal for a win
   */
  const diagonalsHaveAWin = (playerSide, enemySide) => {
    let leftDiagonal = board.getDiagonals()[0];
    let rightDiagonal = board.getDiagonals()[1];
    let leftWin = possibleWinInRow(leftDiagonal, playerSide, enemySide);
    let rightWin = possibleWinInRow(rightDiagonal, playerSide, enemySide);
    if (leftWin || leftWin === 0) {
      let possibleWin = leftDiagonal.indexOf("");
      return [possibleWin, possibleWin];
    }
    if (rightWin || rightWin === 0) {
      let row = rightDiagonal.slice();
      let col = rightDiagonal.reverse().slice();
      return [row.indexOf(""), col.indexOf("")];
    }
    return false;
  };
  /**
   *  Checks for a line containing 2 of a player's letter and 1 open space
   * @param {array} row 1D array of the row,column, or diagonal to be checked
   * @param {Letter} playerSide Letter to check for a possible win
   * @param {Letter} enemySide Letter of the opponent side.
   * @returns The array index of the space needed for a win. Returns false if no win is found
   */
  const possibleWinInRow = (row, playerSide, enemySide) => {
    if (
      row.filter((letter) => letter == playerSide).length == 2 &&
      !row.includes(enemySide)
    ) {
      return row.indexOf("");
    }
    return false;
  };

  return {
    decideMove,
  };
})();
