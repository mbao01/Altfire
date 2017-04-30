import {Component} from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';
import {User} from "../../../models/user.model";
import {TabsPage} from "../../tabs/tabs";

@Component({
    selector: 'page-signin-modal',
    templateUrl: 'signin-modal.html',
})
export class SigninModal {
    user: User;

    /**
     *
     * @param navParams
     * @param viewCtrl
     * @param navCtrl
     */
    constructor(public navParams: NavParams,
                private viewCtrl: ViewController,
                private navCtrl: NavController) {}

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
        this.user = this.navParams.data;
    }

    /**
     * Parse user choice to continue as old user or as new user
     * @param userType
     */
    userMode(userType) {
        this.viewCtrl.dismiss(userType);
        this.navCtrl.setRoot(TabsPage);
    }

}
