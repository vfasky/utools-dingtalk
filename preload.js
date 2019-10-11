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

    const storageKey = 'dingTalkWin:size'

    let winSize = {
        width: 800,
        height: 600
    }
    let winSizeData = utools.db.get(storageKey)
    if (winSizeData && winSizeData.data) {
        winSize = winSizeData.data
    }
    // console.log(winSizeData)
    // console.log(winSize.width)
    // console.log(winSize.height)

    dingTalkWin = new remote.BrowserWindow({
        width: winSize.width,
        height: winSize.height,
        autoHideMenuBar: true,
        icon: path.join(__dirname, 'logo.png'),
        webPreferences: {
            preload: path.join(__dirname, 'dingtalk-preload.js')
        }
    })



    /**
     * 改变窗口大小
     */
    dingTalkWin.on('resize', () => {
        const [width, height] = dingTalkWin.getSize()
        // console.log(width, height)
        utools.db.put({
            _id: storageKey,
            data: { width, height }
        })
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
