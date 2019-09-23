import * as ai from './AiController.js';

export function newGame(vue) {
	vue.ai_pawns = [1,2,3];
	vue.player_pawns = [7,8,9];
	vue.moveablePositions = vue.possibleAiMoves = [];
	vue.activePawn = null;
	vue.playerTurn = true;
	vue.aiTurn = false;
	vue.turnNumber = 1;
	vue.lastBoardStateBeforeAiMovement = [[],[]];
	vue.lastAiMove = [];
	vue.gameOverMessage = '';
	vue.winner = '';
	vue.badAiMoves = ai.getBadMoves(vue);
}

export function endTurn(vue) {
	if(checkForWinner(vue) || checkForStalemate(vue)) {
		vue.playerTurn = false;
		vue.aiTurn = false;
	} else {
		vue.playerTurn = ! vue.playerTurn;
		vue.aiTurn = ! vue.aiTurn;
		vue.turnNumber++;
		
	}
}

export function checkForWinner(vue) {
	let isWinner = false;
	let remainingPlayerPawns = 0;
	let remainingAiPawns = 0;
	for(let i = 0; i < 3; i++) {
		if(vue.player_pawns[i] < 4 && vue.player_pawns[i] != null) {
			vue.gameOverMessage = "You Win";
			vue.winner = 'player';
			isWinner = true;
		} else if(vue.ai_pawns[i] > 6 && vue.ai_pawns[i] != null) {
			vue.gameOverMessage = "You Lose";
			isWinner = true;
		}
	}

	vue.player_pawns.forEach(pawn => {
		pawn ? remainingPlayerPawns++ : null;
	});

	vue.ai_pawns.forEach(pawn => {
		pawn ? remainingAiPawns++ : null;
	});

	if(remainingPlayerPawns == 0) {
		isWinner = true;
		vue.gameOverMessage = "You Lose";
	}
	else if(remainingAiPawns == 0) {
		isWinner = true;
		vue.gameOverMessage = "You Win";
	}
	return isWinner;
}

export function checkForStalemate(vue) {
	ai.getAiMoves(vue, false);
	if(vue.possibleAiMoves.length == 0) {
		vue.gameOverMessage = "Stalemate";
		return true;
	}
}