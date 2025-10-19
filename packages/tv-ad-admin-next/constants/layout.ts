export const layout = {
  maxWidthResponsive: 'max-w-[288px] md:max-w-[780px] xl:max-w-[1080px]',
}

export const ORDER_STYLES = {
  pageContainer: 'min-h-[calc(100vh-64px)] w-full bg-gray-1',
  contentContainer: 'm-auto max-w-[980px]',
  innerContainer: 'container mx-auto px-4',
  layoutGrid: 'flex flex-col gap-4 xl:flex-row xl:gap-8',

  card: 'rounded-lg border border-gray-3 bg-white p-6',
  cardTitle: 'typography-h4 mb-4 font-semibold text-text-primary',

  primaryButton: 'bg-blue-6 text-white hover:bg-blue-7',
  secondaryButton: 'border-gray-3 text-text-secondary hover:bg-gray-1',

  statusMessage:
    'font-sans text-sm leading-normal font-normal text-text-secondary',
  labelText: 'text-sm font-medium text-text-secondary',
  valueText: 'text-base font-normal text-text-primary',

  sectionSpacing: 'space-y-6',
  buttonSpacing: 'space-y-3',
}
