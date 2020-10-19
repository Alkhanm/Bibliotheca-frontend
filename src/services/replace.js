export default function retira_acentos(text) {
    const with_accent = "ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝŔÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿŕ";
    const without_accent = "AAAAAAACEEEEIIIIDNOOOOOOUUUUYRsBaaaaaaaceeeeiiiionoooooouuuuybyr";
    let novastr = "";

    for (let t in text) {
        let replace = false;
        for (let accent in with_accent) {
            if (text.substr(t, 1) == with_accent.substr(accent, 1)) {
                novastr += without_accent.substr(accent, 1);
                replace = true;
                break;
            }
        }
        if (replace == false) novastr += text.substr(t, 1);
    }
    return novastr.toLocaleLowerCase().trim()
}



