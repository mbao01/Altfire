import {ErrorHandler, Injectable} from '@angular/core';
import 'rxjs/Rx';
import {Observable} from "rxjs/Observable";


import * as firebase from "firebase";
import DataSnapshot = firebase.database.DataSnapshot;

@Injectable()
export class FirebaseService {

    private _database;

    /**
     * Firebase Service Constructor
     * @param logger
     */
    constructor(private logger: ErrorHandler) {
        // Initialize Firebase
        let config = {
            apiKey: "AIzaSyArbrFyjEbye1OPdb2PKjEivXSBzVZQnTw",
            authDomain: "altfire-3d240.firebaseapp.com",
            databaseURL: "https://altfire-3d240.firebaseio.com",
            projectId: "altfire-3d240",
            storageBucket: "altfire-3d240.appspot.com",
            messagingSenderId: "267389413595"
        };
        firebase.initializeApp(config);

        this._database = firebase.database();
    }

    /**
     * Get user authentication state from Firebase
     * @returns {firebase.auth.Auth}
     * @private
     */
    _auth() {
        return firebase.auth();
    }

    /**
     * Get current user identity from Firebase
     * @returns {string}
     */
    currentUserId() {
        return this._auth().currentUser.uid;
    }

    /**
     * Sign user out of Firebase
     */
    logout() {
        this._auth().signOut();
    }

    /**
     * Create new User using EmailAndPassword method in Firebase
     * @param user
     * @returns {firebase.Thenable<any>}
     */
    createEmailUser(user) {
        return this._auth().createUserWithEmailAndPassword(user.email, user.password)
            .then((authData) => {
                console.log("User created successfully with payload-", authData);
                user['uid'] = authData.uid;
                user['token'] = authData.Yd;
                user['expire'] = new Date().getTime() + 864000;
                delete user.password;
                delete user.cpassword;
                return this._setUserInDB(user).then(() => {
                    return {
                        uid: authData.uid,
                        token: null,
                        email: authData.email,
                        username: null,
                        firstname: null,
                        lastname: null,
                        expire: 0,
                        tokenValid: false
                    };
                });
            }).catch((err) => {
                this.logger.handleError(err);
                return err;
            });
    }

    /**
     * Set new User in Firebase database
     * @param user
     * @private
     */
    _setUserInDB(user) {
        return this._database.ref('/users/' + user.uid).set(user);
    }

    /**
     * Sign user in to Firebase
     * @param credentials
     * @returns {firebase.Promise<any>}
     */
    login(credentials) {
        return this._auth().signInWithEmailAndPassword(credentials.email, credentials.password)
            .then((authData) => {
                console.log("Authenticated successfully with payload-", authData);
                return this._database.ref('/users/' + authData.uid).once('value').then((snapshot) => {
                    console.log('SNAPSHOT AFTER LOGIN', snapshot.val());
                    return snapshot.val();
                });
            });
    }

    /**
     * Refresh User Token if it has expired
     * @param user
     * @returns {firebase.Promise<any>}
     */
    refreshUserToken(user) {
        console.log(user.token);
        return this._auth().currentUser.getToken(true).then((token) => {
            user.token = token;
            return this.updateUserInDB(user.uid, {token: user.token, expire: user.expire}).then(() => {
                console.log(user.token);
                return user;
            });
        });
    }

    /**
     * Update User Token and Expiry in Firebase database
     * @param uid
     * @param updates
     */
    updateUserInDB(uid, updates = {}) {
        return this._database.ref('/users/' + uid).update(updates);
    }

    /**
     * Load All Graph data from Firebase database
     * @param uid
     */
    // TODO: Add pagination, so that all data is not just loaded at once
    loadGraphs(uid) {
        return this._database.ref('/graphs/' + uid).on('value').then((snapshot) => {
            console.log('SNAPSHOT AFTER LOGIN', snapshot.val());
            return snapshot.val();
        });
    }

