export const SectionA = () => {
    return (
        <section className="section" id="capabilities">
    <div className="section-head">
      <h2>Capabilities</h2>
      <p>Four disciplines, one operations team — engaged separately or as a continuous program.</p>
    </div>
    <div className="cap-grid">
      <div className="cap-card">
        <div className="cap-idx">01 / OFFENSE</div>
        <h3>Red Team Operations</h3>
        <p>Full-scope adversary simulation against your real defenses, not a checklist scan.</p>
      </div>
      <div className="cap-card">
        <div className="cap-idx">02 / DETECTION</div>
        <h3>Threat Hunting</h3>
        <p>Proactive sweeps for adversaries already inside, before they reach the objective.</p>
      </div>
      <div className="cap-card">
        <div className="cap-idx">03 / RESPONSE</div>
        <h3>Incident Response</h3>
        <p>On-call responders when minutes matter, from containment through root cause.</p>
      </div>
      <div className="cap-card">
        <div className="cap-idx">04 / ASSURANCE</div>
        <h3>Compliance & Audit</h3>
        <p>SOC 2, ISO 27001, and framework-ready evidence without the busywork.</p>
      </div>
    </div>
  </section>
    )
}

export const SectionB = () => {
    return (
        <section className="section" id="approach">
    <div className="section-head">
      <h2>How to operate</h2>
      <p>Every engagement follows the same four-stage discipline.</p>
    </div>
    <div className="approach">
      <div className="approach-list">
        <div className="approach-item">
          <span className="n">01</span>
          <div><h4>Recon & scoping</h4><p>We map the real attack surface — assets, identities, and trust paths — before touching anything.</p></div>
        </div>
        <div className="approach-item">
          <span className="n">02</span>
          <div><h4>Controlled exploitation</h4><p>Operators chain findings the way a real adversary would, with agreed rules of engagement throughout.</p></div>
        </div>
        <div className="approach-item">
          <span className="n">03</span>
          <div><h4>Detection review service</h4><p>We check what your team saw, missed, and how fast they responded — not just what broke.</p></div>
        </div>
        <div className="approach-item">
          <span className="n">04</span>
          <div><h4>Remediation partnership</h4><p>Findings ship with fixes, retest windows, and direct access to the operators who found them.</p></div>
        </div>
      </div>
      <div className="approach-panel">
        <div className="title">SAMPLE FINDING LOG</div>
        <div>[09:14:02] <span className="k">recon</span> — external ASN enumerated</div>
        <div>[09:41:18] <span className="k">access</span> — stale VPN cert accepted</div>
        <div>[10:02:55] <span className="k">pivot</span> — lateral move via svc account</div>
        <div>[10:37:41] <span className="k">detect</span> — SOC alert fired, 6min</div>
        <div>[11:05:09] <span className="k">contain</span> — session revoked</div>
        <div>[11:12:30] <span className="k">report</span> — finding filed, sev: high</div>
      </div>
    </div>
  </section>
    )
}