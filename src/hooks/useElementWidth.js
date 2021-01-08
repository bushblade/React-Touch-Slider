import { useEffect, useState, useCallback } from 'react'

function useElementWidth() {
  const [width, setWidth] = useState(0)
  const ref = useCallback((node) => {
    if (node !== null) {
      const { width } = node.getBoundingClientRect()
      setWidth(width)
    }
  }, [])

  useEffect(() => {
    // const handleResize = () =>
    //   setWidth(ref.current.getBoundingClientRect().width)
    // window.addEventListener('resize', handleResize)
    // return () => window.removeEventListener('resize', handleResize)
    console.log(ref)
  })

  return [ref, width]
}

export default useElementWidth
