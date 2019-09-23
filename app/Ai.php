<?php

namespace App;

use App\User;
use Illuminate\Database\Eloquent\Model;

class Ai extends Model
{
	protected $fillable = ['lastBoardState', 'lastAiMove'];

    protected $casts = [
    	'lastBoardState' => 'array',
    	'lastAiMove' => 'array'
    ];

    public function users() {
    	return $this->belongsToMany(User::class, 'user_ai');
    }
}
