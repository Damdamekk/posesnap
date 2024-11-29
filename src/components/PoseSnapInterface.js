import React, { useState, useRef, useEffect } from 'react'
import { Camera, RotateCcw, Scan } from 'lucide-react'

export default function PoseSnapInterface() {
  const [capturedImage, setCapturedImage] = useState(null)
  const [detectedPose, setDetectedPose] = useState(null)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      console.error("Error accessing the camera", err)
    }
  }

  const takePicture = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d')
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)
        const imageDataUrl = canvasRef.current.toDataURL('image/jpeg')
        setCapturedImage(imageDataUrl)
      }
    }
  }

  const analyzePose = () => {
    const poses = ['Nakłon do przodu', 'Nakłon w bok', 'Wyprost do tyłu', 'Przysiad', 'Leżenie', 'Stanie na jednej nodze', 'Rozkrok', 'Podpór przodem']
    setDetectedPose(poses[Math.floor(Math.random() * poses.length)])
  }

  const resetCamera = () => {
    setCapturedImage(null)
    setDetectedPose(null)
  }

  useEffect(() => {
    startCamera()
    // Set full screen styles
    document.documentElement.style.height = '100%'
    document.body.style.height = '100%'
    document.body.style.margin = '0'
    document.body.style.padding = '0'
  }, [])

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      width: '100vw',
      backgroundColor: '#d2c8b2',
      position: 'relative'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#b8a88f',
        padding: '1rem',
        textAlign: 'center',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>PoseSnap</h1>
      </header>

      {/* Main content area */}
      <main style={{
        flex: 1,
        position: 'relative',
        backgroundColor: '#000',
        overflow: 'hidden'
      }}>
        {/* Video/Image container */}
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
          {capturedImage ? (
            <img 
              src={capturedImage} 
              alt="Captured" 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }} 
            />
          ) : (
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }} 
            />
          )}
        </div>

        {/* Controls overlay */}
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '1rem',
          zIndex: 1000
        }}>
          <button 
            onClick={resetCamera}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '1rem 2rem',
              backgroundColor: '#8c7a5b',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
              transition: 'transform 0.1s',
              WebkitTapHighlightColor: 'transparent'
            }}
          >
            <RotateCcw size={24} />
            Reset
          </button>
          <button 
            onClick={capturedImage ? analyzePose : takePicture}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '1rem 2rem',
              backgroundColor: '#8c7a5b',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
              transition: 'transform 0.1s',
              WebkitTapHighlightColor: 'transparent'
            }}
          >
            {capturedImage ? (
              <>
                <Scan size={24} />
                Analizuj
              </>
            ) : (
              <>
                <Camera size={24} />
                Zrób zdjęcie
              </>
            )}
          </button>
        </div>

        <canvas ref={canvasRef} style={{ display: 'none' }} width="640" height="480" />
      </main>

      {/* Results panel */}
      {detectedPose && (
        <div style={{
          position: 'fixed',
          bottom: '8rem',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#b8a88f',
          padding: '1rem 2rem',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          zIndex: 1000
        }}>
          <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontWeight: 'bold' }}>
            Wykryta poza
          </h2>
          <p style={{ margin: 0, color: '#5c4f3d', fontSize: '1.5rem', fontWeight: 'bold' }}>
            {detectedPose}
          </p>
        </div>
      )}
    </div>
  )
}