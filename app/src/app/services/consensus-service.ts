import {Injectable} from '@angular/core';
import {ActionsDispatcher} from "../store/actions-dispatcher";
import {Http, Response, Headers} from "@angular/http";
import {ServerActions} from "../store/actions/server";
import {Server, IResponseHandler} from "./server/server";

@Injectable()
export class ConsensusService {

    service: Server;

    constructor(http: Http,
                actions: ActionsDispatcher) {

        let responseHandler = new ConsensusResponseHandler(actions);
        this.service = new Server(http, actions, responseHandler);
    }

    getStatus(validatorUrl: string): Promise<any> {
        this.service.baseUrl = validatorUrl;
        return this.get('/status');
    }

    public post(path, data): Promise<any> {
        return this.service.post(path, data);
    }

    public get(path): Promise<any>  {
        return this.service.get(path);
    }

    public patch(path, id, data): Promise<any> {
        return this.service.patch(path, id, data);
    }

    public put(path, id, data): Promise<any> {
        return this.service.put(path, id, data);
    }
}

export class ConsensusResponseHandler implements IResponseHandler {
    constructor(private actions: ActionsDispatcher) {
    }

    public createHeaders(): Headers {
        return new Headers({
            'Accept': 'application/json'
        });
    }

    public onComplete(request: any, response: Response): any {
        let data = response.json();
        if (data.error.length > 0) {
            throw(data.error);
        }

        // if (!data.result || data.result.length !== 2) {
        //     throw("Malformed json response. Expected result field array");
        // }

        // let result = data.result[1];

        let payload = {
            request: request,
            response: response,
            data: data['data']
        };

        this.actions.dispatch(ServerActions.REQUEST_COMPLETE, payload);
        return payload.data;
    }
}
