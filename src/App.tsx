import { lazy, Suspense } from 'react'
import { MotionConfig } from 'motion/react'
import { CalmProvider, useCalm } from './context/CalmContext'
import { ProgressNav } from './components/layout/ProgressNav'
import Hero from './sections/Hero'
import Experiment from './sections/Experiment'

const HiddenCost = lazy(() => import('./sections/HiddenCost'))
const NotificationLab = lazy(() => import('./sections/NotificationLab'))
const Myths = lazy(() => import('./sections/Myths'))
const Challenge = lazy(() => import('./sections/Challenge'))
const Offscreen = lazy(() => import('./sections/Offscreen'))
const Closing = lazy(() => import('./sections/Closing'))
const Sources = lazy(() => import('./sections/Sources'))

function Placeholder() {
  return <div aria-hidden="true" className="min-h-[60vh]" />
}

function Shell() {
  const { calm } = useCalm()
  return (
    <MotionConfig reducedMotion={calm ? 'always' : 'user'}>
      <div id="top" />
      <ProgressNav />
      <main id="contenido" tabIndex={-1} className="outline-none">
        <Hero />
        <Experiment />
        <Suspense fallback={<Placeholder />}>
          <HiddenCost />
          <NotificationLab />
          <Myths />
          <Challenge />
          <Offscreen />
          <Closing />
          <Sources />
        </Suspense>
      </main>
    </MotionConfig>
  )
}

export default function App() {
  return (
    <CalmProvider>
      <Shell />
    </CalmProvider>
  )
}
