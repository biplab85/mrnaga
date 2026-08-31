/* ============================================================================
   MR NAGA — landing page behaviour
   Progressive enhancement: every section is usable with JS disabled.
   ========================================================================== */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------- sticky header --- */
  var header = document.getElementById('siteHeader');
  if (header) {
    var lastStuck = null;
    var onScroll = function () {
      var stuck = window.scrollY > 8;
      if (stuck !== lastStuck) {
        header.classList.toggle('is-stuck', stuck);
        lastStuck = stuck;
      }
    };
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () { onScroll(); ticking = false; });
    }, { passive: true });
    onScroll();
  }

  /* ------------------------------------------------------ mobile menu --- */
  var menuToggle = document.getElementById('menuToggle');
  var mobileNav = document.getElementById('mobileNav');
  if (menuToggle && mobileNav) {
    var setMenu = function (open) {
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      mobileNav.hidden = !open;
    };
    menuToggle.addEventListener('click', function () {
      setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
    });
    mobileNav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        menuToggle.focus();
      }
    });
    // never leave the drawer open when we cross into desktop layout
    var wide = window.matchMedia('(min-width: 1024px)');
    var syncWide = function () { if (wide.matches) setMenu(false); };
    wide.addEventListener ? wide.addEventListener('change', syncWide) : wide.addListener(syncWide);
  }

  /* --------------------------------------------------- currency menu ---- */
  var curBtn = document.getElementById('currencyBtn');
  var curMenu = document.getElementById('currencyMenu');
  if (curBtn && curMenu) {
    var setCur = function (open) {
      curBtn.setAttribute('aria-expanded', String(open));
      curMenu.hidden = !open;
    };
    curBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      setCur(curBtn.getAttribute('aria-expanded') !== 'true');
    });
    curMenu.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      curMenu.querySelectorAll('[role="option"]').forEach(function (li) {
        li.setAttribute('aria-selected', String(li.contains(b)));
      });
      curBtn.querySelector('span').textContent = /New Zealand/.test(b.textContent) ? 'NZD' : 'AUD';
      setCur(false);
      curBtn.focus();
    });
    document.addEventListener('click', function () { setCur(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && curBtn.getAttribute('aria-expanded') === 'true') {
        setCur(false); curBtn.focus();
      }
    });
  }

  /* ------------------------------------------------- product filtering -- */
  var filters = Array.prototype.slice.call(document.querySelectorAll('.filter'));
  var grid = document.getElementById('productGrid');
  var status = document.getElementById('filterStatus');

  if (filters.length && grid) {
    var cards = Array.prototype.slice.call(grid.querySelectorAll('.card'));

    var apply = function (key) {
      var shown = 0;
      cards.forEach(function (card) {
        var cats = (card.getAttribute('data-cat') || '').split(/\s+/);
        var match = key === 'all' || cats.indexOf(key) !== -1;
        card.hidden = !match;
        if (match) shown++;
      });
      if (status) {
        status.textContent = 'Showing ' + shown + ' ' +
          (shown === 1 ? 'product' : 'products') +
          (key === 'all' ? '.' : ' in ' + key + '.');
      }
    };

    filters.forEach(function (btn, i) {
      btn.addEventListener('click', function () {
        filters.forEach(function (b) {
          b.classList.remove('is-active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');
        apply(btn.getAttribute('data-filter'));
      });

      // roving arrow-key navigation across the tablist
      btn.addEventListener('keydown', function (e) {
        var dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!dir) return;
        e.preventDefault();
        var next = filters[(i + dir + filters.length) % filters.length];
        next.focus();
        next.click();
      });
    });
  }

  /* ------------------------------------------------------- accordions --- */
  Array.prototype.forEach.call(document.querySelectorAll('.acc__btn'), function (btn) {
    var panel = document.getElementById(btn.getAttribute('aria-controls'));
    if (!panel) return;

    // wrap content so we can animate padding-free height
    if (!panel.querySelector('.acc__inner')) {
      var inner = document.createElement('div');
      inner.className = 'acc__inner';
      while (panel.firstChild) inner.appendChild(panel.firstChild);
      panel.appendChild(inner);
    }

    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';

      if (open) {
        if (reduced) { panel.hidden = true; }
        else {
          panel.style.height = panel.scrollHeight + 'px';
          requestAnimationFrame(function () {
            panel.style.transition = 'height 260ms cubic-bezier(.22,.61,.36,1)';
            panel.style.height = '0px';
          });
          panel.addEventListener('transitionend', function done() {
            panel.hidden = true;
            panel.style.transition = panel.style.height = '';
            panel.removeEventListener('transitionend', done);
          });
        }
        btn.setAttribute('aria-expanded', 'false');
      } else {
        panel.hidden = false;
        btn.setAttribute('aria-expanded', 'true');
        if (!reduced) {
          var h = panel.scrollHeight;
          panel.style.height = '0px';
          requestAnimationFrame(function () {
            panel.style.transition = 'height 300ms cubic-bezier(.22,.61,.36,1)';
            panel.style.height = h + 'px';
          });
          panel.addEventListener('transitionend', function done() {
            panel.style.transition = panel.style.height = '';
            panel.removeEventListener('transitionend', done);
          });
        }
      }
    });
  });

  /* ---------------------------------------------------- scroll reveals -- */
  var reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) { /* nothing to do */ }
  else if (reduced || !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(reveals, function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    Array.prototype.forEach.call(reveals, function (el) { io.observe(el); });
  }

  /* --------------------------------------------- marquee: seamless loop -- */
  // The CSS translates the track by -50%, which only reads as seamless when the
  // first half of the content is an exact duplicate of the second half.
  var track = document.querySelector('.marquee__track');
  if (track) {
    var items = Array.prototype.slice.call(track.children);
    items.forEach(function (node) { track.appendChild(node.cloneNode(true)); });
  }

  /* ------------------------------------------------ newsletter signup --- */
  var form = document.getElementById('signupForm');
  if (form) {
    var email = document.getElementById('email');
    var err = document.getElementById('emailError');
    var ok = document.getElementById('signupSuccess');
    var submit = document.getElementById('signupBtn');

    var showError = function (msg) {
      err.textContent = msg;
      err.hidden = false;
      email.setAttribute('aria-invalid', 'true');
    };
    var clearError = function () {
      err.hidden = true;
      err.textContent = '';
      email.removeAttribute('aria-invalid');
    };

    var valid = function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); };

    // validate on blur, not on every keystroke
    email.addEventListener('blur', function () {
      if (!email.value.trim()) return clearError();
      if (!valid(email.value)) showError('Enter a valid email address, like you@example.com.');
      else clearError();
    });
    email.addEventListener('input', function () {
      if (!err.hidden && valid(email.value)) clearError();
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      ok.hidden = true;

      if (!email.value.trim()) {
        showError('Enter your email address to sign up.');
        email.focus();
        return;
      }
      if (!valid(email.value)) {
        showError('Enter a valid email address, like you@example.com.');
        email.focus();
        return;
      }

      clearError();
      submit.disabled = true;
      var original = submit.textContent;
      submit.textContent = 'Signing up…';

      // Front-end only. Wire this to your Shopify customer / Klaviyo endpoint.
      window.setTimeout(function () {
        submit.disabled = false;
        submit.textContent = original;
        form.reset();
        ok.hidden = false;
      }, 700);
    });
  }
})();
