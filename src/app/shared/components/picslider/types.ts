/*
	This file contains some helpful types that are used throughout the module
*/

// The slider renders 3 pages to DOM at once, as follows
export enum StackLocation {
    Previous,
    Current,
    Next
};

// Internal API for event handlers to control the page slider
export interface PageSliderControlAPI {
    ScrollTo(x: number): any;
    AnimateToX(x: number, momentum: number): any;
    AnimateToNextPage(momentum: number): any;
    AnimateToPreviousPage(momentum: number): any;
    StartTouch(): any;
    EndTouch(): any;
    StartScroll(): any;
    EndScroll(): any;

    pageWidth: number;
    pageHeight: number;
}
