import Vue from 'vue'
import Model from "./Model";

export default abstract class Collection {
    readonly loading;
    protected toggleLoading (){

    }

    protected model (item: Object):Model{
        return new Model(item)
    }

}
