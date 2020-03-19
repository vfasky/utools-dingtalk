const iconUrl = '//at.alicdn.com/t/font_1702439_o5803nbtv5.js'
const iconMap = {
    '[开车]': 'iconsiji',
    '[送花花]': 'iconsonghua',
    '[赞]': 'iconlike__easyico',
    '[狗子]': 'icondongwutubiao_gou',
    '[捂脸哭]': 'iconku',
    '[衰]': 'iconganga',
    '[流鼻血]': 'iconbiti',
    '[抱拳]': 'iconbaoquan',
    '[红包]': 'iconhongbao',
    '[爱意]': 'iconxianwen',
    '[大笑]': 'icondaxiao'
}

/**
 * 解释表情
 * @param {string} s
 */
function analyticEmotion(s) {
    if (typeof s === 'string') {

        const attrSArr = s.match(/"\[.*?\]"/g)
        if (attrSArr) {
            for (const attr of attrSArr) {
                const rAttr = attr.replace('[', '').replace(']', '')
                s = s.replace(attr, rAttr)
            }
        }

        const sArr = s.match(/\[.*?\]/g)
        if (sArr) {
            for (const code of sArr) {
                if (iconMap[code]) {
                    const svg = `<svg class="icon" aria-hidden="true">
    <use xlink:href="#${iconMap[code]}"></use>
</svg>`
                    s = s.replace(code, svg)
                } else {
                    // console.log(code)
                }
            }
        }
    }
    return s
}

function getMsgDom(dom) {
    const className = String(dom.className)
    if (className.includes('markdown-content')) {
        return dom
    }
    if (className.includes('msg-bubble')) {
        const txtDom = dom.querySelector('pre.text')
        if (txtDom) {
            return txtDom
        }
    }
}

function loadIcon() {
    const script = document.createElement('script')
    script.src = iconUrl

    document.head.appendChild(script)
}

function watchChat(dom) {
    loadIcon()
    const config = { attributes: false, childList: true, subtree: true }

    const callback = function(mutationsList) {
        const matchDoms = []
        for (let mutation of mutationsList) {
            if (mutation.target && mutation.target.className) {
                const msgDom = getMsgDom(mutation.target)
                if (msgDom && !matchDoms.includes(msgDom)) {
                    matchDoms.push(msgDom)
                    const html = msgDom.innerHTML
                    const reHtml = analyticEmotion(html)
                    if (reHtml !== html) {
                        msgDom.innerHTML = reHtml
                    }
                }
            }
        }
    }

    const observer = new MutationObserver(callback)

    observer.observe(dom, config)
}

module.exports = () => {
    let watchTimer = setInterval(() => {
        const watchDom = document.getElementById('menu-pannel-body')
        if (watchDom) {
            watchChat(watchDom)
            clearInterval(watchTimer)
        }
    }, 1000)
}
