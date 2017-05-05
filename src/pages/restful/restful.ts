import {Component, ErrorHandler} from '@angular/core';
import {
    AlertController, NavController, PopoverController
} from 'ionic-angular';
import {RestfulService} from "../../services/restful.service";
import {Rest} from "../../models/restful/restful.model";
import {ReqHeader} from "../../models/restful/restful.model";
import {ReqBody} from "../../models/restful/restful.model";
import {StorageService} from "../../services/storage.service";
import {User} from "../../models/user.model";
import {AuthService} from "../../services/auth.service";
import {HelperService} from "../../services/helpers";
import {PopoverComponent} from "../../components/popover";
import {Response} from "@angular/http";

@Component({
    selector: 'page-restful',
    templateUrl: 'restful.html',
})
export class RestfulPage {
    response_valid: boolean = false;
    user: User;
    segment: string = 'home';
    queryDataResponse: string = '';
    request_url: string = '';
    request_header_detail: (number | boolean)[] = [0, false];
    request_body_detail: (number | boolean)[] = [0, false];
    request_auth_set: boolean = false;
    bareminimun: string =
`   
  # Welcome to Altfire RESTful API Client
  #
  # Altfire is a mobile IDE for writing, validating, and
  # testing RESTful APIs and GraphQL queries.
  #
  # Press the play button below to send the request, and the result
  # will appear HERE automatically.    
`;
    rest: Rest = this.restfulService.getRest();

    /**
     *
     * @param navCtrl
     * @param alertCtrl
     * @param popoverCtrl
     * @param restfulService
     * @param authService
     * @param storageService
     * @param h
     */
    constructor(public navCtrl: NavController,
                private alertCtrl: AlertController,
                private popoverCtrl: PopoverController,
                private restfulService: RestfulService,
                private authService: AuthService,
                private storageService: StorageService,
                private h: HelperService,
                private logger: ErrorHandler) { }

    /**
     *
     */
    ionViewDidLoad() {
        console.log('ionViewDidLoad RESTful');
    }

    /**
     * Initialize last Rest request and User data
     */
    ngOnInit() {
        this.rest = this.restfulService.getRest();
        this.request_url = this.rest.request_url;
        this.user = this.authService.getUser();
    }

    /**
     * Show popover based on User State
     * @param myEvent
     */
    presentPopover(myEvent) {
        let popover = this.popoverCtrl.create(PopoverComponent);
        popover.present({
            ev: myEvent
        });
    }

    /**
     * Set Rest Request HTTP Method
     */
    showOptions() {
        const alert = this.alertCtrl.create({
            title: 'Request Type',
            inputs: [
                {
                    type: 'radio',
                    label: 'GET',
                    value: 'get',
                    checked: this.rest.request_type === 'get'
                },
                {
                    type: 'radio',
                    label: 'POST',
                    value: 'post',
                    checked: this.rest.request_type === 'post'
                },
                {
                    type: 'radio',
                    label: 'PUT',
                    value: 'put',
                    checked: this.rest.request_type === 'put'
                },
                {
                    type: 'radio',
                    label: 'PATCH',
                    value: 'patch',
                    checked: this.rest.request_type === 'patch'
                },
                {
                    type: 'radio',
                    label: 'DELETE',
                    value: 'delete'
                }
            ],
            buttons: [
                {
                    text: 'Cancel'
                },
                {
                    text: 'OK',
                    handler: data => {
                        this.rest.request_type = data;
                        this.onRestChange(this.rest);
                    }
                }
            ]
        });
        alert.present();
    }

    /**
     * Success handler for successful rest response
     * @param data
     */
    onSuccess(data: Response) {
        this.rest.response = data.headers.get('content-type').match(/application\/json/) ? data.json() : data;
        console.log(data.json());
        this.storageService.saveRecentRestful({rest: this.rest});
        this.response_valid = true;
    };

    /**
     * Failure handler for error response
     * @param error
     */
    onFailure(error) {
        this.rest.response = error;
        this.storageService.saveRecentRestful({rest: this.rest});
        this.response_valid = false;
        let errorAlert = this.alertCtrl.create({
            title: 'ERROR',
            message: error,
            buttons: ['OK']
        });
        errorAlert.present();
    };

    /**
     * Display toast message
     * @param data
     * @param duration
     */
    onShowToast(data: string, duration?: number) {
        this.h.toast({msg: data, duration: duration ? duration : 2000}).present();
    }

    /**
     * Send rest request and fetch rest response if request url is valid
     */
    onSendRequest() {
        if(this.rest.request_url) {
            let loading = this.h.loader({msg: 'Fetching . . .', dismissOnPageChange: true});
            loading.present();
            this.restfulService.method(this.rest.request_type, this.rest).then((response: Response) => {
                this.onSuccess(response);
                loading.dismiss();
            }).catch((err) => {
                this.logger.handleError(err);
                this.onFailure(err);
                loading.dismiss();
            });
        }
    }

