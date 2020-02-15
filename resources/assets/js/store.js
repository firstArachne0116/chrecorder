/**
 * Created by ZEUS on 5/23/2018.
 */
import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

//======= vuex store start ===========
const store = new Vuex.Store({
    state: {
        colorTreeData: {},
    },
    mutations: {
        INIT: (state) => {
            state.colorTreeData = {};
        },
},
actions: {

}
});
//======= vuex store end ===========
export default store
