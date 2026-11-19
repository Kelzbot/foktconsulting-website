/* FOKT Consulting: site motion. No dependencies.
   Every page works without this file. It only adds movement on top of the finished page. */
(function () {
  'use strict';
  var d = document, root = d.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var each = function (list, fn) { Array.prototype.forEach.call(list, fn); };

  /* Nav: reading-progress line and a shadow once the page has scrolled */
  var nav = d.querySelector('.nav');
  if (nav) {
    var bar = d.createElement('span');
    bar.className = 'nav__progress';
    bar.setAttribute('aria-hidden', 'true');
    nav.appendChild(bar);
    var queued = false;
    var paint = function () {
      queued = false;
      var room = root.scrollHeight - window.innerHeight;
      bar.style.transform = 'scaleX(' + (room > 0 ? Math.min(1, window.scrollY / room) : 0) + ')';
      nav.classList.toggle('is-scrolled', window.scrollY > 12);
    };
    window.addEventListener('scroll', function () {
      if (!queued) { queued = true; window.requestAnimationFrame(paint); }
    }, { passive: true });
    paint();
  }

  if (!('IntersectionObserver' in window)) return;

  /* Nav: mark the section being read */
  var spy = {};
  each(d.querySelectorAll('.nav__links a[href^="#"]'), function (a) { spy[a.getAttribute('href').slice(1)] = a; });
  var spyIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      Object.keys(spy).forEach(function (id) { spy[id].classList.toggle('is-active', id === e.target.id); });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  Object.keys(spy).forEach(function (id) { var s = d.getElementById(id); if (s) spyIO.observe(s); });

  if (reduce) return; /* everything below is movement */
  root.classList.add('motion');

  /* Blocks rise in as they enter the screen. Blocks already on screen are left alone. */
  var REVEAL = '.section-head,.req,.step,.fee__card,.fee__more,.fee__notes li,.about__photo,.about__body,' +
    '.faq-layout__intro,.faq details,.why > *,.retest__inner > *,.product,.closing__inner > *,' +
    '.post-list__item,.stats__grid > div';
  var revealIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target;
      revealIO.unobserve(el);
      el.classList.add('in');
      var wait = (parseFloat(el.style.getPropertyValue('--d')) || 0) * 1000 + 900;
      window.setTimeout(function () { /* hand the element back to its own hover transitions */
        el.removeAttribute('data-reveal');
        el.classList.remove('in');
        el.style.removeProperty('--d');
      }, wait);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
  each(d.querySelectorAll(REVEAL), function (el) {
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return;
    var i = Array.prototype.indexOf.call(el.parentNode.children, el);
    el.style.setProperty('--d', (Math.min(i, 5) * 0.07) + 's');
    el.setAttribute('data-reveal', '');
    revealIO.observe(el);
  });

  /* Run a function once, the first time an element is on screen */
  var once = function (el, fn, margin) {
    if (!el) return;
    var io = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { io.disconnect(); fn(); }
    }, { rootMargin: margin || '0px 0px -15% 0px' });
    io.observe(el);
  };

  /* Numbers count up to the figure already written in the page. The page keeps the real figure
     until the count starts, so a number can never be left sitting at zero. */
  each(d.querySelectorAll('[data-count]'), function (el) {
    var to = parseFloat(el.getAttribute('data-count'));
    if (!isFinite(to)) return;
    var final = el.textContent;
    var run = function () {
      var t0 = null, ms = 1300;
      var step = function (t) {
        if (t0 === null) t0 = t;
        var p = Math.min(1, (t - t0) / ms);
        el.textContent = p < 1 ? Math.round(to * (1 - Math.pow(1 - p, 3))).toLocaleString('en-US') : final;
        if (p < 1) window.requestAnimationFrame(step);
      };
      window.requestAnimationFrame(step);
      window.setTimeout(function () { el.textContent = final; }, ms + 400); /* safety net */
    };
    once(el, run, '0px');
  });

  /* Why findings repeat: the five steps light up in order, then the fix appears */
  var cycle = d.querySelector('.cycle');
  if (cycle) {
    var items = cycle.querySelectorAll('li');
    var fix = cycle.nextElementSibling;
    cycle.classList.add('is-armed');
    once(cycle, function () {
      each(items, function (li, i) {
        window.setTimeout(function () {
          li.classList.add('is-on');
          cycle.style.setProperty('--fill', (i + 1) / items.length);
        }, 250 + i * 520);
      });
      window.setTimeout(function () { if (fix) fix.classList.add('is-on'); }, 450 + items.length * 520);
    });
  }

  /* How it works: a line fills across the three steps */
  var steps = d.querySelector('.steps');
  once(steps, function () { steps.classList.add('is-on'); });

  /* Pointer effects, for mouse users only */
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  each(d.querySelectorAll('.workpaper,[data-tilt]'), function (frame) {
    var sheet = frame.querySelector('.workpaper__sheet') || frame;
    frame.addEventListener('pointermove', function (e) {
      var r = frame.getBoundingClientRect();
      sheet.style.setProperty('--ry', (((e.clientX - r.left) / r.width - 0.5) * 7).toFixed(2) + 'deg');
      sheet.style.setProperty('--rx', (((e.clientY - r.top) / r.height - 0.5) * -7).toFixed(2) + 'deg');
    });
    frame.addEventListener('pointerleave', function () {
      sheet.style.setProperty('--rx', '0deg');
      sheet.style.setProperty('--ry', '0deg');
    });
  });
  each(d.querySelectorAll('.req,.step,.fee__notes li,.post-list--home .post-list__item'), function (el) {
    el.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect();
      el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      el.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });
})();
