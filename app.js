'use strict';
/* SpeedFusion Pro — كل القياسات هنا حقيقية (لا أرقام عشوائية). */
const VERSION = '3.0.0';
const CF = 'https://speed.cloudflare.com';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const nf = (n, d = 1) => Number(n).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: 0 });
const fmtDate = ts => new Date(ts).toLocaleString('ar-u-nu-latn', { dateStyle: 'short', timeStyle: 'short' });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ---------- تخزين آمن ---------- */
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* ممتلئ/ممنوع */ } },
  del(k) { try { localStorage.removeItem(k); } catch { /* */ } }
};
// نتائج الإصدار القديم كانت أرقاماً عشوائية، فنحذفها
store.del('speedHistory'); store.del('settings'); store.del('currentDNS');

const DEFAULTS = {
  saveHistory: true, dataSaver: false, auto: false, autoInt: 30, autoWifi: true,
  saver: false, autoSaver: true, mono: false, dns: ''
};
const settings = Object.assign({}, DEFAULTS, store.get('sf.settings', {}));
let history = store.get('sf.history', []);
if (!Array.isArray(history)) history = [];
const saveSettings = () => store.set('sf.settings', settings);

/* ---------- واجهة عامة ---------- */
let toastTimer;
function toast(msg, actionLabel, action) {
  const t = $('#toast');
  t.textContent = msg;
  if (actionLabel) {
    const b = document.createElement('button');
    b.className = 'chip'; b.textContent = actionLabel; b.onclick = action;
    t.append(b);
  }
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.hidden = true; }, actionLabel ? 10000 : 3500);
}

function applyModes() {
  document.body.classList.toggle('saver', !!settings.saver);
  document.body.classList.toggle('mono', !!settings.mono);
  const m = $('meta[name=theme-color]');
  if (m) m.content = settings.mono ? '#000000' : '#0f0c29';
}

/* ---------- التنقل ---------- */
const VIEWS = ['test', 'dns', 'net', 'history', 'settings'];
function route() {
  let v = location.hash.slice(1);
  if (!VIEWS.includes(v)) v = 'test';
  VIEWS.forEach(n => { $('#view-' + n).hidden = n !== v; });
  $$('.tabs a').forEach(a => {
    const on = a.dataset.view === v;
    a.classList.toggle('on', on);
    on ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current');
  });
  if (v === 'net') { renderNet(); readBattery(); }
  if (v === 'history') renderHistory();
  if (v === 'settings') renderSettings();
  window.scrollTo(0, 0);
}
addEventListener('hashchange', route);

/* ---------- معلومات الشبكة من المتصفح ---------- */
const connInfo = () => navigator.connection || navigator.mozConnection || navigator.webkitConnection || null;
const typeAr = { wifi: 'Wi‑Fi', cellular: 'بيانات الجوال', ethernet: 'سلكي', bluetooth: 'بلوتوث', none: 'لا اتصال', other: 'أخرى', unknown: 'غير معروف' };

function renderNet() {
  const c = connInfo();
  const rows = [['الحالة', navigator.onLine ? 'متصل' : 'غير متصل', navigator.onLine ? 'ok' : 'bad']];
  if (c) {
    if (c.type) rows.push(['نوع الاتصال', typeAr[c.type] || c.type]);
    if (c.effectiveType) rows.push(['جودة الشبكة (تقدير المتصفح)', c.effectiveType.toUpperCase()]);
    if (c.downlink != null) rows.push(['سرعة تقديرية', nf(c.downlink) + ' Mbps']);
    if (c.rtt != null) rows.push(['زمن الاستجابة التقديري', c.rtt + ' ms']);
    rows.push(['وضع توفير البيانات بالمتصفح', c.saveData ? 'مفعّل' : 'غير مفعّل']);
  } else rows.push(['تفاصيل الشبكة', 'غير مدعومة في هذا المتصفح']);
  $('#netList').innerHTML = rows.map(([k, v, cls]) => `<li><span class="k">${esc(k)}</span><span class="v ${cls || ''}">${esc(v)}</span></li>`).join('');
}
connInfo()?.addEventListener?.('change', () => { if (!$('#view-net').hidden) renderNet(); });
function setOnline() { $('#offlineBar').hidden = navigator.onLine; if (!$('#view-net').hidden) renderNet(); }
addEventListener('online', setOnline); addEventListener('offline', setOnline);

