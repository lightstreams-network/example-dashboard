import {Injectable} from '@angular/core';
import {Server, ServerResponseHandler} from "./server";
import {SessionState} from "../../store/state/session";
import {ActionsDispatcher} from "../../store/actions-dispatcher";
import {Http} from "@angular/http";
import {Environment} from "../../environment";

@Injectable()
export class AppServer {

    service: Server;

    constructor(http: Http,
                actions: ActionsDispatcher,
                sessionState: SessionState) {

        let responseHandler = new ServerResponseHandler(actions, sessionState);
        this.service = new Server(http, actions, responseHandler);
        this.service.baseUrl = Environment.APP_SERVER;
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
