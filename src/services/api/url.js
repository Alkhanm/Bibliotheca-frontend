const test = "http://192.168.100.4:8088/api"
const prod = "https://libros-api.herokuapp.com/api"
const BASE = process.env.NODE_ENV === "production" ? prod : test

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
}
const READ = {
    URL: "/reads"
}
export { BASE, AUTH, USER, LIST, AUTHOR, BOOK, READ }