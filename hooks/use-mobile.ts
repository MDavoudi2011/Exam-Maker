import * as React from "react"

import { MOBILE_BREAKPOINT } from '@/constants/ui.constant'

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setTimeout(() => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT), 0)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