    /**
     * Validate and Set Rest request url
     * @param inputUrl
     */
    onSetUrl(inputUrl) {
        let url = inputUrl;
        if(url) {
            let href = url.match(/(((ht|f)tps?:\/\/)?.+\.[a-z]{2,4})/ig);
            if(href && href[0]) {
                this.restfulService.validateUrl(href[0]).then(() => {
                    this.rest.request_url = url;
                    this.onRestChange(this.rest);
                }).catch((err) => {
                    this.logger.handleError(err);
                    this.onShowToast(err);
                });
            }
        }
    }

    /**
     * Calls Rest Service to
     * @param data
     * @returns {(number|boolean)[]}
     */
    getAttributes(data: Array<any>) {
        return this.restfulService.attributes(data);
    }

    /**
     * Set Rest Request Header
     * @param header
     * @param index
     */
    onSetHeaders(header: ReqHeader, index: number) {
        if(header && header.key && header.value) {
            this.rest.request_header.splice(index, 1, header);
            this.onRestChange(this.rest);
            if(header.checked) {
                this.onShowToast('Request header added successfully');
            }
        }
        this.request_header_detail = this.getAttributes(this.rest.request_header);
    }

    /**
     * Add New Rest Request Header
     */
    onAddNewHeader() {
        let lastItemIndex = this.rest.request_header.length;
        if(this.rest.request_header && this.rest.request_header[lastItemIndex-1].key && this.rest.request_header[lastItemIndex-1].value) {
            this.rest.request_header.push({
                key: '',
                value: '',
                checked: false
            });
            this.onRestChange(this.rest);
        } else {
            this.onShowToast('You have an empty header, let\'s go one at a time, shall we?');
        }
        this.request_header_detail = this.getAttributes(this.rest.request_header);
    }

    /**
     * Delete Rest Request Header
     * @param index
     */
    onDeleteHeader(index: number) {
        let size = this.rest.request_header.length;
        let deleteHeaderWithContent = false;

        if(size > 1 && this.rest.request_header[index]) {
            if(this.rest.request_header[index].key) {
                deleteHeaderWithContent = true;
            }
            this.rest.request_header.splice(index, 1);
        }
        if ( size == 1) {
            if(this.rest.request_header[index].key) {
                deleteHeaderWithContent = true;
            }
            this.rest.request_header[0] = {
                key: '',
                value: '',
                checked: false
            };
        }
        if(deleteHeaderWithContent) {
            this.onShowToast('Header deleted Successfully');
        }
        this.request_header_detail = this.getAttributes(this.rest.request_header);
        this.onRestChange(this.rest);
    }

    /**
     * Set Rest Request Body
     * @param body
     * @param index
     */
    onSetBody(body: ReqBody, index: number) {
        if(body && body.key && body.value) {
            this.rest.request_body.splice(index, 1, body);
            this.onShowToast('Request body added successfully');
        }
        this.request_body_detail = this.getAttributes(this.rest.request_body);
        this.onRestChange(this.rest);
    }

    /**
     * Set Rest Request Body Type
     * @param body_type
     */
    onSetBodyType(body_type) {
        if(body_type && this.rest) {
            this.rest.request_body_type = body_type;
        }
        this.onRestChange(this.rest);
    }

    /**
     * Add New Rest Request Body
     */
    onAddNewBody() {
        let lastItemIndex = this.rest.request_body.length;
        if(this.rest.request_body && this.rest.request_body[lastItemIndex-1].key && this.rest.request_body[lastItemIndex-1].value) {
            this.rest.request_body.push({
                key: '',
                value: '',
                checked: false
            });
            this.onRestChange(this.rest);
        } else {
            this.onShowToast('You have an empty body, let\'s go one at a time, shall we?');
        }
        this.request_body_detail = this.getAttributes(this.rest.request_body);
    }

    /**
     * Delete Rest Request Body
     * @param index
     */
    onDeleteBody(index: number) {
        let size = this.rest.request_body.length;
        if(size > 1 && this.rest.request_body[index]) {
            this.rest.request_body.splice(index, 1);
            this.onShowToast('Request body deleted');
        }
        if ( size == 1) {
            this.rest.request_body[0] = {
                key: '',
                value: '',
                checked: false
            };
            this.request_body_detail = this.getAttributes(this.rest.request_body);
        }
        this.onRestChange(this.rest);
    }

    /**
     * Call Rest Service to Update Rest data in Localstorage
     * @param rest
     */
    onRestChange(rest: Rest) {
        this.rest = this.restfulService.updateRest(rest);
    }

}