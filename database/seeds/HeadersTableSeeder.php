<?php

use Illuminate\Database\Seeder;

class HeadersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        DB::table('headers')->insert([
            'id' => 1,
            'header' => 'Character',
        ]);
        DB::table('headers')->insert([
            'id' => 2,
            'header' => 'Average',
        ]);
        DB::table('headers')->insert([
            'id' => 3,
            'header' => 'Deviation',
        ]);
//        DB::table('headers')->insert([
//            'id' => 4,
//            'header' => 'Range',
//        ]);
    }
}
