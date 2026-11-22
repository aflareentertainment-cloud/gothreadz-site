(function(){
const D = window.GT;
const P = D.products;
const CATS = D.categories; // [{key,label,blurb}]
const app = document.getElementById('app');
const $ = (s,r=document)=>r.querySelector(s);
const QK='gt_quote';
const qGet=()=>{try{return JSON.parse(localStorage.getItem(QK))||[]}catch(e){return []}};
const qSet=q=>{try{localStorage.setItem(QK,JSON.stringify(q))}catch(e){} qBadge();};
function qBadge(){const n=qGet().reduce((a,b)=>a+b.packs,0);const el=document.getElementById('qcount');if(el){el.textContent=n;el.style.display=n?'inline-grid':'none';}}
const esc = s => String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ---------- colour name → swatch ---------- */
const CMAP = {
 'white':'#ffffff','optic white':'#fbfbf8','plain white':'#ffffff','offwhite':'#f3efe6','off white':'#f3efe6','marshmallow':'#f6f1e7','cream':'#efe6d2',
 'black':'#111','true black':'#0c0c0c','super black':'#050505','jet black':'#0a0a0a',
 'navy':'#1c2541','navy blue':'#1c2541','midnight':'#1d2333','midnight blue':'#1d2a44','deep royal':'#24357a','royal blue':'#2a4cb0','pblue':'#5b84c4','baby blue':'#a9c8e8','coral blue':'#5aa4c6','blue ashes':'#7c8fa3',
 'red':'#c8202f','maroon':'#5e1a24','redwood':'#7b3a2c','red dahlia':'#8a2a35','dark dahlia':'#4a2230',
 'yellow':'#f4cc2a','yellow gold':'#e2a923','bright gold':'#e8b22c','mustard':'#d3a12a','orange':'#ee7a22','classic orange':'#ee6d1e',
 'british green':'#1f4a37','moss green':'#5b6b3a','sage':'#a9b79c','fatigue':'#5c5a3e','douglas fir':'#2f4a3a','stromboli':'#3b5a49','turquoise':'#2fb3b8',
 'sports gray':'#a8aaad','silver gray':'#bfc2c5','dark gray':'#55585c','charcoal gray':'#3d3f43','dark acid gray':'#4b4d50','dark slate':'#3f4650','darkslate':'#3f4650','eclipse':'#2c2d33',
 'oat':'#e3d7bf','khaki':'#c3b08a','taupe':'#a8988a','elk':'#9b8670','doe':'#b9a48a','sandstorm':'#d2c1a1','paloma':'#c8b9a9','earth':'#6b5442','hot fudge':'#4a3328','hotfudge':'#4a3328','hot cocoa':'#5a3d31','choco brown':'#4b3226','almond milk latte':'#dacbb3',
 'muted pink':'#d9a7a3','baby pink':'#f2c6cf','elilac':'#b8a6cc','elder lilac':'#b8a6cc','very peri':'#6667ab','plum':'#5c2f4f','orchid ice':'#d9c8dc',
 'ilocos sand dunes':'#d8b98d','bukidnon highlands':'#5f7a4e','bohol chocolate hills':'#7a5a3c',
};
function sw(name){
  const n=name.toLowerCase().trim();
  if(CMAP[n]) return CMAP[n];
  if(n.includes('dual tone')) return n.includes('navy')?'linear-gradient(135deg,#1c2541 50%,#a8aaad 50%)':'linear-gradient(135deg,#111 50%,#a8aaad 50%)';
  if(n.includes('stripe')) return 'repeating-linear-gradient(0deg,#fff 0 3px,#1c2541 3px 6px)';
  for(const k in CMAP){ if(n.includes(k)) return CMAP[k]; }
  return '#cfd3da';
}
const swStyle = c => `background:${sw(c)}`;

/* ---------- shared bits ---------- */
function card(p){
  const cols=p.colors||[];
  return `<a class="card" href="#/product/${p.slug}">
    <div class="ph"><img loading="lazy" src="${esc(p.images[0]||'')}" alt="${esc(p.code+' '+p.name)}">
      <span class="badge">Pack of 10</span>${p.isNew?'<span class="badge new">NEW</span>':''}</div>
    <div class="body"><span class="code display">${esc(p.code)}</span><h3>${esc(p.name)}</h3>
      <span class="meta">${esc([p.weight,p.fit].filter(Boolean).join(' · '))}</span>
      ${cols.length?`<div class="swatches">${cols.slice(0,10).map(c=>`<i style="${swStyle(c)}" title="${esc(c)}"></i>`).join('')}${cols.length>10?`<em>+${cols.length-10}</em>`:''}</div>`:''}
    </div></a>`;
}
function catLabel(k){ const c=CATS.find(c=>c.key===k); return c?c.label:k; }
function ctaBand(){
  return `<section class="cta-band"><div class="wrap"><div><span class="eyebrow" style="color:var(--navy)">Bulk &amp; reseller orders</span><h2 class="display">Ready to build your brand on GoThreadz blanks?</h2></div><a class="btn" href="#/quote">Request a quote →</a></div></section>`;
}

/* ---------- pages ---------- */
function home(){
  const heroP = P.find(p=>p.slug===D.heroSlug)||P[0];
  const featured = D.featured.map(s=>P.find(p=>p.slug===s)).filter(Boolean);
  const totalColors = new Set(P.flatMap(p=>p.colors||[])).size;
  return `
  <section class="hero"><div class="hero-in">
    <div>
      <span class="eyebrow">Wholesale blank apparel · Philippines</span>
      <h1 class="display">Wholesale blanks built for <em>your</em> brand.</h1>
      <p class="lead">${esc(D.about.short)}</p>
      <div class="ctas"><a class="btn btn-o" href="#/shop">Browse blanks →</a><a class="btn btn-w" href="#/wholesale">How wholesale works</a></div>
      <div class="hero-stats"><div><b>${P.length}</b><span>Styles</span></div><div><b>${totalColors}+</b><span>Colourways</span></div><div><b>XS–5XL</b><span>Size range</span></div><div><b>10 pcs</b><span>Per pack</span></div></div>
    </div>
    <div class="hero-img"><img src="${esc(D.heroImage||heroP.images[0])}" alt="GoThreadz blank tees"></div>
  </div></section>
  <div class="strip"><div class="wrap strip-in">
    <div><i>✓</i>Sold by pack · 10 pcs per colour/size</div>
    <div><i>✓</i>Volume pricing for bulk orders</div>
    <div><i>✓</i>Tear-away labels for rebranding</div>
    <div><i>✓</i>Nationwide delivery across the Philippines</div>
  </div></div>
  <section class="sec"><div class="wrap">
    <div class="sec-head"><div><span class="eyebrow">Shop by fit</span><h2 class="display">Find your fit</h2></div><a class="btn btn-n" href="#/shop">All products →</a></div>
    <div class="cats">${CATS.map(c=>{const ps=P.filter(p=>p.cat===c.key);const img=c.image||(ps[0]&&ps[0].images[0])||'';return `<a class="cat" href="#/shop/${c.key}"><img loading="lazy" src="${esc(img)}" alt="${esc(c.label)}"><span>${esc(c.label)}<small>${ps.length} style${ps.length===1?'':'s'}</small></span></a>`}).join('')}</div>
  </div></section>
  ${whoFor()}
  <section class="sec" style="padding-top:0"><div class="wrap">
    <div class="sec-head"><div><span class="eyebrow">Best sellers</span><h2 class="display">Featured blanks</h2></div></div>
    <div class="grid">${featured.map(card).join('')}</div>
  </div></section>
  <section class="sec" style="background:var(--soft)"><div class="wrap split">
    <img loading="lazy" src="${esc(D.about.image)}" alt="GoThreadz apparel">
    <div class="prose"><span class="eyebrow">About GoThreadz</span><h2 class="display">Stock. Speed. Service.</h2>
      ${D.about.body.map(t=>`<p>${esc(t)}</p>`).join('')}
      <a class="btn btn-o" href="#/about">Learn more →</a></div>
  </div></section>
  ${steps()}
  ${ctaBand()}`;
}

function whoFor(){
  const items=[['Clothing brands','Launch drops on premium blanks with tear-away labels so only your label shows.'],
    ['Print & embroidery shops','Fabrics chosen for DTG, DTF, silkscreen and embroidery — consistent stock you can rely on.'],
    ['Corporate & uniforms','Polos, tees and hoodies for teams, staff and company events, in bulk.'],
    ['Merch, events & schools','Bulk blanks for org shirts, fun runs, school fairs and giveaways.']];
  return `<section class="sec" style="padding-top:0"><div class="wrap">
    <div class="sec-head"><div><span class="eyebrow">Who we supply</span><h2 class="display">Built for businesses</h2></div></div>
    <div class="who">${items.map((x,i)=>`<div><span class="n">0${i+1}</span><b>${x[0]}</b><p>${x[1]}</p></div>`).join('')}</div>
  </div></section>`;
}
function steps(){
  const s=[['Pick your blanks','Browse styles, fits, fabric weights and colours. Check size charts and close-ups.'],
    ['Build your quote','Add packs per colour and size (1 pack = 10 pcs) to your quote list.'],
    ['Get your price','Send the request — we reply with volume pricing and stock availability.'],
    ['Confirm & ship','Confirm your order and we arrange delivery anywhere in the Philippines.']];
  return `<section class="sec" style="background:var(--navy);color:#fff"><div class="wrap">
    <div class="sec-head"><div><span class="eyebrow">Wholesale ordering</span><h2 class="display">How it works</h2></div><a class="btn btn-o" href="#/quote">Start a quote →</a></div>
    <div class="steps">${s.map((x,i)=>`<div><span>${i+1}</span><b>${x[0]}</b><p>${x[1]}</p></div>`).join('')}</div>
  </div></section>`;
}
function wholesale(){
  return `<section class="sec"><div class="wrap prose" style="max-width:900px">
    <span class="eyebrow">Wholesale</span><h2 class="display">Buying blanks in bulk</h2>
    <p>GoThreadz supplies blank apparel to brands, print shops, companies and organisations. All styles are sold by the pack so you get consistent stock across sizes and colours.</p>
    <h3>Order terms</h3><ul>
      <li>Sold by pack — 1 pack = 10 pieces of the same style, colour and size.</li>
      <li>Mix and match styles, colours and sizes across packs in one order.</li>
      <li>Volume pricing: the more packs you order, the lower the price per piece. Reseller / dealer rates available for regular buyers.</li>
      <li>Prices are quoted on request and are VAT exclusive.</li>
      <li>We deliver nationwide. Delivery details are confirmed with you when your order is placed.</li>
    </ul>
    <h3>Made for decoration</h3><ul>
      <li>Easy tear-away labels so you can add your own brand label.</li>
      <li>Fabrics suited to DTG, DTF, silkscreen and embroidery — see each product's printing recommendation.</li>
      <li>Reactive double-dyed colours and pre-shrunk cotton for consistent results.</li>
    </ul>
  </div></section>${steps()}${ctaBand()}`;
}

function quote(){
  const q=qGet();
  const pcs=q.reduce((a,b)=>a+b.packs,0)*10;
  return `<section class="sec"><div class="wrap">
    <div class="sec-head"><div><span class="eyebrow">Request a quote</span><h2 class="display">Your quote list</h2><div class="crumbs"><a href="index.html">Home</a> / Quote</div></div>
      <span class="crumbs">${q.length} line${q.length===1?'':'s'} · ${pcs} pcs</span></div>
    ${q.length?`<div class="scroll-x"><table class="spec-table"><thead><tr><th>Product</th><th>Colour</th><th>Size</th><th>Packs</th><th>Pieces</th><th></th></tr></thead><tbody>
      ${q.map((l,i)=>`<tr><td><b>${esc(l.code)}</b> ${esc(l.name)}</td><td>${esc(l.color)}</td><td>${esc(l.size)}</td>
        <td><input class="qn" type="number" min="1" value="${l.packs}" data-i="${i}"></td><td>${l.packs*10}</td><td><button class="qdel" data-i="${i}" aria-label="Remove">✕</button></td></tr>`).join('')}
      </tbody></table></div>`:`<p style="color:var(--muted)">Your quote list is empty. <a href="#/shop" style="color:var(--orange);font-weight:700">Browse blanks →</a></p>`}
    <form class="qform" id="qform">
      <h3 class="display">Your details</h3>
      <div class="fgrid">
        <label>Company / brand<input name="company" required></label>
        <label>Contact person<input name="name" required></label>
        <label>Email<input name="email" type="email" required></label>
        <label>Phone / Viber<input name="phone"></label>
        <label>Delivery city / province<input name="city"></label>
        <label>Needed by<input name="date" type="date"></label>
      </div>
      <label>Printing / notes<textarea name="notes" rows="4" placeholder="e.g. DTF print on front, need samples first, delivery to Makati"></textarea></label>
      <div class="pd-cta"><button class="btn btn-o" type="submit">Send quote request →</button><button class="btn btn-n" type="button" id="qcopy">Copy quote</button></div>
      <p class="note" id="qmsg"></p>
    </form>
  </div></section>`;
}
function quoteText(f){
  const q=qGet(); const fd=f?Object.fromEntries(new FormData(f)):{};
  return `GoThreadz quote request\n\nCompany: ${fd.company||''}\nContact: ${fd.name||''}\nEmail: ${fd.email||''}\nPhone: ${fd.phone||''}\nDelivery: ${fd.city||''}\nNeeded by: ${fd.date||''}\n\nItems (1 pack = 10 pcs):\n`+
    q.map(l=>`- ${l.code} ${l.name} | ${l.color} | ${l.size} | ${l.packs} pack(s) = ${l.packs*10} pcs`).join('\n')+
    `\n\nTotal: ${q.reduce((a,b)=>a+b.packs,0)*10} pcs\n\nNotes: ${fd.notes||''}`;
}
function wireQuote(){
  document.querySelectorAll('.qn').forEach(n=>n.onchange=()=>{const q=qGet();q[+n.dataset.i].packs=Math.max(1,parseInt(n.value)||1);qSet(q);route();});
  document.querySelectorAll('.qdel').forEach(b=>b.onclick=()=>{const q=qGet();q.splice(+b.dataset.i,1);qSet(q);route();});
  const f=$('#qform'); if(!f) return;
  f.onsubmit=e=>{e.preventDefault(); if(!qGet().length){$('#qmsg').textContent='Add at least one product to your quote first.';return;}
    const to=/@/.test(D.contact.email)?D.contact.email:'';
    location.href=`mailto:${to}?subject=${encodeURIComponent('Quote request — '+(new FormData(f).get('company')||''))}&body=${encodeURIComponent(quoteText(f))}`;
    $('#qmsg').textContent='Your email app should open with the quote filled in. If it doesn\'t, use "Copy quote" and send it to us.';};
  $('#qcopy').onclick=async()=>{try{await navigator.clipboard.writeText(quoteText(f));$('#qmsg').textContent='Quote copied — paste it into an email or message to us.';}catch(e){$('#qmsg').textContent='Could not copy automatically.';}};
}

function shop(cat){
  const list = cat? P.filter(p=>p.cat===cat) : P;
  const title = cat? catLabel(cat) : 'All Products';
  const c = CATS.find(x=>x.key===cat);
  return `<section class="sec"><div class="wrap">
    <div class="sec-head"><div><h2 class="display">${esc(title)}</h2>
      <div class="crumbs"><a href="index.html">Home</a> / <a href="#/shop">Shop</a>${cat?` / ${esc(title)}`:''}</div>
      ${c&&c.blurb?`<p style="color:var(--muted);margin-top:10px;max-width:640px">${esc(c.blurb)}</p>`:''}</div>
      <span class="crumbs">${list.length} product${list.length===1?'':'s'}</span></div>
    <div class="filters"><a href="#/shop" class="${!cat?'on':''}">All</a>${CATS.map(c=>`<a href="#/shop/${c.key}" class="${cat===c.key?'on':''}">${esc(c.label)}</a>`).join('')}</div>
    <div class="grid">${list.map(card).join('')}</div>
  </div></section>${ctaBand()}`;
}

function product(slug){
  const p = P.find(x=>x.slug===slug);
  if(!p) return shop();
  const related = P.filter(x=>x.cat===p.cat && x!==p).slice(0,4);
  const pills = [p.fit,p.weight,p.unisex?'Unisex':null].filter(Boolean);
  const sc = p.sizeChart;
  const sec = (t,items,open)=> items&&items.length?`<details ${open?'open':''}><summary>${t}</summary><div class="in"><ul>${items.map(i=>`<li>${esc(i)}</li>`).join('')}</ul></div></details>`:'';
  return `<section class="sec"><div class="wrap">
    <div class="crumbs" style="margin-bottom:24px"><a href="index.html">Home</a> / <a href="#/shop">Shop</a> / <a href="#/shop/${p.cat}">${esc(catLabel(p.cat))}</a> / ${esc(p.code)}</div>
    <div class="pd">
      <div>
        <div class="gal-main" id="gwrap"><img id="gmain" src="${esc(p.images[0])}" alt="${esc(p.name)}">
          ${p.images.length>1?'<button class="gal-nav prev" data-step="-1">‹</button><button class="gal-nav next" data-step="1">›</button>':''}</div>

        ${(p.images.length>1||(p.closeups||[]).length)?`<div class="thumbs">${p.images.map((im,i)=>`<button data-i="${i}" class="${i?'':'on'}"><img loading="lazy" src="${esc(im)}" alt=""></button>`).join('')}${(p.closeups||[]).map((c,k)=>`<button class="cu-t" data-k="${k}" title="${esc(c.label)}"><img loading="lazy" src="${esc(c.src)}" alt="${esc(c.label)}"><span>Close-up</span></button>`).join('')}</div>`:''}
      </div>
      <div class="pd-info">
        <span class="code display">${esc(p.code)}</span>
        <h1>${esc(p.name)}</h1>
        <div class="pills">${p.isNew?'<span class="o">NEW</span>':''}${pills.map(x=>`<span>${esc(x)}</span>`).join('')}<span class="o">Sold by pack · 10 pcs</span></div>
        ${p.colors&&p.colors.length?`<div class="opt"><h4>Color <small id="cname">${p.colors.length} colourways</small></h4><div class="colors">${p.colors.map(c=>`<button data-c="${esc(c)}"><i style="${swStyle(c)}"></i>${esc(c)}</button>`).join('')}</div></div>`:''}
        ${p.sizes&&p.sizes.length?`<div class="opt"><h4>Size</h4><div class="sizes">${p.sizes.map(s=>`<span>${esc(s)}</span>`).join('')}</div></div>`:''}
        <div class="qb">
          <h4>Add to quote <small>1 pack = 10 pcs of one colour &amp; size</small></h4>
          <div class="qb-row">
            ${p.colors&&p.colors.length>1?`<select id="qbc">${p.colors.map(c=>`<option>${esc(c)}</option>`).join('')}</select>`:`<select id="qbc"><option>${esc((p.colors&&p.colors[0])||'Standard')}</option></select>`}
            <select id="qbs">${(p.sizes||['One size']).map(s=>`<option>${esc(s)}</option>`).join('')}</select>
            <div class="qty"><button type="button" data-d="-1">−</button><input id="qbn" type="number" min="1" value="1"><button type="button" data-d="1">+</button></div>
          </div>
          <p class="qb-sum" id="qbsum">1 pack = 10 pcs</p>
          <div class="pd-cta"><button class="btn btn-o" id="qbadd" type="button">Add to quote</button>${sc?'<a class="btn btn-n" href="#sizechart" id="szlink">Size chart</a>':''}</div>
          <p class="note" id="qbmsg"></p>
        </div>
        <div class="acc">
          ${sec('Features',p.features,true)}
          ${sec('Fabrication',p.fabrication,true)}
          ${sec('Printing Recommendation',p.printing,false)}
          ${sc?`<details id="sizechart"><summary>Size Chart</summary><div class="in"><div class="scroll-x" style="border:0"><table class="sz"><thead><tr>${sc.cols.map(c=>`<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${sc.rows.map(r=>`<tr>${r.map(v=>`<td>${esc(v)}</td>`).join('')}</tr>`).join('')}</tbody></table></div><p class="note">${esc(sc.note||'All measurements in inches · Tolerance ± 0.5 inch')}</p></div></details>`:''}
          ${sec('Notes',D.notes,false)}
        </div>
      </div>
    </div>
    ${p.highlights&&p.highlights.length?`<div class="hl">${p.highlights.map(h=>`<div><b>${esc(h.title)}</b><p>${esc(h.desc)}</p></div>`).join('')}</div>`:''}
    ${p.closeups&&p.closeups.length?`<div class="closeups"><div class="sec-head"><div><span class="eyebrow">Up close</span><h2 class="display">Fabric &amp; detail close-ups</h2></div></div>
      <div class="cu-grid">${p.closeups.map((c,k)=>`<button class="cu" data-k="${k}"><img loading="lazy" src="${esc(c.src)}" alt="${esc(c.label)}"><span>${esc(c.label)}</span></button>`).join('')}</div></div>`:''}
    ${related.length?`<div class="related"><div class="sec-head"><h2 class="display">You may also like</h2></div><div class="grid">${related.map(card).join('')}</div></div>`:''}
  </div></section>`;
}

function catalog(){
  return `<section class="sec"><div class="wrap">
    <div class="sec-head"><div><span class="eyebrow">Catalog ${esc(D.catalogYear||'')}</span><h2 class="display">Fit guide &amp; full specs</h2><div class="crumbs"><a href="index.html">Home</a> / Catalog</div></div></div>
    <div class="fitg">${CATS.map(c=>`<div><h4>${esc(c.label)}</h4>${P.filter(p=>p.cat===c.key).map(p=>`<a href="#/product/${p.slug}">${esc(p.code)} <small style="font-weight:500">— ${esc(p.short||p.name)}</small></a>`).join('')}</div>`).join('')}</div>
    <h3 class="display" style="font-size:1.8rem;margin:56px 0 18px">Specification sheet</h3>
    <div class="scroll-x"><table class="spec-table"><thead><tr><th>Code</th><th>Product</th><th>Fit</th><th>Fabric / Blend</th><th>Weight</th><th>Sizes</th><th>Colours</th></tr></thead><tbody>
      ${P.map(p=>`<tr><td><b>${esc(p.code)}</b></td><td><a href="#/product/${p.slug}" style="font-weight:700">${esc(p.name)}</a></td><td>${esc(p.fit||'')}</td><td>${esc(p.blend||'')}</td><td>${esc(p.weight||'')}</td><td>${esc(p.sizes&&p.sizes.length?p.sizes[0]+'–'+p.sizes[p.sizes.length-1]:'')}</td><td>${(p.colors||[]).length}</td></tr>`).join('')}
    </tbody></table></div>
  </div></section>${ctaBand()}`;
}

function about(){
  return `<section class="sec"><div class="wrap split">
    <div class="prose"><span class="eyebrow">About Us</span><h2 class="display">Quality blanks. Zero hassle.</h2>
      ${D.about.body.map(t=>`<p>${esc(t)}</p>`).join('')}</div>
    <img src="${esc(D.about.image2||D.about.image)}" alt="GoThreadz apparel">
  </div><div class="wrap"><div class="vals">
    <div><b>Stock.</b><p>Core styles in deep colour ranges, sized XS to 5XL, ready for your next drop.</p></div>
    <div><b>Speed.</b><p>Quick quote replies and smooth, hassle-free order handling.</p></div>
    <div><b>Service.</b><p>Real people helping you choose the right blank, weight and print method.</p></div>
  </div></div></section>${policy(true)}`;
}

function policy(embedded){
  const body = `<div class="wrap prose" style="max-width:900px">
    <span class="eyebrow">Policy</span><h2 class="display">Delivery &amp; Returns</h2>
    <h3>Delivery</h3><ul>${D.policy.delivery.map(t=>`<li>${esc(t)}</li>`).join('')}</ul>
    <h3>Return / Exchange</h3><ul>${D.policy.returns.map(t=>`<li>${esc(t)}</li>`).join('')}</ul></div>`;
  return embedded?`<section class="sec" style="background:var(--soft)">${body}</section>`:`<section class="sec">${body}</section>`;
}

function contact(){
  const c=D.contact;
  return `<section class="sec"><div class="wrap">
    <div class="sec-head"><div><span class="eyebrow">Contact Us</span><h2 class="display">Let's talk blanks.</h2><div class="crumbs"><a href="index.html">Home</a> / Contact</div></div></div>
    <div class="contact-cards">
      <div><h4>Visit us</h4><p>${esc(c.address)}</p></div>
      <div><h4>Open hours</h4><p>${esc(c.hours)}</p></div>
      <div><h4>Reach us</h4><p>${esc(c.phone)}<br>${esc(c.email)}</p></div>
    </div></div></section>${policy(true)}`;
}

/* ---------- router ---------- */
function route(){
  const h = location.hash.replace(/^#\/?/,'').split('/');
  let html;
  switch(h[0]){
    case '': html=home(); break;
    case 'shop': html=shop(h[1]); break;
    case 'product': html=product(h[1]); break;
    case 'catalog': html=catalog(); break;
    case 'about': html=about(); break;
    case 'policy': html=policy(); break;
    case 'contact': html=contact(); break;
    case 'wholesale': html=wholesale(); break;
    case 'quote': html=quote(); break;
    default: html=home();
  }
  app.innerHTML = html;
  app.style.animation='none'; void app.offsetHeight; app.style.animation='';
  document.querySelectorAll('.links a').forEach(a=>a.classList.toggle('on', a.getAttribute('href')==='#/'+h[0]));
  $('#links').classList.remove('open');
  window.scrollTo(0,0);
  if(h[0]==='product') wireGallery(P.find(x=>x.slug===h[1]));
  if(h[0]==='quote') wireQuote();
  qBadge();
}
function wireGallery(p){
  if(!p) return;
  let i=0; const main=$('#gmain');
  const show=n=>{ i=(n+p.images.length)%p.images.length; main.src=p.images[i];
    document.querySelectorAll('.thumbs button[data-i]').forEach((b,k)=>b.classList.toggle('on',k===i)); };
  document.querySelectorAll('.thumbs button[data-i]').forEach(b=>b.onclick=()=>show(+b.dataset.i));
  document.querySelectorAll('.thumbs .cu-t').forEach(b=>b.onclick=()=>openViewer(p.closeups.map(c=>c.src),+b.dataset.k,null,p.code+' — close-up'));
  document.querySelectorAll('.gal-nav').forEach(b=>b.onclick=()=>show(i+ +b.dataset.step));
  document.querySelectorAll('.colors button').forEach(b=>b.onclick=()=>{
    document.querySelectorAll('.colors button').forEach(x=>x.classList.remove('on')); b.classList.add('on');
    $('#cname').textContent=b.dataset.c;
    const k=(p.colorImages||{})[b.dataset.c]; if(k!=null) show(k);
  });
  const wrap=$('#gwrap');
  wrap.addEventListener('click',e=>{ if(e.target.closest('.gal-nav')) return; openViewer(p.images,i,n=>show(n),p.code+' — '+p.name); });
  document.querySelectorAll('.cu').forEach(b=>b.onclick=()=>openViewer(p.closeups.map(c=>c.src),+b.dataset.k,null,p.code+' — close-up'));
  const qn=$('#qbn'), sum=()=>{const n=Math.max(1,parseInt(qn.value)||1);qn.value=n;$('#qbsum').textContent=`${n} pack${n>1?'s':''} = ${n*10} pcs`;};
  document.querySelectorAll('.qty button').forEach(b=>b.onclick=()=>{qn.value=(parseInt(qn.value)||1)+ +b.dataset.d;sum();}); qn.onchange=sum;
  document.querySelectorAll('.colors button').forEach(b=>b.addEventListener('click',()=>{$('#qbc').value=b.dataset.c;}));
  $('#qbadd').onclick=()=>{const q=qGet(),c=$('#qbc').value,s=$('#qbs').value,n=Math.max(1,parseInt(qn.value)||1);
    const ex=q.find(l=>l.slug===p.slug&&l.color===c&&l.size===s); if(ex) ex.packs+=n; else q.push({slug:p.slug,code:p.code,name:p.name,color:c,size:s,packs:n});
    qSet(q); $('#qbmsg').innerHTML=`Added ${n*10} pcs (${esc(c)}, ${esc(s)}). <a href="#/quote" style="color:var(--orange);font-weight:800">View quote →</a>`;};
  const sl=$('#szlink'); if(sl) sl.onclick=e=>{e.preventDefault(); const d=$('#sizechart'); d.open=true; d.scrollIntoView({behavior:'smooth',block:'start'});};
}
/* ---------- full-screen zoom viewer ---------- */
function openViewer(imgs,start,onChange,caption){
  let i=start;
  const v=document.createElement('div'); v.className='viewer';
  v.innerHTML=`<div class="v-stage"><img alt=""></div>
    <button class="v-close" aria-label="Close">✕</button>
    ${imgs.length>1?'<button class="v-nav prev" aria-label="Previous">‹</button><button class="v-nav next" aria-label="Next">›</button>':''}
    ${caption?`<p class="v-cap">${esc(caption)} <span class="v-count"></span></p>`:'<p class="v-cap"><span class="v-count"></span></p>'}`;
  document.body.appendChild(v); document.body.style.overflow='hidden';
  const img=v.querySelector('img'), stage=v.querySelector('.v-stage');
  img.onload=()=>{img.style.maxWidth=Math.min(innerWidth*.92,img.naturalWidth)+'px';img.style.maxHeight=Math.min(innerHeight-110,img.naturalHeight)+'px';};
  const load=n=>{ i=(n+imgs.length)%imgs.length; img.style.maxWidth=img.style.maxHeight=''; img.src=imgs[i]; v.querySelector('.v-count').textContent=imgs.length>1?`· ${i+1} / ${imgs.length}`:''; onChange&&onChange(i); };
  const close=()=>{ v.remove(); document.body.style.overflow=''; document.removeEventListener('keydown',key); };
  const key=e=>{ if(e.key==='Escape')close(); if(e.key==='ArrowRight')load(i+1); if(e.key==='ArrowLeft')load(i-1); };
  document.addEventListener('keydown',key);
  v.querySelector('.v-close').onclick=close;
  v.querySelectorAll('.v-nav').forEach(b=>b.onclick=()=>load(i+(b.classList.contains('next')?1:-1)));
  stage.addEventListener('click',e=>{ if(e.target===stage)close(); });
  let sx=null; stage.addEventListener('touchstart',e=>sx=e.touches[0].clientX,{passive:true});
  stage.addEventListener('touchend',e=>{ if(sx==null)return; const dx=e.changedTouches[0].clientX-sx; if(Math.abs(dx)>50)load(i+(dx<0?1:-1)); sx=null; });
  load(i);
}
$('#burger').onclick=()=>$('#links').classList.toggle('open');
$('#foot-contact').innerHTML = `${esc(D.contact.address)}<br>${esc(D.contact.phone)}<br>${esc(D.contact.email)}`;
$('#yr').textContent = new Date().getFullYear();
window.addEventListener('hashchange',route);
route();
})();
