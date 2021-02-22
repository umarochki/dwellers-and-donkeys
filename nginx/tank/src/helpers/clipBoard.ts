export function fallbackCopyTextToClipboard(text: string, callback?: Function) {
    const textArea = document.createElement('textarea')
    textArea.value = text

    // Avoid scrolling to bottom
    textArea.style.top = '0'
    textArea.style.left = '0'
    textArea.style.position = 'fixed'

    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()

    try {
        const successful = document.execCommand('copy')
        if (successful) {
            callback && callback()
        }
    }
    catch (err) {
        console.error('Fallback: Oops, unable to copy', err)
    }

    document.body.removeChild(textArea)
}

export function copyTextToClipboard(text: string, callback?: Function) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text, callback)
        return
    }
    navigator.clipboard.writeText(text).then(() => {
        callback && callback()
    }, err => {
        console.error('Async: Could not copy text: ', err)
    })
}
