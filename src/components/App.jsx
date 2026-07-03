import React, { useCallback, useEffect, useRef, useState } from 'react'
import { checkWin, createBoard, getTiles, moveDirection, moveTile } from '../MysticBoard'
import {
  loadAndCropImage,
  loadImageFromStorage,
  saveImageToStorage,
  sliceImage
} from '../utils/imageProcessor'

import Board from './Board'
import BoardSizeSelection from './BoardSizeSelection'
import Header from './Header'
import Instructions from './Instructions'
import PhotoUpload from './PhotoUpload'

const DEFAULT_BOARD_SIZE = 4
const DIMENSION_1D = 1
const INCREMENT_STEP = 1
const INITIAL_VALUE = 0
const ONE_SECOND_MS = 1000
const RADIX_DECIMAL = 10

let gameBoard = createBoard(DEFAULT_BOARD_SIZE)

const useGameTimer = () => {
  const [time, setTime] = useState(INITIAL_VALUE)
  const timerRef = useRef(null)

  const startTimer = useCallback(() => {
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setTime((prevTime) => prevTime + INCREMENT_STEP)
    }, ONE_SECOND_MS)
  }, [])

  const stopTimer = useCallback(() => {
    clearInterval(timerRef.current)
  }, [])

  const resetTime = useCallback(() => {
    setTime(INITIAL_VALUE)
  }, [])

  return { resetTime, startTimer, stopTimer, time }
}

const useTimerControls = ({ gameState, setGameState, startTimer, stopTimer }) => {
  const pause = useCallback(() => {
    stopTimer()
    setGameState('paused')
  }, [setGameState, stopTimer])

  const unpause = useCallback(() => {
    setGameState('playing')
    startTimer()
  }, [setGameState, startTimer])

  const handlePause = useCallback(() => {
    switch (gameState) {
      case 'playing':
        pause()
        break
      case 'paused':
        unpause()
        break
      default:
        setGameState('playing')
        startTimer()
        break
    }
  }, [gameState, pause, setGameState, startTimer, unpause])

  const handleOnClickPlay = useCallback(() => {
    if (gameState !== 'playing') {
      unpause()
    }
  }, [gameState, unpause])

  return { handleOnClickPlay, handlePause }
}

const useBoardActions = ({
  gameState,
  handleOnClickPlay,
  resetTime,
  setGameState,
  setMoveCount,
  setSize,
  setTiles,
  size,
  stopTimer
}) => {
  const handleWin = useCallback(() => {
    stopTimer()
    setGameState('finished')
  }, [setGameState, stopTimer])

  const handleMoveSuccess = useCallback(() => {
    if (checkWin(gameBoard)) {
      handleWin()
    }
    setMoveCount((prevCount) => prevCount + INCREMENT_STEP)
    setTiles(getTiles(gameBoard, DIMENSION_1D))
  }, [handleWin, setMoveCount, setTiles])

  const handleOnClickReset = useCallback(() => {
    stopTimer()
    gameBoard = createBoard(size)
    setGameState('paused')
    setMoveCount(INITIAL_VALUE)
    setTiles(getTiles(gameBoard, DIMENSION_1D))
    resetTime()
  }, [resetTime, setGameState, setMoveCount, setTiles, size, stopTimer])

  const handleOnClickBoardOverlay = useCallback(() => {
    if (gameState === 'finished') {
      handleOnClickReset()
      return
    }
    handleOnClickPlay()
  }, [gameState, handleOnClickPlay, handleOnClickReset])

  const handleOnChangeSize = useCallback((event) => {
    const newSize = parseInt(event.target.value, RADIX_DECIMAL)
    stopTimer()
    gameBoard = createBoard(newSize)
    document.documentElement.style.setProperty('--board-columns', newSize)
    setGameState('paused')
    setMoveCount(INITIAL_VALUE)
    setSize(newSize)
    setTiles(getTiles(gameBoard, DIMENSION_1D))
    resetTime()
  }, [resetTime, setGameState, setMoveCount, setSize, setTiles, stopTimer])

  const handleOnClickTile = useCallback((event) => {
    const num = parseInt(event.target.dataset.number, RADIX_DECIMAL)
    if (gameState === 'playing' && moveTile(gameBoard, num)) {
      handleMoveSuccess()
    }
  }, [gameState, handleMoveSuccess])

  return {
    handleMoveSuccess,
    handleOnChangeSize,
    handleOnClickBoardOverlay,
    handleOnClickReset,
    handleOnClickTile
  }
}

