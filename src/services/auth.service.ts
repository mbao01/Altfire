import {ErrorHandler, Injectable} from "@angular/core";
import {Http} from "@angular/http";
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

    /**
     * Authentication Service Constructor
     * @param http
     * @param storageService
     * @param firebaseService
     * @param logger
     */
    constructor(private http: Http, private storageService: StorageService, private firebaseService: FirebaseService, private logger: ErrorHandler) {
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
     * @returns {Bluebird<R>}
     */
    signin(data) {
        return this.firebaseService.login(data);
    }

    /**
     * Sign user up in Firebase
     * @param user
     */
    signup(user) {
        this.firebaseService.createEmailUser(user).then(() => {
            this.setUser(user);
        }).catch((err) => {
            this.logger.handleError(err);
        });
    }

    /**
     * Load All Graph data from Firebase database
     */
    loadGraphs() {

    }

    /**
     * Load single graph data with unique Id from Firebase database
     * @param graphId
     */
    loadGraph(graphId) {

    }

    /**
     * Save Graph data to Firebase database
     * @param graphId
     */
    saveGraph(graphId) {

    }

    /**
     * Update Graph data in Firebase database
     * @param graphId
     */
    updateGraph(graphId) {

    }

    /**
     * Load All Rest data from Firebase database
     */
    loadRestfuls() {

    }

    /**
     * Load single rest data with unique Id from Firebase database
     * @param restfulId
     */
    loadRestful(restfulId) {

    }

    /**
     * Save Rest data to Firebase database
     * @param restfulId
     */
    saveRestful(restfulId) {

    }

    /**
     * Update Rest data in Firebase database
     * @param restfulId
     */
    updateRestful(restfulId) {

    }

}