const BASE = 'http://192.168.100.4:8088/api'

const AUTH = {
    LOGIN: "/auth/sign-in",
    VALIDATE: "/auth/validate-token"
}
const USER = {
    URL: "/users",
}
const LIST = {
    URL: "/lists",
}
const COLLECTION = {
    URL: "/collections",
}
const BOOK = {
    URL: "/books",
    FETCH_BY_AUTHOR: "/books/collection",
}
export { BASE, AUTH, BOOK, COLLECTION, USER, LIST }