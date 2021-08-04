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
export function inputSquare(row, column, side) {
  boardData[row][column] = side;
}
/**
 *
 * @returns 2D array with an array for each row of the board data
 */
export function getRows() {
  return boardData;
}

/**
 *
 * @returns A 2D array with each board column as a row
 */
export function getColumns() {
  return boardData.transpose();
}

/**
 *
 * @returns array containing two arrays, one for each of the right and left diagonals
 */
export function getDiagonals() {
  let leftDiagonal = [];
  for (let i = 0; i < boardData.length; i++) {
    leftDiagonal.push(boardData[i][i]);
  }
  let rightDiagonal = [];
  let rowIndex = 0;
  for (let colIndex = boardData.length - 1; colIndex >= 0; colIndex--) {
    rightDiagonal.push(boardData[rowIndex][colIndex]);
    rowIndex++;
  }
  return [leftDiagonal, rightDiagonal];
}

/**
 * Overwrites board data with all empty strings
 */
export function resetBoard() {
  for (let row = 0; row < boardData.length; row++) {
    for (let column = 0; column < boardData[row].length; column++) {
      boardData[row][column] = "";
    }
  }
}

/**
 *
 * @returns An array wherein the rows and columns have been swapped
 */
Array.prototype.transpose = function () {
  //function to transpose rows and columns of 2d array
  let newArray = [];
  for (let i = 0; i < this.length; i++) {
    let newCol = [];
    for (let j = 0; j < this[0].length; j++) {
      newCol.push(this[j][i]);
    }
    newArray.push(newCol);
  }
  return newArray;
};
