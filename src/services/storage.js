import { storage } from "firebase/app"
import store from "@/store"
import formatText from "@/services/replace";

export function createPath(book) { 
    const id = store.state.user.id
    const list = book.list.name
    const author = book.author.name || ""
    const concat = `${id}/${list}/${author}/${book.title}`;
    const path = formatText(concat).replaceAll(" ", "-").replaceAll("//", "/")
        .toLowerCase();
    return path;
}
export async function uploadBook({ path, file }) {
    try {
        const ref = storage().ref()
        const child = ref.child(path)
        return await child.put(file)
    }
    catch (err) {
        store.dispatch("notify", { ...err, message: "Erro ao fazer upload do arquivo", time: 4000, type: "warning" })
        console.error(err)
    }
}
export async function uploadImg({ path, imgDataURL }) {
    try {
        const ref = storage().ref()
        const child = ref.child(path + "-img")
        const dataUrl = imgDataURL.split(",")[1]
        return await child.putString(dataUrl, "base64", { contentType: 'image/jpeg' })
    } catch (err) {
        store.dispatch("notify", { ...err, message: "Erro ao fazer upload do arquivo", time: 4000, type: "warning" })
        console.error("Não foi possivel salvar um imagem deste livro.", err)
    }
}
export async function downloadBook({ path }) {
    try {
        const URL = {}
        const ref = storage().ref()
        URL.pdf = await ref.child(path).getDownloadURL()
        URL.img = await ref.child(path + "-img").getDownloadURL()
        return URL
    } catch (err) {
        store.dispatch("notify", { ...err, message: "Erro ao fazer download do arquivo", time: 4000, type: "warning" })
        console.error(err)
    }
}
export async function deleteArchive({ path }) {
    try {
        const ref = storage().ref().child(path)
        await ref.delete()
    } catch (err) {
        console.error("Não foi possivel deletar o arquivo associado.", err)
    }
}