/* ---------- البطارية ---------- */
let batMgr = null;
async function readBattery() {
  const box = $('#batBox');
  if (!navigator.getBattery) { box.textContent = 'هذا المتصفح لا يتيح قراءة البطارية (متاحة في كروم/إيدج على أندرويد وسطح المكتب).'; return; }
  try {
    batMgr = batMgr || await navigator.getBattery();
    const draw = () => {
      const p = Math.round(batMgr.level * 100);
      const col = p <= 20 ? 'var(--bad)' : p <= 50 ? 'var(--warn)' : 'var(--ok)';
      const fin = isFinite;
      const eta = batMgr.charging
        ? (fin(batMgr.chargingTime) ? `يكتمل الشحن بعد ~${nf(batMgr.chargingTime / 60, 0)} د` : '')
        : (fin(batMgr.dischargingTime) ? `متبقي ~${nf(batMgr.dischargingTime / 3600)} ساعة` : '');
      box.className = '';
      box.innerHTML = `<div class="bat"><div class="bat-ring"><span>${p}%</span></div>
        <div><div>${batMgr.charging ? '⚡ قيد الشحن' : '🔋 يعمل على البطارية'}</div><div class="muted small">${eta}</div></div></div>`;
      const ring = $('.bat-ring', box); ring.style.setProperty('--p', p); ring.style.setProperty('--ring', col);
    };
    draw();
    if (!batMgr._sf) { batMgr._sf = true; ['levelchange', 'chargingchange', 'chargingtimechange', 'dischargingtimechange'].forEach(e => batMgr.addEventListener(e, () => { if (!$('#view-net').hidden) draw(); autoSaverCheck(); })); }
  } catch { box.textContent = 'تعذّرت قراءة البطارية.'; }
}
async function autoSaverCheck() {
  if (!settings.autoSaver || !batMgr) return;
  const low = batMgr.level <= 0.2 && !batMgr.charging;
  if (low && !settings.saver) { settings.saver = true; settings._autoSaver = true; saveSettings(); applyModes(); toast('🔋 البطارية منخفضة — فُعّل وضع توفير الطاقة'); }
  else if (!low && settings._autoSaver && settings.saver) { settings.saver = false; settings._autoSaver = false; saveSettings(); applyModes(); }
}

/* ---------- محرك قياس السرعة ---------- */
const gauge = {
  arc: $('#gArc'), val: $('#gValue'),
  set(mbps) {
    const f = Math.max(0, Math.min(1, Math.log10(1 + mbps) / Math.log10(1 + 1000)));
    this.arc.style.strokeDashoffset = String(282.74 * (1 - f));
    this.val.textContent = mbps >= 100 ? nf(mbps, 0) : nf(mbps, 1);
  }
};
const rnd = () => Math.random().toString(36).slice(2);
const median = a => { const s = [...a].sort((x, y) => x - y); const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };

let running = null; // { ctrl, bytes }
let usedBytes = store.get('sf.bytes', 0);

async function measurePing(ctrl, n = 12) {
  const t = [];
  for (let i = 0; i < n; i++) {
    const s = performance.now();
    try { await fetch(`${CF}/__down?bytes=0&r=${rnd()}`, { cache: 'no-store', signal: ctrl.signal }); }
    catch (e) { if (ctrl.signal.aborted) throw e; continue; }
    t.push(performance.now() - s);
    if (i === 0) t.shift();               // أول طلب يشمل مصافحة TLS
    $('#phase').textContent = `قياس زمن الاستجابة… ${i + 1}/${n}`;
  }
  if (t.length < 3) throw new Error('ping');
  let j = 0; for (let i = 1; i < t.length; i++) j += Math.abs(t[i] - t[i - 1]);
  return { ping: median(t), jitter: j / (t.length - 1) };
}

