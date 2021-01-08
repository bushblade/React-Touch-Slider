import React from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import Slider from './components/Slider'

const images = [
  {
    title: 'Knife Image1',
    url: 'https://bit.ly/3n8bn7q',
  },
  {
    title: 'Knife Image2',
    url: 'https://bit.ly/38XdXZ9',
  },
  {
    title: 'Knife Image3',
    url: 'https://bit.ly/3oabL6R',
  },
  {
    title: 'Knife Image4',
    url: 'https://bit.ly/2Ms6idK',
  },
  {
    title: 'Knife Image5',
    url: 'https://bit.ly/384P91V',
  },
]

const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
  html,body {
    padding: 0;
    margin: 0;
  }
`
const AppStyles = styled.main`
  height: 100vh;
  width: 100vw;
`

function App() {
  return (
    <>
      <GlobalStyles />
      <AppStyles>
        <Slider>
          {images.map(({ url, title }) => (
            <img
              src={url}
              key={url.replace('https://bit.ly/', '')}
              alt={title}
            />
          ))}
        </Slider>
      </AppStyles>
    </>
  )
}

export default App
