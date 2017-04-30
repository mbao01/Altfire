import {ReqBody} from "./request-body.model";
import {ReqHeader} from "./request-header.model";
import {ReqAuthorization} from "./request-authorization.model";

export {ReqBody} from "./request-body.model";
export {ReqHeader} from "./request-header.model";
export {ReqAuthorization} from "./request-authorization.model";

export interface Rest {
    request_url?: string;
    request_type: string;
    request_body_type?: string;
    request_body?: ReqBody[];
    request_header?: ReqHeader[];
    request_authorization_type?: string;
    request_authorization?: ReqAuthorization;
    response?: any;
}