async function measureDownload(main, secs, streams) {
  const ctrl = new AbortController();
  const relay = () => ctrl.abort();
  main.signal.addEventListener('abort', relay, { once: true });
  let bytes = 0, stop = false;
  const t0 = performance.now(), warm = 1000;
  let warmBytes = 0, warmDone = false, peak = 0;
  const marks = [];
  const worker = async () => {
    while (!stop) {
      try {
        const res = await fetch(`${CF}/__down?bytes=25000000&r=${rnd()}`, { cache: 'no-store', signal: ctrl.signal });
        if (!res.ok || !res.body) throw new Error('http ' + res.status);
        const rd = res.body.getReader();
        for (;;) {
          const { done, value } = await rd.read();
          if (done || stop) { try { rd.cancel(); } catch { /* */ } break; }
          bytes += value.length; running.bytes += value.length;
        }
      } catch (e) { if (stop || ctrl.signal.aborted) return; throw e; }
    }
  };
  const ticker = setInterval(() => {
    const now = performance.now(), el = now - t0;
    if (!warmDone && el >= warm) { warmDone = true; warmBytes = bytes; marks.push(now); }
    const mark = warmDone ? marks[0] : t0;
    const b = warmDone ? bytes - warmBytes : bytes;
    const mbps = (b * 8) / 1e6 / Math.max(0.2, (now - mark) / 1000);
    gauge.set(mbps); peak = Math.max(peak, mbps);
    $('#phase').textContent = `قياس التحميل… ${Math.min(secs, Math.round(el / 1000))}/${secs}ث`;
  }, 200);
  const timer = setTimeout(() => { stop = true; ctrl.abort(); }, secs * 1000);
  try {
    await Promise.all(Array.from({ length: streams }, worker));
  } finally { clearInterval(ticker); clearTimeout(timer); main.signal.removeEventListener('abort', relay); }
  if (main.signal.aborted) throw new DOMException('abort', 'AbortError');
  const end = performance.now();
  if (!warmDone || bytes - warmBytes <= 0) { if (bytes <= 0) throw new Error('download'); return (bytes * 8) / 1e6 / ((end - t0) / 1000); }
  return ((bytes - warmBytes) * 8) / 1e6 / ((end - marks[0]) / 1000);
}

function makePayload(size) {
  const buf = new Uint8Array(size);
  for (let o = 0; o < size; o += 65536) crypto.getRandomValues(buf.subarray(o, Math.min(o + 65536, size)));
  return new Blob([buf]);
}

async function measureUpload(secs, streams, chunk) {
  const payload = makePayload(chunk);
  const xhrs = new Set();
  let sent = 0, stop = false, err = 0;
  const t0 = performance.now();
  const one = () => new Promise(res => {
    const x = new XMLHttpRequest(); xhrs.add(x);
    let last = 0;
    x.open('POST', `${CF}/__up?r=${rnd()}`);
    x.upload.onprogress = e => { sent += e.loaded - last; running.bytes += e.loaded - last; last = e.loaded; };
    x.onload = () => { const rest = payload.size - last; if (rest > 0 && x.status >= 200 && x.status < 300) { sent += rest; running.bytes += rest; last = payload.size; } };
    x.onloadend = () => { xhrs.delete(x); if (x.status === 0 && !stop) err++; res(); };
    x.send(payload);
  });
  const worker = async () => { while (!stop && err < 3) await one(); };
  const ticker = setInterval(() => {
    const el = (performance.now() - t0) / 1000;
    gauge.set((sent * 8) / 1e6 / Math.max(0.3, el));
    $('#phase').textContent = `قياس الرفع… ${Math.min(secs, Math.round(el))}/${secs}ث`;
  }, 200);
  const timer = setTimeout(() => { stop = true; xhrs.forEach(x => x.abort()); }, secs * 1000);
  const cancel = () => { stop = true; xhrs.forEach(x => x.abort()); };
  running.ctrl.signal.addEventListener('abort', cancel, { once: true });
  try { await Promise.all(Array.from({ length: streams }, worker)); }
  finally { clearInterval(ticker); clearTimeout(timer); }
  if (running.ctrl.signal.aborted) throw new DOMException('abort', 'AbortError');
  const el = (performance.now() - t0) / 1000;
  if (sent <= 0) throw new Error('upload');
  return (sent * 8) / 1e6 / el;
}

async function fetchTrace() {
  for (const u of [`${CF}/cdn-cgi/trace`, 'https://www.cloudflare.com/cdn-cgi/trace', 'https://1.1.1.1/cdn-cgi/trace']) {
    try {
      const r = await fetch(u, { cache: 'no-store' });
      if (!r.ok) continue;
      const o = {};
      (await r.text()).trim().split('\n').forEach(l => { const i = l.indexOf('='); if (i > 0) o[l.slice(0, i)] = l.slice(i + 1); });
      if (o.ip) return o;
    } catch { /* جرّب التالي */ }
  }
  return null;
}

