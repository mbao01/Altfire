import {Component} from "@angular/core";

@Component({
    selector: 'request-authorization',
    styles: [``],
    template: `
        <ion-row>
            <ion-col no-padding no-margin>
                <ion-list>
                    <ion-item>
                        <ion-input type="text" placeholder="Username"></ion-input>
                    </ion-item>
    
                    <ion-item>
                        <ion-input type="text" placeholder="Password"></ion-input>
                    </ion-item>
                </ion-list>
            </ion-col>
            <ion-item no-lines no-padding no-margin text-center>
                <ion-label> Show Password </ion-label>
                <ion-checkbox [(ngModel)]="mushrooms"></ion-checkbox>
            </ion-item>
        </ion-row>
    `
})
export class RequestAuthorizationComponent {
    mushrooms: boolean;
    val: string;
}