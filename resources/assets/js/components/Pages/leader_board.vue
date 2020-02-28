<template>
    <div class="container">
        <div>
            <h3>
                Leader Board
            </h3>
        </div>
        <div>
            <a class="btn btn-primary" style = "float: left; padding: 2px;" href="/chrecorder/public"><span class="glyphicon glyphicon-menu-left" style="font-Size: 25px; padding-top:2px;"></span></a>
        </div>
        <div style="margin-left: 35px">
            <div v-for="each in resultList">
                <div style="width: 350px; height: 50px; border-radius: 10px; margin: 3px; padding: 7px; box-shadow: 1px 1px 1px grey" v-bind:style="{ backgroundColor: each.index == 1 && '#FFE264' || each.index == 2 && '#E6E7E5' || each.index == 3 && '#FABB84' || each.index > 3 && '#FFFFFE'}">
                    <div style="float: left" class="numberCircle" v-bind:style="{ borderColor: each.index < 4 && 'white' || each.index > 3 && '#333333', color: each.index < 4 && 'white' || each.index > 3 && '#333333'}">
                        {{each.index}}
                    </div>
                    <div style="float: left; font-family: Arial; font-size: 20px; padding: 4px; color: black; margin-left: 12px; font-weight: 550">
                        {{each.name}}
                    </div>
                    <div style="width: 170px; float: right; font-family: Arial; font-size: 20px; padding: 4px; color: black">
                        {{each.cnt}} &nbsp; Character
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';

    export default {
        props: [
            'user',
            'list'
        ],
        computed: {

        },
        data: function () {
            return {
                resultList: [],
            }
        },
        methods: {

        },
        created() {
        },
        mounted() {
            var app = this;

            for (var key in app.list) {
                if (key != 'allFlag') {
                    app.resultList.push({name: key, cnt: app.list[key]});
                }
            }
            app.resultList.sort( ( a, b ) => b.cnt - a.cnt );
            for (let i = 0; i < app.resultList.length; i++){
                app.resultList[i].index = (i + 1);
            }
            console.log('list', app.list);
        },
    }
</script>