import {Component, EventEmitter, Input, Output} from "@angular/core";
import {ReqHeader} from "../models/restful/request-header.model";

@Component({
    selector: 'request-header',
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
                <ion-checkbox class="centralize" (ionChange)="getInput({ key: key.value, value: value.value, checked: $event.checked })" [checked]="header.checked"></ion-checkbox>
            </ion-col>
            <ion-col no-padding no-margin>
                <ion-input type="text" placeholder="Key" name="key" #key (blur)="(key.value != header.key) ? getInput({ key: key.value, value: value.value, checked: header.checked }) : ''" [value]="header.key"></ion-input>
                <ion-input type="text" placeholder="Value" name="value" #value (blur)="(value.value != header.value) ? getInput({ key: key.value, value: value.value, checked: header.checked }) : ''" [value]="header.value"></ion-input>
            </ion-col>
            <ion-col col-1>
                <button ion-button icon-only full block clear class="centralize" (click)="deleteHeader()">
                    <ion-icon name="close" color="danger"></ion-icon>
                </button>
            </ion-col>
        </ion-row>
    `
})
export class RequestHeaderComponent {
    @Output('headerEvent') headerEvent = new EventEmitter();
    @Output('delete') delete = new EventEmitter();
    @Input('headerProperty') header: ReqHeader;

    constructor() {
    }

    getInput(header) {
        console.log(header.key+' = '+header.value);
        if(header.key && header.value){
            this.headerEvent.emit(header);
        }
    }

    deleteHeader(header){
        this.delete.emit(header);
    }
}