/* ============================================================================
   MR NAGA — Stockists finder
   Search + city filter. Progressive enhancement: with JS off the full list
   is still rendered and readable, just unfiltered.
   ========================================================================== */
(function () {
  'use strict';

  var finder = document.getElementById('finder');
  var input = document.getElementById('stockistSearch');
  var clear = document.getElementById('stockistClear');
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.st-filter'));
  var groups = Array.prototype.slice.call(document.querySelectorAll('.stockists__group'));
  var cards = Array.prototype.slice.call(document.querySelectorAll('.stockist'));
  var count = document.getElementById('stockistCount');
  var empty = document.getElementById('stockistEmpty');
  var reset = document.getElementById('stockistReset');

  if (!cards.length) return;

  var city = 'all';
  var query = '';

  function apply() {
    var shown = 0;

    cards.forEach(function (card) {
      var inCity = city === 'all' || card.getAttribute('data-city') === city;
      var match = !query || (card.getAttribute('data-search') || '').indexOf(query) !== -1;
      var visible = inCity && match;
      card.hidden = !visible;
      if (visible) shown++;
    });

    // hide a city heading once every card under it is filtered out
    groups.forEach(function (group) {
      var any = group.querySelectorAll('.stockist:not([hidden])').length;
      group.hidden = any === 0;
    });

    if (empty) empty.hidden = shown !== 0;

    if (count) {
      if (shown === 0) {
        count.innerHTML = 'No stockists match your search.';
      } else {
        var where = city === 'all' ? '' : ' in ' + city.charAt(0).toUpperCase() + city.slice(1);
        count.innerHTML = 'Showing <b>' + shown + '</b> ' +
          (shown === 1 ? 'stockist' : 'stockists') + where +
          (query ? ' for “' + esc(input.value.trim()) + '”' : '') + '.';
      }
    }

    if (finder) finder.classList.toggle('has-query', !!query);
  }

  function esc(s) {
    return s.replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  /* ------------------------------------------------------------ search --- */
  if (input) {
    var t = null;
    input.addEventListener('input', function () {
      window.clearTimeout(t);
      t = window.setTimeout(function () {
        query = input.value.trim().toLowerCase();
        apply();
      }, 140);
    });

    // Enter should not submit anything — there is no server behind this
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') e.preventDefault();
      if (e.key === 'Escape' && input.value) {
        input.value = '';
        query = '';
        apply();
      }
    });
  }

  if (clear) {
    clear.addEventListener('click', function () {
      input.value = '';
      query = '';
      apply();
      input.focus();
    });
  }

  /* ------------------------------------------------------- city filter --- */
  tabs.forEach(function (btn, i) {
    btn.addEventListener('click', function () {
      tabs.forEach(function (b) {
        b.classList.remove('is-active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');
      city = btn.getAttribute('data-city');
      apply();
    });

    // roving arrow-key navigation across the tablist
    btn.addEventListener('keydown', function (e) {
      var dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!dir) return;
      e.preventDefault();
      var next = tabs[(i + dir + tabs.length) % tabs.length];
      next.focus();
      next.click();
    });
  });

  /* ------------------------------------------------- reset from empty ---- */
  if (reset) {
    reset.addEventListener('click', function () {
      if (input) input.value = '';
      query = '';
      city = 'all';
      tabs.forEach(function (b) {
        var on = b.getAttribute('data-city') === 'all';
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-selected', String(on));
      });
      apply();
      if (input) input.focus();
    });
  }

  apply();
})();
