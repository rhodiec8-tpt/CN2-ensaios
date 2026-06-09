firebase.initializeApp({
  apiKey:"AIzaSyC3wOaIgCu0IcIlK0uFLFKjrO_0g7VoW2I",
  authDomain:"cn2-ensaios.firebaseapp.com",
  databaseURL:"https://cn2-ensaios-default-rtdb.firebaseio.com",
  projectId:"cn2-ensaios",
  storageBucket:"cn2-ensaios.firebasestorage.app",
  messagingSenderId:"995420612892",
  appId:"1:995420612892:web:89ebb461504d6fa0b3f2d9"
});
const auth=firebase.auth(), db=firebase.database(), ROOT="cn2";

let role="visitor", who="", songs=[], rehs=[], filt="all", lfilt="all", calView="list";
const EVT=new Date("2026-07-09T00:00:00-04:00");
const PRES_NAMES=["Rondiele","Naaliel","Tiago","Kaio","Sirley","Henrique","Débora","Maurício","Deivid","Daniel Souza","Cantores"];
const INSTR=[["baixo","🎸","Baixo"],["guitarra","🎸","Guitarra"],["teclado","🎹","Teclado"],["bateria","🥁","Bateria"],["percussao","🪘","Percussão"],["metal","🎺","Metal/Sopro"],["violao","🎸","Violão"],["vocal","🎤","Vocal"]];
function ytId(u){if(!u)return"";const m=String(u).match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([A-Za-z0-9_-]{11})/);return m?m[1]:"";}
const C={quinta:{d:"Quinta 09/07",s:"Dept. Juvenil",r:"Sem Rondiele",in:false},sexta:{d:"Sexta 10/07",s:"Senhores e Senhoras",r:"Rondiele · Baixo",in:true},sabado:{d:"Sábado 11/07",s:"Crianças",r:"Rondiele · Baixo + Metal",in:true},domingo:{d:"Domingo 12/07",s:"Daniel Souza · Todos",r:"Rondiele · Baixo + Metal",in:true}};
const CO=["quinta","sexta","sabado","domingo"];
const FARDA=[
  {t:"Passeata",d:"04/06",items:[["Blusa Comemorativa",1],["Calça Jeans",0]]},
  {t:"Quinta",d:"09/07",items:[["Blusa Social Preta",0],["Calça Social Preta",0],["Sapato Social Preto",0]]},
  {t:"Sexta",d:"10/07",items:[["Blusa Social Branca",0],["Calça Social Preta",0],["Sapato Social Preto",0],["Gravata Verde",1]]},
  {t:"Sábado",d:"11/07",items:[["Blusa Esportiva Preta",0],["Calça Esportiva Preta",0]]},
  {t:"Domingo Manhã",d:"12/07",items:[["Blusa Comemorativa",1],["Calça Social Preta",0],["Sapato Social Preto",0]]},
  {t:"Domingo Noite",d:"12/07",items:[["Blusa Social Branca",0],["Calça Social Preta",0],["Sapato Social Preto",0],["Gravata Verde",1]]}
];
const EQ=[
  {c:"Quinta 09/07",s:"Departamento Juvenil",e:[["Teclado","Naaliel"],["Bateria","Tiago"],["Guitarra","Kaio"],["Baixo","Sirley"],["Percussão","Henrique"]]},
  {c:"Sexta 10/07",s:"Senhores e Senhoras",e:[["Teclado","Débora"],["Bateria","Tiago"],["Guitarra","Maurício"],["Baixo","Rondiele"],["Percussão","Deivid"],["Metal","Sirley"]]},
  {c:"Sábado 11/07",s:"Crianças",e:[["Teclado","Naaliel"],["Bateria","Tiago"],["Guitarra","Kaio"],["Baixo","Rondiele e Sirley"],["Percussão","Henrique"],["Metal","Rondiele e Sirley"]]},
  {c:"Domingo 12/07",s:"Daniel Souza",e:[["Todos","Toda a equipe"]]}
];

/* Escalação por instrumento em cada dia (culto -> chave do instrumento -> quem toca).
   As chaves seguem INSTR: baixo, guitarra, teclado, bateria, percussao, metal, violao, vocal */
const EQ_INSTR={
  quinta:{teclado:"Naaliel",bateria:"Tiago",guitarra:"Kaio",baixo:"Sirley",percussao:"Henrique"},
  sexta:{teclado:"Débora",bateria:"Tiago",guitarra:"Maurício",baixo:"Rondiele",percussao:"Deivid",metal:"Sirley"},
  sabado:{teclado:"Naaliel",bateria:"Tiago",guitarra:"Kaio",baixo:"Rondiele e Sirley",percussao:"Henrique",metal:"Rondiele e Sirley"},
  domingo:{baixo:"Toda a equipe",guitarra:"Toda a equipe",teclado:"Toda a equipe",bateria:"Toda a equipe",percussao:"Toda a equipe",metal:"Toda a equipe",violao:"Toda a equipe",vocal:"Toda a equipe"}
};

