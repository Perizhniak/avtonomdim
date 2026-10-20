/* АвтономДім: необов'язкова Google Analytics 4 — лише після згоди. */
(function () {
  'use strict';
  const measurementId = 'G-82CMYWVX41';
  const storageKey = 'avtonomdim_analytics_choice';
  let analyticsStarted = false;
  let consentPanel;

  function readChoice() {
    try { return window.localStorage.getItem(storageKey); }
    catch (e) { return null; }
  }

  function saveChoice(choice) {
    try { window.localStorage.setItem(storageKey, choice); }
    catch (e) { /* Статистика не є обов'язковою для роботи сайту. */ }
  }

  function startAnalytics() {
    if (analyticsStarted) return;
    analyticsStarted = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', measurementId);
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(measurementId);
    document.head.appendChild(script);
  }

  function removeAnalyticsCookies() {
    // Спроба вилучити доступні браузеру GA-cookie при відкликанні згоди.
    const cookieNames = document.cookie.split(';').map(part => part.trim().split('=')[0]);
    const paths = ['/', '/avtonomdim', '/avtonomdim/'];
    const domains = ['', '; domain=' + location.hostname, '; domain=.' + location.hostname];
    for (const name of cookieNames) {
      if (!/^_ga(?:_|$)/.test(name)) continue;
      for (const path of paths) {
        for (const domain of domains) {
          document.cookie = name + '=; Max-Age=0; path=' + path + domain + '; SameSite=Lax';
        }
      }
    }
  }

  function hidePanel() {
    if (consentPanel) consentPanel.hidden = true;
  }

  function choose(choice) {
    const previouslyAccepted = readChoice() === 'accepted';
    saveChoice(choice);
    hidePanel();
    if (choice === 'accepted') {
      startAnalytics();
    } else if (previouslyAccepted || analyticsStarted) {
      // Перезавантаження припиняє роботу вже завантаженого тегу.
      window['ga-disable-' + measurementId] = true;
      removeAnalyticsCookies();
      window.location.reload();
    }
  }

  function showPanel() {
    if (consentPanel) consentPanel.hidden = false;
  }

  function init() {
    const styles = document.createElement('style');
    styles.textContent = `
      #ad-consent-panel[hidden] { display: none !important; }
      #ad-consent-panel { position: fixed; bottom: 16px; left: 16px; right: 16px; z-index: 9999;
        max-width: 690px; margin: 0 auto; box-sizing: border-box; padding: 18px 20px;
        background: #fff; color: #18392e; border: 1px solid #b8d3c5;
        border-radius: 14px; box-shadow: 0 6px 32px rgba(0,0,0,.22);
        font: 15px/1.5 system-ui,-apple-system,'Segoe UI',sans-serif; }
      #ad-consent-panel p { margin: 8px 0 14px; color: #375b4b; font-size: 14px; }
      #ad-consent-panel a { color: #145d45; text-decoration: underline; }
      #ad-consent-panel .ad-consent-actions { display: flex; flex-wrap: wrap; gap: 10px; }
      #ad-consent-panel .ad-consent-button { all: unset; box-sizing: border-box; cursor: pointer;
        border-radius: 8px; padding: 9px 16px; font-weight: 700; font-size: 14px;
        border: 1px solid #236448; }
      #ad-consent-panel .ad-accept { background: #216449; color: #fff; }
      #ad-consent-panel .ad-decline { background: #fff; color: #216449; }
      #ad-consent-panel .ad-consent-button:focus-visible, #ad-consent-settings:focus-visible {
        outline: 3px solid #e6a63e; outline-offset: 3px; }
      #ad-consent-settings { all: unset; box-sizing: border-box; cursor: pointer; color: #e3f1e7;
        text-decoration: underline; font: 13px/1.5 system-ui,-apple-system,'Segoe UI',sans-serif; }
      @media (max-width: 520px) { #ad-consent-panel { bottom: 8px; left: 8px; right: 8px; padding: 15px; } }
    `;
    document.head.appendChild(styles);

    consentPanel = document.createElement('section');
    consentPanel.id = 'ad-consent-panel';
    consentPanel.setAttribute('role', 'region');
    consentPanel.setAttribute('aria-label', 'Налаштування аналітики');
    consentPanel.hidden = true;
    consentPanel.innerHTML = '<strong>Допоможи покращити «АвтономДім»</strong>' +
      '<p>Ми хочемо використовувати Google Analytics для підрахунку відвідувань і переглядів сторінок. ' +
      'Аналітика завантажиться лише після твоєї згоди. Відмова не впливає на роботу сайту. ' +
      '<a href="privacy.html">Докладніше про конфіденційність</a>.</p>' +
      '<div class="ad-consent-actions">' +
      '<button type="button" class="ad-consent-button ad-accept">Дозволити аналітику</button>' +
      '<button type="button" class="ad-consent-button ad-decline">Відхилити</button></div>';
    consentPanel.querySelector('.ad-accept').addEventListener('click', function () { choose('accepted'); });
    consentPanel.querySelector('.ad-decline').addEventListener('click', function () { choose('declined'); });
    document.body.appendChild(consentPanel);

    const footer = document.querySelector('footer nav') || document.querySelector('footer');
    if (footer) {
      const settings = document.createElement('button');
      settings.id = 'ad-consent-settings';
      settings.type = 'button';
      settings.textContent = 'Налаштування аналітики';
      settings.addEventListener('click', showPanel);
      footer.appendChild(settings);
    }

    const choice = readChoice();
    if (choice === 'accepted') startAnalytics();
    else if (choice !== 'declined') showPanel();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
