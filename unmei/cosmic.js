/* 外側の夜空：星は少数・ゆっくり。読面を邪魔しない */
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
    var n = Math.min(42, Math.floor((window.innerWidth * window.innerHeight) / 28000));
    stars = [];
    for (var i = 0; i < n; i++) {
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.4 + 0.4,
        a: Math.random() * 0.55 + 0.15,
        s: Math.random() * 0.008 + 0.004,
        p: Math.random() * Math.PI * 2,
        warm: Math.random() > 0.72
      });
    }
  }

  var t0 = performance.now();
  function frame(now) {
    var w = window.innerWidth;
    var h = window.innerHeight;
    ctx.clearRect(0, 0, w, h);
    // ごく薄い光のオーブ
    var g1 = ctx.createRadialGradient(w * 0.5, h * 0.08, 0, w * 0.5, h * 0.08, w * 0.45);
    g1.addColorStop(0, "rgba(140,100,200,0.16)");
    g1.addColorStop(1, "rgba(140,100,200,0)");
    ctx.fillStyle = g1;
    ctx.fillRect(0, 0, w, h);

    var t = (now - t0) * 0.001;
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      var tw = reduced ? s.a : s.a * (0.55 + 0.45 * Math.sin(t * s.s * 60 + s.p));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.warm
        ? "rgba(255,220,160," + tw.toFixed(3) + ")"
        : "rgba(255,255,255," + tw.toFixed(3) + ")";
      ctx.fill();
    }
    if (!reduced) requestAnimationFrame(frame);
  }

  window.addEventListener("resize", resize);
  resize();
  requestAnimationFrame(frame);
})();
