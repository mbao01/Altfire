import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import {Rest} from "../models/restful/restful.model";
import 'rxjs/add/operator/toPromise';

@Injectable()
export class RestfulService {

    private rest: Rest = {
        request_url: '',
        request_type: 'get',
        request_header: [
            {
                key: '',
                value: '',
                checked: false
            }
        ],
        request_body: [
            {
                key: '',
                value: '',
                checked: false
            }
        ],
        request_body_type: 'x-www-form-urlencoded',
        request_authorization_type: 'no_auth',
        response: null
    };

    constructor(private http: Http) {

    }

    getRest() {
        return this.rest;
    }

    updateRest(rest: Rest) {
        return this.rest = rest;
    }

    validateUrl(url: string) {
        if(!url.match(/((ht|f)tps?:\/\/)/)) {
            url = 'http://' + url;
        }
        return this.http.head(url.trim()).toPromise().then((data) => {
            return (data && data.statusText && data.statusText == 'OK' && data.ok) ? url : '';
        }).catch((err) => {
            return err;
        });
    }

    get(rest: Rest) {
        this.rest = rest;
        if(rest.request_header) {
            return this.http.get(rest.request_url, { headers: this._flattenHeaders(rest.request_header) }).toPromise();
        } else {
            return this.http.get(rest.request_url).toPromise();
        }
    }

    post(rest: Rest) {
        this.rest = rest;
        if(rest.request_header && rest.request_body) {
            return this.http.post(rest.request_url, this._flattenBody(rest.request_body, rest.request_body_type), { headers: this._flattenHeaders(rest.request_header) }).toPromise();
        } else {
            return this.http.get(rest.request_url).toPromise();
        }
    }

    put(rest: Rest) {
        this.rest = rest;
        return this.http.put(rest.request_url, this._flattenBody(rest.request_body, rest.request_body_type)).toPromise();
    }

    patch(rest: Rest) {
        this.rest = rest;
        return this.http.patch(rest.request_url, this._flattenBody(rest.request_body, rest.request_body_type)).toPromise();
    }

    delete(rest: Rest) {
        this.rest = rest;
        return this.http.delete(rest.request_url, this._flattenBody(rest.request_body, rest.request_body_type)).toPromise();
    }

    attributes(array) {
        let c = 0, b = true;
        for(let a of array) {
            if(a['value'] && a['key']) {
                if(!a['checked']) {
                    b = false;
                }
                c++;
            }
        }
        return [c, b];
    }

    _flattenHeaders(roughHeaders?) {
        let headers = new Headers();
        for(let h of roughHeaders) {
            if(h['checked'] == true && h['value'] && h['key']) {
                headers.append(h['key'], h['value']);
            }
        }
        return headers;
    }

    _flattenBody(roughBody, bodyType) {
        let body = '';
        if(bodyType = 'x-www-form-urlencoded') {
            for (let h of roughBody) {
                body += h['key']+'='+encodeURIComponent(h['value'])
                        .replace(/\%0(?:D|d)(?=\%0(?:A|a))\%0(A|a)/g, '&')
                        .replace(/\%0(?:D|d)/g, '&')
                        .replace(/\%0(?:A|a)/g, '&')
                        .replace(/\&/g, '%0D%0A')
                        .replace(/\%20/g, '+');
            }
            return body;
        } else if (bodyType = 'form-data') {

        } else if (bodyType = 'raw') {
            return roughBody;
        }
    }
}