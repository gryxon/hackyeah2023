var frozen = false
var boardState, blankPosition;
var keyToDirections = {
    "a": [0, 1], // left
    "w": [1, 0], //up
    "d": [0, -1], // right
    "s": [-1, 0], // down
}
var folderNames = ["Brachiosaurus", "Pterodactylus", "Tyrannosaurus", "Velociraptor"];
var dinosaursDescriptions = {
    "Brachiosaurus": "Brachiosaurus was a massive, herbivorous dinosaur that lived during the Late Jurassic period, around 154 to 153 million years ago. It was one of the largest land animals to ever roam the Earth, with an estimated length of up to 85 feet (26 meters) and a height of approximately 40 to 50 feet (12 to 15 meters). One of its most distinctive features was its long neck, which made it well-suited for reaching vegetation high in trees, unlike many other long-necked dinosaurs that fed on lower foliage. Brachiosaurus was a sauropod, characterized by its enormous body, column-like legs, and a relatively short tail. It likely moved in herds and had a slow, lumbering gait.",
    "Pterodactylus": "Pterodactylus, often referred to as a pterosaur rather than a dinosaur, was a flying reptile that lived during the Late Jurassic period, around 150 million years ago. It had a wingspan ranging from 1 to 1.5 meters (3 to 5 feet). These creatures were not dinosaurs but rather a separate group of reptiles known as pterosaurs. Pterodactylus is one of the earliest known pterosaurs and played a crucial role in the study of prehistoric flying reptiles and the evolution of flight in vertebrates.",
    "Tyrannosaurus": "Tyrannosaurus rex, often referred to as T. rex, was one of the largest and most fearsome carnivorous dinosaurs that ever lived, roaming North America during the Late Cretaceous period around 68 to 66 million years ago. T. rex had an incredible bite force, estimated to be one of the strongest in the animal kingdom. It could exert a bite force of up to 12,800 pounds, allowing it to crush bone and devour large prey. Despite its massive size, T. rex was surprisingly fast, capable of running at speeds of up to 20-25 miles per hour for short bursts. This agility likely helped it in hunting and scavenging. T. rex had tiny, seemingly useless arms, each with two clawed fingers. The function of these arms remains a subject of debate among scientists, with some suggesting they might have had a role in gripping during mating or supporting the dinosaur's massive body when standing up.",
    "Velociraptor": "Velociraptor was a small, carnivorous dinosaur that lived during the Late Cretaceous period, around 85 to 70 million years ago. It was about the size of a turkey, measuring roughly 6 feet (1.8 meters) in length and weighing around 30 pounds (14 kilograms). Contrary to popular depictions in movies like 'Jurassic Park', Velociraptor had feathers, which were likely used for insulation and display purposes. These feathers provide evidence of the close relationship between dinosaurs and modern birds. Velociraptor was a highly intelligent dinosaur with keen senses, and it likely hunted in packs, making it a formidable predator of its time."
};
var preventDefault = e => e.preventDefault();

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
    addEventListener("keydown", event => {
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
     if (frozen) {
        return;
     }
     renderBoard();
     console.log(isCorrect(folderName));
     if (isCorrect(folderName)) {
       setTimeout(function(){
         addSuccessDiv(folderName);
         frozen = true;
         enableDefaultScrolling();
        }, 300);
     }
}

function addSuccessDiv(folderName) {
    let svg_anim = '<div class="success-animation"><svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none" /><path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" /></svg></div>'
    document.getElementById("anim_div").innerHTML += svg_anim
    document.getElementById("anim_div").innerHTML += dinosaursDescriptions[folderName.split("-")[0]];
  }

function setDifficulty(boardSize) {
    Cookies.set("boardSize", boardSize);
    console.log(Cookies.get("boardSize"));
}

function setActualDifficulty() {
    let boardSize = Cookies.get("boardSize") === undefined ? 3 : parseInt(Cookies.get("boardSize"));
    document.getElementById("difficulty").value = boardSize;
}

function preventDefaultScrolling() {
    window.addEventListener('scroll', preventDefault, { passive: false });
    document.body.addEventListener('touchmove', preventDefault, { passive: false });
}

function enableDefaultScrolling() {
    window.removeEventListener('scroll', preventDefault);
    document.body.removeEventListener('touchmove', preventDefault);    
}

function main() {
   folderName = folderNames[Math.floor(Math.random() * folderNames.length)];
   document.getElementById("anim_div").innerHTML = "";
   preventDefaultScrolling();
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
