/* ============================================================================
   MR NAGA — Site search
   A static site has no search server, so the index lives here: products,
   pages and stockists. Keep it in step with index.html (prices),
   stockists.html (stores) and any new page.

   Matching: the query is split into words and every word must appear in an
   item's text. Results are ranked by where the words hit (title start >
   title > keywords > body). The query is kept in the URL (?q=) so results
   can be shared and the back button works.
   ========================================================================== */
(function () {
  'use strict';

  /* ------------------------------------------------------------ index --- */
  var PRODUCTS = [
    { name: 'Mr Naga — Original', meta: 'Original · Very Hot', price: 16, img: 'product-original.webp',
      alt: 'Mr Naga Original hot pepper pickle, single 190g jar',
      kw: 'original very hot red label 190g jar single classic ghost pepper naga pickle chilli paste', order: 1 },
    { name: 'Mr Naga — Gold', meta: 'Gold · Extra Hot', price: 18, img: 'product-gold.webp',
      alt: 'Mr Naga Gold extra hot pepper pickle, single jar with gold lid',
      kw: 'gold extra hot 95% naga hotter jar single ghost pepper pickle chilli paste', order: 2 },
    { name: 'Mr Naga — Original (2 Pack)', meta: 'Original · 2 Pack', price: 32, img: 'product-original-2pack.jpg',
      alt: 'Two jars of Mr Naga Original hot pepper pickle',
      kw: 'original two pack 2 pack multipack bundle very hot', order: 3, choose: true },
    { name: 'Mr Naga — Gold (2 Pack)', meta: 'Gold · 2 Pack', price: 35, was: 36, img: 'product-gold-2pack.jpg',
      alt: 'Two jars of Mr Naga Gold extra hot pepper pickle',
      kw: 'gold two pack 2 pack multipack bundle sale extra hot', order: 4, flag: 'Sale' },
    { name: 'Mr Naga — Mixed (2 Pack)', meta: 'One Original + one Gold', price: 34, img: 'product-mixed-2pack.jpg',
      alt: 'Mr Naga mixed two pack containing one Original and one Gold jar',
      kw: 'mixed two pack 2 pack multipack bundle original gold both', order: 5 },
    { name: 'Mr Naga — Junior (70g)', meta: 'Junior 70g · from 2 jars', price: 24, img: 'product-junior-70g.jpg',
      alt: 'Mr Naga Junior 70g jars, the smaller travel-friendly size',
      kw: 'junior 70g small mini size travel multipack', order: 6, choose: true },
    { name: 'Mr Naga — 4 Jar Mixed Pack', meta: 'Best value · 4 jars', price: 52, img: 'product-4-jar-pack.webp',
      alt: 'Mr Naga four jar mixed pack in branded packaging',
      kw: 'four 4 jar mixed pack multipack bundle best value gift original gold', order: 7 },
    { name: '“Officially Super Hot” Tee', meta: 'Merch · AS Colour cotton', price: 44.95, img: 'product-tee.jpg',
      alt: 'Black Mr Naga Officially Super Hot t-shirt',
      kw: 'tee t-shirt tshirt shirt merch merchandise clothing black cotton officially super hot', order: 8 }
  ];

  var PAGES = [
    { title: 'How hot is it?', kind: 'Guide', url: 'how-hot-is-it.html', icon: 'flame',
      text: 'Mr Naga rates 855,000 to 1,041,427 Scoville Heat Units. How the naga compares, and how much to use.',
      kw: 'original gold scoville shu heat level hot rating jalapeno habanero carolina reaper ghost pepper bhut jolokia guinness record safety' },
    { title: 'How to use it', kind: 'Guide', url: 'how-to-use.html', icon: 'spoon',
      text: 'Start with a quarter teaspoon. Eleven places to put it, three recipes, and what to do when you have used too much.',
      kw: 'original gold use how much teaspoon recipe recipes mayo butter chicken bbq wings curry dal marinade pasta ramen eggs burger too much milk yoghurt' },
    { title: 'Naga mayo, 2 minutes', kind: 'Recipe', url: 'how-to-use.html#recipes', icon: 'spoon',
      text: '6 tbsp mayonnaise, ½ tsp Mr Naga Original, a squeeze of lime. The recipe that converts people.',
      kw: 'recipe mayo mayonnaise aioli dip lime burger chips' },
    { title: 'Naga butter chicken, 30 minutes', kind: 'Recipe', url: 'how-to-use.html#recipes', icon: 'spoon',
      text: 'Your usual butter chicken, with ½ tsp Mr Naga Original per two serves stirred in at the end.',
      kw: 'recipe butter chicken curry cream' },
    { title: 'Naga BBQ wings, 40 minutes', kind: 'Recipe', url: 'how-to-use.html#recipes', icon: 'spoon',
      text: '1kg wings roasted at 220°C, brushed with BBQ sauce and 1 tsp Mr Naga Gold.',
      kw: 'recipe bbq barbecue wings chicken grill gold' },
    { title: 'Stockists', kind: 'Store finder', url: 'stockists.html', icon: 'pin',
      text: 'Seventeen stockists across Sydney and Melbourne, with search and directions.',
      kw: 'stockists where to buy shop store near me retailer find sydney melbourne' },
    { title: 'Stockists in Sydney', kind: 'Store finder', url: 'stockists-sydney.html', icon: 'pin',
      text: 'Ten independent grocers, supermarkets and markets across Sydney and the western suburbs.',
      kw: 'sydney nsw new south wales stockists where to buy' },
    { title: 'Stockists in Melbourne', kind: 'Store finder', url: 'stockists-melbourne.html', icon: 'pin',
      text: 'Seven grocers, butchers and supermarkets across Melbourne, the western suburbs and Geelong.',
      kw: 'melbourne vic victoria geelong stockists where to buy' },
    { title: 'About us', kind: 'Page', url: 'about-us.html', icon: 'book',
      text: 'One secret family recipe from Sylhet, Bangladesh, jarred by Pasha Foods in the UK since 1996.',
      kw: 'about story history family recipe 1996 sylhet bangladesh pasha foods uk made' },
    { title: 'Contact us', kind: 'Page', url: 'contact.html', icon: 'mail',
      text: 'Orders, wholesale, or a shelf near you. Reach the team at sales@mrnaga.com.au.',
      kw: 'contact email phone help support order wholesale become a stockist sales' },
    { title: 'Frequently asked questions', kind: 'FAQ', url: 'index.html#faq', icon: 'help',
      text: 'Shelf life, returns and refunds, payment methods, and what makes Mr Naga different.',
      kw: 'faq questions shelf life expiry returns refund payment paypal afterpay delivery shipping' },
    { title: 'The range', kind: 'Shop', url: 'index.html#range', icon: 'bag',
      text: 'Original, Gold, multipacks, the Junior 70g and merch. Delivered across Australia and New Zealand.',
      kw: 'shop buy range products order online delivery shipping new zealand nz' }
  ];

  var STORES = [
    ['Fiji Bakery and Coffee', 'Campbelltown', '6/9 Patrick St, Campbelltown NSW', 'sydney', 'cambelltown'],
    ["Kazi's Supermarket — Glenfield", 'Glenfield', 'Shop 1/80 Railway Parade, Glenfield NSW 2167', 'sydney', 'kazis'],
    ["Kazi's Supermarket — Mt Druitt", 'Mt Druitt', 'Shop 10/13 Mount St, Mount Druitt NSW 2770', 'sydney', 'kazis mount'],
    ['Mahmud Foods Distributor', 'Ingleburn', '4/8 Broadhurst Rd, Ingleburn NSW 2565', 'sydney', ''],
    ['Fuska House', 'St Marys / Rockdale', '546 Princes Hwy, Sydney NSW 2216', 'sydney', 'rockdale'],
    ['Reliance Supermarket', 'Minto', '40 Ben Lomond Rd, Minto NSW 2566', 'sydney', ''],
    ['Ali Supermarket', 'Lakemba', '160–162 Haldon St, Lakemba NSW 2195', 'sydney', ''],
    ['Flavors of Fiji', 'Parklea', 'Entrance/5 Parklea Markets, Parklea NSW 2768', 'sydney', 'flavours'],
    ['Family Needs', 'Campbelltown', 'Unit B/1 Tindall St, Campbelltown NSW 2560', 'sydney', ''],
    ['Mukhorochok', 'Bella Vista', 'Newest stockist. Ask us for the exact address.', 'sydney', 'new mini junior'],
    ['Eastern Halal Butcher', 'Oakleigh', '317–319 Huntingdale Rd, Oakleigh VIC 3166', 'melbourne', 'butcher'],
    ['Riverdale Quality Meats & Produce', 'Tarneit', 'Shop 8/200 Hummingbird Blvd, Tarneit VIC 3029', 'melbourne', 'butcher'],
    ['Deshi Bazaar', 'Noble Park', '246–248 Railway Parade, Noble Park VIC 3174', 'melbourne', ''],
    ['Bazaar and Bite', 'Geelong', '18 Pakington St, Geelong West VIC 3218', 'melbourne', ''],
    ['Springvale Halal Meat', 'Springvale', '209 Springvale Rd, Springvale VIC 3171', 'melbourne', 'butcher'],
    ['WQM Quality Supermarket', 'Truganina', '185 Woods Rd, Truganina VIC 3029', 'melbourne', ''],
    ['Werribee Western Halal Meat', 'Werribee', '2/49 Cherry St, Werribee VIC 3030', 'melbourne', 'butcher']
  ].map(function (s) {
    return { name: s[0], suburb: s[1], addr: s[2], city: s[3], kw: s[4] };
  });

  var ICONS = {
    flame: '<path d="M12 3c1.5 3 4.5 4.5 4.5 8.5a4.5 4.5 0 01-9 0c0-1.8.8-3 1.8-4 .2 1.4.9 2.4 2 2.8C10.6 8 11 5.4 12 3z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>',
    spoon: '<ellipse cx="12" cy="7" rx="3.5" ry="4.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M12 11.5V21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
    pin:   '<path d="M12 21s7-6.2 7-11.3a7 7 0 10-14 0C5 14.8 12 21 12 21z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><circle cx="12" cy="9.6" r="2.5" fill="none" stroke="currentColor" stroke-width="1.5"/>',
    book:  '<path d="M4 5.5A1.5 1.5 0 015.5 4H11v16H5.5A1.5 1.5 0 014 18.5v-13zM20 5.5A1.5 1.5 0 0018.5 4H13v16h5.5a1.5 1.5 0 001.5-1.5v-13z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>',
    mail:  '<rect x="3.5" y="5.5" width="17" height="13" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M4 7l8 6 8-6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>',
    help:  '<circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M9.6 9.5a2.5 2.5 0 114 2c-.9.6-1.6 1.1-1.6 2.2" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="12" cy="16.8" r=".9" fill="currentColor"/>',
    bag:   '<path d="M5.5 7.5h13l-1 12h-11l-1-12z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M9 10V6.5a3 3 0 016 0V10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>'
  };
  var ARROW = '<svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M4 10h11M11 6l4 4-4 4" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  /* ---------------------------------------------------------- elements --- */
  var form    = document.getElementById('searchForm');
  var input   = document.getElementById('q');
  var clear   = document.getElementById('searchClear');
  var status  = document.getElementById('searchStatus');
  var out     = document.getElementById('searchResults');
  var tabs    = Array.prototype.slice.call(document.querySelectorAll('.sr-tab'));
  if (!form || !input || !out) return;

  var state = { q: '', tab: 'all', sort: 'relevance' };

  /* ------------------------------------------------------------ helpers --- */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  // fold accents so "jalapeno" finds "jalapeño"
  function fold(s) {
    return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’']/g, '');
  }
  function words(q) { return fold(q).split(/[^a-z0-9%]+/).filter(Boolean); }

  // wraps each query word in <mark>, matching on the folded text but keeping
  // the original characters
  function highlight(text, terms) {
    var safe = String(text);
    if (!terms.length) return esc(safe);
    var folded = fold(safe);
    var marks = [];
    terms.forEach(function (t) {
      var i = folded.indexOf(t);
      while (i !== -1) { marks.push([i, i + t.length]); i = folded.indexOf(t, i + t.length); }
    });
    if (!marks.length) return esc(safe);
    marks.sort(function (a, b) { return a[0] - b[0]; });
    var html = '', pos = 0;
    marks.forEach(function (m) {
      if (m[0] < pos) return;
      html += esc(safe.slice(pos, m[0])) + '<mark>' + esc(safe.slice(m[0], m[1])) + '</mark>';
      pos = m[1];
    });
    return html + esc(safe.slice(pos));
  }

  function score(fields, terms) {
    // fields: [title, keywords, body]; every term must hit somewhere
    var title = fold(fields[0]), kw = fold(fields[1] || ''), body = fold(fields[2] || '');
    var total = 0;
    for (var i = 0; i < terms.length; i++) {
      var t = terms[i];
      if (title.indexOf(t) === 0 || title.indexOf(' ' + t) !== -1) total += 10;
      else if (title.indexOf(t) !== -1) total += 6;
      else if (kw.indexOf(t) !== -1) total += 4;
      else if (body.indexOf(t) !== -1) total += 2;
      else return 0;
    }
    return total;
  }

  function money(n) { return '$' + n.toFixed(2); }

  /* -------------------------------------------------------------- search --- */
  function run() {
    var terms = words(state.q);
    var has = terms.length > 0;

    var products = PRODUCTS.map(function (p) {
      return { item: p, s: has ? score([p.name, p.kw + ' ' + p.meta, ''], terms) : 1 };
    }).filter(function (r) { return r.s > 0; });

    var pages = has ? PAGES.map(function (p) {
      return { item: p, s: score([p.title, p.kw, p.text], terms) };
    }).filter(function (r) { return r.s > 0; }) : [];

    var stores = has ? STORES.map(function (s) {
      return { item: s, s: score([s.name, s.suburb + ' ' + s.city + ' ' + s.kw, s.addr], terms) };
    }).filter(function (r) { return r.s > 0; }) : [];

    var bySort = {
      relevance: function (a, b) { return (b.s - a.s) || (a.item.order - b.item.order); },
      'price-asc': function (a, b) { return a.item.price - b.item.price; },
      'price-desc': function (a, b) { return b.item.price - a.item.price; }
    };
    products.sort(bySort[state.sort] || bySort.relevance);
    pages.sort(function (a, b) { return b.s - a.s; });
    stores.sort(function (a, b) { return b.s - a.s; });

    var counts = { all: products.length + pages.length + stores.length,
                   products: products.length, pages: pages.length, stores: stores.length };

    // tabs: counts, and disable empty ones (but never the one you are on)
    if (!has) state.tab = 'all';
    if (state.tab !== 'all' && !counts[state.tab]) state.tab = 'all';
    tabs.forEach(function (t) {
      var key = t.getAttribute('data-tab');
      t.querySelector('b').textContent = counts[key];
      t.setAttribute('aria-selected', String(key === state.tab));
      t.tabIndex = key === state.tab ? 0 : -1;
      t.disabled = key !== 'all' && counts[key] === 0;
    });

    // status line
    if (!has) {
      status.innerHTML = 'Showing the full range. Search for a product, a recipe, a suburb or a question.';
    } else if (!counts.all) {
      status.innerHTML = 'No results for <b>“' + esc(state.q.trim()) + '”</b>.';
    } else {
      status.innerHTML = '<b>' + counts.all + '</b> ' + (counts.all === 1 ? 'result' : 'results') +
                         ' for <b>“' + esc(state.q.trim()) + '”</b>.';
    }

    var show = function (key) { return state.tab === 'all' || state.tab === key; };
    var html = '';

    if (has && !counts.all) {
      html = emptyState();
    } else {
      if (show('products') && products.length) html += productGroup(products, terms, has);
      if (show('pages') && pages.length) html += pageGroup(pages, terms);
      if (show('stores') && stores.length) html += storeGroup(stores, terms);
      if (!has) html += pageGroup(PAGES.filter(function (p) { return p.kind === 'Guide' || p.kind === 'Store finder'; })
                                       .map(function (p) { return { item: p }; }), [], 'Guides & stockists');
    }
    out.innerHTML = html;

    var sort = document.getElementById('sortSelect');
    if (sort) {
      sort.value = state.sort;
      sort.addEventListener('change', function () { state.sort = sort.value; run(); });
    }
    if (clear) clear.hidden = !input.value;
  }

  function productGroup(rows, terms, has) {
    return '<section class="sr-group" aria-labelledby="grpProducts">' +
      '<div class="sr-group__head">' +
        '<h2 class="sr-group__title" id="grpProducts">' + (has ? 'Products' : 'The range') +
          ' <span>' + rows.length + '</span></h2>' +
        '<div class="sr-sort"><label for="sortSelect">Sort</label>' +
          '<select id="sortSelect">' +
            '<option value="relevance">' + (has ? 'Best match' : 'Featured') + '</option>' +
            '<option value="price-asc">Price, low to high</option>' +
            '<option value="price-desc">Price, high to low</option>' +
          '</select></div>' +
      '</div>' +
      '<ul class="products">' + rows.map(function (r) {
        var p = r.item;
        var price = p.was
          ? '<span class="amount amount--sale">' + money(p.price) + '</span> <s class="amount amount--was"><span class="visually-hidden">Regular price </span>' + money(p.was) + '</s>'
          : '<span class="amount">' + money(p.price) + '</span>';
        return '<li class="card">' +
          (p.flag ? '<span class="card__flag">' + esc(p.flag) + '</span>' : '') +
          '<a class="card__link" href="index.html#range">' +
            '<div class="card__media"><img src="assets/images/' + p.img + '" alt="' + esc(p.alt) + '" loading="lazy" width="600" height="600"></div>' +
            '<div class="card__body">' +
              '<p class="card__meta">' + esc(p.meta) + '</p>' +
              '<h3 class="card__title">' + highlight(p.name, terms) + '</h3>' +
              '<p class="card__price">' + price + '</p>' +
            '</div>' +
          '</a>' +
          '<button class="card__add" type="button" aria-label="' + (p.choose ? 'Choose options for ' : 'Add ') + esc(p.name.replace(/[“”]/g, '')) + (p.choose ? '' : ' to cart') + '">' + (p.choose ? 'Choose' : 'Add') + '</button>' +
        '</li>';
      }).join('') + '</ul></section>';
  }

  function pageGroup(rows, terms, label) {
    return '<section class="sr-group" aria-labelledby="grpPages">' +
      '<div class="sr-group__head"><h2 class="sr-group__title" id="grpPages">' + (label || 'Guides &amp; pages') +
        ' <span>' + rows.length + '</span></h2></div>' +
      '<ul class="sr-pages">' + rows.map(function (r) {
        var p = r.item;
        return '<li><a class="sr-page" href="' + p.url + '">' +
          '<span class="sr-page__icon"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + ICONS[p.icon] + '</svg></span>' +
          '<span><span class="sr-page__kind">' + esc(p.kind) + '</span>' +
          '<span class="sr-page__title">' + highlight(p.title, terms) + '</span>' +
          '<span class="sr-page__text">' + highlight(p.text, terms) + '</span></span>' +
        '</a></li>';
      }).join('') + '</ul></section>';
  }

  function storeGroup(rows, terms) {
    return '<section class="sr-group" aria-labelledby="grpStores">' +
      '<div class="sr-group__head"><h2 class="sr-group__title" id="grpStores">Stockists <span>' + rows.length + '</span></h2></div>' +
      '<ul class="sr-stores">' + rows.map(function (r) {
        var s = r.item;
        var url = 'stockists-' + s.city + '.html';
        return '<li><a class="sr-store" href="' + url + '">' +
          '<span><span class="sr-store__suburb">' + highlight(s.suburb, terms) + ' · ' + (s.city === 'sydney' ? 'NSW' : 'VIC') + '</span>' +
          '<span class="sr-store__name">' + highlight(s.name, terms) + '</span>' +
          '<span class="sr-store__addr">' + highlight(s.addr, terms) + '</span></span>' +
          ARROW +
        '</a></li>';
      }).join('') + '</ul></section>';
  }

  function emptyState() {
    return '<div class="sr-empty">' +
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M16.5 16.5L21 21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>' +
      '<h2>Nothing matched that search.</h2>' +
      '<p>Check the spelling, try a shorter word, or start from one of these.</p>' +
      '<ul class="sr-chips">' +
        ['Gold', 'Multipack', 'Scoville', 'Recipe', 'Sydney', 'Melbourne'].map(function (w) {
          return '<li><button type="button" data-q="' + w + '">' + w + '</button></li>';
        }).join('') +
      '</ul></div>';
  }

  /* ----------------------------------------------------------- wiring --- */
  function setQuery(q, push) {
    input.value = q;
    state.q = q;
    var url = q.trim() ? '?q=' + encodeURIComponent(q.trim()) : location.pathname;
    try { history[push ? 'pushState' : 'replaceState']({ q: q }, '', url); } catch (e) { /* file:// */ }
    run();
  }

  var t = null;
  input.addEventListener('input', function () {
    window.clearTimeout(t);
    t = window.setTimeout(function () { setQuery(input.value, false); }, 120);
  });
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && input.value) { e.preventDefault(); setQuery('', false); }
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    window.clearTimeout(t);
    setQuery(input.value, true);
    out.focus({ preventScroll: true });
    document.getElementById('results').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  });

  if (clear) {
    clear.addEventListener('click', function () { setQuery('', false); input.focus(); });
  }

  // suggestion chips, both in the hero and in the empty state
  document.addEventListener('click', function (e) {
    var chip = e.target.closest('.sr-chips button[data-q]');
    if (!chip) return;
    setQuery(chip.getAttribute('data-q'), true);
    input.focus();
  });

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () {
      if (tab.disabled) return;
      state.tab = tab.getAttribute('data-tab');
      run();
    });
    tab.addEventListener('keydown', function (e) {
      var dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!dir) return;
      e.preventDefault();
      for (var n = 1; n < tabs.length; n++) {
        var next = tabs[(i + dir * n + tabs.length * n) % tabs.length];
        if (!next.disabled) { next.focus(); next.click(); return; }
      }
    });
  });

  window.addEventListener('popstate', function () {
    var q = new URLSearchParams(location.search).get('q') || '';
    input.value = q; state.q = q; run();
  });

  // initial query from the URL (also what a no-JS GET submit lands on)
  var initial = new URLSearchParams(location.search).get('q') || '';
  input.value = initial;
  state.q = initial;
  run();
})();
