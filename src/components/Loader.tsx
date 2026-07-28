import { useState, useEffect, useRef } from 'react';

// Boot log data configuration
const BOOT_LINES = [
  { text: "&gt; booting secure kernel...", delay: 90 },
  { text: "&gt; handshaking with edge node <b class='ok'>[OK]</b>", delay: 90 },
  { text: "&gt; verifying integrity hash <span style='color:var(--text-faint)'>9f3a7c...c21e</span> <b class='ok'>[OK]</b>", delay: 90 },
  { text: "&gt; loading threat intel feed...", delay: 90 },
  { text: "&gt; spinning up analyst session <b class='ok'>[OK]</b>", delay: 60 },
];

const hexChars = '0123456789abcdef';
const randomHex = (len: number) => {
  let s = '';
  for (let i = 0; i < len; i++) s += hexChars[Math.floor(Math.random() * 16)];
  return s;
};

// @ts-expect-error oncomplete is function
export default function Loader({ onComplete }) {
  const [visibleLines, setVisibleLines] = useState([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(-1);
  const [progress, setProgress] = useState(0);
  const [hash, setHash] = useState('................');
  const [showAccessFlash, setShowAccessFlash] = useState(false);
  const [isWiped, setIsWiped] = useState(false);

  // Detect user preference for reduced motion
  const prefersReducedRef = useRef(false);

  // Phase 2: Progress and Hash updates
  const startProgress = () => {
    let pct = 0;
    const finalHash = randomHex(16);
    const intervalTime = prefersReducedRef.current ? 5 : 90;

    const iv = setInterval(() => {
      pct += Math.random() * 9 + 4;
      if (pct >= 100) {
        pct = 100;
        clearInterval(iv);
        setHash(finalHash);
        setProgress(100);
        setTimeout(finishBoot, 220);
      } else {
        setHash(randomHex(16));
        setProgress(pct);
      }
    }, intervalTime);
  };
  useEffect(() => {
    prefersReducedRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Initial startup delay
    const startTimeout = setTimeout(() => {
      setCurrentLineIndex(0);
    }, prefersReducedRef.current ? 10 : 300);

    return () => clearTimeout(startTimeout);
  }, []);

  // Phase 1: Typing text lines sequential logic
  useEffect(() => {
    if (currentLineIndex === -1) return;

    if (currentLineIndex < BOOT_LINES.length) {
      const currentLine = BOOT_LINES[currentLineIndex];
      
      // Append current line to array
      // @ts-ignore
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisibleLines((prev) => [...prev, currentLine.text]);

      const delayTime = prefersReducedRef.current ? 10 : currentLine.delay + 220;
      const lineTimeout = setTimeout(() => {
        setCurrentLineIndex((prev) => prev + 1);
      }, delayTime);

      return () => clearTimeout(lineTimeout);
    } else {
      // Phase 2: Start progress bar once all lines printed
      startProgress();
    }
  }, [currentLineIndex]);

  // Phase 3: Final Access granted animations
  const finishBoot = () => {
    setShowAccessFlash(true);
    const wipeDelay = prefersReducedRef.current ? 50 : 650;
    
    setTimeout(() => {
      setIsWiped(true);
      // Callback to notify parent layout/site component to fade in
      if (onComplete) onComplete();
    }, wipeDelay);
  };

  return (
    <div id="loader" className={isWiped ? 'wipe' : ''}>
      <div id="loader-inner">
        <div className="boot-header">
          <div className="boot-logo">CYBER<span>//</span>BATTLEGROUND</div>
          <div className="boot-id">SEC-BOOT v4.2</div>
        </div>

        <div id="boot-lines">
          {visibleLines.map((line, index) => {
            const isCurrent = index === currentLineIndex;
            return (
              <div
                key={index}
                className={`ln ${isCurrent ? 'cur' : ''}`}
                style={{ opacity: 1 }}
                dangerouslySetInnerHTML={{ __html: line }}
              />
            );
          })}
        </div>

        <div className="bar-row">
          <span>DECRYPT</span>
          <div id="bar-track">
            <div id="bar-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <span id="bar-pct">{Math.floor(progress)}%</span>
        </div>

        <div className="bar-row">
          <span>CHECKSUM</span>
          <span id="bar-hash" style={{ flex: 1, color: 'var(--text-faint)' }}>
            {hash}
          </span>
        </div>

        <div id="access-flash" className={showAccessFlash ? 'show' : ''}>
          &gt; ACCESS GRANTED — WELCOME
        </div>
      </div>
    </div>
  );
}