import { FormBase } from './form-base';

export class FormSelect extends FormBase<string> {
    controlType = 'select';
    options: { key: string, value: string }[] = [];
    checked: boolean;
    label: string;
    constructor(options: {} = {}) {
        super(options);
        this.options = options['options'] || [];
        this.checked = options['checked'] || true;
        this.label = options['label'] || '';

    }
}
