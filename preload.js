const fs = require('fs')
const path = require('path')
/**
 * 插入样式
 * @param {Document} doc
 */
function addStyle(doc) {
    let style = document.createElement('style')
    let css = fs.readFileSync(
        path.join(__dirname, 'style.css'),
        'utf8'
    )
    style.innerHTML = css
    doc.head.appendChild(style)
}

/**
 * dingtalk iframe 加载完执行
 * @param {HTMLIFrameElement} main 
 */
function dingTalkOnload (main) {
    const mainWindow = main.contentWindow
    const mainDoc = mainWindow.document
    addStyle(mainDoc)
}

/**
 * 初始化 web dingtalk
 */
function dingTalkInit() {
    const iframe = document.createElement('iframe')
    iframe.onload = () =>　dingTalkOnload(iframe)
    iframe.src = 'https://im.dingtalk.com/'
    iframe.setAttribute('scrolling', 'no')
    iframe.setAttribute('frameborder', '0')
    document.body.appendChild(iframe)
}

// 插件初始化完成
utools.onPluginReady(() => {
    dingTalkInit()
})

// 插件被分离
utools.onPluginDetach(() => {

})