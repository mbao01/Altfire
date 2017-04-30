import {Injectable} from "@angular/core";
import {NativeStorage} from "@ionic-native/native-storage";
import {Storage} from '@ionic/storage';
import {GraphqlHTTPClient} from "./graphql.service";
import {RestfulService} from "./restful.service";

@Injectable()
export class StorageService {
    private _date = new Date();
    constructor (private nativeStorage: NativeStorage, private storage: Storage, private graphqlService: GraphqlHTTPClient, private restfulService: RestfulService) {
    }

    getItemInNStorage(ref) {
        return this.nativeStorage.getItem(ref);
    }

    setItemInNStorage(ref, data) {
        return this.nativeStorage.setItem(ref, data);
    }

    clearNStorage() {
        return this.nativeStorage.clear();
    }

    updateItemInNStorage(ref, data) {
        return this.nativeStorage.clear();
    }

    deleteItemInNStorage(ref) {
        return this.nativeStorage.remove(ref);
    }

    getItemInStorage(key) {
        return this.storage.get(key);
    }

    setItemInStorage(key, value) {
        return this.storage.set(key, value);
    }

    clearStorage() {
        return this.storage.clear();
    }

    updateItemInStorage() {
        return this.storage.clear();
    }

    deleteItemInStorage(key) {
        return this.storage.remove(key);
    }

    getUser() {
        return this.getItemInNStorage('user');
    }

    setUser(data) {
        data.expire = this._date.getTime() + 864000;
        return this.setItemInNStorage('user', data).then((user) => {
            return user;
        });
    }

    removeUser() {
        return this.deleteItemInNStorage('user');
    }

    deleteToken() {
        return this.getUser().then((user) => {
            user.token = '';
            this.setUser(user);
        });
    }

    // For All Users
    saveRecentGraph(data) {
        this.setItemInStorage('graphql', data);
    }

    saveRecentRestful(data) {
        this.setItemInStorage('restful', data);
    }

    getRecentGraph() {
        return this.getItemInStorage('graphql');
    }

    getRecentRestful() {
        return this.getItemInStorage('restful');
    }

    getAltfireApp() {
        return this.getItemInNStorage('altfire');
    }

    setAltfireApp() {
        const appId = '';
        return this.setItemInNStorage('altfire', { appId: appId });
    }

    renderData() {
        this.getRecentGraph().then((data) => {
            if(data && data.graph) {
                this.graphqlService.updateGraph(data.graph);
            }
        });
        this.getRecentRestful().then((data) => {
            if(data && data.rest) {
                this.restfulService.updateRest(data.rest);
            }
        });
    }

}