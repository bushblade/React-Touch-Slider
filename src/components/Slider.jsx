import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
// import useElementWidth from '../hooks/useElementWidth'
import Slide from './Slide'

const SliderStyles = styled.div`
  all: initial;
  width: 100%;
  height: 100%;
  display: inline-flex;
  scrollbar-width: none;
  // overflow: hidden;
  scrollbar-width: none;
  // transform: translateX(0);
  will-change: transform;
  transition: transform 0.3s ease-out;
  cursor: grab;
`

function getPositionX(event) {
  return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX
}

function Slider({ children }) {
  // const width = useRef(0)
  const [width, setWidth] = useState(0)
  const dragging = useRef(false)
  const startPos = useRef(0)
  const currentTranslate = useRef(0)
  const prevTranslate = useRef(0)
  const currentIndex = useRef(0)

  const sliderRef = useRef('slider')
  const animationRef = useRef(null)

  useEffect(() => {
    // set width after first render
    setWidth(sliderRef.current.getBoundingClientRect().width)
  }, [])

  useEffect(() => {
    // set width if window resizes
    const handleResize = () => {
      setWidth(sliderRef.current.getBoundingClientRect().width)
    }
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  function touchStart(index) {
    return function (event) {
      // console.log('touch started')
      currentIndex.current = index
      startPos.current = getPositionX(event)
      dragging.current = true
      animationRef.current = requestAnimationFrame(animation)
      animationRef.current = requestAnimationFrame(animation)
      // slider.classList.add('grabbing')
    }
  }

  function touchMove(event) {
    if (dragging.current) {
      // console.log('moving')
      const currentPosition = getPositionX(event)
      currentTranslate.current =
        prevTranslate.current + currentPosition - startPos.current
    }
  }

  function touchEnd() {
    // console.log('touch ended')
    cancelAnimationFrame(animationRef.current)
    dragging.current = false
    const movedBy = currentTranslate.current - prevTranslate.current

    // if moved enough negative then snap to next slide if there is one
    if (movedBy < -100 && currentIndex.current < children.length - 1)
      currentIndex.current += 1

    // if moved enough positive then snap to previous slide if there is one
    if (movedBy > 100 && currentIndex.current > 0) currentIndex.current -= 1

    setPositionByIndex()

    // slider.classList.remove('grabbing')
  }

  function animation() {
    // console.log('animating')
    setSliderPosition()
    if (dragging.current) requestAnimationFrame(animation)
  }

  function setPositionByIndex() {
    // console.log('current index', currentIndex.current)
    currentTranslate.current = currentIndex.current * -width
    prevTranslate.current = currentTranslate.current
    setSliderPosition()
  }

  function setSliderPosition() {
    sliderRef.current.style.transform = `translateX(${currentTranslate.current}px)`
  }

  return (
    <SliderStyles ref={sliderRef}>
      {children.map((child, index) => {
        return (
          <div
            key={child.key}
            onTouchStart={touchStart(index)}
            onMouseDown={touchStart(index)}
            onTouchMove={touchMove}
            onMouseMove={touchMove}
            onTouchEnd={touchEnd}
            onMouseUp={touchEnd}
            onMouseLeave={touchEnd}
          >
            <Slide
              child={child}
              sliderWidth={width}
              dragging={dragging.current}
            />
          </div>
        )
      })}
    </SliderStyles>
  )
}

Slider.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Slider
