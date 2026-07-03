import React from 'react'

const MIN_BOARD_SIZE = 3
const MAX_BOARD_SIZE = 10

interface BoardSizeSelectionProps {
  onChangeSize: (event: React.ChangeEvent<HTMLSelectElement>) => void
  size: number
}

const BoardSizeSelection: React.FC<BoardSizeSelectionProps> = ({ onChangeSize, size }) => {
  const options: React.ReactElement[] = []

  for (let sizeOption = MIN_BOARD_SIZE; sizeOption < MAX_BOARD_SIZE; sizeOption++) {
    options.push(<option value={sizeOption} key={sizeOption}>{sizeOption}</option>)
  }

  return (
    <div className="select">
      <p className="select__text">Select board size:</p>
      <select
        className="select__input"
        id="select"
        value={size}
        onChange={onChangeSize}
      >
        {options}
      </select>
    </div>
  )
}

export default BoardSizeSelection
