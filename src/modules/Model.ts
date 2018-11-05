import Vue from "vue";

export interface Mutation {
    (value: any): any
}

export interface Attributes{
    [key: string]: any
}

export interface Mutations {
    [key: string]: Mutation
}

export default class Model {

    protected init(attributes: Attributes = {}): void {
        attributes = (<Attributes> Object).assign(this.defaults(), attributes);
        for (let key in attributes)
            Vue.set(this, key, attributes[key])

        const mutations: Mutations = this.mutations();
        for (const key in mutations)
            Vue.set(this, key, mutations[key](attributes[key]))
    }

    constructor(attributes: Object = {}){
        this.init(attributes)
    }

    protected defaults (): Attributes {
        return{}
    }

    protected mutations(): Mutations {
        return {}
    }
}
