import {
  GPT_AD_NETWORK,
  getAdSlot,
  mediaSize,
  type AdDevice,
  type AdKind,
  type AdSlot,
  type SingleSizeArray,
} from '~/constants/ads'

export type ResolvedAdSlot = {
  adUnit: string
  adUnitPath: string
  adSize: SingleSizeArray[]
  gptDivId: string
  minHeight: number | null
  device: AdDevice
  kind: AdKind
}

export function getAdWidth(adSize: SingleSizeArray[]): string {
  const widthMax = adSize?.reduce((acc, curr) => Math.max(curr[0], acc), 0)
  return widthMax ? `${widthMax}px` : '0px'
}

function getAdUnitPath(adUnit: string): string {
  return `/${GPT_AD_NETWORK}/${adUnit}`
}

function toResolved(slot: AdSlot): ResolvedAdSlot {
  return {
    adUnit: slot.adUnit,
    adUnitPath: getAdUnitPath(slot.adUnit),
    adSize: slot.adSize,
    gptDivId: slot.gptDivId,
    minHeight: slot.minHeight,
    device: slot.device,
    kind: slot.kind,
  }
}

function fallbackSlot(
  adUnit: string,
  adSize: SingleSizeArray[]
): ResolvedAdSlot {
  const maxHeight = adSize.reduce((acc, [, height]) => Math.max(acc, height), 0)

  return {
    adUnit,
    adUnitPath: getAdUnitPath(adUnit),
    adSize,
    gptDivId: `div-gpt-ad-${adUnit}`,
    minHeight: maxHeight > 1 ? maxHeight + 5 : null,
    device: 'ALL',
    kind: 'display',
  }
}

/**
 * Create adSize with special adUnit string like 'mirror_RWD_2022FIFA_970250-300250_FT'.
 */
function getAdSizeFromUnitName(adUnit: string): SingleSizeArray[] | undefined {
  const adUnitSlices = adUnit.split('_')
  let hasNan = false
  const adSize = adUnitSlices[adUnitSlices.length - 2]
    ?.split('-')
    .map((sizeString) => {
      const width = parseInt(sizeString.substring(0, 3), 10)
      const height = parseInt(sizeString.substring(3), 10)
      if (isNaN(width) || isNaN(height)) {
        hasNan = true
      }
      return [width, height] as SingleSizeArray
    })

  return hasNan || !adSize?.length ? undefined : adSize
}

export function resolveAdSlot(adUnit: string): ResolvedAdSlot | undefined {
  const fromCatalog = getAdSlot(adUnit)
  if (fromCatalog) {
    return toResolved(fromCatalog)
  }

  const parsedSize = getAdSizeFromUnitName(adUnit)
  if (parsedSize) {
    return fallbackSlot(adUnit, parsedSize)
  }

  console.error(`Unknown adUnit "${adUnit}"`)
}

export function shouldDisplayAdSlot(
  slot: Pick<ResolvedAdSlot, 'device' | 'kind'>,
  width: number
): boolean {
  if (!width) {
    return false
  }

  if (slot.kind === 'overlay') {
    return width < mediaSize.md
  }

  switch (slot.device) {
    case 'ALL':
      return true
    case 'MB':
      return width < mediaSize.xl
    case 'PC':
      return width >= mediaSize.xl
    default:
      return true
  }
}
