/* ============================================================================
   MR NAGA — Contact form
   Accessible validation for the enquiry form on contact.html.

   NOTE ON SUBMISSION — this is a static site with no backend, so there is
   nothing to POST to yet. Rather than fake a success message, the form
   degrades honestly:

     • Set data-endpoint="https://..." on #contactForm and the form POSTs the
       fields there as JSON, reporting the real result.
     • Leave data-endpoint="" (the current state) and submitting opens the
       visitor's mail client with the message pre-filled, addressed to
       data-fallback. The enquiry genuinely reaches the inbox either way.

   Validation runs on blur (not keystroke) and again on submit, per WCAG:
   errors sit beside the field they belong to and the first invalid field
   takes focus.
   ========================================================================== */
(function () {
  'use strict';

  var form = document.getElementById('contactForm');
  if (!form) { return; }

  var btn    = document.getElementById('contactBtn');
  var status = document.getElementById('contactStatus');

  var fields = [
    { el: document.getElementById('cName'),    err: document.getElementById('cNameError'),
      label: 'name',    msg: 'Please tell us your name.' },
    { el: document.getElementById('cEmail'),   err: document.getElementById('cEmailError'),
      label: 'email',   msg: 'Please enter a valid email address.' },
    { el: document.getElementById('cComment'), err: document.getElementById('cCommentError'),
      label: 'comment', msg: 'Please add a short message.' }
  ];

  var phone = document.getElementById('cPhone');

  var isEmail = function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); };

  var valid = function (f) {
    var v = f.el.value.trim();
    if (!v) { return false; }
    if (f.label === 'email') { return isEmail(v); }
    return true;
  };

  var showError = function (f) {
    f.err.textContent = f.msg;
    f.err.hidden = false;
    f.el.setAttribute('aria-invalid', 'true');
  };

  var clearError = function (f) {
    f.err.textContent = '';
    f.err.hidden = true;
    f.el.removeAttribute('aria-invalid');
  };

  var setStatus = function (msg, tone) {
    if (!status) { return; }
    status.textContent = msg;
    status.hidden = !msg;
    status.className = 'ct-status' + (tone ? ' ct-status--' + tone : '');
  };

  /* -- validate on blur, clear as soon as the field becomes valid ---------- */
  fields.forEach(function (f) {
    if (!f.el || !f.err) { return; }
    f.el.addEventListener('blur', function () {
      if (valid(f)) { clearError(f); } else { showError(f); }
    });
    f.el.addEventListener('input', function () {
      if (f.el.getAttribute('aria-invalid') === 'true' && valid(f)) { clearError(f); }
    });
  });

  /* -- mailto fallback ----------------------------------------------------- */
  var buildMailto = function (to) {
    var name    = document.getElementById('cName').value.trim();
    var email   = document.getElementById('cEmail').value.trim();
    var tel     = phone ? phone.value.trim() : '';
    var comment = document.getElementById('cComment').value.trim();

    var body = 'Name: ' + name + '\n' +
               'Email: ' + email + '\n' +
               (tel ? 'Phone: ' + tel + '\n' : '') +
               '\n' + comment + '\n';

    return 'mailto:' + to +
           '?subject=' + encodeURIComponent('Website enquiry from ' + name) +
           '&body='    + encodeURIComponent(body);
  };

  /* -- submit -------------------------------------------------------------- */
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var firstBad = null;
    fields.forEach(function (f) {
      if (!f.el || !f.err) { return; }
      if (valid(f)) {
        clearError(f);
      } else {
        showError(f);
        if (!firstBad) { firstBad = f.el; }
      }
    });

    if (firstBad) {
      setStatus('Please check the highlighted fields and try again.', 'error');
      firstBad.focus();
      return;
    }

    var endpoint = (form.getAttribute('data-endpoint') || '').trim();
    var fallback = (form.getAttribute('data-fallback') || '').trim();

    /* no endpoint configured yet — hand off to the visitor's mail client */
    if (!endpoint) {
      setStatus('Opening your email app so you can send this to ' + fallback + '.', 'info');
      window.location.href = buildMailto(fallback);
      return;
    }

    /* endpoint configured — POST it and report what actually happened */
    btn.disabled = true;
    setStatus('Sending…', 'info');

    var payload = {
      name:    document.getElementById('cName').value.trim(),
      email:   document.getElementById('cEmail').value.trim(),
      phone:   phone ? phone.value.trim() : '',
      comment: document.getElementById('cComment').value.trim()
    };

    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (res) {
        if (!res.ok) { throw new Error('HTTP ' + res.status); }
        form.reset();
        setStatus('Thanks — your message is on its way. We’ll be in touch.', 'ok');
      })
      .catch(function () {
        setStatus(
          'Sorry, that didn’t send. Please email us directly at ' + fallback + '.',
          'error'
        );
      })
      .then(function () {
        btn.disabled = false;
      });
  });
})();
