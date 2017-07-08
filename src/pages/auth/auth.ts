import {Component, ErrorHandler} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {TabsPage} from "../tabs/tabs";
import {User} from "../../models/user.model";
import {NavController, NavParams} from "ionic-angular";
import {HelperService} from "../../services/helpers";
import {ErrorService} from "../../services/error.service";

@Component({
    selector: 'page-auth',
    templateUrl: 'auth.html',
})
export class AuthPage {
    res: Object;
    f: FormGroup;
    auth_type: string = 'signup';
    cpassword: string;
    user: User;

    /**
     * Authentication Service Constructor
     * @param navCtrl
     * @param navParams
     * @param authService
     * @param h
     * @param logger
     * @param error
     */
    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private authService: AuthService,
                private h: HelperService,
                private logger: ErrorHandler,
                private error: ErrorService) {}

    /**
     * TODO: DELETE
     */
    ionViewDidLoad() {
        console.log('ionViewDidLoad Auth');
    }

    /**
     * Initialize form
     */
    ngOnInit() {
        this._initializeForm(this.navParams.get('data') ? this.navParams.data : { auth_type: 'signin', data: this._initInput('signin') });
    }

    /**
     * Calls authentication service to sign user up
     */
    onSignup() {
        let loading = this.h.loader({msg: 'signing you in . . . ', dismissOnPageChange: true});
        loading.present();
        this.authService.signup(this.f.value).then((user) => {
            console.log('Signed in: ', user);
            this.authService.setUser(user);
            this.onShowToast('Account Created Successfully');
            this.onToggleAuth();
            loading.dismiss();
        }).catch((err) => {
            this.logger.handleError(err);
            loading.dismiss();
        });
    }

    /**
     * Calls authentication service to sign user in
     */
    onSignin() {
        let loading = this.h.loader({msg: 'signing you in . . . ', dismissOnPageChange: true});
        loading.present();
        this.authService.signin({ email: this.f.value.email, password: this.f.value.password }).then((user) => {
            console.log('Signed in: ', user);
            this.onShowToast('Signed in as ' + user.username);
            user.tokenValid = true;
            this.navCtrl.setRoot(TabsPage);
            this.authService.setUser(user);
            loading.dismiss();
        }).catch((err) => {
            console.log('Signed in ERROR: ', err);
            loading.dismissAll();
            this.h.alert(this.error.clean(err));
            this.logger.handleError(err);
        });
    }

    /**
     * Toggle between Signin Page and Signup Page
     */
    onToggleAuth() {
        if(this.auth_type == 'signin') {
            this._initializeForm({ auth_type: 'signup', data: this._initInput('signup')});
        } else {
            this._initializeForm({ auth_type: 'signin', data: this._initInput('signin')});
        }
    }

    /**
     * Sign User in as Guest, set Guest Id
     */
    onContinueAsGuestUser() {
        this.h.loader({msg: 'Welcome guest . . . ', dismissOnPageChange: true}).present();
        this.navCtrl.setRoot(TabsPage);
    }

    /**
     * Set form initialization object
     * @param auth_type
     * @returns {User}
     * @private
     */
    _initInput(auth_type) {
        this.user = this.authService.getUser();
        if(this.f) { delete this.f; }
        if(auth_type == 'signin') {
            this.user.email = this.user && this.user.email ? this.user.email : null;
            this.user.username = 'hidden';
            this.user.firstname = 'hidden';
            this.user.lastname = 'hidden';
            this.user['cpassword'] = 'hidden';
            this.auth_type = 'signin';
        } else {
            this.user.email = null;
            this.user.username = null;
            this.user.firstname = null;
            this.user.lastname = null;
            this.user['cpassword'] = null;
            this.auth_type = 'signup';
        }
        return this.user;
    }

    /**
     * Initialize form based on authentication type (Signin or Signup)
     * @param params
     * @private
     */
    _initializeForm(params?: { auth_type: string, data}) {
        if(params && params.auth_type) {
            this.auth_type = params.auth_type;
        }
        this.f = new FormGroup({
            firstname: new FormControl(params.data && params.data.firstname ? params.data.firstname : null, [Validators.required]),
            lastname: new FormControl(params.data && params.data.lastname ? params.data.lastname : null, [Validators.required]),
            username: new FormControl(params.data && params.data.username ? params.data.username : null, [Validators.required]),
            email: new FormControl(params && params.data ? params.data.email : null, [Validators.required, Validators.email]),
            password: new FormControl(null, [Validators.required]),
            cpassword: new FormControl(params.data && params.data.cpassword ? params.data.cpassword : null, [Validators.required])
        });
    }

    /**
     * Display toast message
     * @param data
     * @param duration
     */
    onShowToast(data: string, duration?: number) {
        this.h.toast({msg: data, duration: duration ? duration : 2000}).present();
    }

}
