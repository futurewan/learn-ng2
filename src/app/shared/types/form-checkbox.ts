import { FormBase } from './form-base';

export class FormCheckbox extends FormBase<string> {
    type = 'checkbox';
    checked: boolean;
    constructor(options: {} = {}) {
        super(options);
        this.checked = options['checked'] === undefined ? false : options['checked'];
        this.required = options['required'] === undefined ? true : options['required'];
        this.value = options['value'] === undefined ? '1' : options['value'];
    }
}
