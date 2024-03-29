import { render } from 'react-dom'
import React, { useState, useCallback, useEffect } from 'react'
import { useTransition, animated, config } from 'react-spring'
import '../css/styles.css'
import Image from 'gatsby-image'
import useInterval from './useInterval';
import styled from 'styled-components'


export const BgImage = styled(Image)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: -1;
  height: ${props => props.height || '100%'};

  // Adjust image positioning (if image covers area with defined height) and add font-family for polyfill
  & > img {
    object-fit: ${props => props.fit || 'cover'} !important;
    object-position: ${props => props.position || '50% 50%'} !important;
    font-family: 'object-fit: ${props => props.fit || 'cover'} !important;
     object-position: ${props => props.position || '50% 50%'} !important;'
  }
`
// export const BgImage = styled(Image)`
//   position: absolute;
//   top: 0;
//   left: 0;
//   width: 100%;
//   z-index: -1;
//   height: 100%; // or whatever

//   // Adjust image positioning (if image covers area with defined height) and add font-family for polyfill
//   & > img {
//     object-fit:cover !important; // or whatever
//     object-position: 0% 0% !important; // or whatever
//     font-family: 'object-fit: cover !important; object-position: 0% 0% !important;' // needed for IE9+ polyfill
//   }
// `

export default function ImageSlider({ imagesArr, index, direction }) {

  const forwardTransitions = useTransition(index, p => p, {
    from: { opacity: 0, transform: 'translate3d(100%,0,0)' },
    enter: { opacity: 1, transform: 'translate3d(0%,0,0)' },
    leave: { opacity: 0, transform: 'translate3d(-50%,0,0)' },
    config: (item, state) =>
      state === 'leave' ? { duration: 0 } : config.default,
  })
  const backwordTransitions = useTransition(index, p => p, {
    from: { opacity: 0, transform: 'translate3d(-100%,0,0)' },
    enter: { opacity: 1, transform: 'translate3d(0%,0,0)' },
    leave: { opacity: 0, transform: 'translate3d(50%,0,0)' },
    config: (item, state) =>
      state === 'leave' ? { duration: 0 } : config.default,
  })

  const renderImages = () => {
    if (direction) {
      return forwardTransitions.map(({ item, props, key }) => {
        const Image = imagesArr[item]
        return <Image key={key} style={props} />
      })
    } else {
      return backwordTransitions.map(({ item, props, key }) => {
        const Image = imagesArr[item]
        return <Image key={key} style={props} />
      })
    }

  }
  return renderImages()

}


export const useImageTransitions = (length, delay) => {
  const [index, set] = useState(0);
  const [resumeSlide, handleSlideResume] = useState(false);
  const [moveForward, setDirection] = useState(true)
  const [timeStamp, setTimeStamp] = useState(0);
  const handlePrev = useCallback(() => {
    const timeStamp = new Date();
    setDirection(false)
    setTimeStamp(timeStamp.getTime())
    set(state => state > 0 ? state - 1 : length - 1)
  }, [])
  const handleNext = useCallback(() => {
    const timeStamp = new Date();
    setDirection(true)
    setTimeStamp(timeStamp.getTime())
    set(state => (state + 1) % length)
  }, [])
  useInterval(() => {
    const time = new Date();
    if (time.getTime() - timeStamp > delay) {
      if (moveForward) {
        set(state => (state + 1) % length)
      } else {
        set(state => state > 0 ? state - 1 : length - 1)
      }
    }
  }, delay
  )

  return [
    handleNext,
    handlePrev,
    index,
    moveForward,
    handleSlideResume
  ]
}