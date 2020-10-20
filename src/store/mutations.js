function displayMenu(state, payload) {
    if (state.user.username) state.showMenu = payload
}

function inform(state, info) {
    state.info = info
}


function requestConfirmation(state, payload) {
    state.showConfirmation = payload
}

export { displayMenu, inform, requestConfirmation }