function setBusy(on) {
  const b = $('#startBtn');
  b.textContent = on ? '■ إيقاف' : '▶ ابدأ اختبار السرعة';
  b.classList.toggle('stop', on);
}

async function runTest(auto = false) {
  if (running) return;
  if (!navigator.onLine) { toast('لا يوجد اتصال بالإنترنت'); return; }
  const ds = settings.dataSaver || connInfo()?.saveData;
  const cfg = ds ? { dl: 4, ul: 3, streams: 2, chunk: 1e6 } : { dl: 8, ul: 5, streams: 4, chunk: 4e6 };
  const ctrl = new AbortController();
  running = { ctrl, bytes: 0 };
  setBusy(true);
  ['#mDown', '#mUp', '#mPing', '#mJit'].forEach(s => { $(s).textContent = '—'; });
  gauge.set(0); $('#verdict').hidden = true;
  const res = { t: Date.now() };
  try {
    $('#phase').textContent = 'جارٍ تحديد أقرب خادم…';
    const trace = await fetchTrace();
    if (ctrl.signal.aborted) throw new DOMException('abort', 'AbortError');
    if (trace) { res.colo = trace.colo; res.loc = trace.loc; $('#serverLine').textContent = `الخادم ${trace.colo || '?'} — الدولة ${trace.loc || '?'}`; }

    const p = await measurePing(ctrl); res.ping = p.ping; res.jitter = p.jitter;
    $('#mPing').textContent = nf(p.ping, 0); $('#mJit').textContent = nf(p.jitter, 1);

    gauge.set(0);
    res.down = await measureDownload(ctrl, cfg.dl, cfg.streams);
    $('#mDown').textContent = nf(res.down); gauge.set(res.down);

    // الرفع: قد يفشل على بعض الشبكات؛ لا نُسقط النتيجة كلها بسببه
    const ctrl2 = running.ctrl;
    try { gauge.set(0); res.up = await measureUpload(cfg.ul, Math.min(cfg.streams, 3), cfg.chunk); $('#mUp').textContent = nf(res.up); }
    catch (e) { if (ctrl2.signal.aborted) throw e; res.up = null; $('#mUp').textContent = 'فشل'; }
    gauge.set(res.down);

    const c = connInfo(); if (c) { res.conn = c.type || c.effectiveType || ''; }
    res.dataMB = running.bytes / 1e6;
    $('#phase').textContent = `اكتمل الاختبار · استُهلك نحو ${nf(res.dataMB, 0)} ميغابايت`;
    usedBytes += running.bytes; store.set('sf.bytes', usedBytes);
    if (settings.saveHistory) { history.unshift(res); history = history.slice(0, 100); store.set('sf.history', history); }
    renderVerdict(res); renderRecent();
    if (!auto && navigator.vibrate) navigator.vibrate(60);
  } catch (e) {
    if (ctrl.signal.aborted || e?.name === 'AbortError') $('#phase').textContent = 'أُوقف الاختبار';
    else { $('#phase').textContent = 'تعذّر الاختبار — تحقّق من اتصالك أو من حجب الموقع'; if (!auto) toast('فشل الوصول إلى خادم القياس'); }
  } finally { running = null; setBusy(false); }
}

function renderVerdict(r) {
  const items = [];
  const add = (ok, text) => items.push(`<li class="${ok === 1 ? '' : ok === 0 ? 'no' : 'mid'}">${text}</li>`);
  add(r.down >= 3 ? 1 : r.down >= 1 ? 2 : 0, 'تصفح المواقع والتطبيقات');
  add(r.down >= 25 ? 1 : r.down >= 5 ? 2 : 0, r.down >= 25 ? 'فيديو بدقة 4K' : r.down >= 5 ? 'فيديو HD (دقة 4K تحتاج 25 Mbps+)' : 'مشاهدة الفيديو بجودة جيدة');
  const callOk = r.down >= 3 && (r.up == null || r.up >= 1.5) && r.ping < 150 && r.jitter < 30;
  add(callOk ? 1 : (r.ping < 250 ? 2 : 0), 'مكالمات الصوت والفيديو' + (r.up == null ? ' (الرفع لم يُقَس)' : ''));
  add(r.ping < 50 && r.jitter < 20 ? 1 : r.ping < 100 ? 2 : 0, `الألعاب الإلكترونية (استجابة ${nf(r.ping, 0)}ms)`);
  $('#verdictList').innerHTML = items.join('');
  $('#verdict').hidden = false;
  $('#shareBtn').hidden = !navigator.share;
  $('#shareBtn').onclick = () => navigator.share({ title: 'SpeedFusion Pro', text: `نتيجة اختبار السرعة: تحميل ${nf(r.down)} Mbps، رفع ${r.up != null ? nf(r.up) : '—'} Mbps، استجابة ${nf(r.ping, 0)} ms`, url: location.href.split('#')[0] }).catch(() => { });
}

