import { ErrorHandler } from '@angular/core';

export class MyErrorHandler implements ErrorHandler {
    handleError(error: any) {
        // rewrite error display
        console.error('Error Cached:', error);
    }
}
