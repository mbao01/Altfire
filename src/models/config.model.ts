export interface Config {
        PRODUCTION: boolean,
        API_URL: string,
        response_valid: boolean,
        segment: string,
        queryDataResponse: string,
        request_type: string,
        authorization_type: string,
        request_url_set: boolean,
        request_header_detail:  Array<any>,
        request_body_detail: Array<any>,
        request_auth_set: boolean,
        bareminimun: string
};