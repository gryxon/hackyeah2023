var boardState, blankPosition;

function generateTable(boardSize, folderName) {
    var tableDom = document.getElementById("board");
    tableDom.innerHTML="";
    tableDom.border=1;
    for (let i = 0; i<boardSize; ++i) {
        let row = tableDom.insertRow();
	for (let j = 0; j <boardSize; ++j) {
            let cell = row.insertCell();
	    let img = cell.appendChild(document.createElement("img"));
	    img.id = "img_" + i.toString() + "_" + j.toString();
	    img.src = folderName + "/" + (boardSize - 1).toString() + "_" + (boardSize - 1).toString() + ".jpg";
	}
    }
}

function renderBoard() {
    for (let i = 0; i<boardState.length; ++i) {
        for (let j = 0; j<boardState[i].length; ++j) {
            let img = document.getElementById("img_" + i + "_" + j);
	    img.src = boardState[i][j];
	}
    }
}

function initBoardState(folderName, boardSize){
   boardState = [];
   for (let i = 0; i<boardSize; ++i) {
	boardState.push([])
        for (let j = 0; j<boardSize; ++j) {
            boardState[i].push(folderName + "/" + i + "_" + j + ".jpg"); 
        }
   }
   blankPosition = [boardState.length - 1, boardState.length - 1];
}

function shuffleBoardState() {
   directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
   for (let i = 0; i < 1000; ++i) {
     do {
	var ind = Math.floor(Math.random() * directions.length);
        direction = directions[ind];
	newBlankPosition = [blankPosition[0] + direction[0], blankPosition[1] + direction[1]];
     } while (isOutsideBoard(newBlankPosition[0]) || isOutsideBoard(newBlankPosition[1])) 
     var tmp = boardState[blankPosition[0]][blankPosition[1]];
     boardState[blankPosition[0]][blankPosition[1]] = boardState[newBlankPosition[0]][newBlankPosition[1]];
     boardState[newBlankPosition[0]][newBlankPosition[1]] = tmp;
     blankPosition = newBlankPosition;
   }
}

function isOutsideBoard(position) {
   return position < 0 || position >= boardState.length;
}

function isCorrect() {
   for (let i = 0; i<boardState.lenght; ++i) {
        for (let j = 0; j<boardState[i].length; ++j) {
	    splitted = boardState[i][j].split("_");
            if (splitted[0] != i.toString() || splitted[1] != j.toString() + ".jpg") {
	        return false;
	    }
        }
   }
   return true;
}

function addKeyDownListener() {
    addEventListener("keydown", (event) => {
      console.log(event.keyCode);
      let keyCodeToDirections = {
	      37: [0, 1], // left
	      38: [1, 0], //up
	      39: [0, -1], // right
	      40: [-1, 0], // down
      }
      if (!(event.keyCode in keyCodeToDirections)) {
          return;
      }
      let direction = keyCodeToDirections[event.keyCode];
      let newBlankPosition = [blankPosition[0] + direction[0], blankPosition[1] + direction[1]]
      if (isOutsideBoard(newBlankPosition[0]) || isOutsideBoard(newBlankPosition[1])) {
          return;
      }
     var tmp = boardState[blankPosition[0]][blankPosition[1]];
     boardState[blankPosition[0]][blankPosition[1]] = boardState[newBlankPosition[0]][newBlankPosition[1]];
     boardState[newBlankPosition[0]][newBlankPosition[1]] = tmp;
     blankPosition = newBlankPosition;
     renderBoard();
    });
}

function main(folderName) {
   generateTable(4, folderName);
   initBoardState(folderName, 4);
   shuffleBoardState();
   renderBoard();
   addKeyDownListener();
}
