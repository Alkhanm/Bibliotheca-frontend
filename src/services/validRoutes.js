import http from "./api/axios"

import { AUTH } from "./api/url"

import {USER_KEY} from "@/services/constants"


const user = JSON.parse(localStorage.getItem(USER_KEY))

export function validRoutes (to, from, next) {
    document.title = `Bibliotheca - ${to.name}`
    if (to.name !== "Login" && !user) next({path: "/auth"})
    else next()
}
export async function validRouteLogin (to, from, next) {
   if (!user) return next()
   const response = await http.post(AUTH.VALIDATE, user.token)
   if (response.data) return next({name: "Listas"})
   return next()
}