const noBodyRequests = ['GET', 'HEAD']

export class Requests {
    async make_request(url, method, data=null) {
        const params = {
            method,
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        if (!noBodyRequests.includes(method)) {
            params.body = JSON.stringify(data);
        }

        const response = await fetch(url, params);
	
        try {
            let responseJson = ''
	    if (url !== 'http://212.233.89.163:8001/api/v1/login'){
	        responseJson = await response.json();
	    }
            return {
                status: response.status,
                data: responseJson
            };
        } catch (e) {
            return {
                status: 500,
                data: null
            }
        }
    }
}
