import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';


@Injectable()
export class DialogService {
    private parentSubject = new Subject<any>();
    private childSubject = new Subject<any>();

    forParent = this.parentSubject.asObservable();  // get
    forChild = this.childSubject.asObservable();

    sendToParent(mission: string) {
        this.parentSubject.next(mission);
    }

    exe(astronaut: any) { // sendMessageFromChild
        this.childSubject.next(astronaut);
    }

    open() {
        this.exe('open');
    }

    close() {
        this.exe('close');
    }

    alert(text: string) {
        this.exe({
            type: 'warn',
            body: text
        });
    }

    public parse(data: string): any {
        if (/^[\],:{}\s]*$/.test(data.replace(/\\["\\\/bfnrtu]/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
            return JSON.parse(data);
        }
        return null;
    }
}

