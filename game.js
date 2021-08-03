
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
      if(gameIsOver()){
        return;
      }
      board.inputSquare(row, column, side);
      incrementMoveCount();
      switchActivePlayer();
        if(checkWin(side)){
          setTimeout(()=>{
            win(side);
            document.dispatchEvent(new Event('reset'));
          },0);
        }
        else if(checkTie()){
          setTimeout(()=>{
            tie();
            document.dispatchEvent(new Event('reset'));
          },0);
        }
      }
      
  
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
     * @param {Letter} side Will check for a full row of this letter
     */
    const checkWin = function (side) {
      let won = false;
      //Checks rows
      board.getRows().forEach((row) => {
        if (row.every((square) => square == side && !won)) {
          won = true;
        }
      });
      //Checks columns
      board.getColumns().forEach((column) => {
        if (column.every((square) => square == side && !won)) {
          won = true;
        }
      });
  
      //Checks diagonals
      board.getDiagonals().forEach((diagonal) => {
        if (diagonal.every((square) => square == side && !won)) {
          won = true;
        }
      });
  
      return won;
    };
    const checkTie = () =>{
      if (moveCount >= 9) {
        return true;
      }
    }
    /**
     * Called when a player wins
     * @param {Letter} side Side that has won
     */
    const win = (side) => {
      alert(side + " wins!");
      setGameOver(true);
    };
    /**
     * Called when there is a tie
     */
    const tie = () => {
      alert("Tie!");
     setGameOver(true);
      document.dispatchEvent(new Event('reset'));
    };
    /**
     * Resets board data to all empty strings. Also resets all display elements to default
     */
    const reset = () => {
      board.resetBoard();
      resetActivePlayer();
      moveCount = 0;
      document.dispatchEvent(new Event("playerSwitch"))
      setTimeout(()=>{
        setGameOver(false);
      },0);
    };
  
    export {
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
