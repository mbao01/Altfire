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
    constructor(public navParams: NavParams,
                private viewCtrl: ViewController,
                private navCtrl: NavController) {}

    ionViewDidLoad() {
        console.log('ionViewDidLoad SigninModal');
    }

    ngOnInit() {
        this.user = this.navParams.data;
    }

    userMode(userType) {
        this.viewCtrl.dismiss(userType);
        this.navCtrl.setRoot(TabsPage);
    }

}
