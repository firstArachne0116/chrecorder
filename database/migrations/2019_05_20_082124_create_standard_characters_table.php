<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateStandardCharactersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('standard_characters', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->string('method_from', 573)->nullable();
            $table->string('method_to', 573)->nullable();
            $table->string('method_include', 573)->nullable();
            $table->string('method_exclude', 573)->nullable();
            $table->string('method_where', 573)->nullable();
            $table->string('creator', 573)->nullable();
            $table->string('unit', 573)->nullable();
            $table->integer('standard')->nullable();
            $table->string('username')->nullable();
            $table->string('standard_tag', 150)->nullable();
            $table->integer('usage_count')->nullable();
            $table->boolean('show_flag')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('standard_characters');
    }
}
