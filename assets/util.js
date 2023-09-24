const sortDesc = fieldName => (v1, v2) => {
    if (v1[fieldName] > v2[fieldName])
        return -1;
    else
        return 1;
};

const sortAsc = fieldName => (v1, v2) => {
    if (v1[fieldName] < v2[fieldName])
        return -1;
    else
        return 1;
};

const host = "http://localhost";
const resolveUrl = (relativePath) => `${host}/static/${relativePath}`;

const composeFileName = (originalName, mime) => {
    let title = originalName.substr(0, originalName.lastIndexOf('.')) + "_" + Date.now();
    let extension = '.' + mime.substr(mime.lastIndexOf('/') + 1);

    return {
        title,
        extension,
        full: title + extension
    }
};

const CryptoJS = require("crypto-js");
const md5 = (s) => {
    let hash = CryptoJS.MD5(s);
    return hash.toString(CryptoJS.enc.Hex);
};

function getUTCTicks() {
    //RETURN:
    //number of milliseconds between current UTC time and midnight of January 1, 1970

    let tmLoc = new Date();

    //The offset is in minutes -- convert it to ms
    return tmLoc.getTime() + tmLoc.getTimezoneOffset() * 60000;
}

function utcNowSeconds() {
    return parseInt(getUTCTicks() / 1000);
}

function nowSeconds() {
    return parseInt(Date.now() / 1000);
}

function parseTime(time, cFormat) {
    if (arguments.length === 0) {
        return null
    }
    const format = cFormat || '{y}/{m}/{d} {h}:{i}:{s}';
    let date;
    if (typeof time === 'object') {
        date = time
    }
    else {
        if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
            time = parseInt(time)
        }
        if ((typeof time === 'number') && (time.toString().length === 10)) {
            time = time * 1000
        }
        date = new Date(time)
    }

    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
    };
    const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
        const value = formatObj[key]
        // Note: getDay() returns 0 on Sunday
        if (key === 'a') {
            return ['日', '一', '二', '三', '四', '五', '六'][value]
        }
        return value.toString().padStart(2, '0')
    });
    return time_str
}

function sleep(ms) {
    return new Promise(resolve => {
        let timer = setTimeout(() => {
            clearTimeout(timer);
            resolve();
        }, ms)
    })
}

module.exports = {
    sortDesc,
    sortAsc,
    resolveUrl,
    composeFileName,
    md5,
    getUTCTicks,
    utcNowSeconds,
    nowSeconds,
    parseTime,
    sleep
};
