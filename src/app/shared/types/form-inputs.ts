import { FormBase } from './form-base';

export class FormInput extends FormBase<string> {
    subscrip: boolean;
    type: string;
    constructor(options: {} = {}) {
        super(options);
        this.subscrip = options['subscrip'] || false;
        this.type = options['type'] || 'text';
    }
}
