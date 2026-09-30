import { useEffect } from 'react'
import { BRAND } from '../config/brand.js'

/** Sets the tab title: "Skills · SkillRank". Pass nothing for the default marketing title. */
export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · ${BRAND.name}` : `${BRAND.name} - ${BRAND.tagline}`
  }, [title])
}

export default useDocumentTitle
