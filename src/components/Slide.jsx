import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const SlideStyles = styled.div`
  div {
    padding: 1rem;
    height: 100%;
    width: ${(props) => props.sliderWidth};
    height: ${(props) => props.sliderHeight};
    display: flex;
    align-items: center;
    justify-content: center;
  }
  img {
    max-width: 100%;
    // restrict height for mobile in landscape
    // max-height: 95vh;
    max-height: 100%;
  }
`

function preventDefaultDrag(e) {
  e.preventDefault()
}

function Slide({ child, sliderWidth, sliderHeight, dragging }) {
  console.log(dragging)
  // remove default image drag
  // find any images in the slide and prevent default drag
  const slideRef = useRef('slide')
  useEffect(() => {
    const images = slideRef.current.querySelectorAll('img')
    images.forEach((img) => {
      img.addEventListener('dragstart', preventDefaultDrag)
    })
    return function () {
      images.forEach((img) => {
        img.removeEventListener('dragstart', preventDefaultDrag)
      })
    }
  })
  return (
    <SlideStyles
      ref={slideRef}
      sliderWidth={`${sliderWidth}px`}
      sliderHeight={`${sliderHeight}px`}
      className='SlideStyles'
      dragging={dragging}
    >
      <div className='slide-inner'>{child}</div>
    </SlideStyles>
  )
}

Slide.propTypes = {
  child: PropTypes.element.isRequired,
  sliderWidth: PropTypes.number.isRequired,
  sliderHeight: PropTypes.number.isRequired,
  dragging: PropTypes.bool.isRequired,
}

export default Slide
