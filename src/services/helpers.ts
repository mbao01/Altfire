import {AlertController, LoadingController, ToastController} from "ionic-angular";
import {Injectable} from "@angular/core";

@Injectable()
export class HelperService {
    constructor(private alertCtrl: AlertController, private toastCtrl: ToastController, private loadingCtrl: LoadingController) {}
    // ERROR HANDLERS

    // ALERT HANDLERS
    alert() {
        this.alertCtrl.create({

        })
    }

    // TOAST HANDLERS
    toast(opts?: {msg?: string, position?: string, closeButton?: string, duration?: number}) {
        return this.toastCtrl.create({
            message: opts.msg ? opts.msg : ' Good to have you . . . ',
            duration: opts.duration ? opts.duration : 2000,
            showCloseButton: !!opts.closeButton,
            position: opts.position ? opts.position : 'bottom',
            closeButtonText: opts.closeButton ? opts.closeButton : 'X'
        });
    }

    // SUCCESS HANDLERS

    // LOADERS
    loader(opts?: {msg?: string, delay?: number, spinner?: string; dismissOnPageChange?: boolean}) {
        return this.loadingCtrl.create({
            content: opts.msg ? opts.msg : ' Recieving.',
            delay: 500,
            spinner: opts.spinner ? opts.spinner : 'crescent',
            dismissOnPageChange: !!opts.dismissOnPageChange
        });
    }
}