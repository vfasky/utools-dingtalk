const path = require('path')
const { remote } = require('electron')

// 钉钉窗口
let dingTalkWin = null

/**
 * 初始化 web dingtalk
 */
function dingTalkInit() {
    if (dingTalkWin) {
        dingTalkWin.show()
        return
    }

    dingTalkWin = new remote.BrowserWindow({
        id: 'dingTalkWin',
        width: 800,
        height: 600,
        autoHideMenuBar: true,
        icon: path.join(__dirname, 'logo.png'),
        webPreferences: {
            preload: path.join(__dirname, 'dingtalk-preload.js')
        }
    })

    dingTalkWin.loadURL('https://im.dingtalk.com/')

    dingTalkWin.on('closed', () => {
        dingTalkWin = null
    })
}

// 插件初始化完成
utools.onPluginReady(() => {
    utools.hideMainWindow()
})

// 用户进入插件
utools.onPluginEnter(({ code, type, payload }) => {
    dingTalkInit()
})


// 插件被分离
// utools.onPluginDetach(() => {
// })
