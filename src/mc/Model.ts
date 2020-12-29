/**
 * @author Dmitriy Zataidukh
 * @email zidadindimon@gmail.com
 * @created_at 11/25/19
 */
import Vue from 'vue';
import TypeHelper from '@zidadindimon/js-typehelper';
import { IModelApiProvider, TModelError, TMutations, TObject, TRule, TRules } from '../types';
import { ConfigureApiException, ValidateException } from './Exception';
import { Base } from './Base';
import { HooksBehaviour } from './Handler';

export interface IModel {
}

export class Model<D = TObject, SD = any, FO = TObject, DO = TObject>
    extends Base<TModelError, IModelApiProvider<SD, D, FO, DO>>
    implements IModel {
    static async fetch<T extends Model, FO = TObject>(params?: FO, isNew: boolean = false): Promise<T> {
        const model: T = new this() as T;
        await model.fetch(params, isNew);
        return model;
    }

    protected _isNew: boolean = true;
    protected _attrsErrors: TObject<string> = {};
    protected _validationBeforeSave: boolean = true;
    protected _saving: boolean = false;
    protected _deleting: boolean = false;

    constructor() {
        super();
        this.set({});
    }


    rules(): TRules<IModel> {
        return {};
    }

    init(data?: D, isNew: boolean = true) {
        this.set(data);
        this._isNew = isNew;
        this.onInit();
        return this;
    }

    protected onInit() {
    }

    private default(): Partial<this> {
        const defaults: Partial<this> = {};
        const descriptors = Object.getOwnPropertyDescriptors(this);
        Object.keys(descriptors)
            .filter(descriptor => !descriptor.match(/^_.*$/gm))
            .forEach(descriptor => {
                defaults[descriptor] = this[descriptor];
            });
        return defaults;
    }

    private mutation(key: string, mutation: any): any {
        return TypeHelper.isFunction(mutation) ? mutation.call(this, this[key]) : mutation;
    }

    protected mutations(data: D): TMutations<IModel> {
        return {};
    }

    protected set(data: any = {}): this {
        const defaults = this.default();
        const properties = { ...defaults, ...(data || {}) };
        Object.keys(defaults).forEach(key => {
            Vue.set(this, key, properties[key]);
        });

        const mutations = this.mutations(data);

        Object.keys(mutations).forEach((key: string) => {
            Vue.set(this, key, this.mutation(key, mutations[key]));
        });

        return this;
    }

    protected mutateBeforeSave(): TMutations<SD> {
        return {};
    }

    protected get deleteOptions(): DO {
        throw new ConfigureApiException(this.constructor.name, 'deleteOptions');
    }

    protected prepareForSave(): SD {
        const mutations = this.mutateBeforeSave();
        const data: TObject = {};

        Object.keys(mutations).forEach((key: string) => {
            data[key] = this.mutation(key, mutations[key]);
        });

        return (TypeHelper.isEmpty(data) ? this : data) as SD;
    }

    get hasError(): boolean {
        return !!Object.keys(this._attrsErrors).length || !!this._error;
    }

    get saving(): boolean {
        return this._saving;
    }

    get deleting(): boolean {
        return this._deleting;
    }

    resetValidation() {
        this.attrsError = null;
        this._error = null;
        return this;
    }

    protected set attrsError(value: TObject<string>) {
        Vue.set(this, '_attrsErrors', value);
    }

    validate(): boolean {
        this.resetValidation();
        const attrsErrors: { [key in keyof this]?: string } = {};
        const attrsRules = this.rules();

        Object.keys(attrsRules).forEach(key => {
            const rules: TRule<keyof this>[] = attrsRules[key];

            for (const rule of rules) {
                const error = rule.call(this, this[key]);

                if (TypeHelper.isString(error)) {
                    attrsErrors[key] = error;
                    break;
                }
            }
        });
        this.attrsError = attrsErrors;

        return !this.hasError;
    }

    get errors(): TModelError {
        return {
            model: this._error,
            attrs: this._attrsErrors,
        };
    }

    get isNew(): boolean {
        return this._isNew;
    }

    /*api block */

    protected beforeFetch(): void | Promise<void> {
    }

    protected onFetch(): void | Promise<void> {
    }

    @HooksBehaviour({
        before: 'toggleLoading',
        after: 'toggleLoading',
    })
    async fetch(filters?: FO, isNew: boolean = false): Promise<void> {
        this._error = null;
        await this.beforeFetch();
        const method = this.getApiProvideMethod('fetch');
        this.init(await method.call(this, filters), isNew);
        await this.onFetch();
    }

    protected beforeDelete(): void | Promise<void> {
    }

    @HooksBehaviour({
        before: 'toggleDeleting',
        after: 'toggleDeleting',
    })
    async delete(): Promise<void> {
        this._error = null;
        await this.beforeDelete();
        const method = this.getApiProvideMethod('delete');
        this.onDelete(await method.call(this, this.deleteOptions));
    }

    protected beforeSave(): void | Promise<void> {
    }

    @HooksBehaviour({
        before: 'toggleSaving',
        after: 'toggleSaving',
    })
    async save(): Promise<void> {
        this._error = null;
        await this.beforeSave();
        if (this._validationBeforeSave && !this.validate()) {
            throw new ValidateException();
        }
        const method = this.getApiProvideMethod(this.isNew ? 'save' : 'update');
        this.onSave(await method.call(this, this.prepareForSave()));
        this._isNew = false;
    }

    protected onDelete(data: any): void {
    }

    protected onSave(data: any): void {
    }

    protected onError(exception: Error) {
        this.toggleSaving(false)
            .toggleLoading(false)
            .toggleDeleting(false);

        if (!(exception instanceof ValidateException)) {
            this._error = exception.message;
        }
        super.onError(exception);
    }

    protected toggleSaving(saving?: boolean): this {
        this._saving = saving === undefined ? !this._saving : saving;
        return this;
    }

    protected toggleDeleting(deleting?: boolean): this {
        this._deleting = deleting === undefined ? !this._loading : deleting;
        return this;
    }

    /*api block end */
}
