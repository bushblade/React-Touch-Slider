import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Slide from './Slide'

const SliderStyles = styled.div`
  all: initial;
  width: 100%;
  height: 100%;
  max-height: 100vh;
  display: inline-flex;
  will-change: transform;
  transition: transform 0.3s ease-out, scale 0.3s ease-out;
  cursor: grab;
  .slide-outer {
    display: flex;
    align-items: center;
  }
`

const SliderWrapper = styled.div`
  overflow: hidden;
  width: 100%;
  height: 100%;
  max-height: 100vh;
`

function getPositionX(event) {
  return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX
}

function Slider({ children }) {
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const dragging = useRef(false)
  const startPos = useRef(0)
  const currentTranslate = useRef(0)
  const prevTranslate = useRef(0)
  const currentIndex = useRef(0)

  const sliderRef = useRef('slider')
  const animationRef = useRef(null)

  useEffect(() => {
    // set width after first render
    const newSize = sliderRef.current.getBoundingClientRect()
    setHeight(newSize.height)
    setWidth(newSize.width)
  }, [])

  useEffect(() => {
    // set width if window resizes
    const handleResize = () => {
      const newSize = sliderRef.current.getBoundingClientRect()
      setHeight(newSize.height)
      setWidth(newSize.width)
      setPositionByIndex(newSize.width)
    }
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  function touchStart(index) {
    return function (event) {
      currentIndex.current = index
      startPos.current = getPositionX(event)
      dragging.current = true
      animationRef.current = requestAnimationFrame(animation)
      animationRef.current = requestAnimationFrame(animation)
      sliderRef.current.style.scale = 0.9
      sliderRef.current.style.cursor = 'grabbing'
    }
  }

  function touchMove(event) {
    if (dragging.current) {
      const currentPosition = getPositionX(event)
      currentTranslate.current =
        prevTranslate.current + currentPosition - startPos.current
    }
  }

  function touchEnd() {
    cancelAnimationFrame(animationRef.current)
    dragging.current = false
    const movedBy = currentTranslate.current - prevTranslate.current

    // if moved enough negative then snap to next slide if there is one
    if (movedBy < -100 && currentIndex.current < children.length - 1)
      currentIndex.current += 1

    // if moved enough positive then snap to previous slide if there is one
    if (movedBy > 100 && currentIndex.current > 0) currentIndex.current -= 1

    setPositionByIndex()
    sliderRef.current.style.scale = 1
    sliderRef.current.style.cursor = 'grab'
  }

  function animation() {
    setSliderPosition()
    if (dragging.current) requestAnimationFrame(animation)
  }

  function setPositionByIndex(w = width) {
    currentTranslate.current = currentIndex.current * -w
    prevTranslate.current = currentTranslate.current
    setSliderPosition()
  }

  function setSliderPosition() {
    sliderRef.current.style.transform = `translateX(${currentTranslate.current}px)`
  }

  return (
    <SliderWrapper className='SliderWrapper'>
      <SliderStyles ref={sliderRef} className='SliderStyles'>
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
              className='slide-outer'
            >
              <Slide
                child={child}
                sliderWidth={width}
                sliderHeight={height}
                dragging={dragging.current}
              />
            </div>
          )
        })}
      </SliderStyles>
    </SliderWrapper>
  )
}

Slider.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Slider
