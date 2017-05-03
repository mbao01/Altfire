import {Component} from '@angular/core';
import {NavParams, ViewController} from 'ionic-angular';

@Component({
    selector: 'page-signin-modal',
    templateUrl: 'signin.modal.html',
})
export class SigninModal {
    private _user;

    /**
     *
     * @param navParams
     * @param viewCtrl
     */
    constructor(private navParams: NavParams,
                private viewCtrl: ViewController) {}

    /**
     * TODO: DELETE
     */
    ionViewDidLoad() {
        console.log('ionViewDidLoad SigninModal');
    }

    /**
     * Initialize User state
     */
    ngOnInit() {
        this._user = this.navParams.data ? this.navParams.data : {};
    }

    /**
     * Parse user choice to continue as old user or as new user
     * @param userType
     */
    onSigninAs(signinAs) {
        this.viewCtrl.dismiss(signinAs);
    }

}
