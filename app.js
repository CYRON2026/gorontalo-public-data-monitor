let DATA=null;let map=null;let markers=[];

const rupiah=n=>n==null?"—":new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(n);
const pct=(a,b)=>b?((a/b)*100).toFixed(1)+"%":"—";

async function load(){
  DATA=await fetch("data/sample.json").then(r=>r.json());
  initMap();
  populateRegions();
  render();
}
function initMap(){
  map=L.map("map").setView([0.55,123.05],8);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:"© OpenStreetMap contributors"}).addTo(map);
}
function populateRegions(){
  const level=document.querySelector("#levelFilter").value;
  const sel=document.querySelector("#regionFilter");
  const current=sel.value;
  sel.innerHTML='<option value="all">Semua wilayah</option>';
  DATA.regions.filter(r=>level==="province"?r.level==="province":r.level===level).forEach(r=>{
    const o=document.createElement("option");o.value=r.id;o.textContent=r.name;sel.appendChild(o);
  });
  if([...sel.options].some(o=>o.value===current))sel.value=current;
}
function render(){
  const level=document.querySelector("#levelFilter").value;
  const regionId=document.querySelector("#regionFilter").value;
  const search=document.querySelector("#searchBox").value.toLowerCase();
  const regs=DATA.regions.filter(r=>(level==="province"?r.level==="province":r.level===level)&&(regionId==="all"||r.id===regionId));
  const selected=regionId==="all"?regs:regs;
  const budget=selected.reduce((s,r)=>s+r.budget,0),real=selected.reduce((s,r)=>s+r.realization,0);
  document.querySelector("#kpiBudget").textContent=rupiah(budget);
  document.querySelector("#kpiRealization").textContent=rupiah(real);
  document.querySelector("#kpiRealizationPct").textContent=pct(real,budget)+" terealisasi";

  let rows=DATA.procurement.filter(p=>!search||`${p.package} ${p.institution} ${p.region}`.toLowerCase().includes(search));
  document.querySelector("#kpiPackages").textContent=rows.length;
  const counts={normal:0,review:0,anomaly:0,unknown:0};rows.forEach(p=>counts[p.status]++);
  document.querySelector("#kpiFlags").textContent=counts.review+counts.anomaly;
  for(const k of Object.keys(counts))document.querySelector("#"+(k==="review"?"review":k)+"Count").textContent=counts[k];

  document.querySelector("#procurementBody").innerHTML=rows.map(p=>{
    const dev=p.benchmark?((p.value-p.benchmark)/p.benchmark*100):null;
    const label={normal:"Normal",review:"Perlu ditinjau",anomaly:"Anomali harga",unknown:"Tidak cukup data"}[p.status];
    return `<tr><td>${p.package}</td><td>${p.institution}</td><td>${p.region}</td><td>${rupiah(p.value)}</td><td>${rupiah(p.benchmark)}</td><td>${dev==null?"—":(dev>0?"+":"")+dev.toFixed(1)+"%"}</td><td><span class="badge ${p.status}">${label}</span></td></tr>`;
  }).join("");

  markers.forEach(m=>m.remove());markers=[];
  DATA.regions.filter(r=>r.level===level).forEach(r=>{
    const m=L.marker([r.lat,r.lng]).addTo(map).bindPopup(`<b>${r.name}</b><br>APBD: ${rupiah(r.budget)}<br>Realisasi: ${rupiah(r.realization)} (${pct(r.realization,r.budget)})`);
    markers.push(m);
  });
}
document.querySelector("#levelFilter").addEventListener("change",()=>{populateRegions();render()});
document.querySelector("#regionFilter").addEventListener("change",render);
document.querySelector("#searchBox").addEventListener("input",render);
document.querySelector("#yearFilter").addEventListener("change",()=>render());
document.querySelector("#resetBtn").addEventListener("click",()=>{document.querySelector("#levelFilter").value="province";populateRegions();document.querySelector("#regionFilter").value="all";document.querySelector("#searchBox").value="";render()});
load();
