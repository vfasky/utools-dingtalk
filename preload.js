const fs = require('fs')
const path = require('path')
const { shell } = require('electron')
// const BrowserWindow = remote.BrowserWindow

let unreadTotal = 0

/**
 * 打开连接
 * @param {string} url 
 */
function openUrl(url) {
    shell.openItem(url)
    // let win = new BrowserWindow({ 
    //     width: options.width, 
    //     height: options.height, 
    //     show: false 
    // })
    // win.on('closed', () => {
    //     win = null
    // })
    // win.loadURL(url)
    // win.show()
}

/**
 * 取有多少条未读信息
 * @param {Document} doc 
 */
function getUnreadTotal(doc) {
    let el = doc.querySelector('.main-menus .unread-num em.ng-binding')
    if (el) {
        let total = ~~el.textContent.trim()
        if (total !== unreadTotal) {
            utools.showNotification(`您有 ${total} 条钉钉信息`)
        }
        unreadTotal = total
    } else {
        unreadTotal = 0
    }
}

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
 * 绑定事件
 * @param {Document} doc 
 */
function bindEvent(doc) {
    doc.body.addEventListener('click', (evt) => {
        if (evt.target.tagName === 'A' && evt.target.href) {
            let url = String(evt.target.href)
            if (/^(http|https):/i.test(url) && url.indexOf('https://im.dingtalk.com/#') !== 0) {
                openUrl(url)
            // } else {
            //     console.log(evt.target)
            }
        }
    })
}

/**
 * dingtalk iframe 加载完执行
 * @param {HTMLIFrameElement} main 
 */
function dingTalkOnload (main) {
    const mainWindow = main.contentWindow
    const mainDoc = mainWindow.document
    addStyle(mainDoc)
    bindEvent(mainDoc)
    getUnreadTotal(mainDoc)

    // 每 5 秒检查一次
    setInterval(() => {
        getUnreadTotal(mainDoc)
    }, 5000)
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