import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const SlideStyles = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  width: ${(props) => props.sliderWidth};
  div {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  img {
    max-width: 100%;
    max-height: 100%;
  }
  // img {
  //   max-width: ${(props) => props.width + 'px'};
  // }
`

function preventDefaultDrag(e) {
  e.preventDefault()
}

function Slide({ child, sliderWidth }) {
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
    <SlideStyles ref={slideRef} sliderWidth={`${sliderWidth}px`}>
      <div style={{ width: `${sliderWidth}px` }}>{child}</div>
    </SlideStyles>
  )
}

Slide.propTypes = {
  child: PropTypes.element.isRequired,
  sliderWidth: PropTypes.number.isRequired,
}

export default Slide
