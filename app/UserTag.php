<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class UserTag extends Model
{
    //
    protected $fillable = [
        'user_id',
        'tag_name',
    ];
}
