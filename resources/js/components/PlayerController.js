export function activate(vue, clickedPawn) {
	vue.activePawn = clickedPawn;
	setMoveablePositions(vue);
}

export function deactivate(vue) {
	vue.activePawn = null;
	vue.moveablePositions = [];
}

export function setMoveablePositions(vue) {
	vue.blocked ? null : vue.moveablePositions.push(vue.activePawn-3);

	vue.activeLeft ? tryToMakeMoveable(vue, [vue.activePawn-2]) :
		vue.activeMiddle ? tryToMakeMoveable(vue, [vue.activePawn-2, vue.activePawn-4]) :
			tryToMakeMoveable(vue, [vue.activePawn-4]);
}

export function tryToMakeMoveable(vue, positions) {
	positions.forEach(position => {
		vue.ai_pawns.includes(position) ? vue.moveablePositions.push(position) : null;
	});
}

export function moveActiveTo(vue, clickedPawn) {
	let activeIndex = vue.player_pawns.indexOf(vue.activePawn);
	vue.player_pawns[activeIndex] = clickedPawn;
	if(vue.ai_pawns.includes(clickedPawn)) {
		let ai_index = vue.ai_pawns.indexOf(clickedPawn);
		vue.ai_pawns[ai_index] = null;
	}
	deactivate(vue);
}