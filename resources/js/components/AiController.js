import axios from 'axios';
export function getAiMoves(vue, aiTurn = true) {
	aiTurn ? storeBoardState(vue) : null;
	vue.possibleAiMoves = [];
	for(let i = 0; i < 3; i++) {
		let pawn = vue.ai_pawns[i];
		if(pawn != null) {
			if((!vue.player_pawns.includes(pawn+3)) && (!vue.ai_pawns.includes(pawn+3)) && pawn < 7 && compareToBadMoves(vue, pawn, pawn+3)) {
				vue.possibleAiMoves.push([pawn, pawn+3]);
			}
			switch(pawn % 3) {
				case 1:
					tryToAddAiMove(vue, pawn, pawn+4);
					break;
				case 2:
					tryToAddAiMove(vue, pawn, pawn+2);
					tryToAddAiMove(vue, pawn, pawn+4);
					break;
				case 0:
					tryToAddAiMove(vue, pawn, pawn+2);
					break;
			}
		}
	}
}

export function getBadMoves(vue) {
	axios.get('/ai')
	.then(response => vue.badAiMoves = response.data)
	.catch(error => console.log(error));
}

export function tryToAddAiMove(vue, start, target) {
	if(compareToBadMoves(vue, start, target) && vue.player_pawns.includes(target))
		vue.possibleAiMoves.push([start, target]);

}

function compareToBadMoves(vue, start, target) {
	let valid = true;
	let filteredPawns = [vue.player_pawns.filter(pawn=> pawn != null), vue.ai_pawns.filter(pawn => pawn != null)];
	vue.badAiMoves.forEach(bad => {
		if(
			jsonify(filteredPawns[0]) == jsonify(bad['lastBoardState'][0]) &&
			jsonify(filteredPawns[1]) == jsonify(bad['lastBoardState'][1]) &&

			jsonify([start, target]) == jsonify(bad['lastAiMove']))
		{
			valid = false;
		}
	});
	return valid;
}

function jsonify(object) {
	return JSON.stringify(object);
}

export function moveAi(vue) {
	let randomMoveIndex = Math.floor(Math.random()*vue.possibleAiMoves.length);
	let randomMove = vue.possibleAiMoves[randomMoveIndex];
	aiMovement(vue, randomMove[0], randomMove[1]);
}

function aiMovement(vue, start, end) {
	if(start < 7) {
		let startIndex = vue.ai_pawns.indexOf(start);
		vue.ai_pawns[startIndex] = end;
		if(vue.player_pawns.includes(end)) {
			let playerIndex = vue.player_pawns.indexOf(end);
			vue.player_pawns[playerIndex] = null;
		}
		vue.lastAiMove = [start, end];
	}
}
export function storeBoardState(vue) {
	vue.lastBoardStateBeforeAiMovement = [[],[]];
	vue.player_pawns.forEach(pawn => {
		if(pawn != null) {
			vue.lastBoardStateBeforeAiMovement[0].push(pawn);
		}
	});
	vue.ai_pawns.forEach(pawn=> {
		if(pawn != null) {
			vue.lastBoardStateBeforeAiMovement[1].push(pawn);
		}
	});
}