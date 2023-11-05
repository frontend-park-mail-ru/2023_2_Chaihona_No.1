const noBodyRequests = ['GET', 'HEAD'];
const UNAUTHORISED_CODE = 401;

/**
 * Класс для создания запросов в Интернет
 * @class
 */
export class Requests {
    /**
     * Функция для создания запроса
     * @param url - url для отправки запроса
     * @param method - метод запроса
     * @param data - тело запроса (null если не требуется)
     * @returns {Promise<{data: any, status: number}|{data: null, status: number}>} -
     * результат запроса и статус
     */
    async make_request(url, method, data = null) {
        const params = {
            method,
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        if (!noBodyRequests.includes(method)) {
            params.body = JSON.stringify({body: data});
            //params.body = JSON.stringify(data)
        }

        const response = await fetch(url, params);

        try {
            const responseJson = await response.json();
            if (response.status === UNAUTHORISED_CODE) {
                window.router.redirect('/login');
            }
            return {
                status: response.status,
                data: responseJson,
            };
        } catch (e) {
            return {
                status: 500,
                data: null,
            };
        }
    }

    async blob_request(url) {
        const response = await fetch('http://127.0.0.1:8000/e000b0eee73c60f50e8b.png', {
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
        })
        const resBlob = await response.blob();
        return URL.createObjectURL(resBlob);
    }

    async multipart_post(url, data) {
        const params = {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        };
        
        params.body = JSON.stringify({body: data});
        const response = await fetch(url, params);

        try {
            const responseJson = await response.json();
            return {
                status: response.status,
                data: responseJson,
            };
        } catch (e) {
            return {
                status: 500,
                data: null,
            };
        }
    }
}
