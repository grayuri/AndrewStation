export default function haveNotEmptyStrings(value) {
  const notEmptyStrings = value.split(" ").filter(value => value != "")
  if (notEmptyStrings.length === 0) return false
  else return true
}