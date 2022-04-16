class Cookie {
    setCookie(name, value) {
        document.cookie = name + '=' + value;
    }

    getCookie(cName) {
        let name = cName + '=';
        let decodedCookie = decodeURIComponent(document.cookie)
        const cArr = decodedCookie.split(';')
        for (let i = 0; i < cArr.length; i++) {
            let c = cArr[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length)
            }
        }
        return '';
    }
}

export default Cookie