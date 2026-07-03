import React, { useCallback, useRef } from 'react'
import { PuzzleMode } from '../types'
import classNames from 'classnames'

const FIRST_FILE = 0

interface PhotoUploadProps {
  mode: PuzzleMode
  photoDataUrl: string | null
  onModeChange: (mode: PuzzleMode) => void
  onPhotoUpload: (file: File) => void
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({
  mode,
  photoDataUrl,
  onModeChange,
  onPhotoUpload
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleToggle = useCallback((newMode: PuzzleMode) => {
    onModeChange(newMode)
  }, [onModeChange])

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[FIRST_FILE]
    if (file) {
      onPhotoUpload(file)
    }
    // Reset input so re-uploading the same file triggers onChange
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [onPhotoUpload])

  const getButtonLabel = (hasPhoto: boolean): string => {
    if (hasPhoto) { return 'Change Photo' }
    return 'Upload Photo'
  }

  return (
    <div className="photo-upload">
      <div className="photo-upload__toggle" role="radiogroup" aria-label="Puzzle mode">
        <button
          className={classNames('photo-upload__toggle-btn', {
            'photo-upload__toggle-btn--active': mode === 'numbers'
          })}
          onClick={() => handleToggle('numbers')}
          role="radio"
          aria-checked={mode === 'numbers'}
          aria-label="Numbers mode"
        >
          Numbers
        </button>
        <button
          className={classNames('photo-upload__toggle-btn', {
            'photo-upload__toggle-btn--active': mode === 'photo'
          })}
          onClick={() => handleToggle('photo')}
          role="radio"
          aria-checked={mode === 'photo'}
          aria-label="Photo mode"
        >
          Photo
        </button>
      </div>

      {mode === 'photo' && (
        <div className="photo-upload__controls">
          <button
            className="photo-upload__button"
            onClick={handleUploadClick}
            aria-label="Upload a photo"
          >
            {getButtonLabel(Boolean(photoDataUrl))}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="photo-upload__input"
            aria-hidden="true"
            tabIndex={-1}
          />
        </div>
      )}

      {mode === 'photo' && photoDataUrl && (
        <div className="photo-upload__reference">
          <p className="photo-upload__reference-label">Reference</p>
          <img
            className="photo-upload__reference-img"
            src={photoDataUrl}
            alt="Original unscrambled puzzle image"
          />
        </div>
      )}
    </div>
  )
}

export default PhotoUpload
