/*
 * Pill Nav — sizes each pill's hover-fill circle so it grows from the
 * bottom edge and fully covers the pill at full scale, then wires up
 * the mobile hamburger/popover. Companion to assets/pill-nav.css.
 */
(function () {
  function layoutCircles(nav) {
    var pills = nav.querySelectorAll('.pill');
    pills.forEach(function (pill) {
      var circle = pill.querySelector('.hover-circle');
      if (!circle) return;
      var w = pill.offsetWidth;
      var h = pill.offsetHeight;
      if (!w || !h) return;
      var R = (w * w / 4 + h * h) / (2 * h);
      var D = Math.ceil(2 * R) + 2;
      var delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
      circle.style.width = D + 'px';
      circle.style.height = D + 'px';
      circle.style.bottom = -delta + 'px';
    });
  }

  function initPillNav(nav) {
    if (!nav) return;
    layoutCircles(nav);
    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        layoutCircles(nav);
      }, 150);
    });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        layoutCircles(nav);
      }).catch(function () {});
    }
  }

  function initMobileMenu(toggleBtn, menu) {
    if (!toggleBtn || !menu) return;
    var open = function () {
      toggleBtn.setAttribute('aria-expanded', 'true');
      menu.classList.add('is-open');
    };
    var close = function () {
      toggleBtn.setAttribute('aria-expanded', 'false');
      menu.classList.remove('is-open');
    };
    toggleBtn.addEventListener('click', function () {
      var isOpen = toggleBtn.getAttribute('aria-expanded') === 'true';
      if (isOpen) close();
      else open();
    });
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', close);
    });
    document.addEventListener('click', function (e) {
      if (toggleBtn.getAttribute('aria-expanded') !== 'true') return;
      if (menu.contains(e.target) || toggleBtn.contains(e.target)) return;
      close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initPillNav(document.getElementById('pill-nav'));
    initMobileMenu(document.getElementById('pill-mobile-toggle'), document.getElementById('pill-mobile-menu'));
  });
})();