const useKeyboardControls = ({ gameState, handleMoveSuccess, handlePause }) => {
  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Escape') {
      handlePause()
      return
    }

    if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      return
    }

    event.preventDefault()

    if (gameState === 'playing' && moveDirection(gameBoard, event.key)) {
      handleMoveSuccess()
    }
  }, [gameState, handleMoveSuccess, handlePause])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])
}

const usePhotoMode = (size) => {
  const [mode, setMode] = useState('numbers')
  const [photoDataUrl, setPhotoDataUrl] = useState(null)
  const [tileImages, setTileImages] = useState(null)

  // Load saved photo from localStorage on mount
  useEffect(() => {
    const saved = loadImageFromStorage()
    if (saved) {
      setPhotoDataUrl(saved)
    }
  }, [])

  // Re-slice when photo or size changes
  useEffect(() => {
    if (photoDataUrl) {
      sliceImage(photoDataUrl, size).then(setTileImages)
    } else {
      setTileImages(null)
    }
  }, [photoDataUrl, size])

  const handlePhotoUpload = useCallback(async (file) => {
    const cropped = await loadAndCropImage(file)
    saveImageToStorage(cropped)
    setPhotoDataUrl(cropped)
    setMode('photo')
  }, [])

  const handleModeChange = useCallback((newMode) => {
    setMode(newMode)
  }, [])

  return {
    handleModeChange,
    handlePhotoUpload,
    mode,
    photoDataUrl,
    tileImages
  }
}

const App = () => {
  const [gameState, setGameState] = useState('paused')
  const [moveCount, setMoveCount] = useState(INITIAL_VALUE)
  const [size, setSize] = useState(DEFAULT_BOARD_SIZE)
  const [tiles, setTiles] = useState(() => getTiles(gameBoard, DIMENSION_1D))
  const { resetTime, startTimer, stopTimer, time } = useGameTimer()

  const {
    handleModeChange,
    handlePhotoUpload,
    mode,
    photoDataUrl,
    tileImages
  } = usePhotoMode(size)

  const { handleOnClickPlay, handlePause } = useTimerControls({
    gameState,
    setGameState,
    startTimer,
    stopTimer
  })

  const {
    handleMoveSuccess,
    handleOnChangeSize,
    handleOnClickBoardOverlay,
    handleOnClickReset,
    handleOnClickTile
  } = useBoardActions({
    gameState,
    handleOnClickPlay,
    resetTime,
    setGameState,
    setMoveCount,
    setSize,
    setTiles,
    size,
    stopTimer
  })

  useKeyboardControls({ gameState, handleMoveSuccess, handlePause })

  return (
    <div className="container">
      <Header
        gameState={gameState}
        moves={moveCount}
        time={time}
        onClickPause={handlePause}
        onClickReset={handleOnClickReset}
      />
      <Board
        gameState={gameState}
        mode={mode}
        tileImages={tileImages}
        tiles={tiles}
        onClickBoardOverlay={handleOnClickBoardOverlay}
        onClickTile={handleOnClickTile}
      />
      <BoardSizeSelection
        size={size}
        onChangeSize={handleOnChangeSize}
      />
      <PhotoUpload
        mode={mode}
        photoDataUrl={photoDataUrl}
        onModeChange={handleModeChange}
        onPhotoUpload={handlePhotoUpload}
      />
      <Instructions />
    </div>
  )
}

export default App