function renderRecent() {
  const el = $('#recent');
  if (!history.length) { el.className = 'muted small'; el.textContent = 'لا توجد نتائج بعد'; return; }
  el.className = '';
  el.innerHTML = history.slice(0, 3).map(rowHtml).join('');
}
const rowHtml = h => `<div class="hrow"><span class="t">${fmtDate(h.t)}</span><span class="n"><span class="d">↓${nf(h.down)}</span> <span class="u">↑${h.up != null ? nf(h.up) : '—'}</span> · ${nf(h.ping, 0)}ms</span></div>`;

/* ---------- السجل والإحصائيات ---------- */
function renderHistory() {
  const n = history.length;
  $('#sCount').textContent = n;
  const d = history.map(h => h.down);
  $('#sAvg').textContent = n ? nf(d.reduce((a, b) => a + b, 0) / n) + ' Mbps' : '—';
  $('#sBest').textContent = n ? nf(Math.max(...d)) + ' Mbps' : '—';
  $('#sWorst').textContent = n ? nf(Math.min(...d)) + ' Mbps' : '—';
  $('#histList').innerHTML = n ? history.slice(0, 30).map(h => rowHtml(h) + (h.colo ? '' : '')).join('') : '<p class="muted small center">لا توجد بيانات. شغّل اختباراً أو فعّل حفظ السجل.</p>';
  $('#expCsv').disabled = !n;
  drawChart();
}
function drawChart() {
  const cv = $('#chart'), dpr = devicePixelRatio || 1;
  const w = cv.clientWidth || 300, h = 160;
  cv.width = w * dpr; cv.height = h * dpr;
  const g = cv.getContext('2d'); g.scale(dpr, dpr); g.clearRect(0, 0, w, h);
  const data = history.slice(0, 20).reverse();
  if (data.length < 2) { g.fillStyle = '#9aa0c0'; g.font = '13px system-ui'; g.textAlign = 'center'; g.fillText('يلزم اختباران على الأقل لرسم المنحنى', w / 2, h / 2); return; }
  const max = Math.max(...data.map(x => Math.max(x.down, x.up || 0))) * 1.15 || 1;
  const pad = 26, X = i => pad + (i * (w - pad - 8)) / (data.length - 1), Y = v => h - 18 - (v / max) * (h - 30);
  g.strokeStyle = 'rgba(255,255,255,.08)'; g.fillStyle = '#9aa0c0'; g.font = '10px system-ui'; g.textAlign = 'right';
  for (let i = 0; i <= 3; i++) { const v = (max * i) / 3, y = Y(v); g.beginPath(); g.moveTo(pad, y); g.lineTo(w - 4, y); g.stroke(); g.fillText(nf(v, 0), pad - 4, y + 3); }
  const line = (key, color) => {
    g.strokeStyle = color; g.lineWidth = 2; g.beginPath(); let st = false;
    data.forEach((r, i) => { if (r[key] == null) return; const x = X(i), y = Y(r[key]); st ? g.lineTo(x, y) : g.moveTo(x, y); st = true; });
    g.stroke(); g.fillStyle = color;
    data.forEach((r, i) => { if (r[key] == null) return; g.beginPath(); g.arc(X(i), Y(r[key]), 2.5, 0, 7); g.fill(); });
  };
  line('down', '#8ea0ff'); line('up', '#34d399');
}
addEventListener('resize', () => { if (!$('#view-history').hidden) drawChart(); });

