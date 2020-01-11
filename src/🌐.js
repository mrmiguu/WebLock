import './🌐.css'

import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
} from 'react'

const {
  MIN_VALUE,
  MAX_VALUE,
} = Number

const {
  matchMedia
} = window

function useOrientation() {

  const getOrientation = useCallback(
    () => {
      const isPortrait = !!matchMedia('(orientation: portrait)').matches
      const isLandscape = !!matchMedia('(orientation: landscape)').matches
      return isPortrait ? 'portait' : isLandscape ? 'landscape' : undefined
    },
    []
  )

  const [orientation, setOrientation] = useState(getOrientation())

  useEffect(
    () => {

      function onResize() {
        setOrientation(getOrientation())
      }

      window.addEventListener('resize', onResize)
      return () => window.addEventListener('resize', onResize)

    },
    []
  )

  return orientation
}

function useMinMaxHeight() {
  const orientation = useOrientation()
  const [minH, setMinH] = useState(MAX_VALUE)
  const [maxH, setMaxH] = useState(MIN_VALUE)

  const resetH = useCallback(
    () => {
      const h = window.innerHeight
      setMinH(h < MAX_VALUE ? h : MAX_VALUE)
      setMaxH(h > MIN_VALUE ? h : MIN_VALUE)
      // setTimeout(() => alert(`reset window.innerHeight ${h}`), 3000)
    },
    []
  )

  useEffect(
    () => {
      resetH()
    },
    [orientation]
  )

  useEffect(
    () => {

      function onResize() {
        const h = window.innerHeight
        setMinH(minH => h < minH ? h : minH)
        setMaxH(maxH => h > maxH ? h : maxH)
      }

      onResize()

      window.addEventListener('resize', onResize)
      return () => window.addEventListener('resize', onResize)

    },
    []
  )

  return {
    minH,
    maxH,
    orientation,
  }
}

function useInfo() {
  const [info, setInfo] = useState({})

  useEffect(
    () => {
      function onEvent() {
        setInfo({
          scroll: window.scrollY,
          vh: window.innerHeight,
          body: document.body.offsetHeight,
        })
      }
      onEvent()
      window.addEventListener('scroll', onEvent)
      window.addEventListener('resize', onEvent)
      return () => {
        window.addEventListener('scroll', onEvent)
        window.addEventListener('resize', onEvent)
      }
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
    orientation,
  } = useMinMaxHeight()

  const {
    scroll,
    vh,
    body,
  } = useInfo()

  const scrollAtBottom = useScrollAtBottom()

  const bottomBarFound = maxH !== minH
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
      <div className="fixed" /* hidden */>
        <div>scroll: {scroll}</div>
        <div>vh: {vh}</div>
        <div>body: {body}</div>
        <div>scroll+vh: {scroll + vh}</div>
        <div>scroll at bottom: {JSON.stringify(scrollAtBottom)}</div>
        <div>minH: {minH}</div>
        <div>maxH: {maxH}</div>
        <div>bottom bar found: {JSON.stringify(bottomBarFound)}</div>
        <div>no bottom bar: {JSON.stringify(noBottomBar)}</div>
        <div>orientation: {orientation}</div>
      </div>
    </div>
  )
}

export {
  WebLock,
}
