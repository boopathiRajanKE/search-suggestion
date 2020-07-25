import { userData } from "../../../assets/data"

String.prototype.contains = function (value) {
  return this.indexOf(value) !== -1
}

Array.prototype.contains = function (value) {
  return this.some((item) => item.indexOf(value) !== -1)
}

export default function personHandler({ query: { id } }, res) {
  const filtered = userData.filter((items) => {
    let hasContent = false
    for (const item in items) {
      if (items[item] && items[item].contains(id)) {
        hasContent = true
        break
      }
    }

    return hasContent
  })

  // User with id exists
  if (filtered.length > 0) {
    res.status(200).json({ ok: true, data: filtered })
  } else {
    res.status(200).json({ ok: true, error: "No User Found" })
  }
}
