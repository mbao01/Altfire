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

    count: { graph?: number, rest?: number };

    constructor(public navCtrl: NavController, public navParams: NavParams) {
    }

    ngOnInit() {
        console.log('ngOnInit Tabs');
        this.count = this.navParams.data ? this.navParams.data : {};
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad Tabs');
    }

    // onToggleView(page: any){
    //     if(this.navCtrl.last() != page) {
    //         this.navCtrl.push(page);
    //     }
    // }

}
