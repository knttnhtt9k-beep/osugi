/* 外側：四筋の金糸とことだま。五芒星は使わない */
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
    var n = Math.min(48, Math.floor((window.innerWidth * window.innerHeight) / 24000));
    stars = [];
    for (var i = 0; i < n; i++) {
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.4 + 0.3,
        a: Math.random() * 0.55 + 0.16,
        s: Math.random() * 0.01 + 0.004,
        p: Math.random() * Math.PI * 2,
        warm: Math.random() > 0.55
      });
    }
    orbs = [];
    for (var j = 0; j < 10; j++) {
      orbs.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 3.2 + 1.4,
        a: Math.random() * 0.28 + 0.12,
        p: Math.random() * Math.PI * 2,
        s: 0.25 + Math.random() * 0.35
      });
    }
  }

  function drawThread(w, h, y, amp, phase, alpha) {
    ctx.beginPath();
    ctx.moveTo(-20, y);
    var x;
    for (x = 0; x <= w + 20; x += 8) {
      ctx.lineTo(x, y + Math.sin(x * 0.012 + phase) * amp);
    }
    ctx.strokeStyle = "rgba(224, 192, 90," + alpha + ")";
    ctx.lineWidth = 1.15;
    ctx.stroke();
  }

  var t0 = performance.now();
  function frame(now) {
    var w = window.innerWidth;
    var h = window.innerHeight;
    ctx.clearRect(0, 0, w, h);

    var g1 = ctx.createRadialGradient(w * 0.5, h * 0.06, 0, w * 0.5, h * 0.06, w * 0.5);
    g1.addColorStop(0, "rgba(150, 90, 220, 0.22)");
    g1.addColorStop(1, "rgba(150, 90, 220, 0)");
    ctx.fillStyle = g1;
    ctx.fillRect(0, 0, w, h);

    var t = (now - t0) * 0.001;
    drawThread(w, h, h * 0.18, 14, t * 0.35, 0.22);
    drawThread(w, h, h * 0.42, 18, t * 0.28 + 1.2, 0.18);
    drawThread(w, h, h * 0.64, 16, t * 0.32 + 2.1, 0.16);
    drawThread(w, h, h * 0.84, 12, t * 0.24 + 0.6, 0.14);

    var i;
    for (i = 0; i < stars.length; i++) {
      var s = stars[i];
      var tw = reduced ? s.a : s.a * (0.5 + 0.5 * Math.sin(t * s.s * 60 + s.p));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.warm
        ? "rgba(255, 220, 160," + tw.toFixed(3) + ")"
        : "rgba(255, 255, 255," + tw.toFixed(3) + ")";
      ctx.fill();
    }
    for (i = 0; i < orbs.length; i++) {
      var o = orbs[i];
      var oa = reduced ? o.a : o.a * (0.55 + 0.45 * Math.sin(t * o.s + o.p));
      var ox = o.x + Math.sin(t * o.s + o.p) * 8;
      var og = ctx.createRadialGradient(ox, o.y, 0, ox, o.y, o.r * 3);
      og.addColorStop(0, "rgba(255, 230, 160," + (oa + 0.08).toFixed(3) + ")");
      og.addColorStop(1, "rgba(255, 230, 160, 0)");
      ctx.fillStyle = og;
      ctx.beginPath();
      ctx.arc(ox, o.y, o.r * 3, 0, Math.PI * 2);
      ctx.fill();
    }
    if (!reduced) requestAnimationFrame(frame);
  }

  window.addEventListener("resize", resize);
  resize();
  requestAnimationFrame(frame);
})();
