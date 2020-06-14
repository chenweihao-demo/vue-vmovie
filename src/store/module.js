import types from "./TYPES";
import {
    getPostView
} from "../api/play";
export const play = {
    state: () => ({
        postView: null,
    }),
    mutations: {
        [types.GET_POSET_VIEW_DATA](){

        }
    },
    actions: {
        getPostView(){
            
        }
    },
    getters: {

    }
}