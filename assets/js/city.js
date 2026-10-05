/* ============================================================================
   MR NAGA — City stockist pages
   Suburb shortcuts: each chip drops its suburb into the finder search, which
   stockists.js then filters on. Pressing the active chip again clears it.
   ========================================================================== */
(function () {
  'use strict';

  var input = document.getElementById('stockistSearch');
  var chips = Array.prototype.slice.call(document.querySelectorAll('.cy-suburbs button'));
  if (!input || !chips.length) return;

  function sync() {
    var q = input.value.trim().toLowerCase();
    chips.forEach(function (c) {
      c.setAttribute('aria-pressed', String(q !== '' && c.getAttribute('data-q') === q));
    });
  }

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var on = chip.getAttribute('aria-pressed') === 'true';
      input.value = on ? '' : chip.getAttribute('data-q');
      // stockists.js listens for input events
      input.dispatchEvent(new Event('input', { bubbles: true }));
      sync();
    });
  });

  // typing, the clear button and "Clear filters" all change the query too
  input.addEventListener('input', sync);
  document.addEventListener('click', function (e) {
    if (e.target.closest('#stockistClear, #stockistReset')) window.setTimeout(sync, 0);
  });
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') window.setTimeout(sync, 0);
  });
})();
