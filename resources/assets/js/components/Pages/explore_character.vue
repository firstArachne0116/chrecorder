<template>
    <div class="container">
        <center>
            <div>
                <h3>
                    Explore Character Data
                </h3>
            </div>
            <div>
                <a class="btn btn-primary" style = "float: left; padding: 2px;" href="/chrecorder/public"><span class="glyphicon glyphicon-menu-left" style="font-Size: 25px; padding-top:2px;"></span></a>
            </div>
            <div style="margin-left: 35px">
                <div class="row">
                    <div class="col-md-3">
                        <a v-on:click="handleAutheredBy()"    class="btn btn-primary" style="width: 100%; margin: 10px" :class="{disabled: searchType == 0}">Find characters authored by</a><br>
                        <div v-if="searchType == 0" style="margin-left: 10px; width: 100%;">
                            <input class="" v-model="authorName" style="width: 100%;" placeholder="Please enter an author name"/>
                            <br>
                        </div>
                        <a v-on:click="handleAboutTaxon()"    class="btn btn-primary" style="width: 100%; margin: 10px" :class="{disabled: searchType == 1}">Find characters about taxon</a><br>
                        <div v-if="searchType == 1" style="margin-left: 10px; width: 100%;">
                            <input class="" v-model="taxonName" style="width: 100%;" placeholder="Please enter a taxon"/>
                            <br>
                        </div>
                        <a v-on:click="handleOfStructure()"   class="btn btn-primary" style="width: 100%; margin: 10px" :class="{disabled: searchType == 2}">Find characters of structure</a><br>
                        <a v-on:click="handleWithCharacter()" class="btn btn-primary" style="width: 100%; margin: 10px" :class="{disabled: searchType == 3}">Find structure with character</a><br>
                        <div v-if="searchType == 3" style="margin-left: 10px; width: 100%;">
                            <input style="height: 26px; width: 100%;" type="text"
                                    list="characterType" placeholder="select or type"
                                    v-model="characterType"/>
                            <datalist id="characterType">
                                <option v-for="eachCharacter in list" :key="eachCharacter.id"
                                    v-tooltip="{ content:eachCharacter.tooltip, classes: 'standard-tooltip'}"
                                >
                                    {{eachCharacter.name}}
                                </option>
                            </datalist>
                            <br>= <input class="" v-model="template" style="width: 95%; margin-top: 8px" placeholder="Please enter a template"/>
                        </div>
                    </div>
                </div>
            </div>
        </center>
    </div>
</template>

<script>
    import Vue from 'vue';

    export default {
        props: [
            'user',
            'list',
        ],
        computed: {
            
        },
        data: function () {
            return {
                searchType: 0,
                authorName: null,
                taxonName: null,
                characterType: null,
                template: null,
            }
        },
        components: {
        },
        methods: {
            handleAutheredBy() {
                var app = this;
                this.searchType = 0;
            },
            handleAboutTaxon() {
                var app = this;
                this.searchType = 1;
            },
            handleOfStructure() {
                var app = this;
                this.searchType = 2;
            },
            handleWithCharacter() {
                var app = this;
                this.searchType = 3;
            },
        },
        watch: {
        },
        created() {
        },
        mounted() {
            var app = this;
            
            console.log(app.user);
            console.log(app.list);

            app.user.name = app.user.email.split('@')[0];
            app.characterUsername = app.user.name;
            sessionStorage.setItem('userId', app.user.id);

            for (var i = 0; i < app.list.length; i++) {
                app.list[i].tooltip = '';
                if (app.list[i].method_from != null && app.list[i].method_from != '') {
                    app.list[i].tooltip = app.list[i].tooltip + 'From: ' + app.list[i].method_from + ', ';
                }
                if (app.list[i].method_to != null && app.list[i].method_to != '') {
                    app.list[i].tooltip += 'To: ' + app.list[i].method_to + ', ';
                }
                if (app.list[i].method_include != null && app.list[i].method_include != '') {
                    app.list[i].tooltip += 'Include: ' + app.list[i].method_include + ', ';
                }
                if (app.list[i].method_exclude != null && app.list[i].method_exclude != '') {
                    app.list[i].tooltip += 'Exclude: ' + app.list[i].method_exclude + ', ';
                }
                if (app.list[i].method_where != null && app.list[i].method_where != '') {
                    app.list[i].tooltip += 'Where: ' + app.list[i].method_where + ', ';
                }
                if (app.list[i].tooltip != ''){
                    app.list[i].tooltip = app.list[i].tooltip.slice(0, -2);
                }
            }
        },
    }
</script>