    /**
     * Load single graph data with unique Id from Firebase database
     * @param uid
     * @param graphId
     */
    loadGraph(uid, graphId) {
        return this._database.ref('/graphs/' + uid + '/' + graphId).once('value').then((snapshot) => {
            console.log('SNAPSHOT AFTER LOGIN', snapshot.val());
            return snapshot.val();
        });
    }

    /**
     * Save Graph data to Firebase database
     * @param uid
     * @param graphId
     * @param graph
     */
    saveGraph(uid, graphId, graph) {
        return this._database.ref('/graphs/' + uid + '/' + graphId).set(graph);
    }

    /**
     * Update Graph data in Firebase database
     * @param uid
     * @param graphId
     * @param updates
     */
    updateGraph(uid, graphId, updates) {
        return this._database.ref('/graphs/' + uid + '/' + graphId).update(updates);
    }

    /**
     * Load All Rest data from Firebase database
     * @param uid
     */
    loadRestfuls(uid) {
        return this._database.ref('/rests/' + uid).on('value').then((snapshot) => {
            console.log('SNAPSHOT AFTER LOGIN', snapshot.val());
            return snapshot.val();
        });
    }

    /**
     * Load single rest data with unique Id from Firebase database
     * @param uid
     * @param restfulId
     */
    loadRestful(uid, restfulId) {
        return this._database.ref('/rests/' + uid + '/' + restfulId).once('value').then((snapshot) => {
            console.log('SNAPSHOT AFTER LOGIN', snapshot.val());
            return snapshot.val();
        });
    }

    /**
     * Save Rest data to Firebase database
     * @param uid
     * @param restfulId
     * @param rest
     */
    saveRestful(uid, restfulId, rest) {
        return this._database.ref('/rests/' + uid + '/' + restfulId).set(rest);
    }

    /**
     * Update Rest data in Firebase database
     * @param uid
     * @param restfulId
     * @param updates
     */
    updateRestful(uid, restfulId, updates) {
        return this._database.ref('/rests/' + uid + '/' + restfulId).update(updates);
    }


    /**
     * Upload file from Local to Firebase Storage
     * @param _imageData
     * @param _progress
     * @returns {Observable}
     */
    uploadPhotoFromFile(_imageData, _progress) {

        return new Observable(observer => {
            let _time = new Date().getTime();
            let fileRef = firebase.storage().ref('images/sample-' + _time + '.jpg');
            let uploadTask = fileRef.put(_imageData['blob']);

            uploadTask.on('state_changed', function (snapshot) {
                console.log('state_changed', snapshot);
                _progress && _progress(snapshot)
            }, function (error) {
                console.log(JSON.stringify(error));
                observer.error(error)
            }, function () {
                // Handle successful uploads on complete
                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                let downloadURL = uploadTask.snapshot.downloadURL;

                // Metadata now contains the metadata for file
                fileRef.getMetadata().then((_metadata) => {

                    // save a reference to the image for listing purposes
                    let ref = firebase.database().ref('images');
                    ref.push({
                        'imageURL': downloadURL,
                        'thumb' : _imageData['thumb'],
                        'owner': this._auth().currentUser.uid,
                        'when': new Date().getTime(),
                        //'meta': _metadata
                    });
                    observer.next(uploadTask)
                }).catch((error) => {
                    // Uh-oh, an error occurred!
                    observer.error(error)
                });

            });
        });
    }

    /**
     * Get all references from database
     * @param reference
     * @returns {(a:(firebase.database.DataSnapshot|null), b?:string)=>any}
     */
    getDataObs(reference: string) {
        let ref = firebase.database().ref(reference);

        return ref.on('value', (snapshot) => {
            let arr = [];

            snapshot.forEach((childSnapshot: DataSnapshot): boolean => {
                let data = childSnapshot.val();
                data['id'] = childSnapshot.key;
                arr.push(data);
                return true;
            });

            return arr;
        }, (error) => {
            console.log("ERROR:", error);
            return error;
        });
    }

}