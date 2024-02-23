export function formatBytes(bytes: number, decimals = 2) {
  decimals = decimals < 0 ? 0 : decimals

  const k = 1000
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`
}

export function spaceEveryNChars(str: string, n: number) {
  return str.replace(new RegExp(`(.{${n}})`, 'g'), '$1 ')
}
