export function remoteLoad (url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.onload = () => {
      console.log(url + 'finish')
      return resolve()
    }
    script.onerror = (e) => { reject(e) }
    script.src = url
    document.head.appendChild(script)
  })
}
