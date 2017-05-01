import { IonicErrorHandler } from 'ionic-angular';
import * as Raven from 'raven-js';

Raven.config('https://fcfa1211256448f28f4271e174220668@sentry.io/163500',
    {
        release: '0.2.0',
        dataCallback: data => {

            if (data.culprit) {
                data.culprit = data.culprit.substring(data.culprit.lastIndexOf('/'));
            }

            let stacktrace = data.stacktrace ||
                data.exception &&
                data.exception.values[0].stacktrace;

            if (stacktrace) {
                stacktrace.frames.forEach(function (frame) {
                    frame.filename = frame.filename.substring(frame.filename.lastIndexOf('/'));
                });
            }
        }
    }).install();

export class RavenErrorHandler extends IonicErrorHandler {

    /**
     * Capture and Log Errors and Send to Sentry Service
     * @param error
     */
    handleError(error) {
        super.handleError(error);

        try {
            Raven.captureException(error.originalError || error);
        }
        catch(e) {
            console.error(e);
        }
    }

}