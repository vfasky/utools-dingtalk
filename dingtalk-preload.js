const fs = require('fs')
const path = require('path')
const { shell, remote } = require('electron')

const contextMenu = require('./src/contextMenu')
const emotion = require('./src/emotion')

const dingTalkWin = remote.getCurrentWindow()
const dingTalkWeb = remote.getCurrentWebContents()

/**
 * 注入样式
 */
const css = fs.readFileSync(path.join(__dirname, 'style.css'), 'utf8')
dingTalkWeb.on('dom-ready', () => {
    dingTalkWeb.insertCSS(css)
    emotion()
})

/**
 * 处理新窗口打开
 */
dingTalkWeb.on('new-window', (event, url, frameName, disposition, options) => {
    event.preventDefault()

    if (!options.webContents) {
        shell.openExternal(url)
    }
})

/**
 * 右键菜单
 */
dingTalkWeb.on('context-menu', (event, params) => {
    event.preventDefault()
    // console.log(params)
    contextMenu(dingTalkWin, params)
})

/**
 * 消息提醒
 */
let unreadTotal = 0
function getUnreadTotal() {
    let el =
        document &&
        document.querySelector('.main-menus .unread-num em.ng-binding')
    if (el) {
        return ~~el.textContent.trim()
    }
    return 0
}

setInterval(() => {
    let total = getUnreadTotal()
    if (total !== unreadTotal && total > 0) {
        const notify = new Notification('钉钉', {
            icon: 'https://g.alicdn.com/dingding/web/0.2.6/img/oldIcon.ico',
            body: `您有 ${total} 条钉钉信息`
        })
        notify.onclick = () => {
            dingTalkWin.show()
        }
    }
    unreadTotal = total
}, 1000)
