import {Injectable} from "@angular/core";
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

    constructor(private http: Http, private storageService: StorageService, private firebaseService: FirebaseService) {
    }

    ngOnInit() {}

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

    setUser(user) {
        this.user = user;
        this.storageService.setUser(user);
    }

    getUser() {
        return this.user;
    }

    logout () {
        this.storageService.removeUser().then(() => {
            this.user.tokenValid = false;
            this.firebaseService.logout();
        });
    }

    signin(data) {
        return this.firebaseService.login(data);
    }

    signup(user) {
        this.firebaseService.createEmailUser(user).then(() => {
            this.setUser(user);
        });
    }

    loadGraphs() {

    }

    loadGraph(graphId) {

    }

    saveGraph(graphId) {

    }

    updateGraph(graphId) {

    }

    loadRestfuls() {

    }

    loadRestful(restfulId) {

    }

    saveRestful(restfulId) {

    }

    updateRestful(restfulId) {

    }

}