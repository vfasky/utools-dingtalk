/**
 * 
 * @param {Document} doc
 */
function addStyle(doc) {
    let style = document.createElement('style')
    let css = `
body .login-form .tab-items {
    display: none;
}
body #layout-main {
    width: 100%;
    height: 100%;
    flex: none;
    border: none;
    box-shadow: none;
}
body #layout-main #body{
    height: 100%;
}
`
    style.innerHTML = css
    doc.head.appendChild(style)
}

/**
 * 
 * @param {HTMLIFrameElement} main 
 */
function dingTalkOnload (main) {
    const mainWindow = main.contentWindow
    const mainDoc = mainWindow.document
    addStyle(mainDoc)
}

utools.onPluginReady(async () => {
    const iframe = document.createElement('iframe')
    iframe.onload = () =>　dingTalkOnload(iframe)
    iframe.src = 'https://im.dingtalk.com/'
    iframe.setAttribute('scrolling', 'no')
    iframe.setAttribute('frameborder', '0')
    document.body.appendChild(iframe)
})