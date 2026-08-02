import Footer from "../components/Home/Footer.tsx"
import Hero from "../components/Home/Hero.tsx"
import NavBar from "../components/Home/NavBar.tsx"
import NetBackground from "../components/Home/NetBackground.tsx"
import { SectionA, SectionB } from "../components/Home/Section.tsx"
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
