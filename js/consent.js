/* Cookie consent for the Digital Youth Project website.
   Google Analytics is only loaded after the visitor clicks "Accept".
   The choice is remembered in the browser; a "Cookie settings" link
   in the footer lets visitors change it at any time. */
(function () {
  var KEY = 'djp-cookie-consent';
  var GA_ID = 'G-E1NWM7GTRB';
  var nl = (document.documentElement.lang || '').toLowerCase().indexOf('nl') === 0;

  var T = nl ? {
    text: 'We gebruiken analytische cookies (Google Analytics) om te zien hoe deze website wordt gebruikt. Dit doen we alleen met uw toestemming.',
    accept: 'Accepteren',
    reject: 'Weigeren',
    settings: 'Cookie-instellingen',
    label: 'Cookietoestemming'
  } : {
    text: 'We use analytics cookies (Google Analytics) to understand how this website is used. We only do so with your consent.',
    accept: 'Accept',
    reject: 'Reject',
    settings: 'Cookie settings',
    label: 'Cookie consent'
  };

  function getChoice() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function setChoice(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  var gaLoaded = false;
  function loadAnalytics() {
    if (gaLoaded) return;
    gaLoaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);
  }

  // Remove Google Analytics cookies when consent is refused or withdrawn
  function clearAnalyticsCookies() {
    var host = location.hostname;
    var domains = ['', host, '.' + host, '.' + host.replace(/^www\./, '')];
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (name.indexOf('_ga') === 0) {
        domains.forEach(function (d) {
          document.cookie = name + '=; Max-Age=0; path=/' + (d ? '; domain=' + d : '');
        });
      }
    });
  }

  var banner = null;
  function showBanner() {
    if (banner) { banner.hidden = false; return; }
    banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', T.label);
    banner.innerHTML =
      '<p class="cookie-text">' + T.text + '</p>' +
      '<div class="cookie-actions">' +
        '<button type="button" class="cookie-btn cookie-reject">' + T.reject + '</button>' +
        '<button type="button" class="cookie-btn cookie-accept">' + T.accept + '</button>' +
      '</div>';
    document.body.appendChild(banner);

    banner.querySelector('.cookie-accept').addEventListener('click', function () {
      setChoice('granted');
      banner.hidden = true;
      loadAnalytics();
    });
    banner.querySelector('.cookie-reject').addEventListener('click', function () {
      var wasLoaded = gaLoaded;
      setChoice('denied');
      banner.hidden = true;
      clearAnalyticsCookies();
      if (wasLoaded) location.reload(); // stop analytics that was already running
    });
  }

  function addFooterLink() {
    var links = document.querySelector('.footer-links');
    if (!links) return;
    var a = document.createElement('a');
    a.href = '#';
    a.textContent = T.settings;
    a.addEventListener('click', function (e) { e.preventDefault(); showBanner(); });
    links.appendChild(a);
  }

  function init() {
    var choice = getChoice();
    if (choice === 'granted') loadAnalytics();
    else if (choice !== 'denied') showBanner();
    addFooterLink();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
