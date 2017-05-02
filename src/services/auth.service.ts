import {ErrorHandler, Injectable} from "@angular/core";
import {StorageService} from "./storage.service";
import {FirebaseService} from "./firebase.service";
import {User} from "../models/user.model";

@Injectable()
export class AuthService {
    private user: User = {
        uid: '',
        token: '',
        username: '',
        email: ''
    };

    private _date = new Date();

    /**
     * Authentication Service Constructor
     * @param http
     * @param storageService
     * @param firebaseService
     * @param logger
     */
    constructor(private storageService: StorageService, private firebaseService: FirebaseService, private logger: ErrorHandler) {
    }

    /**
     * Checks User Authentication State
     */
    auth() {
        this.firebaseService.auth().onAuthStateChanged((_currentUser) => {
            if (_currentUser) {
                this.user.tokenValid = true;
            } else {
                console.log("User is logged out");
                this.user.tokenValid = false;
            }
        });
    }

    /**
     * Set User data in Locastorage
     * @param user
     */
    setUser(user) {
        if(user.expire < this._date.getTime()) {
            user.expire = this._date.getTime() + 864000;
            user = this.firebaseService.refreshUserToken(user) || user;
        }
        this.user = user;
        this.storageService.setUser(user);
    }

    /**
     * Get User data from Localstorage
     * @returns {User}
     */
    getUser() {
        return this.user;
    }

    /**
     * Removes user data from LocalStorage and log user out in Firebase
     */
    logout () {
        this.storageService.removeUser().then(() => {
            this.user.tokenValid = false;
            this.firebaseService.logout();
        }).catch((err) => {
            this.logger.handleError(err);
        });
    }

    /**
     * Sign user in Firebase
     * @param data
     * @returns {firebase.Promise<any>}
     */
    signin(data) {
        return this.firebaseService.login(data);
    }

    /**
     * Sign user up in Firebase
     * @param user
     * @returns {firebase.Thenable<any>}
     */
    signup(user) {
        return this.firebaseService.createEmailUser(user);
    }

}