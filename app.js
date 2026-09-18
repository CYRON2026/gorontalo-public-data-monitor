let DATA=null,map=null,markers=[];
const moneyM=n=>new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(n*1000000);
const moneyB=n=>new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(n*1000000000);
const pct=(a,b)=>b?((a/b)*100).toFixed(2)+"%":"—";
const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
async function load(){
 try{
  const r=await fetch("./data/v2.1-data.json",{cache:"no-store"}); if(!r.ok) throw new Error("HTTP "+r.status);
  DATA=await r.json(); buildFilters(); initMap(); bind(); render(); renderSources(); renderCoverage();
 }catch(e){document.querySelector("main").innerHTML='<section class="card error"><h2>Data gagal dimuat</h2><p>'+esc(e.message)+'</p><p>Pastikan <code>data/v2.1-data.json</code> sudah di-upload.</p></section>'}
}
function buildFilters(){const s=document.querySelector("#region");s.innerHTML='<option value="all">Semua wilayah</option>'+DATA.regions.map(r=>`<option value="${r.id}">${esc(r.name)}</option>`).join("")}
function initMap(){map=L.map("map").setView([0.62,122.65],8);L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:18,attribution:"© OpenStreetMap contributors"}).addTo(map);setTimeout(()=>map.invalidateSize(true),200)}
function bind(){
 ["year","focus","region","search"].forEach(id=>document.querySelector("#"+id).addEventListener(id==="search"?"input":"change",render));
 document.querySelector("#reset").onclick=()=>{year.value="2026";focus.value="apbd";region.value="all";search.value="";render()};
 document.querySelector("#download").onclick=()=>{const b=new Blob([JSON.stringify(DATA,null,2)],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(b);a.download="gorontalo-public-data-monitor-v2.1-2026-snapshot.json";a.click();URL.revokeObjectURL(a.href)}
}
function setKpis(){
 const p=DATA.province.apbd_history["2026"], l=p.latest_change, y25=DATA.province.apbd_history["2025"].summary, t=DATA.province.tkdd_2024, a=DATA.aggregates.six_district_city_total_tkdd_2024;
 kpiRevenue.textContent=moneyB(p.initial.pendapatan.total/1e9);
 kpiExpense.textContent=moneyB(p.initial.belanja.total/1e9);
 kpiExpenseChange.textContent=moneyB(l.belanja);
 kpi2025Real.textContent=moneyB(y25.belanja_realization_billion);
 kpi2025Pct.textContent=y25.belanja_realization_pct+"% dari anggaran Rp"+y25.belanja_budget_billion.toLocaleString("id-ID")+" M";
 kpiTkdd.textContent=moneyM(a.realization_million);
 kpiTkddPct.textContent=a.realization_pct+"% dari anggaran "+moneyM(a.budget_million);
 kpiProvTkdd.textContent=moneyM(t.realization_million);
 kpiProvTkddPct.textContent=t.realization_pct+"% dari anggaran "+moneyM(t.budget_million);
 kpiDatasets.textContent=DATA.open_data.catalog.province_datasets+"+";
}
function render(){
 setKpis();
 const y=year.value, f=focus.value, rid=region.value, q=search.value.trim().toLowerCase();
 const selected=DATA.regions.find(r=>r.id===rid);
 renderSummary(y,f,selected,q); renderApbd(y); renderDistricts(rid,q); renderLatest(q); renderMarkers(rid,q);
}
function renderSummary(y,f,selected,q){
 let html="";
 if(f==="latest"){
  summarySubtitle.textContent="Indikator terbaru dari Open Data Gorontalo.";
  html=DATA.open_data.latest_indicators.filter(x=>!q||x.name.toLowerCase().includes(q)).slice(0,8).map(x=>`<div class="summary-row"><span>${esc(x.name)}</span><strong>${esc(x.value)} ${esc(x.unit)}</strong></div>`).join("");
 }else if(f==="tkdd"){
  summarySubtitle.textContent="TKDD 2024 — DJPK/SIKD.";
  const a=DATA.aggregates.six_district_city_total_tkdd_2024;
  html=`<div class="summary-row"><span>6 kabupaten/kota</span><strong>${moneyM(a.budget_million)}</strong></div><div class="summary-row"><span>Realisasi</span><strong>${moneyM(a.realization_million)}</strong></div><div class="summary-row"><span>Persentase</span><strong>${a.realization_pct}%</strong></div>`;
  if(selected) html+=`<div class="summary-row"><span>Wilayah terpilih</span><strong>${esc(selected.name)}</strong></div><div class="summary-row"><span>TKDD</span><strong>${moneyM(selected.budget_million)} → ${moneyM(selected.realization_million)}</strong></div>`;
 }else{
  summarySubtitle.textContent="APBD Provinsi Gorontalo "+y+".";
  if(y==="2026"){const p=DATA.province.apbd_history["2026"];html=`<div class="summary-row"><span>Pendapatan awal</span><strong>${moneyB(p.initial.pendapatan.total/1e9)}</strong></div><div class="summary-row"><span>Belanja awal</span><strong>${moneyB(p.initial.belanja.total/1e9)}</strong></div><div class="summary-row"><span>Belanja perubahan terbaru</span><strong>${moneyB(p.latest_change.belanja)}</strong></div><div class="summary-row"><span>Status</span><strong>Perubahan 2026 dilaporkan; cek Perda final</strong></div>`}
  else if(y==="2025"){const s=DATA.province.apbd_history["2025"].summary;html=`<div class="summary-row"><span>Pendapatan</span><strong>${moneyB(s.pendapatan_realization_billion)}</strong></div><div class="summary-row"><span>PAD</span><strong>${moneyB(s.pad_realization_billion)}</strong></div><div class="summary-row"><span>Belanja terealisasi</span><strong>${moneyB(s.belanja_realization_billion)}</strong></div><div class="summary-row"><span>SILPA</span><strong>${moneyB(s.silpa_billion)}</strong></div>`}
  else {const rows=DATA.province.apbd_history[y].rows; const r=rows.find(x=>x[0]==="Belanja Daerah"); html=`<div class="summary-row"><span>Belanja Daerah</span><strong>${moneyM(r[1])} → ${moneyM(r[2])}</strong></div><div class="summary-row"><span>Realisasi</span><strong>${r[3]}%</strong></div>`}
  if(y==="2026" && DATA.live_context){const c=DATA.live_context.djpb_regional_consolidated_may_2026;html+=`<div class="summary-row"><span>APBD konsolidasi regional s.d. Mei 2026</span><strong>${moneyB(c.belanja_realization_billion/1000)} (${c.belanja_realization_pct}%)</strong></div><div class="summary-row"><span>Catatan</span><strong>Bukan APBD Provinsi saja</strong></div>`}
 }
 summary.innerHTML=html||'<p>Tidak ada data yang cocok.</p>';
}
function renderApbd(y){
 const rows=[];
 if(y==="2026"){const p=DATA.province.apbd_history["2026"];rows.push(["2026","Pendapatan awal",p.initial.pendapatan.total/1e9,"Belum ada realisasi provinsi di snapshot","—","Perda 8/2025"]);rows.push(["2026","Belanja awal",p.initial.belanja.total/1e9,"Belum ada realisasi provinsi di snapshot","—","Perda 8/2025"]);rows.push(["2026","Pendapatan APBD-P terbaru",p.latest_change.pendapatan,"Angka perubahan dilaporkan","—","Laporan perubahan"]);rows.push(["2026","Belanja APBD-P terbaru",p.latest_change.belanja,"Angka perubahan dilaporkan","—","Laporan perubahan"])}
 if(y==="2025"){const s=DATA.province.apbd_history["2025"].summary;rows.push(["2025","Pendapatan",s.pendapatan_target_billion/1000,s.pendapatan_realization_billion/1000,s.pendapatan_realization_pct+"%","Realisasi 2025"]);rows.push(["2025","PAD",s.pad_target_billion/1000,s.pad_realization_billion/1000,s.pad_realization_pct+"%","Realisasi 2025"]);rows.push(["2025","Belanja Daerah",s.belanja_budget_billion/1000,s.belanja_realization_billion/1000,s.belanja_realization_pct+"%","Realisasi 2025"])}
 if(y==="2022"||y==="2023"){const rows0=DATA.province.apbd_history["2022"].rows;if(y==="2022")rows.push(...rows0.map(r=>[y,r[0],r[1],r[2],r[3]+"%","DJPK/SIKD"]))}
 apbdBody.innerHTML=rows.map(r=>`<tr><td>${r[0]}</td><td>${esc(r[1])}</td><td>${moneyB(r[2])}</td><td>${typeof r[3]==="number"?moneyB(r[3]):esc(r[3])}</td><td>${r[4]}</td><td>${esc(r[5])}</td></tr>`).join("");
}
function renderDistricts(rid,q){
 const rs=DATA.regions.filter(r=>(rid==="all"||r.id===rid)&&(!q||r.name.toLowerCase().includes(q)));
 districtBody.innerHTML=rs.map(r=>`<tr><td>${esc(r.name)}</td><td>${moneyM(r.budget_million)}</td><td>${moneyM(r.realization_million)}</td><td>${r.realization_pct}%</td><td><a target="_blank" rel="noopener" href="${r.source}">DJPK ↗</a></td></tr>`).join("");
}
function renderLatest(q){
 const rs=DATA.open_data.latest_indicators.filter(x=>!q||x.name.toLowerCase().includes(q));
 latestIndicators.innerHTML=rs.map(x=>`<div class="indicator"><b>${esc(x.name)}</b><span>${esc(x.value)} ${esc(x.unit)}</span><small>${esc(x.period)}</small></div>`).join("")||"<p>Tidak ada indikator yang cocok.</p>";
}
function renderMarkers(rid,q){
 markers.forEach(m=>m.remove());markers=[];
 DATA.regions.filter(r=>(rid==="all"||r.id===rid)&&(!q||r.name.toLowerCase().includes(q))).forEach(r=>{
  const m=L.marker([r.lat,r.lng]).addTo(map).bindPopup(`<b>${esc(r.name)}</b><br>TKDD 2024: ${moneyM(r.budget_million)}<br>Realisasi: ${moneyM(r.realization_million)} (${r.realization_pct}%)<br><a target="_blank" href="${r.source}">Sumber DJPK ↗</a>`);markers.push(m);
 });
}
function renderCoverage(){coverage.innerHTML=DATA.coverage.map(x=>`<div class="coverage ${x.status.includes("not")||x.status.includes("pending")||x.status.includes("belum")?"pending":"ok"}"><b>${esc(x.area)}</b><span>${esc(x.status)}</span><small>${esc(x.source)}</small></div>`).join("")}
function renderSources(){sources.innerHTML=DATA.sources.map(s=>`<a class="source-card" target="_blank" rel="noopener" href="${s.url}"><b>${esc(s.name)}</b><span>${esc(s.type)}</span><small>${esc(s.url)}</small></a>`).join("")}
document.addEventListener("DOMContentLoaded",load);
async function showAutoSync(){try{const r=await fetch("./data/auto_sync_status.json",{cache:"no-store"});if(!r.ok)return;const d=await r.json();const el=document.querySelector(".hero-actions");if(el){const t=document.createElement("span");t.className="pill";t.textContent="AUTO-SOURCE CHECK: "+new Date(d.checked_at).toLocaleString("id-ID");el.appendChild(t)}}catch(e){}}
showAutoSync();
