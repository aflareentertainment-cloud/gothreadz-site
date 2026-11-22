/* GoThreadz — product details panel for the Try-On homepage.
   window.gtOpenDetails(slug, {color, size}) opens an enlarged panel with the
   product's specs, close-ups, colours, sizes and size chart (data from data.js). */
(function () {
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const CAT = { regular: 'Regular Fit Tees', oversized: 'Oversized & Boxy', relaxed: 'Relaxed Fit', polo: 'Polo Shirts', hoodies: 'Hoodies & Sweatshirts', shorts: 'Shorts' };

  const css = `
  .gtd{position:fixed;inset:0;z-index:300;display:flex;align-items:center;justify-content:center;padding:3vh 16px;font-family:Montserrat,system-ui,sans-serif;color:#0B1B34;opacity:0;transition:opacity .28s ease}
  .gtd.on{opacity:1}
  .gtd,.gtd *{cursor:auto!important;user-select:text}
  .gtd button,.gtd a,.gtd select,.gtd .gtd-th{cursor:pointer!important}
  .gtd-bg{position:absolute;inset:0;background:rgba(11,27,52,.55);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}
  .gtd-card{position:relative;width:min(1100px,100%);max-height:94vh;overflow:auto;overscroll-behavior:contain;background:#fff;border-radius:24px;box-shadow:0 40px 90px rgba(0,0,0,.35);transform:translateY(18px) scale(.98);transition:transform .35s cubic-bezier(.2,.8,.2,1)}
  .gtd.on .gtd-card{transform:none}
  .gtd-x{position:sticky;top:14px;float:right;margin:14px 14px 0 0;width:42px;height:42px;border-radius:50%;background:#0B1B34;color:#fff;font-size:18px;font-weight:900;z-index:2;border:0}
  .gtd-x:hover{background:#F26A1B}
  .gtd-grid{display:grid;grid-template-columns:1.05fr 1fr;gap:34px;padding:30px 34px 34px}
  .gtd-main{aspect-ratio:1/1;border-radius:18px;background:#f4f5f8;overflow:hidden;display:grid;place-items:center}
  .gtd-main img{width:100%;height:100%;object-fit:contain;background:#fff}
  .gtd-main img.cu{object-fit:contain;max-width:100%;max-height:100%;width:auto;height:auto}
  .gtd-cap{font-size:.78rem;color:#5B6577;margin-top:8px;min-height:1.2em;font-weight:600}
  .gtd-ths{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-top:8px}
  .gtd-th{aspect-ratio:1/1;border-radius:10px;overflow:hidden;border:2px solid transparent;background:#f4f5f8;padding:0}
  .gtd-th img{width:100%;height:100%;object-fit:cover;display:block}
  .gtd-th.on{border-color:#F26A1B}
  .gtd-code{font-weight:900;font-style:italic;color:#F26A1B;font-size:2.6rem;line-height:1;letter-spacing:-.02em}
  .gtd-name{font-weight:900;font-size:1.6rem;line-height:1.15;margin:6px 0 4px}
  .gtd-type{color:#5B6577;font-weight:600;font-size:.9rem}
  .gtd-pills{display:flex;flex-wrap:wrap;gap:7px;margin:14px 0 18px}
  .gtd-pills span{background:#f4f5f8;border:1px solid #e3e6ec;padding:6px 11px;border-radius:999px;font-size:.78rem;font-weight:700}
  .gtd-pills span.o{background:#F26A1B;border-color:#F26A1B;color:#fff}
  .gtd h4{font-size:.76rem;text-transform:uppercase;letter-spacing:.08em;font-weight:800;margin:18px 0 8px}
  .gtd h4 small{text-transform:none;letter-spacing:0;color:#5B6577;font-weight:600;margin-left:6px}
  .gtd-spec{display:grid;grid-template-columns:auto 1fr;gap:6px 14px;font-size:.88rem}
  .gtd-spec b{font-weight:800}
  .gtd ul{list-style:none;padding:0;margin:0;display:grid;gap:6px;font-size:.88rem}
  .gtd li{padding-left:18px;position:relative}
  .gtd li::before{content:"";position:absolute;left:0;top:.5em;width:9px;height:9px;background:#F26A1B;transform:skewX(-14deg)}
  .gtd-cols{display:flex;flex-wrap:wrap;gap:6px}
  .gtd-cols span{display:flex;align-items:center;gap:6px;border:1px solid #e3e6ec;border-radius:999px;padding:4px 10px 4px 4px;font-size:.76rem;font-weight:600}
  .gtd-cols i{width:16px;height:16px;border-radius:50%;border:1px solid rgba(0,0,0,.15)}
  .gtd-sz{width:100%;border-collapse:collapse;font-size:.84rem;text-align:center}
  .gtd-sz th{background:#0B1B34;color:#fff;padding:8px 6px;font-size:.72rem;text-transform:uppercase;letter-spacing:.04em}
  .gtd-sz td{padding:7px 6px;border-bottom:1px solid #e3e6ec}
  .gtd-sz tr:nth-child(even) td{background:#f4f5f8}
  .gtd-sz td:first-child{font-weight:800}
  .gtd-note{font-size:.74rem;color:#5B6577;margin-top:6px}
  .gtd-q{background:#f4f5f8;border:1px solid #e3e6ec;border-radius:16px;padding:16px;margin-top:20px}
  .gtd-q .row{display:grid;grid-template-columns:1.3fr 1fr auto;gap:8px}
  .gtd-q select,.gtd-q input{font:inherit;font-size:.88rem;padding:10px;border:1.5px solid #e3e6ec;border-radius:10px;background:#fff;color:#0B1B34;width:100%}
  .gtd-q input{width:64px;text-align:center;font-weight:800}
  .gtd-btns{display:flex;gap:10px;flex-wrap:wrap;margin-top:12px}
  .gtd-btn{display:inline-flex;align-items:center;gap:6px;padding:12px 20px;border-radius:999px;font-weight:800;font-style:italic;font-size:.9rem;border:2px solid #0B1B34;background:#fff;color:#0B1B34;text-decoration:none}
  .gtd-btn.o{background:#F26A1B;border-color:#F26A1B;color:#fff}
  .gtd-btn:hover{transform:translateY(-1px)}
  .gtd-msg{font-size:.8rem;margin-top:8px;color:#0B1B34;font-weight:700;min-height:1em}
  .gtd-cus{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
  .gtd-cu{position:relative;border-radius:12px;overflow:hidden;aspect-ratio:4/3;background:#f4f5f8;padding:0;border:0}
  .gtd-cu img{width:100%;height:100%;object-fit:cover;display:block}
  .gtd-cu span{position:absolute;left:6px;right:6px;bottom:6px;background:rgba(11,27,52,.85);color:#fff;font-size:.62rem;font-weight:800;padding:4px 8px;border-radius:8px;text-align:left}
  .gtd-full{grid-column:1/-1}
  @media (max-width:820px){.gtd-grid{grid-template-columns:1fr;padding:20px}.gtd-cus{grid-template-columns:repeat(2,1fr)}.gtd-code{font-size:2rem}.gtd-name{font-size:1.3rem}}
  `;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  const SW = { white: '#fff', black: '#111', navy: '#1c2541', red: '#c8202f', cream: '#efe6d2', oat: '#e3d7bf', khaki: '#c3b08a', yellow: '#f4cc2a', orange: '#ee7a22', maroon: '#5e1a24', plum: '#5c2f4f', sage: '#a9b79c', mustard: '#d3a12a', gray: '#a8aaad', grey: '#a8aaad', royal: '#2a4cb0', blue: '#5b84c4', green: '#1f4a37', brown: '#4b3226', pink: '#f2c6cf', peri: '#6667ab', charcoal: '#3d3f43', midnight: '#1d2333', slate: '#3f4650', sand: '#d2c1a1', doe: '#b9a48a', earth: '#6b5442', fudge: '#4a3328', lilac: '#b8a6cc', dahlia: '#6a2430', elk: '#9b8670', taupe: '#a8988a', paloma: '#c8b9a9', ashes: '#7c8fa3', fatigue: '#5c5a3e', fir: '#2f4a3a', eclipse: '#2c2d33', gold: '#e2a923', redwood: '#7b3a2c', marshmallow: '#f6f1e7', offwhite: '#f3efe6', teal: '#2fb3b8', turquoise: '#2fb3b8', latte: '#dacbb3', stromboli: '#3b5a49', acid: '#2a2a2c' };
  const sw = n => { const k = n.toLowerCase(); for (const w in SW) if (k.includes(w)) return SW[w]; return '#cfd3da'; };

  let root = null, lastFocus = null;
  const stop = e => e.stopPropagation();
  const keyGuard = e => { if (!root) return; if (e.key === 'Escape') close(); e.stopPropagation(); };

  function close() {
    if (!root) return;
    const r = root; root = null; r.classList.remove('on');
    window.removeEventListener('keydown', keyGuard, true);
    r.style.pointerEvents = 'none';
    setTimeout(() => r.remove(), 280);
    if (lastFocus && lastFocus.focus) try { lastFocus.focus(); } catch (_) {}
  }

  window.gtOpenDetails = function (slug, opt) {
    opt = opt || {};
    const D = window.GT; if (!D) return;
    const p = D.products.find(x => x.slug === slug); if (!p) return;
    // never stack panels: clear any existing one first
    document.querySelectorAll('.gtd').forEach(el => el.remove());
    window.removeEventListener('keydown', keyGuard, true); root = null;
    lastFocus = document.activeElement;
    const shots = [{ src: p.images[0], label: 'Product photo' }].concat(p.closeups || []);
    const sc = p.sizeChart;
    const colors = p.colors || [];
    const pickColor = colors.find(c => opt.color && c.toLowerCase() === String(opt.color).toLowerCase()) || colors[0] || 'Standard';
    const pickSize = (p.sizes || []).includes(opt.size) ? opt.size : (p.sizes || ['M'])[0];
    root = document.createElement('div'); root.className = 'gtd'; root.setAttribute('role', 'dialog'); root.setAttribute('aria-modal', 'true'); root.setAttribute('aria-label', p.code + ' ' + p.name + ' details');
    root.innerHTML = `
      <div class="gtd-bg"></div>
      <div class="gtd-card">
        <button class="gtd-x" aria-label="Close details">✕</button>
        <div class="gtd-grid">
          <div>
            <div class="gtd-main"><img id="gtdMain" src="${esc(shots[0].src)}" alt="${esc(p.name)}"></div>
            <div class="gtd-cap" id="gtdCap">${esc(shots[0].label)}</div>
            ${shots.length > 1 ? `<div class="gtd-ths">${shots.map((s, i) => `<button class="gtd-th ${i ? '' : 'on'}" data-i="${i}" title="${esc(s.label)}"><img src="${esc(s.src)}" alt="${esc(s.label)}"></button>`).join('')}</div>` : ''}
          </div>
          <div>
            <div class="gtd-code">${esc(p.code)}</div>
            <div class="gtd-name">${esc(p.name)}</div>
            <div class="gtd-type">${esc(CAT[p.cat] || '')}</div>
            <div class="gtd-pills">${[p.fit, p.weight, p.unisex ? 'Unisex' : ''].filter(Boolean).map(x => `<span>${esc(x)}</span>`).join('')}<span class="o">Sold by pack · 10 pcs</span></div>
            <h4>Fabric</h4>
            <div class="gtd-spec"><b>Type</b><span>${esc(p.fabric || '')}</span><b>Blend</b><span>${esc(p.blend || '')}</span><b>Weight</b><span>${esc(p.weight || '')}</span><b>Fit</b><span>${esc(p.fit || '')}</span></div>
            <h4>Features</h4>
            <ul>${(p.features || []).map(f => `<li>${esc(f)}</li>`).join('')}</ul>
            ${p.printing && p.printing.length ? `<h4>Printing recommendation</h4><ul>${p.printing.map(f => `<li>${esc(f)}</li>`).join('')}</ul>` : ''}
            <h4>Colours <small>${colors.length} colourways</small></h4>
            <div class="gtd-cols">${colors.map(c => `<span><i style="background:${sw(c)}"></i>${esc(c)}</span>`).join('')}</div>
            <div class="gtd-q">
              <h4 style="margin-top:0">Add to quote <small>1 pack = 10 pcs of one colour &amp; size</small></h4>
              <div class="row">
                <select id="gtdC" aria-label="Colour">${colors.map(c => `<option ${c === pickColor ? 'selected' : ''}>${esc(c)}</option>`).join('')}</select>
                <select id="gtdS" aria-label="Size">${(p.sizes || ['One size']).map(s => `<option ${s === pickSize ? 'selected' : ''}>${esc(s)}</option>`).join('')}</select>
                <input id="gtdN" type="number" min="1" value="1" aria-label="Packs">
              </div>
              <div class="gtd-btns">
                <button class="gtd-btn o" id="gtdAdd">Add to quote</button>
                <a class="gtd-btn" href="shop.html#/product/${esc(p.slug)}">View full product page →</a>
              </div>
              <div class="gtd-msg" id="gtdMsg"></div>
            </div>
          </div>
          ${sc ? `<div class="gtd-full"><h4>Size chart <small>${esc(sc.note || 'Inches')}</small></h4>
            <div style="overflow-x:auto"><table class="gtd-sz"><thead><tr>${sc.cols.map(c => `<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${sc.rows.map(r => `<tr>${r.map(v => `<td>${esc(v)}</td>`).join('')}</tr>`).join('')}</tbody></table></div></div>` : ''}
          ${(p.closeups || []).length ? `<div class="gtd-full"><h4>Fabric &amp; detail close-ups</h4>
            <div class="gtd-cus">${p.closeups.map((c, i) => `<button class="gtd-cu" data-i="${i + 1}"><img src="${esc(c.src)}" alt="${esc(c.label)}" loading="lazy"><span>${esc(c.label)}</span></button>`).join('')}</div></div>` : ''}
        </div>
      </div>`;
    document.body.appendChild(root);
    // keep the hero's carousel controls from reacting while the panel is open
    ['wheel', 'pointerdown', 'pointermove', 'pointerup', 'mousedown', 'mousemove', 'touchstart', 'touchmove', 'click'].forEach(ev => root.addEventListener(ev, stop, { passive: true }));
    window.addEventListener('keydown', keyGuard, true);
    requestAnimationFrame(() => root && root.classList.add('on'));

    const main = root.querySelector('#gtdMain'), cap = root.querySelector('#gtdCap');
    const show = i => {
      const s = shots[i]; main.src = s.src; main.className = i ? 'cu' : ''; cap.textContent = s.label;
      root.querySelectorAll('.gtd-th').forEach((b, k) => b.classList.toggle('on', k === i));
      root.querySelector('.gtd-card').scrollTo({ top: 0, behavior: 'smooth' });
    };
    root.querySelectorAll('.gtd-th,.gtd-cu').forEach(b => b.addEventListener('click', () => show(+b.dataset.i)));
    root.querySelector('.gtd-x').addEventListener('click', close);
    root.querySelector('.gtd-bg').addEventListener('click', close);
    root.querySelector('#gtdAdd').addEventListener('click', () => {
      const c = root.querySelector('#gtdC').value, s = root.querySelector('#gtdS').value, n = Math.max(1, parseInt(root.querySelector('#gtdN').value) || 1);
      let q = []; try { q = JSON.parse(localStorage.getItem('gt_quote')) || []; } catch (_) {}
      const ex = q.find(l => l.slug === p.slug && l.color === c && l.size === s);
      if (ex) ex.packs += n; else q.push({ slug: p.slug, code: p.code, name: p.name, color: c, size: s, packs: n });
      try { localStorage.setItem('gt_quote', JSON.stringify(q)); } catch (_) {}
      root.querySelector('#gtdMsg').innerHTML = `Added ${n * 10} pcs (${esc(c)}, ${esc(s)}). <a href="shop.html#/quote" style="color:#F26A1B">View quote →</a>`;
    });
    root.querySelector('.gtd-x').focus();
  };
})();
