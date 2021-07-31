
    import * as AI from './AI.js';
    import * as board from './board.js';

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
      document.dispatchEvent(new Event("playerSwitch"));
      console.log('Fired switch event!');
    };
  
    /**
     * Initializes the event listener necessary for the AI to know when to move.
     * Listens for the "PlayerSwitch" event
     */
    const initializeGame = () => {
      //If the active player is AI controlled, it makes an AI move
      document.addEventListener("playerSwitch", () => {
        if (getActivePlayer().isAIControlled) {
          if (gameIsOver()) {
            setTimeout(() => {
              let AImove = AI.decideMove(getActivePlayer().side,getActivePlayer().side == "X" ? "O" : "X");
              makeMove(AImove[0], AImove[1], getActivePlayer().side);
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
      switchActivePlayer();
      setTimeout(() => {
        checkWin(side);
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
  
    export {
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
