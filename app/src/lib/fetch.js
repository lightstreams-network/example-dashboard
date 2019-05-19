import { SERVER_URL } from '../constants';

function getBaseUrl(uri = '') {
    return `${SERVER_URL}${uri}`;
}

// Note that the promise won't be rejected in case of HTTP 4xx or 5xx server responses.
// The promise will be resolved just as it would be for HTTP 2xx.
// So we inspect the response.status (response.ok is true for HTTP 2xx) and throw otherwise.
function checkStatus(response) {
    if (!response.ok) {
        const error = new Error(response.statusText);
        error.response = response;
        throw error;
    }
    return response;
}

function toJson(response) {
    // yields the result of JSON.parse(response)
    return response.json();
}

export const toQueryParams = (params) => {
    return Object.keys(params)
        .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
        .join('&');
};

export const mapUriToBaseUrl = (uri) => getBaseUrl(uri);

export const fetchAndCheck = (url, options) => fetch(url, options).then(checkStatus);

export const request = (method, url, data, options = {}) => {
    const settings = {
        method: method.toUpperCase(),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            ...options.headers,
        }
    };

    if (options.token) {
        settings.headers.Authorization = `Bearer ${options.token}`;
    }

    let finalUrl = url;
    if (data) {
        if (settings.method === 'GET') {
            finalUrl = `${url}${url.includes('?') ? '&' : '?'}${toQueryParams(data)}`;
        }

        if (settings.method === 'POST'){
            if (data instanceof FormData) {
                settings.headers = {
                    Authorization: `Bearer ${options.token}`,
                };
                settings.body = data;
            } else if (settings.headers['Content-Type'].includes('json')) {
                settings.body = JSON.stringify(data);
            } else {
                settings.body = data;
            }
        }
    }

    const response = fetchAndCheck(mapUriToBaseUrl(finalUrl), settings);
    if(settings.headers.Accept === 'application/json') {
        return response.then(toJson);
    }

    return response;
};

export const hGet = (url, data, options = {}) => request('GET', url, data, options);
export const hPost = (url, data, options = {}) => request('POST', url, data, options);
export const hPut = (url, data, options = {}) => request('PUT', url, data, options);
export const hPatch = (url, data, options = {}) => request('PATCH', url, data, options);
export const hDelete = (url, data, options = {}) => request('DELETE', url, data, options);