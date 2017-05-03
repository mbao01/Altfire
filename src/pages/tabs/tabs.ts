import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

import {GraphqlPage} from "../graphql/graphql";
import {RestfulPage} from "../restful/restful";

@Component({
    selector: 'page-tabs',
    templateUrl: 'tabs.html',
})
export class TabsPage {
    graphqlPage = GraphqlPage;
    restfulPage = RestfulPage;

    /**
     *
     * @param navCtrl
     * @param navParams
     */
    constructor(public navCtrl: NavController, public navParams: NavParams) {
    }

    /**
     * Initialize Graph and Rest operations count
     */
    ngOnInit() {
        console.log('ngOnInit Tabs');
    }

    /**
     * TODO: DELETE
     */
    ionViewDidLoad() {
        console.log('ionViewDidLoad Tabs');
    }
}
