import './🌐.css'

import React, {
  useEffect,
  useState,
  useRef,
} from 'react'

function useMinMaxHeight() {
  const [minH, setMinH] = useState(window.innerHeight)
  const [maxH, setMaxH] = useState(window.innerHeight)

  useEffect(
    () => {
      function onResize() {
        const h = window.innerHeight
        if (h < minH) setMinH(h)
        if (h > maxH) setMaxH(h)
      }
      window.addEventListener('resize', onResize)
      return () => window.addEventListener('resize', onResize)
    },
    [minH, maxH]
  )

  return {
    minH,
    maxH,
  }
}

function useInfo() {
  const [info, setInfo] = useState({})

  useEffect(
    () => {
      function onScroll() {
        setInfo({
          scroll: window.scrollY,
          vh: window.innerHeight,
          body: document.body.offsetHeight,
        })
      }
      window.addEventListener('scroll', onScroll)
      return () => window.addEventListener('scroll', onScroll)
    },
    []
  )

  return info
}

function useScrollAtBottom() {

  const {
    scroll,
    vh,
    body,
  } = useInfo()

  const scrollAtBottom = scroll + vh === body

  return scrollAtBottom
}

function WebLock() {

  const webLockRef = useRef()

  const {
    minH,
    maxH,
  } = useMinMaxHeight()

  const {
    scroll,
    vh,
    body,
  } = useInfo()

  const scrollAtBottom = useScrollAtBottom()

  const bottomBarFound = maxH > minH
  const noBottomBar = bottomBarFound && vh === maxH

  useEffect(
    () => {
      if (!noBottomBar) return

      function onTouchMove(e) {
        e.preventDefault()
      }

      const elem = webLockRef.current

      elem.addEventListener('touchmove', onTouchMove)
      return () => elem.removeEventListener('touchmove', onTouchMove)
    },
    [noBottomBar]
  )

  return (
    <div
      ref={webLockRef}
      id="🌐🔓"
    >
      <div className="fixed" hidden>
        <div>scroll: {scroll}</div>
        <div>vh: {vh}</div>
        <div>body: {body}</div>
        <div>scroll+vh: {scroll + vh}</div>
        <div>scroll at bottom: {JSON.stringify(scrollAtBottom)}</div>
        <div>minH: {minH}</div>
        <div>maxH: {maxH}</div>
        <div>no bottom bar: {JSON.stringify(noBottomBar)}</div>
      </div>
    </div>
  )
}

export {
  WebLock,
}
