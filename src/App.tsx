import { useState, useRef, useCallback, useMemo } from 'react'
import { processSvg, downloadSvg } from './utils/svgProcessor'
import { applyParamsToSvg, type SvgParams, defaultParams } from './utils/svgPreview'
import './App.css'

function App() {
  const [originalSvg, setOriginalSvg] = useState<string | null>(null)
  const [processedSvg, setProcessedSvg] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [isDragging, setIsDragging] = useState(false)
  const [params, setParams] = useState<SvgParams>(defaultParams)
  const [preserveOriginal, setPreserveOriginal] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const previewSvg = useMemo(() => {
    return processedSvg ? applyParamsToSvg(processedSvg, params) : null
  }, [processedSvg, params])

  const handleFile = useCallback((file: File) => {
    setError('')
    setFileName('')
    setOriginalSvg(null)
    setProcessedSvg(null)

    if (!file.name.toLowerCase().endsWith('.svg')) {
      setError('Please upload a valid SVG file')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        setOriginalSvg(content)
        setFileName(file.name)
        const processed = processSvg(content, preserveOriginal)
        setProcessedSvg(processed)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to process SVG')
      }
    }
    reader.onerror = () => {
      setError('Failed to read file')
    }
    reader.readAsText(file)
  }, [preserveOriginal])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFile(file)
    }
  }, [handleFile])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
  }, [handleFile])

  const handleClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleDownload = useCallback(() => {
    if (processedSvg && fileName && originalSvg) {
      try {
        const svgToDownload = preserveOriginal
          ? processSvg(originalSvg, true)
          : processedSvg
        const newFileName = fileName.replace(/\.svg$/i, '-qgis.svg')
        downloadSvg(svgToDownload, newFileName)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to generate SVG for download')
      }
    }
  }, [processedSvg, fileName, originalSvg, preserveOriginal])

  const handleReset = useCallback(() => {
    setOriginalSvg(null)
    setProcessedSvg(null)
    setFileName('')
    setError('')
    setParams(defaultParams)
    setPreserveOriginal(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [])

  const handleParamChange = useCallback((key: keyof SvgParams, value: SvgParams[keyof SvgParams]) => {
    setParams(prev => ({ ...prev, [key]: value }))
  }, [])

  return (
    <div className="container">
      <div className="header">
        <h1>QGIS SVG Customizer</h1>
        <p>Convert SVG files for QGIS with customizable colors</p>
      </div>

      <div className="content">
        {!processedSvg ? (
          <div
            className={`upload-zone ${isDragging ? 'dragging' : ''} ${error ? 'error' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={handleClick}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".svg"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="upload-text">
              {isDragging ? 'Drop your SVG file here' : 'Click or drag & drop an SVG file'}
            </p>
            <p className="upload-hint">Accepts .svg files only</p>
          </div>
        ) : (
          <>
            <div className="main-container">
              <div className="preview-container">
                <div className="preview-panel">
                  <h3 className="preview-label">Original</h3>
                  <div className="svg-display">
                    <div dangerouslySetInnerHTML={{ __html: originalSvg || '' }} />
                  </div>
                </div>
                <div className="preview-panel">
                  <h3 className="preview-label">QGIS Compatible</h3>
                  <div className="svg-display">
                    <div dangerouslySetInnerHTML={{ __html: previewSvg || '' }} />
                  </div>
                </div>
              </div>

              <div className="control-panel">
                <h3 className="control-label">Parameters</h3>
                <div className="control-group">
                  <label className="control-item">
                    <span>Fill Color</span>
                    <input
                      type="color"
                      value={params.fill}
                      onChange={(e) => handleParamChange('fill', e.target.value)}
                      className="color-input"
                    />
                  </label>
                  <label className="control-item">
                    <span>Fill Opacity</span>
                    <div className="slider-container">
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={params.fillOpacity}
                        onChange={(e) => handleParamChange('fillOpacity', parseFloat(e.target.value))}
                        className="range-input"
                      />
                      <span className="value-display">{params.fillOpacity.toFixed(2)}</span>
                    </div>
                  </label>
                  <label className="control-item">
                    <span>Stroke Color</span>
                    <input
                      type="color"
                      value={params.stroke}
                      onChange={(e) => handleParamChange('stroke', e.target.value)}
                      className="color-input"
                    />
                  </label>
                  <label className="control-item">
                    <span>Stroke Opacity</span>
                    <div className="slider-container">
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={params.strokeOpacity}
                        onChange={(e) => handleParamChange('strokeOpacity', parseFloat(e.target.value))}
                        className="range-input"
                      />
                      <span className="value-display">{params.strokeOpacity.toFixed(2)}</span>
                    </div>
                  </label>
                  <label className="control-item">
                    <span>Stroke Width</span>
                    <div className="slider-container">
                      <input
                        type="range"
                        min="0"
                        max="10"
                        step="0.5"
                        value={params.strokeWidth}
                        onChange={(e) => handleParamChange('strokeWidth', parseFloat(e.target.value))}
                        className="range-input"
                      />
                      <span className="value-display">{params.strokeWidth.toFixed(1)}px</span>
                    </div>
                  </label>
                  <div className="control-item">
                    <span>Preserve Original Attributes</span>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={preserveOriginal}
                        onChange={(e) => setPreserveOriginal(e.target.checked)}
                        className="toggle-input"
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                  <button
                    className="reset-params-btn"
                    onClick={() => setParams(defaultParams)}
                  >
                    Reset Parameters
                  </button>
                </div>
              </div>
            </div>

            <div className="action-buttons">
              <button className="download-btn" onClick={handleDownload}>
                Download QGIS SVG
              </button>
              <button className="upload-btn" onClick={handleReset}>
                Upload New File
              </button>
            </div>
          </>
        )}

        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  )
}

export default App
