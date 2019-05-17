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

export const request = (method, url, data, options) => {
    const settings = {
        method: method.toUpperCase(),
        'Accept': 'application/json',
        'Content-Type': options['Content-Type'] || 'application/json',
        credentials:  'same-origin',
    };

    const isGetRequest = settings.method === 'GET';

    if (data) {
        if (isGetRequest) {
            const finalUrl = `${url}${url.includes('?') ? '&' : '?'}${toQueryParams(data)}`;
            return fetchAndCheck(mapUriToBaseUrl(finalUrl), { ...settings, ...options }).then(toJson);
        }

        if (settings['Content-Type'].includes('json')) {
            settings.body = JSON.stringify(data);
        } else {
            settings.body = data;
        }

    }

    return fetchAndCheck(mapUriToBaseUrl(url), { ...settings, ...options }).then(toJson);
};

export const hGet = (url, data, options = {}) => request('GET', url, data, options);
export const hPost = (url, data, options = {}) => request('POST', url, data, options);
export const hPut = (url, data, options = {}) => request('PUT', url, data, options);
export const hPatch = (url, data, options = {}) => request('PATCH', url, data, options);
export const hDelete = (url, data, options = {}) => request('DELETE', url, data, options);