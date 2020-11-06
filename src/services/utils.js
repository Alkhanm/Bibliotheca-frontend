function replace(value) {
    if (!value) return;
    const text = value.toString()
    const withAccent = "ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝŔÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿŕ";
    const withoutAccent = "AAAAAAACEEEEIIIIDNOOOOOOUUUUYRsBaaaaaaaceeeeiiiionoooooouuuuybyr";
    let newStr = "";

    for (let t in text) {
        let replace = false;
        for (let accent in withAccent) {
            if (text.substr(t, 1) == withAccent.substr(accent, 1)) {
                newStr += withoutAccent.substr(accent, 1);
                replace = true;
                break;
            }
        }
        if (!replace) newStr += text.substr(t, 1);
    }
    return newStr.toLocaleLowerCase().trim()
}

function sort(arr, param) {
    if (!param) return arr
    return arr.sort((obj1, obj2) => {
        const param1 = replace(getValueToCompare(obj1, param))
        const param2 = replace(getValueToCompare(obj2, param))
        if (param1 > param2) return 1
        if (param1 < param2) return -1
        return 0
    })
}

function getValueToCompare(obj, param) {
    const value = obj[param]
    if (!value) {
        for (let key in obj) {
            const ob = obj[key] || {}
            const val = ob[param]
            if (typeof val === "object") return val.id
            if (val) return val
        }
        return null;
    }
    if (typeof value === "object") return value.id
    if (Array.isArray(value)) return value.length;
    return value;
}

function formatDate(payload) {
    const dateReading = new Date(payload);
    const today = new Date().toLocaleDateString()
    const hour = `${dateReading.getHours()}:${dateReading.getMinutes()}`;
    const seconds = dateReading.getSeconds()
    const day = dateReading.toLocaleDateString();
    const date = day === today ? `hoje ${hour}:${seconds}` : ` ${day} ${hour}`
    return date;
}

export { sort, replace, formatDate }