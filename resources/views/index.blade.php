@extends('layouts.app')

@section('content')

<div class="md:flex justify-between">
	<div class="mb-5 text-xs md:text-base md:w-1/3 ">
		<p class="text-lg mb-2 border-b">
			About the game:
		</p>
		<p>
			&emsp;Hexapawn is a two-player game invented by Martin Gardner, played on a 3x3 grid board.
			The goal of each player is to advance one of their pawns to the opposite end of the board or to prevent the other player from moving.
			Each pawn may move in two different ways: one square forward onto an empty space, or one square diagonally ahead to capture an opposing pawn.
		</p>
		<br>
		<p> &emsp;More information about hexapawn at <a href="https://en.wikipedia.org/wiki/Hexapawn" class="text-blue-500">Wikipedia</a>.</p>
		<br>
		<p>
			&emsp;The purpose of this site is to demonstrate a basic learning ai. 
			Whenever the user wins a match, the last move the ai made is stored in a database. 
			In subsequent matches with the same user, the ai will not make any of the movements that were previously stored,
			making a win by the user progressively more difficult.
		</p>
	</div>

	<board></board>
</div>

@endsection