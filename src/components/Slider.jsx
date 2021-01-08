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
  overflow: hidden;
  scrollbar-width: none;
  transform: translateX(0);
  will-change: transform;
  transition: transform 0.3s ease-out;
  cursor: grab;
`

function getPositionX(event) {
  return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX
}

function Slider({ children }) {
  const [width, setWidth] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [startPos, setStartPos] = useState(0)
  const [currentTranslate, setCurrentTranslate] = useState(0)
  const [prevTranslate, setPrevTranslate] = useState(0)
  const [currentIndex, setCurrentIndex] = useState(0)

  const ref = useRef('slider')
  const animationRef = useRef(null)

  useEffect(() => {
    // set width after first render
    setWidth(ref.current.getBoundingClientRect().width)
  }, [])

  useEffect(() => {
    // set width if window resizes
    const handleResize = () =>
      setWidth(ref.current.getBoundingClientRect().width)
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  function touchStart(index) {
    return function (event) {
      console.log('touch started')
      setCurrentIndex(index)
      setStartPos(getPositionX(event))
      setDragging(true)
      // animationID = requestAnimationFrame(animation)
      // slider.classList.add('grabbing')
    }
  }

  function touchMove(event) {
    console.log('moving')
    if (dragging) {
      const currentPosition = getPositionX(event)
      setCurrentTranslate(prevTranslate + currentPosition - startPos)
    }
  }

  function touchEnd() {
    // cancelAnimationFrame(animationID)
    setDragging(false)
    const movedBy = currentTranslate - prevTranslate

    // if moved enough negative then snap to next slide if there is one
    if (movedBy < -100 && currentIndex < children.length - 1)
      setCurrentIndex(currentIndex + 1)

    // if moved enough positive then snap to previous slide if there is one
    if (movedBy > 100 && currentIndex > 0) setCurrentIndex(currentIndex - 1)

    // setPositionByIndex()

    // slider.classList.remove('grabbing')
  }

  return (
    <SliderStyles ref={ref}>
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
          >
            <Slide child={child} sliderWidth={width} dragging={dragging} />
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
