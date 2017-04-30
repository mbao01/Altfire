import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {TabsPage} from "../tabs/tabs";
import {User} from "../../models/user.model";
import {NavController, NavParams} from "ionic-angular";
import {HelperService} from "../../services/helpers";

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

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private authService: AuthService,
                private h: HelperService) {}
    
    ionViewDidLoad() {
        console.log('ionViewDidLoad Auth');
    }

    ngOnInit() {
        this._initializeForm(this.navParams.get('data') ? this.navParams.data : { auth_type: 'signin', data: this._initInput('signin') });
    }

    onSignup() {
        this.authService.signup(this.f.value);
    }

    onSignin() {
        this.h.loader({msg: 'signing you in . . . ', dismissOnPageChange: true}).present();
        // FIXME: Fix signing in with invalid credentials
        this.authService.signin({ email: this.f.value.email, password: this.f.value.password }).then((user) => {
            this.onShowToast('Signed in as ' + user.username);
            user.tokenValid = true;
            this.navCtrl.setRoot(TabsPage);
            this.authService.setUser(user);
        }, err => {
            return err;
        });
    }

    onToggleAuth() {
        if(this.auth_type == 'signin') {
            this._initializeForm({ auth_type: 'signup', data: this._initInput('signup')});
        } else {
            this._initializeForm({ auth_type: 'signin', data: this._initInput('signin')});
        }
    }

    onContinueAsGuestUser() {
        this.h.loader({msg: 'Welcome guest . . . ', dismissOnPageChange: true}).present();
        this.navCtrl.setRoot(TabsPage);
    }

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

    onShowToast(data: string, duration?: number) {
        this.h.toast({msg: data, duration: duration ? duration : 2000}).present();
    }

}
