import {Injectable} from "@angular/core";
import {NativeStorage} from "@ionic-native/native-storage";
import {Storage} from '@ionic/storage';
import {GraphqlHTTPClient} from "./graphql.service";
import {RestfulService} from "./restful.service";

@Injectable()
export class StorageService {

    /**
     * Storage Service Constructor
     * @param nativeStorage
     * @param storage
     * @param graphqlService
     * @param restfulService
     */
    constructor (private nativeStorage: NativeStorage, private storage: Storage, private graphqlService: GraphqlHTTPClient, private restfulService: RestfulService) {
    }

    /**
     * Get Item from Native Storage
     * @param ref
     * @returns {Promise<any>}
     */
    getItemInNStorage(ref) {
        return this.nativeStorage.getItem(ref);
    }

    /**
     * Set Item in Native Storage
     * @param ref
     * @param data
     * @returns {Promise<any>}
     */
    setItemInNStorage(ref, data) {
        return this.nativeStorage.setItem(ref, data);
    }

    /**
     * Clear Native Storage
     * @returns {Promise<any>}
     */
    clearNStorage() {
        return this.nativeStorage.clear();
    }

    /**
     * Update Item from Native Storage
     * @param ref
     * @param data
     * @returns {Promise<any>}
     */
    updateItemInNStorage(ref, data) {
        return this.nativeStorage.clear();
    }

    /**
     * Delete Item from Native Storage
     * @param ref
     * @returns {Promise<any>}
     */
    deleteItemInNStorage(ref) {
        return this.nativeStorage.remove(ref);
    }

    /**
     * Get Item from LocalStorage
     * @param key
     * @returns {Promise<any>}
     */
    getItemInStorage(key) {
        return this.storage.get(key);
    }

    /**
     * Set Item in LocalStorage
     * @param key
     * @param value
     * @returns {Promise<any>}
     */
    setItemInStorage(key, value) {
        return this.storage.set(key, value);
    }

    /**
     * Clear LocalStorage
     * @returns {Promise<null>}
     */
    clearStorage() {
        return this.storage.clear();
    }

    /**
     * Update Item in LocalStorage
     * @returns {Promise<null>}
     */
    updateItemInStorage() {
        return this.storage.clear();
    }

    /**
     * Delete Item in LocalStorage
     * @param key
     * @returns {Promise<any>}
     */
    deleteItemInStorage(key) {
        return this.storage.remove(key);
    }

    /**
     * Get User from NativeStorage
     * @returns {Promise<any>}
     */
    getUser() {
        return this.getItemInNStorage('user');
    }

    /**
     * Set User in NativeStorage
     * @param data
     * @returns {Promise<any>}
     */
    setUser(data) {
        return this.setItemInNStorage('user', data).then((user) => {
            return user;
        });
    }

    /**
     * Delete User in NativeStorage
     * @returns {Promise<any>}
     */
    removeUser() {
        return this.deleteItemInNStorage('user');
    }

    /**
     * Delete User Token
     * @returns {Promise<any>}
     */
    deleteToken() {
        return this.getUser().then((user) => {
            user.token = '';
            this.setUser(user);
        });
    }

    /**
     * Save Last Graph query and response to LocalStorage
     * @param data
     */
    saveRecentGraph(data) {
        this.setItemInStorage('graphql', data);
    }

    /**
     * Save Last Rest request and response to LocalStorage
     * @param data
     */
    saveRecentRestful(data) {
        this.setItemInStorage('restful', data);
    }

    /**
     * Get Last Graph data from LocalStorage
     * @returns {Promise<any>}
     */
    getRecentGraph() {
        return this.getItemInStorage('graphql');
    }

    /**
     * Get Last Rest data from LocalStorage
     * @returns {Promise<any>}
     */
    getRecentRestful() {
        return this.getItemInStorage('restful');
    }

    /**
     * Get Altfire Unique App Id from NativeStorage
     * @returns {Promise<any>}
     */
    getAltfireApp() {
        return this.getItemInNStorage('altfire');
    }

    /**
     * Set Altfire Unique App Id in NativeStorage
     * @returns {Promise<any>}
     */
    setAltfireApp() {
        const appId = '';
        return this.setItemInNStorage('altfire', { appId: appId });
    }

    /**
     * Render Graph and Rest data
     */
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