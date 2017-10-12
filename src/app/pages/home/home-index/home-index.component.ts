import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'sy-home-index',
    templateUrl: 'home-index.component.html'
})

export class HomeIndexComponent implements OnInit {
    constructor() { }

    ngOnInit() {
        console.log(11);
    }
}