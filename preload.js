const fs = require('fs')
const path = require('path')
const { shell, remote } = require('electron')

// 钉钉窗口
let dingTalkWin = null

/**
 * 取有多少条未读信息
 * @param {Document} doc 
 */
function getUnreadTotal() {
    if (!dingTalkWin) {
        return
    }
    
    let code = `(() => {
        if (window['__dt_unreadTotal'] === undefined) {
            window['__dt_unreadTotal'] = 0
            window.__dt_getUnreadTotal = function() {
                console.log('check unread')
                let el = document.querySelector('.main-menus .unread-num em.ng-binding')
                if (el) {
                    return ~~el.textContent.trim()
                }
                return 0
            }

            setInterval(() => {
                let total = window.__dt_getUnreadTotal()

                if (total !== window['__dt_unreadTotal'] && total > 0) {
                    new Notification('钉钉', {
                        icon: 'https://g.alicdn.com/dingding/web/0.2.6/img/oldIcon.ico',
                        body: \`您有 \${total} 条钉钉信息\`
                    })
                }
                window['__dt_unreadTotal'] = total
            }, 5000)
        }
    })()`

    dingTalkWin.webContents.executeJavaScript(code)
}


/**
 * 初始化 web dingtalk
 */
function dingTalkInit() {
    if (dingTalkWin) {
        dingTalkWin.show()
        return
    }

    let checkUnreadTime = null

    dingTalkWin = new remote.BrowserWindow({ 
        width: 1200, 
        height: 600, 
        webPreferences: {
            nodeIntegration: false
        }
    })

    let css = fs.readFileSync(
        path.join(__dirname, 'style.css'),
        'utf8'
    )

    dingTalkWin.loadURL('https://im.dingtalk.com/')

    dingTalkWin.on('closed', () => {
        dingTalkWin = null
        if (checkUnreadTime) {
            clearInterval(checkUnreadTime)
        }
    })

    dingTalkWin.webContents.on('dom-ready', () => {
        // dingTalkWin.webContents.openDevTools()
        dingTalkWin.webContents.insertCSS(css)
        getUnreadTotal()

        // 每 5 秒检查一次
        checkUnreadTime = setInterval(() => {
            getUnreadTotal()
        }, 5000)
    })

    dingTalkWin.webContents.on('new-window', (event, url) => {
        event.preventDefault()
        shell.openExternal(url)
    })

    setTimeout(() => {
        dingTalkWin.focus()
    }, 100)


}


// 插件初始化完成
utools.onPluginReady(() => {
    // dingTalkInit() 
    // utools.outPlugin()
    utools.hideMainWindow()
})

// 用户进入插件
utools.onPluginEnter(({code, type, payload}) => {
    // console.log('用户进入插件', code, type, payload)
    dingTalkInit() 
    // utools.outPlugin()
})

// 插件被分离
// utools.onPluginDetach(() => {
// })