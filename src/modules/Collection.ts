import Vue from 'vue'
import Model from "./Model";

export default abstract class Collection {
    public loading;
    protected toggleLoading () {

    }

    protected model (item):Model{
        return new Model(item)
    }

}
