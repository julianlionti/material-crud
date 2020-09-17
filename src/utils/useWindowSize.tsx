import { useEffect, useState } from 'react'

export default () => {
  const [windowSize, setWindowSize] = useState<{ width: number; height: number }>({
    width: -1,
    height: -1,
  })

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowSize
}
