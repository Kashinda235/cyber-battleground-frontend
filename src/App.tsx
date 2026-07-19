import { useState } from 'react'
import Loader from "./components/Loader"
import Site from "./components/Site"

const App = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="app-container">
      {/* 1. Show the loader if it hasn't completed yet */}
      <Loader onComplete={() => setIsLoaded(true)} />

      {/* 2. Your actual main site layout */}
      {/* You can use the `isLoaded` state to trigger CSS transitions like your original `.in` class */}
      <div id="main-site" className={isLoaded ? 'in' : ''}>
        <Site />
      </div>
    </div>
  )
}

export default App
