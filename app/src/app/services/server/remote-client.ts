import {Injectable} from '@angular/core';
import {Server, ServerResponseHandler} from "./server";
import {SessionState} from "../../store/state/session";
import {ActionsDispatcher} from "../../store/actions-dispatcher";
import {Http} from "@angular/http";
import {Environment} from "../../environment";

@Injectable()
export class RemoteClient {
    service: Server ;

    constructor(private http: Http,
                actions: ActionsDispatcher,
                sessionState: SessionState) {

        let responseHandler = new ServerResponseHandler(actions, sessionState);
        this.service = new Server(http, actions, responseHandler);
    }

    public post(client, path, data): Promise<any> {
        this.service.baseUrl = "http://" + client;
        return this.service.post(path, data);
    }

    public get(client, path): Promise<any>  {
        this.service.baseUrl = "http://" + client;
        return this.service.get(path);
    }

    public patch(client, path, id, data): Promise<any> {
        this.service.baseUrl = "http://" + client;
        return this.service.patch(path, id, data);
    }

    public put(client, path, id, data): Promise<any> {
        this.service.baseUrl = "http://" + client;
        return this.service.put(path, id, data);
    }
}
