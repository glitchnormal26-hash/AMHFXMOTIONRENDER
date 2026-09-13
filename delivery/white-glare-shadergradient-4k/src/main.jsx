import React, { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { ShaderGradient, ShaderGradientCanvas } from '@shadergradient/react'

const BASE = {
  animate: 'off',
  type: 'plane',
  shader: 'defaults',
  wireframe: false,
  color1: '#ffffff',
  color2: '#020202',
  color3: '#6f6f6f',
  uSpeed: 0.2,
  uStrength: 1.4,
  uDensity: 1.2,
  uFrequency: 3.5,
  reflection: 0.2,
  cDistance: 3.6,
  cPolarAngle: 90,
  cAzimuthAngle: 180,
  cameraZoom: 1,
  lightType: '3d',
  brightness: 1.55,
  grain: 'off',
  toggleAxis: false,
  zoomOut: false,
  enableTransition: false,
}

const PRESETS = [
  {
    name: '01-center-soft-bloom',
    mask: 'radial-gradient(ellipse 44% 58% at 50% 50%, #fff 0%, #fff 12%, rgba(255,255,255,.82) 28%, transparent 72%)',
    filter: 'brightness(1.45) contrast(1.28)',
    props: { uTime: 0.6, uStrength: 0.9, uDensity: 0.8, uFrequency: 2.2, rotationZ: 0, cAzimuthAngle: 180 },
  },
  {
    name: '02-diagonal-sweep',
    mask: 'linear-gradient(126deg, transparent 31%, rgba(255,255,255,.16) 40%, #fff 48%, #fff 52%, rgba(255,255,255,.18) 61%, transparent 70%)',
    filter: 'brightness(1.6) contrast(1.38)',
    props: { uTime: 1.35, uStrength: 1.8, uDensity: 1.6, uFrequency: 4.2, rotationZ: 18, cAzimuthAngle: 220 },
  },
  {
    name: '03-horizontal-anamorphic',
    mask: 'linear-gradient(180deg, transparent 38%, rgba(255,255,255,.18) 45%, #fff 49%, #fff 51%, rgba(255,255,255,.18) 56%, transparent 63%)',
    filter: 'brightness(1.85) contrast(1.55)',
    props: { uTime: 2.15, uStrength: 0.6, uDensity: 2.6, uFrequency: 6.8, rotationZ: 0, cAzimuthAngle: 270 },
  },
  {
    name: '04-top-left-flare',
    mask: 'radial-gradient(circle at 18% 22%, #fff 0%, #fff 7%, rgba(255,255,255,.82) 18%, rgba(255,255,255,.26) 34%, transparent 58%)',
    filter: 'brightness(1.72) contrast(1.34)',
    props: { uTime: 0.95, uStrength: 1.1, uDensity: 1.1, uFrequency: 3.4, positionX: -0.45, positionY: 0.28, rotationZ: -12, cAzimuthAngle: 145 },
  },
  {
    name: '05-top-edge-glow',
    mask: 'linear-gradient(180deg, #fff 0%, rgba(255,255,255,.8) 9%, rgba(255,255,255,.3) 22%, transparent 46%)',
    filter: 'brightness(1.55) contrast(1.3)',
    props: { uTime: 1.8, uStrength: 1.3, uDensity: 0.75, uFrequency: 2.8, positionY: 0.35, rotationZ: 4, cAzimuthAngle: 200 },
  },
  {
    name: '06-bottom-right-glow',
    mask: 'radial-gradient(ellipse 52% 62% at 86% 86%, #fff 0%, rgba(255,255,255,.88) 12%, rgba(255,255,255,.32) 34%, transparent 67%)',
    filter: 'brightness(1.62) contrast(1.35)',
    props: { uTime: 2.75, uStrength: 1.55, uDensity: 1.35, uFrequency: 3.9, positionX: 0.42, positionY: -0.34, rotationZ: 14, cAzimuthAngle: 305 },
  },
  {
    name: '07-vertical-light-leak',
    mask: 'linear-gradient(90deg, transparent 32%, rgba(255,255,255,.12) 41%, #fff 48%, #fff 52%, rgba(255,255,255,.12) 60%, transparent 69%)',
    filter: 'brightness(1.75) contrast(1.48)',
    props: { uTime: 3.25, uStrength: 2.1, uDensity: 1.9, uFrequency: 5.6, rotationZ: -7, cAzimuthAngle: 248 },
  },
  {
    name: '08-crossed-double-streak',
    mask: 'linear-gradient(132deg, transparent 34%, #fff 48%, transparent 58%), linear-gradient(48deg, transparent 41%, rgba(255,255,255,.76) 49%, transparent 57%)',
    filter: 'brightness(1.82) contrast(1.58)',
    props: { uTime: 4.1, uStrength: 1.35, uDensity: 2.35, uFrequency: 6.2, rotationZ: 22, cAzimuthAngle: 110 },
  },
  {
    name: '09-halo-ring',
    mask: 'radial-gradient(circle at 50% 50%, transparent 0%, transparent 21%, rgba(255,255,255,.25) 24%, #fff 28%, rgba(255,255,255,.44) 33%, transparent 40%)',
    filter: 'brightness(1.68) contrast(1.42)',
    props: { uTime: 4.8, uStrength: 0.75, uDensity: 1.55, uFrequency: 4.8, rotationZ: -18, cAzimuthAngle: 330 },
  },
  {
    name: '10-wide-haze-wash',
    mask: 'radial-gradient(ellipse 76% 66% at 54% 47%, #fff 0%, rgba(255,255,255,.86) 18%, rgba(255,255,255,.42) 45%, rgba(255,255,255,.12) 65%, transparent 83%)',
    filter: 'brightness(1.42) contrast(1.2)',
    props: { uTime: 5.65, uStrength: 2.35, uDensity: 0.62, uFrequency: 2.1, rotationZ: 8, cAzimuthAngle: 260 },
  },
]

function GlareFrame() {
  const params = new URLSearchParams(window.location.search)
  const index = Math.max(0, Math.min(PRESETS.length - 1, Number(params.get('preset') || 0)))
  const preset = PRESETS[index]

  useEffect(() => {
    document.title = preset.name
    window.__PRESET_NAME__ = preset.name
    const timer = window.setTimeout(() => {
      requestAnimationFrame(() => requestAnimationFrame(() => {
        window.__RENDER_READY__ = true
      }))
    }, 1500)
    return () => window.clearTimeout(timer)
  }, [preset.name])

  return (
    <main style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#000' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          WebkitMaskImage: preset.mask,
          maskImage: preset.mask,
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
          filter: preset.filter,
          transform: 'translateZ(0)',
        }}
      >
        <ShaderGradientCanvas
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          pixelDensity={1}
          fov={45}
          pointerEvents="none"
          preserveDrawingBuffer={true}
          powerPreference="high-performance"
          lazyLoad={false}
        >
          <ShaderGradient {...BASE} {...preset.props} />
        </ShaderGradientCanvas>
      </div>
    </main>
  )
}

createRoot(document.getElementById('root')).render(<GlareFrame />)
