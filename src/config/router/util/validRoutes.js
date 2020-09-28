import http from "@/config/api/axios"

import { AUTH } from "@/config/api/url"
import { USER_KEY } from "@/global"

const user = JSON.parse(localStorage.getItem(USER_KEY))

export function validRoutes (to, from, next) {
    document.title = `${document.title} - ${to.name}`
    if (to.name !== "Login" && !user) next({path: "/auth"})
    else next()
}
export async function validRouteLogin (to, from, next) {
   if (!user) return next()
   const response = await http.post(AUTH.VALIDATE, user.token)
   if (response.data) return next({name: "Listas"})
   return next()
}