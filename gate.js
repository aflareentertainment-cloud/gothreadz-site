/* GoThreadz preview — password screen.
   Keeps casual visitors out of the preview. Only a SHA-256 fingerprint of the
   password is stored here. Once unlocked, the browser remembers it for 7 days. */
(function () {
  var HASH = '9af15b336e6a9619928537df30b2e6a2376569fcf9d7e773eccede65606529a0';
  var KEY = 'gt_preview_ok', DAYS = 7;
  try { var t = +localStorage.getItem(KEY); if (t && Date.now() - t < DAYS * 864e5) return; } catch (e) {}

  var de = document.documentElement;
  de.classList.add('gt-locked');
  var css = document.createElement('style');
  css.textContent =
    'html.gt-locked body>*:not(#gt-gate){visibility:hidden!important}' +
    'html.gt-locked,html.gt-locked body{overflow:hidden!important}' +
    '#gt-gate{position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;padding:24px max(16px,env(safe-area-inset-left,0px));background:#0B1B34;font-family:Montserrat,system-ui,-apple-system,sans-serif;color:#fff;cursor:auto!important}' +
    '#gt-gate *{cursor:auto!important;box-sizing:border-box}#gt-gate button{cursor:pointer!important}' +
    '#gt-gate .c{width:min(380px,100%);text-align:center}' +
    '#gt-gate img{height:54px;width:auto;margin:0 auto 26px;display:block}' +
    '#gt-gate h1{font-size:20px;font-weight:800;margin:0 0 6px}' +
    '#gt-gate p{font-size:14px;color:#c9d1de;margin:0 0 22px;line-height:1.5}' +
    '#gt-gate form{display:flex;flex-direction:column;gap:10px}' +
    '#gt-gate input{font:inherit;font-size:16px;padding:14px 16px;border-radius:12px;border:2px solid #2a3c5e;background:#13284a;color:#fff;text-align:center;outline:none}' +
    '#gt-gate input:focus{border-color:#F26A1B}' +
    '#gt-gate button{font:inherit;font-size:15px;font-weight:800;font-style:italic;padding:14px;border:0;border-radius:999px;background:#F26A1B;color:#fff}' +
    '#gt-gate button:hover{background:#d9570c}' +
    '#gt-gate .e{min-height:20px;font-size:13px;color:#ffb38a;margin-top:4px}';
  document.head.appendChild(css);

  function sha(s) {
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)).then(function (b) {
      return Array.prototype.map.call(new Uint8Array(b), function (x) { return ('0' + x.toString(16)).slice(-2); }).join('');
    });
  }
  function build() {
    if (document.getElementById('gt-gate')) return;
    var g = document.createElement('div'); g.id = 'gt-gate';
    g.innerHTML = '<div class="c"><img src="assets/logo/02-primary-lockup-reversed.svg" alt="GoThreadz">' +
      '<h1>Private preview</h1><p>This GoThreadz website preview is password protected. Enter the password you were given.</p>' +
      '<form id="gt-f" autocomplete="off"><label for="gt-pw" style="position:absolute;left:-9999px">Password</label>' +
      '<input id="gt-pw" type="password" placeholder="Password" required>' +
      '<button type="submit">View preview</button><div class="e" id="gt-e" role="alert"></div></form></div>';
    document.body.appendChild(g);
    var inp = document.getElementById('gt-pw'); inp.focus();
    // keep page controls (e.g. the Try-On carousel) from reacting while locked
    ['keydown', 'wheel', 'pointerdown', 'pointermove', 'pointerup', 'click'].forEach(function (ev) {
      g.addEventListener(ev, function (e) { e.stopPropagation(); }, { passive: true });
    });
    document.getElementById('gt-f').addEventListener('submit', function (e) {
      e.preventDefault();
      sha(inp.value.trim()).then(function (h) {
        if (h === HASH) {
          try { localStorage.setItem(KEY, String(Date.now())); } catch (x) {}
          de.classList.remove('gt-locked'); g.remove();
          window.dispatchEvent(new Event('resize'));
        } else {
          document.getElementById('gt-e').textContent = 'That password is not right. Please check it and try again.';
          inp.select();
        }
      });
    });
  }
  if (document.body) build(); else document.addEventListener('DOMContentLoaded', build);
})();
