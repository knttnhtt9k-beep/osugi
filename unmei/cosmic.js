/* 四筋の金糸とことだま。縁診断の薄い星空とは別物 */
(function () {
  var canvas = document.getElementById("cosmicCanvas");
  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.id = "cosmicCanvas";
    document.body.prepend(canvas);
  }
  var ctx = canvas.getContext("2d");
  if (!ctx) return;
  var stars = [];
  var orbs = [];
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seed();
  }

  function seed() {
    var n = Math.min(70, Math.floor((window.innerWidth * window.innerHeight) / 16000));
    stars = [];
    var i;
    for (i = 0; i < n; i++) {
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.6 + 0.35,
        a: Math.random() * 0.7 + 0.2,
        s: Math.random() * 0.012 + 0.004,
        p: Math.random() * Math.PI * 2,
        warm: Math.random() > 0.42
      });
    }
    orbs = [];
    for (i = 0; i < 16; i++) {
      orbs.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 4.2 + 1.8,
        a: Math.random() * 0.35 + 0.16,
        p: Math.random() * Math.PI * 2,
        s: 0.2 + Math.random() * 0.4
      });
    }
  }

  function drawThread(w, y, amp, phase, alpha, width) {
    ctx.beginPath();
    ctx.moveTo(-30, y);
    var x;
    for (x = 0; x <= w + 30; x += 6) {
      ctx.lineTo(x, y + Math.sin(x * 0.011 + phase) * amp);
    }
    ctx.strokeStyle = "rgba(232, 200, 110," + alpha + ")";
    ctx.lineWidth = width;
    ctx.shadowColor = "rgba(224, 192, 90, .45)";
    ctx.shadowBlur = 8;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  var t0 = performance.now();
  function frame(now) {
    var w = window.innerWidth;
    var h = window.innerHeight;
    ctx.clearRect(0, 0, w, h);

    var g1 = ctx.createRadialGradient(w * 0.5, h * 0.12, 0, w * 0.5, h * 0.12, w * 0.62);
    g1.addColorStop(0, "rgba(160, 80, 230, 0.32)");
    g1.addColorStop(1, "rgba(160, 80, 230, 0)");
    ctx.fillStyle = g1;
    ctx.fillRect(0, 0, w, h);

    var t = (now - t0) * 0.001;
    drawThread(w, h * 0.16, 16, t * 0.42, 0.38, 1.6);
    drawThread(w, h * 0.38, 22, t * 0.33 + 1.1, 0.32, 1.45);
    drawThread(w, h * 0.6, 18, t * 0.38 + 2.2, 0.28, 1.35);
    drawThread(w, h * 0.82, 14, t * 0.29 + 0.7, 0.24, 1.25);

    var i;
    for (i = 0; i < stars.length; i++) {
      var s = stars[i];
      var tw = reduced ? s.a : s.a * (0.45 + 0.55 * Math.sin(t * s.s * 70 + s.p));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.warm
        ? "rgba(255, 220, 150," + tw.toFixed(3) + ")"
        : "rgba(255, 255, 255," + tw.toFixed(3) + ")";
      ctx.fill();
    }
    for (i = 0; i < orbs.length; i++) {
      var o = orbs[i];
      var oa = reduced ? o.a : o.a * (0.5 + 0.5 * Math.sin(t * o.s + o.p));
      var ox = o.x + Math.sin(t * o.s + o.p) * 14;
      var oy = o.y + Math.cos(t * o.s * 0.7 + o.p) * 8;
      var og = ctx.createRadialGradient(ox, oy, 0, ox, oy, o.r * 3.4);
      og.addColorStop(0, "rgba(255, 228, 160," + (oa + 0.12).toFixed(3) + ")");
      og.addColorStop(1, "rgba(255, 228, 160, 0)");
      ctx.fillStyle = og;
      ctx.beginPath();
      ctx.arc(ox, oy, o.r * 3.4, 0, Math.PI * 2);
      ctx.fill();
    }
    if (!reduced) requestAnimationFrame(frame);
  }

  window.addEventListener("resize", resize);
  resize();
  requestAnimationFrame(frame);
})();
