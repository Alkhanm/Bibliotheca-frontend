function displayMenu(state, payload) {
    if (state.user.username) state.showMenu = payload
}

function inform(state, info) {
    state.info = info
    const reset = setInterval(() => {
        state.info = ''
        clearInterval(reset)
    }, 4000)
}

function openFullScreen(state, payload) {
    state.fullScreen = payload
}
function requestConfirmation(state, payload) {
    state.showConfirmation = payload
}

export { displayMenu, inform, openFullScreen, requestConfirmation }