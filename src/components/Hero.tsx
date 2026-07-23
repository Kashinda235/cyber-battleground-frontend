
const Hero = ( { onStart }) => {
  return (
    <header className="hero">
    <div className="eyebrow">
      <span className="dot"></span> 
      HACK — DEFEND — DOMINATEE
      </div>
    <h1>Welcome to the world
        <br></br>of <em>digital warfare.</em></h1>
    <p className="hero-sub">Enter Cyber Battleground, where intelligence is your greatest weapon. Play, Attack, Defend, Watch in an expansive cyber ecosystem filled with interactive NPCs and unpredictable threats. Plan your moves, execute precision decisions, and adapt to a living digital world where every action carries consequences. In this battleground, strategy decides survival.</p>
    <div className="hero-actions">
      <a className="btn-primary" onClick={() => onStart() }>Join Simulation</a>
      <a className="btn-ghost" href="#approach">View our methodology</a>
    </div>
    <div className="stat-row">
      <div className="stat"><b>312</b><span>ENVIRONMENTS HARDENED</span></div>
      <div className="stat"><b>48min</b><span>AVG. DETECTION TIME</span></div>
      <div className="stat"><b>0</b><span>MISSED CRITICAL FINDINGS</span></div>
    </div>
  </header>
  )
}

export default Hero
