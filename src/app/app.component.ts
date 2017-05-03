import {Component, ErrorHandler, OnInit, ViewChild} from '@angular/core';
import {ModalController, NavController, Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {AuthPage} from "../pages/auth/auth";
import {AuthService} from "../services/auth.service";
import {User} from "../models/user.model";
import {TabsPage} from "../pages/tabs/tabs";
import {StorageService} from "../services/storage.service";
import {SigninModal} from "../pages/modals/signin-modal/signin.modal";
import {HelperService} from "../services/helpers";

export {TabsPage} from '../pages/tabs/tabs';
export {GraphqlPage} from '../pages/graphql/graphql';
export {RestfulPage} from '../pages/restful/restful';
export {AuthPage} from '../pages/auth/auth';
export {HistoryPage} from '../pages/history/history';
export {GraphPage} from '../pages/history/graph/graph';
export {RestPage} from '../pages/history/rest/rest';

export {MethodsComponent} from '../components/methods';
export {RequestHeaderComponent} from '../components/header';
export {RequestBodyComponent} from '../components/body';
export {PopoverComponent} from '../components/popover';
export {RequestAuthorizationComponent} from '../components/authorization';
export {SigninModal} from '../pages/modals/signin-modal/signin.modal';

@Component({
    templateUrl: 'app.html'
})
export class Entry implements OnInit {
    private _date = new Date();
    authPage = AuthPage;
    signinModal = SigninModal;
    user: User;
    @ViewChild('nav') nav: NavController;

    /**
     * Application Entry Component Constructor
     * @param _platform
     * @param _statusBar
     * @param _splashScreen
     * @param modalCtrl
     * @param authService
     * @param storageService
     * @param h
     * @param logger
     */
    constructor(private _platform: Platform,
                private _statusBar: StatusBar,
                private _splashScreen: SplashScreen,
                private modalCtrl: ModalController,
                private authService: AuthService,
                private storageService: StorageService,
                private h: HelperService,
                private logger: ErrorHandler) {
        this._initializeApp();
    }

    /**
     * Initialize Altfire Application
     * @private
     */
    _initializeApp() {
        this._platform.ready().then(() => {
            this._statusBar.styleDefault();
            this._splashScreen.hide();
        });
    }

    /**
     * Render Last App State, Fetch App unique Id, User Token from storage
     * ngOnInit lifecycle hook
     */
    ngOnInit() {
        let currentTime = this._date.getTime();
        this.storageService.renderData();
        this.storageService.getAltfireApp().then(() => {
            this.storageService.getUser().then((user: User) => {
                if(user.uid && user.token && user.expire > currentTime) {
                    this.showToast('Welcome back ' + user.username + ', missed you!');
                    user.tokenValid = true;
                    // TODO: Check if there's a way to update data in LocalStorage for Ionic
                    this.authService.setUser(user);
                    this.nav.setRoot(TabsPage);
                } else if (user.uid && user.token && user.expire <= currentTime) {
                    // TODO: Is the logic below necessary??
                    this.h.loader({msg: 'signing you in . . .'});
                    let modal = this.modalCtrl.create(this.signinModal, user);
                    modal.onDidDismiss((signinAs) => {
                        if(signinAs && signinAs == 'olduser') {
                            user.tokenValid = true;
                            this.showToast('Logged in as ' + user.username);
                            this.authService.setUser(user);
                            this.nav.setRoot(TabsPage);
                        } else {
                            this.storageService.deleteToken().then(() => {
                                user.tokenValid = false;
                                this.showToast('please signin to save your work');
                                this.nav.setRoot(this.authPage, {auth_type: 'signin', data: this._initInput(user)});
                            }).catch((err) => {
                                this.logger.handleError(err);
                            });
                        }
                    });
                    modal.present();
                } else {
                    this.nav.setRoot(this.authPage, { auth_type: 'signin', data: this._initInput(user)});
                }
            }).catch((err) => {
                this.logger.handleError(err);
                this.nav.setRoot(this.authPage, { auth_type: 'signup', data: {} });
            });
        }).catch((err) => {
            this.logger.handleError(err);
            this.nav.setRoot(this.authPage, { auth_type: 'signup', data: {} });
            this.storageService.setAltfireApp().then();
        });
    }

    /**
     * TODO: DELETE
     * ionViewWillEnter lifecycle hook
     */
    ionViewWillEnter() {
        console.log('ionViewDidEnter MENU');
    }

    /**
     * Display toast message
     * @param data
     * @param duration
     */
    showToast(data: string, duration?: number) {
        this.h.toast({msg: data, duration: duration ? duration : 2000}).present();
    }

    /**
     * Set User Form fields initialization data
     * @param user
     * @returns {User}
     * @private
     */
    _initInput(user?) {
        this.user.email = user && user.email ? user.email : null;
        this.user.username = 'hidden';
        this.user.firstname = 'hidden';
        this.user.lastname = 'hidden';
        this.user['cpassword'] = 'hidden';
        this.user.tokenValid = false;
        return this.user;
    }

}
