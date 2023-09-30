var boardState, blankPosition;
var keyToDirections = {
    "a": [0, 1], // left
    "w": [1, 0], //up
    "d": [0, -1], // right
    "s": [-1, 0], // down
}
var folderNames = ["Brachiosaurus", "Pterodactylus", "Tyrannosaurus", "Velociraptor"];

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

function isCorrect(folderName) {
   for (let i = 0; i<boardState.length; ++i) {
        for (let j = 0; j<boardState[i].length; ++j) {
	    splitted = boardState[i][j].split("_");
	    console.log(splitted)
            if (splitted[0] != folderName + "/" +  i || splitted[1] != j + ".jpg") {
	        return false;
	    }
        }
   }
   return true;
}

function addKeyDownListener(folderName) {
    addEventListener("keydown", (event) => {
      if (!(event.key in keyToDirections)) {
          return;
      }
      let direction = keyToDirections[event.key];
      let newBlankPosition = [blankPosition[0] + direction[0], blankPosition[1] + direction[1]];
      swapBlank(folderName, newBlankPosition);
    });
}

function addSwipeListener(folderName){
    let startX, startY, endX, endY;

    // Minimum swipe distance to be considered a swipe
    const minSwipeDistance = 50;

    // Add a touchstart event listener to detect the start of the swipe
    document.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    });
    // Add a touchend event listener to detect the end of the swipe
    document.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      endY = e.changedTouches[0].clientY;

      // Calculate the horizontal and vertical distance of the swipe
      const deltaX = endX - startX;
      const deltaY = endY - startY;
      // Determine the direction of the swipe based on the distance
      let key;
      if (Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX > 0) {
          // Swipe right
          key = "d";
        } else {
          // Swipe left
          key = "a"
        }
      } else if (Math.abs(deltaY) > minSwipeDistance) {
        if (deltaY > 0) {
          // Swipe down
          key = "s";
        } else {
          // Swipe up
          key = "w";
        }
      }
      let direction = keyToDirections[key];
      let newBlankPosition = [blankPosition[0] + direction[0], blankPosition[1] + direction[1]];
      swapBlank(folderName, newBlankPosition);
    });
}

function swapBlank(folderName, newBlankPosition) {
    if (isOutsideBoard(newBlankPosition[0]) || isOutsideBoard(newBlankPosition[1])) {
          return;
      }
     var tmp = boardState[blankPosition[0]][blankPosition[1]];
     boardState[blankPosition[0]][blankPosition[1]] = boardState[newBlankPosition[0]][newBlankPosition[1]];
     boardState[newBlankPosition[0]][newBlankPosition[1]] = tmp;
     blankPosition = newBlankPosition;
     renderBoard();
     console.log(isCorrect(folderName));
     if (isCorrect(folderName)) {
       setTimeout(function(){ addSuccessDiv() }, 300);
     }
}

function addSuccessDiv() {
    let svg_anim = '<div class="success-animation"><svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none" /><path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" /></svg></div>'
    document.getElementById("anim_div").innerHTML += svg_anim
  }

function setDifficulty(boardSize) {
    Cookies.set("boardSize", boardSize);
    console.log(Cookies.get("boardSize"));
}

function setActualDifficulty() {
    let boardSize = Cookies.get("boardSize") === undefined ? 3 : parseInt(Cookies.get("boardSize"));
    document.getElementById("difficulty").value = boardSize;
}

function main() {
   folderName = folderNames[Math.floor(Math.random() * folderNames.length)];
   window.addEventListener('scroll', function (e) {
    // Prevent the default scroll behavior
    e.preventDefault();
  }, { passive: false });

  // Disable horizontal scrolling (for touch devices)
  document.body.addEventListener('touchmove', function (e) {
    // Prevent the default touchmove behavior
    e.preventDefault();
  }, { passive: false });
   var boardSize = Cookies.get("boardSize") === undefined ? 3 : parseInt(Cookies.get("boardSize"));
   console.log(Cookies.get());
   console.log(Cookies.get("name"));
   folderName += "-" + boardSize;
   generateTable(boardSize, folderName);
   initBoardState(folderName, boardSize); 
   //shuffleBoardState();
   renderBoard();
   addKeyDownListener(folderName);
   addSwipeListener(folderName);
}
