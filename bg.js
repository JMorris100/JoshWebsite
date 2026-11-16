// Animated background network.
// Redraws the dots and lines from bg-network.svg on a canvas. Each dot gets a
// depth, so as you scroll the dots move at different speeds (parallax) and the
// lines between them stretch. Dots also drift slowly on their own.
// If anything fails, the static SVG background in styles.css stays in place.
(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var root = document.documentElement;
  var VIEW_W = 1100, VIEW_H = 1500;      // viewBox of bg-network.svg
  var EXTRA_H = 1.4;                     // draw taller than the screen so parallax never shows an edge
  var PARALLAX = 0.32;                   // how far dots travel over a full page scroll, as a share of screen height

  var canvas, ctx, nodes = [], lines = [];
  var W = 0, H = 0, dpr = 1, scale = 1, offY = 0;
  var colours = {};
  var smoothScroll = null;

  // Small deterministic random so the layout is the same on every visit
  function rand(i) {
    var x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
    return x - Math.floor(x);
  }

  function readColours() {
    var cs = getComputedStyle(root);
    colours.line = cs.getPropertyValue('--pattern-line').trim() || 'rgba(46,61,71,0.2)';
    colours.node = cs.getPropertyValue('--pattern-node').trim() || 'rgba(46,61,71,0.35)';
    colours.accent = cs.getPropertyValue('--pattern-accent').trim() || colours.node;
  }

  function nodeAt(x, y) {
    for (var i = 0; i < nodes.length; i++) {
      if (Math.abs(nodes[i].x - x) < 1.5 && Math.abs(nodes[i].y - y) < 1.5) return i;
    }
    nodes.push({ x: x, y: y, r: 0 });
    return nodes.length - 1;
  }

  function parse(svgText) {
    var doc = new DOMParser().parseFromString(svgText, 'image/svg+xml');
    var num = function (el, a) { return parseFloat(el.getAttribute(a)) || 0; };
    Array.prototype.forEach.call(doc.querySelectorAll('circle'), function (c) {
      nodes.push({ x: num(c, 'cx'), y: num(c, 'cy'), r: num(c, 'r') });
    });
    Array.prototype.forEach.call(doc.querySelectorAll('line'), function (l) {
      lines.push([nodeAt(num(l, 'x1'), num(l, 'y1')), nodeAt(num(l, 'x2'), num(l, 'y2'))]);
    });
    nodes.forEach(function (n, i) {
      n.depth = 0.25 + rand(i) * 0.95;        // 0.25 (far, slow) to 1.2 (near, fast)
      n.phase = rand(i + 500) * Math.PI * 2;
      n.speed = 0.6 + rand(i + 900) * 0.8;
      n.accent = n.r >= 3.5 && rand(i + 1300) > 0.35;
    });
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    // Cover the screen, anchored left like the original SVG
    scale = Math.max(W / VIEW_W, (H * EXTRA_H) / VIEW_H);
    offY = (H - VIEW_H * scale) / 2;
    readColours();
  }

  function scrollProgress() {
    var max = document.documentElement.scrollHeight - H;
    return max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
  }

  function draw(time) {
    var still = reduceMotion.matches;
    var target = still ? 0 : scrollProgress();
    // Ease towards the scroll position for a floaty feel
    smoothScroll = smoothScroll === null ? target : smoothScroll + (target - smoothScroll) * 0.08;
    var shift = (smoothScroll - 0.5) * H * PARALLAX;
    var drift = still ? 0 : Math.min(8, 5 * Math.sqrt(scale));
    var t = (time || 0) / 1000;

    var px = new Array(nodes.length), py = new Array(nodes.length);
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      px[i] = n.x * scale + Math.sin(t * 0.25 * n.speed + n.phase) * drift;
      py[i] = n.y * scale + offY - shift * n.depth + Math.cos(t * 0.2 * n.speed + n.phase) * drift;
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    // Phones have less room either side of the text, so keep the pattern quieter there
    ctx.globalAlpha = W < 720 ? 0.7 : 1;

    ctx.strokeStyle = colours.line;
    ctx.lineWidth = Math.min(1.4, Math.max(0.7, 0.8 * scale));
    ctx.beginPath();
    for (var j = 0; j < lines.length; j++) {
      ctx.moveTo(px[lines[j][0]], py[lines[j][0]]);
      ctx.lineTo(px[lines[j][1]], py[lines[j][1]]);
    }
    ctx.stroke();

    var rScale = Math.min(1.6, Math.max(0.9, scale));
    for (var k = 0; k < nodes.length; k++) {
      var nd = nodes[k];
      if (!nd.r) continue;
      ctx.fillStyle = nd.accent ? colours.accent : colours.node;
      ctx.beginPath();
      ctx.arc(px[k], py[k], nd.r * rScale, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function loop(time) {
    if (!document.hidden) draw(time);
    if (!reduceMotion.matches) requestAnimationFrame(loop);
  }

  function start(svgText) {
    parse(svgText);
    if (!nodes.length) return;
    canvas = document.createElement('canvas');
    canvas.className = 'bg-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    ctx = canvas.getContext('2d');
    if (!ctx) return;
    document.body.insertBefore(canvas, document.body.firstChild);
    root.classList.add('has-bg-canvas');
    resize();

    window.addEventListener('resize', function () { resize(); if (reduceMotion.matches) draw(0); });
    // Redraw colours when the theme changes (toggle or device setting)
    new MutationObserver(function () { readColours(); if (reduceMotion.matches) draw(0); })
      .observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
      readColours(); if (reduceMotion.matches) draw(0);
    });
    reduceMotion.addEventListener('change', function () { draw(0); if (!reduceMotion.matches) requestAnimationFrame(loop); });

    if (reduceMotion.matches) draw(0); else requestAnimationFrame(loop);
  }

  fetch('/bg-network.svg')
    .then(function (r) { return r.ok ? r.text() : Promise.reject(); })
    .then(start)
    .catch(function () { /* keep the static background */ });
})();