function defSongs(){
  const r=[["Heróis da Fé","Rozeane Ribeiro (Coral)","quinta"],["Es Bem Vindo","Israel Salazar","quinta"],["Resistência","Kemilly Santos e Kailane Frauches","quinta"],["Medley Harpa (Pandeiro)","Harpa Cristã","sexta"],["A Igreja Tem que Marchar","Michele Giarola","sexta"],["Nossos Frutos","Vanilda Bordieri (Coral)","sexta"],["Medley: Um Só Deus + Povo Escolhido","Frutos do Espírito","sexta"],["Graça","Crianças","sabado"],["Cristo Ungido de Deus","Victor Valente","sabado"],["O Nosso General é Cristo","Infantil","sabado"],["40 Anos Cidade Nova 2","Composição CN2","sabado"],["Deus de Obras Completas","Kemilly Santos","sabado"],["Faremos Menção no Nome do Senhor","Daniel Souza","domingo"],["Medley Alegria","Daniel Souza","domingo"],["A Alegria","Daniel Souza","domingo"],["Jesus Riscou a Cédula","Daniel Souza","domingo"],["Todo Poder Pertence a Jesus","Daniel Souza","domingo"],["Jesus é o Rei da Glória","Daniel Souza","domingo"],["Te Louvarei","Daniel Souza","domingo"],["Toma o Teu Lugar","Daniel Souza","domingo"],["Declaramos a Glória do Senhor","Daniel Souza","domingo"],["Deus é meu Refúgio","Daniel Souza","domingo"],["Eu Quero Ser uma Benção","Daniel Souza","domingo"],["Corpo e Família","Daniel Souza","domingo"],["Perdão","Daniel Souza","domingo"]];
  const VID={"A Igreja Tem que Marchar":"https://www.youtube.com/watch?v=NoSfBKC7H9U","Faremos Menção no Nome do Senhor":"https://www.youtube.com/watch?v=ufSUZuOn7pw","Jesus é o Rei da Glória":"https://www.youtube.com/watch?v=Wi6DbYfWJUk","Toma o Teu Lugar":"https://www.youtube.com/watch?v=IhATFFYJbC8","Corpo e Família":"https://www.youtube.com/watch?v=luTCEorzsy4","Eu Quero Ser uma Benção":"https://www.youtube.com/watch?v=OfnECKjnZPw"};
  const o={};r.forEach((x,i)=>{const id="s"+(i+1);o[id]={id,title:x[0],artist:x[1],culto:x[2],order:i,videoUrl:(VID[x[0]]||""),youtube:"https://www.youtube.com/results?search_query="+encodeURIComponent(x[0]+" "+x[1]),cifraUrl:"https://www.google.com/search?q="+encodeURIComponent("cifra "+x[0]+" "+x[1]),cifraTxt:"",letraTxt:"",tom:"",notes:""};});
  return o;
}
function defRehs(){
  const r=[["2026-05-30","Sáb","16:00–18:00","Músicos",0],["2026-06-03","Qua","19:30–22:00","Músicos",0],["2026-06-07","Dom","08:30–11:30","Músicos + Guia",0],["2026-06-10","Qua","19:30–22:00","Músicos + Guia",0],["2026-06-14","Dom","08:30–11:30","Músicos + Vocal",0],["2026-06-17","Qua","19:30–22:00","Músicos + Vocal",0],["2026-06-21","Dom","08:30–11:30","Músicos + Vocal + Dança",0],["2026-06-24","Qua","19:30–22:00","Músicos + Vocal + Dança",0],["2026-06-28","Dom","08:30–11:30","Ensaio com todos",0],["2026-07-01","Qua","19:30–22:00","Ensaio com todos",0],["2026-07-05","Dom","08:30–11:30","ENSAIO GERAL",1]];
  const o={};r.forEach((x,i)=>{const id="r"+(i+1);o[id]={id,date:x[0],dow:x[1],time:x[2],label:x[3],gen:x[4],order:i,marked:{},present:{}};});
  return o;
}

function openForm(t){document.getElementById("lgOpts").style.display="none";document.getElementById("fMaster").classList.add("show");setTimeout(()=>{const i=document.getElementById("masterPass");if(i)i.focus();},50);}
function closeForm(){document.querySelectorAll(".lform").forEach(f=>f.classList.remove("show"));document.getElementById("lgOpts").style.display="flex";document.querySelectorAll(".lf-err").forEach(e=>e.textContent="");const i=document.getElementById("masterPass");if(i)i.value="";}
const MASTER_EMAIL="levita@cn2admin.app";
async function loginMaster(){
  const p=document.getElementById("masterPass").value,b=document.getElementById("masterGo"),er=document.getElementById("masterErr");
  if(!p){er.textContent="Digite a senha";return;}
  b.disabled=true;er.textContent="Entrando…";
  try{
    await auth.signInWithEmailAndPassword(MASTER_EMAIL,p);
    role="admin";who="Levita CN2";
    await ensureSeed();
    startApp();
  }catch(e){er.textContent=authMsg(e);b.disabled=false;}
}
function enterVisitor(){role="visitor";who="";startApp();}
function logout(){auth.signOut().catch(()=>{});location.reload();}
function authMsg(e){const c=(e&&e.code)||"";if(c.includes("wrong-password")||c.includes("invalid-credential"))return"Senha incorreta";if(c.includes("user-not-found"))return"Conta ainda não criada no Firebase";if(c.includes("network"))return"Sem conexão";if(c.includes("too-many"))return"Muitas tentativas, aguarde um momento";return"Erro ao entrar";}
async function ensureSeed(){
  try{
    const s=await db.ref(ROOT+"/songs").once("value");
    if(!s.exists()){
      await db.ref(ROOT).update({songs:defSongs(),rehs:defRehs(),meta:{eventDate:"2026-07-09",created:Date.now()}});
      toast("Dados iniciais carregados ✓");
      return;
    }
    // migração: preenche videoUrl oficial nas músicas que ainda não têm, sem apagar nada existente
    const cur=s.val(),def=defSongs(),defByTitle={};Object.values(def).forEach(d=>{defByTitle[d.title]=d;});
    const up={};let n=0;
    Object.values(cur).forEach(song=>{
      if(!song||!song.title)return;
      const d=defByTitle[song.title];
      if(d&&d.videoUrl&&!(song.videoUrl&&String(song.videoUrl).trim())){up[`${ROOT}/songs/${song.id}/videoUrl`]=d.videoUrl;n++;}
    });
    if(n){await db.ref().update(up);toast(n+" vídeos adicionados ✓");}
  }catch(e){}
}

