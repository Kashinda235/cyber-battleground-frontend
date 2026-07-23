import Footer from "../components/Footer.tsx"
import Hero from "../components/Hero.tsx"
import NavBar from "../components/NavBar.tsx"
import NetBackground from "../components/NetBackground.tsx"
import { SectionA, SectionB } from "../components/Section.tsx"
// import "../styles/site.css"

const Home = ( {onStart}) => {
  return (
    <div className="cyber-theme">
        <NetBackground />
        <main className="app-content">
            
      <NavBar />
      <Hero onStart={onStart}/>

      <SectionA />
      <SectionB />

      <Footer />
        </main>
    </div>
  )
}

export default Home
