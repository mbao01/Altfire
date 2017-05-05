import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Rest} from "../../models/restful/restful.model";
import {Graph} from "../../models/graphql/graphql.model";
import {GraphPage} from "./graph/graph";
import {RestPage} from "./rest/rest";

@Component({
    selector: 'page-history',
    templateUrl: 'history.html'
})
export class HistoryPage {
    restPage = RestPage;
    graphPage = GraphPage;

    constructor(public navCtrl: NavController) {
    }

    onLoadData(index: number, type: string, data: Rest | Graph) {
        this.navCtrl.push(type === 'rest' ? this.restPage : this.graphPage, {index, data});
    }

    /**
     onShowOptions(event: MouseEvent) {
    const popover = this.popoverCtrl.create(DBOptionsPage);
    const loading = this.loadingCtrl.create({
      content: 'Please wait. . .'
    });
    popover.present({ ev: event });
    popover.onDidDismiss( data => {
      if(data && data.action == 'store') {
        loading.present();
        if(!this.recipes || this.recipes.length < 1) {
          loading.dismiss();
          this.handleError('Error Saving List', { message: 'Cannot save empty list! Please add a recipe or load list'});
          return;
        } else {
          this.authService.getActiveUser().getToken().then(res => {
            console.log(res);
            this.firebaseService.store('recipe', res, this.recipes).subscribe(
                (res: any) => {
                  console.log('success: ');
                  console.log(res);
                  loading.dismiss();
                },
                err => {
                  console.log('error: ');
                  console.log(err);
                  this.handleError('Failed to Save', err.json());
                  loading.dismiss();
                }
            );
          }).catch(err => {
            console.log(err);
            this.handleError('Invalid User!', err);
            loading.dismiss();
          });
        }
      } else if(data && data.action == 'load') {
        loading.present();
        this.authService.getActiveUser().getToken().then(res => {
          console.log(res);
          this.firebaseService.fetch('recipe', res).subscribe(
              (res: Recipe[]) => {
                console.log('success: ');
                console.log(res);
                if(res) {
                  this.recipes = res;
                }
                loading.dismiss();
              },
              err => {
                console.log('error: ');
                console.log(err);
                this.handleError('Failed to Load', err.json());
                loading.dismiss();
              }
          );
        }).catch(err => {
          console.log(err);
          this.handleError('Invalid User!', err);
          loading.dismiss();
        });
      }
    });
  }
     **/
}
