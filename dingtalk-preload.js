const fs = require('fs')
const path = require('path')
const { shell, remote } = require('electron')

const dingTalkWeb = remote.getCurrentWebContents()

/**
 * 注入样式
 */
const css = fs.readFileSync(path.join(__dirname, 'style.css'), 'utf8')
dingTalkWeb.on('dom-ready', () => {
    dingTalkWeb.insertCSS(css)
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
        new Notification('钉钉', {
            icon: 'https://g.alicdn.com/dingding/web/0.2.6/img/oldIcon.ico',
            body: `您有 ${total} 条钉钉信息`
        })
    }
    unreadTotal = total
}, 1000)
