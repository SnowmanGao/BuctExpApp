function arrayTake<T>(array: T[], predicate: (item: T) => boolean, n: number) {
  const result = []
  for (let i = 0; i < array.length; i++) {
    if (predicate(array[i])) {
      result.push(array[i])
      if (result.length === n)
        break
    }
  }
  return result
}


export { arrayTake }