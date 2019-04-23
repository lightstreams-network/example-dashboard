import {Injectable} from '@angular/core';
import {Server, ServerResponseHandler} from "./server";
import {SessionState} from "../../store/state/session";
import {ActionsDispatcher} from "../../store/actions-dispatcher";
import {Http} from "@angular/http";
import {Environment} from "../../environment";

@Injectable()
export class LocalServer {
    service: Server ;

    constructor(private http: Http,
                actions: ActionsDispatcher,
                sessionState: SessionState) {

        let responseHandler = new ServerResponseHandler(actions, sessionState);
        this.service = new Server(http, actions, responseHandler);

        this.service.baseUrl = Environment.LOCAL_SERVER;
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

    public getBlob(path, data): Promise<any>  {
       return this.service.getBlob(path, data);
    }

    /*
    public getData(url: string, contentAddr: string, reader: FileReader) {
        url = `${this.service.baseUrl}${url}`;
        let data = {contentAddr: contentAddr};
        let observable$ = this.http.post(url, data)
           .map((response) => {
            return new Blob([response]);
        });

        observable$.subscribe( (response: any) => {
            reader.readAsDataURL(response);
        });
    }
    */
}
