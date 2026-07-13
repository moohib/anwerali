/* ==========================================================================
   Small, dependency-free interactions. Nothing here needs a build step —
   edit this file directly and refresh the page to see changes.
========================================================================== */

document.getElementById('year').textContent = new Date().getFullYear();

/* ---- mobile nav toggle ---- */
var toggle = document.querySelector('.nav-toggle');
var navList = document.getElementById('nav-list');
if (toggle) {
  toggle.addEventListener('click', function () {
    var open = navList.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  navList.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      navList.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---- the nuqta: follows the pointer on capable devices ---- */
var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var nuqta = document.querySelector('.nuqta');
if (nuqta && !reduceMotion && window.matchMedia('(hover: hover)').matches) {
  window.addEventListener('mousemove', function (e) {
    nuqta.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px) translate(-50%,-50%)';
    nuqta.classList.add('is-visible');
  });
  document.addEventListener('mouseleave', function () {
    nuqta.classList.remove('is-visible');
  });
}

/* ---- scroll reveal for section content ---- */
var revealTargets = document.querySelectorAll('.section .split, .section .pub-list, .section .project-grid, .section .contact-grid, .section .section-intro, .section h2');
revealTargets.forEach(function (el) { el.classList.add('reveal'); });

if ('IntersectionObserver' in window && !reduceMotion) {
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealTargets.forEach(function (el) { io.observe(el); });
} else {
  revealTargets.forEach(function (el) { el.classList.add('is-in'); });
}

/* ---- halftone canvas backdrop for the hero ----
   A quiet field of dots that grow subtly near an implied light source,
   referencing the offset-print halftone screens of commercial advertising. */
(function halftone() {
  var canvas = document.getElementById('halftone');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var w, h, cols, rows, spacing = 22;

  function size() {
    var rect = canvas.parentElement.getBoundingClientRect();
    w = rect.width; h = rect.height;
    canvas.width = w * dpr; canvas.height = h * dpr;
    canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(w / spacing) + 1;
    rows = Math.ceil(h / spacing) + 1;
  }
  size();
  window.addEventListener('resize', size);

  var t = 0;
  function draw() {
    ctx.clearRect(0, 0, w, h);
    var cx = w * 0.78, cy = h * 0.25;
    for (var i = 0; i < cols; i++) {
      for (var j = 0; j < rows; j++) {
        var x = i * spacing, y = j * spacing;
        var d = Math.hypot(x - cx, y - cy);
        var falloff = Math.max(0, 1 - d / (w * 0.9));
        var wobble = reduceMotion ? 0 : Math.sin(t * 0.0006 + i * 0.4 + j * 0.4) * 0.15;
        var r = Math.max(0.4, falloff * 2.6 + wobble);
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(238,236,228,' + (0.08 + falloff * 0.35) + ')';
        ctx.fill();
      }
    }
    if (!reduceMotion) {
      t += 16;
      requestAnimationFrame(draw);
    }
  }
  draw();
})();
