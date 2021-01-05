const getItem = <T extends any = {}>(key: string): T | null => {
  const fromstring = localStorage.getItem(key)
  if (fromstring) {
    return JSON.parse(fromstring)
  } else {
    return null
  }
}

const saveItem = (key: string, data: object): object => {
  const fromstring = JSON.stringify(data)
  localStorage.setItem(key, fromstring)
  return data
}

const removeItem = (key: string) => {
  localStorage.removeItem(key)
}

export default {
  getItem,
  saveItem,
  removeItem,
}
