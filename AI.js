
    /**
     * Generates an AI move based on the current board state
     * @returns The row and column of the chosen move
     */
    
    import * as board from './board.js';
    import * as game from './game.js';
    import * as display from './display.js';

    export function decideMove(AISide){
      
      let opponentSide = AISide == "X" ? "O" : "X";
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
    function makeRandomMove(){
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
    function checkImmediateWin(playerSide, enemySide){
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
    function rowsHaveAWin(playerSide, enemySide){
      let returnRow = false;
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
    function columnsHaveAWin(playerSide, enemySide){
      let returnRow = false;
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
    function diagonalsHaveAWin(playerSide, enemySide){
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
    function possibleWinInRow(row, playerSide, enemySide){
      if (
        row.filter((letter) => letter == playerSide).length == 2 &&
        !row.includes(enemySide)
      ) {
        return row.indexOf("");
      }
      return false;
    };
    export function initializeAI(){
      //If the active player is AI controlled, it makes an AI move
      document.addEventListener("playerSwitch", () => {
        if (game.getActivePlayer().isAIControlled) {
          if (!game.gameIsOver()) {
            setTimeout(() => {
              let AImove = decideMove(game.getActivePlayer().side,game.getActivePlayer().side == "X" ? "O" : "X");
              game.makeMove(AImove[0], AImove[1], game.getActivePlayer().side);
              display.updateBoard();
              display.switchActivePlayerMarker();
            }, 250);
          }
        }
      });
    };

