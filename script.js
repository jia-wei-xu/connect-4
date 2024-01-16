const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");
//bals
let row = 7;
let column = 6;
let diameter = 25;

let board = Array.from(Array(row), () => new Array(column).fill(0));

let boardClicks = [];

let gameOver = false;
let playerTurn = 1;
let winRow = undefined;

const start = () => {
	canvas.style.display = "inline";
	document.getElementById("instructions").style.display = "none";
}

const adjustDiameter = () => {
	const widthBoundary = (canvas.width / 2) * 0.6;
	const heightBoundary = (canvas.height / 2) * 0.6;

	while (row * diameter > widthBoundary || column * diameter > heightBoundary) {
		diameter--;
	}

	while (row * diameter < widthBoundary && column * diameter < heightBoundary) {
		diameter++;
	}
}

const resize = () => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

const detectPlace = (e) => {
	if (gameOver) {
  	gameOver = false;
  	board = Array.from(Array(row), () => new Array(column).fill(0));
    update();
    return;
  }
  
  const rect = canvas.getBoundingClientRect();
	const x = e.clientX - rect.left;

	for (let i = 0; i < boardClicks.length; i++) {
		if (x > boardClicks[i][0] && x < boardClicks[i][1]) {
			if (placeable(i - 1)) {
				place(i, playerTurn);
			} else {
				return;
			}

			if ((!checkWin()) && (!checkTie())) {
				if (playerTurn == 1) {
					playerTurn = 2
				} else {
					playerTurn = 1;
				}
			} else {
				if (checkWin()) {
					alert(`玩家${["一", "二"][playerTurn - 1]}号(${["红色", "蓝色"][playerTurn - 1]})赢了!`);
        } else if (checkTie()) {
        	alert(`平局!`);
        }
        gameOver = true;
        playerTurn = 1;
			}

			return;
		}
	}
}

const update = () => {
	ctx.lineWidth = 5;

	for (let y = 0; y < column; y++) {
		for (let x = 0; x < row; x++) {
			let color;
			let element = board[x][y];

			if (element == 1) {
				color = "red";
			} else if (element == 2) {
				color = "blue";
			} else {
				color = "#FFFFFF";
			}

			circle
				(
					((canvas.width / row) * x) + canvas.width / (row * 2),
					((canvas.height / column) * y) + canvas.height / (column * 2),
					diameter,
					color
				);
		}
	}

	ctx.lineWidth = 2.5;
	boardClicks = [];
	for (let x = 0; x < row + 1; x++) {
		ctx.beginPath();
		ctx.moveTo((canvas.width / row) * x, 0);
		ctx.lineTo((canvas.width / row) * x, canvas.height);
		ctx.stroke();

		boardClicks.push([(canvas.width / row) * (x - 1), (canvas.width / row) * x]);
	}
}

const checkWin = () => {
	const checkConnect = (sequence) => {
		for (let i = 0; i < sequence.length - 3; i++) {
			if (sequence[i] === sequence[i + 1] && sequence[i + 1] === sequence[i + 2] && sequence[i + 2] === sequence[i + 3] && sequence[i] !== 0) {
				return true;
			}
		}
		return false;
	}

	for (let i = 0; i < board.length; i++) {
		if (checkConnect(board[i])) {
			return true;
		}
	}

	for (let i = 0; i < board[0].length; i++) {
		let row = [];
		for (let j = 0; j < board.length; j++) {
			row.push(board[j][i]);
		}

		if (checkConnect(row)) {
			return true;
		}
	}

	for (let i = 0; i < board.length - 3; i++) {
		for (let j = 0; j < board[0].length - 3; j++) {
			let diagonal1 = [];
			let diagonal2 = [];

			for (let k = 0; k < 4; k++) {
				diagonal1.push(board[i + k][j + k]);
				diagonal2.push(board[i + 3 - k][j + k]);
			}
			if (checkConnect(diagonal1) || checkConnect(diagonal2)) {
				return true;
			}
		}
	}

	return false;
}

const checkTie = () => {
	for (let i = 0; i < board.length; i++) {
		if (board[i].includes(0)) {
    	return false;
    }
  }
  
  return true;
}

const placeable = (c) => {
	return board[c].includes(0);
}

const place = (c, p) => {
	let column = board[c - 1].reverse();

	if (column.includes(0)) column[column.indexOf(0)] = p;

	board[c - 1] = column.reverse();

	update();
}

const circle = (x, y, d, c) => {
	ctx.fillStyle = c;
	ctx.beginPath();
	ctx.arc(x, y, d, 0, 2 * Math.PI);
	ctx.stroke();
	ctx.fill();
}

window.addEventListener("mousedown", (e) => {
	if (canvas.style.display != "none") detectPlace(e);
});

window.addEventListener('resize', (e) => {
	resize();
	adjustDiameter();
	update();
}, true);

window.onload = () => {
	canvas.style.display = "none";

	//alert("两人四子棋 \n\n一方持红棋子, 一方持篮棋子, 玩家轮流放下红蓝棋子。先将自己四只棋子在横竖或斜着连成一条的玩家获胜.")

	resize();
	adjustDiameter();
	update();
}