$('#clearBtn').onclick = () => {
  if (!history.length || !confirm('مسح كل نتائج الاختبارات من هذا الجهاز؟')) return;
  history = []; store.del('sf.history'); renderHistory(); renderRecent(); toast('تم مسح السجل');
};
$('#expCsv').onclick = () => {
  const head = 'time,download_mbps,upload_mbps,ping_ms,jitter_ms,server,country,connection,data_mb';
  const rows = history.map(h => [new Date(h.t).toISOString(), nf2(h.down), nf2(h.up), nf2(h.ping), nf2(h.jitter), h.colo || '', h.loc || '', h.conn || '', nf2(h.dataMB)].join(','));
  const blob = new Blob(['﻿' + [head, ...rows].join('\n')], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'speedfusion-history.csv';
  document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
};
const nf2 = v => (v == null ? '' : (Math.round(v * 100) / 100).toString());

/* ---------- فحص الاتصال ---------- */
$('#checkBtn').onclick = async () => {
  const ul = $('#checkList'); ul.innerHTML = '<li><span class="k">جارٍ الفحص…</span></li>';
  const tr = await fetchTrace();
  const li = (k, v, cls = '') => `<li><span class="k">${esc(k)}</span><span class="v ${cls}">${esc(v)}</span></li>`;
  const rows = [li('اتصال HTTPS للتطبيق', location.protocol === 'https:' ? 'آمن' : 'غير مشفّر', location.protocol === 'https:' ? 'ok' : 'warn')];
  if (!tr) rows.push(li('الوصول لخوادم الفحص', 'تعذّر (لا إنترنت أو محجوب)', 'bad'));
  else {
    rows.push(li('الوصول لخوادم الفحص', 'ناجح', 'ok'));
    rows.push(li('عنوان IP العام', tr.ip));
    rows.push(li('الدولة / مركز البيانات', `${tr.loc || '?'} / ${tr.colo || '?'}`));
    if (tr.tls) rows.push(li('إصدار TLS', tr.tls, /1\.[23]/.test(tr.tls) ? 'ok' : 'warn'));
    if (tr.http) rows.push(li('بروتوكول HTTP', tr.http));
    if (tr.warp) rows.push(li('Cloudflare WARP', tr.warp === 'off' ? 'متوقف' : 'مفعّل', tr.warp === 'off' ? '' : 'ok'));
    if (tr.gateway) rows.push(li('Cloudflare Gateway', tr.gateway === 'off' ? 'متوقف' : 'مفعّل'));
  }
  rows.push(li('عمل دون اتصال (Service Worker)', 'serviceWorker' in navigator && navigator.serviceWorker.controller ? 'مفعّل' : 'غير مفعّل بعد', 'serviceWorker' in navigator && navigator.serviceWorker.controller ? 'ok' : ''));
  rows.push(li('إجمالي ما استهلكته الاختبارات', `${nf(usedBytes / 1e6, 0)} MB`));
  ul.innerHTML = rows.join('');
};

/* ---------- DNS عبر DoH (RFC 8484) ---------- */
const DNS = [
  { id: 'cloudflare', name: 'Cloudflare', url: 'https://cloudflare-dns.com/dns-query', host: 'one.one.one.one', ips: '1.1.1.1 / 1.0.0.1' },
  { id: 'google', name: 'Google', url: 'https://dns.google/dns-query', host: 'dns.google', ips: '8.8.8.8 / 8.8.4.4' },
  { id: 'quad9', name: 'Quad9 (حماية من المواقع الضارة)', url: 'https://dns.quad9.net/dns-query', host: 'dns.quad9.net', ips: '9.9.9.9 / 149.112.112.112' },
  { id: 'adguard', name: 'AdGuard (حجب الإعلانات)', url: 'https://dns.adguard-dns.com/dns-query', host: 'dns.adguard-dns.com', ips: '94.140.14.14 / 94.140.15.15' },
  { id: 'opendns', name: 'OpenDNS', url: 'https://doh.opendns.com/dns-query', host: '', ips: '208.67.222.222 / 208.67.220.220' }
];
const DOMAINS = ['example.com', 'wikipedia.org', 'github.com', 'microsoft.com', 'amazon.com', 'apple.com'];

function dnsQuery(name) {
  const parts = name.split('.'), out = [0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0];
  parts.forEach(p => { out.push(p.length); for (const c of p) out.push(c.charCodeAt(0)); });
  out.push(0, 0, 1, 0, 1); // A / IN
  return btoa(String.fromCharCode(...out)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
async function dohOnce(p, domain) {
  const s = performance.now();
  const r = await fetch(`${p.url}?dns=${dnsQuery(domain)}`, { headers: { accept: 'application/dns-message' }, cache: 'no-store', credentials: 'omit' });
  if (!r.ok) throw new Error('http');
  const b = new Uint8Array(await r.arrayBuffer());
  const t = performance.now() - s;
  if (b.length < 12 || (b[3] & 15) !== 0 || ((b[6] << 8) | b[7]) < 1) throw new Error('bad answer');
  return t;
}
async function benchDns(p) {
  const t = [];
  for (let i = 0; i < DOMAINS.length; i++) {
    try { const v = await dohOnce(p, DOMAINS[i]); if (i > 0) t.push(v); } catch { if (i > 0) t.push(NaN); }
  }
  const ok = t.filter(x => !isNaN(x));
  if (ok.length < 3) return null;
  return median(ok);
}

let dnsResults = store.get('sf.dnsResults', null);
function renderDns() {
  const ul = $('#dnsList');
  if (!dnsResults) { ul.innerHTML = ''; $('#dnsHow').hidden = true; return; }
  const ok = dnsResults.filter(r => r.ms != null).sort((a, b) => a.ms - b.ms);
  const bad = dnsResults.filter(r => r.ms == null);
  const worst = Math.max(...ok.map(r => r.ms), 1);
  ul.innerHTML = [...ok, ...bad].map((r, i) => {
    const p = DNS.find(d => d.id === r.id);
    return `<li class="${i === 0 && r.ms != null ? 'best' : ''}"><span class="nm">${i === 0 && r.ms != null ? '🏆 ' : ''}${esc(p.name)}</span>
      <span class="ms">${r.ms != null ? nf(r.ms, 0) + ' ms' : 'لا استجابة'}</span>
      ${r.ms != null ? `<span class="bar"><i data-w="${Math.max(6, 100 - (r.ms / (worst * 1.1)) * 100)}"></i></span>` : ''}
      <span class="sel"><span>${esc(p.ips)}</span><button class="pick" data-id="${p.id}">${settings.dns === p.id ? '✓ المختار' : 'اختر للتفعيل'}</button></span></li>`;
  }).join('');
  $$('.bar i', ul).forEach(i => { i.style.width = i.dataset.w + '%'; });
  $$('.pick', ul).forEach(b => b.onclick = () => { settings.dns = b.dataset.id; saveSettings(); renderDns(); showDnsHow(); });
  if (!settings.dns && ok[0]) settings.dns = ok[0].id;
  showDnsHow();
}
function showDnsHow() {
  const p = DNS.find(d => d.id === settings.dns);
  if (!p || !dnsResults) return;
  $('#dnsHow').hidden = false;
  $('#dnsHost').textContent = p.host || 'غير متاح — استخدم عناوين IP أدناه';
  $('#copyHost').hidden = !p.host;
  $('#dnsIps').textContent = p.ips.replace(' / ', '  ');
}
const copy = async (txt) => { try { await navigator.clipboard.writeText(txt); toast('تم النسخ'); } catch { toast('تعذّر النسخ — انسخه يدوياً'); } };
$('#copyHost').onclick = () => copy($('#dnsHost').textContent);
$('#copyIps').onclick = () => copy($('#dnsIps').textContent.replace(/\s+/g, ' / ').replace(/ \/ $/, ''));

$('#dnsBtn').onclick = async function () {
  if (!navigator.onLine) return toast('لا يوجد اتصال بالإنترنت');
  this.disabled = true; const old = this.textContent;
  const res = [];
  for (let i = 0; i < DNS.length; i++) {
    this.textContent = `جارٍ قياس ${DNS[i].name.split(' ')[0]}… (${i + 1}/${DNS.length})`;
    res.push({ id: DNS[i].id, ms: await benchDns(DNS[i]) });
  }
  dnsResults = res; store.set('sf.dnsResults', res);
  const best = res.filter(r => r.ms != null).sort((a, b) => a.ms - b.ms)[0];
  if (best) settings.dns = best.id; else toast('تعذّر الوصول لأي خادم DNS');
  saveSettings(); renderDns();
  this.disabled = false; this.textContent = old;
};

/* ---------- الإعدادات ---------- */
const bind = (sel, key, after) => {
  const el = $(sel); el.onchange = () => { settings[key] = el.type === 'checkbox' ? el.checked : (isNaN(+el.value) ? el.value : +el.value); saveSettings(); after && after(); };
};
bind('#oSave', 'saveHistory', () => { if (!settings.saveHistory) { history = []; store.del('sf.history'); renderRecent(); } });
bind('#oData', 'dataSaver');
bind('#oAuto', 'auto', () => { scheduleNext(true); renderSettings(); });
bind('#oInt', 'autoInt', () => { scheduleNext(true); renderSettings(); });
bind('#oWifi', 'autoWifi');
bind('#oSaver', 'saver', () => { settings._autoSaver = false; applyModes(); });
bind('#oAutoSaver', 'autoSaver', autoSaverCheck);
bind('#oMono', 'mono', applyModes);
function renderSettings() {
  $('#oSave').checked = settings.saveHistory; $('#oData').checked = settings.dataSaver;
  $('#oAuto').checked = settings.auto; $('#oInt').value = String(settings.autoInt); $('#oWifi').checked = settings.autoWifi;
  $('#oSaver').checked = settings.saver; $('#oAutoSaver').checked = settings.autoSaver; $('#oMono').checked = settings.mono;
  $('#nextRun').textContent = settings.auto
    ? `يعمل فقط والتطبيق مفتوح. الاختبار القادم: ${new Date(nextRun).toLocaleTimeString('ar-u-nu-latn', { timeStyle: 'short' })}`
    : '';
  $('#ver').textContent = VERSION;
}

/* ---------- الاختبار التلقائي (والتطبيق مفتوح) ---------- */
let nextRun = Date.now() + settings.autoInt * 60000;
function scheduleNext(reset) { if (reset || nextRun < Date.now()) nextRun = Date.now() + settings.autoInt * 60000; }
setInterval(() => {
  if (!settings.auto || running || document.hidden || Date.now() < nextRun) return;
  scheduleNext(true);
  const c = connInfo();
  if (settings.saver || !navigator.onLine || c?.saveData || (settings.autoWifi && c?.type === 'cellular')) return;
  runTest(true);
}, 15000);

/* ---------- PWA: تثبيت وتحديث ---------- */
let deferred = null;
addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferred = e; $('#installBtn').hidden = false; });
$('#installBtn').onclick = async () => { if (!deferred) return; deferred.prompt(); await deferred.userChoice; deferred = null; $('#installBtn').hidden = true; };
addEventListener('appinstalled', () => { $('#installBtn').hidden = true; toast('تم تثبيت التطبيق'); });
const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent), standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone;
if (isIOS && !standalone && !store.get('sf.iosHint', false)) { store.set('sf.iosHint', true); setTimeout(() => toast('للتثبيت: زر المشاركة ← إضافة إلى الشاشة الرئيسية'), 2500); }

