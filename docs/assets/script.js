async function loadJSON(path){const res=await fetch(path,{cache:'no-store'});if(!res.ok) throw new Error(`Failed to load ${path}`);return await res.json();}
function el(tag,attrs={},children=[]){const n=document.createElement(tag);Object.entries(attrs).forEach(([k,v])=>{if(k==='class') n.className=v;else n.setAttribute(k,v);});(Array.isArray(children)?children:[children]).forEach(c=>{if(c===null||c===undefined) return; if(typeof c==='string') n.appendChild(document.createTextNode(c)); else n.appendChild(c);});return n;}
function render(profile,projects){document.getElementById('name').textContent=profile.name;document.getElementById('title').textContent=profile.title;document.getElementById('meta').textContent=`${profile.location} · ${profile.phone} · ${profile.email}`;
const pills=document.getElementById('pills');pills.innerHTML='';(profile.skills||[]).slice(0,8).forEach(s=>pills.appendChild(el('span',{class:'pill'},s)));
document.getElementById('summary').textContent=profile.summary;
const links=document.getElementById('links');links.innerHTML='';(profile.links||[]).forEach(l=>links.appendChild(el('div',{},el('a',{href:l.url,target:'_blank',rel:'noreferrer'},l.label))));
const exp=document.getElementById('experience');exp.innerHTML='';(profile.experience||[]).forEach(x=>{const ul=el('ul',{class:'ul'},(x.bullets||[]).map(b=>el('li',{},b)));
exp.appendChild(el('div',{class:'section'},[el('div',{},[el('strong',{},`${x.company} — ${x.role}`),el('div',{class:'small'},x.dates)]),ul]));});
const edu=document.getElementById('education');edu.innerHTML='';(profile.education||[]).forEach(e=>edu.appendChild(el('div',{class:'small'},`${e.degree} · ${e.school} (${e.dates})`)));
const certs=document.getElementById('certs');certs.innerHTML='';(profile.certifications||[]).forEach(c=>certs.appendChild(el('div',{class:'small'},`• ${c}`)));
const pwrap=document.getElementById('projects');pwrap.innerHTML='';(projects||[]).forEach(p=>{const tags=el('div',{class:'stack'},(p.stack||[]).map(t=>el('span',{class:'tag'},t)));
const highlights=el('ul',{class:'ul'},(p.highlights||[]).map(h=>el('li',{},h)));
const link=p.repo?el('div',{class:'meta'},el('a',{href:p.repo,target:'_blank',rel:'noreferrer'},'View repo')):null;
pwrap.appendChild(el('div',{class:'project'},[el('h3',{},p.name),el('div',{class:'meta'},p.tagline||''),tags,highlights,link]));});}
(async function init(){try{const profile=await loadJSON('./data/profile.json');const projects=await loadJSON('./data/projects.json');render(profile,projects);}catch(err){console.error(err);document.getElementById('error').style.display='block';}})();
