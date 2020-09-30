import { storage } from "firebase/app"
import store from "@/config/store/index"

export async function uploadBook({ path, file }){
    try { 
        const ref = storage().ref()
        const child = ref.child(path)
        return await child.put(file)}
    catch ( err ){
        store.dispatch("notify", {...err, message: "Erro ao fazer upload do arquivo", time:4000, type: "warning"})
    }
}
export function uploadImg({ path, imgDataURL }){
    try {
        const ref = storage().ref()
        const child = ref.child(path)
        const dataUrl = imgDataURL.split(",")[1]
        return child.putString(dataUrl, "base64", {contentType: 'image/jpeg'})
    } catch ( err ) {
        console.error("Não foi possivel salvar um imagem deste livro.",err)
    }
}
export async function downloadBook({ path }){
    try {
        const URL = {}
        const ref = storage().ref()
        URL.pdfURL = await ref.child(path).getDownloadURL()
        URL.imgURL = await ref.child(path + "-img").getDownloadURL()
        return URL
    } catch ( err ) {
        store.dispatch("notify", {...err, message: "Erro ao fazer download do arquivo", time:4000, type: "warning"})
    }
}
export async function deleteArchive ({ path }) {
    try {
        const ref = storage().ref().child(path)
        await ref.delete()
    } catch( err){
        console.error("Não foi possivel deletar o arquivo associado.", err)
    }
}