<?php

namespace App\Http\Controllers;

use App\Ai;
use Illuminate\Http\Request;

class AiController extends Controller
{
	public function index()
	{
		$moves = auth()->user()->ais()->get(['lastBoardState', 'lastAiMove'])->toArray();
		$moves = array_map(function($move) {
			return ['lastBoardState'=>$move['lastBoardState'], 'lastAiMove' => $move['lastAiMove']];
		}, $moves);
		return response()->json($moves);
	}

    public function store(Request $request)
    {	
    	$storedMovement = $this->getInvalidMovement($request->input('lastBoardState'), $request->input('lastAiMove'));

    	$storedMovement ? null :
	    	$storedMovement = Ai::create([
	    		'lastBoardState' => $request->input('lastBoardState'),
	    		'lastAiMove' => $request->input('lastAiMove')
	    	]);

	    $storedMovement->users->contains(auth()->user()) ? null :
	    	$storedMovement->users()->attach(auth()->id());

    	return response()->json('success');
    }

    public function update()
    {
    	auth()->user()->ais()->detach();
    	return response()->json(auth()->user()->ais->count() > 0 ? 'ai not reset'  : 'ok');
    }

    private function getInvalidMovement($boardState, $move) {
    	return Ai::whereJsonContains('lastBoardState', $boardState)
    		->whereJsonContains('lastAiMove', $move)->first();
    }

}
