// Taiwan ID validation
export function validateTaiwanId(id: string): boolean {
  const idPattern = /^[A-Z][12]\d{8}$/
  if (!idPattern.test(id)) return false

  const regionLetterMapping = 'ABCDEFGHJKLMNPQRSTUVXYWZIO'
  const firstLetter = id[0]
  const regionIndex = regionLetterMapping.indexOf(firstLetter)
  if (regionIndex === -1) return false

  const regionNumericCode = regionIndex + 10
  const regionCodeDigits = [
    Math.floor(regionNumericCode / 10),
    regionNumericCode % 10,
  ]
  const idNumberDigits = id.slice(1).split('').map(Number)

  const allDigits = [...regionCodeDigits, ...idNumberDigits]

  const weightFactors = [1, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1]

  const weightedSum = allDigits.reduce(
    (sum, digit, index) => sum + digit * weightFactors[index],
    0
  )

  return weightedSum % 10 === 0
}
