import {Requests} from "./requests.js";
import {restEndpoints} from "../configs/rest_config.js";
import {backendUrl} from "../configs/rest_config.js";

export class Api extends Requests {
    async getUserProfile(id) {
        const endpoint = restEndpoints['getProfile'];
        const url = backendUrl + endpoint.url.replace("{id}", id);
        return await this.make_request(url, endpoint.method);
    }

    async getUserPosts(id) {
        const endpoint = restEndpoints["getPosts"];
        const url =  backendUrl + endpoint.url.replace("{id}", id);
        return await this.make_request(url, endpoint.method);
    }

    async login(login, password) {
        const endpoint = restEndpoints['login'];
        const url = backendUrl + endpoint.url;
        return await this.make_request(url, endpoint.method, {login, password});
    }

    async logout() {
        const endpoint =restEndpoints['logout'];
        const url = backendUrl + endpoint.url;
        return await this.make_request(url, endpoint.method)
    }

    async isAuth() {
        const endpoint = restEndpoints['checkAuth'];
        const url = backendUrl + endpoint.url;
        return await this.make_request(url, endpoint.method,);
    }

    async register(login, password, isAuthor) {
        const endpoint = restEndpoints['register'];
        const url = backendUrl + endpoint.url;
        let user_type;
        if (isAuthor) {
            user_type = 'creator';
        } else {
            user_type = 'simple_user';
        }
        return await this.make_request(url, endpoint.method, {login, password, user_type});
    }
}