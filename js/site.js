(function () {
  var dust = document.getElementById("dust");
  var glow = document.getElementById("glow");
  var bar = document.getElementById("progress");
  var copyBtn = document.getElementById("copyMint");
  var ctx = dust.getContext("2d");
  var motes = [];
  var w = 0;
  var h = 0;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function size() {
    w = dust.width = window.innerWidth;
    h = dust.height = window.innerHeight;
  }

  function seed() {
    var count = Math.min(90, Math.floor(w / 16));
    motes = [];
    for (var i = 0; i < count; i++) {
      motes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.6 + 0.3,
        s: Math.random() * 0.35 + 0.05,
        a: Math.random() * 0.55 + 0.15,
        tw: Math.random() * Math.PI * 2
      });
    }
  }

  function frame() {
    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < motes.length; i++) {
      var m = motes[i];
      m.y -= m.s;
      m.x += Math.sin(m.tw) * 0.15;
      m.tw += 0.01;
      if (m.y < -4) {
        m.y = h + 4;
        m.x = Math.random() * w;
      }
      ctx.beginPath();
      ctx.fillStyle = "rgba(240, 214, 150," + (m.a * (0.65 + Math.sin(m.tw) * 0.35)) + ")";
      ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(frame);
  }

  size();
  if (!reduce) {
    seed();
    frame();
    window.addEventListener("resize", function () {
      size();
      seed();
    });
  }

  window.addEventListener("pointermove", function (e) {
    glow.style.left = e.clientX + "px";
    glow.style.top = e.clientY + "px";
  });

  function onScroll() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = "scaleX(" + (max > 0 ? window.scrollY / max : 0) + ")";
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var mint = copyBtn.getAttribute("data-mint");
      navigator.clipboard.writeText(mint).then(function () {
        copyBtn.classList.add("done");
        copyBtn.querySelector("span").textContent = "Copied";
        setTimeout(function () {
          copyBtn.classList.remove("done");
          copyBtn.querySelector("span").textContent = "Copy mint";
        }, 1600);
      });
    });
  }
})();
