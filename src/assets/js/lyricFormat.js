export function lyricFormat (lyric) {
  const lyricList = []
  // 正则提取对应的歌词和时间
  const reg = /\[(.+)\](.+)/g
  let i = 0
  let array1
  while ((array1 = reg.exec(lyric)) !== null) {
    // console.log(array1)
    if (array1[1] && array1[2]) {
      lyricList[i] = {}
      lyricList[i].time = array1[1]
      lyricList[i].text = array1[2]
      i++
    }
  }
  console.log(lyricList)
  // 时间转换成秒
  lyricList.map(item => {
    // 去除空格
    item.time = item.time.replace(/\s*/g, '')
    const reg = /(\d{2}):(.+)/
    const array = reg.exec(item.time)
    const min = parseInt(array[1])
    const second = parseFloat(array[2])
    item.time = Math.round((min * 60 + second) * 100) / 100
  })
  return lyricList
}
