import {Component} from '@angular/core';
import {AlertController, NavController, PopoverController} from 'ionic-angular';
import {GraphqlHTTPClient} from "../../services/graphql.service";
import {Graph} from "../../models/graphql/graphql.model";
import {GraphHeader} from "../../models/graphql/graphql-header.model";
import {AuthService} from "../../services/auth.service";
import {StorageService} from "../../services/storage.service";
import {User} from "../../models/user.model";
import {HelperService} from "../../services/helpers";
import {PopoverComponent} from "../../components/popover";

@Component({
    selector: 'page-graphql',
    templateUrl: 'graphql.html',
})
export class GraphqlPage {
    graph: Graph = this.graphqlService.getGraph();
    user: User;
    endpoint_set: boolean = false;
    segment: string = 'home';
    header_detail: (number | boolean)[];
    response_valid: boolean;
    state: string = '';
    bareminimun: String =
`   
    # Welcome to Altfire GraphiQL Client
    #
    # Altfire is a mobile IDE for writing, validating, and
    # testing GraphQL queries.
    #
    # Type queries here, and you will see intelligent typeaheads 
    # aware of the current GraphQL type schema and
    # live syntax and validation errors highlighted within the text.
    #
    # Press the run button above to execute the query, and the result
    # will appear automatically.    
`;

    constructor(
        public navCtrl: NavController,
        private popoverCtrl: PopoverController,
        private alertCtrl: AlertController,
        private graphqlService: GraphqlHTTPClient,
        private authService: AuthService,
        private storageService: StorageService,
        private h: HelperService) { }

    ionViewDidLoad() {
        console.log('ionViewDidLoad Graphql');
    }

    ngOnInit() {
        this.graph = this.graphqlService.getGraph();
        this.user = this.authService.getUser();
    }

    presentPopover(myEvent) {
        let popover = this.popoverCtrl.create(PopoverComponent);
        popover.present({
            ev: myEvent
        });
    }

    onSetEndpoint(endpoint) {
        let url = endpoint;
        this.endpoint_set = false;
        if(url) {
            let href = url.match(/^(((ht|f)tps?:\/\/)?.+\.[a-z]{2,4})/ig);
            if(href && href[0]) {
                this.graph.endpoint = this.graphqlService.validateEndpoint(url);
                this.endpoint_set = true;
                console.log(this.graph.endpoint);
                this.onGraphChange(this.graph);
            }
        }
    }

    onSetQuery(query: string) {
        if(query) {
            this.graph.query_type = 'query';
            this.graph.query = query;
            if ((query.trim().match(/^mutation/))) {
                this.graph.query_type = 'mutation';
            }
            this.onGraphChange(this.graph);
        }
    }

    onSendQuery() {
        if(this.graph.endpoint) {
            let loading = this.h.loader({msg: 'Fetching . . .', dismissOnPageChange: true});
            loading.present();
            this.graphqlService.query(this.graph).then((data) => {
                console.log(data);
                this.onSuccess(data);
                loading.dismiss();
            }).catch((err) => {
                console.log(err);
                this.onFailure(err);
                loading.dismiss();
            });
            this.storageService.saveRecentGraph({ graph: this.graph });
        }
    }

    onGraphChange(graph: Graph) {
        this.graph = this.graphqlService.updateGraph(graph);
    }

    onShowToast(data: string, duration?: number) {
        this.h.toast({msg: data, duration: duration ? duration : 2000}).present();
    }

    onSuccess = (data) => {
        this.graph.response = data;
        this.response_valid = true;
        this.state = 'response';
    };

    onFailure = (error) => {
        this.graph.response = error;
        this.response_valid = false;
        let errorAlert = this.alertCtrl.create({
            title: 'ERROR',
            message: error,
            buttons: ['OK']
        });
        errorAlert.present();
    };

    onToggleState(state: string) {
        this.state = (state == 'query') ? 'response' : (state == 'response') ? 'query' : '';
    }


    getAttributes(data: Array<any>) {
        return this.graphqlService.attributes(data);
    }

    onSetHeaders(header: GraphHeader, index: number) {
        if(header && header.key && header.value) {
            console.log('Headers SET: ', header);
            this.graph.headers.splice(index, 1, header);
            this.onGraphChange(this.graph);
            if(header.checked) {
                this.onShowToast('Header added successfully');
            }
        }
        this.header_detail = this.getAttributes(this.graph.headers);
    }

    onAddNewHeader() {
        let lastItemIndex = this.graph.headers.length;
        if(this.graph.headers && this.graph.headers[lastItemIndex-1].key && this.graph.headers[lastItemIndex-1].value) {
            this.graph.headers.push({
                key: '',
                value: '',
                checked: false
            });
            this.onGraphChange(this.graph);
        } else {
            this.onShowToast('You have an empty header, let\'s go one at a time, shall we?');
        }
        this.header_detail = this.getAttributes(this.graph.headers);
    }

    onDeleteHeader(index: number) {
        let size = this.graph.headers.length;
        let deleteHeaderWithContent: boolean = false;
        console.log(size);

        if(size > 1 && this.graph.headers[index]) {
            if(this.graph.headers[index].key) {
                deleteHeaderWithContent = true;
            }
            this.graph.headers.splice(index, 1);
        }
        if ( size == 1) {
            if(this.graph.headers[index].key) {
                deleteHeaderWithContent = true;
            }
            this.graph.headers[0] = {
                key: '',
                value: '',
                checked: false
            };
        }
        if(deleteHeaderWithContent) {
            this.onShowToast('Header deleted Successfully');
        }
        this.header_detail = this.getAttributes(this.graph.headers);
        this.onGraphChange(this.graph);
    }

    colorify(json) {
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            var cls = 'number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                } else {
                    cls = 'string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
    }

}
