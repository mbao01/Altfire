import {GraphHeader} from "./graphql-header.model";
export {GraphHeader} from "./graphql-header.model";

export interface Graph {
    endpoint: string;
    query: string;
    query_type: string;
    headers?: GraphHeader[];
    variable?: Array<any>;
    credentials?: string;
    response?: any;
}