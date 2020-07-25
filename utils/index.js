export const debounce = (func, delay) => {
  let timer = null
  return (...args) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(func, delay)
  }
}

export const textHighLighter = (response, highlightText) => {
  const escapeRegex =
    "(" +
    highlightText.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&") +
    ")"

  return response.replace(new RegExp(escapeRegex, "gi"), "<strong>$1</strong>")
}
