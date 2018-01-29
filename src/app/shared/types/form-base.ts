export class FormBase<T>{
    value: T;
    key: string;//发送ajax参数名
    label: string;
    labelicon: string;
    labelwidth: string;
    required: boolean;
    pattern: any;
    order: number;
    controlType: string;/*表单元素类型标志 判断用input checkbox radio select textarea*/
    type: string;    //input 类型
    unit: string;    //单位（金额等）

    disabled: boolean;
    imgToken: string;
    url: string;
    placeholder: string;
    minlength: number;
    maxlength: number;
    smsType: number;
    btnText: string;
    subscrip: boolean;
    sib: string;
    beforeSib: string;
    icon: boolean;
    myClass: string;


    constructor(options: {
        value?: T,
        key?: string,
        label?: string,
        labelicon?: string,
        labelwidth?: string,
        required?: boolean,
        pattern?: any,
        order?: number,
        controlType?: string,
        type?: string,
        unit?: string,
        disabled?: boolean,
        imgToken?: string,
        url?: string,
        placeholder?: string,
        minlength?: number,
        maxlength?: number,
        smsType?: number,
        btnText?: string,
        subscrip?: boolean,
        sib?: string,
        beforeSib?: string,
        icon?: boolean,
        myClass?: string
    } = {}) {

        this.value = options.value || null;
        this.key = options.key || '';
        this.label = options.label || '';
        this.labelicon = options.labelicon || '';
        this.labelwidth = options.labelwidth || '';
        this.required = !!options.required;
        this.pattern = options.pattern;
        this.order = options.order === undefined ? 1 : options.order;
        this.controlType = options.controlType || '';
        this.type = options.type || '';
        this.unit = options.unit || '';
        this.disabled = options.disabled || false;
        this.imgToken = options.imgToken || '';
        this.url = options.url || '';
        this.placeholder = options.placeholder || '';
        this.minlength = options.minlength || undefined;
        this.maxlength = options.maxlength || undefined;
        this.smsType = options.smsType || undefined;
        this.btnText = options.btnText || '';
        this.subscrip = options.subscrip || false;
        this.icon = options.icon || false;
        this.sib = options.sib || '';
        this.beforeSib = options.beforeSib || '';
        this.myClass = options.myClass || '';
    }
}

export interface SmsOpt {
    phone: string;
    type: number;
    imageCode?: string;
    token?: string;
}
export interface DefaultData {
    resCode: string;
    resDesc: string;
    token?: string;
    data?: any;
}
export class ObFormData {
    subname: string;//订阅唯一id
    url?: string;
    value?: string;
    token?: string;
    imageInfo?: { url: string; imgToken: string };
    smsData?: any;
    data?: any;
}
