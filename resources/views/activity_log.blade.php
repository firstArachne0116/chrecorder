@extends('layouts.app')

@section('content')
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="panel panel-default">
                    <Table style="text-align:center; width:100%">
                    <thead>
                        <tr style="background-color:lightGray">
                            <td style="width:20%"> Time </td>
                            <td style="width:20%"> User </td>
                            <td style="width:20%"> Action type </td>
                            <td style="width:20%"> Action Detail </td>
                            <td style="width:20%"> Additional Information </td>
                        </tr>
                    </thead>
                    @foreach($logs as $log)
                        <tr>
                            <td> {{$log->created_at}} </td>
                            <td> {{$log->user_email}} </td>
                            <td> {{$log->name}} </td>
                            <td> {{$log->detail}} </td>
                            <td> {{$log->detail_addition}} </td>
                        </tr>
                    @endforeach
                    </Table>
                </div>
            </div>
        </div>
    </div>
@endsection