function startApp(){
  document.getElementById("login").style.display="none";
  document.getElementById("app").style.display="block";
  const b=document.getElementById("badge");
  if(role==="admin"){b.textContent="🎸 "+who;b.className="badge b-adm";}
  else if(role==="editor"){b.textContent=who;b.className="badge b-mus";}
  else{b.textContent="👁 VISITANTE";b.className="badge b-vis";}
  document.querySelector("header.top").classList.add("compact");
  listen();
  drawIcons();
}
function listen(){
  db.ref(ROOT+"/songs").on("value",s=>{const d=s.val();songs=d?Object.values(d).sort((a,b)=>(a.order||0)-(b.order||0)):Object.values(defSongs());renderAll();},()=>toast("Erro ao carregar músicas","err"));
  db.ref(ROOT+"/rehs").on("value",s=>{const d=s.val();rehs=d?Object.values(d).sort((a,b)=>(a.order||0)-(b.order||0)):Object.values(defRehs());renderAll();},()=>toast("Erro ao carregar ensaios","err"));
}

const esc=s=>String(s==null?"":s).replace(/[&<>"]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m]));
const mlen=o=>o?Object.keys(o).length:0;
const cnt=id=>rehs.reduce((n,r)=>n+(r.marked&&r.marked[id]?1:0),0);
const sts=c=>c<=0?["r","Não ensaiada"]:c<3?["a","Em andamento"]:["g","Pronta"];
const canEdit=()=>role==="admin"||role==="editor";
let tT;function toast(m,k){const t=document.getElementById("toast");t.textContent=m;t.className="toast show"+(k==="err"?" err":"");clearTimeout(tT);tT=setTimeout(()=>t.className="toast"+(k==="err"?" err":""),2300);}

/* ===== Negrito: renderiza **texto** como <b>texto</b> ===== */
function renderBold(s){return s.replace(/\*\*([^*\n]+)\*\*/g,'<b>$1</b>');}

/* ===== Barra de formatação para textarea ===== */
function insertBold(taId){
  const ta=document.getElementById(taId);if(!ta)return;
  const s=ta.selectionStart,e=ta.selectionEnd;
  const sel=ta.value.substring(s,e)||"texto";
  const before=ta.value.substring(0,s),after=ta.value.substring(e);
  ta.value=before+"**"+sel+"**"+after;
  ta.selectionStart=s+2;ta.selectionEnd=s+2+sel.length;
  ta.focus();
}
function fmtBar(taId){
  return `<div class="fmt-bar"><button class="fmt-btn bold-b" onclick="insertBold('${taId}')" title="Negrito"><b>B</b> Negrito</button><span class="fmt-hint">selecione um trecho e toque em Negrito</span></div>`;
}
/* Monta toolbar + textarea integrados num único bloco (visual de editor) */
function editArea(taId,value,placeholder,extraClass){
  return `<div class="fmt-wrap">${fmtBar(taId)}<textarea class="ta ${extraClass||""}" id="${taId}" placeholder="${placeholder}">${esc(value||"")}</textarea></div>`;
}

/* ===== Teleprompter ===== */
/* ===== TELEPROMPTER TELA CHEIA (modo palco) =====
   Slider 0..100 mapeado para px/segundo, com curva suave.
   Lento de verdade na esquerda; rápido controlado na direita. */
let _tpRAF=null,_tpPlaying=false,_tpLast=null,_tpAcc=0;
/* mapeia 0..100 -> px/s. Curva: 0=2px/s (bem lento), 50≈12px/s (médio), 100≈34px/s (rápido) */
function tpSpeedPxPerSec(){
  const r=document.getElementById("tpFullRange");
  const v=r?parseFloat(r.value):22;        // 0..100
  const t=v/100;                            // 0..1
  // curva quadrática suave: começa bem devagar e acelera no fim
  return 2 + (32 * t * t);                  // 2 .. 34 px/s
}
function tpOpenFull(id,kind){               // kind: 'cifra' | 'letra'
  const s=songs.find(x=>x.id===id);if(!s)return;
  const txt=kind==="letra"?(s.letraTxt||""):(s.cifraTxt||"");
  if(!txt.trim())return;
  document.getElementById("tpFullTitle").textContent=(kind==="letra"?"🎤 ":"🎸 ")+s.title+(s.tom&&kind!=="letra"?"  ·  Tom: "+s.tom:"");
  document.getElementById("tpFullPre").innerHTML=renderBold(esc(txt));
  document.getElementById("tpFullScroll").scrollTop=0;
  document.getElementById("tpFull").classList.add("show");
  document.body.style.overflow="hidden";
  _tpPlaying=false;_tpAcc=0;_tpLast=null;
  const pb=document.getElementById("tpFullPlay");pb.textContent="▶";pb.classList.remove("on");
}
function tpCloseFull(){
  _tpPlaying=false;
  if(_tpRAF){cancelAnimationFrame(_tpRAF);_tpRAF=null;}
  document.getElementById("tpFull").classList.remove("show");
  document.body.style.overflow="";
}
function tpTogglePlay(){
  const pb=document.getElementById("tpFullPlay");
  if(_tpPlaying){
    _tpPlaying=false;pb.textContent="▶";pb.classList.remove("on");
    if(_tpRAF){cancelAnimationFrame(_tpRAF);_tpRAF=null;}
  }else{
    _tpPlaying=true;pb.textContent="⏸";pb.classList.add("on");
    _tpLast=null;
    _tpRAF=requestAnimationFrame(tpTick);
  }
}
function tpTick(ts){
  if(!_tpPlaying)return;
  const sc=document.getElementById("tpFullScroll");if(!sc){return;}
  if(_tpLast===null)_tpLast=ts;
  const dt=(ts-_tpLast)/1000;_tpLast=ts;
  _tpAcc+=tpSpeedPxPerSec()*dt;
  if(_tpAcc>=1){const mv=Math.floor(_tpAcc);sc.scrollTop+=mv;_tpAcc-=mv;}
  if(sc.scrollTop+sc.clientHeight>=sc.scrollHeight-2){     // chegou ao fim
    _tpPlaying=false;const pb=document.getElementById("tpFullPlay");pb.textContent="▶";pb.classList.remove("on");return;
  }
  _tpRAF=requestAnimationFrame(tpTick);
}
function tpSpeedChanged(){ /* a curva é lida ao vivo no tick; nada a fazer aqui */ }
function tpRestart(){
  const sc=document.getElementById("tpFullScroll");if(sc)sc.scrollTop=0;
}

function renderAll(){renderDash();renderCal();renderSongs();renderLetras();renderFarda();renderEquipe();cd();drawIcons();}
/* (re)desenha os ícones Lucide depois que o app monta as telas dinâmicas */
function drawIcons(){ if(window.lucide&&lucide.createIcons){ try{ lucide.createIcons(); }catch(e){} } }

function renderDash(){
  const tot=songs.length,ens=songs.filter(s=>cnt(s.id)>0).length,pr=songs.filter(s=>cnt(s.id)>=3).length,done=rehs.filter(r=>mlen(r.marked)>0).length;
  const days=Math.ceil((EVT-new Date())/864e5),daysTxt=days>0?days:days===0?"Hoje":"🎉";
  document.getElementById("dStats").innerHTML=[["",tot,"músicas"],["g",ens,"ensaiadas"],["a",pr,"prontas"],["",done+"/"+rehs.length,"ensaios"],["r",daysTxt,"dias p/ evento"]].map(s=>`<div class="st ${s[0]}"><div class="n">${s[1]}</div><div class="l">${s[2]}</div></div>`).join("");
  const pct=tot?Math.round(pr/tot*100):0;document.getElementById("ringC").style.strokeDashoffset=125.6-125.6*pct/100;document.getElementById("ringP").textContent=pct+"%";document.getElementById("ringV").innerHTML=pr+"/"+tot+" prontas";
  document.getElementById("chipDays").textContent=daysTxt;document.getElementById("chipReady").textContent=pr+"/"+tot;
  document.getElementById("dCulto").innerHTML=CO.map(c=>{const l=songs.filter(s=>s.culto===c),e=l.filter(s=>cnt(s.id)>0).length,p=l.length?Math.round(e/l.length*100):0;return `<div class="pb"><div class="pl"><span class="pn">${C[c].d} <small>· ${C[c].s}</small></span><span class="pv">${e}/${l.length} · ${p}%</span></div><div class="bar"><span style="width:${p}%"></span></div></div>`;}).join("");
  const today=new Date();today.setHours(0,0,0,0);
  const up=rehs.filter(r=>new Date(r.date+"T23:59:00-04:00")>=today).slice(0,3);
  document.getElementById("dNext").innerHTML=up.length?up.map(r=>{const dt=new Date(r.date+"T12:00:00-04:00"),d=String(dt.getDate()).padStart(2,"0"),M=["jan","fev","mar","abr","mai","jun","jul"][dt.getMonth()],nm=mlen(r.marked);return `<div class="nx" onclick="goReh('${r.id}')"><div class="nx-d"><b>${d}</b>${M}</div><div class="nx-m"><div class="nx-t">${esc(r.label)}</div><div class="nx-s">${r.dow} · ${r.time}</div></div>${r.gen?'<span class="pill pill-a">Geral</span>':nm?`<span class="pill pill-g">${nm} ✓</span>`:'<span class="pill pill-b">A marcar</span>'}</div>`;}).join(""):`<div class="good"><span class="e">🎉</span>Todos os ensaios já aconteceram!</div>`;
  const rk=[...songs].map(s=>({s,c:cnt(s.id)})).sort((a,b)=>b.c-a.c),mx=Math.max(1,...rk.map(r=>r.c));
  document.getElementById("dRank").innerHTML=rk.map(({s,c})=>{const[sc]=sts(c),col=sc==="g"?"var(--gb)":sc==="a"?"var(--amber)":"var(--red)";return `<div class="rk"><div class="rn">${esc(s.title)}</div><div class="rb"><span style="width:${c?Math.max(7,c/mx*100):3}%;background:${col}"></span></div><div class="rv">${c}×</div></div>`;}).join("");
  const pres={};rehs.forEach(r=>{Object.keys(r.present||{}).forEach(n=>{pres[n]=(pres[n]||0)+1;});});
  const pk=Object.entries(pres).sort((a,b)=>b[1]-a[1]);
  document.getElementById("dPres").innerHTML=pk.length?pk.map(([n,c])=>`<div class="pc"><span class="nm">${esc(n)}</span><span class="ct">${c}×</span></div>`).join(""):`<div class="empty-txt">Nenhuma presença registrada ainda.</div>`;
  const nv=songs.filter(s=>cnt(s.id)===0);
  document.getElementById("dAlert").innerHTML=nv.length?nv.map(s=>`<div class="al"><span class="ad"></span><span class="an">${esc(s.title)}</span><span class="ac">${C[s.culto].d}</span></div>`).join(""):`<div class="good"><span class="e">🎉</span>Todas as músicas já foram ensaiadas!</div>`;
}
function goReh(id){document.querySelector('.tab[data-t="cal"]').click();setTimeout(()=>{const ev=document.querySelector(`.ev[data-r="${id}"]`);if(ev){if(!ev.classList.contains("open"))tEv(id);ev.scrollIntoView({behavior:"smooth",block:"center"});}},80);}

function renderCal(){renderCalList();renderCalGrid();}
function renderCalList(){
  const today=new Date();today.setHours(0,0,0,0);
  const openIds=[...document.querySelectorAll(".ev.open")].map(e=>e.dataset.r);
  document.getElementById("calList").innerHTML=rehs.map(r=>{
    const dt=new Date(r.date+"T12:00:00-04:00"),d=String(dt.getDate()).padStart(2,"0"),M=["JAN","FEV","MAR","ABR","MAI","JUN","JUL"][dt.getMonth()];
    const nm=mlen(r.marked),np=mlen(r.present);
    let pill=nm>0?`<span class="pill pill-g">✓ ${nm} ensaiadas</span>`:r.gen?`<span class="pill pill-a">Ensaio geral</span>`:dt<today?`<span class="pill pill-b">Sem marcação</span>`:"";
    return `<div class="ev ${r.gen?'gen':''}" data-r="${r.id}"><div class="ev-h" onclick="tEv('${r.id}')">
      <div class="ev-d"><div class="dd">${d}</div><div class="dm">${M}</div></div>
      <div class="ev-m"><div class="et">${esc(r.label)}</div><div class="em">${r.dow} · ${r.time}</div>${pill}</div>
      <div class="ev-x"><span class="xn">🎵 ${nm}</span>${np?`<span class="xn">🙋 ${np}</span>`:""}<span class="chev"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M6 9l6 6 6-6"/></svg></span></div>
    </div><div class="ev-b" id="eb-${r.id}"><div class="ev-bi">${rehBody(r)}</div></div></div>`;
  }).join("");
  openIds.forEach(id=>{const ev=document.querySelector(`.ev[data-r="${id}"]`),b=document.getElementById("eb-"+id);if(ev&&b){ev.classList.add("open");b.style.maxHeight="none";}});
}
function rehBody(r){
  let h="";
  if(canEdit()){
    // check-in pessoal: o músico marca a SUA presença neste dia
    if(who&&who!=="Cantores"){
      const meOn=r.present&&r.present[who];
      h+=`<div class="pres-day"><div class="pres-day-l">Sua presença neste ensaio</div>
        <div class="pres-self"><div class="pself-i">${meOn?`<span class="pself-tag">✓ Presença confirmada</span>`:`Olá, <b>${esc(who)}</b> — você vem neste ensaio?`}</div>
        ${meOn?`<button class="pself-btn pself-out" onclick="selfPres('${r.id}',0)">Cancelar</button>`:`<button class="pself-btn pself-in" onclick="selfPres('${r.id}',1)">✓ Confirmar presença</button>`}</div></div>`;
    }
    // lista completa (todos) — útil para o líder/admin marcar quem veio
    h+=`<div class="pres"><div class="pres-t">🙋 Quem está presente (todos)</div><div class="pres-g">`;
    h+=PRES_NAMES.map(n=>`<button class="pbtn ${r.present&&r.present[n]?'on':''}" onclick="tPres('${r.id}','${esc(n)}')">${esc(n)}</button>`).join("");
    h+=`</div></div>`;
    h+=`<div class="qbtns"><button class="qb" onclick="markAll('${r.id}',1)">Marcar todas</button><button class="qb" onclick="markAll('${r.id}',0)">Limpar músicas</button></div>`;
  }
  CO.forEach(c=>{const l=songs.filter(s=>s.culto===c);if(!l.length)return;h+=`<div class="grp">${C[c].d}</div>`+l.map(s=>{const on=r.marked&&r.marked[s.id];return `<label class="chk"><input type="checkbox" ${on?"checked":""} ${canEdit()?"":"disabled"} onchange="tSong('${r.id}','${s.id}',this.checked)"><span class="cn">${esc(s.title)}</span><span class="cc">${cnt(s.id)}×</span></label>`;}).join("");});
  return h;
}
function tEv(id){const ev=document.querySelector(`.ev[data-r="${id}"]`),b=document.getElementById("eb-"+id);const o=ev.classList.toggle("open");if(o){b.style.maxHeight=b.scrollHeight+"px";setTimeout(()=>{if(ev.classList.contains("open"))b.style.maxHeight="none";},360);}else{b.style.maxHeight=b.scrollHeight+"px";requestAnimationFrame(()=>{b.style.maxHeight="0";});}}
function tSong(rid,sid,ck){if(!canEdit())return;db.ref(`${ROOT}/rehs/${rid}/marked/${sid}`).set(ck?true:null).catch(()=>toast("Erro ao salvar","err"));}
function tPres(rid,name){if(!canEdit())return;const r=rehs.find(x=>x.id===rid),on=r.present&&r.present[name];db.ref(`${ROOT}/rehs/${rid}/present/${name}`).set(on?null:true).then(()=>toast(on?name+" removido":name+" presente ✓")).catch(()=>toast("Erro ao salvar","err"));}
function selfPres(rid,go){if(!canEdit()||!who)return;db.ref(`${ROOT}/rehs/${rid}/present/${who}`).set(go?true:null).then(()=>toast(go?"Presença confirmada ✓":"Presença cancelada")).catch(()=>toast("Erro ao salvar — verifique seu login","err"));}
function markAll(rid,v){if(!canEdit())return;const o={};if(v)songs.forEach(s=>o[s.id]=true);db.ref(`${ROOT}/rehs/${rid}/marked`).set(v?o:null).then(()=>toast(v?"Todas marcadas ✓":"Músicas limpas")).catch(()=>toast("Erro ao salvar","err"));}
function renderCalGrid(){
  const today=new Date();today.setHours(0,0,0,0);
  const months=[[2026,5,"Junho"],[2026,6,"Julho"]];
  const byDate={};rehs.forEach(r=>byDate[r.date]={...r,done:mlen(r.marked)>0});
  const culto={"2026-07-09":1,"2026-07-10":1,"2026-07-11":1,"2026-07-12":1};
  const html=months.map(([y,m,nm])=>{
    const days=new Date(y,m+1,0).getDate();let dow=(new Date(y,m,1).getDay()+6)%7,cells="";
    for(let i=0;i<dow;i++)cells+=`<div class="dc"></div>`;
    for(let d=1;d<=days;d++){const ds=`${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`,reh=byDate[ds],ic=culto[ds],dt=new Date(y,m,d);let cl="dc",lab="";if(ic){cl+=" culto";lab="CULTO";}else if(reh){if(reh.done)cl+=" done";else if(dt.getTime()===today.getTime())cl+=" today";else cl+=" has";lab=reh.time.split("–")[0];}cells+=`<div class="${cl}"><span class="dn">${d}</span>${lab?`<span class="dl">${lab}</span>`:""}</div>`;}
    return `<div class="mon"><div class="mon-n">${nm} 2026</div><div class="dow"><div>S</div><div>T</div><div>Q</div><div>Q</div><div>S</div><div>S</div><div>D</div></div><div class="dg">${cells}</div></div>`;
  }).join("");
  document.getElementById("calGrid").innerHTML=`<div class="cal-months">${html}</div><div class="cal-leg"><span><i style="background:rgba(40,90,140,.25)"></i>Agendado</span><span><i style="background:var(--gb)"></i>Realizado</span><span><i style="background:var(--amber)"></i>Hoje</span><span><i style="background:var(--gold)"></i>Culto</span></div>`;
}

function renderSongs(){
  document.getElementById("songF").innerHTML=[["all","Todas",songs.length]].concat(CO.map(c=>[c,C[c].d,songs.filter(s=>s.culto===c).length])).map(([k,l,n])=>`<button class="fb ${k===filt?'active':''}" onclick="setF('${k}')">${l}<span class="fn">${n}</span></button>`).join("");
  const cs=filt==="all"?CO:[filt];
  let addBox="";
  if(role==="admin"){
    addBox=`<details class="addsong" id="addBox"><summary>＋ Adicionar música</summary>
      <div class="addgrid">
        <input class="tinput" id="ns-title" placeholder="Nome da música *">
        <input class="tinput" id="ns-artist" placeholder="Artista / referência">
        <select class="lf-s" id="ns-culto">${CO.map(c=>`<option value="${c}">${C[c].d} · ${C[c].s}</option>`).join("")}</select>
        <input class="tinput" id="ns-tom" placeholder="Tom (opcional)">
      </div>
      <div class="tsave"><button id="ns-go" onclick="addSong()">Adicionar ao repertório</button><span class="ti">só o admin vê isto</span></div>
    </details>`;
  }
  document.getElementById("songL").innerHTML=addBox+cs.map(c=>{const l=songs.filter(s=>s.culto===c);if(!l.length)return"";return `<div class="cblk"><div class="chd"><div><div class="cd-d">${C[c].d}</div><div class="cd-s">${C[c].s}</div></div></div>${l.map(songCard).join("")}</div>`;}).join("");
}
function songCard(s){
  const c=cnt(s.id),[sc,sl]=sts(c),ce=canEdit();
  const np=s.parts?Object.values(s.parts).filter(x=>x&&x.trim()).length:0;
  return `<div class="song"><div class="s-top"><span class="sdot sd-${sc}"></span>
    <div class="s-info"><div class="nm">${esc(s.title)}</div><div class="ar">${esc(s.artist)}</div>
      <div class="s-tags"><span class="s-tag">${sl}</span>${s.tom?`<span class="s-tag">Tom: ${esc(s.tom)}</span>`:""}</div></div>
    <div class="s-cnt"><div class="v">${c}</div><div class="l">ensaios</div></div></div>
    <div class="s-act"><button class="sa yt" onclick="openYt('${s.id}')"><i data-lucide="tv-minimal-play"></i> Vídeo</button><button class="sa inst" onclick="openPart('${s.id}')"><i data-lucide="music-4"></i> Instrumentos${np?`<span class="badge-n">${np}</span>`:""}</button><a class="sa cf" href="${esc(s.cifraUrl)}" target="_blank"><i data-lucide="file-text"></i> Cifra online</a></div>
    ${s.notes?`<div class="note"><i data-lucide="pin"></i> ${esc(s.notes)}</div>`:""}
    ${s.cifraTxt?`<button class="tp-card" onclick="tpOpenFull('${s.id}','cifra')"><span class="tp-card-ic"><i data-lucide="scroll-text"></i></span><span class="tp-card-tx"><b>Teleprompter</b><small>Cifra em tela cheia</small></span><i data-lucide="chevron-right" class="tp-card-go"></i></button>`:""}
    ${ce?`<details class="ed"><summary>Editar cifra, tom, vídeo e notas</summary>
      <input class="tinput" id="tom-${s.id}" value="${esc(s.tom)}" placeholder="Tom (ex: E, Gm, capotraste 2ª)">
      <input class="tinput" id="nt-${s.id}" value="${esc(s.notes)}" placeholder="Notas (ex: atenção na virada)">
      ${role==="admin"?`<input class="tinput" id="vid-${s.id}" value="${esc(s.videoUrl||"")}" placeholder="Link do vídeo YouTube (cole p/ abrir dentro do app)">`:""}
      ${editArea("cf-"+s.id,s.cifraTxt,"Cifra geral da música... Use **palavra** para negrito")}
      <div class="tsave"><button id="cfb-${s.id}" onclick="saveCifra('${s.id}')">Salvar</button><span class="ti">edição do Levita CN2</span></div>
      ${role==="admin"?`<button class="del-song" onclick="delSong('${s.id}','${esc(s.title).replace(/'/g,"")}')"><i data-lucide="trash-2"></i> Excluir música</button>`:""}</details>`
    :(s.cifraTxt?`<button class="read-full" onclick="this.nextElementSibling.classList.remove('hidden');this.style.display='none'"><i data-lucide="file-text"></i> Ver cifra geral</button>
      <div class="hidden"><pre class="read-pre" style="margin:8px 0 0">${renderBold(esc(s.cifraTxt))}</pre></div>`:"")}
  </div>`;
}
function setF(f){filt=f;renderSongs();}
function saveCifra(id){
  if(!canEdit())return;const b=document.getElementById("cfb-"+id);b.disabled=true;
  const u={cifraTxt:document.getElementById("cf-"+id).value,tom:document.getElementById("tom-"+id).value,notes:document.getElementById("nt-"+id).value};
  const vidEl=document.getElementById("vid-"+id);if(vidEl)u.videoUrl=vidEl.value.trim();
  db.ref(`${ROOT}/songs/${id}`).update(u).then(()=>toast("Cifra salva ✓")).catch(()=>toast("Erro ao salvar — verifique seu login","err")).finally(()=>{b.disabled=false;});
}

/* ===== YouTube mini-player ===== */
let _ytVideoVisible = false;
function openYt(id){
  const s=songs.find(x=>x.id===id);if(!s)return;
  const vid=ytId(s.videoUrl)||ytId(s.youtube);
  document.getElementById("ytTitle").textContent=s.title;
  document.getElementById("ytAudioTitle").textContent="🎵 "+s.title+(s.artist?" · "+s.artist:"");
  const open=document.getElementById("ytOpen");
  const frame=document.getElementById("ytFrame");
  const pane=document.getElementById("ytContentPane");
  const noContent=document.getElementById("ytNoContent");

  // Monta o iframe (escondido por padrão — apenas áudio)
  frame.className="yt-frame-hidden";
  _ytVideoVisible=false;
  document.getElementById("ytToggleVideo").className="yt-toggle-video";
  document.getElementById("ytToggleVideo").textContent="📺 Ver vídeo";

  if(vid){
    frame.innerHTML=`<iframe src="https://www.youtube.com/embed/${vid}?autoplay=1&rel=0" allow="accelerometer;autoplay;encrypted-media;gyroscope;picture-in-picture" allowfullscreen></iframe>`;
    open.href="https://www.youtube.com/watch?v="+vid;
  }else{
    frame.innerHTML=`<div style="padding:22px;text-align:center;color:#fff;font-size:13px">Nenhum link de vídeo salvo ainda.</div>`;
    open.href=s.youtube;
  }

  // Mostra cifra ou letra no painel de conteúdo
  const hasCifra=s.cifraTxt&&s.cifraTxt.trim();
  const hasLetra=s.letraTxt&&s.letraTxt.trim();
  if(hasCifra||hasLetra){
    let html=`<div class="yt-cifra-inline">`;
    if(hasCifra){
      html+=`<div style="font-size:10.5px;font-weight:800;color:var(--gold);letter-spacing:.07em;text-transform:uppercase;margin-bottom:7px">🎸 Cifra</div>`;
      html+=`<pre class="read-pre">${renderBold(esc(s.cifraTxt))}</pre>`;
      if(hasLetra) html+=`<div style="height:1px;background:var(--line);margin:14px 0"></div>`;
    }
    if(hasLetra){
      html+=`<div style="font-size:10.5px;font-weight:800;color:var(--gold);letter-spacing:.07em;text-transform:uppercase;margin-bottom:7px">🎤 Letra</div>`;
      html+=`<pre class="read-pre lyr">${renderBold(esc(s.letraTxt))}</pre>`;
    }
    html+=`</div>`;
    pane.innerHTML=html;
  }else{
    pane.innerHTML=`<div class="yt-no-content">Esta música ainda não tem cifra ou letra adicionada.</div>`;
  }

  document.getElementById("ytModal").classList.add("show");
}
function toggleYtVideo(){
  const frame=document.getElementById("ytFrame");
  const btn=document.getElementById("ytToggleVideo");
  _ytVideoVisible=!_ytVideoVisible;
  if(_ytVideoVisible){
    frame.className="yt-frame-visible";
    btn.className="yt-toggle-video vid-visible";
    btn.textContent="📺 Ocultar vídeo";
  }else{
    frame.className="yt-frame-hidden";
    btn.className="yt-toggle-video";
    btn.textContent="📺 Ver vídeo";
  }
}
function closeYt(){document.getElementById("ytFrame").innerHTML="";document.getElementById("ytModal").classList.remove("show");_ytVideoVisible=false;}

/* ===== Cifras/partituras por instrumento ===== */
function openPart(id){
  const s=songs.find(x=>x.id===id);if(!s)return;
  document.getElementById("partTitle").textContent="🎼 "+s.title;
  const parts=s.parts||{},ce=canEdit();
  // Escalação do dia desta música (pelo culto)
  const escala=EQ_INSTR[s.culto]||{};
  const diaNome=(C[s.culto]&&C[s.culto].d)||"";
  let h=`<div class="part-intro">Cada instrumento tem sua cifra ou partitura. Toque para abrir.${diaNome?`<br><b style="color:var(--gd)">Escalação · ${diaNome}</b>`:""}</div>`;
  h+=INSTR.map(([k,ic,nm])=>{
    const has=parts[k]&&parts[k].trim();
    const quem=escala[k];
    const quemTag=quem?`<span class="part-who">🎵 ${esc(quem)}</span>`:"";
    return `<div class="part-row"><div class="part-h" onclick="togglePart('${k}')"><span class="pic">${ic}</span><span class="pnm">${nm}${quemTag}</span><span class="pst ${has?'pst-has':'pst-no'}">${has?'tem cifra':'vazio'}</span></div>
      <div class="part-c hidden" id="pc-${k}">
      ${ce?`${editArea("pt-"+k,parts[k],"Cole aqui a cifra/partitura de "+nm+"... Use **palavra** para negrito")}<div class="tsave"><button id="ptb-${k}" onclick="savePart('${s.id}','${k}')">Salvar ${nm}</button></div>`
      :(has?`<pre class="read-pre">${renderBold(esc(parts[k]))}</pre>`:`<div class="empty-txt">Sem cifra para ${nm} ainda.</div>`)}
      </div></div>`;
  }).join("");
  document.getElementById("partBody").innerHTML=h;
  document.getElementById("partModal").classList.add("show");
}
function togglePart(k){document.getElementById("pc-"+k).classList.toggle("hidden");}
function closePart(){document.getElementById("partModal").classList.remove("show");}
function savePart(id,k){
  if(!canEdit())return;const b=document.getElementById("ptb-"+k);b.disabled=true;
  db.ref(`${ROOT}/songs/${id}/parts/${k}`).set(document.getElementById("pt-"+k).value||null).then(()=>{toast("Cifra de "+k+" salva ✓");const ps=document.querySelector(`#pc-${k}`).previousElementSibling.querySelector(".pst");if(ps){const has=document.getElementById("pt-"+k).value.trim();ps.className="pst "+(has?"pst-has":"pst-no");ps.textContent=has?"tem cifra":"vazio";}}).catch(()=>toast("Erro ao salvar — verifique seu login","err")).finally(()=>{b.disabled=false;});
}
function addSong(){
  if(role!=="admin")return;
  const t=document.getElementById("ns-title").value.trim();
  if(!t){toast("Digite o nome da música","err");return;}
  const ar=document.getElementById("ns-artist").value.trim(),cu=document.getElementById("ns-culto").value,tom=document.getElementById("ns-tom").value.trim();
  const b=document.getElementById("ns-go");b.disabled=true;
  const id="s"+Date.now().toString(36);
  const maxO=songs.reduce((m,s)=>Math.max(m,s.order||0),0);
  const song={id,title:t,artist:ar,culto:cu,order:maxO+1,youtube:"https://www.youtube.com/results?search_query="+encodeURIComponent(t+" "+ar),cifraUrl:"https://www.google.com/search?q="+encodeURIComponent("cifra "+t+" "+ar),videoUrl:"",cifraTxt:"",letraTxt:"",tom:tom,notes:"",parts:{}};
  db.ref(`${ROOT}/songs/${id}`).set(song).then(()=>{toast("Música adicionada ✓");["ns-title","ns-artist","ns-tom"].forEach(x=>document.getElementById(x).value="");document.getElementById("addBox").open=false;}).catch(()=>toast("Erro ao adicionar — verifique seu login","err")).finally(()=>{b.disabled=false;});
}
function delSong(id,title){
  if(role!=="admin")return;
  if(!confirm('Excluir "'+title+'"?\n\nIsto remove a música do repertório e de todas as marcações de ensaio. Não dá para desfazer.'))return;
  const updates={};updates[`${ROOT}/songs/${id}`]=null;
  rehs.forEach(r=>{if(r.marked&&r.marked[id])updates[`${ROOT}/rehs/${r.id}/marked/${id}`]=null;});
  db.ref().update(updates).then(()=>toast("Música excluída")).catch(()=>toast("Erro ao excluir — verifique seu login","err"));
}

function renderLetras(){
  document.getElementById("letraF").innerHTML=[["all","Todas",songs.length]].concat(CO.map(c=>[c,C[c].d,songs.filter(s=>s.culto===c).length])).map(([k,l,n])=>`<button class="fb ${k===lfilt?'active':''}" onclick="setLF('${k}')">${l}<span class="fn">${n}</span></button>`).join("");
  const cs=lfilt==="all"?CO:[lfilt],ce=canEdit();
  document.getElementById("letraL").innerHTML=cs.map(c=>{const l=songs.filter(s=>s.culto===c);if(!l.length)return"";return `<div class="cblk"><div class="chd"><div><div class="cd-d">${C[c].d}</div><div class="cd-s">${C[c].s}</div></div></div>${l.map(s=>{
    return `<div class="song"><div class="s-top"><div class="s-info"><div class="nm"><i data-lucide="mic-vocal"></i> ${esc(s.title)}</div><div class="ar">${esc(s.artist)}</div></div><button class="sa yt" onclick="openYt('${s.id}')"><i data-lucide="tv-minimal-play"></i></button></div>
    ${s.letraTxt?`<button class="tp-card" onclick="tpOpenFull('${s.id}','letra')"><span class="tp-card-ic"><i data-lucide="scroll-text"></i></span><span class="tp-card-tx"><b>Teleprompter</b><small>Letra em tela cheia, rola sozinha</small></span><i data-lucide="chevron-right" class="tp-card-go"></i></button>`:""}
    ${ce?`${editArea("ly-"+s.id,s.letraTxt,"Cole a letra aqui... Use **palavra** para negrito","lyr")}<div class="tsave"><button id="lyb-${s.id}" onclick="saveLetra('${s.id}')">Salvar letra</button><span class="ti">edição do Levita CN2</span></div>`
    :(s.letraTxt?`<button class="read-full" onclick="this.nextElementSibling.classList.remove('hidden');this.style.display='none'"><i data-lucide="mic-vocal"></i> Ver letra</button>
      <div class="hidden"><pre class="read-pre lyr" style="margin:8px 0 0">${renderBold(esc(s.letraTxt))}</pre></div>`:`<div class="empty-txt">Letra ainda não adicionada.</div>`)}
    </div>`;}).join("")}</div>`;}).join("");
}
function setLF(f){lfilt=f;renderLetras();}
function saveLetra(id){
  if(!canEdit())return;const b=document.getElementById("lyb-"+id);b.disabled=true;
  db.ref(`${ROOT}/songs/${id}/letraTxt`).set(document.getElementById("ly-"+id).value).then(()=>toast("Letra salva ✓")).catch(()=>toast("Erro ao salvar — verifique seu login","err")).finally(()=>{b.disabled=false;});
}

function renderFarda(){
  document.getElementById("fardaL").innerHTML=FARDA.map(f=>`<div class="farda"><div class="fd"><div class="fdt">${f.t}</div><div class="fdd">${f.d}</div></div><div class="fi">${f.items.map(([it,g])=>`<span class="it ${g?'green':''}">${g?'🟢 ':''}${esc(it)}</span>`).join("")}</div></div>`).join("");
}

function renderEquipe(){
  document.getElementById("equipeL").innerHTML=EQ.map(e=>`<div class="eq"><div class="eq-d">${e.c}</div><div class="eq-s">${e.s}</div>${e.e.map(([i,n])=>{const me=who&&n.includes(who);return `<div class="eq-row ${me?'me':''}"><div class="eq-i">${i}</div><div class="eq-n">${esc(n)}</div>${me?'<span class="eq-me-tag">você</span>':''}</div>`;}).join("")}</div>`).join("");
}

function cd(){const d=Math.ceil((EVT-new Date())/864e5);document.getElementById("cdN").textContent=d>0?d:d===0?"Hoje!":"🎉";}

document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>{document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));b.classList.add("active");document.querySelectorAll(".pnl").forEach(p=>p.classList.remove("show"));document.getElementById("p-"+b.dataset.t).classList.add("show");document.querySelector("header.top").classList.toggle("compact",b.dataset.t==="dash");window.scrollTo({top:0,behavior:"smooth"});});
document.querySelectorAll(".cv-btn").forEach(b=>b.onclick=()=>{document.querySelectorAll(".cv-btn").forEach(x=>x.classList.remove("active"));b.classList.add("active");calView=b.dataset.cv;document.getElementById("calList").classList.toggle("hidden",calView!=="list");document.getElementById("calGrid").classList.toggle("hidden",calView!=="grid");});
