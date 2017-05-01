import {ErrorHandler, Injectable} from '@angular/core';
import 'rxjs/Rx';
import {Observable} from "rxjs/Observable";


import * as firebase from "firebase";
import DataSnapshot = firebase.database.DataSnapshot;

@Injectable()
export class FirebaseService {

    /**
     * Firebase Service Constructor
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
    }

    /**
     * Get user authentication state from Firebase
     * @returns {any}
     */
    auth() {
        return firebase.auth();
    }

    /**
     * Get current user fro Firebase
     * @returns {()=>()=>any}
     */
    currentUser() {
        return firebase.auth().currentUser
    }

    /**
     * Sign user out of Firebase
     */
    logout() {
        firebase.auth().signOut();
    }

    /**
     * Create new User using EmailAndPassword method in Firebase
     * @param credentials
     * @returns {Bluebird<R>}
     */
    createEmailUser(credentials) {
        return firebase.auth().createUserWithEmailAndPassword(credentials.email, credentials.password)
            .then((authData) => {
                console.log("User created successfully with payload-", authData);
                return authData;
            }).catch((err) => {
                this.logger.handleError(err);
                return err;
            });
    }

    /**
     * Sign user in to Firebase
     * @param credentials
     * @returns {Bluebird<R>}
     */
    login(credentials) {
        console.log('User Credentials: LOGIN', credentials);
        return firebase.auth().signInWithEmailAndPassword(credentials.email, credentials.password)
            .then((authData) => {
                console.log("Authenticated successfully with payload-", authData);
                return {
                    uid: authData.uid,
                    token: authData.j,
                    email: authData.email,
                    username: authData.uid,
                    firstname: authData.firstname,
                    lastname: authData.lastname,
                    expire: 1000000,
                    tokenValid: true
                };
            });
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
                        'owner': firebase.auth().currentUser.uid,
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
     * @returns {void|any|Server}
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
        },
        (error) => {
            console.log("ERROR:", error);
            return error;
        });
    }
}