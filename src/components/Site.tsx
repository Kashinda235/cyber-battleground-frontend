import Footer from "./Footer"
import Header from "./Header"
import NavBar from "./NavBar"
import NetBackground from "./NetBackground"
import { SectionA, SectionB } from "./Section"


const Site = () => {
  return (
    <div>
        <NetBackground />
        <main className="app-content">
            
      <NavBar />
      <Header />

      <SectionA />
      <SectionB />

      <Footer />
        </main>
    </div>
  )
}

export default Site
