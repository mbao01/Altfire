import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Graph} from "../models/graphql/graphql.model";

@Injectable()
export class GraphqlHTTPClient {

    params: { url: string, credentials: string };
    headers;
    private graph: Graph = {
        endpoint: '',
        query: '',
        query_type: '',
        headers: [
            {
                key: '',
                value: '',
                checked: false
            }
        ],
        credentials: '',
        response: null
    };

    constructor(private http: Http) {

    }

    query(graph: Graph) {
        let query = graph.query;
        if (!graph.endpoint) throw new Error('Missing url parameter');
        let headers = new Headers();
        if(graph.headers) {
            headers = this._flattenHeaders(graph.headers, headers);
        }
        headers.append('Content-Type', 'application/json');

        // TODO: Unsure of the logic behind graphql mutations
        // if(graph.query_type == 'mutation') {
        //     query = graph.query.replace(/^mutation/, '').trim();
        // }

        let req = new Request(graph.endpoint, {
            method: 'POST',
            body: JSON.stringify({
                query: query,
                variables: graph.variable
            }),
            headers: headers,
            credentials: graph.credentials
        });

        return fetch(req).then((res) => {
                    return res.json()
                }).catch((err) => {

                    if (err.errors && err.errors.length) {
                        throw this.GraphqlError(graph.query, err.errors)
                    }
                    return err

                });
    };

    GraphqlError = (query, errors) => {
        let e = new Error(errors.map(function (e) { return e.message }).join('\n') + '\n' + this.highlightQuery(query, errors));

        e['originalErrors'] = errors;

        return e
    };

    highlightQuery = (query, errors) => {
        let locations = errors.map((e) => { return e.locations })
            .reduce((a, b) => {
                return a.concat(b)
            }, []);

        let queryHighlight = '';

        query.split('\n').forEach((row, index) => {
            let line = index + 1;
            let lineErrors = locations.filter(function (loc) { return loc.line === line });

            queryHighlight += row + '\n';

            if (lineErrors.length) {
                let errorHighlight = [];

                lineErrors.forEach((line) => {
                    for (let i = 0; i < 8; i++) {
                        errorHighlight[line.column + i] = '~'
                    }
                });

                for (let i = 0; i < errorHighlight.length; i++) {
                    queryHighlight += errorHighlight[i] || ' '
                }
                queryHighlight += '\n'
            }
        });

        return queryHighlight
    };

    validateEndpoint(endpoint: string) {
        if(!endpoint.match(/((ht|f)tps?:\/\/)/)) {
            endpoint = 'http://' + endpoint;
        }
        return endpoint;
    }

    getGraph() {
        // SET graph from either localStorage or environment variables
        return this.graph;
    }

    updateGraph(graph: Graph) {
        return this.graph = graph;
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

    _flattenHeaders(roughHeaders, headers) {
        for(let h of roughHeaders) {
            if(h['checked'] == true && h['value'] && h['key']) {
                headers.append(h['key'], h['value']);
            }
        }
        return headers;
    }
}