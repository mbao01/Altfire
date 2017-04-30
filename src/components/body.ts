import {Component, EventEmitter, Input, Output} from "@angular/core";
import {ReqBody} from "../models/restful/request-body.model";

@Component({
    selector: 'request-body',
    styles: [`
        .centralize {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
        input.text-input {
            margin: 10px;
        }
    `],
    template: `
        <ion-row no-padding no-margin>
            <ion-col no-margin col-1>
                <ion-checkbox class="centralize" (click)="getInput({ key: key.value, value: value.value, checked: body.checked })" (ionChange)="body.checked = $event.checked" [checked]="body.checked"></ion-checkbox>
            </ion-col>
            <ion-col no-padding no-margin>
                <ion-input type="text" placeholder="Key" name="key" #key (blur)="getInput({ key: key.value, value: value.value, checked: body.checked })" [value]="body.key"></ion-input>
                <ion-input type="text" placeholder="Value" name="value" #value (blur)="getInput({ key: key.value, value: value.value, checked: body.checked })" [value]="body.value"></ion-input>
            </ion-col>
            <ion-col col-1>
                <button ion-button icon-only full block clear class="centralize" (click)="deletebody()">
                    <ion-icon name="close" color="danger"></ion-icon>
                </button>
            </ion-col>
        </ion-row>
    `
})
export class RequestBodyComponent {
    @Output('bodyEvent') bodyEvent = new EventEmitter();
    @Output('delete') delete = new EventEmitter();
    @Input('bodyProperty') body: ReqBody;

    constructor() {
    }

    getInput(body) {
        console.log(body.key+' = '+body.value);
        if(body.key && body.value){
            this.bodyEvent.emit(body);
        }
    }

    deletebody(body){
        this.delete.emit(body);
    }
}