export default function setTwoNumbersDigits(number) {
  return number < 10 ? `0${number}` : number
}