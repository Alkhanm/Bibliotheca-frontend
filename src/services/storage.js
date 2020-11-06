import { storage } from "firebase/app"
import store from "@/store"
import { replace } from "@/services/utils";

export function createPath(book) {
    const id = store.state.user.id
    const author = book.author
    const readingList = author.readingList
    const concat = `${id}/${readingList.name}/${author.name}/${book.title}`;
    const path = replace(concat).replaceAll(" ", "-").replaceAll("//", "/")
        .toLowerCase();
    return path;
}

export function uploadBook(path, file) {
    try {
        const ref = storage().ref()
        const child = ref.child(path)
        return child.put(file)
    } catch (err) {
        store.commit("inform", {...err, message: "Erro ao fazer upload do arquivo", time: 4000, type: "warning" })
        console.error(err)
    }
}
export async function uploadImg(path, img) {
    try {
        const ref = storage().ref()
        const child = ref.child(path + "-img")
        const dataUrl = img.split(",")[1]
        await child.putString(dataUrl, "base64", { contentType: 'image/jpeg' })
    } catch (err) {
        store.commit("inform", {...err, message: "Erro ao fazer upload do arquivo", time: 4000, type: "warning" })
        console.error("Não foi possivel salvar um imagem deste livro.", err)
    }
}
export async function downloadIMG(path) {
    try {
        const ref = storage().ref()
        return await ref.child(path + "-img").getDownloadURL()
    } catch (err) {
        store.commit("inform", {...err, message: "Erro ao fazer download da imagem", time: 4000, type: "warning" })
        console.error(err)
    }
}
export async function downloadPDF(path) {
    try {
        const ref = storage().ref()
        return await ref.child(path).getDownloadURL()
    } catch (err) {
        store.commit("inform", {...err, message: "Erro ao fazer download do PDF", time: 4000, type: "warning" })
        console.error(err)
    }
}
export async function downloadBook(path) {
    try {
        const URL = {}
        const ref = storage().ref()
        URL.pdf = await ref.child(path).getDownloadURL()
        URL.img = await ref.child(path + "-img").getDownloadURL()
        return URL
    } catch (err) {
        store.commit("inform", {...err, message: "Erro ao fazer download do arquivo", time: 4000, type: "warning" })
        console.error(err)
    }
}
export async function deleteArchive(path) {
    try {
        const ref = storage().ref().child(path)
        await ref.delete()
    } catch (err) {
        console.error("Não foi possivel deletar o arquivo associado.", err)
    }
}
export async function deleteArchives(path) {
    try {
        const ref = storage().ref()
        const child = ref.child(path)
        const refs = await child.listAll()
        const items = refs.items
        for (const item of items) {
            await ref.child(item.location.path).delete()
        }
    } catch (err) {
        console.error("Não foi possivel deletar os arquivos associados.", err)
    }
}