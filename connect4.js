/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 'one'; // active player: 'one' or 'two'. changed to strings because css selectors didn't like using numbers
const board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

const makeBoard = () => {
  for (let y = 0; y < HEIGHT; y++) {
    board.push([]);
    for (let x = 0; x < WIDTH; x++) {
      board[y].push(null);
    }
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

const makeHtmlBoard = () => {
  // get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.querySelector('#board');

  // create top placement row, players click table cells in the row to place pieces
  let top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);
  // top.addEventListener("mouseover", displayPiece);
  // top.addEventListener("mouseout", clearPiece);

  for (let x = 0; x < WIDTH; x++) {
    let headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // create the html game board as tall as height, as wide as width
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

// let mousedOver = false
// const displayPiece = (evt) => {
//   console.log("In display peice!");
//   if(!mousedOver){
//     mousedOver = true;
//     let headTd = evt.target;
//     let gamePiece = document.createElement('div');
//     gamePiece.classList.add("piece", `${currPlayer}`)
//     headTd.append(gamePiece);
//   }
// }

// const clearPiece = evt => {
//   console.log("In clear piece!");
//   evt.target.firstElementChild.remove();
//   mousedOver = false;
// }



/** findSpotForCol: given column x, return top empty y (null if filled) */

const findSpotForCol = x => {
  for (let y = board.length - 1; y > -1; y--) { //loop through board array, starting at the last index of board
    if (!board[y][x]) { // if the current element in the array is null
      return y //return y value
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

const placeInTable = (y, x, player) => {
  // make a div and insert into correct table cell
  let gamePiece = document.createElement('div');
  gamePiece.classList.add("piece", `${player}`, `row-${y}`, 'placed')
  //find the target td with the proper id coordinates
  let targetTd = document.getElementById(`${y}-${x}`);
  targetTd.append(gamePiece);
  //update JS board array with player info
  board[y][x] = player;
}

/** endGame: announce game end */

const endGame = msg => alert(msg);

/** handleClick: handle click of column top to play piece */

// let currPLayer = 'one';
const handleClick = evt => {
  // get x from ID of clicked cell
  const x = +evt.target.id;
  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  placeInTable(y, x, currPlayer);

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check if all cells in board are filled; if so call, call endGame with tie message
  if (board.every(subArr => subArr.every(val => val))) {
    endGame('It\'s a tie!');
  }
    //swap players turn it is
    currPlayer === 'one' ? currPlayer = 'two' : currPlayer = 'one';
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

const checkForWin = () => {
  const _win = cells =>
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer
    cells.every(
      ([y, x]) => //destructuring on each subarray in cells, 
        y >= 0 &&     //y will become first value in the current subarray every is evaluating, x will become the second
        y < HEIGHT && // we are checking that y and x are valid numbers 
        x >= 0 &&
        x < WIDTH &&
        //check if the current cell contains the same string as the value of the current player on the JS board array
        board[y][x] === currPlayer
    );

  // TODO: read and understand this code. Add comments to help you.

  for (let y = 0; y < HEIGHT; y++) { // loop through subArrays in board
    for (let x = 0; x < WIDTH; x++) { // start at beginning of subArray
      // create arrays of values that will check adjacent boxes in 4 directions
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]]; //will create an array with index values for _win() 
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) { // if any one of the _win functions return true, check for win returns true
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();