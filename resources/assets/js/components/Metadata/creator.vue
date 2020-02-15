<template>
    <div class="row">
        <div class="col-md-12" style="font-size: 20px;">
            "{{ character_name }}" was created by
        </div>
        <div class="col-md-12">
            <input disabled v-if="viewFlag == false" style="width: 100%;" v-model="childData" @change="handleDataFc()"/>
            <div v-if="viewFlag == true" style="border: 1px solid grey">{{ childData }}</div>
            at {{ timestamp }}
        </div>
    </div>
</template>

<script>

    export default {
        data: function () {
            return {
                childData: '',
                character_name: null,
                timestamp: null,
                viewFlag: false,
            }
        },
        props: {
            parentData: {
                type: String,
                default () {
                    return ''
                }
            }
        },
        methods: {
            // maybe onchagne may onclick whatever..
            handleDataFc: function () {
                this.$emit('interface', this.childData); // handle data and give it back to parent by interface
            },
            updateTime: function() {
                this.timestamp = new Date();
                this.timestamp = this.timestamp.getFullYear() + '/' + this.timestamp.getMonth() + '/' + this.timestamp.getDate() + ' ' + this.timestamp.getHours();
            }
        },
        mounted() {
//            setInterval(this.updateTime, 1000);
        },
        beforeMount () {
            this.timestamp = new Date();
            this.timestamp = this.timestamp.getFullYear() + '/' + this.timestamp.getMonth() + '/' + this.timestamp.getDate() + ' ' + this.timestamp.getHours();

            this.character_name = sessionStorage.getItem("characterName");
            this.viewFlag = (sessionStorage.getItem('viewFlag') == 'true');
            console.log("viewFlag", this.viewFlag);
            this.childData = this.parentData; // save props data to itself's data and deal with it
        }
    }
</script>

