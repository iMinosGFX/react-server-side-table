import React from "react"
import { useEffect } from "react"

export const IndeterminateCheckbox = React.forwardRef(
    // @ts-ignore
    ({ indeterminate, ...rest }, ref) => {
      const defaultRef = React.useRef()
      const resolvedRef = ref || defaultRef
      
      useEffect(() => {
        // @ts-ignore
        resolvedRef.current.indeterminate = indeterminate
      }, [resolvedRef, indeterminate])
      
      return (
        <>
          {/* @ts-ignore */}
          <input type="checkbox" ref={resolvedRef} {...rest} />
        </>
      )
    }
  )