<template>
	<div class="mx-auto md:mx-0" :style="{width: boardSize+'px'}">
		<div class="flex flex-wrap" :style="{width: boardSize, height: boardSize+'px'}">
			<div 
				v-for="i in 9" id="square" 
				class="border border-gray-400 flex justify-center items-center rounded-lg w-1/3 h-1/3" 
				v-on:click="clickAction(i)"
			>
				<img class="pawn w-1/2" :class="[isActive(i), canBeMovedTo(i)]" :src="getImage(i)"></img>

			</div>
		</div>

		<div class="flex items-center justify-between mt-5 mx-10">
			<div class="flex">
				<form v-if="winner == 'player'" @submit="formSubmit">
					<button id="restart" class="button">Restart</button>
				</form>
				<button v-else id="restart" class="button" v-on:click="restart()">Restart</button>
				<button class="button ml-2" v-on:click="reset()">Reset Ai</button>
			</div>

			<p v-if="gameOverMessage != ''" class="text-xl">{{gameOverMessage}}</p>
		</div>
	</div>
</template>

<script>
	import axios from 'axios';
	import * as player from './PlayerController.js';
	import * as ai from './AiController.js';
	import * as board from './BoardController.js';

	export default {
		data() {
			let boardSize,
				ai_pawns,
				player_pawns,
				moveablePositions,
				possibleAiMoves,
				badAiMoves,
				activePawn,
				playerTurn,
				aiTurn,
				turnNumber,
				lastBoardStateBeforeAiMovement,
				lastAiMove,
				gameOverMessage,
				winner;
			return {
				activePawn, moveablePositions, playerTurn, aiTurn, gameOverMessage,lastBoardStateBeforeAiMovement, possibleAiMoves, badAiMoves, boardSize
			}
		},
		created() {
			board.newGame(this);
			this.getBoardSize();
			window.addEventListener('resize', this.getBoardSize);
		},
		computed: {
			blocked: function() {
				return this.ai_pawns.includes(this.activePawn-3);
			},
			activeLeft: function() {
				return this.activePawn % 3 == 1;
			},
			activeMiddle: function() {
				return this.activePawn % 3 == 2;
			},
			activeRight: function() {
				return this.activePawn % 3 == 0;
			},
		},
		watch: {
			aiTurn: function() {
				if(this.aiTurn) {
					ai.getAiMoves(this);
					ai.moveAi(this);
					board.endTurn(this);
				}
			}
		},
		methods: {
			getBoardSize() {
				this.boardSize = (window.innerWidth < 450) ? window.innerWidth : 450;
			},
			reset() {
				axios.patch('/ai')
				.then(response => response.data == "ok" ? board.newGame(this) : console.log(response.data))
				.catch(error => console.log(error));
			},
			formSubmit(e) {
				e.preventDefault();
				let currentObj = this;
				axios.post('/ai', {
					lastBoardState: this.lastBoardStateBeforeAiMovement,
					lastAiMove: this.lastAiMove
				})
				.then(response => response.data == 'success' ? null : alert('there was an error'), board.newGame(this))
				.catch(error => console.log(error));
			},
			
			getImage(position) {
				if(this.ai_pawns.includes(position)) {
					return '/images/ai_pawn.svg';
				} else if(this.player_pawns.includes(position)) {
					return '/images/player_pawn.svg';
				} else {
					return '';
				}
			},
			isActive(position) {
				return position == this.activePawn ? 'active' : '';
			},
			canBeMovedTo(position) {
				return this.moveablePositions.includes(position) ? 'moveable' : '';
			},
			clickAction(clickedPawn) {
				if(this.playerTurn) {
					if(this.isActive(clickedPawn)) {
						player.deactivate(this);
					}
					else if(this.player_pawns.includes(clickedPawn)) {
						player.deactivate(this);
						player.activate(this, clickedPawn);
					}
					else if(this.moveablePositions.includes(clickedPawn)) {
						player.moveActiveTo(this, clickedPawn);
						board.endTurn(this);
					}
				}
			},
			restart() {
				board.newGame(this);
			}
		}
	}
</script>