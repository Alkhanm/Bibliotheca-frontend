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
const AUTHOR = {
    URL: "/authors",
}
const BOOK = {
    URL: "/books",
    FETCH_BY_AUTHOR: "/books/author",
}
export { BASE, AUTH, BOOK, AUTHOR, USER, LIST }