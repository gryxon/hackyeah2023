var boardState, blankPosition;

function generateTable(boardSize) {
    var tableDom = document.getElementById("board");
    tableDom.innerHTML="";
    tableDom.border=1;
    for (let i = 0; i<boardSize; ++i) {
        let row = tableDom.insertRow();
	for (let j = 0; j <boardSize; ++j) {
            let cell = row.insertCell();
	    let img = cell.appendChild(document.createElement("img"));
	    img.id = "img_" + i.toString() + "_" + j.toString();
	    img.src = "blank.jpg";
	}
    }
}

function renderBoard(folderName) {
    for (let i = 0; i<boardState.lenght; ++i) {
        for (let j = 0; j<boardState[i].length; ++j) {
            let img = document.getElementById("img_" + i + "_" + j);
	    img.src = boardState[i][j];
	}
    }
}

function initBoardState(folderName){
   for (let i = 0; i<boardState.lenght; ++i) {
        for (let j = 0; j<boardState[i].length; ++j) {
            boardState[i][j] = folderName + "/" + i + "_" + j + ".img"; 
        }
   }
   blankPosition = [boardState.length - 1, boardState.length - 1];
}

function shuffleBoardState() {
   directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
   for (let i = 0; i < 1000; ++i) {
      do {
          direction = directions[Math.floor(Math.random() * directions.length)];
	  newBlankPosition = [blankPosition[0] + direction[0], blankPosition[1] + direction[1]];
      } while (!isWithinBoard(newBlankPosition[0]) || !isWithinBoard(newBlankPosition[1])) 
   var tmp = boardState[blankPosition[0]][blankPosition[1]];
   boardState[blankPosition[0]][blankPosition[1]] = boardState[newBlankPosition[0]][newBlankPosition[1]];
   boardState[newBlankPosition[0]][newBlankPosition[1]] = tmp;
   }
}

function isWithinBoard(position) {
   return position >= 0 && position < boardState.length;
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
