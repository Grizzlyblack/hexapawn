import {mount} from '@vue/test-utils';
import expect from 'expect';
import Board from '../../resources/js/components/Board.vue';

describe('Board',()=> {
	let wrapper;
	beforeEach(()=> {
		wrapper = mount(Board);
	});

	it('presents a 3x3 board',()=> {
		expect(wrapper.contains('#board')).toBe(true);
		expect(squares().length).toEqual(9);
	});

	it ('starts 3 ai pawns at beginning and 3 player pawns at end', ()=> {
		for(let i = 0; i < 9; i++) {
			if(i < 3) {
				see(pawnImage(i), ai,true);
			}
			else if(i < 6) {
				see(pawnImage(i),ai,false);
				see(pawnImage(i),player, false);
			}
			else {
				see(pawnImage(i),player, true);
			}
		}
	});

	it('starts with one pawn per square', ()=> {
		for(let i = 0; i < 9; i++) {
			let square = squares().at(i);
			expect(square.findAll('.pawn').length < 2).toBe(true);
		}
	});

	it('activates a player controlled pawn on click', ()=> {
		let pawn = getPawn(7);
		click(pawn);
		expectActive(pawn, true);
	});

	it('deactivates a pawn when clicked a second time', () => {
		let pawn = getPawn(7);
		click(pawn);
		expectActive(pawn, true);
		click(pawn);
		expectActive(pawn, false);
	});

	it('activates a different pawn when clicked and deactivates first active pawn', () => {
		let pawn = getPawn(7);
		let secondPawn = getPawn(8);
		click(pawn);
		expectActive(pawn, true);
		click(secondPawn);
		expectActive(secondPawn, true);
		expectActive(pawn, false);

	});

	it('shows the available movement for active pawn', () => {
		wrapper.vm.testPlayer();
		let pawn = getPawn(7);
		let movingTo = getPawn(4);
		click(pawn);
		expectMoveable(movingTo, true);
		expectMoveable(getPawn(1), false);
		expectMoveable(getPawn(3), false);

		click(movingTo);
		expectMove(pawn, movingTo);

		pawn  = getPawn(4);
		click(pawn);
		expectMoveable(getPawn(1), false);
		expectMoveable(getPawn(0), true);
		expectMoveable(getPawn(2), true);
	});

	it('moves the pawn when a moveable square is clicked', () => {
		wrapper.vm.testPlayer();
		let pawn = movePawnForwardFrom(6);

		let movingTo = getPawn(1);
		click(pawn);
		click(movingTo);
		expectMove(pawn, movingTo);
	});

	it('gets possible moves the ai can make after player moves', () => {
		wrapper.vm.testPlayer();
		let pawn = movePawnForwardFrom(6);

		wrapper.vm.aiTurn = true;

		expect(wrapper.vm.possibleAiMoves.length).toBe(3);
	})

	it('makes the ai move after the player', () => {
		let startPositions = [1,2,3];
		let pawn = movePawnForwardFrom(7);
		expect(aiMovedAPawnFrom(startPositions)).toBe(true);
	});

	it('lets the player take subsequent turns after the ai', () => {
		wrapper.vm.testGame();
		movePawnForwardFrom(6);
		moveAi(2, 5);
		let pawn = getPawn(7);
		click(pawn);
		expectActive(pawn, true);
	});

	it("ends the game if a pawn gets to the edge of the board", ()=> {
		wrapper.vm.testGame();
		movePawnForwardFrom(7);
		moveAi(0, 4);
		movePawnForwardFrom(6);
		moveAi(4, 8);
		expect(wrapper.find('#board').html()).toContain('You Lose');
	});

	it("ends the game if there is a stalemate", ()=> {
		wrapper.vm.testGame();
		movePawnForwardFrom(6);
		moveAi(1,4);
		movePawnForwardFrom(8);
		expect(wrapper.find('#board').html()).toContain('Stalemate');
	});

	it("can restart the game when button is clicked", ()=> {
		wrapper.vm.testGame();
		movePawnForwardFrom(6);
		moveAi(1,4);
		movePawnForwardFrom(8);
		expect(wrapper.find('#board').html()).toContain('Stalemate');

		expect(wrapper.contains('#restart')).toBe(true);
		click(wrapper.find('#restart'));
		expect(wrapper.find('#board').html()).not.toContain('Stalemate');
		expect(wrapper.vm.turnNumber = 1);

		let pawn = getPawn(6)
		click(pawn);
		expectActive(pawn, true);
	});

	it("stores the last move the ai made if the player wins", ()=> {
		wrapper.vm.testGame();
		let pawn = movePawnForwardFrom(6);
		moveAi(2,5);
		let movingTo = getPawn(1);
		click(pawn);
		click(movingTo);
		expectMove(pawn, movingTo);
		console.log(wrapper.vm.lastBoardStateBeforeAiMovement);
		console.log(wrapper.vm.lastAiMove);
		expect(wrapper.find('#board').html()).toContain('You Win');

		click(wrapper.find('#restart'));
		movePawnForwardFrom(6);
		moveAi(2,5);
		expect(wrapper.vm.ai_pawns[2]).toBe(3);
	});



	let squares = () => {
		return wrapper.findAll('#square');
	};

	let see = (selector, content, expected) => {
		expected ?
			expect(selector).toContain(content) :
			expect(selector).not.toContain(content);
	};

	let pawnImage = position => {
		return getPawn(position).attributes('src');
	};

	let getPawn = position => {
		return squares().at(position).find('.pawn');
	};

	let click = selector => {
		selector.trigger('click');
	};

	let expectActive = (pawn, expected) => {
		expect(pawn.classes('active')).toBe(expected);
	};

	let movePawnForwardFrom = selector => {
		let pawn = getPawn(selector);
		let movingTo = getPawn(selector-3);
		click(pawn);
		click(movingTo);
		expectMove(pawn, movingTo);
		return movingTo;
	}

	let expectMove = (start, end) => {
		expect(start.attributes('src')).not.toContain('player_pawn');
		expectActive(start, false);
		expect(end.attributes('src')).toContain('player_pawn');
	};

	let expectMoveable = (selector, expected) => {
		expect(selector.classes('moveable')).toBe(expected);
	};

	let aiMovedAPawnFrom = startPositions => {
		let newPositions = wrapper.vm.ai_pawns;
		for(let i = 0; i < startPositions.length; i++) {
			if(startPositions[i] != newPositions[i]) {
				return true;
			}
		}
		return false;
	};

	let moveAi = (start, end) => {
		if(wrapper.vm.fullTesting) {
			wrapper.vm.aiMovement(start+1, end+1);
		}
	};


	let ai = 'ai_pawn';
	let player = 'player_pawn';
	
})