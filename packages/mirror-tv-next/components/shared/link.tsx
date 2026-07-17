import NextLink from 'next/link'
import { type ComponentPropsWithoutRef } from 'react'

type Props = ComponentPropsWithoutRef<typeof NextLink>

export default function Link({ prefetch = false, ...props }: Props) {
  return <NextLink prefetch={prefetch} {...props} />
}
