class Fetch {
    constructor(url) {
        this.url = url;
    }

    async request(endpoint, method, headers, data) {
        if (!data) {
            data = null;
        }

        const resp = await fetch(`${this.url}/${endpoint}`, {
            method: method,
            headers: {
                ...headers
            },
            body: JSON.stringify(data)
        })

        return resp;
    }

    async get(endpoint, headers) {
        const resp = await fetch(`${this.url}/${endpoint}`, {
            method: 'GET',
            headers: {
                ...headers
            }
        })
        return resp;
    }
}

export default Fetch


