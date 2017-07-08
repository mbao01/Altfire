import {AlertController, LoadingController, ToastController} from "ionic-angular";
import {Injectable} from "@angular/core";

@Injectable()
export class HelperService {

    /**
     * Helpers Service Constructor
     * @param alertCtrl
     * @param toastCtrl
     * @param loadingCtrl
     */
    constructor(private alertCtrl: AlertController, private toastCtrl: ToastController, private loadingCtrl: LoadingController) {}

    /**
     * Alert Helper
     * @param data
     */
    alert(data: any) {
        this.alertCtrl.create({
            subTitle: data.code ? data.code : '',
            message: data.message ? data.message : '',
            enableBackdropDismiss: true
        }).present();
    }

    /**
     * Toast Helper
     * @param opts
     * @returns {Toast}
     */
    toast(opts?: {msg?: string, position?: string, closeButton?: string, duration?: number}) {
        return this.toastCtrl.create({
            message: opts.msg ? opts.msg : ' Good to have you . . . ',
            duration: opts.duration ? opts.duration : 2000,
            showCloseButton: !!opts.closeButton,
            position: opts.position ? opts.position : 'bottom',
            closeButtonText: opts.closeButton ? opts.closeButton : 'X'
        });
    }

    /**
     * Loading Helper
     * @param opts
     * @returns {Loading}
     */
    loader(opts?: {msg?: string, delay?: number, spinner?: string; dismissOnPageChange?: boolean}) {
        return this.loadingCtrl.create({
            content: opts.msg ? opts.msg : ' Receiving.',
            delay: 500,
            spinner: opts.spinner ? opts.spinner : 'crescent',
            dismissOnPageChange: !!opts.dismissOnPageChange
        });
    }

    dismissLoader() {
        console.log('This is Very Fresh');
    }
}