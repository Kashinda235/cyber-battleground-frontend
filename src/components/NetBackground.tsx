import { useEffect, useRef } from "react";

export default function NetBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    console.log(canvasRef.current);

    let w, h;
    let nodes = [];
    let packets = [];
    let animationId;

    const NODE_COUNT = window.innerWidth < 700 ? 34 : 62;
    const LINK_DIST = 160;
    const reduced = false; // you can hook this to prefers-reduced-motion if you want

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }

    function makeNodes() {
      nodes = [];
      for (let i = 0; i < NODE_COUNT; i++) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.18,
          vy: (Math.random() - 0.5) * 0.18,
          r: Math.random() * 1.4 + 0.8,
        });
      }
    }

    function maybeSpawnPacket(edges) {
      if (edges.length === 0) return;
      if (Math.random() < 0.012) {
        const e = edges[Math.floor(Math.random() * edges.length)];
        packets.push({
          a: e.a,
          b: e.b,
          t: 0,
          speed: 0.006 + Math.random() * 0.006,
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);

      // update nodes
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }

      // draw links
      const edges = [];
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i],
            b = nodes[j];
          const dx = a.x - b.x,
            dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < LINK_DIST) {
            const alpha = (1 - dist / LINK_DIST) * 0.22;
            ctx.strokeStyle = `rgba(0,217,255,${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();

            edges.push({ a, b, dist });
          }
        }
      }

      // draw nodes
      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,217,255,0.55)";
        ctx.fill();
      }

      // packets
      if (!reduced) maybeSpawnPacket(edges);

      packets.forEach((p) => {
        p.t += p.speed;
      });

      packets = packets.filter((p) => p.t < 1);

      for (const p of packets) {
        const x = p.a.x + (p.b.x - p.a.x) * p.t;
        const y = p.a.y + (p.b.y - p.a.y) * p.t;

        const grd = ctx.createRadialGradient(x, y, 0, x, y, 6);
        grd.addColorStop(0, "rgba(255,138,61,0.9)");
        grd.addColorStop(1, "rgba(255,138,61,0)");

        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
      }

      animationId = requestAnimationFrame(draw);
    }

    // init
    resize();
    makeNodes();
    draw();

    window.addEventListener("resize", resize);

    // cleanup (VERY important in React)
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      id="net-bg"
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
      }}
    />
  );
}