if ('serviceWorker' in navigator) {
  addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('sw.js');
      reg.addEventListener('updatefound', () => {
        const nw = reg.installing;
        nw && nw.addEventListener('statechange', () => {
          if (nw.state === 'installed' && navigator.serviceWorker.controller) toast('يتوفر إصدار جديد', 'تحديث', () => { nw.postMessage('skipWaiting'); });
        });
      });
      let reloaded = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => { if (!reloaded && !running) { reloaded = true; location.reload(); } });
    } catch { /* غير مدعوم (file://) */ }
  });
}

/* ---------- زر البدء ---------- */
$('#startBtn').onclick = () => { if (running) running.ctrl.abort(); else runTest(); };

/* ---------- التهيئة ---------- */
applyModes(); setOnline(); renderRecent(); renderDns(); route();
if (history[0]) { gauge.set(history[0].down); $('#mDown').textContent = nf(history[0].down); $('#mUp').textContent = history[0].up != null ? nf(history[0].up) : '—'; $('#mPing').textContent = nf(history[0].ping, 0); $('#mJit').textContent = nf(history[0].jitter, 1); $('#phase').textContent = 'آخر نتيجة محفوظة — اضغط للقياس من جديد'; }
if (navigator.getBattery) navigator.getBattery().then(b => { batMgr = b; autoSaverCheck(); }).catch(() => { });
