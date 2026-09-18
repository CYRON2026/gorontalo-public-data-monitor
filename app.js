let DATA=null, map=null, markers=[];
const fmt = n => new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(n*1000000);
const pct = (a,b) => b ? ((a/b)*100).toFixed(2)+"%" : "—";
async function load(){
  const r=await fetch("./data/v2-data.json",{cache:"no-store"});
  DATA=await r.json();
  buildFilters(); initMap(); render();
}
function buildFilters(){
  const sel=document.querySelector("#region");
  sel.innerHTML='<option value="all">Semua wilayah</option>'+DATA.regions.map(r=>`<option value="${r.id}">${r.name}</option>`).join("");
}
function initMap(){
  map=L.map("map",{zoomControl:true}).setView([0.62,122.65],8);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:18,attribution:"© OpenStreetMap contributors"}).addTo(map);
  setTimeout(()=>map.invalidateSize(true),200);
  window.addEventListener("resize",()=>map.invalidateSize(true));
}
function render(){
  const year=+document.querySelector("#year").value;
  const level=document.querySelector("#level").value;
  const region=document.querySelector("#region").value;
  const q=document.querySelector("#search").value.trim().toLowerCase();
  const rows=DATA.regions.filter(r=>{
    if(level==="province") return false;
    if(region!=="all" && r.id!==region) return false;
    return !q || r.name.toLowerCase().includes(q);
  });
  const all=DATA.regions;
  const budget=all.reduce((s,r)=>s+r.budget_million,0);
  const real=all.reduce((s,r)=>s+r.realization_million,0);
  document.querySelector("#kpiBudget").textContent=fmt(budget);
  document.querySelector("#kpiReal").textContent=fmt(real);
  document.querySelector("#kpiPct").textContent=pct(real,budget)+" terealisasi";
  document.querySelector("#kpiDatasets").textContent=DATA.province.open_data_portal.datasets_landing;
  document.querySelector("#kpiSources").textContent=6;

  if(level==="province"){
    document.querySelector("#regionSummary").innerHTML=`
      <div class="summary-row"><span>Wilayah</span><strong>Provinsi Gorontalo</strong></div>
      <div class="summary-row"><span>APBD tahun snapshot</span><strong>${DATA.province.apbd.year}</strong></div>
      <div class="summary-row"><span>APBD anggaran</span><strong>${fmt(DATA.province.apbd.budget_million)}</strong></div>
      <div class="summary-row"><span>APBD realisasi</span><strong>${fmt(DATA.province.apbd.realization_million)}</strong></div>
      <div class="summary-row"><span>Persentase</span><strong>${DATA.province.apbd.realization_pct}%</strong></div>
      <div class="summary-row"><span>Catatan</span><strong style="max-width:260px">Snapshot APBD 2022; jangan diperlakukan sebagai angka APBD 2026.</strong></div>`;
  }else{
    const r=region==="all"?null:DATA.regions.find(x=>x.id===region);
    document.querySelector("#regionSummary").innerHTML=r?`
      <div class="summary-row"><span>Wilayah</span><strong>${r.name}</strong></div>
      <div class="summary-row"><span>Periode</span><strong>${r.period}</strong></div>
      <div class="summary-row"><span>TKDD anggaran</span><strong>${fmt(r.budget_million)}</strong></div>
      <div class="summary-row"><span>TKDD realisasi</span><strong>${fmt(r.realization_million)}</strong></div>
      <div class="summary-row"><span>Persentase</span><strong>${r.realization_pct}%</strong></div>
      <div class="summary-row"><span>Sumber</span><strong>DJPK/SIKD</strong></div>`:
      `<div class="summary-row"><span>Mode</span><strong>Semua Kabupaten/Kota</strong></div><div class="summary-row"><span>Total anggaran</span><strong>${fmt(budget)}</strong></div><div class="summary-row"><span>Total realisasi</span><strong>${fmt(real)}</strong></div><div class="summary-row"><span>Persentase agregat</span><strong>${pct(real,budget)}</strong></div>`;
  }

  const tableRows=rows.length?rows:all.filter(r=>!q||r.name.toLowerCase().includes(q));
  document.querySelector("#districtBody").innerHTML=tableRows.map(r=>`<tr><td><b>${r.name}</b><br><small>${r.id}</small></td><td>${fmt(r.budget_million)}</td><td>${fmt(r.realization_million)}</td><td>${r.realization_pct}%</td><td><a class="source-link" style="margin:0" target="_blank" rel="noopener" href="${r.source}">DJPK ↗</a></td></tr>`).join("");

  const pad=DATA.open_data_preview;
  document.querySelector("#padMeta").innerHTML=`<b>${pad.title}</b><br>Owner: ${pad.owner} · Update: ${pad.last_updated} · Kedalaman: ${pad.depth} · ${pad.rows_total} baris total (10 preview disimpan).`;
  document.querySelector("#padBody").innerHTML=pad.rows_preview.map(x=>`<tr><td>${x.category}</td><td>${rupiahFull(x.target)}</td><td>${rupiahFull(x.value)}</td><td>${x.percentage}%</td></tr>`).join("");

  markers.forEach(m=>m.remove()); markers=[];
  if(level!=="province"){
    DATA.regions.forEach(r=>{
      const m=L.marker([r.lat,r.lng]).addTo(map);
      m.bindPopup(`<b>${r.name}</b><br>TKDD 2024: ${fmt(r.budget_million)}<br>Realisasi: ${fmt(r.realization_million)} (${r.realization_pct}%)<br><a href="${r.source}" target="_blank">Sumber DJPK ↗</a>`);
      m.on("click",()=>{document.querySelector("#region").value=r.id; render();});
      markers.push(m);
    });
  }
}
function rupiahFull(n){return new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(n)}
document.querySelector("#year").addEventListener("change",render);
document.querySelector("#level").addEventListener("change",render);
document.querySelector("#region").addEventListener("change",render);
document.querySelector("#search").addEventListener("input",render);
document.querySelector("#reset").addEventListener("click",()=>{document.querySelector("#year").value="2024";document.querySelector("#level").value="kabupaten";document.querySelector("#region").value="all";document.querySelector("#search").value="";render();});
document.addEventListener("DOMContentLoaded",load);
