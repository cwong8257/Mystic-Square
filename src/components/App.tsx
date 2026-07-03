import { GameState, PuzzleMode } from '../types'
import { MysticBoard, checkWin, createBoard, getTiles, moveDirection, moveTile } from '../MysticBoard'
import React, { useCallback, useEffect, useRef, useState } from 'react'
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

let gameBoard: MysticBoard = createBoard(DEFAULT_BOARD_SIZE)

const updateBoardTiles = (board: MysticBoard, setTiles: React.Dispatch<React.SetStateAction<number[]>>) => {
  const newTiles = getTiles(board, DIMENSION_1D)
  if (Array.isArray(newTiles)) {
    setTiles(newTiles as number[])
  }
}

interface GameTimerResult {
  resetTime: () => void
  startTimer: () => void
  stopTimer: () => void
  time: number
}

const useGameTimer = (): GameTimerResult => {
  const [time, setTime] = useState<number>(INITIAL_VALUE)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    timerRef.current = setInterval(() => {
      setTime((prevTime) => prevTime + INCREMENT_STEP)
    }, ONE_SECOND_MS)
  }, [])

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }, [])

  const resetTime = useCallback(() => {
    setTime(INITIAL_VALUE)
  }, [])

  return { resetTime, startTimer, stopTimer, time }
}

interface TimerControlsProps {
  gameState: GameState
  setGameState: React.Dispatch<React.SetStateAction<GameState>>
  startTimer: () => void
  stopTimer: () => void
}

interface TimerControlsResult {
  handleOnClickPlay: () => void
  handlePause: () => void
}

const useTimerControls = ({ gameState, setGameState, startTimer, stopTimer }: TimerControlsProps): TimerControlsResult => {
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

interface BoardActionsProps {
  gameState: GameState
  handleOnClickPlay: () => void
  resetTime: () => void
  setGameState: React.Dispatch<React.SetStateAction<GameState>>
  setMoveCount: React.Dispatch<React.SetStateAction<number>>
  setSize: React.Dispatch<React.SetStateAction<number>>
  setTiles: React.Dispatch<React.SetStateAction<number[]>>
  size: number
  stopTimer: () => void
}

interface BoardActionsResult {
  handleMoveSuccess: () => void
  handleOnChangeSize: (event: React.ChangeEvent<HTMLSelectElement>) => void
  handleOnClickBoardOverlay: () => void
  handleOnClickReset: () => void
  handleOnClickTile: (event: React.MouseEvent<HTMLDivElement>) => void
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
}: BoardActionsProps): BoardActionsResult => {
  const handleWin = useCallback(() => {
    stopTimer()
    setGameState('finished')
  }, [setGameState, stopTimer])

  const handleMoveSuccess = useCallback(() => {
    if (checkWin(gameBoard)) {
      handleWin()
    }
    setMoveCount((prevCount) => prevCount + INCREMENT_STEP)
    updateBoardTiles(gameBoard, setTiles)
  }, [handleWin, setMoveCount, setTiles])

  const handleOnClickReset = useCallback(() => {
    stopTimer()
    gameBoard = createBoard(size)
    setGameState('paused')
    setMoveCount(INITIAL_VALUE)
    updateBoardTiles(gameBoard, setTiles)
    resetTime()
  }, [resetTime, setGameState, setMoveCount, setTiles, size, stopTimer])

  const handleOnClickBoardOverlay = useCallback(() => {
    if (gameState === 'finished') {
      handleOnClickReset()
      return
    }
    handleOnClickPlay()
  }, [gameState, handleOnClickPlay, handleOnClickReset])

  const handleOnChangeSize = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(event.target.value, RADIX_DECIMAL)
    stopTimer()
    gameBoard = createBoard(newSize)
    document.documentElement.style.setProperty('--board-columns', newSize.toString())
    setGameState('paused')
    setMoveCount(INITIAL_VALUE)
    setSize(newSize)
    updateBoardTiles(gameBoard, setTiles)
    resetTime()
  }, [resetTime, setGameState, setMoveCount, setSize, setTiles, stopTimer])

  const handleOnClickTile = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const datasetNumber = (event.currentTarget as HTMLElement).dataset.number
    const num = parseInt(datasetNumber || '0', RADIX_DECIMAL)
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

interface KeyboardControlsProps {
  gameState: GameState
  handleMoveSuccess: () => void
  handlePause: () => void
}

const useKeyboardControls = ({ gameState, handleMoveSuccess, handlePause }: KeyboardControlsProps): void => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
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

interface PhotoModeResult {
  handleModeChange: (newMode: PuzzleMode) => void
  handlePhotoUpload: (file: File) => Promise<void>
  mode: PuzzleMode
  photoDataUrl: string | null
  tileImages: string[] | null
}

const usePhotoMode = (size: number): PhotoModeResult => {
  const [mode, setMode] = useState<PuzzleMode>('numbers')
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null)
  const [tileImages, setTileImages] = useState<string[] | null>(null)

  useEffect(() => {
    const saved = loadImageFromStorage()
    if (saved) {
      setPhotoDataUrl(saved)
    }
  }, [])

  useEffect(() => {
    if (photoDataUrl) {
      sliceImage(photoDataUrl, size).then(setTileImages)
    } else {
      setTileImages(null)
    }
  }, [photoDataUrl, size])

  const handlePhotoUpload = useCallback(async (file: File) => {
    const cropped = await loadAndCropImage(file)
    saveImageToStorage(cropped)
    setPhotoDataUrl(cropped)
    setMode('photo')
  }, [])

  const handleModeChange = useCallback((newMode: PuzzleMode) => {
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

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('paused')
  const [moveCount, setMoveCount] = useState<number>(INITIAL_VALUE)
  const [size, setSize] = useState<number>(DEFAULT_BOARD_SIZE)
  const [tiles, setTiles] = useState<number[]>(() => (getTiles(gameBoard, DIMENSION_1D) as number[]) || [])
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
