@extends('layouts.app')

@section('content')
    {{--<div class="container">--}}
        {{--<div class="row">--}}
            {{--<div class="col-md-12">--}}
                {{--<div class="">--}}
                    {{--<div class="panel-heading">Character</div>--}}

                    {{--<div class="panel-body">--}}

                        {{--<router-view name="measurementsIndex"></router-view>--}}
                    {{--</div>--}}
                {{--</div>--}}
            {{--</div>--}}
        {{--</div>--}}
    {{--</div>--}}
            <router-view :user="{{ Auth::user()->toJson() }}"></router-view>
@endsection
