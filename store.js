/*!
 * ONNE STORE RD — store.js
 * Tienda pública (index.html)
 * Fusión de: storage-core · chatbot-bundle · app · maps · store-enhancements
 * ══════════════════════════════════════════════════════════════════════════
 */


/* ╔══════════════════════════════════════════════════════════
 * ║  storage-core.js
 * ╚══════════════════════════════════════════════════════════ */

/*!
 * ONNE STORE RD — storage-core.js
 * Consolidado de: storage.js + storage-idb.js
 * ════════════════════════════════════════════
 */

/* ═══ storage.js ═════════════════════════════════════════════════════════════════════ */
// ═══════════════════════════════════════════════════════════════
//  Onne Store RD — StorageAPI v6
//  ▸ BASE DE DATOS DESCONECTADA — modo localStorage
//  ▸ Arquitectura preparada para reconectar cualquier backend
//
//  PARA RECONECTAR UNA BASE DE DATOS:
//  1. Cambia IS_REMOTE_ENABLED = true
//  2. Implementa remoteGet(key) y remoteSet(key, value)
//  3. Descomenta las secciones marcadas con TODO en loadRemote() y save()
//
//  CLAVES DE ALMACENAMIENTO:
//  • "siteConfig"       → configuración principal del sitio
//  • "adminCreds"       → credenciales del administrador
//  • "cartState"        → carrito del usuario (localStorage)
//  — "onne_chat_inbox"  → eliminado en v64 (bandeja de mensajes removida)
// ═══════════════════════════════════════════════════════════════
(function(){

  /* ── CONEXIÓN REMOTA: desactivada ──────────────────────────── */
  const IS_REMOTE_ENABLED = false;
  // Descomenta y configura cuando tengas un backend listo:
  // const API_URL = "https://YOUR.supabase.co";   // Supabase (o cualquier API REST)

  const LS_KEY = "siteConfig";

  /* ── DEFAULT CONFIG ──────────────────────────────────────────*/
  const DEFAULT = {
    version: 1,
    brand: { name:"ONNE STORE RD", logoText:"ONNE STORE", logoEnabled:false, logoUrl:"" },
    theme: {
      primary:"#C9A96E", accent:"#E8A598", charcoal:"#1C1C1E",
      offWhite:"#FAF8F5", white:"#FFFFFF", mid:"#6E6E73",
      border:"#E5E0D8", light:"#AEAEB2",
      btnDarkBg:"#1C1C1E", btnDarkColor:"#FFFFFF",
      btnGoldBg:"#C9A96E", btnGoldColor:"#FFFFFF",
      btnOutlineBorder:"#E5E0D8", btnOutlineColor:"#1C1C1E",
      cardBg:"#FFFFFF", cardBorder:"#E5E0D8",
      headerBg:"rgba(255,255,255,0.97)", footerBg:"#1C1C1E", footerColor:"#FFFFFF",
      badgeSaleBg:"#E8A598", badgeSaleColor:"#FFFFFF",
      badgeNewBg:"#C9A96E",  badgeNewColor:"#FFFFFF",
      fontDisplay:"Playfair Display", fontBody:"DM Sans"
    },
    whatsapp: {
      phone:"18295586888",
      template:"Hola, quiero hacer este pedido:\n\n🧾 Pedido:\n{items}\n\nSubtotal: {subtotal}\nEnvío: {envio}\nTotal: {total}\n\n👤 Cliente:\nNombre: {nombre}\nTeléfono: {telefono}\nEntrega: {metodo_entrega}\nDirección/Ciudad: {direccion_ciudad}\nNotas: {notas}\n\n¿Está disponible? Quiero coordinar el pago y la entrega."
    },
    navItems:[
      {id:"home",   label:"Inicio",   href:"#home",   visible:true},
      {id:"shop",   label:"Tienda",   href:"#shop",   visible:true},
      {id:"offers", label:"Ofertas",  href:"#offers", visible:true},
      {id:"about",  label:"Nosotros", href:"#about",  visible:true}
    ],
    banner:{
      enabled:true, height:"40vh",
      image:"https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=1400&q=85",
      labelEnabled:true,  label:"Perfumes Originales · República Dominicana",
      titleEnabled:true,  title:"Tu fragancia,", titleEm:"tu identidad.",
      descEnabled:true,   desc:"Descubre nuestra colección exclusiva de perfumes originales. Envío a toda la República Dominicana.",
      proofBar:{
        enabled:true,
        stars:    {enabled:true, text:"★★★★★"},
        customers:{enabled:true, count:"+500",  text:"clientes satisfechos"},
        shipping: {enabled:true, text:"Envío rápido"}
      },
      btn1:{text:"Ver Catálogo", href:"#shop",    style:"dark"},
      btn2:{text:"Escríbenos",   href:"whatsapp", style:"wa"}
    },
    homeSections:[
      {id:"features",    type:"features",    title:"",                     visible:true},
      {id:"new",         type:"productGrid", title:"Novedades",            filter:"new",      visible:true},
      {id:"best",        type:"productGrid", title:"Más Vendidos",         filter:"featured", visible:true},
      {id:"offers",      type:"offers",      title:"Ofertas Especiales",   visible:true},
      {id:"testimonials",type:"testimonials",title:"Opiniones de clientes",visible:true}
    ],
    homeProductSections:{
      new:   {mode:"auto",ids:[],limit:8,carousel:true,arrows:true},
      best:  {mode:"auto",ids:[],limit:8,carousel:true,arrows:true},
      offers:{mode:"auto",ids:[],limit:8,carousel:true,arrows:true}
    },
    pages:{
      about: {title:"Sobre nosotros",html:"<p>Somos <strong>Onne Store RD</strong>.</p>"},
      offers:{title:"Ofertas",html:""}
    },
    testimonials:{
      allowPublicSubmit:true,
      display:{carousel:true,arrows:true},
      items:[
        {id:"t1",name:"María González",city:"Santo Domingo",rating:5,text:"Me llegó súper rápido y el perfume es exactamente como esperaba.",status:"approved"},
        {id:"t2",name:"José Martínez",city:"Santiago",rating:5,text:"Los perfumes son 100% originales. Precios excelentes.",status:"approved"},
        {id:"t3",name:"Ana Rodríguez",city:"La Romana",rating:5,text:"La atención personalizada es increíble.",status:"approved"}
      ]
    },
    footer:{
      bg:"#1e1e1e",color:"#ffffff",linkColor:"#C9A96E",
      fontSize:".83rem",fontFamily:"",padding:60,
      copyright:"",showAdmin:false,columns:[]
    },
    products:[],
    benefits:{
      topBar:{enabled:true,text:"🚚 ENVÍO GRATIS en pedidos sobre RD$5,000 · Perfumes 100% Originales",style:{},placement:"top"},
      ticker:{enabled:false,items:["🔥 Ofertas semanales","🚚 Envío rápido","✅ 100% originales"],style:{},placement:"top"},
      band:  {enabled:true, items:[],style:{},placement:"belowBanner"}
    },
    shopTabs:[
      {id:"all",   label:"Todos",     type:"all",    value:"",      visible:true},
      {id:"women", label:"Mujer",     type:"gender", value:"Mujer", visible:true},
      {id:"men",   label:"Hombre",    type:"gender", value:"Hombre",visible:true},
      {id:"unisex",label:"Unisex",    type:"gender", value:"Unisex",visible:true},
      {id:"sale",  label:"En oferta", type:"sale",   value:"",      visible:true}
    ],
    shopTabsStyle:{variant:"pill", activeColor:"#C9A96E"},
    adminColors:{},
    sales:[],
    inventoryConfig:{}
  };

  /* ── UTILS ───────────────────────────────────────────────────*/
  function isObj(v){ return v && typeof v==="object" && !Array.isArray(v); }
  function deepMerge(base, extra){
    const out = Array.isArray(base) ? base.slice() : {...base};
    if(!isObj(extra)) return out;
    for(const k of Object.keys(extra)){
      const bv=out[k], ev=extra[k];
      if(isObj(bv)&&isObj(ev)) out[k]=deepMerge(bv,ev);
      else out[k]=ev;
    }
    return out;
  }

  /* ── NORMALIZE ───────────────────────────────────────────────*/
  function normalize(cfg){
    cfg.theme    = cfg.theme    || {};
    cfg.brand    = cfg.brand    || {};
    cfg.whatsapp = cfg.whatsapp || {phone:"",template:"Hola!"};
    Object.entries(DEFAULT.theme).forEach(([k,v])=>{ if(!cfg.theme[k]) cfg.theme[k]=v; });
    if(!Array.isArray(cfg.navItems)) cfg.navItems=[];
    if(!cfg.banner) cfg.banner={};
    cfg.banner.proofBar = cfg.banner.proofBar||{};
    const pb = cfg.banner.proofBar;
    if(pb.enabled===undefined) pb.enabled=true;
    pb.stars     = pb.stars    ||{}; if(pb.stars.enabled===undefined)     pb.stars.enabled=true;
    pb.customers = pb.customers||{}; if(pb.customers.enabled===undefined) pb.customers.enabled=true;
    pb.shipping  = pb.shipping ||{}; if(pb.shipping.enabled===undefined)  pb.shipping.enabled=true;
    if(!pb.stars.text)      pb.stars.text="★★★★★";
    if(!pb.customers.count) pb.customers.count="+500";
    if(!pb.customers.text)  pb.customers.text="clientes satisfechos";
    if(!pb.shipping.text)   pb.shipping.text="Envío rápido";
    if(cfg.banner.labelEnabled===undefined) cfg.banner.labelEnabled=true;
    if(cfg.banner.titleEnabled===undefined) cfg.banner.titleEnabled=true;
    if(cfg.banner.descEnabled===undefined)  cfg.banner.descEnabled=true;
    if(!Array.isArray(cfg.products)) cfg.products=[];
    cfg.benefits=cfg.benefits||{};
    ["topBar","ticker","band"].forEach(k=>{
      cfg.benefits[k]=cfg.benefits[k]||{};
      cfg.benefits[k].style=cfg.benefits[k].style||{};
    });
    if(!cfg.benefits.topBar.placement) cfg.benefits.topBar.placement="top";
    if(!cfg.benefits.ticker.placement) cfg.benefits.ticker.placement="top";
    if(!cfg.benefits.band.placement)   cfg.benefits.band.placement="belowBanner";
    if(!Array.isArray(cfg.benefits.band.items)) cfg.benefits.band.items=[];
    cfg.benefits.band.items=cfg.benefits.band.items.map(it=>{
      if(!it) return null;
      if(!it.id) it.id="ft_"+Math.random().toString(16).slice(2);
      if(it.visible===undefined) it.visible=true;
      return it;
    }).filter(Boolean);
    if(!Array.isArray(cfg.shopTabs)||cfg.shopTabs.length===0) cfg.shopTabs=DEFAULT.shopTabs.slice();
    cfg.shopTabsStyle=cfg.shopTabsStyle||{variant:"pill",activeColor:cfg.theme.primary||"#C9A96E"};
    cfg.pages=cfg.pages||{};
    cfg.pages.about=cfg.pages.about||{title:"Sobre nosotros",html:""};
    cfg.pages.offers=cfg.pages.offers||{title:"Ofertas",html:""};
    if(!Array.isArray(cfg.pages.about.blocks)){
      const leg=cfg.pages.about.html||"";
      cfg.pages.about.blocks=leg?[{id:"b1",title:"Nuestra historia",html:leg}]:[
        {id:"b1",title:"Nuestra historia",html:"<p>Cuéntanos tu historia…</p>"},
        {id:"b2",title:"Misión",html:"<p>Tu misión…</p>"},
        {id:"b3",title:"Visión",html:"<p>Tu visión…</p>"}
      ];
    }
    if(!Array.isArray(cfg.homeSections)) cfg.homeSections=[];
    cfg.homeSections.forEach(s=>{ if(!s.id) s.id="sec_"+Math.random().toString(16).slice(2); if(s.visible===undefined) s.visible=true; s.style=s.style||{}; });
    cfg.homeProductSections=cfg.homeProductSections||{
      new:{mode:"auto",ids:[],limit:8,carousel:true,arrows:true},
      best:{mode:"auto",ids:[],limit:8,carousel:true,arrows:true},
      offers:{mode:"auto",ids:[],limit:8,carousel:true,arrows:true}
    };
    cfg.testimonials=cfg.testimonials||{allowPublicSubmit:true,items:[]};
    if(!Array.isArray(cfg.testimonials.items)) cfg.testimonials.items=[];
    cfg.sectionStyles=cfg.sectionStyles||{home:{},shop:{},offers:{},about:{}};
    // ── Ventas e Inventario (v67) ──
    if(!Array.isArray(cfg.sales)) cfg.sales=[];
    cfg.inventoryConfig=cfg.inventoryConfig||{};
    return cfg;
  }

  /* ── IN-MEMORY CACHE ─────────────────────────────────────────*/
  let _cache = null;

  /* ── APPLY THEME VARS ────────────────────────────────────────*/
  function applyThemeVars(theme){
    if(!theme) return;
    const r = document.documentElement;
    const map = {
      primary:"--gold", accent:"--rose", charcoal:"--charcoal",
      offWhite:"--off-white", white:"--white", mid:"--mid",
      border:"--border", light:"--light"
    };
    Object.entries(map).forEach(([k,v])=>{ if(theme[k]) r.style.setProperty(v,theme[k]); });
    let el = document.getElementById("__dyn_theme");
    if(!el){ el=document.createElement("style"); el.id="__dyn_theme"; document.head.appendChild(el); }
    el.textContent = `
      .btn-dark{background:${theme.btnDarkBg||"#1C1C1E"} !important;color:${theme.btnDarkColor||"#fff"} !important;}
      .btn-gold{background:${theme.btnGoldBg||"#C9A96E"} !important;color:${theme.btnGoldColor||"#fff"} !important;}
      .btn-outline{border-color:${theme.btnOutlineBorder||"#E5E0D8"} !important;color:${theme.btnOutlineColor||"#1C1C1E"} !important;}
      .product-card{background:${theme.cardBg||"#fff"} !important;border-color:${theme.cardBorder||"#E5E0D8"} !important;}
      .site-header{background:${theme.headerBg||"rgba(255,255,255,.97)"} !important;}
      .site-footer{background:${theme.footerBg||"#1C1C1E"} !important;color:${theme.footerColor||"#fff"} !important;}
      .badge-sale{background:${theme.badgeSaleBg||"#E8A598"} !important;color:${theme.badgeSaleColor||"#fff"} !important;}
      .badge-new{background:${theme.badgeNewBg||"#C9A96E"} !important;color:${theme.badgeNewColor||"#fff"} !important;}
    `;
  }

  /* ── STATUS BROADCAST ────────────────────────────────────────*/
  function emitStatus(ok, msg){
    window.dispatchEvent(new CustomEvent("db:status", { detail:{ ok, msg } }));
  }

  /* ── localStorage helpers ────────────────────────────────────*/
  function lsGet(key){
    try{ const r=localStorage.getItem(key); return r?JSON.parse(r):null; }catch(e){ return null; }
  }
  function lsSet(key, value){
    try{ localStorage.setItem(key, JSON.stringify(value)); }catch(e){}
  }

  /* ── PUBLIC: load() ──────────────────────────────────────────*/
  function load(){
    if(_cache) return _cache;
    const ls = lsGet(LS_KEY);
    _cache = normalize(ls ? deepMerge(DEFAULT, ls) : deepMerge({}, DEFAULT));
    return _cache;
  }

  /* ── PUBLIC: save(cfg) ───────────────────────────────────────*/
  // TODO RECONEXIÓN: Cuando IS_REMOTE_ENABLED=true,
  //   llamar remoteSet("main", cfg) aquí
  function save(cfg){
    _cache = cfg;
    lsSet(LS_KEY, cfg);
    emitStatus(true, "Guardado localmente ✓");
  }

  /* ── PUBLIC: loadRemote(cb) ──────────────────────────────────*/
  // TODO RECONEXIÓN: Cuando IS_REMOTE_ENABLED=true,
  //   llamar remoteGet("main") aquí y hacer dispatch de "siteconfig:updated"
  async function loadRemote(cb){
    emitStatus(true, "Modo local (localStorage) ✓");
    if(cb) cb(load());
  }

  /* ── PUBLIC: loadCreds(cb) ───────────────────────────────────*/
  // TODO RECONEXIÓN: Leer credenciales del backend remoto
  async function loadCreds(cb){
    cb(lsGet("adminCreds"));
  }

  /* ── PUBLIC: saveCreds(email, pass) ──────────────────────────*/
  // TODO RECONEXIÓN: Guardar credenciales en backend remoto
  function saveCreds(email, pass){
    lsSet("adminCreds", { email, pass });
  }

  /* ── PUBLIC: reset() ─────────────────────────────────────────*/
  function reset(){
    const n = normalize(deepMerge({}, DEFAULT));
    save(n);
    return n;
  }

  /* ── EXPORT ──────────────────────────────────────────────────*/
  window.StorageAPI = {
    KEY: LS_KEY,
    DEFAULT,
    load,
    save,
    reset,
    loadRemote,
    loadCreds,
    saveCreds,
    applyThemeVars,
    IS_NETLIFY: false,
    // Legacy aliases
    initFirestore:      ()=>{},
    loadCredsFirestore: (cb)=>loadCreds(cb),
    saveCredsFirestore: (email,pass)=>saveCreds(email,pass)
  };

})();

/* ═══ storage-idb.js ═════════════════════════════════════════════════════════════════ */
// ═══════════════════════════════════════════════════════════════
//  Onne Store RD — Large Storage API (IndexedDB) v63
//  ▸ Handles large files: KB documents, product images, uploads
//  ▸ Target: up to ~500MB-1GB per origin (browser-dependent)
//  ▸ Organized by store: kb, products, chatbot, config, uploads
//  ▸ Prepared for future migration to external database
//
//  ORGANIZATION:
//   store: "kb"       → Knowledge base documents
//   store: "products" → Product images (base64)
//   store: "uploads"  → General file uploads
//   store: "config"   → Large config blobs
//
//  USAGE:
//   LargeStorage.set("kb", "main-doc", textContent)
//   LargeStorage.get("kb", "main-doc").then(content => ...)
//   LargeStorage.list("uploads").then(keys => ...)
//   LargeStorage.delete("kb", "main-doc")
// ═══════════════════════════════════════════════════════════════
(function(){ "use strict";

const DB_NAME    = "OnneStoreRD";
const DB_VERSION = 1;
const STORES     = ["kb", "products", "uploads", "config", "chatbot"];

let _db = null;

// ── Open / Init DB ─────────────────────────────────────────────
function openDB(){
  if(_db) return Promise.resolve(_db);
  return new Promise((resolve, reject)=>{
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = e=>{
      const db = e.target.result;
      STORES.forEach(name=>{
        if(!db.objectStoreNames.contains(name)){
          db.createObjectStore(name, {keyPath:"key"});
        }
      });
    };
    req.onsuccess = e=>{ _db = e.target.result; resolve(_db); };
    req.onerror   = e=>reject(e.target.error);
  });
}

// ── Set ─────────────────────────────────────────────────────────
async function set(storeName, key, value){
  const db = await openDB();
  return new Promise((resolve, reject)=>{
    const tx = db.transaction(storeName, "readwrite");
    const st = tx.objectStore(storeName);
    const req = st.put({ key, value, updatedAt: Date.now() });
    req.onsuccess = ()=>resolve(true);
    req.onerror   = e=>reject(e.target.error);
  });
}

// ── Get ─────────────────────────────────────────────────────────
async function get(storeName, key){
  const db = await openDB();
  return new Promise((resolve, reject)=>{
    const tx = db.transaction(storeName, "readonly");
    const req = tx.objectStore(storeName).get(key);
    req.onsuccess = e=>resolve(e.target.result?.value ?? null);
    req.onerror   = e=>reject(e.target.error);
  });
}

// ── Delete ──────────────────────────────────────────────────────
async function del(storeName, key){
  const db = await openDB();
  return new Promise((resolve, reject)=>{
    const tx = db.transaction(storeName, "readwrite");
    const req = tx.objectStore(storeName).delete(key);
    req.onsuccess = ()=>resolve(true);
    req.onerror   = e=>reject(e.target.error);
  });
}

// ── List all keys in a store ─────────────────────────────────────
async function list(storeName){
  const db = await openDB();
  return new Promise((resolve, reject)=>{
    const tx = db.transaction(storeName, "readonly");
    const req = tx.objectStore(storeName).getAllKeys();
    req.onsuccess = e=>resolve(e.target.result);
    req.onerror   = e=>reject(e.target.error);
  });
}

// ── Get all entries in a store ────────────────────────────────────
async function getAll(storeName){
  const db = await openDB();
  return new Promise((resolve, reject)=>{
    const tx = db.transaction(storeName, "readonly");
    const req = tx.objectStore(storeName).getAll();
    req.onsuccess = e=>resolve(e.target.result);
    req.onerror   = e=>reject(e.target.error);
  });
}

// ── Clear a store ────────────────────────────────────────────────
async function clear(storeName){
  const db = await openDB();
  return new Promise((resolve, reject)=>{
    const tx = db.transaction(storeName, "readwrite");
    const req = tx.objectStore(storeName).clear();
    req.onsuccess = ()=>resolve(true);
    req.onerror   = e=>reject(e.target.error);
  });
}

// ── Estimate storage usage ────────────────────────────────────────
async function getUsage(){
  if(!navigator.storage?.estimate) return {usage:0, quota:0, percent:0};
  const {usage, quota} = await navigator.storage.estimate();
  return {
    usage,
    quota,
    percent: Math.round((usage/quota)*100),
    usageMB: (usage/1024/1024).toFixed(1),
    quotaMB: (quota/1024/1024).toFixed(0)
  };
}

// ── Save KB document from file ──────────────────────────────────
async function saveKBDocument(filename, content){
  return set("kb", `doc:${filename}`, {
    filename,
    content,
    size: content.length,
    savedAt: new Date().toISOString()
  });
}

// ── Get all KB documents ────────────────────────────────────────
async function getAllKBDocs(){
  const all = await getAll("kb");
  return all.filter(e=>e.key.startsWith("doc:")).map(e=>e.value);
}

// ── Delete KB document ──────────────────────────────────────────
async function deleteKBDoc(filename){
  return del("kb", `doc:${filename}`);
}

// ── Export ────────────────────────────────────────────────────────
window.LargeStorage = {
  set, get, delete: del, list, getAll, clear,
  getUsage, saveKBDocument, getAllKBDocs, deleteKBDoc,
  STORES,
  // Quick helpers
  kb: {
    save: (key, val) => set("kb", key, val),
    get:  (key)      => get("kb", key),
    list: ()         => list("kb"),
    del:  (key)      => del("kb", key)
  },
  products: {
    saveImage: (id, base64) => set("products", `img:${id}`, base64),
    getImage:  (id)         => get("products", `img:${id}`),
    delImage:  (id)         => del("products", `img:${id}`)
  },
  uploads: {
    save: (filename, content) => set("uploads", filename, {filename, content, savedAt: Date.now()}),
    get:  (filename)          => get("uploads", filename),
    list: ()                  => list("uploads"),
    del:  (filename)          => del("uploads", filename)
  }
};

// ── Auto-init on load ─────────────────────────────────────────────
openDB().catch(e=>console.warn("[LargeStorage] IndexedDB init failed:", e));

})();

/* ╔══════════════════════════════════════════════════════════
 * ║  chatbot-bundle.js
 * ╚══════════════════════════════════════════════════════════ */

/*!
 * ONNE STORE RD — chatbot-bundle.js
 * Consolidado de: chatbot-data.js + chatbot.js
 * ══════════════════════════════════════════════
 */

/* ═══ chatbot-data.js ════════════════════════════════════════════════════════════════ */
// ═══════════════════════════════════════════════════════════════
//  Onne Store RD — Chatbot Data Engine v71
//  Base de 1000+ preguntas · 35 intenciones · Mapa de aromas
//  Motor de recomendación · Flujos conversacionales
//  Upsell / Cross-sell · Dataset JSON exportable
// ═══════════════════════════════════════════════════════════════
(function () { "use strict";

/* ═══════════════════════════════════════════════════════════════
   SECCIÓN 1 — MAPA PROFESIONAL DE AROMAS (10 familias)
   Cada familia tiene notas principales + palabras clave cliente
   ═══════════════════════════════════════════════════════════════ */
window.ONNE_AROMA_MAP = {
  dulce: {
    label: "dulces y gourmands 🍯",
    emoji: "🍯",
    description: "Aromas a vainilla, caramelo y chocolate. Cálidos y envolventes.",
    notas: ["vainilla", "caramelo", "chocolate", "miel", "praline", "toffee", "azucar", "coco"],
    palabras_cliente: ["dulce","vainilla","caramelo","chocolate","rico","comestible","azucar","miel","gourmand","praline","candy","toffee","merengue","pastelería","dulzona"],
    perfumes_referencia: ["Yara Lattafa", "Bombshell Victoria Secret", "La Vie Est Belle", "Good Girl", "Mon Paris"],
    duracion_tipica: "6-10h",
    mejor_para: ["noche", "citas", "invierno", "regalo"],
    genero_afin: "Femenino"
  },
  floral: {
    label: "florales 🌸",
    emoji: "🌸",
    description: "Aromas de flores naturales. Románticos y femeninos.",
    notas: ["rosa", "jazmin", "peonía", "lavanda", "gardenia", "ylang", "azahar", "tuberosa", "orquídea"],
    palabras_cliente: ["floral","flores","rosa","jazmin","jazmín","lavanda","gardenia","peonia","peonía","orquídea","flores","bouquet","primavera","romántico","femenino"],
    perfumes_referencia: ["Coco Mademoiselle", "Miss Dior", "Flower Bomb", "J'adore", "Bright Crystal"],
    duracion_tipica: "5-8h",
    mejor_para: ["diario", "trabajo", "primavera", "regalo"],
    genero_afin: "Femenino"
  },
  frutal: {
    label: "frutales y frescos 🍑",
    emoji: "🍑",
    description: "Aromas de frutas jugosas y tropicales. Alegres y juveniles.",
    notas: ["melocotón", "cereza", "fresa", "frambuesa", "mango", "maracuyá", "mora", "manzana"],
    palabras_cliente: ["frutal","fruta","melocoton","cereza","fresa","frambuesa","mango","tropical","exótico","manzana","melón","sandia","mora","lichia","bayas"],
    perfumes_referencia: ["Candy Dior", "212 Sexy", "Bombshell VS", "Love Spell VS", "Pink Fresh"],
    duracion_tipica: "4-6h",
    mejor_para: ["verano", "playa", "diario", "joven"],
    genero_afin: "Femenino"
  },
  fresco: {
    label: "frescos y acuáticos 🌊",
    emoji: "🌊",
    description: "Aromas acuáticos y limpios. Ideales para el día y el calor.",
    notas: ["océano", "agua marina", "algodón", "brisa", "menta", "pepino", "bambú", "verde"],
    palabras_cliente: ["fresco","acuático","marino","agua","mar","menta","limpio","aéreo","verde","oceano","brisa","algodon","algodón","bambu","suave","ligero","diurno"],
    perfumes_referencia: ["Acqua di Gio", "Cool Water", "Davidoff", "Dylan Blue", "Bleu de Chanel"],
    duracion_tipica: "4-7h",
    mejor_para: ["verano", "deporte", "calor", "trabajo", "diario"],
    genero_afin: "Masculino"
  },
  citrico: {
    label: "cítricos ☀️",
    emoji: "☀️",
    description: "Aromas de frutas cítricas. Energizantes y refrescantes.",
    notas: ["limón", "naranja", "bergamota", "pomelo", "mandarina", "toronja", "neroli", "yuzu"],
    palabras_cliente: ["citrico","cítrico","limon","limón","naranja","bergamota","pomelo","mandarina","toronja","neroli","yuzu","citrus","cítrus","acido","refrescante","energizante"],
    perfumes_referencia: ["Light Blue Dolce", "CK One", "212 Men", "Eros Versace", "Versace Man"],
    duracion_tipica: "3-5h",
    mejor_para: ["verano", "mañana", "trabajo", "deporte", "calor"],
    genero_afin: "Unisex"
  },
  madera: {
    label: "amaderados 🌿",
    emoji: "🌿",
    description: "Aromas de maderas nobles y tierra. Elegantes y sofisticados.",
    notas: ["cedro", "sándalo", "vetiver", "patchouli", "musgo", "roble", "tierra", "pino"],
    palabras_cliente: ["madera","amaderado","cedro","sandalo","sándalo","vetiver","patchouli","musgo","tierra","pino","bosque","woody","raíces","terroso","noble","sofisticado"],
    perfumes_referencia: ["Sauvage Dior", "Bleu Chanel", "Armani Code", "Baccarat Rouge 540", "Invictus"],
    duracion_tipica: "7-12h",
    mejor_para: ["noche", "oficina", "invierno", "elegante"],
    genero_afin: "Masculino"
  },
  oriental: {
    label: "orientales y especiados 🌙",
    emoji: "🌙",
    description: "Aromas especiados y exóticos. Seductores y misteriosos.",
    notas: ["ámbar", "incienso", "canela", "cardamomo", "cuero", "resina", "mirra", "almizcle"],
    palabras_cliente: ["oriental","árabe","arabe","especiado","ambar","ámbar","incienso","canela","dubai","medio oriente","oud","misterioso","seductor","exótico","opulento","lujoso","especias"],
    perfumes_referencia: ["Lattafa Asad", "Yara Lattafa", "Baccarat Rouge", "Tom Ford Oud", "Amouage"],
    duracion_tipica: "8-14h",
    mejor_para: ["noche", "invierno", "citas", "elegante", "eventos"],
    genero_afin: "Unisex"
  },
  intenso: {
    label: "intensos y poderosos 🔥",
    emoji: "🔥",
    description: "Fragancias con gran proyección y duración. Para ser notado.",
    notas: ["oud", "cuero", "resina", "almizcle oscuro", "tabaco", "especias fuertes"],
    palabras_cliente: ["intenso","fuerte","poderoso","que dure","duradero","que se note","que se sienta","llamar atención","impactante","proyección","sillage","notar","larga duración","todo el día"],
    perfumes_referencia: ["One Million", "Invictus Intense", "Black Orchid", "OUD Velvet", "Sauvage Elixir"],
    duracion_tipica: "10-16h",
    mejor_para: ["noche", "eventos", "invierno", "impresionar"],
    genero_afin: "Masculino"
  },
  suave: {
    label: "suaves y delicados 🕊️",
    emoji: "🕊️",
    description: "Aromas discretos y limpios. Para quienes prefieren lo sutil.",
    notas: ["algodón limpio", "polvo", "talco", "lino", "aire", "bebé", "jabón"],
    palabras_cliente: ["suave","delicado","sutil","limpio","polvo","discreto","ligero","tenue","fresco limpio","no muy fuerte","no intenso","minimalista","clean","soap","jabón"],
    perfumes_referencia: ["Chanel Chance", "La Nuit Tresor", "Angel Mugler", "Clean perfume", "Issey Miyake"],
    duracion_tipica: "4-7h",
    mejor_para: ["trabajo", "diario", "primavera", "joven"],
    genero_afin: "Femenino"
  },
  vainilla: {
    label: "vainilla y ambarinos 🍦",
    emoji: "🍦",
    description: "Vainilla cálida y ámbar seco. Envolventes y sensuales.",
    notas: ["vainilla", "ámbar", "tonka", "benzoin", "musgo blanco", "sándalo dulce"],
    palabras_cliente: ["vainilla","vanilla","ambar cálido","warm","tibio","calido","cálido","ambar","benzoin","tonka","envolvente","sensual","cremoso","caliente","acogedor"],
    perfumes_referencia: ["Santal 33", "Black Opium", "Hypnotic Poison", "Flowerbomb", "Narciso Rodriguez"],
    duracion_tipica: "8-12h",
    mejor_para: ["noche", "citas", "invierno", "regalo"],
    genero_afin: "Femenino"
  }
};

/* ═══════════════════════════════════════════════════════════════
   SECCIÓN 2 — BASE COMPLETA DE INTENCIONES (35 intenciones)
   Cada intención tiene 25-30 patrones = ~900+ patrones totales
   ═══════════════════════════════════════════════════════════════ */
window.ONNE_INTENT_PATTERNS = [

  /* ── SALUDOS Y CORTESÍAS ──────────────────────────────────── */
  { intent: "saludo", weight: 1, patterns: [
    "hola","buenas","buenos dias","buenos días","buenas tardes","buenas noches",
    "hey","saludos","hi","hello","ey","que tal","qué tal","como estan","cómo están",
    "good morning","good evening","buenas a todos","qué hay","buen dia","buen día",
    "holis","holaa","hola hola","buenas!!","hola!!","saludos cordiales","hola buen dia",
    "hello there","hola buenas","buenas tardes a todos","buenas noches a todos"
  ]},
  { intent: "despedida", weight: 1, patterns: [
    "adios","adiós","chao","bye","hasta luego","nos vemos","gracias y chao","cuídate",
    "cuidate","hasta pronto","hasta mañana","ok gracias","listo gracias","perfecto gracias",
    "muchas gracias","excelente gracias","me voy","hasta la proxima","hasta la próxima",
    "chao chao","nos vemos luego","hasta otra","me retiro","que tengas buen dia",
    "fue un placer","muy amable gracias","bye bye","good bye"
  ]},
  { intent: "gracias", weight: 1, patterns: [
    "gracias","muchas gracias","mil gracias","muy amable","eres muy bueno","excelente atencion",
    "te lo agradezco","qué bueno","genial","perfecto","excelente","super","chevere",
    "chévere","wao","wow","qué servicio tan bueno","muy bien","fenomenal","de puta madre",
    "brutal","increíble","gracias por la info","gracias por ayudarme"
  ]},

  /* ── BÚSQUEDA POR GÉNERO ──────────────────────────────────── */
  { intent: "buscar_hombre", weight: 5, patterns: [
    "perfume para hombre","perfume masculino","perfume caballero","para hombre",
    "perfume para mi novio","perfume para mi papa","perfume para mi esposo",
    "perfume para mi hermano","fragancias masculinas","colonia hombre",
    "aroma masculino","colonia masculina","tiene para hombre","algo para hombre",
    "perfume de hombre","para mi novio","para mi esposo","para mi papa",
    "para mi hermano","fragancia hombre","perfume varón","para caballero",
    "perfumes masculinos","colonias masculinas","para el","para él"
  ]},
  { intent: "buscar_mujer", weight: 5, patterns: [
    "perfume para mujer","perfume femenino","perfume dama","para mujer",
    "perfume para mi novia","perfume para mi mama","perfume para mi esposa",
    "perfume para mi hermana","fragancias femeninas","colonia mujer",
    "aroma femenino","colonia femenina","tiene para mujer","algo para mujer",
    "perfume de mujer","para mi novia","para mi esposa","para mi mama",
    "para mi hermana","fragancia mujer","perfume de dama","para damas",
    "perfumes femeninos","colonias femeninas","para ella"
  ]},
  { intent: "buscar_unisex", weight: 3, patterns: [
    "unisex","para los dos","para ambos","para cualquiera","neutro","compartir",
    "para hombre y mujer","sirva para cualquier genero","perfume neutro",
    "fragancia unisex","sin género","para cualquier persona","para cualquiera",
    "que lo usen los dos","que sea de los dos","que use cualquiera"
  ]},

  /* ── BÚSQUEDA POR AROMA ───────────────────────────────────── */
  { intent: "buscar_dulce", weight: 6, patterns: [
    "perfume dulce","aroma dulce","olor dulce","huele dulce","fragancia dulce",
    "algo dulce","perfume que huela dulce","perfume a vainilla","perfume gourmand",
    "huele a caramelo","huele a chocolate","huele a azucar","perfume comestible",
    "que huela rico","perfume vainilla","olor a dulce","aroma rico","dulzón",
    "algo que huela a postre","perfume pastelero","huele a candy","como a vainilla",
    "que huela a dulce","perfume con dulzor","aroma de azúcar","fragancia dulce y cálida"
  ]},
  { intent: "buscar_fresco", weight: 6, patterns: [
    "perfume fresco","aroma fresco","olor fresco","fragancia fresca","algo fresco",
    "perfume que huela fresco","perfume acuatico","acuático","perfume marino",
    "huele a agua","huele a menta","olor a limpio","fresco y limpio","perfume verano",
    "ligero","perfume de playa","olor a mar","fresco para el día","que sea fresquito",
    "que se sienta fresco","perfume de agua","aroma marino","refrescante","aéreo",
    "fresco y limpio","algo no pesado","algo liviano"
  ]},
  { intent: "buscar_floral", weight: 6, patterns: [
    "perfume floral","aroma floral","huele a flores","fragancia floral","a flores",
    "a rosas","huele a rosa","huele a jazmin","huele a jazmín","floral femenino",
    "perfume con flores","olor a rosas","olor a flores","aroma de rosas",
    "perfume de flores","a jazmin","huele a lavanda","con rosas","floral romántico",
    "huele a jardín","aroma primaveral","perfume muy femenino","rosas y flores",
    "huele a florería","fragancia de ramo","bouquet de flores"
  ]},
  { intent: "buscar_madera", weight: 6, patterns: [
    "perfume amaderado","aroma madera","huele a madera","fragancia madera","woody",
    "cedro","sándalo","sandalo","perfume con oud","aroma oud","amaderado",
    "huele a madera","fragancia madera","bosque","terroso","sofisticado",
    "seco amaderado","madera noble","cedro y sándalo","madera oscura","earthy",
    "que huela a madera","aroma de bosque","perfume con cedro","fragancia sofisticada"
  ]},
  { intent: "buscar_intenso", weight: 6, patterns: [
    "perfume intenso","aroma intenso","perfume fuerte","algo fuerte","duradero intenso",
    "que se sienta mucho","perfume poderoso","perfume profundo","para noche",
    "elegante intenso","muy notorio","que se note bastante","que llame la atencion",
    "impactante","que dure mucho y sea fuerte","perfume de presencia","para impresionar",
    "que deje rastro","que deje estela","que se note al pasar","potente",
    "que proyecte mucho","gran proyeccion","que todos noten","intenso y duradero"
  ]},
  { intent: "buscar_citrico", weight: 5, patterns: [
    "citrico","cítrico","huele a limon","huele a limón","huele a naranja",
    "perfume cítrico","fragancia citrica","bergamota","mandarina","refrescante",
    "huele a citricos","olor a limón","fresco cítrico","como naranja","citrus",
    "toronja","pomelo","neroli","fresco y cítrico","como limón exprimido",
    "que huela a naranja","cítrico y fresco","fresco y amargo","algo cítrico"
  ]},
  { intent: "buscar_oriental", weight: 6, patterns: [
    "oriental","perfume oriental","especiado","especias","ambar","ámbar","incienso",
    "perfume árabe","árabe","arabe","perfume medio oriente","perfume de dubai",
    "dubai","oud","oud oriental","aroma árabe","perfume exótico oriental",
    "misterioso","seductor","exótico","canela","cardamomo","con resina",
    "perfume de los árabes","fragancia oriental","con ambar","con incienso"
  ]},
  { intent: "buscar_vainilla", weight: 5, patterns: [
    "vainilla","vanilla","huele a vainilla","perfume a vainilla","caramelo suave",
    "dulce calido","cálido dulce","warm","ambar dulce","aroma vainilla",
    "perfume de vainilla","que huela a vainilla","como vainilla","con vainilla",
    "tonka","benzoin","ambar cálido","perfume tibio","fragancia cálida","acogedor",
    "sensual y dulce","como vainilla y ámbar","vainilla y madera"
  ]},
  { intent: "buscar_suave", weight: 4, patterns: [
    "perfume suave","aroma suave","algo delicado","delicado","sutil","discreto",
    "no muy fuerte","no intenso","tenue","ligero y suave","perfume fresco y suave",
    "clean perfume","huele a limpio","a jabón","a talco","a ropa limpia",
    "minimalista","sin exagerar","moderado","que no sea muy cargado",
    "fresco y suave","suave y limpio","que no moleste a nadie"
  ]},

  /* ── OCASIÓN ──────────────────────────────────────────────── */
  { intent: "para_regalo", weight: 8, patterns: [
    "regalo","para regalar","de regalo","es un regalo","quiero regalar",
    "busco un regalo","es para sorprender","sorpresa","de cumpleaños",
    "para aniversario","para san valentin","para navidad","para regalo de navidad",
    "para el dia de la madre","dia del padre","para sorprender a alguien",
    "tengo que regalar","necesito un regalo","buscando regalo","para alguien especial",
    "para mi mamá","es para obsequiar","como obsequio","para dar de regalo",
    "es un obsequio","tengo que dar un regalo","necesito un obsequio"
  ]},
  { intent: "para_diario", weight: 4, patterns: [
    "uso diario","para todos los dias","para todos los días","para el trabajo",
    "para la oficina","para estudiar","para la universidad","dia a dia","cotidiano",
    "casual","dia normal","ropa de diario","perfume de dia","para trabajar",
    "uso cotidiano","para salir al dia","perfume básico","para salir de vez en cuando",
    "para usar siempre","perfume de cada día","que use todos los días"
  ]},
  { intent: "para_noche", weight: 5, patterns: [
    "fiesta","para salir de noche","noche de fiesta","evento especial","boda",
    "graduacion","graduación","quinceanera","quinceañera","para disco","para club",
    "perfume de noche","para la noche","velada","cena elegante","para un evento",
    "ocasion especial","para salir","para una fiesta","para bailar","para divertirse",
    "para club nocturno","para una graduación","para una boda"
  ]},
  { intent: "para_cita", weight: 6, patterns: [
    "cita","primera cita","cita romantica","cita romántica","perfume seductor",
    "perfume sexy","para enamorar","romantico","romántico","para conquistar",
    "para seducir","para impresionar a alguien","para gustar","para mi pareja",
    "para atraer","para mi primera cita","para una cita especial","para cita",
    "para enamorar a alguien","perfume de seducción","para gustarle a alguien"
  ]},
  { intent: "para_verano", weight: 3, patterns: [
    "verano","clima caliente","calor","playa","piscina","tropical","perfume de verano",
    "para el calor","para climas cálidos","para el sol","para el heat",
    "en verano","temporada de calor","cuando hace calor","para días calurosos"
  ]},
  { intent: "para_invierno", weight: 3, patterns: [
    "invierno","clima frio","frio","frío","temporada de frio","para climas frios",
    "cuando hace frío","en frio","para días fríos","para el invierno",
    "temporada de frío","época de frío"
  ]},

  /* ── MARCAS ESPECÍFICAS ───────────────────────────────────── */
  { intent: "buscar_victoria_secret", weight: 7, patterns: [
    "victoria secret","victoria's secret","vs perfume","victorias secret",
    "victoria secret perfume","vs body","love spell","bombshell","vs",
    "bodymist victoria","body mist victoria secret","locion victoria",
    "victoria's","viktoria","vivtoria","body splash victoria","crema victoria",
    "locion victoria secret","perfume vs","bodylotion vs","pure seduction"
  ]},
  { intent: "buscar_bath_body", weight: 7, patterns: [
    "bath and body works","bath body works","bath body","bbw",
    "bath works","bath and body","crema bath","bath body crema",
    "bbw crema","locion bath","body butter bath","bath locion",
    "body mist bbw","bath body perfume","spray bath body"
  ]},
  { intent: "buscar_dior", weight: 6, patterns: [
    "dior","sauvage","miss dior","j adore","j'adore","dior perfume",
    "christian dior","dior sauvage","dior hombre","sauvage dior",
    "jadore","miss dior mujer","dior masculino","fragrance dior"
  ]},
  { intent: "buscar_chanel", weight: 6, patterns: [
    "chanel","bleu de chanel","coco mademoiselle","chanel no 5",
    "numero 5","coco chanel","allure chanel","chanel perfume",
    "no5","no.5","bleu chanel","chanel n5","chanel masculino"
  ]},
  { intent: "buscar_lattafa", weight: 6, patterns: [
    "lattafa","yara","asad","raghba","badee al oud","ameer al oud",
    "lattafa perfume","yara lattafa","asad lattafa","lattafa brand",
    "lattafa arabe","raghba lattafa","ameer lattafa","lattafa uae"
  ]},
  { intent: "buscar_versace", weight: 5, patterns: [
    "versace","eros","dylan blue","bright crystal","versace pour homme",
    "versace perfume","donatella","versace eros","dylan blue versace",
    "eros versace","man eau fraiche","versace mujer"
  ]},
  { intent: "buscar_paco_rabanne", weight: 5, patterns: [
    "paco rabanne","1 million","one million","1million","invictus",
    "lady million","olympea","paco","one million paco","invictus paco",
    "million paco","lady million paco","paco rabanne mujer"
  ]},
  { intent: "buscar_armani", weight: 5, patterns: [
    "armani","acqua di gio","acqua di gioia","si armani","armani code",
    "emporio armani","georgio armani","si","armani perfume",
    "acqua di gio armani","giorgio armani","armani hombre"
  ]},
  { intent: "buscar_carolina_herrera", weight: 5, patterns: [
    "carolina herrera","good girl","bad boy","212","ch perfume",
    "good girl herrera","212 carolina","212 vip","good girl eau",
    "bad boy herrera","carolina herrera mujer"
  ]},

  /* ── CREMAS Y CORPORALES ──────────────────────────────────── */
  { intent: "buscar_crema", weight: 6, patterns: [
    "crema","crema corporal","locion","loción","body lotion",
    "body cream","crema perfumada","hidratante","body butter",
    "body splash","splash","body mist","colonia corporal",
    "cremas corporales","loción corporal","crema para el cuerpo",
    "locion de cuerpo","algo para hidratar","crema hidratante"
  ]},

  /* ── PRECIO Y PRESUPUESTO ─────────────────────────────────── */
  { intent: "preguntar_precio", weight: 4, patterns: [
    "cuanto cuesta","cuánto cuesta","cuánto vale","cuanto vale","qué precio",
    "que precio","precio de","cuánto es","cuanto es","precio","cuánto me sale",
    "cuanto me sale","en cuánto","en cuanto","costo","cotización","a cuánto",
    "a cuanto","dime el precio","me dices el precio","que valor tiene",
    "qué valor tiene","cuánto cobran","a cómo está","a como esta"
  ]},
  { intent: "buscar_economico", weight: 4, patterns: [
    "económico","economico","barato","precio bajo","precio accesible",
    "lo mas barato","lo más barato","algo barato","que no sea caro",
    "presupuesto bajo","no tengo mucho dinero","algo asequible",
    "precio modico","módico","sin gastar mucho","baratito","poco presupuesto",
    "con poco dinero","opciones económicas","lo más económico"
  ]},
  { intent: "buscar_premium", weight: 4, patterns: [
    "premium","lujoso","exclusivo","caro","de lujo","nicho",
    "high end","de coleccion","colección","raro","especial",
    "lo mejor","top de linea","lo más caro","el mejor","perfume de alta gama",
    "fragancias nicho","fragancia de nicho","perfume de diseñador",
    "de diseñador","perfume de lujo","algo exclusivo"
  ]},
  { intent: "preguntar_oferta", weight: 4, patterns: [
    "oferta","ofertas","descuento","descuentos","promocion","promoción",
    "rebaja","rebajas","combo","combos","2x1","dos por uno",
    "liquidación","liquidacion","sale","hay promo","tienen descuento",
    "alguna promo","alguna oferta","algo en oferta","precio especial",
    "precios especiales","tienen algo en oferta"
  ]},

  /* ── DURACIÓN Y CALIDAD ───────────────────────────────────── */
  { intent: "preguntar_duracion", weight: 5, patterns: [
    "cuanto dura","cuánto dura","dura mucho","larga duracion","larga duración",
    "que dure todo el dia","que dure todo el día","duradero","de larga duracion",
    "que aguante","que resista","cuantas horas dura","proyeccion","proyección",
    "sillage","se esparce mucho","que tan fuerte","cuánto tiempo dura",
    "persiste todo el día","que dure bastante","que dure 8 horas",
    "se fija bien","queda bien","se mantiene"
  ]},
  { intent: "preguntar_originalidad", weight: 6, patterns: [
    "son originales","son autenticos","son auténticos","son legítimos",
    "son de verdad","no son falsos","no son replica","no son copia",
    "genuino","original","son piratas","son imitación","son imitacion",
    "fake","importado","de fabrica","con sello","garantizados",
    "son 100% originales","tienen garantia","vienen sellados","son autentico"
  ]},

  /* ── LOGÍSTICA ────────────────────────────────────────────── */
  { intent: "preguntar_envio", weight: 4, patterns: [
    "envio","envío","delivery","entrega","mandan","envian","envían",
    "a domicilio","hacen delivery","a que zonas","a que ciudades",
    "cuanto tarda","cuánto tarda","tiempo de entrega","cuando llega","cuándo llega",
    "entrega a domicilio","despachan","llegan a","mandan a","hacen envíos",
    "cómo me lo entregan","despacho a domicilio","envian a provincia",
    "a todo el país","a mi ciudad","me lo traen"
  ]},
  { intent: "preguntar_pago", weight: 4, patterns: [
    "pago","pagar","metodo de pago","método de pago","como pago","cómo pago",
    "formas de pago","aceptan tarjeta","tarjeta","credito","crédito",
    "debito","débito","efectivo","transferencia","deposito","depósito",
    "pago movil","pago móvil","pago en efectivo","pago por transferencia",
    "azul","contraentrega","pago contra entrega","cómo se paga"
  ]},
  { intent: "preguntar_stock", weight: 3, patterns: [
    "tienen","hay ","existe","disponible","en stock","lo tienen","queda",
    "cuantos quedan","cuántos quedan","agotado","disponibilidad",
    "en inventario","tiene ese","está disponible","queda en stock",
    "hay disponibilidad","tienen existencia","hay en inventario"
  ]},
  { intent: "preguntar_tamaño", weight: 3, patterns: [
    "tamaño","tamaños","ml","mililitros","50ml","100ml","200ml",
    "que tamanos","qué tamaños","pequeño","grande","mini","mediano",
    "que tamaño recomiendas","en qué tamaño","qué presentación",
    "presentaciones","en cuántos ml","tamaño del frasco"
  ]},

  /* ── PROCESO DE COMPRA ────────────────────────────────────── */
  { intent: "como_comprar", weight: 4, patterns: [
    "como compro","cómo compro","como pido","cómo pido",
    "como hago el pedido","cómo hago el pedido","proceso de compra",
    "quiero pedir","hacer un pedido","como se hace","como funciona",
    "como ordenar","hacer pedido","quiero comprar","comprar ahora",
    "como hago para comprar","cómo es el proceso","pasos para comprar",
    "quiero ordenar","cómo realizo mi pedido"
  ]},
  { intent: "preguntar_devolucion", weight: 3, patterns: [
    "devolucion","devolución","cambio","cambiar","devolver",
    "garantia","garantía","defecto","defectuoso","dañado",
    "no llego","no llegó","problema con mi pedido","queja","reclamo",
    "llegó roto","llegó mal","llegó en mal estado","quiero devolver",
    "no funciona","está dañado","problema con el pedido"
  ]},

  /* ── INFORMACIÓN ──────────────────────────────────────────── */
  { intent: "preguntar_horario", weight: 2, patterns: [
    "horario","cuando abren","cuándo abren","estan abiertos","están abiertos",
    "atienden","horas de atencion","a qué hora","que horas son",
    "cuando atienden","cuándo atienden","abren hoy","atienden hoy",
    "horario de atencion","a qué horas atienden","abren los domingos"
  ]},
  { intent: "pedir_contacto", weight: 3, patterns: [
    "numero de telefono","número de teléfono","whatsapp","contacto",
    "como los contacto","hablar con un humano","hablar con una persona",
    "quiero hablar","atención al cliente","quiero comunicarme",
    "número de whatsapp","contactarlos","instagram","redes sociales",
    "facebook","tiktok","hablar con persona","quiero atención humana"
  ]},
  { intent: "ver_catalogo", weight: 4, patterns: [
    "ver catalogo","ver catálogo","ver todos los perfumes","mostrar productos",
    "todos los productos","que tienen","que perfumes tienen","muéstrame",
    "listado de productos","ver todo","ver productos","catalogo","catálogo",
    "qué tienes","enseñame","quiero ver","dame el catálogo","muéstrame todo"
  ]},
  { intent: "pedir_recomendacion", weight: 7, patterns: [
    "recomiendame","recomiéndame","sugiéreme","que me recomiendas",
    "cual recomiendas","ayudame a elegir","no se cual","no sé qué comprar",
    "me puedes ayudar","me ayudas","cual es mejor","qué perfume debería",
    "perfume ideal","perfume perfecto","buen perfume","mejor perfume",
    "cuál comprar","qué comprar","qué elegir","cuál elegir",
    "que me aconsejas","no sé cuál elegir","cuál me conviene",
    "qué opinas","cuál es tu favorito","cuál recomiendas tú",
    "cuál se vende más","qué perfume es popular"
  ]},
  { intent: "mas_vendidos", weight: 5, patterns: [
    "mas vendido","más vendido","mas popular","más popular","tendencia",
    "en tendencia","viral","lo que mas venden","el mas vendido",
    "top","los mejores","los favoritos","lo que todo el mundo usa",
    "el que más se vende","el favorito","más solicitado","más pedido",
    "qué perfume está de moda","cuál es la tendencia","cuál está viral"
  ]},
  { intent: "info_tienda", weight: 2, patterns: [
    "quienes son","sobre la tienda","acerca de","historia",
    "son confiables","son de fiar","tienen tienda fisica","tienen local",
    "donde estan ubicados","ubicacion","ubicación","de dónde son",
    "qué es onne store","qué es esta tienda","información de la tienda"
  ]},
  { intent: "upsell_crema", weight: 4, patterns: [
    "crema que combine","algo para el cuerpo","complementar el perfume",
    "otros productos","que más tienen","mas productos","algo para acompañar",
    "tiene algo relacionado","productos relacionados","qué más tienen",
    "algo para combinar","qué más me recomiendas"
  ]},
];

/* ═══════════════════════════════════════════════════════════════
   SECCIÓN 3 — MOTOR DE RECOMENDACIÓN (reglas + scoring)
   ═══════════════════════════════════════════════════════════════ */
window.ONNE_RECOMMENDATION_ENGINE = {
  rules: [
    // Aromas
    { if: "aroma == dulce",    show: "perfumes_dulces",    priority: 10 },
    { if: "aroma == floral",   show: "perfumes_florales",  priority: 10 },
    { if: "aroma == frutal",   show: "perfumes_frutales",  priority: 10 },
    { if: "aroma == fresco",   show: "perfumes_frescos",   priority: 10 },
    { if: "aroma == citrico",  show: "perfumes_citricos",  priority: 10 },
    { if: "aroma == madera",   show: "perfumes_amaderados",priority: 10 },
    { if: "aroma == oriental", show: "perfumes_orientales",priority: 10 },
    { if: "aroma == intenso",  show: "perfumes_intensos",  priority: 10 },
    { if: "aroma == vainilla", show: "perfumes_vainilla",  priority: 10 },
    { if: "aroma == suave",    show: "perfumes_suaves",    priority: 10 },
    // Género
    { if: "genero == hombre",  show: "perfumes_hombre",    priority: 8  },
    { if: "genero == mujer",   show: "perfumes_mujer",     priority: 8  },
    { if: "genero == unisex",  show: "perfumes_unisex",    priority: 8  },
    // Ocasión
    { if: "ocasion == regalo", show: "perfumes_mas_vendidos", priority: 9 },
    { if: "ocasion == cita",   show: "perfumes_seductores",   priority: 9 },
    { if: "ocasion == noche",  show: "perfumes_noche",        priority: 9 },
    { if: "ocasion == diario", show: "perfumes_diario",       priority: 7 },
    // Precio
    { if: "presupuesto == bajo",  show: "perfumes_economicos", priority: 7 },
    { if: "presupuesto == alto",  show: "perfumes_premium",    priority: 7 },
    // Marcas
    { if: "marca == victoria_secret", show: "productos_vs",   priority: 10 },
    { if: "marca == bath_body",       show: "productos_bbw",  priority: 10 },
  ],
  scoring: {
    featured: 5,
    new: 4,
    onSale: 3,
    inStock: 2,
    hasImage: 1,
    hasDescription: 1,
  }
};

/* ═══════════════════════════════════════════════════════════════
   SECCIÓN 4 — FLUJOS CONVERSACIONALES COMPLETOS
   ═══════════════════════════════════════════════════════════════ */
window.ONNE_CONVERSATION_FLOWS = {

  bienvenida: {
    id: "bienvenida",
    trigger: ["saludo"],
    pasos: [
      { id: "welcome",    msg: `¡Hola! 👋 Bienvenido/a.<br><br>Soy tu asesor de fragancias. Puedo ayudarte a encontrar el perfume o crema perfecta 🌹<br><br>¿Estás buscando un <strong>perfume</strong>, una <strong>crema</strong> o algo para <strong>regalar</strong>?` }
    ]
  },

  recomendacion: {
    id: "recomendacion",
    trigger: ["pedir_recomendacion", "ver_catalogo", "mas_vendidos"],
    pasos: [
      {
        id: "ask_tipo",
        msg: `¡Con gusto! 🌹<br><br>Para recomendarte lo ideal necesito saber:<br><br>¿Buscas un <strong>perfume</strong> o una <strong>crema corporal</strong>?`,
        opciones: ["Perfume 🌹", "Crema 🧴", "Los dos ✨"],
        next_step: "ask_gender"
      },
      {
        id: "ask_gender",
        msg: `¿El perfume es para:<br><br>👔 <strong>Hombre</strong><br>👗 <strong>Mujer</strong><br>✨ <strong>Unisex</strong>`,
        next_step: "ask_aroma"
      },
      {
        id: "ask_aroma",
        msg: `¡Perfecto! ¿Qué tipo de aroma prefieres?<br><br>🍯 <strong>Dulce</strong> — vainilla, caramelo<br>🌸 <strong>Floral</strong> — rosa, jazmín<br>🌊 <strong>Fresco</strong> — acuático, cítrico<br>🌿 <strong>Amaderado</strong> — cedro, oud<br>🌙 <strong>Intenso</strong> — oriental, especiado`,
        next_step: "ask_budget"
      },
      {
        id: "ask_budget",
        msg: `¿Cuál es tu presupuesto?<br><br>💵 <strong>Hasta RD$2,000</strong><br>💵 <strong>RD$2,000 – 4,000</strong><br>💵 <strong>Más de RD$4,000</strong><br>💵 <strong>Sin límite — lo mejor</strong>`,
        next_step: "show_results"
      },
      {
        id: "show_results",
        msg: `🌹 Basándome en tus preferencias, aquí tienes mis mejores recomendaciones:`,
        next_step: null
      }
    ]
  },

  regalo: {
    id: "regalo",
    trigger: ["para_regalo"],
    pasos: [
      {
        id: "ask_gift_gender",
        msg: `🎁 ¡Qué detalle tan especial!<br><br>¿El regalo es para:<br><br>👔 <strong>Hombre</strong><br>👗 <strong>Mujer</strong><br>✨ <strong>Unisex / Sorpresa</strong>`,
        next_step: "ask_gift_budget"
      },
      {
        id: "ask_gift_budget",
        msg: `¿Cuál es tu presupuesto para el regalo?<br><br>💵 <strong>Hasta RD$2,000</strong><br>💵 <strong>RD$2,000 – 4,000</strong><br>💵 <strong>Más de RD$4,000</strong>`,
        next_step: "show_gift_results"
      },
      {
        id: "show_gift_results",
        msg: `🎁 ¡Aquí tienes los perfumes más populares para regalo:`,
        next_step: null
      }
    ]
  },

  crema: {
    id: "crema",
    trigger: ["buscar_crema"],
    pasos: [
      {
        id: "ask_brand",
        msg: `🧴 ¡Tenemos dos líneas increíbles!<br><br>🌸 <strong>Victoria's Secret</strong> — sensuales y femeninos<br>🌿 <strong>Bath & Body Works</strong> — aromas únicos<br><br>¿Cuál te interesa más?`,
        opciones: ["Victoria's Secret 🌸", "Bath & Body Works 🌿", "Las dos"],
        next_step: "show_crema_results"
      }
    ]
  },

  cita_noche: {
    id: "cita_noche",
    trigger: ["para_cita", "para_noche"],
    pasos: [
      {
        id: "ask_cita_gender",
        msg: `🌹 ¡Qué emocionante!<br><br>Para recomendarte el perfume perfecto para esa ocasión especial:<br><br>¿Es para <strong>hombre</strong> o <strong>mujer</strong>?`,
        next_step: "show_cita_results"
      }
    ]
  }
};

/* ═══════════════════════════════════════════════════════════════
   SECCIÓN 5 — REGLAS UPSELL Y CROSS-SELL
   ═══════════════════════════════════════════════════════════════ */
window.ONNE_UPSELL_RULES = [
  {
    id: "perfume_to_crema",
    trigger: "perfume_shown",
    delay_msgs: 2,
    condition: "always",
    msg: `💡 <strong>Tip de experta:</strong> Combinar el perfume con una crema del mismo aroma hace que dure el <strong>doble</strong> y se fije mejor en tu piel 🌹<br><br>¿Quieres ver cremas <strong>Victoria's Secret</strong> o <strong>Bath & Body Works</strong> que combinan?`,
    action: "mostrar_cremas"
  },
  {
    id: "vs_cross_sell",
    trigger: "victoria_secret_shown",
    delay_msgs: 1,
    condition: "brand == victoria_secret",
    msg: `🌸 ¡Excelente elección Victoria's Secret!<br><br>También tenemos la <strong>crema</strong> y el <strong>body splash</strong> del mismo aroma. ¿Quieres hacer el set completo? ✨`,
    action: "mostrar_set_vs"
  },
  {
    id: "bbw_cross_sell",
    trigger: "bath_body_shown",
    delay_msgs: 1,
    condition: "brand == bath_body",
    msg: `🕯️ ¡Perfecta elección Bath & Body Works!<br><br>También tenemos el <strong>body lotion</strong> y <strong>body mist</strong> del mismo aroma. ¿Te interesa el set? 🌿`,
    action: "mostrar_set_bbw"
  },
  {
    id: "premium_upsell",
    trigger: "budget_medium_shown",
    delay_msgs: 1,
    condition: "budget == 4000",
    msg: `💎 ¿Sabías que por solo un poco más tienes acceso a fragancias <strong>nicho premium</strong> como Baccarat Rouge 540?<br><br>¿Quieres ver opciones premium? Son de otra categoría. ✨`,
    action: "mostrar_premium"
  },
  {
    id: "bundle_offer",
    trigger: "add_to_cart",
    delay_msgs: 0,
    condition: "always",
    msg: `🎁 ¡Perfecto! Antes de finalizar...<br><br>¿Te gustaría añadir una crema perfumada del mismo aroma? Muchos clientes hacen el set completo 🌹`,
    action: "mostrar_bundle"
  }
];

/* ═══════════════════════════════════════════════════════════════
   SECCIÓN 6 — DATASET COMPLETO JSON (exportable)
   1000 preguntas → 35 intenciones → respuestas + acciones
   ═══════════════════════════════════════════════════════════════ */
window.ONNE_TRAINING_DATASET = (function() {
  const responses = {
    buscar_dulce:    { resp: "¡Sí! 😊 Tenemos varios perfumes con notas dulces.<br><br>¿Quieres que te muestre los más vendidos?", accion: "mostrar_perfumes_dulces" },
    buscar_fresco:   { resp: "¡Claro! 🌊 Los frescos son perfectos para el día.<br><br>¿Quieres ver nuestras opciones más populares?", accion: "mostrar_perfumes_frescos" },
    buscar_floral:   { resp: "🌸 Tenemos una selección preciosa de florales.<br><br>¿Quieres que te envíe el enlace para verlos?", accion: "mostrar_perfumes_florales" },
    buscar_madera:   { resp: "🌿 Los amaderados son elegantes y sofisticados.<br><br>¿Quieres ver nuestra colección?", accion: "mostrar_perfumes_amaderados" },
    buscar_intenso:  { resp: "🔥 ¡Tenemos fragancias con excelente proyección!<br><br>¿Quieres que te muestre los más potentes?", accion: "mostrar_perfumes_intensos" },
    buscar_citrico:  { resp: "☀️ Los cítricos son ideales para el calor.<br><br>¿Quieres ver las opciones?", accion: "mostrar_perfumes_citricos" },
    buscar_oriental: { resp: "🌙 ¡Los orientales son puro lujo!<br><br>¿Quieres ver nuestra colección árabe?", accion: "mostrar_perfumes_orientales" },
    buscar_vainilla: { resp: "🍦 Los de vainilla son súper sensuales.<br><br>¿Quieres que te los muestre?", accion: "mostrar_perfumes_vainilla" },
    buscar_suave:    { resp: "🕊️ Los suaves son perfectos para el día a día.<br><br>¿Quieres ver opciones?", accion: "mostrar_perfumes_suaves" },
    buscar_hombre:   { resp: "👔 ¡Tenemos excelentes opciones para caballero!<br><br>¿Quieres que te muestre los más populares?", accion: "mostrar_perfumes_hombre" },
    buscar_mujer:    { resp: "👗 ¡Tenemos una colección preciosa para dama!<br><br>¿Quieres ver las opciones más vendidas?", accion: "mostrar_perfumes_mujer" },
    buscar_unisex:   { resp: "✨ ¡Los unisex son versátiles y únicos!<br><br>¿Quieres ver nuestra selección?", accion: "mostrar_perfumes_unisex" },
    para_regalo:     { resp: "🎁 ¡Qué detalle tan especial!<br><br>¿El regalo es para hombre, mujer o te ayudo a elegir?", accion: "flujo_regalo" },
    buscar_crema:    { resp: "🧴 ¡Sí! Tenemos cremas Victoria's Secret y Bath & Body Works.<br><br>¿Cuál prefieres?", accion: "mostrar_cremas" },
    buscar_victoria_secret: { resp: "🌸 ¡Tenemos productos Victoria's Secret!<br><br>¿Quieres que te muestre el catálogo?", accion: "mostrar_vs" },
    buscar_bath_body:{ resp: "🌿 ¡Tenemos Bath & Body Works!<br><br>¿Quieres ver nuestros productos disponibles?", accion: "mostrar_bbw" },
    preguntar_precio:{ resp: "💰 ¡Con gusto!<br><br>¿Cuál perfume te interesa? Te doy el precio al instante.", accion: "solicitar_nombre_producto" },
    buscar_economico:{ resp: "💵 ¡Claro! Tenemos excelentes opciones desde RD$1,500.<br><br>¿Quieres ver las más económicas?", accion: "mostrar_economicos" },
    buscar_premium:  { resp: "💎 ¡Excelente gusto! Tenemos fragancias premium y nicho.<br><br>¿Quieres ver la colección?", accion: "mostrar_premium" },
    preguntar_oferta:{ resp: "🏷️ ¡Sí tenemos ofertas!<br><br>¿Quieres que te muestre los productos en descuento?", accion: "mostrar_ofertas" },
    preguntar_duracion: { resp: "⏱️ Depende del tipo:<br><br>🔥 Orientales: 8–12h<br>🌸 Florales: 5–8h<br>🌊 Frescos: 4–6h<br><br>¿Quieres uno de larga duración?", accion: null },
    preguntar_originalidad: { resp: "✅ ¡Todos son 100% ORIGINALES!<br><br>Trabajamos solo con distribuidores oficiales. Vienen sellados con empaque original 🌹", accion: null },
    preguntar_envio: { resp: "📦 ¡Sí enviamos!<br><br>🏙️ SD: 1-2 días<br>🗺️ Interior: 2-4 días<br><br>Coordinamos por WhatsApp 📲", accion: null },
    preguntar_pago:  { resp: "💳 Formas de pago:<br><br>🏦 Transferencia<br>💵 Efectivo<br>💳 Tarjeta<br>📱 Pagos móviles", accion: null },
    preguntar_stock: { resp: "✅ Dime el perfume y te confirmo disponibilidad al instante 📲", accion: "solicitar_nombre_producto" },
    preguntar_tamaño:{ resp: "📏 Tamaños: 50ml · 100ml · 200ml<br><br>¿Cuál perfume te interesa? Te digo los tamaños disponibles.", accion: null },
    como_comprar:    { resp: "🛒 ¡Fácil!<br><br>1️⃣ Elige tu perfume<br>2️⃣ Escríbenos<br>3️⃣ Coordinamos pago y entrega<br>4️⃣ ¡Recíbelo en casa! 📦", accion: null },
    preguntar_devolucion: { resp: "🔄 Si hay algún inconveniente, contáctanos en 48h con foto. Lo resolvemos sin complicaciones ✅", accion: null },
    preguntar_horario: { resp: "🕐 Lun–Sáb: 9am – 7pm<br>Dom: Cerrado 📅", accion: null },
    pedir_contacto:  { resp: "📲 Escríbenos por WhatsApp. Horario: Lun–Sáb 9am–7pm<br><br>¡Respondemos en minutos! 😊", accion: null },
    ver_catalogo:    { resp: "🛍️ ¿Para hombre, mujer o unisex?<br><br>Dímelo y te muestro las mejores opciones 😊", accion: "iniciar_flujo_recomendacion" },
    pedir_recomendacion: { resp: "¡Con gusto! 🌹<br><br>¿El perfume es para hombre, mujer o es un regalo?", accion: "iniciar_flujo_recomendacion" },
    mas_vendidos:    { resp: "🏆 ¿Los más vendidos para hombre o mujer?<br><br>Dímelo y te muestro el top 😊", accion: "mostrar_top_ventas" },
    info_tienda:     { resp: "🌹 Somos una tienda de perfumes 100% originales, cremas VS y BBW en RD.<br><br>✅ Originales · 🚚 Envíos · 💎 Asesoría personalizada", accion: null },
    upsell_crema:    { resp: "✨ ¡Excelente idea! Combinar perfume y crema del mismo aroma hace que dure el doble.<br><br>¿Quieres ver las cremas disponibles? 😊", accion: "mostrar_cremas" },
    para_cita:       { resp: "🌹 ¡Para una cita especial necesitas algo irresistible!<br><br>¿Es para hombre o mujer? Te recomiendo los más seductores.", accion: "iniciar_flujo_cita" },
    para_noche:      { resp: "🌙 ¡Para la noche necesitas algo que impacte!<br><br>¿Es para hombre o mujer?", accion: "iniciar_flujo_noche" },
    para_diario:     { resp: "☀️ Para uso diario lo ideal es algo fresco y moderado.<br><br>¿Para hombre o mujer? Te recomiendo los más versátiles.", accion: "iniciar_flujo_recomendacion" },
    gracias:         { resp: "¡Con mucho gusto! 😊<br><br>Si necesitas algo más, aquí estaré. ¡Que disfrutes tu fragancia! 🌹", accion: null },
    despedida:       { resp: "¡Hasta pronto! 🌹 Fue un placer ayudarte.", accion: null },
  };

  // Generar dataset completo: cada patrón de cada intención
  const dataset = [];
  for (const ip of window.ONNE_INTENT_PATTERNS) {
    const r = responses[ip.intent] || { resp: "¿En qué más puedo ayudarte? 😊", accion: null };
    for (const pattern of ip.patterns) {
      dataset.push({
        question: pattern,
        intent: ip.intent,
        response: r.resp,
        action: r.accion,
        training_input: pattern,
        training_intent: ip.intent
      });
    }
  }
  return dataset;
})();

/* ═══════════════════════════════════════════════════════════════
   SECCIÓN 7 — EXPORT FUNCTION (para descarga JSON)
   ═══════════════════════════════════════════════════════════════ */
window.ONNE_EXPORT_JSON = function() {
  const stats = {
    total_intents: window.ONNE_INTENT_PATTERNS.length,
    total_patterns: window.ONNE_INTENT_PATTERNS.reduce((s,ip)=>s+ip.patterns.length, 0),
    total_dataset: window.ONNE_TRAINING_DATASET.length,
    aroma_families: Object.keys(window.ONNE_AROMA_MAP).length,
    upsell_rules: window.ONNE_UPSELL_RULES.length,
    conversation_flows: Object.keys(window.ONNE_CONVERSATION_FLOWS).length,
  };

  return {
    meta: {
      version: "v71",
      store: "Onne Store RD",
      type: "perfumeria",
      generated: new Date().toISOString(),
      stats
    },
    bot_config: {
      chat_modes: ["bot_programado", "bot_ia"],
      store_type: "perfumeria",
      brands: ["Victoria Secret", "Bath and Body Works"],
      ...stats
    },
    aroma_map: window.ONNE_AROMA_MAP,
    intentions: window.ONNE_INTENT_PATTERNS.map(ip => ({
      intent: ip.intent,
      weight: ip.weight,
      pattern_count: ip.patterns.length,
      patterns: ip.patterns
    })),
    recommendation_engine: window.ONNE_RECOMMENDATION_ENGINE,
    conversation_flows: window.ONNE_CONVERSATION_FLOWS,
    upsell_rules: window.ONNE_UPSELL_RULES,
    questions_dataset: window.ONNE_TRAINING_DATASET,
    training_data: window.ONNE_TRAINING_DATASET.map(d => ({
      input: d.training_input,
      intent: d.training_intent,
      action: d.action
    }))
  };
};

})();

/* ═══ chatbot.js ═════════════════════════════════════════════════════════════════════ */
// ═══════════════════════════════════════════════════════════════
//  Onne Store RD — Chatbot Engine v72
//  ─────────────────────────────────────────────────────────────
//  ✅ Memoria de conversación completa
//  ✅ Anti-repetición de respuestas
//  ✅ Respuestas naturales con variantes
//  ✅ Flujos inteligentes sin preguntas redundantes
//  ✅ Persona humana — nunca revela que es IA
//  ✅ Upsell/Cross-sell contextual
//  ✅ Modo Bot IA mejorado (Claude + OpenRouter)
// ═══════════════════════════════════════════════════════════════
(function(){ "use strict";

/* ─────────────────────────────────────────────────────────────
   BANCO DE VARIANTES DE RESPUESTA
   Cada respuesta tiene 4-6 versiones para evitar repeticiones
   ───────────────────────────────────────────────────────────── */
const V = {
  // Saludos por hora
  greet_morning: ["¡Buenos días! ☀️","¡Buen día! 😊","¡Buenos días! 🌟"],
  greet_afternoon:["¡Buenas tardes! 😊","¡Hola buenas tardes! 🌺","¡Buenas! 😊"],
  greet_evening:  ["¡Buenas noches! 🌙","¡Hola! 🌙","¡Buenas noches! ✨"],

  // Transiciones / continuaciones
  perfect:  ["¡Perfecto!","¡Excelente!","¡Genial!","¡Buenísimo!","¡Qué bien!"],
  noted:    ["Anotado 📝","Entendido 😊","¡Listo!","De acuerdo","¡Perfecto, lo tengo!"],
  sure:     ["¡Claro!","¡Por supuesto!","¡Claro que sí!","¡Con gusto!","¡Seguro!"],
  help:     ["Estoy aquí para ayudarte 😊","¡Cuéntame!","Con mucho gusto","Puedo orientarte","¡Con gusto te ayudo!"],
  interest: ["¿Te interesa?","¿Qué te parece?","¿Lo ves bien?","¿Te llama la atención?","¿Te gusta alguna opción?"],

  // Ofrecer más
  more:     ["¿Quieres ver más opciones?","¿Te muestro otras alternativas?","¿Hay algo específico que busques?","¿Quieres que te recomiende algo diferente?"],

  // Cerrar venta
  close:    [
    "¿Te interesa apartar alguno? ¡Escríbenos y lo reservamos ahora mismo! 📲",
    "Si te decide por alguno, escríbenos y lo coordinamos 📲",
    "¿Lo apartamos? Solo escríbenos y listo 🌹",
    "Cualquier consulta, escríbenos directamente 📲",
  ],

  // Pedir género (si no lo sabe)
  ask_gender: [
    "¿Es para hombre o mujer?",
    "¿Para él o para ella?",
    "¿Lo buscas para hombre o mujer?",
    "¿Es para un caballero o una dama?",
  ],

  // Pedir aroma (si no lo sabe)
  ask_aroma: [
    "¿Qué tipo de aroma prefieres?<br>🍯 Dulce · 🌸 Floral · 🌊 Fresco · 🌿 Amaderado · 🌙 Intenso",
    "¿Cómo te gustan los aromas?<br>🍯 Dulce y cálido · 🌸 Floral · 🌊 Fresco y ligero · 🌿 Madera · 🌙 Intenso u oriental",
    "¿Tienes preferencia de aroma?<br>🍯 Dulce · 🌸 Floral · 🌊 Fresco · 🌿 Amaderado · 🌙 Oriental o intenso",
  ],

  // Recordar preferencia (natural)
  remember_gender: [
    "Ya que buscas algo para {g}, te muestro esto:",
    "Como me comentaste que es para {g}:",
    "Siguiendo con tu búsqueda para {g}:",
    "Para {g} tenemos estas opciones:",
  ],
  remember_aroma: [
    "Como te gustan los aromas {a}:",
    "Siguiendo con tu preferencia de aromas {a}:",
    "Ya que te gustan los {a}:",
    "Para aromas {a} tenemos:",
  ],

  // Upsell natural
  upsell_crema: [
    "💡 <strong>Dato:</strong> Si combinas el perfume con una crema del mismo aroma, dura el doble en tu piel 🌹<br>¿Quieres ver cremas que combinan?",
    "✨ ¿Sabías que aplicar una crema hidratante antes del perfume hace que se fije mucho mejor?<br>Tenemos cremas VS y Bath & Body Works que combinan perfecto.",
    "🌹 Muchos de nuestros clientes hacen el set completo: perfume + crema del mismo aroma.<br>¿Te muestro las cremas disponibles?",
  ],
  upsell_vs: [
    "🌸 ¡Excelente elección VS! También tenemos la crema y el body splash del mismo aroma para hacer el set completo ✨",
    "🌸 ¿Sabías que Victoria's Secret tiene el body lotion del mismo aroma? Juntos duran mucho más.",
  ],
  upsell_bbw: [
    "🕯️ ¡Perfecta elección BBW! También tenemos el body lotion y body mist del mismo aroma. ¿Te interesa el set? 🌿",
    "🌿 Bath & Body Works tiene el set completo: body lotion + body mist del mismo aroma. ¿Lo armamos?",
  ],

  // Confirmar disponibilidad
  available: ["✅ Disponible","✅ En stock","✅ Lo tenemos"],
  low_stock: ["⚠️ Últimas unidades","⚠️ Quedan pocas","⚠️ Casi agotado"],
};

// Selección aleatoria o por turno (evita repetir)
function pick(key, state) {
  const arr = V[key];
  if (!arr || !arr.length) return "";
  const used = (state._varUsed = state._varUsed || {});
  if (!used[key]) used[key] = 0;
  const idx = used[key] % arr.length;
  used[key]++;
  return arr[idx];
}

/* ─────────────────────────────────────────────────────────────
   MOTOR PRINCIPAL — window.OnneChatbot
   ───────────────────────────────────────────────────────────── */
window.OnneChatbot = {

  /* ── Utilidades ─────────────────────────────────────────── */
  norm(s){ return String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim(); },
  has(text,...words){ const t=this.norm(text); return words.some(w=>t.includes(this.norm(w))); },
  esc(s){ return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); },
  rnd(arr){ return arr[Math.floor(Math.random()*arr.length)]; },
  pick(key,state){ return pick(key,state); },

  getProducts(){ return (window.__cfg||{}).products||[]; },
  getChatbot(){  return (window.__cfg||{}).whatsapp?.chatbot||{}; },

  /* ─────────────────────────────────────────────────────────
     SISTEMA DE MEMORIA DE CONVERSACIÓN
     Extrae y guarda preferencias del texto del usuario
     ───────────────────────────────────────────────────────── */
  extractAndSavePrefs(text, state) {
    const mem = (state.memory = state.memory || {});

    // Género
    if (!mem.gender) {
      if (this.has(text,"hombre","masculino","caballero","para él","para el","novio","esposo","papa","hermano","chico")) mem.gender = "Masculino";
      else if (this.has(text,"mujer","femenino","dama","para ella","novia","esposa","mama","hermana","chica")) mem.gender = "Femenino";
      else if (this.has(text,"unisex","ambos","los dos","cualquiera")) mem.gender = "Unisex";
    }

    // Aroma
    if (!mem.aroma) {
      mem.aroma = this.detectAroma(text) || mem.aroma;
    }

    // Presupuesto
    const budget = this.detectBudget(text);
    if (budget < 99999 && !mem.budget) mem.budget = budget;

    // Nombre del cliente (si se presenta)
    const nameMatch = this.norm(text).match(/(?:me llamo|soy|mi nombre es)\s+([a-záéíóúñ]+)/);
    if (nameMatch && !mem.name) mem.name = nameMatch[1].charAt(0).toUpperCase() + nameMatch[1].slice(1);

    // Marca preferida
    if (!mem.brand) {
      if (this.has(text,"victoria","victoria's secret","vs")) mem.brand = "victoria";
      else if (this.has(text,"bath","body works","bbw")) mem.brand = "bath";
    }

    // Ocasión
    if (!mem.ocasion) {
      if (this.has(text,"regalo","regalar","sorpresa","cumpleaños","aniversario")) mem.ocasion = "regalo";
      else if (this.has(text,"cita","conquista","seducir","enamorar")) mem.ocasion = "cita";
      else if (this.has(text,"trabajo","oficina","diario","cotidiano")) mem.ocasion = "diario";
      else if (this.has(text,"fiesta","noche","evento","boda","graduacion")) mem.ocasion = "noche";
    }

    return mem;
  },

  /* ─────────────────────────────────────────────────────────
     ANTI-REPETICIÓN
     Guarda las últimas N respuestas y evita repetir
     ───────────────────────────────────────────────────────── */
  dedupeReply(reply, state) {
    const hist = (state._replyHist = state._replyHist || []);
    // Fingerprint: primeros 60 chars normalize
    const fp = this.norm(reply).substring(0, 60);
    if (hist.includes(fp)) {
      // Añadir variación sutil
      const suffixes = [" 😊","","<br><br>¿Puedo ayudarte con algo más?",""];
      return reply + this.rnd(suffixes);
    }
    hist.push(fp);
    if (hist.length > 8) hist.shift();
    return reply;
  },

  /* ─────────────────────────────────────────────────────────
     DETECTORES
     ───────────────────────────────────────────────────────── */
  detectIntent(text) {
    const t = this.norm(text);
    const patterns = window.ONNE_INTENT_PATTERNS || [];
    let best = null, bestScore = 0;
    for (const ip of patterns) {
      for (const pattern of ip.patterns) {
        const p = this.norm(pattern);
        if (t.includes(p)) {
          const score = p.length * (ip.weight || 1);
          if (score > bestScore) { bestScore = score; best = ip.intent; }
        }
      }
    }
    return { intent: best, confidence: bestScore };
  },

  detectAroma(text) {
    const t = this.norm(text);
    const aromaMap = window.ONNE_AROMA_MAP || {};
    for (const [key, info] of Object.entries(aromaMap)) {
      for (const kw of (info.palabras_cliente || [])) {
        if (t.includes(this.norm(kw))) return key;
      }
    }
    return null;
  },

  detectGender(text) {
    if (this.has(text,"hombre","masculino","caballero","chico","novio","papa","esposo","para el","para él","para un hombre","para él")) return "Masculino";
    if (this.has(text,"mujer","femenino","dama","chica","novia","mama","esposa","para ella","para una mujer")) return "Femenino";
    if (this.has(text,"unisex","ambos","cualquiera","neutral","los dos","para los dos")) return "Unisex";
    return null;
  },

  detectBudget(text) {
    if (this.has(text,"2000","dos mil","bajo","economico","barato","poco","menos de 2","no tengo mucho")) return 2000;
    if (this.has(text,"4000","cuatro mil","medio","moderado","razonable","entre 2")) return 4000;
    return 99999;
  },

  /* ─────────────────────────────────────────────────────────
     MOTOR DE SCORING Y FILTRADO DEL CATÁLOGO
     ───────────────────────────────────────────────────────── */
  scoreProduct(p, aroma, gender, budget) {
    const scoring = (window.ONNE_RECOMMENDATION_ENGINE || {}).scoring || {};
    let score = 0;
    if (p.featured) score += (scoring.featured || 5);
    if (p.new)      score += (scoring.new || 4);
    if (p.onSale)   score += (scoring.onSale || 3);
    if (!p.stock || p.stock > 0) score += (scoring.inStock || 2);
    if (p.image)    score += (scoring.hasImage || 1);
    if (p.description) score += (scoring.hasDescription || 1);
    if (aroma && p.description) {
      const aromaInfo = (window.ONNE_AROMA_MAP || {})[aroma];
      if (aromaInfo) {
        const hay = this.norm(`${p.description} ${p.name}`);
        for (const kw of (aromaInfo.notas || [])) {
          if (hay.includes(this.norm(kw))) score += 8;
        }
      }
    }
    return score;
  },

  filterAndScore(prods, { gender, budget, aroma } = {}) {
    return prods
      .filter(p => {
        if (gender && gender !== "Unisex") {
          const g = this.norm(p.gender || "Unisex");
          if (gender === "Masculino" && !g.includes("masc") && !g.includes("uni") && !g.includes("hom")) return false;
          if (gender === "Femenino"  && !g.includes("fem")  && !g.includes("uni") && !g.includes("muj") && !g.includes("dam")) return false;
        }
        if (budget && budget < 99999) {
          const pr = (p.onSale && p.salePrice) ? p.salePrice : (p.price || 0);
          if (pr > budget) return false;
        }
        return true;
      })
      .map(p => ({ p, score: this.scoreProduct(p, aroma, gender, budget) }))
      .sort((a, b) => b.score - a.score)
      .map(x => x.p);
  },

  searchProducts(query, prods) {
    if (!prods?.length) return [];
    const q = this.norm(query);
    const terms = q.split(/\s+/).filter(w => w.length > 2);
    return prods.map(p => {
      const hay = this.norm(`${p.name||""} ${p.brand||""} ${p.description||""} ${p.gender||""}`);
      const s = terms.reduce((acc, t) => acc + (hay.includes(t) ? 3 : 0) + (hay.includes(t.slice(0, 4)) ? 1 : 0), 0);
      return { p, s };
    }).filter(x => x.s > 0).sort((a, b) => b.s - a.s).map(x => x.p);
  },

  searchKB(text, kb) {
    if (!kb || kb.trim().length < 10) return null;
    const qw = this.norm(text).split(/\s+/).filter(w => w.length > 3);
    if (!qw.length) return null;
    const lines = kb.split("\n").map(l => l.trim()).filter(l => l.length > 8);
    const scored = lines.map(line => {
      const low = this.norm(line);
      const s = qw.reduce((acc, w) => acc + (low.includes(w) ? 3 : 0) + (low.includes(w.slice(0, 4)) ? 1 : 0), 0);
      return { line, s };
    }).filter(x => x.s > 1).sort((a, b) => b.s - a.s);
    if (!scored.length) return null;
    return `<div>📋 ${scored.slice(0, 3).map(x => x.line).join("<br>")}<br><small style="color:#aaa;font-size:.8em">¿Necesitas más detalles? 😊</small></div>`;
  },

  /* ─────────────────────────────────────────────────────────
     FORMATEO DE PRODUCTOS
     ───────────────────────────────────────────────────────── */
  formatProduct(p, showLink = true) {
    const pr = p.onSale && p.salePrice
      ? `RD$${p.salePrice} <span style="text-decoration:line-through;color:#bbb;font-size:.8em">RD$${p.price}</span> 🏷️`
      : `RD$${p.price || "Consultar"}`;
    const badges = [p.new && "🆕", p.featured && "⭐", p.onSale && "🏷️"].filter(Boolean).join(" ");
    const avail = (!p.stock || p.stock > 0)
      ? `<span style="color:#16a34a;font-size:.8em">✅ Disponible</span>`
      : `<span style="color:#ef4444;font-size:.8em">⚠️ Últimas unidades</span>`;
    const name = showLink && p.id
      ? `<a href="#product/${p.id}" style="font-weight:700;color:inherit;text-decoration:none">🌹 ${this.esc(p.name)}</a>`
      : `<strong>🌹 ${this.esc(p.name)}</strong>`;
    const brand = p.brand ? ` <span style="color:#aaa;font-size:.85em">— ${this.esc(p.brand)}</span>` : "";
    const desc = p.description
      ? `<div style="font-size:.8em;color:#888;margin-top:2px;line-height:1.4">${this.esc(p.description.substring(0, 80))}${p.description.length > 80 ? "…" : ""}</div>`
      : "";
    return `<div style="padding:7px 0;border-bottom:1px solid rgba(0,0,0,.06);line-height:1.5">${name}${brand} ${badges}<br><span style="font-size:.85em">💰 ${pr}</span> · ${avail}${desc}</div>`;
  },

  buildProductList(list, title, shopLink = true) {
    if (!list?.length) return null;
    const items = list.slice(0, 4).map(p => this.formatProduct(p)).join("");
    const catalog = shopLink ? `<div style="margin-top:8px"><a href="#shop" style="color:inherit;font-weight:600;font-size:.85em">🛍️ Ver catálogo completo →</a></div>` : "";
    return `<div>${title ? `<div style="font-weight:700;margin-bottom:6px;font-size:.9em">${title}</div>` : ""}${items}${catalog}</div>`;
  },

  /* ─────────────────────────────────────────────────────────
     INTRO CON MEMORIA — usa contexto para personalizar
     ───────────────────────────────────────────────────────── */
  buildIntro(state, template, fallback) {
    const mem = state.memory || {};
    if (template && mem.gender) {
      const gLabel = mem.gender === "Masculino" ? "caballero" : mem.gender === "Femenino" ? "dama" : "uso unisex";
      return template.replace("{g}", gLabel).replace("{gender}", mem.gender);
    }
    if (template && mem.aroma) {
      const aromaInfo = (window.ONNE_AROMA_MAP || {})[mem.aroma] || {};
      return template.replace("{a}", aromaInfo.label || mem.aroma);
    }
    return fallback;
  },

  /* ─────────────────────────────────────────────────────────
     SMART REPLY — Motor principal (Bot Programado)
     
     Mejoras v72:
     - Extrae preferencias antes de cualquier respuesta
     - Si ya tiene género/aroma en memoria, NO pregunta de nuevo
     - Respuestas con variantes aleatorias
     - Anti-repetición activa
     - Contexto acumulativo
     ───────────────────────────────────────────────────────── */
  smartReply(userText, state) {
    const prods = this.getProducts();
    const cb    = this.getChatbot();
    const kb    = cb.knowledgeBase || "";
    const storeName = cb.name || "Onne Store RD";

    // Extraer y guardar preferencias del mensaje actual
    const mem = this.extractAndSavePrefs(userText, state);

    const R = (reply) => ({ reply: this.dedupeReply(reply, state), state });

    /* ── FLUJOS MULTI-TURNO ─────────────────────────────── */

    if (state.step === "ask_tipo") {
      if (this.has(userText, "crema", "locion", "loción", "body")) {
        state.step = "ask_crema_brand"; state.tipo = "crema";
        return R(`🧴 Tenemos dos líneas espectaculares:<br><br>🌸 <strong>Victoria's Secret</strong> — sensuales y femeninos<br>🌿 <strong>Bath & Body Works</strong> — aromas únicos<br><br>¿Cuál prefieres?`);
      }
      state.step = "ask_gender"; state.tipo = "perfume";
      // Si ya tiene género en memoria, saltar directo al aroma
      if (mem.gender) {
        state.step = "ask_aroma";
        return R(`${pick("perfect", state)} ¿Qué tipo de aroma te gusta?<br><br>🍯 Dulce · 🌸 Floral · 🌊 Fresco · 🌿 Amaderado · 🌙 Intenso`);
      }
      return R(`¿El perfume es para:<br><br>👔 <strong>Hombre</strong><br>👗 <strong>Mujer</strong><br>✨ <strong>Unisex</strong>`);
    }

    if (state.step === "ask_gender") {
      if (mem.gender) {
        state.step = mem.aroma ? "ask_budget" : "ask_aroma";
        const icon = mem.gender === "Masculino" ? "👔" : mem.gender === "Femenino" ? "👗" : "✨";
        if (mem.aroma) {
          state.step = "ask_budget";
          return R(`${icon} ${pick("perfect", state)} ¿Cuál es tu presupuesto?<br><br>💵 Hasta RD$2,000 · RD$2,000–4,000 · Más de RD$4,000`);
        }
        return R(`${icon} ${pick("noted", state)} ¿Qué tipo de aroma prefieres?<br><br>🍯 <strong>Dulce</strong> · 🌸 <strong>Floral</strong> · 🌊 <strong>Fresco</strong> · 🌿 <strong>Amaderado</strong> · 🌙 <strong>Intenso</strong>`);
      }
      return R(`¿El perfume es para:<br><br>👔 <strong>Hombre</strong><br>👗 <strong>Mujer</strong><br>✨ <strong>Unisex</strong>`);
    }

    if (state.step === "ask_aroma") {
      if (mem.aroma) {
        state.step = "ask_budget";
        return R(`${pick("perfect", state)} ¿Y cuál es tu presupuesto?<br><br>💵 <strong>Hasta RD$2,000</strong><br>💵 <strong>RD$2,000 – 4,000</strong><br>💵 <strong>Más de RD$4,000</strong><br>💵 <strong>Sin límite</strong>`);
      }
      if (this.has(userText, "cualquiera", "indiferente", "no importa", "lo que sea", "sin preferencia")) {
        state.step = "ask_budget";
        return R(`${pick("sure", state)} ¿Cuál es tu presupuesto?<br><br>💵 Hasta RD$2,000 · RD$2,000–4,000 · Más de RD$4,000 · Sin límite`);
      }
      return R(`¿Cuál de estos aromas te gusta más?<br><br>🍯 <strong>Dulce</strong> · 🌸 <strong>Floral</strong> · 🌊 <strong>Fresco</strong> · 🌿 <strong>Amaderado</strong> · 🌙 <strong>Intenso</strong>`);
    }

    if (state.step === "ask_budget") {
      const budget = mem.budget || this.detectBudget(userText);
      if (!mem.budget && budget < 99999) mem.budget = budget;
      state.step = null;
      const filtered = this.filterAndScore(prods, { gender: mem.gender, budget, aroma: mem.aroma });
      const list = filtered.slice(0, 4);
      const fallback = list.length ? list : prods.filter(p => p.featured || p.new).slice(0, 4);
      state.lastAction = "perfume_shown";
      const aromaInfo = mem.aroma ? ((window.ONNE_AROMA_MAP || {})[mem.aroma] || {}) : {};
      const aromaLabel = aromaInfo.emoji ? ` ${aromaInfo.emoji} ${aromaInfo.label || mem.aroma}` : "";
      const title = `✨ Aquí están mis recomendaciones${aromaLabel}:`;
      const result = this.buildProductList(fallback.length ? fallback : prods.slice(0, 4), title);
      const upsell = state.upsellShown ? "" : `<br><br>${pick("upsell_crema", state)}`;
      state.upsellShown = true;
      return R((result || "¡Escríbenos y te asesoramos personalmente! 📲") + upsell);
    }

    if (state.step === "ask_gift_gender") {
      if (mem.gender) {
        state.step = "ask_gift_budget";
        return R(`${pick("noted", state)} ¿Cuál sería el presupuesto para el regalo?<br><br>💵 Hasta RD$2,000 · RD$2,000–4,000 · Más de RD$4,000`);
      }
      const g = this.detectGender(userText);
      if (g) {
        mem.gender = g; state.step = "ask_gift_budget";
        return R(`${pick("perfect", state)} ¿Cuál es el presupuesto?<br><br>💵 Hasta RD$2,000 · RD$2,000–4,000 · Más de RD$4,000`);
      }
      return R(`¿El regalo es para:<br><br>👔 <strong>Hombre</strong><br>👗 <strong>Mujer</strong><br>✨ <strong>Sorpresa</strong>`);
    }

    if (state.step === "ask_gift_budget") {
      const budget = mem.budget || this.detectBudget(userText);
      state.step = null;
      const filtered = this.filterAndScore(prods, { gender: mem.gender, budget });
      const list = filtered.filter(p => p.featured || p.new || p.onSale).slice(0, 4);
      const fallback = list.length ? list : filtered.slice(0, 4);
      return R((this.buildProductList(fallback.length ? fallback : prods.slice(0, 4), "🎁 Los más populares para regalo:") || "¡Escríbenos y te ayudamos a elegir el regalo perfecto! 📲") + `<br><br>${pick("close", state)}`);
    }

    if (state.step === "ask_crema_brand") {
      let brand = mem.brand;
      if (!brand) {
        if (this.has(userText, "victoria", "vs", "secret")) brand = "victoria";
        else if (this.has(userText, "bath", "body", "bbw")) brand = "bath";
      }
      state.step = null;
      const cremas = prods.filter(p => {
        if (!brand) return true;
        return this.norm(`${p.name || ""} ${p.brand || ""} ${p.description || ""}`).includes(brand);
      });
      const list = cremas.length ? cremas : prods.filter(p => p.featured).slice(0, 4);
      const title = brand === "victoria" ? "🌸 Cremas Victoria's Secret:" : brand === "bath" ? "🌿 Bath & Body Works:" : "🧴 Cremas disponibles:";
      const upsell = brand ? `<br><br>${pick(brand === "victoria" ? "upsell_vs" : "upsell_bbw", state)}` : "";
      return R((this.buildProductList(list, title) || "¡Escríbenos para ver el catálogo de cremas! 📲") + upsell);
    }

    /* ── RESPUESTAS PERSONALIZADAS ADMIN ─────────────────── */
    const adminReplies = Array.isArray(cb.botReplies) ? cb.botReplies : [];
    const t = this.norm(userText);
    for (const r of adminReplies) {
      if (r.keyword && t.includes(this.norm(r.keyword))) return R(r.reply);
    }

    /* ── COINCIDENCIA EXACTA EN CATÁLOGO ─────────────────── */
    const prodMatch = prods.find(p => p.name && t.includes(this.norm(p.name)));
    if (prodMatch) {
      state.lastAction = "perfume_shown";
      const upsell = state.upsellShown ? "" : `<br><br>${pick("upsell_crema", state)}`;
      state.upsellShown = true;
      return R(this.formatProduct(prodMatch, true) + `<div style="margin-top:8px;font-size:.85em">${pick("close", state)}</div>` + upsell);
    }

    /* ── BASE DE CONOCIMIENTO ─────────────────────────────── */
    const kbHit = this.searchKB(userText, kb);
    if (kbHit) return R(kbHit);

    /* ── DETECTOR DE INTENCIÓN ───────────────────────────── */
    const { intent, confidence } = this.detectIntent(userText);

    if (intent && confidence > 0) {

      // Recomendación general — iniciar flujo pero saltando pasos ya conocidos
      if (["pedir_recomendacion", "ver_catalogo", "mas_vendidos"].includes(intent)) {
        if (mem.gender && mem.aroma && mem.budget) {
          // Tiene todo — dar resultado directo
          const filtered = this.filterAndScore(prods, { gender: mem.gender, budget: mem.budget, aroma: mem.aroma });
          state.lastAction = "perfume_shown";
          return R(this.buildProductList(filtered.slice(0, 4), `✨ Basado en tus preferencias:`) || "¡Escríbenos para asesoría personalizada! 📲");
        }
        if (mem.gender && mem.aroma) {
          state.step = "ask_budget";
          return R(`${pick("perfect", state)} ¿Cuál es tu presupuesto?<br><br>💵 Hasta RD$2,000 · RD$2,000–4,000 · Más de RD$4,000 · Sin límite`);
        }
        if (mem.gender) {
          state.step = "ask_aroma";
          const icon = mem.gender === "Masculino" ? "👔" : mem.gender === "Femenino" ? "👗" : "✨";
          return R(`${icon} ${pick("noted", state)} ¿Qué tipo de aroma prefieres?<br><br>🍯 Dulce · 🌸 Floral · 🌊 Fresco · 🌿 Amaderado · 🌙 Intenso`);
        }
        state.step = "ask_tipo";
        return R(`¡Con gusto! 🌹<br><br>¿Buscas un <strong>perfume</strong> o una <strong>crema corporal</strong>?`);
      }

      if (intent === "para_regalo") {
        if (mem.gender) {
          state.step = "ask_gift_budget";
          return R(`🎁 ¡Un detalle especial! Para regalar a ${mem.gender === "Masculino" ? "un caballero" : "una dama"}, ¿cuál sería el presupuesto?<br><br>💵 Hasta RD$2,000 · RD$2,000–4,000 · Más de RD$4,000`);
        }
        state.step = "ask_gift_gender";
        return R(`🎁 ¡Qué bonito detalle! ¿El regalo es para hombre, mujer o todavía no decidiste?`);
      }

      if (intent === "buscar_crema") {
        if (mem.brand) {
          state.step = "ask_crema_brand";
          return R(this.smartReply("si", state).reply); // Trigger crema with known brand
        }
        state.step = "ask_crema_brand";
        return R(`🧴 ¡Tenemos cremas increíbles!<br><br>🌸 <strong>Victoria's Secret</strong> — sensuales y femeninos<br>🌿 <strong>Bath & Body Works</strong> — aromas únicos<br><br>¿Cuál te interesa más?`);
      }

      // Género directo — guardar y pedir presupuesto o mostrar directo
      const genderMap = { buscar_hombre: "Masculino", buscar_mujer: "Femenino", buscar_unisex: "Unisex" };
      if (genderMap[intent]) {
        mem.gender = genderMap[intent];
        if (mem.aroma) {
          state.step = "ask_budget";
          const icon = mem.gender === "Masculino" ? "👔" : "👗";
          return R(`${icon} ${pick("noted", state)} ¿Y cuál sería el presupuesto?<br><br>💵 Hasta RD$2,000 · RD$2,000–4,000 · Más de RD$4,000 · Sin límite`);
        }
        state.step = "ask_budget";
        const icon = mem.gender === "Masculino" ? "👔" : mem.gender === "Femenino" ? "👗" : "✨";
        return R(`${icon} ${pick("noted", state)} ¿Cuál es tu presupuesto?<br><br>💵 Hasta RD$2,000<br>💵 RD$2,000–4,000<br>💵 Más de RD$4,000<br>💵 Sin límite`);
      }

      // Aromas directos
      const aromaMap2 = { buscar_dulce:"dulce", buscar_fresco:"fresco", buscar_floral:"floral", buscar_madera:"madera", buscar_intenso:"intenso", buscar_citrico:"citrico", buscar_oriental:"oriental", buscar_vainilla:"vainilla", buscar_suave:"suave" };
      if (aromaMap2[intent]) {
        const aromaKey = aromaMap2[intent];
        mem.aroma = aromaKey;
        const aromaInfo = (window.ONNE_AROMA_MAP || {})[aromaKey] || {};
        // Si ya tiene género, filtrar por los dos
        const aromaProds = this.filterAndScore(prods, { aroma: aromaKey, gender: mem.gender });
        const list = aromaProds.slice(0, 4);
        const fallback = list.length ? list : prods.filter(p => p.featured).slice(0, 4);
        state.lastAction = "perfume_shown";
        const intro = mem.gender
          ? this.buildIntro(state, this.rnd(V.remember_gender), "") + " "
          : "";
        const result = this.buildProductList(fallback, `${intro}${aromaInfo.emoji || "✨"} Perfumes ${aromaInfo.label || aromaKey}:`);
        const upsell = state.upsellShown ? "" : `<br><br>${pick("upsell_crema", state)}`;
        state.upsellShown = true;
        return R((result || pick("help", state)) + upsell);
      }

      // Ocasiones con flujo rápido
      if (["para_cita", "para_noche"].includes(intent)) {
        mem.ocasion = intent === "para_cita" ? "cita" : "noche";
        if (mem.gender) {
          // Recomendar directamente perfumes seductores del género conocido
          const sexy = this.filterAndScore(prods, { gender: mem.gender }).filter(p => p.featured || p.new).slice(0, 4);
          state.lastAction = "perfume_shown";
          return R(`🌹 Para esa noche especial te recomiendo:<br><br>${this.buildProductList(sexy, null, true) || "¡Escríbenos y te ayudamos a elegir! 📲"}<br><br>${pick("close", state)}`);
        }
        state.step = "ask_gender";
        return R(`🌹 ¡Para una ocasión especial hay que elegir bien! ¿Es para hombre o mujer?`);
      }

      // Victoria's Secret y BBW
      if (intent === "buscar_victoria_secret") {
        const vsp = prods.filter(p => this.norm(`${p.name || ""} ${p.brand || ""}`).includes("victoria"));
        const list = vsp.length ? vsp : prods.filter(p => p.featured).slice(0, 4);
        return R((this.buildProductList(list, "🌸 Victoria's Secret:") || "¡Tenemos productos VS! Escríbenos 📲") + `<br><br>${pick("upsell_vs", state)}`);
      }
      if (intent === "buscar_bath_body") {
        const bbwp = prods.filter(p => this.norm(`${p.name || ""} ${p.brand || ""}`).includes("bath"));
        const list = bbwp.length ? bbwp : prods.filter(p => p.featured).slice(0, 4);
        return R((this.buildProductList(list, "🌿 Bath & Body Works:") || "¡Tenemos BBW! Escríbenos 📲") + `<br><br>${pick("upsell_bbw", state)}`);
      }

      // Marcas genéricas (Dior, Chanel, etc.)
      const brandIntents = ["buscar_dior","buscar_chanel","buscar_lattafa","buscar_versace","buscar_paco_rabanne","buscar_armani","buscar_carolina_herrera"];
      if (brandIntents.includes(intent)) {
        const brandKey = intent.replace("buscar_", "").replace(/_/g, " ");
        const bp = this.searchProducts(brandKey, prods);
        if (bp.length) {
          state.lastAction = "perfume_shown";
          return R(this.buildProductList(bp.slice(0, 4), `🌹 ${brandKey.charAt(0).toUpperCase() + brandKey.slice(1)}:`));
        }
        return R(`¿Buscas ${brandKey}? Escríbenos y confirmamos disponibilidad 📲`);
      }

      // Precio/oferta
      if (intent === "preguntar_oferta") {
        const onSale = prods.filter(p => p.onSale && p.salePrice > 0);
        if (onSale.length) return R(this.buildProductList(onSale, "🏷️ ¡Ofertas activas ahora!"));
        return R(`🏷️ Tenemos promociones activas. Escríbenos por WhatsApp para ver los descuentos del momento 📲`);
      }
      if (intent === "preguntar_precio") {
        const sample = [...prods.filter(p => p.onSale).slice(0, 2), ...prods.filter(p => p.featured).slice(0, 2)];
        const unique = [...new Map(sample.map(p => [p.id, p])).values()].slice(0, 4);
        if (unique.length) return R(this.buildProductList(unique, "💰 Algunos precios actuales:"));
        return R(`💰 ¿Qué perfume te interesa? Te doy el precio al instante 😊`);
      }
      if (intent === "buscar_economico") {
        const cheap = prods.filter(p => (p.price || 0) <= 2500).sort((a, b) => (a.price || 0) - (b.price || 0));
        return R(this.buildProductList(cheap.slice(0, 4), "💵 Opciones accesibles:") || "Tenemos opciones desde RD$1,500 😊<br>¿Cuál es tu presupuesto exacto?");
      }
      if (intent === "buscar_premium") {
        const prem = prods.filter(p => (p.price || 0) >= 4000).sort((a, b) => (b.price || 0) - (a.price || 0));
        return R(this.buildProductList(prem.slice(0, 4), "💎 Fragancias premium:") || "Tenemos selección premium exclusiva. ¡Escríbenos! 📲");
      }
      if (intent === "mas_vendidos") {
        const top = prods.filter(p => p.featured || p.new).slice(0, 4);
        const intro = mem.gender ? this.buildIntro(state, this.rnd(V.remember_gender), "") + " " : "";
        return R(this.buildProductList(top.length ? top : prods.slice(0, 4), `🏆 ${intro}Más populares:`) || "¡Escríbenos para ver el top de ventas! 📲");
      }
      if (intent === "upsell_crema") {
        return R(pick("upsell_crema", state));
      }

      // Respuestas directas del dataset
      const dataset = window.ONNE_TRAINING_DATASET || [];
      const match = dataset.find(d => d.intent === intent && d.response);
      if (match) return R(match.response);

      // Respuestas básicas de convivencia
      const basicMap = {
        saludo: () => {
          const hr = new Date().getHours();
          const grBase = hr < 12 ? "greet_morning" : hr < 18 ? "greet_afternoon" : "greet_evening";
          const gr = pick(grBase, state);
          const greeting = mem.name ? `${gr} ${mem.name}! 😊` : `${gr}`;
          const feat = prods.filter(p => p.featured || p.new).slice(0, 2);
          const featHtml = feat.length ? `<br><br>🔥 <strong>Destacados:</strong><br>${feat.map(p => this.formatProduct(p)).join("")}` : "";
          return `${greeting} Soy ${storeName.split(" ")[0]}, tu asistente.<br><br>¿Buscas un perfume, una crema, o tienes una pregunta? 😊${featHtml}`;
        },
        gracias: () => `${pick("perfect", state)} ${pick("help", state)} 🌹`,
        despedida: () => `¡Hasta pronto! 🌹 Fue un placer atenderte.`,
        info_tienda: () => `🌹 Somos una tienda de perfumes 100% originales, cremas Victoria's Secret y Bath & Body Works en RD.<br><br>✅ Originales garantizados · 🚚 Envíos a todo el país · 💎 Asesoría personalizada`,
        como_comprar: () => `🛒 ¡Muy sencillo!<br><br>1️⃣ Elige tu perfume<br>2️⃣ Escríbenos<br>3️⃣ Coordinamos pago y entrega<br>4️⃣ ¡Lo recibes en casa! 📦`,
        preguntar_envio: () => `📦 ¡Sí enviamos!<br><br>🏙️ <strong>Santo Domingo:</strong> 1-2 días hábiles<br>🗺️ <strong>Interior:</strong> 2-4 días hábiles<br><br>Coordinamos por WhatsApp 📲`,
        preguntar_pago: () => `💳 Aceptamos:<br><br>🏦 Transferencia · 💵 Efectivo · 💳 Tarjeta · 📱 Pagos móviles`,
        preguntar_originalidad: () => `✅ <strong>100% originales y auténticos.</strong><br><br>Trabajamos solo con distribuidores oficiales. Cada perfume viene sellado con empaque original. Compra con total confianza 🌹`,
        preguntar_horario: () => `🕐 <strong>Lun–Sáb:</strong> 9am – 7pm · <strong>Dom:</strong> Cerrado`,
        pedir_contacto: () => `📲 Escríbenos por WhatsApp. <strong>Lun–Sáb 9am–7pm</strong>. ¡Respondemos en minutos! 😊`,
        preguntar_stock: () => `✅ Dime el perfume que buscas y te confirmo disponibilidad al instante 📲`,
        preguntar_tamaño: () => `📏 Disponible en <strong>50ml</strong> · <strong>100ml</strong> · <strong>200ml</strong>. ¿Cuál perfume te interesa?`,
        preguntar_duracion: () => `⏱️ <strong>Orientales/Oud:</strong> 8–12h · <strong>Florales:</strong> 5–8h · <strong>Frescos:</strong> 4–6h<br><br>¿Quieres uno de larga duración?`,
        preguntar_devolucion: () => `🔄 Si hay algún inconveniente, contáctanos en 48h con foto. ¡Lo resolvemos sin complicaciones! ✅`,
      };
      if (basicMap[intent]) return R(basicMap[intent]());
    }

    /* ── AROMA LIBRE ─────────────────────────────────────── */
    const aromaKey = this.detectAroma(userText);
    if (aromaKey) {
      mem.aroma = aromaKey;
      const aromaInfo = (window.ONNE_AROMA_MAP || {})[aromaKey] || {};
      const aromaProds = this.filterAndScore(prods, { aroma: aromaKey, gender: mem.gender });
      const list = aromaProds.slice(0, 4);
      if (list.length) {
        state.lastAction = "perfume_shown";
        return R(this.buildProductList(list, `${aromaInfo.emoji || "✨"} Perfumes ${aromaInfo.label || aromaKey}:`));
      }
    }

    /* ── BÚSQUEDA LIBRE EN CATÁLOGO ──────────────────────── */
    if (this.has(userText, "busco", "quiero", "tienes", "hay ", "existe", "disponible", "tienen") && prods.length) {
      const results = this.searchProducts(userText, prods);
      if (results.length) return R(this.buildProductList(results.slice(0, 4), "Encontré esto para ti:"));
    }

    /* ── SALUDO IMPLÍCITO ────────────────────────────────── */
    if (this.has(userText, "hola", "buenas", "buenos", "hey", "saludos", "hi", "hello") || this.norm(userText) === "buenas" || this.norm(userText) === "hi") {
      const hr = new Date().getHours();
      const grBase = hr < 12 ? "greet_morning" : hr < 18 ? "greet_afternoon" : "greet_evening";
      const gr = pick(grBase, state);
      const feat = prods.filter(p => p.featured || p.new).slice(0, 2);
      const featHtml = feat.length ? `<br><br>🔥 <strong>Destacados:</strong><br>${feat.map(p => this.formatProduct(p)).join("")}` : "";
      return R(`${gr} Soy la asistente de <strong>${storeName}</strong>.<br><br>¿Buscas perfumes, cremas, o tienes alguna pregunta? 😊${featHtml}`);
    }

    /* ── DEFAULT CONTEXTUAL ──────────────────────────────── */
    const top = prods.filter(p => p.featured || p.new).slice(0, 2);
    const topHtml = top.length ? `<br><br>${this.buildProductList(top, "🔥 Destacados:")}` : "";
    // Si tenemos algo de memoria, personalizar el default
    if (mem.gender || mem.aroma) {
      const contextProds = this.filterAndScore(prods, { gender: mem.gender, aroma: mem.aroma }).slice(0, 3);
      if (contextProds.length) {
        return R(`Basándome en lo que me has contado, estas podrían interesarte:<br><br>${this.buildProductList(contextProds, null)}`);
      }
    }
    return R(`Estoy aquí para ayudarte 😊<br><br>Puedo recomendarte perfumes, mostrarte precios u orientarte con la compra.${topHtml}<br><br>¿Qué necesitas?`);
  },

  /* ─────────────────────────────────────────────────────────
     buildSystemPrompt — Modo Bot IA (mejorado v72)
     ───────────────────────────────────────────────────────── */
  buildSystemPrompt(cfg, memory) {
    const cb       = cfg?.whatsapp?.chatbot || {};
    const prods    = (cfg || {}).products || [];
    const phone    = (cfg?.whatsapp?.phone || "").replace(/\D/g, "");
    const storeName = cb.name || "Onne Store RD";
    const kb       = cb.knowledgeBase || "";
    const mem      = memory || {};

    const prodCatalog = prods.slice(0, 30).map(p => {
      const pr = p.onSale && p.salePrice ? `RD$${p.salePrice} (OFERTA, antes ${p.price})` : `RD$${p.price || 0}`;
      return `• [${p.id}] ${p.name} | ${p.brand || "-"} | ${p.gender || "Unisex"} | ${p.ml || "?"}ml | ${pr} | Stock:${p.stock || 0}${p.description ? " | " + p.description.substring(0, 50) : ""}`;
    }).join("\n");

    const aromaStr = Object.entries(window.ONNE_AROMA_MAP || {})
      .map(([k, v]) => `${v.emoji || ""} ${k}: ${(v.notas || []).slice(0, 4).join(", ")}`)
      .join(" · ");

    // Contexto de memoria del cliente
    const memCtx = [];
    if (mem.name)    memCtx.push(`Nombre del cliente: ${mem.name}`);
    if (mem.gender)  memCtx.push(`Género buscado: ${mem.gender}`);
    if (mem.aroma)   memCtx.push(`Aroma preferido: ${mem.aroma}`);
    if (mem.budget)  memCtx.push(`Presupuesto: hasta RD$${mem.budget}`);
    if (mem.brand)   memCtx.push(`Marca preferida: ${mem.brand}`);
    if (mem.ocasion) memCtx.push(`Ocasión: ${mem.ocasion}`);
    const memSection = memCtx.length ? `\nMEMORIA DE ESTA CONVERSACIÓN:\n${memCtx.join("\n")}\n(NO preguntes de nuevo lo que ya está en la memoria. Úsalo directamente.)` : "";

    return `Eres un asesor experto de ${storeName}, perfumería premium de República Dominicana.

PERSONALIDAD:
• Eres un asesor humano cálido, experto y conversacional — NUNCA menciones que eres IA
• Hablas en español dominicano natural, informal pero profesional
• Eres un experto en fragancias y sabes recomendar con precisión
• Mensaje corto (4-5 líneas máx.) — optimizado para chat móvil
• Usas emojis con moderación, donde aportan
• NUNCA repitas lo mismo que dijiste en el turno anterior
• NUNCA digas "Soy una IA", "Como IA", "Como asistente de IA" — eres simplemente el asesor de ${storeName}

ESTRATEGIA DE VENTA:
1. Si no sabes género/aroma → pregunta UNO por turno (no dos preguntas a la vez)
2. Si ya tienes la info → recomienda directamente SIN preguntar de nuevo
3. Máximo 3 productos por respuesta, con nombre + precio + link si tienes ID
4. Cierra siempre con una llamada a la acción suave
5. Después de recomendar perfume → sugerir crema del mismo aroma (upsell natural)

FORMATO DE RESPUESTA:
• HTML básico: <strong>, <br>, <a href="...">
• Links: <a href="#product/ID_PRODUCTO">Nombre</a>
• Catálogo: <a href="#shop">Ver catálogo →</a>
• WhatsApp directo: ${phone || "ver perfil"}
• NO uses markdown (*texto*, **texto**, # headers)

AROMAS: ${aromaStr}
${memSection}
${kb ? `\nBASE DE CONOCIMIENTO (prioridad máxima):\n${kb.substring(0, 8000)}` : ""}

CATÁLOGO ACTUAL (${prods.length} productos):
${prodCatalog || "Catálogo en actualización"}

DATOS TIENDA:
• Perfumes 100% originales con empaque sellado
• Cremas: Victoria's Secret y Bath & Body Works
• Envíos: SD 1-2 días · Interior 2-4 días
• Horario: Lun-Sáb 9am-7pm
• Pago: Transferencia · Tarjeta · Efectivo · Pagos móviles`;
  },

  /* ─────────────────────────────────────────────────────────
     getAiReply — Modo Bot IA (Claude API) — mejorado v72
     ───────────────────────────────────────────────────────── */
  async getAiReply(userText, history, cfg, memory) {
    const cb = cfg?.whatsapp?.chatbot || {};
    const apiKey = cb.aiApiKey || "";
    if (!apiKey) throw new Error("no_key");

    const system = this.buildSystemPrompt(cfg, memory);
    const messages = [...(history || []).slice(-14), { role: "user", content: userText }];

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 500,
        system,
        messages
      })
    });
    if (!res.ok) throw new Error("API " + res.status);
    const data = await res.json();
    return data.content?.[0]?.text || null;
  },

  /* ─────────────────────────────────────────────────────────
     getAiFreeReply — OpenRouter (modelos gratuitos) — mejorado v72
     ───────────────────────────────────────────────────────── */
  async getAiFreeReply(userText, history, cfg, memory) {
    const cb = cfg?.whatsapp?.chatbot || {};
    const apiKey = cb.aiApiKeyFree || "";
    if (!apiKey) throw new Error("no_free_key");
    const model = cb.aiFreeModel || "mistralai/mistral-7b-instruct:free";

    const system = this.buildSystemPrompt(cfg, memory);
    const messages = [...(history || []).slice(-10), { role: "user", content: userText }];

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": window.location.origin,
        "X-Title": `${cb.name || "Onne Store"} Chatbot`
      },
      body: JSON.stringify({
        model,
        max_tokens: 400,
        messages: [{ role: "system", content: system }, ...messages]
      })
    });
    if (!res.ok) throw new Error("OpenRouter " + res.status);
    const data = await res.json();
    return data.choices?.[0]?.message?.content || null;
  },

};

})();

/* ╔══════════════════════════════════════════════════════════
 * ║  app.js
 * ╚══════════════════════════════════════════════════════════ */


(function(){
  const $ = (s, el=document)=>el.querySelector(s);
  const $$ = (s, el=document)=>Array.from(el.querySelectorAll(s));

  
  function ensureCarouselShell(trackEl, opts){
    if(!trackEl) return null;
    const enabled = opts?.carousel !== false;
    // If carousel disabled, ensure grid styles
    if(!enabled){
      // unwrap if previously wrapped
      if(trackEl.parentElement && trackEl.parentElement.classList.contains("carousel-shell")){
        const shell = trackEl.parentElement;
        shell.parentElement.insertBefore(trackEl, shell);
        shell.remove();
      }
      trackEl.classList.remove("carousel-track");
      return null;
    }

    // Already wrapped
    if(trackEl.parentElement && trackEl.parentElement.classList.contains("carousel-shell")){
      trackEl.classList.add("carousel-track");
      return trackEl.parentElement;
    }

    const shell = document.createElement("div");
    shell.className = "carousel-shell";

    const left = document.createElement("button");
    left.className = "carousel-arrow left";
    left.type = "button";
    left.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>`;

    const right = document.createElement("button");
    right.className = "carousel-arrow right";
    right.type = "button";
    right.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>`;

    trackEl.parentElement.insertBefore(shell, trackEl);
    shell.appendChild(left);
    shell.appendChild(trackEl);
    shell.appendChild(right);

    trackEl.classList.add("carousel-track");

    function step(){
      // scroll by ~one viewport minus a bit
      return Math.max(260, Math.floor(shell.clientWidth * 0.85));
    }
    function updateButtons(){
      const showArrows = opts?.arrows !== false;
      left.style.display = showArrows ? "" : "none";
      right.style.display = showArrows ? "" : "none";
      const max = trackEl.scrollWidth - trackEl.clientWidth - 2;
      left.disabled = trackEl.scrollLeft <= 2;
      right.disabled = trackEl.scrollLeft >= max;
    }
    left.addEventListener("click", ()=> trackEl.scrollBy({left: -step(), behavior:"smooth"}));
    right.addEventListener("click", ()=> trackEl.scrollBy({left: step(), behavior:"smooth"}));
    trackEl.addEventListener("scroll", ()=> updateButtons());
    window.addEventListener("resize", ()=> updateButtons());
    setTimeout(updateButtons, 50);

    return shell;
  }

  function pickProducts(cfg, key, predicate){
    const prods = cfg.products || [];
    const sec = (cfg.homeProductSections||{})[key] || {};
    const limit = Number(sec.limit || 8);
    if(sec.mode === "manual" && Array.isArray(sec.ids) && sec.ids.length){
      const map = new Map(prods.map(p=>[String(p.id), p]));
      const ordered = sec.ids.map(id=>map.get(String(id))).filter(Boolean);
      return ordered.slice(0, limit);
    }
    return prods.filter(predicate).slice(0, limit);
  }
const CART_KEY = "cartState";

  function toast(msg, type="info"){
    const wrap = $("#toast-wrap");
    if(!wrap) return;
    const t = document.createElement("div");
    t.className = "toast "+type;
    t.textContent = msg;
    wrap.appendChild(t);
    setTimeout(()=>{ t.remove(); }, 2600);
  }

  function escapeHtml(s){
    return (s||"").replace(/[&<>"']/g, (c)=>({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
  }

  // Convert plain text with newlines → safe HTML with paragraphs
  // Double newlines → paragraph breaks, single newlines → <br>
  function textToHtml(str){
    if(!str) return "";
    const escaped = escapeHtml(str);
    // Split on double newlines for paragraphs, single for line breaks
    return escaped
      .split(/\n\s*\n/)
      .map(para => "<p style=\"margin:0 0 .85em 0\">" + para.replace(/\n/g,"<br>") + "</p>")
      .join("")
      .replace(/<p style="margin:0 0 .85em 0"><\/p>/g,""); // remove empty paragraphs
  }

    function escapeAttr(s){ return escapeHtml(s||""); }

function money(n){
    const v = Number(n||0);
    return "RD$" + v.toLocaleString("es-DO");
  }

  function applyTheme(cfg){
    const r = document.documentElement;
    const t = cfg.theme || {};
    // CSS variables
    if(t.primary)  r.style.setProperty("--gold",      t.primary);
    if(t.accent)   r.style.setProperty("--rose",      t.accent);
    if(t.charcoal) r.style.setProperty("--charcoal",  t.charcoal);
    if(t.offWhite) r.style.setProperty("--off-white", t.offWhite);
    if(t.white)    r.style.setProperty("--white",     t.white);
    if(t.mid)      r.style.setProperty("--mid",       t.mid);
    if(t.border)   r.style.setProperty("--border",    t.border);
    if(t.fontDisplay) r.style.setProperty("--ff-display", `'${t.fontDisplay}', Georgia, serif`);
    if(t.fontBody)    r.style.setProperty("--ff-body",    `'${t.fontBody}', system-ui, sans-serif`);
    // Inject dynamic styles for buttons, cards, header, footer, badges
    if(StorageAPI && StorageAPI.applyThemeVars) StorageAPI.applyThemeVars(t);
  }

  function waLink(cfg, text){
    const phone = (cfg.whatsapp?.phone || "").replace(/\D/g,"");
    const msg = encodeURIComponent(text || "Hola!");
    return `https://wa.me/${phone}?text=${msg}`;
  }

  
  // ---------- BRAND LOGO + HOME SCROLL ----------
  function applyHeaderLogo(cfg){
    const img = document.getElementById("headerLogoImg");
    if(!img) return;
    const b = (cfg && cfg.brand) ? cfg.brand : {};
    const enabled = b.logoEnabled === true;
    const url = (b.logoUrl || "").trim();
    if(enabled && url){
      img.src = url;
      img.style.display = "block";
    } else {
      img.removeAttribute("src");
      img.style.display = "none";
    }
  }

  function goHomeTop(){
    if(location.hash !== "#home") location.hash = "#home";
    window.scrollTo({top:0, behavior:"smooth"});
  }

  document.addEventListener("click", function(e){
    const brand = e.target.closest("#brandLink, .header-logo");
    if(brand){
      e.preventDefault();
      goHomeTop();
      return;
    }
    const homeLink = e.target.closest('#header-nav a[href="#home"], #mobile-nav a[href="#home"]');
    if(homeLink){
      e.preventDefault();
      goHomeTop();
      return;
    }
  });

// ---------- NAV + ROUTE ----------
  function renderNav(cfg){
    const nav = $("#header-nav");
    const mnav = $("#mobile-nav");
    const items = (cfg.navItems||[]).filter(i=>i.visible!==false);
    // Inject spaces with inNav=true
    const spaceItems = (cfg.spaces||[])
      .filter(sp=>sp.inNav)
      .map(sp=>({id:'space-'+sp.id, label:sp.name||sp.slug, href:'#space/'+(sp.slug||sp.id), visible:true}));
    const allItems = items.concat(spaceItems);
    const navHtml = allItems.map(i=>`<a href="${i.href}" data-page="${i.id}">${escapeHtml(i.label)}</a>`).join("");
    if(nav) nav.innerHTML = navHtml;
    if(mnav){
      mnav.innerHTML = navHtml + `<a href="#cart">🛍 Carrito</a>`;
    }

    function syncActive(){
      const hash = location.hash || "#home";
      $$("#header-nav a").forEach(a=>{
        a.classList.toggle("active", a.getAttribute("href")===hash);
      });
    }
    window.addEventListener("hashchange", syncActive);
    syncActive();
  }

  function renderAnnouncement(cfg){
    const bar = document.getElementById("topbar");
    const top = cfg.benefits?.topBar || {};
    if(!bar) return;
    const enabled = top.enabled !== false;

    // Page visibility — check current page hash
    const curPage = (location.hash||"#home").replace(/^#/,"").split("/")[0]||"home";
    const pages = top.pages || {};
    const pageAllowed = pages[curPage] !== false; // default: show on all pages

    bar.hidden = !(enabled && pageAllowed);
    if(!enabled || !pageAllowed){ return; }

    // Build content: optional icon + text, optional link
    const st = top.style || {};
    const icon = st.icon ? st.icon+" " : "";
    const text = icon + (top.text || "");
    if(top.href){
      bar.innerHTML = `<a href="${top.href}" style="color:inherit;text-decoration:none;display:block;width:100%">${escapeHtml(text)}</a>`;
      bar.style.cursor = "pointer";
    } else {
      bar.textContent = text;
      bar.style.cursor = "";
    }

    // Styles
    bar.style.background    = st.bg || "#1C1C1E";
    bar.style.color         = st.color || "#fff";
    bar.style.fontFamily    = st.font || "";
    bar.style.fontSize      = st.size || "";
    bar.style.textAlign     = st.align || "center";
    bar.style.fontWeight    = st.bold ? "700" : "";
    bar.style.letterSpacing = st.letterSpacing || "";
    if(st.height){ bar.style.height = isNaN(st.height) ? st.height : st.height+"px"; bar.style.lineHeight = bar.style.height; bar.style.display = "flex"; bar.style.alignItems = "center"; bar.style.justifyContent = st.align==="left"?"flex-start":st.align==="right"?"flex-end":"center"; }
    else { bar.style.height=""; bar.style.lineHeight=""; bar.style.display=""; }

    // Re-check on hash change (page nav)
    if(!bar._hashListener){
      bar._hashListener = true;
      window.addEventListener("hashchange",()=>renderAnnouncement(cfg));
    }
  }

  function renderTicker(cfg){
    const wrap = document.getElementById("ticker-bar");
    const track = document.getElementById("ticker-track");
    if(!wrap || !track) return;
    const t = cfg.benefits?.ticker || {};
    const items = Array.isArray(t.items) ? t.items.filter(Boolean) : [];
    const enabled = (t.enabled === true) && items.length>0;
    wrap.hidden = !enabled;
    if(!enabled){ track.innerHTML=""; return; }

    // styles
    const st = t.style || {};
    wrap.style.background = st.bg || "";
    wrap.style.color = st.color || "";
    wrap.style.fontFamily = st.font || "";
    wrap.style.fontSize = st.size || "";
    // Duplicate the list so it can scroll seamlessly
    // Quadruple items so scroll never shows empty space
    const spans = items.map(x=>`<span>${escapeHtml(x)}</span>`).join("");
    const quad = spans + spans + spans + spans;
    track.innerHTML = quad;
    // Ensure animation loops: -50% = halfway through 4x copy = 2x copies
    track.style.animation = "none"; track.offsetHeight; track.style.animation = "";
  }

  
function insertAfter(refNode, newNode){
  if(!refNode || !newNode) return;
  if(refNode.parentNode) refNode.parentNode.insertBefore(newNode, refNode.nextSibling);
}

function resolvePlacementTarget(token){
  // token formats:
  // "top" | "aboveBanner" | "belowBanner" | "after:home-section-new" etc.
  if(!token) return {mode:"top"};
  if(typeof token === "string" && token.startsWith("after:")){
    return {mode:"after", afterId: token.slice(6)};
  }
  return {mode: token};
}

function applyBenefitsPlacement(cfg){
  const hero = document.querySelector(".hero");
  const header = document.getElementById("site-header");
  const topbar = document.getElementById("topbar");
  const ticker = document.getElementById("ticker-bar");
  const band = document.getElementById("features-strip");

  const placements = {
    topBar: resolvePlacementTarget(cfg.benefits?.topBar?.placement),
    ticker: resolvePlacementTarget(cfg.benefits?.ticker?.placement),
    band: resolvePlacementTarget(cfg.benefits?.band?.placement),
  };

  function place(node, p){
    if(!node) return;

    // keep node in DOM but move it
    if(p.mode==="top"){
      // Put it before header if possible, otherwise at start of body
      if(header && header.parentNode){
        header.parentNode.insertBefore(node, header);
      }else{
        document.body.insertBefore(node, document.body.firstChild);
      }
      return;
    }

    if(p.mode==="aboveBanner"){
      if(hero && hero.parentNode) hero.parentNode.insertBefore(node, hero);
      return;
    }

    if(p.mode==="belowBanner"){
      // Default "below banner" is directly after hero.
      // Note: ordering between modules is controlled by the call order below.
      insertAfter(hero, node);
      return;
    }

    if(p.mode==="belowBannerAboveBand"){
      // Specifically: below banner but ABOVE the benefits band (features-strip)
      if(band && band.parentNode){
        band.parentNode.insertBefore(node, band);
      }else{
        insertAfter(hero, node);
      }
      return;
    }

    if(p.mode==="belowBannerBelowBand"){
      // Specifically: below the benefits band (features-strip)
      if(band){
        insertAfter(band, node);
      }else{
        insertAfter(hero, node);
      }
      return;
    }

    if(p.mode==="after" && p.afterId){
      const el = document.getElementById(p.afterId);
      if(el) insertAfter(el, node);
      return;
    }

    // fallback
    if(header && header.parentNode) header.parentNode.insertBefore(node, header);
  }

  // Place topbar first (global).
  place(topbar, placements.topBar);

  // Place band before ticker so that when both are "belowBanner" the ticker
  // ends up between the banner and the band (desired default).
  place(band, placements.band);
  place(ticker, placements.ticker);
}

function renderWhatsAppButtons(cfg){
    const waBtn = $("#header-wa-btn");
    if(waBtn){
      const msg = "Hola! Quiero información sobre perfumes.";
      waBtn.href = waLink(cfg, msg);
    }
    // Apply WA float button style + chatbot mode
    const was = cfg.whatsapp?.style || {};
    const waChatbot = cfg.whatsapp?.chatbot || {};
    const floatEnabled = cfg.whatsapp?.floatEnabled !== false;
    const floatMode = cfg.whatsapp?.floatMode || "direct";
    const floatBtn = document.getElementById("wa-float-btn");
    if(floatBtn){
      floatBtn.style.display = floatEnabled ? "flex" : "none";
      // ── Background ──────────────────────────────────────
      const btnColor = was.btnColor || was.btnColorOld || "#25D366";
      floatBtn.style.background = btnColor;
      floatBtn.style.boxShadow = `0 4px 18px ${btnColor}70`;
      // ── Position: new widgetPosition overrides legacy was.position ──────
      const widgetPosMap = { "right": "bottom-right", "left": "bottom-left" };
      const pos = widgetPosMap[was.widgetPosition] || was.position || "bottom-right";
      const posMap = {
        "bottom-right":  {bottom:"24px",right:"20px",top:"auto",left:"auto",transform:""},
        "bottom-left":   {bottom:"24px",left:"20px",top:"auto",right:"auto",transform:""},
        "bottom-center": {bottom:"24px",left:"50%",top:"auto",right:"auto",transform:"translateX(-50%)"},
        "top-right":     {top:"80px",right:"20px",bottom:"auto",left:"auto",transform:""},
        "top-left":      {top:"80px",left:"20px",bottom:"auto",right:"auto",transform:""},
      };
      const pm = posMap[pos] || posMap["bottom-right"];
      Object.assign(floatBtn.style, pm);
      // ── Size: widgetSize sets button dimensions ──────────────────────────
      const sizeMap = { "small": "46px", "normal": "52px", "large": "68px" };
      const btnSz = sizeMap[was.widgetSize] || was.btnSize || "52px";
      // ── Display mode: "pill" | "circle" | "text-only" ───
      const displayMode = was.displayMode || "pill";
      const iconSlot = document.getElementById("wa-float-icon-slot");
      const labelSpan = document.getElementById("wa-float-label-text");
      const waSvg = document.getElementById("wa-float-svg");
      const customImg = document.getElementById("wa-float-custom-img");
      const emojiSpan = document.getElementById("wa-float-emoji");
      if(displayMode === "circle"){
        floatBtn.style.borderRadius = "50%";
        floatBtn.style.padding = was.btnPadding || "14px";
        floatBtn.style.width  = btnSz;
        floatBtn.style.height = btnSz;
        floatBtn.style.gap = "0";
        if(iconSlot) iconSlot.style.display = "flex";
        if(labelSpan) labelSpan.style.display = "none";
      } else if(displayMode === "text-only"){
        floatBtn.style.borderRadius = was.btnRadius || "50px";
        floatBtn.style.padding = was.btnPadding || "12px 20px";
        floatBtn.style.width = ""; floatBtn.style.height = "";
        if(iconSlot) iconSlot.style.display = "none";
        if(labelSpan) labelSpan.style.display = "";
      } else {
        floatBtn.style.borderRadius = was.btnRadius || "50px";
        floatBtn.style.padding = was.btnPadding || "12px 18px 12px 14px";
        floatBtn.style.width = ""; floatBtn.style.height = "";
        floatBtn.style.gap = "8px";
        if(iconSlot) iconSlot.style.display = "flex";
        if(labelSpan) labelSpan.style.display = "";
      }
      // ── Icon type ───────────────────────────────────────
      const iconType = was.iconType || "wa-svg";
      if(iconSlot && iconSlot.style.display !== "none"){
        if(iconType === "custom-img" && was.customIconUrl){
          if(waSvg) waSvg.style.display = "none";
          if(emojiSpan) emojiSpan.style.display = "none";
          if(customImg){ customImg.style.display = ""; customImg.src = was.customIconUrl; const sz = was.iconSize||"28px"; customImg.style.width=sz; customImg.style.height=sz; }
        } else if(iconType === "emoji" && was.iconEmoji){
          if(waSvg) waSvg.style.display = "none";
          if(customImg) customImg.style.display = "none";
          if(emojiSpan){ emojiSpan.style.display = ""; emojiSpan.textContent = was.iconEmoji; emojiSpan.style.fontSize = was.iconSize || "22px"; }
        } else {
          if(customImg) customImg.style.display = "none";
          if(emojiSpan) emojiSpan.style.display = "none";
          if(waSvg){ waSvg.style.display = ""; const sz = parseInt(was.iconSize)||22; waSvg.setAttribute("width",sz); waSvg.setAttribute("height",sz); waSvg.style.fill = was.btnIconColor || "#fff"; }
        }
      }
      // ── Label ───────────────────────────────────────────
      if(labelSpan && labelSpan.style.display !== "none"){
        const defaultLabel = floatMode === "chatbot" ? "💬 Chatear" : "WhatsApp";
        labelSpan.textContent = (was.btnText !== undefined && was.btnText !== "") ? was.btnText : defaultLabel;
        if(was.textColor) labelSpan.style.color = was.textColor;
        if(was.fontSize) labelSpan.style.fontSize = was.fontSize;
        if(was.fontFamily) labelSpan.style.fontFamily = was.fontFamily;
      }
      // ── Click ───────────────────────────────────────────
      floatBtn.onclick = (e)=>{
        e.preventDefault();
        if(floatMode === "chatbot"){ toggleWaChatWidget(cfg); }
        else { const phone=(cfg.whatsapp?.phone||"").replace(/\D/g,""); const msg=encodeURIComponent("Hola! Quiero información."); window.open(`https://wa.me/${phone}?text=${msg}`,"_blank"); }
      };
      floatBtn.onmouseover = ()=>{ floatBtn.style.transform="scale(1.06)"; };
      floatBtn.onmouseout  = ()=>{ floatBtn.style.transform=""; };
    }
    // Init chatbot widget in DOM if needed
    initWaChatWidget(cfg);
  }

  /* ════════════════════════════════════════════════════════
     CHAT WIDGET — full-featured: text input, quick replies,
     bot mode, WA routing, admin inbox storage
     ════════════════════════════════════════════════════════ */
  const CHAT_INBOX_KEY = "onne_chat_inbox";
  const CHAT_CONV_KEY  = "onne_chat_conversations";

  function getChatInbox(){
    try{ return JSON.parse(localStorage.getItem(CHAT_INBOX_KEY)||"[]"); }
    catch(e){ return []; }
  }
  function saveChatInbox(msgs){
    try{ localStorage.setItem(CHAT_INBOX_KEY, JSON.stringify(msgs.slice(-200))); }
    catch(e){}
  }

  // ── Conversation metadata store ──────────────────────────────
  function getChatConversations(){
    try{ return JSON.parse(localStorage.getItem(CHAT_CONV_KEY)||"{}"); }
    catch(e){ return {}; }
  }
  function saveChatConversations(convs){
    try{ localStorage.setItem(CHAT_CONV_KEY, JSON.stringify(convs)); }
    catch(e){}
  }
  function updateConversationMeta(session, msg, sender){
    const convs = getChatConversations();
    const now = new Date().toISOString();
    if(!convs[session]){
      convs[session] = {
        id: session,
        startTs: now,
        lastTs: now,
        msgCount: 0,
        lastMsg: "",
        lastSender: sender,
        customerName: "",
        customerPhone: "",
        status: "activa",
        archived: false
      };
    }
    const c = convs[session];
    c.lastTs   = now;
    c.msgCount = (c.msgCount||0) + 1;
    c.lastMsg  = (msg||"").substring(0, 120);
    c.lastSender = sender;
    if(c.status === "sin_respuesta" && sender === "bot") c.status = "activa";
    // Try to extract phone from client messages
    if(sender === "client" && !c.customerPhone){
      const phoneMatch = msg.match(/\b(1?8[0-9]{8}|\+?1?\d{10,12})\b/);
      if(phoneMatch) c.customerPhone = phoneMatch[0];
    }
    saveChatConversations(convs);
    // Notify history panel if open
    if(typeof window.renderChatHistoryList === "function") window.renderChatHistoryList();
  }

  function addToInbox(msg, sender, session){
    const inbox = getChatInbox();
    inbox.push({ id: Date.now(), ts: new Date().toISOString(), session, sender, msg });
    saveChatInbox(inbox);
    updateConversationMeta(session, msg, sender);
    // notify admin badge
    const badge = document.getElementById("chat-inbox-badge");
    if(badge){ const unread = inbox.filter(m=>!m.read&&m.sender==="client").length; badge.textContent=unread; badge.style.display=unread?"":"none"; }
  }
  function getChatSession(){
    let s = sessionStorage.getItem("onne_chat_session");
    if(!s){ s = "chat_"+(Date.now()); sessionStorage.setItem("onne_chat_session",s); }
    return s;
  }

  /** Lightweight style updater for already-built widget */
  function _syncWidgetStyles(cfg, widget){
    if(!widget) return;
    const was = cfg?.whatsapp?.style || {};
    const hdr = widget.querySelector("#wa-hdr-bg");
    if(hdr && (was.headerColor||was.btnColor)) hdr.style.background = was.headerColor||was.btnColor||"#25D366";
    const msgArea = widget.querySelector("#wa-chat-messages");
    if(msgArea && was.chatBg) msgArea.style.background = was.chatBg;
    const icon = widget.querySelector("#wa-bot-icon-el");
    if(icon && cfg?.whatsapp?.chatbot?.botIcon) icon.textContent = cfg.whatsapp.chatbot.botIcon;
  }

  function initWaChatWidget(cfg){
    let widget = document.getElementById("wa-chat-widget");
    if(!widget){ widget = document.createElement("div"); widget.id="wa-chat-widget"; document.body.appendChild(widget); }
    // Guard: if already built, only sync visual props
    if(widget._built){ _syncWidgetStyles(cfg, widget); return; }
    widget._built = true;
    const chatbot    = cfg.whatsapp?.chatbot || {};
    const was        = cfg.whatsapp?.style   || {};
    const btnColor      = was.btnColor      || was.headerColor || "#25D366";
    const headerColor   = was.headerColor   || btnColor;
    const chatBg        = was.chatBg        || "#f8f9fa";
    const botBubbleBg   = was.botBubbleBg   || "#ffffff";
    const botBubbleColor= was.botBubbleColor|| "#1e1e1e";
    const quickReplyBg  = was.quickReplyBg  || "rgba(0,0,0,0.08)";
    const sendBtnColor  = was.sendBtnColor  || btnColor;
    const chatMode   = chatbot.chatMode || "bot"; // "wa" | "bot" | "ai" | "inbox"
    const name       = chatbot.name     || "Onne Store";
    const subtitle   = chatbot.subtitle || "En línea · Responde rápido";
    const welcome    = chatbot.welcome  || "¡Hola! 👋 ¿En qué podemos ayudarte?";
    const quickReplies = Array.isArray(chatbot.quickReplies) ? chatbot.quickReplies : [];
    const botReplies   = Array.isArray(chatbot.botReplies)   ? chatbot.botReplies   : [];
    const phone = (cfg.whatsapp?.phone||"").replace(/\D/g,"");
    // Bot icon: use admin-configured emoji or default based on mode
    const botIconEmoji = chatbot.botIcon || "🌹";

    // Quick reply pill HTML
    function qrHtml(list){
      return list.map(q=>`<button class="wa-quick-btn" data-msg="${escapeAttr(q)}" style="background:${escapeAttr(quickReplyBg)};border:1.5px solid rgba(255,255,255,.25);color:#fff;border-radius:20px;padding:6px 13px;font-size:.77rem;cursor:pointer;margin:3px 2px;font-weight:500;white-space:nowrap">${escapeHtml(q)}</button>`).join("");
    }

    // Choose between WA icon or chat icon based on mode
    const headerIcon = botIconEmoji
      ? `<div style="width:40px;height:40px;background:rgba(255,255,255,.2);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.3rem;flex-shrink:0">${botIconEmoji}</div>`
      : `<div style="width:40px;height:40px;background:rgba(255,255,255,.2);border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0"><svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></div>`;

    // ── Widget CSS animations (inject once) ─────────────────
    if (!document.getElementById("onne-chat-styles")) {
      const s = document.createElement("style");
      s.id = "onne-chat-styles";
      s.textContent = `
        #wa-chat-inner { animation: onneSlideUp .28s cubic-bezier(.22,.82,.28,1.05) both; }
        @keyframes onneSlideUp { from { opacity:0; transform:translateY(18px) scale(.96); } to { opacity:1; transform:none; } }
        .chat-msg-bot { animation: onneFadeIn .22s ease both; }
        .chat-msg-user { animation: onneFadeIn .18s ease both; }
        @keyframes onneFadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:none; } }
        .chat-dot { width:7px;height:7px;border-radius:50%;background:currentColor;display:inline-block;animation:onneDot 1.2s infinite ease-in-out; }
        .chat-dot:nth-child(2){animation-delay:.2s}
        .chat-dot:nth-child(3){animation-delay:.4s}
        @keyframes onneDot { 0%,80%,100%{opacity:.2;transform:scale(.8)} 40%{opacity:1;transform:scale(1)} }
        #wa-chat-messages::-webkit-scrollbar{width:4px}
        #wa-chat-messages::-webkit-scrollbar-track{background:transparent}
        #wa-chat-messages::-webkit-scrollbar-thumb{background:rgba(0,0,0,.12);border-radius:4px}
        .wa-quick-btn:hover { transform:translateY(-1px);box-shadow:0 3px 10px rgba(0,0,0,.15); }
        .wa-quick-btn { transition:all .15s; }
        #wa-chat-input:focus { box-shadow: 0 0 0 3px ${escapeAttr(btnColor)}22; }
        .chat-timestamp { font-size:.65rem;color:#aaa;text-align:center;margin:4px 0 2px;user-select:none; }
        #wa-chat-send:hover { transform:scale(1.08); box-shadow:0 4px 14px ${escapeAttr(sendBtnColor)}55; }
        #wa-chat-send:active { transform:scale(.95); }
        #wa-chat-send { transition:all .15s; }
      `;
      document.head.appendChild(s);
    }

    widget.innerHTML = `
      <div id="wa-chat-inner" style="display:none;position:fixed;bottom:88px;${was.widgetPosition==='left'?'left:20px;right:auto':'right:20px'};width:360px;max-width:calc(100vw - 20px);background:#fff;border-radius:22px;box-shadow:0 12px 60px rgba(0,0,0,.22),0 2px 12px rgba(0,0,0,.12);z-index:9998;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;flex-direction:column;max-height:600px">

        <!-- ── Header ──────────────────────────────────── -->
        <div id="wa-hdr-bg" style="background:linear-gradient(135deg,${escapeAttr(headerColor)},${escapeAttr(headerColor)}cc);padding:15px 16px;display:flex;align-items:center;gap:11px;flex-shrink:0;position:relative">
          <!-- Avatar -->
          <div style="position:relative;flex-shrink:0">
            <div id="wa-bot-icon-el" style="width:44px;height:44px;background:rgba(255,255,255,.2);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.4rem;border:2px solid rgba(255,255,255,.35)">${botIconEmoji || '🌹'}</div>
            <div style="position:absolute;bottom:1px;right:1px;width:11px;height:11px;background:#4ade80;border-radius:50%;border:2px solid ${escapeAttr(headerColor)}"></div>
          </div>
          <!-- Info -->
          <div style="min-width:0;flex:1">
            <div style="color:#fff;font-weight:700;font-size:.95rem;letter-spacing:-.01em">${escapeHtml(name)}</div>
            <div style="color:rgba(255,255,255,.85);font-size:.72rem;margin-top:1px">${escapeHtml(subtitle)}</div>
            <div style="color:rgba(255,255,255,.6);font-size:.66rem;margin-top:1px;display:flex;align-items:center;gap:4px"><span style="width:6px;height:6px;border-radius:50%;background:#4ade80;display:inline-block;animation:onlinePulse 2s infinite"></span>En línea</div>
          </div>
          <!-- Actions -->
          <div style="display:flex;gap:6px;align-items:center;flex-shrink:0">
            ${phone && chatMode!=="wa" ? `<a href="https://wa.me/${escapeAttr(phone)}" target="_blank" rel="noopener" title="Continuar en WhatsApp" style="background:rgba(255,255,255,.18);border:none;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;text-decoration:none;transition:background .15s" onmouseover="this.style.background='rgba(255,255,255,.3)'" onmouseout="this.style.background='rgba(255,255,255,.18)'"><svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></a>` : ""}
            <button id="wa-chat-close" title="Cerrar" style="background:rgba(255,255,255,.18);border:none;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:1.1rem;cursor:pointer;line-height:1;transition:background .15s" onmouseover="this.style.background='rgba(255,255,255,.3)'" onmouseout="this.style.background='rgba(255,255,255,.18)'">×</button>
          </div>
        </div>

        <!-- ── Messages area ────────────────────────────── -->
        <div id="wa-chat-messages" style="flex:1;overflow-y:auto;padding:16px 14px 10px;display:flex;flex-direction:column;gap:10px;min-height:200px;max-height:380px;background:${escapeAttr(chatBg)};scroll-behavior:smooth">
          <!-- Welcome bubble -->
          <div class="chat-timestamp">${new Date().toLocaleTimeString('es-DO',{hour:'2-digit',minute:'2-digit'})}</div>
          <div class="chat-msg-bot" style="background:${escapeAttr(botBubbleBg)};border-radius:4px 18px 18px 18px;padding:11px 14px;font-size:.855rem;color:${escapeAttr(botBubbleColor)};max-width:88%;line-height:1.55;box-shadow:0 1px 6px rgba(0,0,0,.08)">${escapeHtml(welcome)}</div>
        </div>

        <!-- ── Quick replies ─────────────────────────────── -->
        ${quickReplies.length ? `<div id="wa-quick-row" style="padding:9px 12px;border-top:1px solid rgba(0,0,0,.07);overflow-x:auto;white-space:nowrap;background:${escapeAttr(chatBg)};flex-shrink:0">${qrHtml(quickReplies)}</div>` : ""}

        <!-- ── Input area ────────────────────────────────── -->
        <div id="wa-chat-input-row" style="display:flex;align-items:center;gap:8px;padding:11px 13px;border-top:1px solid rgba(0,0,0,.07);background:#fff;flex-shrink:0">
          <input id="wa-chat-input" type="text" placeholder="Escribe tu mensaje..." autocomplete="off"
            style="flex:1;border:1.5px solid #e8e8e8;border-radius:24px;padding:9px 16px;font-size:.86rem;outline:none;font-family:inherit;background:#f7f7f9;color:#1e1e1e;transition:border-color .18s,box-shadow .18s"
            onfocus="this.style.borderColor='${escapeAttr(btnColor)}'" onblur="this.style.borderColor='#e8e8e8';this.style.boxShadow='none'"/>
          <button id="wa-chat-send" style="width:40px;height:40px;border-radius:50%;background:${escapeAttr(sendBtnColor)};border:none;color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0">
            <svg width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>
      </div>`;

    // ── Bind interactions ───────────────────────────────────
    const inner    = widget.querySelector("#wa-chat-inner");
    const messages = widget.querySelector("#wa-chat-messages");
    const input    = widget.querySelector("#wa-chat-input");
    const sendBtn  = widget.querySelector("#wa-chat-send");
    const closeBtn = widget.querySelector("#wa-chat-close");

    function addMsg(text, who){
      if(!messages) return;
      const div = document.createElement("div");
      div.className = who==="user" ? "chat-msg-user" : "chat-msg-bot";
      div.style.cssText = who==="user"
        ? `background:${btnColor};color:#fff;border-radius:18px 4px 18px 18px;padding:10px 15px;font-size:.855rem;max-width:82%;align-self:flex-end;line-height:1.55;box-shadow:0 1px 6px rgba(0,0,0,.12);word-break:break-word`
        : `background:${botBubbleBg};color:${botBubbleColor};border-radius:4px 18px 18px 18px;padding:11px 14px;font-size:.855rem;max-width:86%;line-height:1.6;box-shadow:0 1px 6px rgba(0,0,0,.08);white-space:pre-wrap;word-break:break-word`;
      // Support HTML for bot messages (links, bold, etc.)
      if(who === "bot" && /<[a-z][\s\S]*>/i.test(text)){
        div.style.whiteSpace = "normal";
        div.innerHTML = text;
        // Style any links inside bot messages
        div.querySelectorAll("a").forEach(a=>{
          a.style.cssText = `color:${btnColor};font-weight:600;text-decoration:underline`;
          a.setAttribute("target","_blank");
          a.setAttribute("rel","noopener");
        });
      } else {
        div.textContent = text;
      }
      messages.appendChild(div);
      messages.scrollTop = messages.scrollHeight;
    }


    // ── Shared conversation memory (persisted on widget element) ────
    // Stores ALL state: bot flow step, customer preferences, AI history
    if(!widget._conv) widget._conv = {
      // Bot flow state
      step:         null,
      tipo:         null,
      lastAction:   null,
      upsellShown:  false,
      // Customer memory — shared between Bot and AI modes
      memory:       {},          // { gender, aroma, budget, name, brand, ocasion }
      // Anti-repetition
      _replyHist:   [],
      _varUsed:     {},
      // AI conversation history
      history:      []
    };
    const _conv = widget._conv;

    // Convenience aliases (legacy compat)
    const _botState   = _conv;
    const _chatHistory = _conv.history;

    // ── Unified reply function — Bot Programado ─────────────────────
    function smartBotReply(userText){
      const engine = window.OnneChatbot;
      if(!engine) return "Un momento, el sistema está cargando. Intenta de nuevo 😊";
      const result = engine.smartReply(userText, _conv);
      Object.assign(_conv, result.state);
      return result.reply;
    }

    // ── AI Reply (Claude o OpenRouter) — con memoria compartida ─────
    async function getAiReply(userText, mode){
      const engine = window.OnneChatbot;
      if(!engine) throw new Error("no_engine");

      // Extraer preferencias del mensaje antes de enviarlo a la IA
      if(engine.extractAndSavePrefs) engine.extractAndSavePrefs(userText, _conv);

      try {
        let reply = null;
        if(mode === "ai_free"){
          reply = await engine.getAiFreeReply(userText, _conv.history, window.__cfg, _conv.memory);
        } else {
          reply = await engine.getAiReply(userText, _conv.history, window.__cfg, _conv.memory);
        }
        if(reply){
          // Guardar en historial de IA
          _conv.history.push({role:"user", content:userText});
          _conv.history.push({role:"assistant", content:reply});
          // Mantener historial manejable (últimos 20 turnos)
          if(_conv.history.length > 28) _conv.history.splice(0, 4);
          return reply;
        }
      } catch(e){
        console.warn("IA fallback:", e.message||e);
        if(e.message==="no_key"||e.message==="no_free_key"){
          return `Para continuar en este modo necesitas una API Key configurada en el panel. ¡Por ahora te ayudo con el bot clásico! 🌹`;
        }
        if(String(e.message).includes("401")) return "Clave de API incorrecta. Revisa la configuración en el panel de administración.";
        if(String(e.message).includes("429")) return "Demasiadas solicitudes en este momento. Intenta de nuevo en unos segundos 😊";
      }
      // Fallback al bot programado (también tiene la memoria _conv)
      return smartBotReply(userText);
    }

    function sendMessage(text){
      if(!text.trim()) return;
      const session = getChatSession();
      addMsg(text, "user");
      addToInbox(text, "client", session);
      if(input) input.value = "";
      // Disable input mientras responde
      if(input) input.disabled = true;
      if(sendBtn) sendBtn.disabled = true;

      if(chatMode === "wa"){
        if(input) input.disabled = false;
        if(sendBtn) sendBtn.disabled = false;
        setTimeout(()=>{
          window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`,"_blank","noopener");
        }, 300);
      } else if(chatMode === "ai" || chatMode === "ai_free" || chatMode === "bot"){
        // Mostrar "escribiendo…"
        const typingDiv = document.createElement("div");
        typingDiv.className = "chat-msg-bot chat-typing";
        typingDiv.style.cssText = `background:${botBubbleBg};color:${botBubbleColor};border-radius:4px 18px 18px 18px;padding:11px 16px;font-size:.85rem;max-width:80%;line-height:1.5;box-shadow:0 1px 6px rgba(0,0,0,.08);display:flex;gap:5px;align-items:center`;
        typingDiv.innerHTML = `<span class="chat-dot"></span><span class="chat-dot"></span><span class="chat-dot"></span>`;
        if(messages) { messages.appendChild(typingDiv); messages.scrollTop = messages.scrollHeight; }

        if(chatMode === "ai" || chatMode === "ai_free"){
          // Modo IA (Claude o gratuita via OpenRouter)
          getAiReply(text, chatMode).then(reply=>{
            typingDiv.remove();
            addMsg(reply, "bot");
            addToInbox(reply, "bot", session);
            if(input) input.disabled = false;
            if(sendBtn) sendBtn.disabled = false;
          });
        } else {
          // Modo bot programado — respuesta con delay natural
          const delay = 600 + Math.random() * 700;
          setTimeout(()=>{
            typingDiv.remove();
            const reply = smartBotReply(text);
            addMsg(reply, "bot");
            addToInbox(reply, "bot", session);
            if(input) input.disabled = false;
            if(sendBtn) sendBtn.disabled = false;
          }, delay);
        }
      } else {
        // inbox mode
        if(input) input.disabled = false;
        if(sendBtn) sendBtn.disabled = false;
        setTimeout(()=>{ addMsg("Mensaje recibido ✅ Te responderemos pronto.", "bot"); }, 600);
      }
    }

    if(sendBtn) sendBtn.onclick = ()=> sendMessage(input?.value||"");
    if(input) input.addEventListener("keypress", e=>{ if(e.key==="Enter" && !input.disabled) sendMessage(input.value); });
    if(closeBtn) closeBtn.onclick = ()=>toggleWaChatWidget(cfg, false);

    // Quick reply buttons
    widget.querySelectorAll(".wa-quick-btn").forEach(btn=>{
      btn.addEventListener("click", ()=>{
        const msg = btn.getAttribute("data-msg")||"";
        sendMessage(msg);
      });
    });
  }

  function toggleWaChatWidget(cfg, forceState){
    const inner = document.getElementById("wa-chat-inner");
    if(!inner) return;
    const isOpen = inner.style.display === "flex";
    const shouldOpen = forceState !== undefined ? forceState : !isOpen;
    const anim = cfg?.whatsapp?.style?.widgetAnimation || "bounce";
    if(shouldOpen){
      inner.style.display = "flex";
      // Apply open animation
      if(anim === "bounce"){
        inner.style.transform = "scale(0.8)"; inner.style.opacity = "0"; inner.style.transition = "transform .25s cubic-bezier(.34,1.56,.64,1), opacity .2s";
        requestAnimationFrame(()=>{ inner.style.transform = "scale(1)"; inner.style.opacity = "1"; });
      } else if(anim === "fade"){
        inner.style.opacity = "0"; inner.style.transition = "opacity .25s";
        requestAnimationFrame(()=>{ inner.style.opacity = "1"; });
      } else if(anim === "slide"){
        inner.style.transform = "translateY(30px)"; inner.style.opacity = "0"; inner.style.transition = "transform .25s ease, opacity .2s";
        requestAnimationFrame(()=>{ inner.style.transform = "translateY(0)"; inner.style.opacity = "1"; });
      }
      const inp = document.getElementById("wa-chat-input"); if(inp) setTimeout(()=>inp.focus(),200);
    } else {
      inner.style.transition = "opacity .18s";
      inner.style.opacity = "0";
      setTimeout(()=>{ inner.style.display = "none"; inner.style.opacity = ""; inner.style.transition = ""; }, 180);
    }
  }

  function renderBanner(cfg){
    const b = cfg.banner || {};
    const hero = $(".hero");
    if(!hero) return;

    if(b.enabled===false){
      hero.style.display = "none";
      return;
    }else{
      hero.style.display = "";
    }

    // ── Apply mobile-specific settings via CSS custom properties ──
    const m = b.mobile || {};
    const heroH = m.heroHeight || 52;
    // Set CSS variable so media-query override uses the admin value
    document.documentElement.style.setProperty("--mob-hero-vh", heroH);

    hero.style.minHeight = b.height || "40vh";
    // Text color
    const heroContent = $(".hero-content");
    if(heroContent && b.textColor) heroContent.style.color = b.textColor;
    // Overlay
    let heroOverlay = document.getElementById("hero-overlay-layer");
    if(!heroOverlay){ heroOverlay=document.createElement("div"); heroOverlay.id="hero-overlay-layer"; heroOverlay.style.cssText="position:absolute;inset:0;pointer-events:none;z-index:1;transition:background .3s"; hero.style.position="relative"; hero.insertBefore(heroOverlay,hero.firstChild); }
    const oc=b.overlayColor||"#000"; const oo=b.overlayOpacity||0;
    function hxRgba(h,a){var r=parseInt(h.slice(1,3),16)||0,g=parseInt(h.slice(3,5),16)||0,bv=parseInt(h.slice(5,7),16)||0; return "rgba("+r+","+g+","+bv+","+a+")";}
    heroOverlay.style.background = oo>0 ? hxRgba(oc,oo) : "none";
    // Image mode + split layout
    const imgMode = b.imgMode || (b.split ? b.split : "none");
    const img = $("#hero-img");
    const sc = b.splitColor||"#1e1e1e";
    // Reset img first
    if(img){ img.style.position=""; img.style.width=""; img.style.height=""; img.style.objectFit=""; img.style.left=""; img.style.right=""; img.style.top=""; img.style.bottom=""; img.style.display=""; img.style.float=""; }
    hero.style.background="";

    if(imgMode==="none"){
      // Pure color background, no image
      if(img) img.style.display="none";
      hero.style.background = sc;
    } else if(imgMode==="fullbg"){
      // Image as full background behind content
      if(img){ img.style.position="absolute"; img.style.inset="0"; img.style.width="100%"; img.style.height="100%"; img.style.objectFit="cover"; img.style.zIndex="0"; if(b.image) img.src=b.image; }
      hero.style.background="";
    } else if(imgMode==="split"){
      // Text left, image right half
      hero.style.background=sc;
      if(img){ img.style.position="absolute"; img.style.top="0"; img.style.bottom="0"; img.style.right="0"; img.style.left="auto"; img.style.width="50%"; img.style.height="100%"; img.style.objectFit="cover"; if(b.image) img.src=b.image; }
    } else if(imgMode==="split-left"){
      // Image left, text right half
      hero.style.background=sc;
      if(img){ img.style.position="absolute"; img.style.top="0"; img.style.bottom="0"; img.style.left="0"; img.style.right="auto"; img.style.width="50%"; img.style.height="100%"; img.style.objectFit="cover"; if(b.image) img.src=b.image; }
    } else if(imgMode==="right-color"){
      // Image left + color panel right
      hero.style.background=sc;
      if(img){ img.style.position="absolute"; img.style.top=img.style.bottom="0"; img.style.left="0"; img.style.right="auto"; img.style.width="50%"; img.style.height="100%"; img.style.objectFit="cover"; if(b.image) img.src=b.image; }
    } else if(imgMode==="left-color"){
      // Color panel left + image right
      hero.style.background=sc;
      if(img){ img.style.position="absolute"; img.style.top=img.style.bottom="0"; img.style.right="0"; img.style.left="auto"; img.style.width="50%"; img.style.height="100%"; img.style.objectFit="cover"; if(b.image) img.src=b.image; }
    } else {
      // legacy split or unknown — image full
      if(img){ if(b.image) img.src=b.image; }
    }

    // Etiqueta — con toggle
    // ── Helper: apply absolute position to floated element ──
    function applyBtnPosition(el, pos){
      if(!pos) return;
      el.classList.add("hero-desktop-el"); // hidden on mobile
      el.style.position = "absolute";
      el.style.zIndex = "10";
      const posMap = {
        "top-left":     {top:"20px",   left:"24px",  bottom:"auto", right:"auto", transform:"none"},
        "top-center":   {top:"20px",   left:"50%",   bottom:"auto", right:"auto", transform:"translateX(-50%)"},
        "top-right":    {top:"20px",   right:"24px", bottom:"auto", left:"auto",  transform:"none"},
        "center-left":  {top:"50%",    left:"24px",  bottom:"auto", right:"auto", transform:"translateY(-50%)"},
        "center":       {top:"50%",    left:"50%",   bottom:"auto", right:"auto", transform:"translate(-50%,-50%)"},
        "center-right": {top:"50%",    right:"24px", bottom:"auto", left:"auto",  transform:"translateY(-50%)"},
        "bottom-left":  {bottom:"24px",left:"24px",  top:"auto",    right:"auto", transform:"none"},
        "bottom-center":{bottom:"24px",left:"50%",   top:"auto",    right:"auto", transform:"translateX(-50%)"},
        "bottom-right": {bottom:"24px",right:"24px", top:"auto",    left:"auto",  transform:"none"}
      };
      const p = posMap[pos]; if(!p) return;
      Object.assign(el.style, p);
    }

    // ── Apply free drag position (from visual editor) ──
    // Elements are moved OUT of hero-inner and appended to .hero
    // so % coordinates match exactly the canvas in the admin drag editor
    function applyDragPos(el, pos, label){
      if(!el || !pos || pos.x===undefined || pos.y===undefined) return;
      const heroRoot = document.querySelector(".hero");
      if(!heroRoot) return;
      // Move element directly into .hero so % coordinates match the canvas
      if(el.parentElement !== heroRoot) heroRoot.appendChild(el);
      el.classList.add("hero-desktop-el"); // hidden on mobile
      el.style.position  = "absolute";
      el.style.zIndex    = "20";
      el.style.left      = pos.x + "%";
      el.style.top       = pos.y + "%";
      el.style.right     = "auto";
      el.style.bottom    = "auto";
      el.style.transform = "none";
      el.style.maxWidth  = "none";
      el.style.margin    = "0";
    }

    // ── Etiqueta / Badge ──
    const label = $(".hero-label");
    if(label){
      const show = b.labelEnabled !== false;
      label.style.display = show ? "" : "none";
      if(show){
        const icon = b.labelIcon ? b.labelIcon+" " : "";
        label.textContent = icon + (b.label || "");
        if(b.labelColor) label.style.color = b.labelColor;
        if(b.labelSize) label.style.fontSize = b.labelSize;
        if(b.labelFont) label.style.fontFamily = b.labelFont;
        if(b.labelAlign) label.style.textAlign = b.labelAlign;
        if(b.labelPadding) label.style.padding = b.labelPadding;
        if(b.labelBg){
          function hxRgbaL(h,a){var r=parseInt(h.slice(1,3),16)||0,g=parseInt(h.slice(3,5),16)||0,bv=parseInt(h.slice(5,7),16)||0; return "rgba("+r+","+g+","+bv+","+a+")";}
          const op = b.labelBgOpacity != null ? b.labelBgOpacity : 0.15;
          label.style.background = hxRgbaL(b.labelBg, op);
        }
        if(b.labelDragPos) applyDragPos(label, b.labelDragPos, "label");
        else if(label.parentElement && label.parentElement.id === "__drag-dummy"){/* noop */}
      }
    }

    // ── Título ──
    const title = $(".hero-title");
    if(title){
      const show = b.titleEnabled !== false;
      title.style.display = show ? "" : "none";
      if(show){
        const icon = b.titleIcon ? b.titleIcon+" " : "";
        const c1 = b.titleColor ? `color:${b.titleColor}` : "";
        const c2 = b.titleEmColor ? `color:${b.titleEmColor}` : "";
        title.innerHTML = `${icon}${escapeHtml(b.title||"")}${b.titleEm?`<br><em style="${c2};font-style:italic">${escapeHtml(b.titleEm)}</em>`:""}`;
        if(b.titleColor) title.style.color = b.titleColor;
        if(b.titleSize) title.style.fontSize = b.titleSize;
        if(b.titleFont) title.style.fontFamily = b.titleFont;
        if(b.titleAlign) title.style.textAlign = b.titleAlign;
        if(b.titlePadding) title.style.padding = b.titlePadding;
        if(b.titleDragPos) applyDragPos(title, b.titleDragPos, "title");
      }
    }

    // ── Descripción ──
    const desc = $(".hero-desc");
    if(desc){
      const show = b.descEnabled !== false;
      desc.style.display = show ? "" : "none";
      if(show){
        const icon = b.descIcon ? b.descIcon+" " : "";
        // Use innerHTML to support paragraph breaks (\n → <br>)
        const rawText = icon + (b.desc || "");
        desc.innerHTML = rawText.split("\n").map(line => escapeHtml(line)).join("<br>");
        if(b.descColor) desc.style.color = b.descColor;
        if(b.descOpacity != null) desc.style.opacity = b.descOpacity;
        if(b.descSize) desc.style.fontSize = b.descSize;
        if(b.descFont) desc.style.fontFamily = b.descFont;
        if(b.descAlign) desc.style.textAlign = b.descAlign;
        if(b.descPadding) desc.style.padding = b.descPadding;
        if(b.descMaxWidth) desc.style.maxWidth = b.descMaxWidth;
        if(b.descDragPos) applyDragPos(desc, b.descDragPos, "desc");
      }
    }

        const proofBar = document.getElementById("hero-proof-bar");
    if(proofBar){
      const pb = b.proofBar||{enabled:true};
      if(pb.enabled===false){
        proofBar.style.display="none";
      }else{
        proofBar.style.display="";
        const ps=pb.stars||{enabled:true,text:"\u2605\u2605\u2605\u2605\u2605"};
        const pc=pb.customers||{enabled:true,count:"+500",text:"clientes satisfechos"};
        const psh=pb.shipping||{enabled:true,text:"Env\xedo r\xe1pido"};
        const pp=[];
        if(ps.enabled!==false) pp.push("<span class=\"stars\">"+escapeHtml(ps.text)+"</span>");
        if(pc.enabled!==false) pp.push("<strong>"+escapeHtml(pc.count||"+500")+"</strong> "+escapeHtml(pc.text||"clientes satisfechos"));
        if(psh.enabled!==false){pp.push("<span class=\"sep\"></span>");pp.push("<strong>"+escapeHtml(psh.text||"Env\xedo")+"</strong>");}
        proofBar.innerHTML="<div class=\"hero-proof-bar-inner\" id=\"hero-proof-bar-inner\">"+pp.join("")+"</div>";
        // Outer container bg — gradient only shown when a frame type is active
        // Controlled after inner styles are set below
        // Apply frame via inline style — no CSS class conflicts possible
        const inner=document.getElementById("hero-proof-bar-inner");
        if(inner){
          const frame=pb.frame||"";
          const fc=pb.frameColor||"#ffffff";
          const fo=pb.frameOpacity!==undefined?pb.frameOpacity:0.85;
          const bgC=pb.bgColor||"#ffffff";
          const bgO=pb.bgOpacity!==undefined?pb.bgOpacity:0.65;
          // Parse hex to rgba
          function hexRgba(hex,a){
            var r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
            return "rgba("+r+","+g+","+b+","+a+")";
          }
          const fw=(pb.frameWidth||1.5)+"px";
          // Reset ALL frame styles first — guarantees "sin marco" is truly clean
          inner.style.cssText += ";background:transparent;border:none;box-shadow:none;border-radius:30px;padding:0;backdrop-filter:none;";
          // Also reset outer container gradient
          proofBar.style.background = "none";
          if(frame==="rounded"){
            inner.style.background=hexRgba(bgC,bgO);
            inner.style.border=fw+" solid "+hexRgba(fc,fo);
            inner.style.boxShadow="0 2px 14px rgba(0,0,0,.1)";
            inner.style.borderRadius="30px";
            inner.style.padding="7px 16px";
            inner.style.backdropFilter="blur(12px)";
          } else if(frame==="pill"){
            inner.style.background=hexRgba(bgC,bgO);
            inner.style.border=fw+" solid "+hexRgba(fc,fo);
            inner.style.borderRadius="6px";
            inner.style.padding="7px 16px";
            inner.style.backdropFilter="blur(12px)";
          } else if(frame==="bg-only"){
            inner.style.background=hexRgba(bgC,bgO);
            inner.style.borderRadius="30px";
            inner.style.padding="7px 16px";
            inner.style.backdropFilter="blur(12px)";
          } else if(frame==="dark"){
            inner.style.background="rgba(20,20,22,.78)";
            inner.style.border=fw+" solid rgba(255,255,255,.18)";
            inner.style.borderRadius="30px";
            inner.style.padding="7px 16px";
            inner.style.backdropFilter="blur(12px)";
          }
          // frame==="" → sin marco — no background whatsoever (all cleared above)
          // Font & color
          if(pb.textColor) inner.style.color=pb.textColor;
          if(pb.fontSize) inner.style.fontSize=pb.fontSize;
          if(pb.fontFamily) inner.style.fontFamily=pb.fontFamily;
        }
        if(b.proofBarDragPos) applyDragPos(proofBar, b.proofBarDragPos, "proofBar");
      }
    }
    const scrollBtn=document.getElementById("hero-scroll-btn");
    if(scrollBtn){
      const sc=b.scrollExplore||{};
      const lbl=scrollBtn.querySelector(".hero-scroll-label");
      if(lbl){
        lbl.textContent=sc.label||"Explorar";
        if(sc.color) lbl.style.color=sc.color;
        if(sc.fontSize) lbl.style.fontSize=sc.fontSize;
        if(sc.fontFamily) lbl.style.fontFamily=sc.fontFamily;
      }
      if(sc.href) scrollBtn.href=sc.href;
      scrollBtn.querySelectorAll("svg").forEach(svg=>{
        const sz=sc.chevronSize||26;
        svg.setAttribute("width",sz);
        svg.setAttribute("height",Math.round(sz*0.58));
        if(sc.chevronColor) svg.style.color=sc.chevronColor;
      });
    }
    // ── CTAs ──
    const ctas = $(".hero-ctas");
    if(ctas){
      const btn1 = b.btn1 || {};
      const btn2 = b.btn2 || {};
      const b1Show = btn1.enabled !== false;
      const b2Show = btn2.enabled !== false;

      // 🔧 Fix re-render bug: remove previously drag-positioned CTA buttons from .hero
      // These are <a> elements moved out of .hero-ctas by applyDragPos on previous renders.
      // Without cleanup they accumulate as duplicates on each re-render.
      const _heroRoot = document.querySelector(".hero");
      if(_heroRoot){
        ["__drag-btn1","__drag-btn2","__drag-btn3","hero-btn3-float"].forEach(id=>{
          const old = document.getElementById(id); if(old) old.remove();
        });
      }

      // SVG icons para modo icono-solo en móvil
      const SVG_CATALOG = `<svg class="btn-icon-svg" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>`;
      const SVG_WA = `<svg class="btn-icon-svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;
      const SVG_IG = `<svg class="btn-icon-svg" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`;

      function makeBtn(bt, defaultText, defaultBg, defaultColor){
        const bg = bt.bg || defaultBg;
        const col = bt.textColor || defaultColor;
        const rad = bt.radius || "50px";
        const fs = bt.fontSize ? `font-size:${bt.fontSize};` : "";
        const ff = bt.fontFamily ? `font-family:${bt.fontFamily};` : "";
        const pad = bt.padding ? `padding:${bt.padding};` : "";
        return `style="background:${bg};color:${col};border-radius:${rad};${fs}${ff}${pad}display:inline-flex;align-items:center;gap:8px;text-decoration:none;font-weight:700;cursor:pointer"`;
      }

      // Build standard CTA container (btn1 + btn2 side by side)
      let btn1El = "", btn2El = "";
      if(b1Show){
        const href = btn1.href || "#shop";
        const txt = escapeHtml(btn1.text||"Ver Catálogo");
        btn1El = `<a class="btn btn-dark btn-lg hero-cta-btn" href="${escapeAttr(href)}" ${makeBtn(btn1,"Ver Catálogo","#1e1e1e","#fff")}>${SVG_CATALOG}<span class="btn-text">${txt}</span></a>`;
      }
      if(b2Show){
        const href2 = btn2.href==="whatsapp" ? waLink(cfg,"Hola! Quiero información.") : (btn2.href||"#");
        const txt2 = escapeHtml(btn2.text||"Escríbenos");
        btn2El = `<a class="btn btn-wa btn-lg hero-cta-btn" href="${escapeAttr(href2)}" target="_blank" rel="noopener" ${makeBtn(btn2,"Escríbenos","#25D366","#fff")}>${SVG_WA}<span class="btn-text">${txt2}</span></a>`;
      }
      // Btn3 — Instagram
      const btn3 = b.btn3 || {};
      const b3Show = btn3.enabled === true;
      let btn3El = "";
      if(b3Show){
        const href3 = btn3.href || "#";
        const txt3 = escapeHtml(btn3.text||"Instagram");
        btn3El = `<a class="btn btn-instagram btn-lg hero-cta-btn" href="${escapeAttr(href3)}" target="_blank" rel="noopener" ${makeBtn(btn3,"Instagram","#E1306C","#fff")}>${SVG_IG}<span class="btn-text">${txt3}</span></a>`;
      }

      // Build ctas depending on position settings
      // btn3 is ONLY in mainBtns when it has no dragPos and no custom position
      const btn3InLine = b3Show && !b.btn3DragPos && (!btn3.position || btn3.position==="after-btn2");
      const mainBtns = [btn1El, btn2El, (btn3InLine ? btn3El : "")].filter(Boolean);
      ctas.innerHTML = mainBtns.join("");

      // Apply absolute positions
      const hero2 = $(".hero");
      if(hero2) hero2.style.position = "relative";
      const allBtnDoms = Array.from(ctas.querySelectorAll("a"));
      let btnDomIdx = 0;
      // dragPos takes priority over position-select — never apply both
      if(b1Show){
        const el1 = allBtnDoms[btnDomIdx]||allBtnDoms[0];
        if(b.btn1DragPos){
          el1.id = "__drag-btn1";
          applyDragPos(el1, b.btn1DragPos, "btn1");
        } else if(!b.dragEditorOnly && btn1.position){
          applyBtnPosition(el1, btn1.position);
        }
        btnDomIdx++;
      }
      if(b2Show){
        const el2 = allBtnDoms[btnDomIdx]||allBtnDoms[0];
        if(b.btn2DragPos){
          el2.id = "__drag-btn2";
          applyDragPos(el2, b.btn2DragPos, "btn2");
        } else if(!b.dragEditorOnly && btn2.position){
          applyBtnPosition(el2, btn2.position);
        }
        btnDomIdx++;
      }
      // btn3 handling: render as float if drag pos set OR if custom position
      if(b3Show && (b.btn3DragPos || (btn3.position && btn3.position !== "after-btn2"))){
        const hero2f = $(".hero");
        if(hero2f){
          // Create fresh float element
          const floatEl = document.createElement("a");
          floatEl.id = b.btn3DragPos ? "__drag-btn3" : "hero-btn3-float";
          floatEl.className = "btn btn-instagram btn-lg hero-desktop-el";
          floatEl.href = btn3.href || "#";
          floatEl.target = "_blank"; floatEl.rel = "noopener";
          floatEl.style.cssText = `position:absolute;z-index:10;background:${btn3.bg||'#E1306C'};color:${btn3.textColor||'#fff'};border-radius:${btn3.radius||'50px'};${btn3.fontSize?'font-size:'+btn3.fontSize+';':''}${btn3.fontFamily?'font-family:'+btn3.fontFamily+';':''}${btn3.padding?'padding:'+btn3.padding+';':''}display:inline-flex;align-items:center;gap:6px;text-decoration:none;font-weight:700`;
          floatEl.innerHTML = `${SVG_IG}<span class="btn-text">${escapeHtml(btn3.text||'Instagram')}</span>`;
          hero2f.appendChild(floatEl);
          if(b.btn3DragPos){ applyDragPos(floatEl, b.btn3DragPos, "btn3"); }
          else if(!b.dragEditorOnly){ applyBtnPosition(floatEl, btn3.position); }
        }
      }

      // ── Render mobile layer (independent from desktop) ──
      renderMobileBanner(cfg, SVG_CATALOG, SVG_WA, SVG_IG, waLink, escapeHtml, escapeAttr);
    }  // end if(ctas)

  }  // end renderBanner

  /* ════════════════════════════════════════════════════════
     MOBILE BANNER — renderizado completamente independiente
     Lee de cfg.banner.mobile; fallback a cfg.banner
  ════════════════════════════════════════════════════════ */
  function renderMobileBanner(cfg, SVG_CATALOG, SVG_WA, SVG_IG, waLink, escapeHtml, escapeAttr){
    const b = cfg.banner || {};
    const m = b.mobile  || {};

    // ── CSS variables ──────────────────────────────────────
    const heroH  = m.heroHeight  || 55;
    const bSize  = m.btn1Size || m.btnSize || 58;
    const bBO    = m.btnBorderOpacity !== undefined ? m.btnBorderOpacity : 0.25;
    const proofBg = m.proofBgOpacity !== undefined ? m.proofBgOpacity : 0.38;
    const imgPos  = m.imagePosition || "center 30%";
    const root    = document.documentElement;
    root.style.setProperty("--mob-hero-vh",   heroH);
    root.style.setProperty("--mob-btn-size",  bSize + "px");
    root.style.setProperty("--mob-btn-border",bBO);
    root.style.setProperty("--mob-proof-bg",  proofBg);
    root.style.setProperty("--mob-img-pos",   imgPos);

    // ── Image ─────────────────────────────────────────────
    const heroImgEl = document.getElementById("hero-img");
    if(heroImgEl){
      const mImg = m.image || b.image || "";
      if(mImg) heroImgEl.src = mImg;
      heroImgEl.style.objectPosition = imgPos;
    }

    // ── Mobile overlay tint ───────────────────────────────
    function hxA(h,a){var r=parseInt(h.slice(1,3),16)||0,g=parseInt(h.slice(3,5),16)||0,bv=parseInt(h.slice(5,7),16)||0; return "rgba("+r+","+g+","+bv+","+a+")";}
    const heroEl = document.querySelector(".hero");
    // Use a dedicated mobile tint element inside hero
    let mobTint = document.getElementById("hero-mob-tint");
    if(!mobTint){
      mobTint = document.createElement("div");
      mobTint.id = "hero-mob-tint";
      mobTint.style.cssText = "position:absolute;inset:0;pointer-events:none;z-index:3;display:none";
      if(heroEl) heroEl.appendChild(mobTint);
    }
    const mOC = m.overlayColor   || "#000";
    const mOO = m.overlayOpacity !== undefined ? m.overlayOpacity : 0.55;
    // Only apply on mobile via inline style (CSS hides it on desktop)
    mobTint.style.background = hxA(mOC, mOO);
    // Show/hide via class — CSS media query controls display
    mobTint.className = "hero-mob-tint-el";

    // ── Title ─────────────────────────────────────────────
    const titleEl = document.getElementById("hero-mob-title");
    if(titleEl){
      const mTitle   = m.title     || b.title     || "";
      const mTitleEm = m.titleEm   || b.titleEm   || "";
      const show     = m.titleEnabled !== false;
      titleEl.style.display = (show && mTitle) ? "" : "none";
      if(show && mTitle){
        const emCol = m.titleEmColor || b.titleEmColor || "#C9A96E";
        titleEl.innerHTML = escapeHtml(mTitle) + (mTitleEm ? `<br><em style="font-style:italic;color:${emCol}">${escapeHtml(mTitleEm)}</em>` : "");
        if(m.titleColor)  titleEl.style.color      = m.titleColor;
        if(m.titleSize)   titleEl.style.fontSize   = m.titleSize;
        if(m.titleFont)   titleEl.style.fontFamily = m.titleFont;
        if(m.titleAlign)  titleEl.style.textAlign  = m.titleAlign;
        if(m.titlePos){ titleEl.style.top=m.titlePos.y+"%"; titleEl.style.left=m.titlePos.x+"%"; titleEl.style.right="auto"; }
      }
    }

    // ── Description ───────────────────────────────────────
    const descEl = document.getElementById("hero-mob-desc");
    if(descEl){
      const mDesc = m.desc || (m.descInherit !== false ? b.desc : "") || "";
      const show  = m.descEnabled === true;
      descEl.style.display = (show && mDesc) ? "" : "none";
      if(show && mDesc){
        descEl.innerHTML = mDesc.split("\n").map(l=>l.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")).join("<br>");
        if(m.descColor)  descEl.style.color    = m.descColor;
        if(m.descSize)   descEl.style.fontSize = m.descSize;
        if(m.descFont)   descEl.style.fontFamily = m.descFont;
        if(m.descPos){ descEl.style.top=m.descPos.y+"%"; descEl.style.left=m.descPos.x+"%"; descEl.style.right="auto"; }
      }
    }

    // ── SVG icons ─────────────────────────────────────────
    const btnSvgs = [SVG_CATALOG, SVG_WA, SVG_IG];

    // ── Button helper ─────────────────────────────────────
    function applyMobBtn(elId, enabled, bg, col, href, svgHtml, pos, customBg){
      const el = document.getElementById(elId);
      if(!el) return;
      el.style.display = enabled ? "" : "none";
      if(!enabled) return;
      el.innerHTML = svgHtml;
      el.href = href || "#";
      if(customBg){
        el.style.background = customBg;
      } else if(bg){
        el.style.background = bg;
        el.style.color = col || "#fff";
      }
      if(pos){ el.style.top=pos.y+"%"; el.style.left=pos.x+"%"; el.style.right="auto"; }
    }

    // Btn1 — Catálogo
    const m1Bg  = m.btn1Bg  || (b.btn1||{}).bg  || "#1e1e1e";
    const m1Col = m.btn1Color|| (b.btn1||{}).textColor || "#fff";
    const m1Href= (b.btn1||{}).href || "#shop";
    applyMobBtn("hero-mob-btn1", m.btn1Enabled !== false, m1Bg, m1Col, m1Href, SVG_CATALOG, m.btn1Pos);

    // Btn2 — WhatsApp
    const m2Bg  = m.btn2Bg  || (b.btn2||{}).bg  || "#25D366";
    const m2Col = m.btn2Color|| (b.btn2||{}).textColor || "#fff";
    const m2Href= (b.btn2||{}).href==="whatsapp" ? waLink(cfg,"Hola! Quiero información.") : ((b.btn2||{}).href||"#");
    applyMobBtn("hero-mob-btn2", m.btn2Enabled !== false, m2Bg, m2Col, m2Href, SVG_WA, m.btn2Pos);

    // Btn3 — Instagram (solo si cfg.banner.btn3.enabled OR m.btn3Enabled)
    const btn3Enabled = m.btn3Enabled === true || (b.btn3||{}).enabled === true;
    const m3Href = (b.btn3||{}).href || "#";
    applyMobBtn("hero-mob-btn3", btn3Enabled, "", "#fff", m3Href, SVG_IG, m.btn3Pos, null);
    // IG always uses gradient unless custom bg set
    const btn3El = document.getElementById("hero-mob-btn3");
    if(btn3El && btn3Enabled){
      const m3Bg = m.btn3Bg || (b.btn3||{}).bg || "";
      if(m3Bg) btn3El.style.background = m3Bg;
    }

    // ── Proof bar ─────────────────────────────────────────
    const proofEl = document.getElementById("hero-mob-proof");
    if(proofEl){
      const show = m.proofShow !== false;
      proofEl.style.display = show ? "" : "none";
      if(show){
        const pb = b.proofBar || {};
        const ps = pb.stars    || {enabled:true,text:"★★★★★"};
        const pc = pb.customers|| {enabled:true,count:"+500",text:"clientes satisfechos"};
        const psh= pb.shipping || {enabled:false,text:"Envío rápido"};
        let pp = [];
        if(ps.enabled!==false) pp.push(`<span class="stars">${escapeHtml(ps.text||"★★★★★")}</span>`);
        if(pc.enabled!==false) pp.push(`<strong>${escapeHtml(pc.count||"+500")}</strong> ${escapeHtml(pc.text||"clientes satisfechos")}`);
        if(psh.enabled===true){ pp.push(`<span class="sep"></span>`); pp.push(`<strong>${escapeHtml(psh.text||"Envío")}</strong>`); }
        proofEl.innerHTML = pp.join(" ");
        if(m.proofPos){ proofEl.style.top=m.proofPos.y+"%"; proofEl.style.left=m.proofPos.x+"%"; proofEl.style.right="auto"; }
      }
    }
  }

  function route(){
    const raw = (location.hash || "#home").replace(/^#/, "");

    // ── SPACE ROUTE ──────────────────────────────────────────
    if(raw.startsWith("space/")){
      const slug = raw.slice(6);
      $$(".page").forEach(p=>p.classList.remove("active"));
      const pg = document.getElementById("page-space") || document.getElementById("page-home");
      pg.classList.add("active");
      window.scrollTo({top:0, behavior:"auto"});
      renderSpacePage(window.__cfg, slug);
      return;
    }

    // dynamic product route
    if(raw.startsWith("product/")){
      const id = raw.split("/")[1] || "";
      $$(".page").forEach(p=>p.classList.remove("active"));
      const page = document.getElementById("page-product") || document.getElementById("page-home");
      page.classList.add("active");
      window.scrollTo({top:0, behavior:"auto"});
      renderProductPage(window.__cfg, id);
      return;
    }
    if(raw==="checkout"){
      $$(".page").forEach(p=>p.classList.remove("active"));
      const page = document.getElementById("page-checkout") || document.getElementById("page-home");
      page.classList.add("active");
      window.scrollTo({top:0, behavior:"auto"});
      renderCheckout(window.__cfg);
      return;
    }
    if(raw==="cart"){
      $$(".page").forEach(p=>p.classList.remove("active"));
      const page = document.getElementById("page-cart") || document.getElementById("page-home");
      page.classList.add("active");
      window.scrollTo({top:0, behavior:"auto"});
      renderCart(window.__cfg);
      return;
    }

    // Normal pages
    $$(".page").forEach(p=>p.classList.remove("active"));
    // "offers" should show the shop page filtered (not a blank page)
    const pageId = (raw==="offers") ? "page-shop" : ("page-"+raw);
    const page = document.getElementById(pageId) || document.getElementById("page-home");
    page.classList.add("active");
    window.scrollTo({top:0, behavior:"auto"});
    if(raw==="shop"){ if(window.__shopState&&window.__shopState.tab&&window.__shopState.tab.type==="sale"){window.__shopState.tab={type:"all",value:""};syncShopTabs(window.__cfg);} renderShop(window.__cfg); }
    if(raw==="offers"){
      window.__shopState.tab = {type:"sale", value:""};
      syncShopTabs(window.__cfg);
      renderShop(window.__cfg);
    }
    if(raw==="about") renderAbout(window.__cfg);
  }


  // ── RENDER SPACE PAGE ────────────────────────────────────────────
  function renderSpacePage(cfg, slug){
    const host = document.getElementById("space-page-host");
    if(!host) return;
    const spaces = cfg.spaces || [];
    const sp = spaces.find(s=>(s.slug||s.id)===slug);
    if(!sp){
      host.innerHTML = `<div style="padding:80px 24px;text-align:center;color:#aaa">
        <div style="font-size:3rem;margin-bottom:16px">&#128204;</div>
        <h2 style="margin-bottom:8px;color:#1e1e1e">Espacio no encontrado</h2>
        <p>El espacio "<strong>${escapeHtml(slug)}</strong>" no existe todavía.</p>
        <a href="#home" style="display:inline-block;margin-top:20px;padding:10px 24px;background:#C9A96E;color:#fff;border-radius:8px;text-decoration:none">Volver al inicio</a>
      </div>`;
      return;
    }
    const h = sp.hero||{};
    const blocks = sp.blocks||[];
    let out = `<div style="background:${escapeHtml(sp.bg||'#fff')};min-height:70vh">`;

    // Hero
    if(h.enabled!==false && (h.img||h.title)){
      const align = h.align||"center";
      const justMap = {left:"flex-start",center:"center",right:"flex-end",justify:"center"};
      out += `<div style="position:relative;background:${h.img?`url(${escapeHtml(h.img)}) center/cover no-repeat`:'#1e1e1e'};height:${escapeHtml(h.h||'45vh')};display:flex;align-items:center;justify-content:${justMap[align]||'center'}">`;
      if(h.img) out += `<div style="position:absolute;inset:0;background:rgba(0,0,0,.38)"></div>`;
      out += `<div style="position:relative;z-index:1;padding:24px 40px;text-align:${escapeHtml(align)};color:${escapeHtml(h.color||'#fff')}">`;
      if(h.title) out += `<h1 style="font-size:clamp(1.4rem,4vw,2.8rem);font-weight:700;margin:0 0 10px">${escapeHtml(h.title)}</h1>`;
      if(h.sub)   out += `<p style="font-size:clamp(.85rem,2vw,1.1rem);opacity:.88;margin:0">${escapeHtml(h.sub)}</p>`;
      out += `</div></div>`;
    }

    // Blocks
    const pad = sp.padding||"50px 0";
    const mw  = sp.maxwidth||"1100px";
    out += `<div style="padding:${escapeHtml(pad)}"><div style="max-width:${escapeHtml(mw)};margin:0 auto;padding:0 20px">`;

    blocks.forEach(bl=>{
      out += renderSpaceBlock(bl, cfg);
    });

    out += `</div></div></div>`;
    host.innerHTML = out;

    // Activate product add-to-cart buttons inside spaces
    host.querySelectorAll("[data-space-add]").forEach(btn=>{
      btn.onclick = function(){
        const id = btn.getAttribute("data-space-add");
        const p = (cfg.products||[]).find(x=>String(x.id)===String(id));
        if(!p) return;
        const cart = loadCart();
        const ex = cart.find(c=>c.id===p.id);
        if(ex) ex.qty++; else cart.push({id:p.id,qty:1});
        saveCart(cart);
        setBadge(cartCount(cart));
        btn.textContent = "✓ Agregado";
        setTimeout(()=>btn.textContent="Agregar al carrito",1800);
      };
    });
  }

  function renderSpaceBlock(bl, cfg){
    function eh(s){ return escapeHtml(s||""); }
    const prods = cfg.products||[];
    switch(bl.type){
      case "text":
        return `<div style="padding:${eh(bl.padding||'0 0 28px')};text-align:${eh(bl.align||'left')};font-size:${eh(bl.fontSize||'1rem')};color:${eh(bl.color||'#1e1e1e')}">${bl.content||""}</div>`;

      case "heading":{
        const tag = bl.level||"h2";
        const fs = {h2:"2rem",h3:"1.5rem",h4:"1.2rem"}[tag]||"1.5rem";
        return `<${tag} style="padding:${eh(bl.padding||'0 0 16px')};text-align:${eh(bl.align||'left')};font-size:${eh(bl.fontSize||fs)};color:${eh(bl.color||'#1e1e1e')};font-weight:700;line-height:1.2">${eh(bl.text)}</${tag}>`;
      }

      case "image":{
        const href = bl.href ? `href="${ eh(bl.href)}"` : "";
        const tag  = bl.href ? "a" : "div";
        return `<${tag} ${href} style="display:block;text-align:${eh(bl.align||'center')};padding:${eh(bl.padding||'0 0 28px')}">
          <img src="${ eh(bl.src||"")}" alt="${ eh(bl.alt||"")}" loading="lazy"
            style="width:${eh(bl.width||'100%')};max-width:100%;height:${eh(bl.height||'auto')};object-fit:cover;border-radius:${eh(bl.radius||'0')}"/>
        </${tag}>`;
      }

      case "button":{
        const styles = {
          dark:"background:#1e1e1e;color:#fff;border:none",
          gold:"background:#C9A96E;color:#fff;border:none",
          ghost:"background:transparent;color:#1e1e1e;border:2px solid #1e1e1e",
          white:"background:#fff;color:#1e1e1e;border:2px solid #e5e0d8"
        };
        const s = styles[bl.style||"dark"]||styles.dark;
        return `<div style="padding:${eh(bl.padding||'0 0 28px')};text-align:${eh(bl.align||'center')}">
          ${bl.note?`<div style="font-size:.8rem;color:#888;margin-bottom:8px">${ eh(bl.note)}</div>`:""}
          <a href="${ eh(bl.href||'#')}" style="display:inline-block;padding:12px 28px;border-radius:8px;font-weight:600;font-size:.95rem;text-decoration:none;cursor:pointer;${s}">${ eh(bl.text||'Ver más')}</a>
        </div>`;
      }

      case "image-text":{
        const imgLeft = bl.imgside!=="right";
        const imgW = bl.imgWidth||"42%";
        return `<div style="display:flex;gap:${eh(bl.gap||'28px')};align-items:${eh(bl.valign||'center')};flex-wrap:wrap;padding:${eh(bl.padding||'0 0 36px')}">
          ${imgLeft&&bl.src?`<img src="${ eh(bl.src)}" style="width:${eh(imgW)};min-width:200px;flex-shrink:0;object-fit:cover;border-radius:${eh(bl.imgRadius||'10px')}" loading="lazy"/>`:""}
          <div style="flex:1;min-width:200px">
            ${bl.title?`<h3 style="margin:0 0 10px;font-size:1.3rem;color:${eh(bl.titleColor||'#1e1e1e')}">${ eh(bl.title)}</h3>`:""}
            <div style="color:${eh(bl.textColor||'#555')};font-size:${eh(bl.fontSize||'1rem')};line-height:1.65">${bl.text||""}</div>
            ${bl.btnText?`<a href="${ eh(bl.btnHref||'#')}" style="display:inline-block;margin-top:14px;padding:10px 22px;background:${eh(bl.btnBg||'#1e1e1e')};color:${eh(bl.btnColor||'#fff')};border-radius:7px;text-decoration:none;font-weight:600">${ eh(bl.btnText)}</a>`:""}
          </div>
          ${!imgLeft&&bl.src?`<img src="${ eh(bl.src)}" style="width:${eh(imgW)};min-width:200px;flex-shrink:0;object-fit:cover;border-radius:${eh(bl.imgRadius||'10px')}" loading="lazy"/>`:""}
        </div>`;
      }

      case "gallery":{
        const imgs = bl.imgs||[];
        if(!imgs.length) return "";
        const cols = parseInt(bl.cols)||3;
        return `<div style="display:grid;grid-template-columns:repeat(${cols},1fr);gap:${eh(bl.gap||'12px')};padding:${eh(bl.padding||'0 0 28px')}">
          ${imgs.map(src=>`<img src="${ eh(src)}" loading="lazy" style="width:100%;height:${eh(bl.height||'220px')};object-fit:cover;border-radius:${eh(bl.radius||'8px')}"/>`).join("")}
        </div>`;
      }

      case "columns":{
        const items = bl.items||[];
        if(!items.length) return "";
        const cols = items.length;
        return `<div style="display:grid;grid-template-columns:repeat(${cols},1fr);gap:${eh(bl.gap||'20px')};padding:${eh(bl.padding||'0 0 28px')}">
          ${items.map(c=>`<div style="background:${eh(c.bg||bl.colBg||'#f8f5f0')};border-radius:${eh(bl.radius||'10px')};padding:${eh(c.padding||bl.colPad||'22px')};color:${eh(bl.textColor||'#1e1e1e')}">${c.text||""}</div>`).join("")}
        </div>`;
      }

      case "divider":
        if(bl.style==="space") return `<div style="height:${eh(bl.height||'40px')}"></div>`;
        if(bl.style==="dots") return `<div style="text-align:center;padding:${eh(bl.height||'20px')} 0;color:${eh(bl.color||'#C9A96E')};letter-spacing:10px;font-size:.9rem">&#9679; &#9679; &#9679;</div>`;
        return `<hr style="border:none;border-top:${eh(bl.thickness||'1px')} solid ${eh(bl.color||'#e5e0d8')};margin:${eh(bl.height||'20px')} 0"/>`;

      case "banner-cta":{
        return `<div style="background:${eh(bl.bg||'#1e1e1e')};border-radius:${eh(bl.radius||'16px')};padding:${eh(bl.padding||'48px 32px')};text-align:${eh(bl.align||'center')};margin:${eh(bl.margin||'0 0 28px')}">
          ${bl.eyebrow?`<div style="font-size:.75rem;letter-spacing:.15em;text-transform:uppercase;color:${eh(bl.eyebrowColor||'#C9A96E')};margin-bottom:10px">${ eh(bl.eyebrow)}</div>`:""}
          ${bl.title?`<h2 style="font-size:clamp(1.3rem,3vw,2rem);font-weight:700;color:${eh(bl.titleColor||'#fff')};margin:0 0 12px">${ eh(bl.title)}</h2>`:""}
          ${bl.sub?`<p style="color:${eh(bl.subColor||'rgba(255,255,255,.75)')};margin:0 0 24px;font-size:1rem">${ eh(bl.sub)}</p>`:""}
          ${bl.btnText?`<a href="${ eh(bl.btnHref||'#shop')}" style="display:inline-block;padding:12px 30px;background:${eh(bl.btnBg||'#C9A96E')};color:${eh(bl.btnColor||'#fff')};border-radius:8px;text-decoration:none;font-weight:700">${ eh(bl.btnText)}</a>`:""}
        </div>`;
      }

      case "testimonial":{
        return `<div style="background:${eh(bl.bg||'#faf8f5')};border-radius:12px;padding:24px 28px;margin:${eh(bl.margin||'0 0 20px')};border-left:4px solid ${eh(bl.accentColor||'#C9A96E')}">
          <div style="font-size:1.5rem;color:${eh(bl.starColor||'#C9A96E')};margin-bottom:8px">${"★".repeat(parseInt(bl.stars)||5)}</div>
          <p style="color:${eh(bl.textColor||'#555')};font-style:italic;margin:0 0 12px;font-size:${eh(bl.fontSize||'1rem')}">"${eh(bl.quote)}"</p>
          <div style="font-weight:700;color:${eh(bl.nameColor||'#1e1e1e')};font-size:.88rem">${ eh(bl.name)}</div>
          ${bl.role?`<div style="font-size:.78rem;color:#888">${ eh(bl.role)}</div>`:""}
        </div>`;
      }

      case "products":{
        let pool = [...prods];
        if(bl.filter==="featured") pool = pool.filter(p=>p.featured);
        else if(bl.filter==="sale") pool = pool.filter(p=>p.onSale);
        else if(bl.filter==="new") pool = pool.filter(p=>p.new);
        // Hand-picked IDs override filter
        if(bl.productIds && bl.productIds.length){
          pool = bl.productIds.map(id=>prods.find(p=>String(p.id)===String(id))).filter(Boolean);
        }
        pool = pool.slice(0, parseInt(bl.max)||6);
        if(!pool.length) return `<div style="padding:20px;text-align:center;color:#aaa;border:1.5px dashed #ddd;border-radius:10px;margin:0 0 20px">Sin productos que mostrar.</div>`;
        const cols = parseInt(bl.cols)||3;
        return `<div style="margin:0 0 28px">
          ${bl.title?`<h3 style="font-size:1.3rem;font-weight:700;margin:0 0 18px;color:${eh(bl.titleColor||'#1e1e1e')};text-align:${eh(bl.titleAlign||'left')}">${ eh(bl.title)}</h3>`:""}
          <div style="display:grid;grid-template-columns:repeat(${cols},1fr);gap:${eh(bl.gap||'16px')}">
            ${pool.map(p=>{
              const sale = p.onSale&&p.salePrice&&p.salePrice<p.price;
              return `<div style="background:${eh(bl.cardBg||'#fff')};border:1px solid ${eh(bl.cardBorder||'#f0ebe2')};border-radius:${eh(bl.cardRadius||'14px')};overflow:hidden;cursor:pointer" onclick="location.hash='product/${eh(String(p.id))}'">
                ${p.image?`<img src="${ eh(p.image)}" style="width:100%;height:${eh(bl.imgH||'200px')};object-fit:cover" loading="lazy"/>`:
                  `<div style="width:100%;height:${eh(bl.imgH||'200px')};background:#f5f0e8;display:flex;align-items:center;justify-content:center;color:#ccc;font-size:2rem">🧴</div>`}
                <div style="padding:12px">
                  <div style="font-weight:700;font-size:.9rem;color:${eh(bl.nameColor||'#1e1e1e')};margin-bottom:4px">${ eh(p.name)}</div>
                  <div style="font-size:.88rem;color:${eh(bl.priceColor||'#C9A96E')};font-weight:600">${sale?`<span style="text-decoration:line-through;opacity:.55;font-weight:400;margin-right:6px">RD$${eh(String(p.price))}</span>RD$${eh(String(p.salePrice))}`:`RD$${eh(String(p.price||0))}`}</div>
                  <button data-space-add="${ eh(String(p.id))}" style="width:100%;margin-top:8px;padding:8px;background:${eh(bl.btnBg||'#1e1e1e')};color:${eh(bl.btnColor||'#fff')};border:none;border-radius:7px;font-size:.82rem;font-weight:600;cursor:pointer">Agregar al carrito</button>
                </div>
              </div>`;
            }).join("")}
          </div>
        </div>`;
      }

      case "video":{
        const ratio = bl.ratio||"16/9";
        const [rw,rh] = ratio.split("/").map(Number);
        const pct = ((rh/rw)*100).toFixed(2);
        const isEmbed = bl.src&&(bl.src.includes("youtube")||bl.src.includes("vimeo"));
        return `<div style="padding:${eh(bl.padding||'0 0 28px')}">
          <div style="position:relative;padding-bottom:${pct}%;border-radius:${eh(bl.radius||'10px')};overflow:hidden;background:#000">
            ${isEmbed
              ? `<iframe src="${ eh(bl.src)}" style="position:absolute;inset:0;width:100%;height:100%;border:none" allowfullscreen loading="lazy"></iframe>`
              : `<video src="${ eh(bl.src)}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover" controls></video>`}
          </div>
        </div>`;
      }

      case "html":
        return `<div style="padding:${eh(bl.padding||'0 0 20px')}">${bl.html||""}</div>`;

      default:
        return "";
    }
  }


  // ── FOOTER ──────────────────────────────────────────────────────
  function renderFooter(cfg){
    const footer = document.getElementById("site-footer");
    if(!footer) return;
    const ft = cfg.footer || {};
    const cols = ft.columns || [];
    // Styles
    footer.style.background = ft.bg || "#1e1e1e";
    footer.style.color = ft.color || "#fff";
    if(ft.fontFamily) footer.style.fontFamily = ft.fontFamily;
    if(ft.fontSize) footer.style.fontSize = ft.fontSize;
    if(ft.padding) footer.style.padding = `${ft.padding}px 0 28px`;
    // Link colors via CSS var
    footer.style.setProperty("--footer-link", ft.linkColor || "#C9A96E");
    // Columns
    const host = document.getElementById("footer-columns-host");
    if(host){
      if(cols.length){
        const colStyle = `grid-template-columns:repeat(${Math.min(cols.length,4)},1fr);gap:32px;margin-bottom:40px;display:grid`;
        host.innerHTML = `<div style="${colStyle}">${cols.map(col=>{
          const links = (col.links||[]).map(lk=>{
            if(lk.type==="button") return `<a href="${escapeHtml(lk.href||"#")}" style="display:inline-block;margin-top:6px;padding:8px 16px;background:${escapeHtml(lk.bg||"#C9A96E")};color:${escapeHtml(lk.color||"#fff")};border-radius:7px;text-decoration:none;font-size:.8rem;font-weight:600">${lk.icon?lk.icon+" ":""}${escapeHtml(lk.label||"")}</a>`;
            return `<div><a href="${escapeHtml(lk.href||"#")}" style="color:var(--footer-link,#C9A96E);text-decoration:none;font-size:${ft.fontSize||".83rem"};display:inline-flex;align-items:center;gap:5px">${lk.icon?`<span>${lk.icon}</span>`:""}${escapeHtml(lk.label||"")}</a></div>`;
          }).join("");
          const titleHtml = col.title ? `<div style="font-size:.65rem;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,.38);margin-bottom:14px;font-weight:600">${col.icon?col.icon+" ":""}${escapeHtml(col.title)}</div>` : "";
          const textHtml = col.text ? `<div style="font-size:${ft.fontSize||".83rem"};color:rgba(255,255,255,.5);line-height:1.7;margin-bottom:10px">${col.text}</div>` : "";
          return `<div>${titleHtml}${textHtml}${links}</div>`;
        }).join("")}</div>`;
      } else {
        host.innerHTML = "";
      }
    }
    // Bottom bar
    const cr = document.getElementById("footer-copyright");
    if(cr) cr.innerHTML = ft.copyright || `© ${new Date().getFullYear()} Onne Store RD`;
    const adminLink = document.getElementById("admin-link");
    const adminWrap = document.getElementById("footer-admin-link");
    if(adminLink && adminWrap){
      const show = ft.showAdmin !== false;
      adminWrap.innerHTML = show
        ? `<a href="admin.html" style="color:rgba(255,255,255,.35);font-size:.72rem">Admin</a>`
        : `<a href="admin.html" style="color:transparent;font-size:0;user-select:none" aria-hidden="true">·</a>`;
    }
  }

  function hideLoader(){
    const l = document.getElementById("loader");
    if(!l) return;
    l.classList.add("out");
    setTimeout(()=>l.remove(), 600);
  }

  // ---------- HOME ----------
  function emptyGrid(){
    return `
      <div class="empty-state" style="grid-column:1/-1">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <h3>Sin productos</h3><p>Agrega productos desde el admin.</p>
      </div>`;
  }

  function productCard(p){
    const sale = p.onSale && p.salePrice && p.salePrice < p.price;
    const badges = [
      sale ? `<span class="badge badge-sale">Oferta</span>` : "",
      p.new ? `<span class="badge badge-new">Nuevo</span>` : "",
      p.featured ? `<span class="badge badge-top">Top</span>` : ""
    ].filter(Boolean).join("");
    const disc = sale ? Math.round((1 - (p.salePrice/p.price))*100) : 0;
    return `
      <div class="product-card" data-id="${p.id}">
        <div class="pc-img">
          <img src="${p.image||""}" alt="${escapeHtml(p.name)}">
          <div class="pc-badges">${badges}</div>
          <div class="pc-quick">Ver detalles</div>
        </div>
        <div class="pc-body">
          <div class="pc-brand">${escapeHtml(p.brand||"")}</div>
          <div class="pc-name">${escapeHtml(p.name||"")}</div>
          <div class="pc-meta">${escapeHtml(p.gender||"")} · ${escapeHtml(String(p.ml||""))}ml</div>
          <div class="pc-price">
            <div class="pc-price-now">${money(sale?p.salePrice:p.price)}</div>
            ${sale?`<div class="pc-price-was">${money(p.price)}</div><div class="pc-price-disc">-${disc}%</div>`:""}
          </div>
          <div class="pc-footer">
            <button class="btn btn-outline-gold btn-sm" data-add="${p.id}" type="button">Agregar</button>
            <button class="btn btn-gold btn-sm" data-buy="${p.id}" type="button">Comprar</button>
          </div>
        </div>
      </div>
    `;
  }

  function renderHome(cfg){
    // Apply home section toggles + titles (if present in cfg.homeSections)
    const secMap = {
      new: document.getElementById("home-section-new"),
      best: document.getElementById("home-section-best"),
      offers: document.getElementById("home-offers-section"),
      testimonials: document.getElementById("home-section-testimonials")
    };
    const defaults = { new:true, best:true, offers:true, testimonials:true };
    (cfg.homeSections||[]).forEach(s=>{
      if(secMap[s.id]){
        const el = secMap[s.id];
        el.style.display = (s.visible===false) ? "none" : "";
        if(s.bg) el.style.background = s.bg;
        if(s.padTop||s.padBot) el.style.padding = `${s.padTop||40}px 0 ${s.padBot||40}px`;
        const h2 = el.querySelector(".sec-title");
        if(h2){
          if(s.title) h2.innerHTML = (s.icon?s.icon+" ":"")+s.title;
          if(s.titleColor) h2.style.color = s.titleColor;
          if(s.titleSize) h2.style.fontSize = s.titleSize;
          if(s.font) h2.style.fontFamily = s.font;
        }
        const eye = el.querySelector(".eyebrow");
        if(eye && s.eyebrow) eye.textContent = s.eyebrow;
      }
    });

    const prods = cfg.products || [];
    const newGrid = $("#home-new-grid");
    const bestGrid = $("#home-best-grid");
    const offerGrid = $("#home-offers-grid");
    if(newGrid){
      const list = pickProducts(cfg, "new", p=>p.new);
      newGrid.innerHTML = list.map(productCard).join("") || emptyGrid();
      ensureCarouselShell(newGrid, (cfg.homeProductSections||{}).new || {carousel:true, arrows:true});
    }
    if(bestGrid){
      const list = pickProducts(cfg, "best", p=>p.featured);
      bestGrid.innerHTML = list.map(productCard).join("") || emptyGrid();
      ensureCarouselShell(bestGrid, (cfg.homeProductSections||{}).best || {carousel:true, arrows:true});
    }
    // Offers: render using the same product cards as the main catalog so images look clean and consistent
    if(offerGrid){
      const list = pickProducts(cfg, "offers", p=>p.onSale);
      offerGrid.innerHTML = list.map(productCard).join("") || emptyGrid();
      ensureCarouselShell(offerGrid, (cfg.homeProductSections||{}).offers || {carousel:true, arrows:true});
    }

    renderTestimonials(cfg);
    const testiGrid = document.getElementById("home-testi-grid");
    if(testiGrid) ensureCarouselShell(testiGrid, (cfg.testimonials?.display||{carousel:true, arrows:true}));
    renderHomeCustom(cfg);
  }

  function applySectionStyle(el, style){
    if(!el || !style) return;
    if(style.bg) el.style.background = style.bg;
    if(style.color) el.style.color = style.color;
    if(style.padding) el.style.padding = style.padding;
  }

  function renderHomeCustom(cfg){
    const host = document.getElementById("home-custom-sections");
    if(!host) return;
    const customs = (cfg.homeSections||[]).filter(s=>s.type==="custom" && s.visible!==false);
    host.innerHTML = customs.map(s=>{
      const ptop = s.padTop||"40"; const pbot = s.padBot||"40";
      const sectionStyle = `${s.bg?`background:${s.bg};`:""}padding:${ptop}px 0 ${pbot}px`;
      const titleHtml = s.title ? `<div class="sec-header"><div><h2 class="sec-title" style="${s.titleColor?`color:${s.titleColor};`:""}${s.titleSize?`font-size:${s.titleSize};`:""}${s.font?`font-family:${s.font};`:""}">${s.icon?s.icon+" ":""}${escapeHtml(s.title)}</h2></div></div>` : "";
      return `
        <section class="section" data-section-id="${escapeHtml(s.id)}" style="${sectionStyle}">
          <div class="container">
            ${titleHtml}
            <div class="content-card">${s.html||""}</div>
          </div>
        </section>
      `;
    }).join("");
  }

  // ---------- TESTIMONIALS ----------
  function renderTestimonials(cfg){
    const wrap = document.getElementById("home-testi-grid");
    if(!wrap) return;
    const items = (cfg.testimonials?.items || []).filter(t=>t.status==="approved");
    const ts = cfg.testimonials?.style || {};
    const cardStyle = [ts.cardBg?`background:${ts.cardBg}`:"",ts.borderColor?`border-color:${ts.borderColor}`:"",ts.borderRadius?`border-radius:${ts.borderRadius}`:"",ts.padding?`padding:${ts.padding}`:""].filter(Boolean).join(";");
    wrap.innerHTML = items.map(t=>{
      const initials = (t.name||"?").trim().split(/\s+/).slice(0,2).map(x=>x[0]?.toUpperCase()||"").join("");
      return `
        <div class="testi-card" style="${cardStyle}">
          <div class="testi-stars">${"★".repeat(Math.max(1, Math.min(5, Number(t.rating||5))))}</div>
          <div class="testi-text" style="line-height:1.7">“${textToHtml(t.text||"")}”</div>
          <div class="testi-person">
            <div class="testi-avatar">${escapeHtml(initials)}</div>
            <div>
              <div class="testi-name">${escapeHtml(t.name||"Cliente")}</div>
              <div class="testi-city">${escapeHtml(t.city||"RD")}</div>
            </div>
          </div>
        </div>`;
    }).join("") || `<div class="empty-state" style="grid-column:1/-1"><h3>Sin opiniones</h3><p>Pronto publicaremos comentarios.</p></div>`;
  }

  function bindTestimonialForm(){
    const form = document.getElementById("testi-form");
    if(!form) return;
    form.addEventListener("submit", (e)=>{
      e.preventDefault();
      if(window.__cfg.testimonials?.allowPublicSubmit===false){
        toast("Las opiniones están desactivadas.", "warn");
        return;
      }
      const name = $("#testi-name")?.value.trim();
      const city = $("#testi-city")?.value.trim();
      const rating = Number($("#testi-rating")?.value || 5);
      const text = $("#testi-text")?.value.trim();
      if(!name || !city || !text){ toast("Completa los campos.", "warn"); return; }
      const item = { id:"t"+Date.now(), name, city, rating, text, status:"pending" };
      window.__cfg.testimonials.items.unshift(item);
      StorageAPI.save(window.__cfg);
      form.reset();
      toast("¡Gracias! Tu opinión quedó pendiente de aprobación.", "ok");
    });
  }

  // ---------- SHOP + FILTERS ----------
  function buildFilterOptions(cfg){
    const prods = cfg.products||[];
    const brands = Array.from(new Set(prods.map(p=>p.brand).filter(Boolean))).sort();
    const brandBox = $("#filter-brand");
    if(brandBox){
      brandBox.innerHTML = brands.map(b=>`
        <label class="fopt"><input type="checkbox" value="${escapeHtml(b)}"><span>${escapeHtml(b)}</span></label>
      `).join("") || `<div style="color:var(--light);font-size:.8rem">Sin marcas</div>`;
    }
  }

  function renderShopTabs(cfg){
    const tabs = $("#page-shop .tabs");
    if(!tabs) return;
    // style
    const sty = cfg.shopTabsStyle || {};
    tabs.dataset.variant = sty.variant || "pill";
    tabs.style.setProperty("--tabs-active-color", sty.activeColor || (cfg.theme?.primary||"#C9A96E"));
    const items = (cfg.shopTabs||[]).filter(t=>t.visible!==false);
    tabs.innerHTML = items.map((t,i)=>{
      const cls = ["tab", (i===0?"on":"") , (t.type==="sale"?"tab-sale":"")].filter(Boolean).join(" ");
      return `<button class="${cls}" type="button" data-tab-type="${t.type}" data-tab-value="${escapeHtml(t.value||"")}">${escapeHtml(t.label)}</button>`;
    }).join("");
    syncShopTabs(cfg);
  }

  function syncShopTabs(cfg){
    const st = window.__shopState || (window.__shopState={tab:{type:"all",value:""}});
    const {type,value} = st.tab || {type:"all",value:""};
    $$("#page-shop .tabs .tab").forEach(btn=>{
      const bt = btn.dataset.tabType;
      const bv = btn.dataset.tabValue || "";
      const on = (bt===type && (bt!=="gender" || bv===value));
      btn.classList.toggle("on", on);
    });
  }

  function renderShop(cfg){
    const prods = cfg.products || [];
    const grid = $("#shop-grid");
    const count = $("#shop-count");
    const q = ($("#shop-search")?.value || "").trim().toLowerCase();
    const onlySale = $("#filter-sale")?.checked;
    const genders = $$("#filter-gender input:checked").map(i=>i.value);
    const brands = $$("#filter-brand input:checked").map(i=>i.value);
    const min = Number($("#price-min")?.value || 0) || 0;
    const max = Number($("#price-max")?.value || 0) || 0;
    const sort = $("#shop-sort")?.value || "relevance";

    // tab filter
    const tab = (window.__shopState?.tab) || {type:"all",value:""};
    let tabGender = "";
    let tabSale = false;
    if(tab.type==="gender") tabGender = tab.value;
    if(tab.type==="sale") tabSale = true;

    let list = prods.slice();
    if(q) list = list.filter(p=>(p.name||"").toLowerCase().includes(q) || (p.brand||"").toLowerCase().includes(q));
    if(onlySale || tabSale) list = list.filter(p=>p.onSale);
    const activeGenders = genders.length ? genders : (tabGender ? [tabGender] : []);
    if(activeGenders.length) list = list.filter(p=>activeGenders.includes(p.gender));
    if(brands.length) list = list.filter(p=>brands.includes(p.brand));
    const effPrice=p=>(p.onSale&&p.salePrice&&p.salePrice<p.price?Number(p.salePrice):Number(p.price))||0;
    if(min) list = list.filter(p=>effPrice(p) >= min);
    if(max) list = list.filter(p=>effPrice(p) <= max);
    if(sort==="price_asc") list.sort((a,b)=>effPrice(a)-effPrice(b));
    if(sort==="price_desc") list.sort((a,b)=>effPrice(b)-effPrice(a));
    if(sort==="new") list.sort((a,b)=>(b.new===true)-(a.new===true));

    if(count) count.textContent = `${list.length} productos`;
    if(grid) grid.innerHTML = list.map(productCard).join("") || `
      <div class="empty-state" style="grid-column:1/-1">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <h3>Sin resultados</h3><p>Prueba otros filtros o términos.</p>
      </div>`;
  }

  function clearShopFilters(){
    const search = $("#shop-search"); if(search) search.value="";
    const sale = $("#filter-sale"); if(sale) sale.checked=false;
    $$("#filter-gender input, #filter-brand input").forEach(i=>i.checked=false);
    const min=$("#price-min"); if(min) min.value="";
    const max=$("#price-max"); if(max) max.value="";
    const sort=$("#shop-sort"); if(sort) sort.value="relevance";
    window.__shopState.tab = {type:"all",value:""};
    syncShopTabs(window.__cfg);
    renderShop(window.__cfg);
  }

  function bindShop(){
    const ids = ["shop-search","filter-sale","price-min","price-max","shop-sort"];
    ids.forEach(id=>{
      const el = document.getElementById(id);
      if(!el) return;
      el.addEventListener("input", ()=>renderShop(window.__cfg));
      el.addEventListener("change", ()=>renderShop(window.__cfg));
    });

    document.addEventListener("change", (e)=>{
      if(e.target.closest("#filter-gender") || e.target.closest("#filter-brand")) renderShop(window.__cfg);
    });

    // tabs
    document.addEventListener("click", (e)=>{
      const btn = e.target.closest("#page-shop .tabs .tab");
      if(!btn) return;
      const type = btn.dataset.tabType || "all";
      const value = btn.dataset.tabValue || "";
      window.__shopState.tab = {type, value};
      syncShopTabs(window.__cfg);
      renderShop(window.__cfg);
      // keep on shop page
      if(location.hash !== "#shop") location.hash="#shop";
    });

    // clear
    const clr = document.getElementById("shop-clear");
    if(clr){
      clr.addEventListener("click", (e)=>{ e.preventDefault(); clearShopFilters(); });
    }

    // ── Mobile filter panel open/close ─────────────────────
    function openFilterPanel(){
      const panel   = document.getElementById("filters-wrap");
      const overlay = document.getElementById("filter-overlay");
      if(panel)   panel.classList.add("mobile-open");
      if(overlay) overlay.classList.add("open");
      document.body.style.overflow = "hidden";
    }
    function closeFilterPanel(){
      const panel   = document.getElementById("filters-wrap");
      const overlay = document.getElementById("filter-overlay");
      if(panel)   panel.classList.remove("mobile-open");
      if(overlay) overlay.classList.remove("open");
      document.body.style.overflow = "";
    }

    const mfBtn = document.getElementById("mobile-filter-btn");
    if(mfBtn) mfBtn.addEventListener("click", (e)=>{ e.preventDefault(); openFilterPanel(); });

    const fcBtn = document.getElementById("filter-close-btn");
    if(fcBtn) fcBtn.addEventListener("click", (e)=>{ e.preventDefault(); closeFilterPanel(); });

    const faBtn = document.getElementById("filter-apply-btn-el");
    if(faBtn) faBtn.addEventListener("click", (e)=>{ e.preventDefault(); closeFilterPanel(); renderShop(window.__cfg); });

    const overlay = document.getElementById("filter-overlay");
    if(overlay) overlay.addEventListener("click", ()=>closeFilterPanel());
  }

  // ---------- PRODUCT MODAL ----------
  function findProduct(id){ return (window.__cfg.products||[]).find(p=>p.id===id); }

  // BUG FIX: Esta función faltaba y causaba crash al abrir modales de producto
  function renderProductModalHtml(p){
    if(!p) return "";
    const sale = p.onSale && p.salePrice && p.salePrice < p.price;
    const unit = sale ? Number(p.salePrice) : Number(p.price);
    const disc = sale ? Math.round((1-(p.salePrice/p.price))*100) : 0;
    const badges = [
      sale ? `<span class="badge badge-sale">-${disc}% Oferta</span>` : "",
      p.new ? `<span class="badge badge-new">Nuevo</span>` : "",
      p.featured ? `<span class="badge badge-top">⭐ Top</span>` : ""
    ].filter(Boolean).join(" ");
    return `
      <div class="pm-layout">
        <div class="pm-img-wrap">
          ${p.image
            ? `<img class="pm-img" src="${escapeAttr(p.image)}" alt="${escapeAttr(p.name)}" loading="lazy" onerror="this.style.display='none'">`
            : `<div class="pm-img-placeholder">🧴</div>`
          }
          ${badges ? `<div class="pm-badges">${badges}</div>` : ""}
        </div>
        <div class="pm-info">
          <div class="pm-brand">${escapeHtml(p.brand||"")}</div>
          <h2 class="pm-title">${escapeHtml(p.name||"")}</h2>
          <div class="pm-meta">
            ${p.gender ? `<span class="pm-tag">${escapeHtml(p.gender)}</span>` : ""}
            ${p.ml ? `<span class="pm-tag">${escapeHtml(String(p.ml))}ml</span>` : ""}
            ${p.size ? `<span class="pm-tag">${escapeHtml(p.size)}</span>` : ""}
          </div>
          <div class="pm-price-row">
            <span class="pm-price-now">${money(unit)}</span>
            ${sale ? `<span class="pm-price-was">${money(p.price)}</span>` : ""}
            ${sale ? `<span class="pm-disc-pill">-${disc}%</span>` : ""}
          </div>
          ${p.desc || p.description ? `<div class="pm-desc">${textToHtml(p.desc||p.description||"")}</div>` : ""}
          <div class="pm-actions">
            <button class="btn btn-outline-gold btn-lg pm-add" data-add="${escapeAttr(String(p.id))}" type="button">
              <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
              Agregar al carrito
            </button>
            <button class="btn btn-gold btn-lg" data-buy="${escapeAttr(String(p.id))}" type="button">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Comprar por WhatsApp
            </button>
          </div>
          <a class="pm-full-link" href="#product/${escapeAttr(String(p.id))}">Ver página completa →</a>
        </div>
      </div>`;
  }

  function openProduct(id){
    const pm = $("#product-modal");
    const body = $("#pm-body");
    if(!pm || !body) return;
    const p = findProduct(id);
    if(!p) return;
    body.innerHTML = renderProductModalHtml(p);
    showOverlay();
    pm.hidden = false;
    renderCart(window.__cfg); // keep totals up to date
  }

  function closeProduct(){
    const pm = $("#product-modal");
    if(pm) pm.hidden = true;
    hideOverlayIfNone();
  }

  // ---------- CART ----------
  function loadCart(){
    try{
      const raw = localStorage.getItem(CART_KEY);
      if(raw) return JSON.parse(raw);
    }catch(e){}
    return { items: [] }; // {id, qty}
  }
  function saveCart(cart){
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }

  function cartCount(cart){
    return (cart.items||[]).reduce((a,i)=>a+Number(i.qty||0),0);
  }

  function setBadge(n){
    const b = document.getElementById("cart-badge");
    const v = Number(n||0);
    if(!b) return;
    b.textContent = String(v);
    b.classList.toggle("is-zero", v<=0);
  }

  function addToCart(id, qty=1){
    const p = findProduct(id);
    if(!p){ toast("Producto no encontrado", "warn"); return; }
    const cart = loadCart();
    const item = cart.items.find(x=>x.id===id);
    if(item) item.qty += qty;
    else cart.items.push({id, qty});
    saveCart(cart);
    setBadge(cartCount(cart));
    toast("Agregado al carrito", "ok");
    renderCart(window.__cfg);
  }

  function removeFromCart(id){
    const cart = loadCart();
    cart.items = cart.items.filter(x=>x.id!==id);
    saveCart(cart);
    setBadge(cartCount(cart));
    renderCart(window.__cfg);
  }

  function setQty(id, qty){
    const cart = loadCart();
    const item = cart.items.find(x=>x.id===id);
    if(!item) return;
    item.qty = Math.max(1, qty);
    saveCart(cart);
    setBadge(cartCount(cart));
    renderCart(window.__cfg);
  }

  function clearCart(){
    saveCart({items:[]});
    setBadge(0);
    renderCart(window.__cfg);
  }

  function setCartStep(step){
    window.__cartStep = step || "items";
    const a = document.getElementById("cart-step-items");
    const b = document.getElementById("cart-step-checkout");
    if(!a || !b) return;
    if(window.__cartStep==="checkout"){
      a.hidden = true;
      b.hidden = false;
    }else{
      a.hidden = false;
      b.hidden = true;
    }
  }

  function renderCart(cfg){
    const cart = loadCart();
    const itemsHost = document.getElementById("cart-items-page");
    const lines = [];
    let subtotal = 0;

    (cart.items||[]).forEach(ci=>{
      const p = (cfg.products||[]).find(x=>x.id===ci.id);
      if(!p) return;
      const sale = p.onSale && p.salePrice && p.salePrice < p.price;
      const unit = sale ? Number(p.salePrice) : Number(p.price);
      const line = unit * Number(ci.qty||1);
      subtotal += line;
      lines.push({p, qty:ci.qty, unit, line});
    });

    if(itemsHost){
      itemsHost.innerHTML = lines.map(({p,qty,unit,line})=>`
        <div class="ci" data-id="${p.id}">
          <img src="${p.image||""}" alt="${escapeHtml(p.name)}" onerror="this.style.display='none'">
          <div>
            <div class="ci-name">${escapeHtml(p.name)}</div>
            <div class="ci-meta">${escapeHtml(p.brand||"")} · ${p.size?escapeHtml(p.size):""}</div>
            <div class="ci-row">
              <div class="qty">
                <button type="button" data-qty="-1" data-id="${p.id}">−</button>
                <span>${qty}</span>
                <button type="button" data-qty="1" data-id="${p.id}">+</button>
              </div>
              <div style="text-align:right">
                <div><strong>${money(line)}</strong></div>
                <div class="muted" style="font-size:.85rem">${money(unit)} c/u</div>
              </div>
            </div>
            <div class="ci-row">
              <span class="link-danger" data-remove="${p.id}">Eliminar</span>
            </div>
          </div>
        </div>
      `).join("") || `<div class="empty-state cart-empty"><div class="empty-icon">🛍️</div><h3>Tu carrito está vacío</h3><p>Explora nuestros perfumes y agrega tus favoritos</p><a class="btn btn-dark" href="#shop">Ver catálogo</a></div>`;
    }

    // Dynamic shipping cost: set by maps.js when customer picks address
    const _storedCfg = StorageAPI.load();
    const _delivMode = document.getElementById("co-delivery")?.value || "Domicilio";
    const shipping = (_delivMode === "Domicilio" && _storedCfg._shippingCost > 0)
      ? _storedCfg._shippingCost : 0;
    const subEl = document.getElementById("cart-subtotal");
    const shipEl = document.getElementById("cart-shipping");
    const totEl = document.getElementById("cart-total");
    if(subEl) subEl.textContent = money(subtotal);
    if(shipEl) shipEl.textContent = shipping===0 ? "GRATIS 🧑‍🚚" : money(shipping);
    if(totEl) totEl.textContent = money(subtotal+shipping);

    setBadge(cartCount(cart));

    // Checkout preview + WhatsApp
    const template = cfg.whatsapp?.template || "Hola! Quiero comprar: {items} Total: {total}";
    const itemsText = lines.map(l=>`• ${l.p.name} x${l.qty} = ${money(l.line)}`).join("\n");
    const vals = {
      items: itemsText || "(sin items)",
      subtotal: money(subtotal),
      envio: shipping===0 ? "GRATIS" : money(shipping),
      total: money(subtotal+shipping),
      nombre: (document.getElementById("co-name")?.value||"").trim(),
      telefono: (document.getElementById("co-phone")?.value||"").trim(),
      metodo_entrega: (document.getElementById("co-delivery")?.value||"").trim(),
      direccion_ciudad: (document.getElementById("co-address")?.value||"").trim(),
      notas: (document.getElementById("co-notes")?.value||"").trim()
    };
    const msg = template.replace(/\{(\w+)\}/g, (_,k)=>String(vals[k] ?? ""));
    const wa = document.getElementById("checkout-wa");
    if(wa) wa.href = waLink(cfg, msg);
    const preview = document.getElementById("wa-preview");
    if(preview) preview.textContent = msg;
  }

  function renderCheckout(cfg){
    // if cart empty, bounce back
    const cart = loadCart();
    if(!cart.items || cart.items.length===0){
      const host = document.getElementById("wa-preview");
      if(host) host.textContent = "Tu carrito está vacío. Ve a Tienda para agregar productos.";
    }
    renderCart(cfg);
  }

  function renderProductPage(cfg, id){
    const host = document.getElementById("product-page-host");
    const titleEl = document.getElementById("product-page-title");
    if(!host) return;
    const p = (cfg.products||[]).find(x=>String(x.id)===String(id));
    if(!p){
      host.innerHTML = `<div class="content-card"><h3>Producto no encontrado</h3><p class="muted">Vuelve a la tienda para seguir explorando.</p><a class="btn btn-outline" href="#shop">← Volver a Tienda</a></div>`;
      if(titleEl) titleEl.textContent = "Producto";
      return;
    }
    if(titleEl) titleEl.textContent = p.name || "Producto";
    const sale = p.onSale && p.salePrice && p.salePrice < p.price;
    const unit = sale ? Number(p.salePrice) : Number(p.price);
    host.innerHTML = `
      <div class="content-card">
        <div class="product-page">
          <div>
            <img src="${escapeAttr(p.image||"")}" alt="${escapeAttr(p.name||"")}" onerror="this.style.display='none'">
          </div>
          <div>
            <div class="product-meta">${escapeHtml(p.brand||"")} ${p.size?("· "+escapeHtml(p.size)):""}</div>
            <div class="product-price">${money(unit)} ${sale?`<span class="old">${money(p.price)}</span>`:""}</div>
            ${sale?`<div class="pill" style="display:inline-block;margin-top:10px">OFERTA</div>`:""}
            <div style="margin-top:14px;line-height:1.75">${textToHtml(p.desc||p.description||"")}</div>
            <div class="product-actions">
              <button class="btn btn-outline-gold" type="button" data-add="${p.id}">Agregar</button>
              <button class="btn btn-gold" type="button" data-buy="${p.id}">Comprar</button>
              <a class="btn btn-outline" href="#shop">← Volver</a>
            </div>
          </div>
        </div>
      </div>
    `;
  }


  
  function mountCartAsPage(){
    const host = document.getElementById("cart-page-host");
    const d = document.getElementById("cart-drawer");
    if(!host || !d) return;
    // move drawer into page host if not already
    if(d.parentElement !== host){
      host.innerHTML = "";
      host.appendChild(d);
    }
    d.hidden = false;
    d.classList.add("as-page");
    // hide overlay for page cart
    const o = document.getElementById("overlay");
    if(o){ o.classList.remove("show"); o.hidden = true; }
    renderCart(window.__cfg);
    // ensure items step by default
    window.__cartStep = "items";
    setCartStep("items");
  }

  function unmountCartFromPage(){
    const host = document.getElementById("cart-page-host");
    const d = document.getElementById("cart-drawer");
    if(!host || !d) return;
    if(d.parentElement === host){
      document.body.appendChild(d);
    }
    d.classList.remove("as-page");
    d.hidden = true;
  }
function openCart(){
    window.__cartStep = "items";
    showOverlay();
    const d = $("#cart-drawer");
    if(!d) return;
    d.hidden = false;
    requestAnimationFrame(()=>d.classList.add("open"));
    renderCart(window.__cfg);
  }
  function closeCart(){
    const d = $("#cart-drawer");
    if(d){
      d.classList.remove("open");
      setTimeout(()=>{ d.hidden = true; }, 260);
    }
    hideOverlayIfNone();
  }

  // Overlay
  function showOverlay(){
    const o = $("#overlay");
    if(!o) return;
    o.hidden = false;
    requestAnimationFrame(()=>o.classList.add("show"));
  }
  function hideOverlayIfNone(){
    const o = $("#overlay");
    const pm = $("#product-modal");
    const cd = $("#cart-drawer");
    const anyOpen = (pm && !pm.hidden) || (cd && !cd.hidden);
    if(!o || anyOpen) return;
    o.classList.remove("show");
    setTimeout(()=>{ o.hidden = true; }, 220);
  }

  function bindModalAndCart(){
    // close buttons
    $("#pm-close")?.addEventListener("click", closeProduct);
    $("#cart-close")?.addEventListener("click", ()=>{ closeCart(); if(location.hash==="#cart") history.replaceState(null,"","#shop"); });
    $("#overlay")?.addEventListener("click", ()=>{ closeProduct(); closeCart(); if(location.hash==="#cart") history.replaceState(null,"","#shop"); });

    // open cart from header
    $("#header-cart-btn")?.addEventListener("click", (e)=>{ e.preventDefault(); location.hash="#cart"; });

    // cart actions delegation
    document.addEventListener("click", (e)=>{
      const add = e.target.closest("[data-add]");
      if(add){
        e.preventDefault();
        const id = add.getAttribute("data-add");
        addToCart(id, 1);
        return;
      }
      const buy = e.target.closest("[data-buy]");
      if(buy){
        e.preventDefault();
        const id = buy.getAttribute("data-buy");
        const p = findProduct(id);
        if(!p) return;
        const price = (p.onSale && p.salePrice && p.salePrice<p.price) ? p.salePrice : p.price;
        const msg = `Hola! Quiero comprar: ${p.name} (${p.brand||""}) por ${money(price)}.`;
        window.open(waLink(window.__cfg, msg), "_blank", "noopener");
        return;
      }
      const ci = e.target.closest(".ci");
      if(ci && !e.target.closest("button") && !e.target.closest("[data-remove]")){
        const id = ci.getAttribute("data-id");
        if(id){ location.hash = "#product/"+id; }
        return;
      }
      const card = e.target.closest(".product-card");
      if(card && !e.target.closest("button")){
        const id = card.getAttribute("data-id");
        location.hash = "#product/"+id;
        return;
      }
      const remove = e.target.closest("[data-remove]");
      if(remove){
        removeFromCart(remove.getAttribute("data-remove"));
        return;
      }
      const qbtn = e.target.closest("[data-qty]");
      if(qbtn){
        const id = qbtn.getAttribute("data-id");
        const delta = Number(qbtn.getAttribute("data-qty"));
        const cart = loadCart();
        const it = cart.items.find(x=>x.id===id);
        if(!it) return;
        setQty(id, Number(it.qty||1)+delta);
        return;
      }
    });

    $("#cart-clear-page")?.addEventListener("click", (e)=>{ e.preventDefault(); clearCart(); });

    $("#cart-next")?.addEventListener("click", (e)=>{ e.preventDefault(); setCartStep("checkout"); });
    $("#cart-back")?.addEventListener("click", (e)=>{ e.preventDefault(); setCartStep("items"); });
    ["co-name","co-phone","co-delivery","co-address","co-notes"].forEach(id=>{
      document.getElementById(id)?.addEventListener("input", ()=>renderCart(window.__cfg));
      document.getElementById(id)?.addEventListener("change", ()=>renderCart(window.__cfg));
    });
    // Expose renderCart globally for maps.js to call after shipping update
    window.__renderCartLive = ()=>{ if(window.__cfg) renderCart(window.__cfg); };
    // Also listen for the shippingUpdated event dispatched by maps.js
    document.addEventListener("shippingUpdated", ()=>{ if(window.__cfg) renderCart(window.__cfg); });
  }

  // ---------- ABOUT ----------
  function renderAbout(cfg){
    const body = document.getElementById("about-body");
    if(!body) return;
    const page = cfg.pages?.about || {};

    // ── Header fields ──
    const titleEnabled    = page.titleEnabled !== false;
    const eyebrow         = page.eyebrow || "CONÓCENOS";
    const eyebrowColor    = page.eyebrowColor || "";
    const title1          = page.title1 || page.title || "Sobre";
    const title2          = page.title2 || "nosotros";
    const titleColor      = page.titleColor || "";
    const title2Color     = page.title2Color || "var(--gold)";
    const titleSize       = page.titleSize || "";
    const titleFont       = page.titleFont || "";
    const headerPadding   = page.headerPadding || "";
    const subtitle        = page.subtitle || "";
    const subtitleEnabled = page.subtitleEnabled !== false;
    const subtitleColor   = page.subtitleColor || "#666";
    const subtitleSize    = page.subtitleSize || "1rem";
    const subtitleFont    = page.subtitleFont || "";
    const subtitleAlign   = page.subtitleAlign || "left";

    const blocks = Array.isArray(page.blocks) ? page.blocks.filter(b=>b.visible!==false) : [];

    const html = blocks.length ? blocks.map(b=>{
      const type = b.type || "text";
      const blockEnabled = b.visible !== false;
      if(!blockEnabled) return "";
      const iconHtml = b.icon ? `<span style="font-size:1.8rem;margin-bottom:10px;display:block">${b.icon}</span>` : "";
      const t = b.title ? `<h3 style="margin:0 0 8px 0;color:${b.titleColor||"#1e1e1e"}">${escapeHtml(b.title)}</h3>` : "";
      const imgFrame = b.frame ? `border:2px solid ${b.frameColor||"#C9A96E"};border-radius:${b.frameRadius||"12px"}` : `border-radius:${b.frameRadius||"8px"}`;
      const blockPad = b.blockPadding ? `padding:${b.blockPadding}` : "";

      if(type==="imageText" && b.image){
        return `
          <div class="content-card" style="margin-bottom:14px;background:${b.cardBg||"#fff"};${blockPad}">
            <div class="abt-grid">
              <div class="abt-img"><img src="${escapeAttr(b.image)}" alt="${escapeAttr(b.title||"")}" style="${imgFrame};width:100%;object-fit:cover" onerror="this.style.display='none'"/></div>
              <div class="abt-txt">
                ${iconHtml}${t}
                <div style="color:${b.textColor||"#555"};font-family:${b.font||"inherit"};text-align:${b.align||"left"};font-size:${b.fontSize||"1rem"};line-height:1.7">
                  ${b.html ? b.html : textToHtml(b.text||"")}
                </div>
              </div>
            </div>
          </div>`;
      }
      if(type==="image" && b.image){
        return `
          <div class="content-card" style="margin-bottom:14px;background:${b.cardBg||"#fff"};text-align:${b.imgAlign||"center"};${blockPad}">
            ${iconHtml}${t}
            <img src="${escapeAttr(b.image)}" alt="${escapeAttr(b.title||"")}" style="${imgFrame};max-width:100%;height:auto" onerror="this.style.display='none'"/>
          </div>`;
      }
      return `
        <div class="content-card" style="margin-bottom:14px;background:${b.cardBg||"#fff"};${blockPad}">
          ${iconHtml}${t}
          <div style="color:${b.textColor||"#555"};font-family:${b.font||"inherit"};text-align:${b.align||"left"};font-size:${b.fontSize||"1rem"};line-height:1.7">
            ${b.html ? b.html : textToHtml(b.text||"")}
          </div>
        </div>`;
    }).join("") : (page.html || "<p>Contenido no configurado.</p>");

    // ── Actualizar encabezado estático (evita título duplicado) ──
    const eyebrowEl  = document.getElementById("about-eyebrow-el");
    const titleEl    = document.getElementById("about-title-el");
    const title2El   = document.getElementById("about-title2-el");
    const goldlineEl = document.getElementById("about-goldline-el");
    const subtitleEl = document.getElementById("about-subtitle-el");
    const pageHeader = document.getElementById("about-page-header");

    if(eyebrowEl){ eyebrowEl.textContent = eyebrow; eyebrowEl.setAttribute("style", eyebrowColor ? `color:${eyebrowColor}` : ""); }
    if(titleEl){
      const ts = [titleColor?`color:${titleColor}`:"", titleSize?`font-size:${titleSize}`:"", titleFont?`font-family:${titleFont}`:""].filter(Boolean).join(";");
      titleEl.setAttribute("style","margin-top:6px;"+(ts?ts:""));
      titleEl.style.display = titleEnabled ? "" : "none";
      // Update title1 text node (first child text before the <em>)
      const t1Node = Array.from(titleEl.childNodes).find(n=>n.nodeType===3);
      if(t1Node) t1Node.textContent = escapeHtml(title1)+" "; else titleEl.prepend(document.createTextNode(escapeHtml(title1)+" "));
    }
    if(title2El){ title2El.textContent = title2; title2El.style.color = title2Color || "var(--gold)"; }
    if(goldlineEl){ goldlineEl.style.display = titleEnabled ? "" : "none"; goldlineEl.style.background = (title2Color && title2Color!=="var(--gold)") ? title2Color : "var(--gold)"; }
    if(subtitleEl){
      const sShow = subtitleEnabled && !!subtitle;
      subtitleEl.style.display = sShow ? "" : "none";
      if(sShow){ subtitleEl.innerHTML = textToHtml(subtitle); subtitleEl.style.color = subtitleColor||"#666"; subtitleEl.style.fontSize = subtitleSize||"1rem"; subtitleEl.style.fontFamily = subtitleFont||"inherit"; subtitleEl.style.textAlign = subtitleAlign||"left"; }
    }
    if(pageHeader) pageHeader.style.paddingTop = headerPadding ? headerPadding.split(" ")[0] : "";

    body.innerHTML = `<div class="container">${html}</div>`;
  }

  // ---------- HAMBURGER ----------
  function bindHamburger(){
    const hb = $("#hamburger");
    const mn = $("#mobile-nav");
    if(!hb || !mn) return;
    hb.addEventListener("click", ()=>{
      hb.classList.toggle("open");
      mn.classList.toggle("open");
    });
  }

  
  function renderFeaturesStrip(cfg){
    const sec = document.getElementById("features-strip");
    const grid = document.getElementById("features-grid");
    if(!sec || !grid) return;
    const b = cfg.benefits?.band || {};
    const enabled = b.enabled !== false;
    const items = (Array.isArray(b.items) ? b.items : []).filter(x=>x && x.visible!==false);
    sec.hidden = !enabled || items.length===0;

    // styles
    const st = b.style || {};
    sec.style.background = st.bg || "";
    // expose as CSS vars for fine-grain control
    sec.style.setProperty("--band-icon", st.iconColor || "");
    sec.style.setProperty("--band-title", st.titleColor || "");
    sec.style.setProperty("--band-desc", st.descColor || "");
    sec.style.setProperty("--band-font", st.font || "");
    sec.style.setProperty("--band-title-size", st.sizeTitle || "");
    sec.style.setProperty("--band-desc-size", st.sizeDesc || "");
    grid.innerHTML = items.map(it=>`
      <div class="feature-item">
        <div class="feature-icon">${escapeHtml(it.icon||"✓")}</div>
        <div>
          <div class="feat-title">${escapeHtml(it.title||"")}</div>
          <div class="feat-desc">${escapeHtml(it.desc||"")}</div>
        </div>
      </div>
    `).join("");
  }

function init(){
    const cfg = StorageAPI.load();
    window.__cfg = cfg;
    window.__shopState = { tab: {type:"all", value:""} };

    applyTheme(cfg);
    renderAnnouncement(cfg);
    renderTicker(cfg);
    renderNav(cfg);
    window.renderNavItems = function(c){ renderNav(c||cfg); };
    applyHeaderLogo(cfg);
    renderWhatsAppButtons(cfg);
    renderBanner(cfg);
    renderFooter(cfg);
    renderFeaturesStrip(cfg);
    applyBenefitsPlacement(cfg);
    // v87: carousel handles home layout

    buildFilterOptions(cfg);
    renderShopTabs(cfg);

    renderHome(cfg);
    renderAbout(cfg);

    bindShop();
    bindHamburger();
    bindModalAndCart();
    bindTestimonialForm();

    // Cargar config desde almacenamiento remoto (si está habilitado)
    StorageAPI.loadRemote(remoteCfg => {
      if(!remoteCfg) return;
      window.__cfg = remoteCfg;
      applyTheme(remoteCfg);
      renderAnnouncement(remoteCfg);
      renderTicker(remoteCfg);
      renderNav(remoteCfg);
      applyHeaderLogo(remoteCfg);
      renderWhatsAppButtons(remoteCfg);
      renderBanner(remoteCfg);
      renderFooter(remoteCfg);
      renderFeaturesStrip(remoteCfg);
      applyBenefitsPlacement(remoteCfg);
      buildFilterOptions(remoteCfg);
      renderShopTabs(remoteCfg);
      renderHome(remoteCfg);
      renderAbout(remoteCfg);
      route();
    });

// Reaccionar a actualizaciones de config remota
window.addEventListener("siteconfig:updated", (ev)=>{
  const next = ev.detail;
  if(!next) return;
  window.__cfg = next;

  applyTheme(next);
  renderAnnouncement(next);
  renderTicker(next);
  renderNav(next);
  renderWhatsAppButtons(next);
  renderBanner(next);
  renderFooter(next);
  renderFeaturesStrip(next);
  applyBenefitsPlacement(next);

  buildFilterOptions(next);
  renderShopTabs(next);
  renderHome(next);
  renderAbout(next);
  // re-route to refresh current page
  route();
});

    // ── Dark mode init ─────────────────────────────────────
    (function initDarkMode(){
      const saved = localStorage.getItem("onne_darkmode");
      if(saved === "1") document.body.classList.add("dark");
      const toggle = document.getElementById("darkmode-toggle");
      const sunIcon = document.getElementById("dm-icon-sun");
      const moonIcon = document.getElementById("dm-icon-moon");
      function syncIcons(){
        const isDark = document.body.classList.contains("dark");
        if(sunIcon) sunIcon.style.display = isDark ? "" : "none";
        if(moonIcon) moonIcon.style.display = isDark ? "none" : "";
      }
      syncIcons();
      if(toggle){
        toggle.addEventListener("click", ()=>{
          document.body.classList.toggle("dark");
          localStorage.setItem("onne_darkmode", document.body.classList.contains("dark") ? "1" : "0");
          syncIcons();
        });
      }
    })();

    // initial badge
    setBadge(cartCount(loadCart()));

    window.addEventListener("hashchange", route);
    route();

    hideLoader();
  }

  document.addEventListener("DOMContentLoaded", init);
})();

/* ╔══════════════════════════════════════════════════════════
 * ║  maps.js
 * ╚══════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════════════════════════
   ONNE STORE — Maps & Shipping System
   Leaflet.js based — no API key needed
══════════════════════════════════════════════════════════════ */
(function(){
  'use strict';

  // ── Default store location (Santo Domingo center as fallback)
  var DEFAULT_STORE = { lat: 18.4861, lng: -69.9312 };

  // ── Load shipping config from StorageAPI
  function getShipCfg() {
    var cfg = (typeof StorageAPI !== 'undefined') ? StorageAPI.load() : {};
    return cfg.shipping || {};
  }
  function getStoreLoc() {
    var cfg = (typeof StorageAPI !== 'undefined') ? StorageAPI.load() : {};
    return cfg.storeLocation || DEFAULT_STORE;
  }

  // ── Haversine distance in km
  function distKm(lat1, lng1, lat2, lng2) {
    var R = 6371;
    var dLat = (lat2-lat1)*Math.PI/180;
    var dLng = (lng2-lng1)*Math.PI/180;
    var a = Math.sin(dLat/2)*Math.sin(dLat/2) +
            Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*
            Math.sin(dLng/2)*Math.sin(dLng/2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  }

  // ── Calculate shipping cost
  function calcShipping(distanceKm, orderTotal) {
    var sc = getShipCfg();
    var base   = parseFloat(sc.base)    || 150;
    var perKm  = parseFloat(sc.perKm)   || 25;
    var freeAt = parseFloat(sc.freeMin) || 0;
    var maxKm  = parseFloat(sc.maxKm)   || 50;
    var eta    = sc.eta || '45–90 minutos';

    if (maxKm > 0 && distanceKm > maxKm) {
      return { cost: -1, label: '⚠️ Fuera de nuestra zona de entrega (' + maxKm + ' km máx)', eta: '' };
    }
    if (freeAt > 0 && orderTotal >= freeAt) {
      return { cost: 0, label: '✅ Envío GRATIS — pedido mayor a RD$' + freeAt.toLocaleString(), eta: '⏱️ ' + eta };
    }
    var cost = base + Math.round(distanceKm * perKm);
    return {
      cost: cost,
      label: '🚗 Envío: RD$' + cost.toLocaleString() + ' · ' + distanceKm.toFixed(1) + ' km',
      eta: '⏱️ ' + eta
    };
  }

  // ── Reverse geocode using Nominatim (free, no key)
  function reverseGeocode(lat, lng, callback) {
    var url = 'https://nominatim.openstreetmap.org/reverse?format=json&lat=' + lat + '&lon=' + lng + '&accept-language=es';
    fetch(url, { headers: { 'Accept-Language': 'es' } })
      .then(function(r){ return r.json(); })
      .then(function(d){
        var addr = d.display_name || (lat.toFixed(5) + ', ' + lng.toFixed(5));
        // Build short address
        var a = d.address || {};
        var short = [a.road, a.suburb || a.neighbourhood, a.city || a.town || a.village, a.state_district]
          .filter(Boolean).join(', ');
        callback(short || addr);
      })
      .catch(function(){ callback(lat.toFixed(5) + ', ' + lng.toFixed(5)); });
  }

  // ── Check if currently in delivery hours
  function isDeliveryHour() {
    var sc = getShipCfg();
    if (!sc.hourStart || !sc.hourEnd) return { ok: true, msg: '' };
    var now  = new Date();
    var cur  = now.getHours() * 60 + now.getMinutes();
    var start= sc.hourStart.split(':').map(Number); start = start[0]*60+(start[1]||0);
    var end  = sc.hourEnd.split(':').map(Number);   end   = end[0]*60+(end[1]||0);
    var ok   = cur >= start && cur <= end;
    var msg  = ok ? '' : (sc.offMsg || ('Envíos disponibles ' + sc.hourStart + '–' + sc.hourEnd));
    return { ok: ok, msg: msg };
  }

  // ════════════════════════════════════════════════════════════
  //  ADMIN MAP — store location picker
  // ════════════════════════════════════════════════════════════
  var adminMap = null, adminMarker = null;

  window.initAdminStoreMap = function() {
    if (adminMap) { adminMap.invalidateSize(); return; }
    var loc = getStoreLoc();
    adminMap = L.map('admin-store-map').setView([loc.lat, loc.lng], 14);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap', maxZoom: 19
    }).addTo(adminMap);

    // Custom icon
    var icon = L.divIcon({ className:'', html:'<div style="font-size:28px;transform:translateY(-14px)">📍</div>', iconSize:[30,30], iconAnchor:[15,28] });
    adminMarker = L.marker([loc.lat, loc.lng], { draggable: true, icon: icon }).addTo(adminMap);

    function updateCoords(latlng) {
      var lat = latlng.lat.toFixed(6), lng = latlng.lng.toFixed(6);
      var latEl = document.getElementById('loc-lat');
      var lngEl = document.getElementById('loc-lng');
      if (latEl) latEl.value = lat;
      if (lngEl) lngEl.value = lng;
      // Also update address field via reverse geocode
      reverseGeocode(latlng.lat, latlng.lng, function(addr){
        var addrEl = document.getElementById('loc-address');
        if (addrEl && !addrEl.dataset.manual) addrEl.value = addr;
      });
    }

    adminMap.on('click', function(e){ adminMarker.setLatLng(e.latlng); updateCoords(e.latlng); });
    adminMarker.on('dragend', function(){ updateCoords(adminMarker.getLatLng()); });

    // Sync lat/lng inputs → move marker
    ['loc-lat','loc-lng'].forEach(function(id){
      var el = document.getElementById(id);
      if (el) el.addEventListener('change', function(){
        var lat = parseFloat(document.getElementById('loc-lat').value);
        var lng = parseFloat(document.getElementById('loc-lng').value);
        if (!isNaN(lat) && !isNaN(lng)) {
          adminMarker.setLatLng([lat, lng]);
          adminMap.setView([lat, lng], 14);
        }
      });
    });

    // Manual address field flag
    var addrEl = document.getElementById('loc-address');
    if (addrEl) { addrEl.addEventListener('input', function(){ addrEl.dataset.manual = '1'; }); }
  };

  // ════════════════════════════════════════════════════════════
  //  CHECKOUT MAP — customer delivery location picker
  // ════════════════════════════════════════════════════════════
  var checkoutMap = null, checkoutMarker = null, storeMarker = null;

  window.initCheckoutMap = function() {
    var mapEl = document.getElementById('checkout-map');
    if (!mapEl) return;
    if (checkoutMap) { checkoutMap.invalidateSize(); return; }

    var store = getStoreLoc();
    checkoutMap = L.map('checkout-map').setView([store.lat, store.lng], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap', maxZoom: 19
    }).addTo(checkoutMap);

    // Store marker
    var storeIcon = L.divIcon({ className:'', html:'<div style="font-size:24px;transform:translateY(-12px)">🏪</div>', iconSize:[28,28], iconAnchor:[14,26] });
    storeMarker = L.marker([store.lat, store.lng], { icon: storeIcon })
      .addTo(checkoutMap)
      .bindPopup('Tu tienda');

    // Customer marker (starts hidden)
    var custIcon = L.divIcon({ className:'', html:'<div style="font-size:28px;transform:translateY(-14px)">📍</div>', iconSize:[30,30], iconAnchor:[15,28] });

    checkoutMap.on('click', function(e){
      // Lock scroll position before any DOM changes
      var _sx = window.scrollX || window.pageXOffset;
      var _sy = window.scrollY || window.pageYOffset;
      if(e.originalEvent) {
        e.originalEvent.preventDefault();
        e.originalEvent.stopPropagation();
      }
      if (!checkoutMarker) {
        checkoutMarker = L.marker(e.latlng, { draggable: true, icon: custIcon }).addTo(checkoutMap);
        checkoutMarker.on('dragend', function(){
          var sx = window.scrollX||window.pageXOffset, sy = window.scrollY||window.pageYOffset;
          onCustomerLocation(checkoutMarker.getLatLng());
          window.scrollTo(sx, sy);
        });
      } else {
        checkoutMarker.setLatLng(e.latlng);
      }
      onCustomerLocation(e.latlng);
      // Restore scroll after event propagation completes
      window.scrollTo(_sx, _sy);
      setTimeout(function(){ window.scrollTo(_sx, _sy); }, 0);
      setTimeout(function(){ window.scrollTo(_sx, _sy); }, 100);
    });

    // Sync address input → try to geocode
    var addrEl = document.getElementById('co-address');
    if (addrEl) {
      addrEl.addEventListener('keypress', function(e){
        if (e.key === 'Enter') geocodeAddress(addrEl.value);
      });
    }

    // Try to use browser geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(pos){
        var ll = L.latLng(pos.coords.latitude, pos.coords.longitude);
        checkoutMap.setView(ll, 15);
      }, function(){}, { timeout: 5000 });
    }
  };

  function onCustomerLocation(latlng) {
    // Capture scroll position at the start - before any async ops
    var _savedScrollY = window.scrollY || window.pageYOffset;
    var _savedScrollX = window.scrollX || window.pageXOffset;
    function restoreScroll() { window.scrollTo(_savedScrollX, _savedScrollY); }

    var store    = getStoreLoc();
    var dist     = distKm(store.lat, store.lng, latlng.lat, latlng.lng);
    var cart     = getCartTotal();
    var shipping = calcShipping(dist, cart);
    var hours    = isDeliveryHour();

    // Update address field — without allowing focus to steal scroll
    reverseGeocode(latlng.lat, latlng.lng, function(addr){
      var addrEl = document.getElementById('co-address');
      if (addrEl){
        // Temporarily remove from tab order to prevent focus scroll
        var prevTabIndex = addrEl.getAttribute('tabindex');
        addrEl.setAttribute('tabindex', '-1');
        addrEl.value = addr;
        // Restore tabindex
        if (prevTabIndex !== null) addrEl.setAttribute('tabindex', prevTabIndex);
        else addrEl.removeAttribute('tabindex');
      }
      restoreScroll();
      setTimeout(restoreScroll, 0);
      setTimeout(restoreScroll, 50);
    });

    // Show shipping info
    var infoEl = document.getElementById('co-shipping-info');
    var labelEl = document.getElementById('co-shipping-label');
    if (infoEl && labelEl) {
      infoEl.style.display = 'block';
      var lines = [shipping.label];
      if (shipping.eta) lines.push(shipping.eta);
      if (!hours.ok) lines.push('⏰ ' + hours.msg);
      labelEl.innerHTML = lines.join('<br>');
      // Update shipping cost in storage for WhatsApp message
      if (typeof StorageAPI !== 'undefined') {
        var cfg = StorageAPI.load();
        cfg._shippingCost = shipping.cost > 0 ? shipping.cost : 0;
        cfg._shippingAddr = document.getElementById('co-address')?.value || '';
        StorageAPI.save(cfg);
      }
      // Re-render cart totals in real-time after shipping cost is set
      if (window.__cfg && typeof window.__renderCartLive === 'function') {
        window.__renderCartLive();
      } else {
        // Fallback: manually update the cart shipping/total display elements
        var shipEl = document.getElementById('cart-shipping');
        var totEl  = document.getElementById('cart-total');
        var subEl  = document.getElementById('cart-subtotal');
        if (shipEl) {
          var cost = shipping.cost > 0 ? shipping.cost : 0;
          shipEl.textContent = cost === 0 ? 'GRATIS 🧑‍🚚' : 'RD$' + cost.toLocaleString('es-DO');
          // Update total
          if (totEl && subEl) {
            var sub = parseFloat(subEl.textContent.replace(/[^0-9.]/g,'')) || 0;
            totEl.textContent = 'RD$' + (sub + cost).toLocaleString('es-DO');
          }
        }
        // Also update WhatsApp preview
        if (window.__cfg) {
          var delivMode = document.getElementById('co-delivery') ? document.getElementById('co-delivery').value : 'Domicilio';
          if (delivMode === 'Domicilio') {
            document.dispatchEvent(new CustomEvent('shippingUpdated', { detail: { cost: shipping.cost > 0 ? shipping.cost : 0 } }));
          }
        }
      }
    }

    // Draw distance line
    if (window._shipLine) checkoutMap.removeLayer(window._shipLine);
    window._shipLine = L.polyline([[store.lat, store.lng],[latlng.lat, latlng.lng]], {
      color:'#C9A96E', weight:2, dashArray:'6,6', opacity:.7
    }).addTo(checkoutMap);
  }

  function getCartTotal() {
    try {
      var cfg = (typeof StorageAPI !== 'undefined') ? StorageAPI.load() : {};
      var cart = cfg.cart || [];
      return cart.reduce(function(s, item){
        return s + (parseFloat(item.price || 0) * (item.qty || 1));
      }, 0);
    } catch(e){ return 0; }
  }

  function geocodeAddress(query) {
    if (!query) return;
    var url = 'https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(query) + '&limit=1&accept-language=es';
    fetch(url)
      .then(function(r){ return r.json(); })
      .then(function(d){
        if (d && d[0]) {
          var ll = L.latLng(parseFloat(d[0].lat), parseFloat(d[0].lon));
          checkoutMap.setView(ll, 15);
          if (!checkoutMarker) {
            var icon = L.divIcon({ className:'', html:'<div style="font-size:28px;transform:translateY(-14px)">📍</div>', iconSize:[30,30], iconAnchor:[15,28] });
            checkoutMarker = L.marker(ll, { draggable: true, icon: icon }).addTo(checkoutMap);
            checkoutMarker.on('dragend', function(){ onCustomerLocation(checkoutMarker.getLatLng()); });
          } else {
            checkoutMarker.setLatLng(ll);
          }
          onCustomerLocation(ll);
        }
      }).catch(function(){});
  }

  // ════════════════════════════════════════════════════════════
  //  ADMIN JS — save location & shipping config
  // ════════════════════════════════════════════════════════════
  function initAdminLocationBindings() {
    var saveBtn = document.getElementById('loc-save');
    if (!saveBtn) return;
    saveBtn.addEventListener('click', function(){
      var cfg = (typeof StorageAPI !== 'undefined') ? StorageAPI.load() : {};
      cfg.storeLocation = {
        lat:  parseFloat(document.getElementById('loc-lat')?.value)  || DEFAULT_STORE.lat,
        lng:  parseFloat(document.getElementById('loc-lng')?.value)  || DEFAULT_STORE.lng,
        name: document.getElementById('loc-name')?.value    || '',
        address: document.getElementById('loc-address')?.value || ''
      };
      cfg.shipping = {
        base:      document.getElementById('ship-base')?.value       || '150',
        perKm:     document.getElementById('ship-per-km')?.value     || '25',
        freeMin:   document.getElementById('ship-free-min')?.value   || '0',
        express:   document.getElementById('ship-express')?.value    || '200',
        hourStart: document.getElementById('ship-hour-start')?.value || '09:00',
        hourEnd:   document.getElementById('ship-hour-end')?.value   || '19:00',
        offMsg:    document.getElementById('ship-off-msg')?.value    || '',
        eta:       document.getElementById('ship-eta')?.value        || '45–90 minutos',
        maxKm:     document.getElementById('ship-max-km')?.value     || '30'
      };
      if (typeof StorageAPI !== 'undefined') StorageAPI.save(cfg);
      if (typeof toast !== 'undefined') toast('Ubicación y envío guardados', 'ok');
      else alert('Guardado correctamente');
    });

    // Load saved values
    var cfg = (typeof StorageAPI !== 'undefined') ? StorageAPI.load() : {};
    var loc = cfg.storeLocation || {};
    var sc  = cfg.shipping || {};
    var sv  = function(id, val){ var el=document.getElementById(id); if(el && val) el.value=val; };
    sv('loc-lat',         loc.lat     || DEFAULT_STORE.lat);
    sv('loc-lng',         loc.lng     || DEFAULT_STORE.lng);
    sv('loc-name',        loc.name    || '');
    sv('loc-address',     loc.address || '');
    sv('ship-base',       sc.base     || '150');
    sv('ship-per-km',     sc.perKm    || '25');
    sv('ship-free-min',   sc.freeMin  || '0');
    sv('ship-express',    sc.express  || '200');
    sv('ship-hour-start', sc.hourStart|| '09:00');
    sv('ship-hour-end',   sc.hourEnd  || '19:00');
    sv('ship-off-msg',    sc.offMsg   || '');
    sv('ship-eta',        sc.eta      || '45–90 minutos');
    sv('ship-max-km',     sc.maxKm    || '30');
  }

  // ── Init checkout map when page becomes visible
  function observeCheckoutPage() {
    var deliveryEl = document.getElementById('co-delivery');
    if (deliveryEl) {
      deliveryEl.addEventListener('change', function(){
        var section = document.getElementById('co-delivery-section');
        if (section) {
          section.style.display = (this.value === 'Domicilio') ? 'block' : 'none';
          if (this.value === 'Domicilio') {
            setTimeout(initCheckoutMap, 100);
          }
        }
      });
      // Show map initially if Domicilio is selected
      if (deliveryEl.value === 'Domicilio') {
        setTimeout(initCheckoutMap, 300);
      } else {
        var section = document.getElementById('co-delivery-section');
        if (section) section.style.display = 'none';
      }
    }

    // Also init when checkout page is shown via hash
    window.addEventListener('hashchange', function(){
      if (location.hash === '#checkout') {
        setTimeout(function(){
          initCheckoutMap();
        }, 300);
      }
    });
  }

  // ── Admin: init map when location view is activated
  function observeAdminLocationView() {
    var observer = new MutationObserver(function(){
      var el = document.getElementById('admin-store-map');
      if (el && el.offsetParent !== null && !adminMap) {
        initAdminStoreMap();
      }
    });
    observer.observe(document.body, { subtree: true, attributes: true, attributeFilter: ['style'] });
  }

  // ── Boot
  document.addEventListener('DOMContentLoaded', function(){
    // Admin
    if (document.getElementById('loc-save')) {
      initAdminLocationBindings();
      observeAdminLocationView();
    }
    // Store (checkout)
    if (document.getElementById('checkout-map')) {
      observeCheckoutPage();
    }
  });

  // Expose globally for inline calls
  window.MapsShipping = { initCheckoutMap: initCheckoutMap, initAdminStoreMap: initAdminStoreMap, calcShipping: calcShipping };

})();

/* ╔══════════════════════════════════════════════════════════
 * ║  store-enhancements.js
 * ╚══════════════════════════════════════════════════════════ */

/*!
 * ONNE STORE RD — store-enhancements.js
 * Consolidado de: v78-fixes.js + v79-fixes.js + v86-core.js + v87-core.js + v88-core.js
 * ═══════════════════════════════════════════════════════════════════════════════════════
 */

/* ═══ v78-fixes.js ═══════════════════════════════════════════════════════════════════ */
/*
 * ONNE STORE RD — v78 Mejoras Completas
 * ═══════════════════════════════════════════════════════════════
 *  1.  downloadFacturaPDF  — genera PDF real desde factura
 *  2.  Botón PDF en modal de factura (además de Imprimir)
 *  3.  Popup post-venta mejorado (bind robusto, re-enlaza siempre)
 *  4.  Impresión con tamaño desde historial de ventas
 *  5.  Dashboard Admin — gráficos Shopify-style (ventas diarias,
 *      top productos, ticket promedio) con Canvas puro
 *  6.  Fix productos-por-fila: sólo HOME, no afecta tienda/catálogo
 *  7.  Cuadre del día — imprimir / PDF desde el cuadre
 *  8.  Control de caja mejorado (diferencias en color)
 *  9.  KPI cards de ventas en dashboard admin
 * 10.  Correcciones menores de UX (toast, foco, accesibilidad)
 * ═══════════════════════════════════════════════════════════════
 */
(function () {
  'use strict';

  /* ── Helpers ────────────────────────────────────────────── */
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  function getCfg() { return window.StorageAPI ? window.StorageAPI.load() : {}; }
  function saveCfg(c) { if (window.StorageAPI) window.StorageAPI.save(c); }
  function esc(s) {
    return (s || '').replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }
  function fmt(n) { return 'RD$' + Number(n || 0).toLocaleString('es-DO', { minimumFractionDigits: 0 }); }
  function fmt2(n) { return 'RD$' + Number(n || 0).toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function fmtDate(d) {
    if (!d) return '—';
    const iso = typeof d === 'number' ? new Date(d).toISOString().slice(0, 10) : String(d).slice(0, 10);
    return new Date(iso + 'T12:00:00').toLocaleDateString('es-DO', { day: '2-digit', month: 'short', year: 'numeric' });
  }
  function fmtTime(iso) {
    if (!iso) return '—';
    try { return new Date(iso).toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit' }); } catch { return '—'; }
  }
  function today() { return new Date().toISOString().slice(0, 10); }
  function uid() { return '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  function toast(msg, type) { if (window.toast) window.toast(msg, type || 'info'); }
  function getSession() {
    try { return JSON.parse(localStorage.getItem('adminSession') || '{}'); } catch { return {}; }
  }
  function getCurrentUser() { return getSession().user || { rol: 'admin', nombre: 'Administrador' }; }
  function isVendedor() { return getCurrentUser().rol === 'vendedor'; }
  function isAdmin() { const r = getCurrentUser().rol; return r === 'admin' || r === 'manager'; }

  /* ════════════════════════════════════════════════════════════
     1. GENERADOR DE PDF — usa ventana de impresión con @media print
        El navegador moderno ofrece "Guardar como PDF" en el diálogo
        de impresión. Para forzar descarga directa usamos data-URI.
  ════════════════════════════════════════════════════════════ */

  function buildInvoiceHTML(sale, empresa, opts) {
    opts = opts || {};
    const fontSize = opts.fontSize || '12px';
    const maxWidth = opts.maxWidth || '680px';
    const isTicket = opts.ticket || false;

    const rows = sale.items && sale.items.length
      ? sale.items.map(it => `
          <tr>
            <td style="padding:8px 10px">${esc(it.name || it.productName || '—')}</td>
            <td style="padding:8px 10px;text-align:center">${it.qty || it.quantity || 1}</td>
            <td style="padding:8px 10px;text-align:right">${fmt2(it.price || it.appliedPrice || 0)}</td>
            <td style="padding:8px 10px;text-align:right;font-weight:700">${fmt2((it.price || it.appliedPrice || 0) * (it.qty || it.quantity || 1))}</td>
          </tr>`).join('')
      : `<tr>
          <td style="padding:8px 10px">${esc(sale.productName || '—')}</td>
          <td style="padding:8px 10px;text-align:center">${sale.quantity || 1}</td>
          <td style="padding:8px 10px;text-align:right">${fmt2(sale.appliedPrice || 0)}</td>
          <td style="padding:8px 10px;text-align:right;font-weight:700">${fmt2((sale.appliedPrice || 0) * (sale.quantity || 1))}</td>
        </tr>`;

    const subtotal = sale.subtotal || sale.total || 0;
    const itbis = sale.itbis || 0;
    const total = sale.total || 0;

    return `
<div class="factura-doc">
  <div class="factura-header">
    <div class="factura-empresa">
      <div class="factura-empresa-name">${esc(empresa.nombre || 'ONNE STORE RD')}</div>
      ${empresa.rnc ? `<div class="factura-empresa-detail">RNC: ${esc(empresa.rnc)}</div>` : ''}
      ${empresa.direccion ? `<div class="factura-empresa-detail">${esc(empresa.direccion)}</div>` : ''}
      ${empresa.telefono ? `<div class="factura-empresa-detail">Tel: ${esc(empresa.telefono)}</div>` : ''}
      ${empresa.email ? `<div class="factura-empresa-detail">${esc(empresa.email)}</div>` : ''}
    </div>
    <div class="factura-meta">
      <div class="factura-numero">${esc(sale.numeroFactura || 'FAC-????')}</div>
      <div class="factura-txn">TXN: ${esc(sale.numeroTransaccion || '—')}</div>
      <div class="factura-fecha">Fecha: ${esc(fmtDate(sale.date))}</div>
      <div class="factura-metodo">Pago: <strong>${esc((sale.metodoPago || 'efectivo').toUpperCase())}</strong></div>
      ${sale.vendedorNombre ? `<div class="factura-metodo">Vendedor: ${esc(sale.vendedorNombre)}</div>` : ''}
    </div>
  </div>
  <div class="factura-cliente-box">
    <div class="factura-section-label">CLIENTE</div>
    <div class="factura-cliente-name">${esc(sale.customerName || 'Cliente General')}</div>
    ${sale.customerPhone ? `<div class="factura-cliente-detail">📱 ${esc(sale.customerPhone)}</div>` : ''}
    ${sale.customerEmail ? `<div class="factura-cliente-detail">✉️ ${esc(sale.customerEmail)}</div>` : ''}
  </div>
  <table class="factura-table">
    <thead>
      <tr>
        <th style="text-align:left;padding:9px 10px">Descripción</th>
        <th style="text-align:center;padding:9px 10px">Cant.</th>
        <th style="text-align:right;padding:9px 10px">P.Unit.</th>
        <th style="text-align:right;padding:9px 10px">Subtotal</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
  <div class="factura-totals">
    <div class="factura-total-row"><span>Subtotal</span><span>${fmt2(subtotal)}</span></div>
    ${itbis > 0 ? `<div class="factura-total-row"><span>ITBIS (18%)</span><span>${fmt2(itbis)}</span></div>` : ''}
    <div class="factura-total-row factura-grand-total"><span>TOTAL</span><span>${fmt2(total)}</span></div>
  </div>
  ${sale.notes ? `<div class="factura-notas"><strong>Notas:</strong> ${esc(sale.notes)}</div>` : ''}
  <div class="factura-footer">
    Gracias por su compra · ${esc(empresa.nombre || 'ONNE STORE RD')}${empresa.email ? ' · ' + esc(empresa.email) : ''}
  </div>
</div>`;
  }

  function facturaStyles(opts) {
    opts = opts || {};
    const w = opts.maxWidth || '680px';
    const fs = opts.fontSize || '12px';
    const ticket = opts.ticket || false;
    return `
      * { margin:0; padding:0; box-sizing:border-box; }
      body { font-family:'Helvetica Neue',Arial,sans-serif; background:#fff; color:#111;
             padding:${ticket ? '8px' : '24px'}; max-width:${w}; margin:0 auto; font-size:${fs}; }
      .factura-header { display:flex; justify-content:space-between; align-items:flex-start;
                        margin-bottom:22px; padding-bottom:16px; border-bottom:2px solid #C9A96E; }
      .factura-empresa-name { font-size:1.35em; font-weight:800; color:#111; letter-spacing:-.02em; }
      .factura-empresa-detail { font-size:.82em; color:#555; margin-top:3px; }
      .factura-meta { text-align:right; }
      .factura-numero { font-size:1.08em; font-weight:800; color:#C9A96E; }
      .factura-txn,.factura-fecha,.factura-metodo { font-size:.8em; color:#555; margin-top:3px; }
      .factura-cliente-box { background:#f8f8f8; border-radius:8px; padding:12px 16px; margin-bottom:18px; }
      .factura-section-label { font-size:.64em; font-weight:700; letter-spacing:.14em;
                               text-transform:uppercase; color:#999; margin-bottom:5px; }
      .factura-cliente-name { font-size:.97em; font-weight:700; }
      .factura-cliente-detail { font-size:.81em; color:#555; margin-top:2px; }
      .factura-table { width:100%; border-collapse:collapse; margin-bottom:14px; }
      .factura-table thead tr { background:#1C1C1E; color:#fff; }
      .factura-table th { padding:9px 10px; font-size:.8em; font-weight:600; }
      .factura-table tbody tr:nth-child(even) { background:#f9f9f9; }
      .factura-table td { padding:8px 10px; font-size:.87em; border-bottom:1px solid #eee; }
      .factura-totals { margin-left:auto; width:${ticket ? '100%' : '260px'}; }
      .factura-total-row { display:flex; justify-content:space-between; padding:5px 0;
                           font-size:.88em; border-bottom:1px solid #eee; }
      .factura-grand-total { font-size:1.12em; font-weight:800; color:#111;
                             border-bottom:2px solid #C9A96E; padding-top:8px; margin-top:3px; }
      .factura-notas { margin-top:18px; font-size:.81em; color:#666; padding:10px 14px;
                       background:#fffde7; border-radius:6px; }
      .factura-footer { margin-top:24px; text-align:center; font-size:.77em; color:#aaa;
                        padding-top:14px; border-top:1px solid #eee; }
      @media print { body { padding:0; } }
    `;
  }

  /**
   * downloadFacturaPDF — abre ventana de impresión optimizada para "Guardar como PDF"
   * Si el navegador soporta window.print(), el usuario puede elegir destino PDF.
   */
  window.downloadFacturaPDF = function (saleId, paperSize) {
    const cfg = getCfg();
    const sale = (cfg.sales || []).find(s => s.id === saleId);
    if (!sale) { toast('Venta no encontrada', 'err'); return; }
    const empresa = cfg.empresa || {};

    const sizeMap = {
      ticket: { maxWidth: '302px', fontSize: '10px', ticket: true },
      a5: { maxWidth: '559px', fontSize: '11px' },
      a4: { maxWidth: '793px', fontSize: '12px' },
      media: { maxWidth: '793px', fontSize: '11px' }
    };
    const opts = sizeMap[paperSize] || sizeMap.a4;
    const html = buildInvoiceHTML(sale, empresa, opts);
    const styles = facturaStyles(opts);

    const w = window.open('', '_blank', `width=${parseInt(opts.maxWidth) + 60},height=750`);
    if (!w) { toast('Permite ventanas emergentes para imprimir/PDF', 'err'); return; }
    w.document.write(`<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>${esc(sale.numeroFactura || 'Factura')}</title>
  <style>${styles}</style>
</head>
<body>${html}</body>
</html>`);
    w.document.close();
    w.focus();
    // Small delay for styles to apply, then trigger print (→ PDF dialog)
    setTimeout(() => { w.print(); }, 380);
  };

  /* ════════════════════════════════════════════════════════════
     2. AGREGAR BOTÓN PDF AL MODAL DE FACTURA
  ════════════════════════════════════════════════════════════ */

  function patchFacturaModal() {
    const actions = document.querySelector('.factura-modal-actions');
    if (!actions || actions.dataset.v78) return;
    actions.dataset.v78 = '1';

    // Add PDF button next to print
    const pdfBtn = document.createElement('button');
    pdfBtn.className = 'btn btn-outline btn-sm';
    pdfBtn.id = 'factura-pdf-btn';
    pdfBtn.textContent = '📄 PDF';
    pdfBtn.title = 'Guardar como PDF';
    pdfBtn.style.cssText = 'background:#C9A96E;color:#fff;border-color:#C9A96E';

    // Add print sizes button (replaces plain print)
    const printBtn = document.getElementById('factura-print');
    if (printBtn) {
      printBtn.textContent = '🖨️ Imprimir';
      printBtn.title = 'Imprimir con selección de tamaño';
      // Override print click to show size dialog
      printBtn.addEventListener('click', (e) => {
        e.stopImmediatePropagation();
        const modal = document.getElementById('factura-modal');
        const saleId = modal && modal._currentSaleId;
        if (saleId) {
          // Close modal, show size dialog
          modal.classList.remove('open');
          showPrintSizeDialog(saleId);
        }
      }, true);
    }

    pdfBtn.addEventListener('click', () => {
      const modal = document.getElementById('factura-modal');
      const saleId = modal && modal._currentSaleId;
      if (saleId) {
        showPDFSizeDialog(saleId);
        modal.classList.remove('open');
      }
    });

    actions.insertBefore(pdfBtn, actions.querySelector('#factura-close'));
  }

  /* ── PDF size selection dialog ── */
  function showPDFSizeDialog(saleId) {
    const existing = document.getElementById('pdf-size-dialog');
    if (existing) existing.remove();

    const sizes = [
      { label: '🧾 Ticket POS (80mm)', key: 'ticket' },
      { label: '📄 A5', key: 'a5' },
      { label: '📄 A4 (recomendado)', key: 'a4' },
      { label: '📰 Media hoja', key: 'media' }
    ];

    const dlg = document.createElement('div');
    dlg.id = 'pdf-size-dialog';
    dlg.style.cssText = 'position:fixed;inset:0;z-index:10002;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.55)';
    dlg.innerHTML = `
      <div style="background:#fff;border-radius:18px;padding:26px 28px;max-width:340px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,.22)">
        <div style="font-size:1.05rem;font-weight:800;margin-bottom:6px">📄 Guardar factura como PDF</div>
        <div style="font-size:.8rem;color:#888;margin-bottom:16px">Selecciona el formato del documento</div>
        <div style="display:flex;flex-direction:column;gap:8px">
          ${sizes.map(s => `
            <button data-key="${s.key}"
              style="padding:12px 16px;background:#f5f5f7;border:1.5px solid transparent;border-radius:10px;
                     cursor:pointer;text-align:left;font-size:.88rem;font-weight:600;transition:all .15s">
              ${s.label}
            </button>`).join('')}
        </div>
        <button id="pdsd-cancel" style="margin-top:14px;width:100%;padding:9px;background:transparent;
          border:1px solid rgba(0,0,0,.12);border-radius:9px;cursor:pointer;font-size:.83rem;color:#666">
          Cancelar
        </button>
      </div>`;

    document.body.appendChild(dlg);

    dlg.querySelectorAll('button[data-key]').forEach(btn => {
      btn.addEventListener('mouseenter', () => { btn.style.borderColor = '#C9A96E'; btn.style.background = 'rgba(201,169,110,.07)'; });
      btn.addEventListener('mouseleave', () => { btn.style.borderColor = 'transparent'; btn.style.background = '#f5f5f7'; });
      btn.addEventListener('click', () => {
        dlg.remove();
        window.downloadFacturaPDF(saleId, btn.dataset.key);
      });
    });

    document.getElementById('pdsd-cancel').onclick = () => dlg.remove();
    dlg.addEventListener('click', e => { if (e.target === dlg) dlg.remove(); });
  }

  /* ── Print size selection dialog (reusable) ── */
  function showPrintSizeDialog(saleId) {
    // Reuse v77 if available, otherwise define here
    if (window._v77ShowPrintSizeDialog) {
      window._v77ShowPrintSizeDialog(saleId);
      return;
    }

    const existing = document.getElementById('print-size-dialog');
    if (existing) existing.remove();

    const sizes = [
      { label: '🧾 Ticket POS (80mm)', w: '302px', fontSize: '10px', ticket: true },
      { label: '📄 A5 (148×210mm)', w: '559px', fontSize: '11px' },
      { label: '📄 A4 (210×297mm)', w: '793px', fontSize: '12px' },
      { label: '📰 Media hoja', w: '793px', fontSize: '11px' }
    ];

    const dlg = document.createElement('div');
    dlg.id = 'print-size-dialog';
    dlg.style.cssText = 'position:fixed;inset:0;z-index:10002;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.55)';
    dlg.innerHTML = `
      <div style="background:#fff;border-radius:18px;padding:26px 28px;max-width:340px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,.22)">
        <div style="font-size:1.05rem;font-weight:800;margin-bottom:16px">🖨️ Tamaño de impresión</div>
        <div style="display:flex;flex-direction:column;gap:8px">
          ${sizes.map((s, i) => `
            <button data-i="${i}" style="padding:12px 16px;background:#f5f5f7;border:1.5px solid transparent;
              border-radius:10px;cursor:pointer;text-align:left;font-size:.88rem;font-weight:600;transition:all .15s">
              ${s.label}
            </button>`).join('')}
        </div>
        <button id="psd-cancel" style="margin-top:14px;width:100%;padding:9px;background:transparent;
          border:1px solid rgba(0,0,0,.12);border-radius:9px;cursor:pointer;font-size:.83rem;color:#666">
          Cancelar
        </button>
      </div>`;

    document.body.appendChild(dlg);

    dlg.querySelectorAll('button[data-i]').forEach(btn => {
      const size = sizes[Number(btn.dataset.i)];
      btn.addEventListener('mouseenter', () => { btn.style.borderColor = '#C9A96E'; btn.style.background = 'rgba(201,169,110,.07)'; });
      btn.addEventListener('mouseleave', () => { btn.style.borderColor = 'transparent'; btn.style.background = '#f5f5f7'; });
      btn.addEventListener('click', () => {
        dlg.remove();
        const key = size.ticket ? 'ticket' : (size.w === '559px' ? 'a5' : 'a4');
        window.downloadFacturaPDF(saleId, key);
      });
    });

    document.getElementById('psd-cancel').onclick = () => dlg.remove();
    dlg.addEventListener('click', e => { if (e.target === dlg) dlg.remove(); });
  }

  /* ════════════════════════════════════════════════════════════
     3. POST-SALE POPUP — bind robusto, re-enlaza después de cada venta
  ════════════════════════════════════════════════════════════ */

  function bindSalePopup() {
    const overlay = document.getElementById('sale-popup-overlay');
    if (!overlay || overlay._v78Bound) return;
    overlay._v78Bound = true;

    const printBtn = document.getElementById('sale-popup-print');
    const pdfBtn = document.getElementById('sale-popup-pdf');
    const closeBtn = document.getElementById('sale-popup-close');

    function closePopup() {
      overlay.style.display = 'none';
    }

    if (printBtn) {
      printBtn.addEventListener('click', () => {
        const saleId = overlay._saleId;
        closePopup();
        if (saleId) showPrintSizeDialog(saleId);
      });
    }

    if (pdfBtn) {
      pdfBtn.addEventListener('click', () => {
        const saleId = overlay._saleId;
        closePopup();
        if (saleId) showPDFSizeDialog(saleId);
      });
    }

    if (closeBtn) closeBtn.addEventListener('click', closePopup);
    overlay.addEventListener('click', e => { if (e.target === overlay) closePopup(); });
  }

  function showSalePopup(sale) {
    const overlay = document.getElementById('sale-popup-overlay');
    if (!overlay) return;

    const sub = document.getElementById('sale-popup-sub');
    if (sub && sale) {
      sub.textContent = `${sale.numeroFactura || 'Factura'} · ${fmt(sale.total || 0)} · ${sale.customerName || 'Cliente general'}`;
    }

    overlay._saleId = sale ? sale.id : null;
    overlay.style.display = 'flex';
    bindSalePopup();
  }

  // Expose globally so v77 popup can still work
  window._v78ShowSalePopup = showSalePopup;

  function hookOnneBus() {
    const maxWait = 5000, step = 200;
    let waited = 0;
    const interval = setInterval(() => {
      waited += step;
      if (window.OnneBus) {
        clearInterval(interval);
        // Override v77 listener with v78 enhanced one
        window.OnneBus.on('sale:created', sale => showSalePopup(sale));
      }
      if (waited >= maxWait) clearInterval(interval);
    }, step);
  }

  /* ════════════════════════════════════════════════════════════
     4. IMPRIMIR / PDF DESDE HISTORIAL DE VENTAS
        Agrega botones 🖨️ y 📄 en cada fila de ventas registradas
  ════════════════════════════════════════════════════════════ */

  function patchVentasHistoryButtons() {
    // Delegate on admin body — catch clicks on print/pdf buttons in ventas table
    if (document._v78HistoryDelegated) return;
    document._v78HistoryDelegated = true;

    document.addEventListener('click', e => {
      // Print button in history
      const printBtn = e.target.closest('[data-act="print-factura"]');
      if (printBtn) {
        const saleId = printBtn.dataset.saleId || printBtn.closest('[data-sale-id]')?.dataset.saleId;
        if (saleId) showPrintSizeDialog(saleId);
        return;
      }

      // PDF button in history
      const pdfBtn = e.target.closest('[data-act="pdf-factura"]');
      if (pdfBtn) {
        const saleId = pdfBtn.dataset.saleId || pdfBtn.closest('[data-sale-id]')?.dataset.saleId;
        if (saleId) showPDFSizeDialog(saleId);
        return;
      }
    });
  }

  // Patch renderVentasSection to include print/pdf buttons
  function patchRenderVentasSection() {
    const orig = window.renderVentasSection;
    if (!orig || typeof orig !== 'function') return;
    if (window._v78RenderVentasPatched) return;
    window._v78RenderVentasPatched = true;

    window.renderVentasSection = function (...args) {
      orig.apply(this, args);
      // After render, add print/pdf to FAC buttons
      setTimeout(() => {
        $$('[data-act="view-factura"]').forEach(btn => {
          if (btn._v78btns) return;
          btn._v78btns = true;
          const saleId = btn.dataset.saleId || btn.closest('[data-sale-id]')?.dataset.saleId;
          if (!saleId) return;

          const printBtn = document.createElement('button');
          printBtn.className = 'btn btn-outline btn-sm';
          printBtn.setAttribute('data-act', 'print-factura');
          printBtn.setAttribute('data-sale-id', saleId);
          printBtn.title = 'Imprimir factura';
          printBtn.style.cssText = 'padding:4px 8px;font-size:.7rem;margin-left:3px';
          printBtn.textContent = '🖨️';

          const pdfBtn = document.createElement('button');
          pdfBtn.className = 'btn btn-outline btn-sm';
          pdfBtn.setAttribute('data-act', 'pdf-factura');
          pdfBtn.setAttribute('data-sale-id', saleId);
          pdfBtn.title = 'Guardar PDF';
          pdfBtn.style.cssText = 'padding:4px 8px;font-size:.7rem;margin-left:3px;background:rgba(201,169,110,.1);border-color:rgba(201,169,110,.4)';
          pdfBtn.textContent = '📄';

          btn.after(pdfBtn);
          btn.after(printBtn);
        });
      }, 300);
    };
  }

  /* ════════════════════════════════════════════════════════════
     5. DASHBOARD ADMIN — GRÁFICOS SHOPIFY-STYLE (Canvas puro)
  ════════════════════════════════════════════════════════════ */

  function renderAdminSalesCharts() {
    if (isVendedor()) return; // Only for admin
    const chartsHost = document.getElementById('v78-charts-host');
    if (!chartsHost) return;

    const cfg = getCfg();
    const sales = cfg.sales || [];
    if (!sales.length) {
      chartsHost.innerHTML = `<div style="text-align:center;padding:32px;color:#999;font-size:.85rem">📊 Sin ventas registradas aún</div>`;
      return;
    }

    // ── Last 14 days daily sales
    const last14 = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      last14.push(d.toISOString().slice(0, 10));
    }
    const dailyTotals = last14.map(day => ({
      day,
      label: new Date(day + 'T12:00:00').toLocaleDateString('es-DO', { day: '2-digit', month: 'short' }),
      total: sales.filter(s => s.date === day).reduce((acc, s) => acc + (s.total || 0), 0),
      count: sales.filter(s => s.date === day).length
    }));

    // ── Top 5 products
    const prodMap = {};
    sales.forEach(s => {
      const key = s.productName || 'Sin nombre';
      prodMap[key] = (prodMap[key] || 0) + (s.total || 0);
    });
    const topProds = Object.entries(prodMap).sort((a, b) => b[1] - a[1]).slice(0, 5);

    // ── KPIs
    const todayStr = today();
    const todaySales = sales.filter(s => s.date === todayStr);
    const totalHoy = todaySales.reduce((a, s) => a + (s.total || 0), 0);
    const monthStart = new Date(); monthStart.setDate(1);
    const monthStr = monthStart.toISOString().slice(0, 10);
    const monthSales = sales.filter(s => s.date >= monthStr);
    const totalMes = monthSales.reduce((a, s) => a + (s.total || 0), 0);
    const totalGeneral = sales.reduce((a, s) => a + (s.total || 0), 0);
    const ticketProm = sales.length ? totalGeneral / sales.length : 0;

    chartsHost.innerHTML = `
      <!-- KPI row -->
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin-bottom:20px">
        ${[
          { v: fmt(totalHoy), l: '💰 Ventas hoy', c: '#C9A96E' },
          { v: fmt(totalMes), l: '📅 Ventas del mes', c: '#3b82f6' },
          { v: String(sales.length), l: '🧾 Total ventas', c: '#10b981' },
          { v: fmt(ticketProm), l: '🎫 Ticket promedio', c: '#8b5cf6' }
        ].map(k => `
          <div class="admin-card" style="margin:0;padding:18px 16px;text-align:center">
            <div style="font-size:1.6rem;font-weight:900;color:${k.c}">${k.v}</div>
            <div style="font-size:.78rem;color:var(--adm-text-mid,#888);margin-top:4px">${k.l}</div>
          </div>`).join('')}
      </div>

      <!-- Charts grid -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:16px">

        <!-- Bar chart: ventas 14 días -->
        <div class="admin-card" style="margin:0;padding:18px">
          <div class="admin-card-title" style="margin-bottom:12px;font-size:.87rem">📈 Ventas — últimos 14 días</div>
          <canvas id="v78-bar-chart" height="160" style="width:100%;display:block"></canvas>
          <div id="v78-bar-labels" style="display:flex;justify-content:space-between;margin-top:5px;overflow:hidden"></div>
        </div>

        <!-- Top products bar -->
        <div class="admin-card" style="margin:0;padding:18px">
          <div class="admin-card-title" style="margin-bottom:12px;font-size:.87rem">🏆 Top 5 productos (monto)</div>
          <div id="v78-top-prods" style="display:flex;flex-direction:column;gap:10px"></div>
        </div>
      </div>
    `;

    // Draw bar chart
    drawBarChart(
      document.getElementById('v78-bar-chart'),
      document.getElementById('v78-bar-labels'),
      dailyTotals
    );

    // Draw top products
    renderTopProducts(document.getElementById('v78-top-prods'), topProds, totalGeneral);
  }

  function drawBarChart(canvas, labelsEl, data) {
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.offsetWidth || 400;
    const H = 160;
    canvas.width = W;
    canvas.height = H;

    const maxVal = Math.max(...data.map(d => d.total), 1);
    const barW = Math.floor((W - 20) / data.length) - 3;
    const padLeft = 10, padBot = 8, padTop = 14;
    const chartH = H - padBot - padTop;

    ctx.clearRect(0, 0, W, H);

    // Grid lines
    ctx.strokeStyle = 'rgba(0,0,0,.06)';
    ctx.lineWidth = 1;
    [0.25, 0.5, 0.75, 1].forEach(frac => {
      const y = padTop + chartH * (1 - frac);
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(W - 10, y);
      ctx.stroke();
    });

    // Bars
    data.forEach((d, i) => {
      const h = Math.max(2, (d.total / maxVal) * chartH);
      const x = padLeft + i * (barW + 3);
      const y = padTop + chartH - h;

      // Color today gold
      const isToday = d.day === today();
      const grad = ctx.createLinearGradient(x, y, x, y + h);
      if (isToday) {
        grad.addColorStop(0, '#C9A96E');
        grad.addColorStop(1, '#a0844a');
      } else if (d.total > 0) {
        grad.addColorStop(0, '#6DBF8A');
        grad.addColorStop(1, '#4a9e6a');
      } else {
        grad.addColorStop(0, '#e5e5e5');
        grad.addColorStop(1, '#ddd');
      }

      ctx.fillStyle = grad;
      ctx.beginPath();
      const r = 3;
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + barW - r, y);
      ctx.quadraticCurveTo(x + barW, y, x + barW, y + r);
      ctx.lineTo(x + barW, y + h);
      ctx.lineTo(x, y + h);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
      ctx.fill();
    });

    // Labels (every 3rd to avoid crowding)
    if (labelsEl) {
      labelsEl.innerHTML = data.map((d, i) => {
        if (i % 3 !== 0 && i !== data.length - 1) return `<span style="flex:1"></span>`;
        return `<span style="flex:1;text-align:center;font-size:.62rem;color:#999;overflow:hidden">${d.label}</span>`;
      }).join('');
    }
  }

  function renderTopProducts(host, topProds, totalGeneral) {
    if (!host) return;
    const colors = ['#C9A96E', '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b'];
    host.innerHTML = topProds.map(([name, total], i) => {
      const pct = totalGeneral > 0 ? (total / totalGeneral * 100).toFixed(1) : 0;
      return `
        <div>
          <div style="display:flex;justify-content:space-between;font-size:.8rem;margin-bottom:4px">
            <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:60%">${esc(name)}</span>
            <span style="font-weight:700;color:${colors[i]};flex-shrink:0">${fmt(total)}</span>
          </div>
          <div style="height:6px;background:#f0f0f0;border-radius:3px;overflow:hidden">
            <div style="height:100%;width:${pct}%;background:${colors[i]};border-radius:3px;transition:width .6s .${i}s"></div>
          </div>
          <div style="font-size:.7rem;color:#bbb;margin-top:2px">${pct}% del total</div>
        </div>`;
    }).join('');
  }

  /* ════════════════════════════════════════════════════════════
     6. FIX PRODUCTOS POR FILA — solo HOME, nunca #shop-grid / catalog
        Doble seguridad: limpia cualquier regla global residual de v75
  ════════════════════════════════════════════════════════════ */

  function fixProductsPerRow(cfg) {
    ['dynamic-grid-style-v75','dynamic-grid-style'].forEach(id=>{const e=document.getElementById(id);if(e)e.remove();});
  }

  /* ════════════════════════════════════════════════════════════
     7. CUADRE DEL DÍA — imprimir y guardar PDF
  ════════════════════════════════════════════════════════════ */

  function buildCuadreHTML(cuadre, empresa) {
    const user = cuadre.userName || '—';
    const fecha = fmtDate(cuadre.fecha || cuadre.date);
    const hora = cuadre.horaTs ? fmtTime(new Date(cuadre.horaTs).toISOString()) : cuadre.hora || '—';
    const totalVendido = cuadre.totalVendido || 0;
    const numVentas = cuadre.numVentas || 0;
    const items = cuadre.items || [];

    return `
<div style="max-width:600px;margin:0 auto;font-family:'Helvetica Neue',Arial,sans-serif;color:#111">
  <div style="border-bottom:2px solid #C9A96E;padding-bottom:14px;margin-bottom:18px;display:flex;justify-content:space-between;align-items:flex-start">
    <div>
      <div style="font-size:1.3rem;font-weight:800">${esc(empresa.nombre || 'ONNE STORE RD')}</div>
      <div style="font-size:.85rem;color:#666;margin-top:3px">Cuadre del Día</div>
    </div>
    <div style="text-align:right;font-size:.82rem;color:#555">
      <div><strong>Vendedor:</strong> ${esc(user)}</div>
      <div><strong>Fecha:</strong> ${esc(fecha)}</div>
      <div><strong>Hora cierre:</strong> ${esc(hora)}</div>
    </div>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px">
    <div style="background:#f8f8f8;border-radius:8px;padding:14px;text-align:center">
      <div style="font-size:1.5rem;font-weight:900;color:#C9A96E">${fmt(totalVendido)}</div>
      <div style="font-size:.8rem;color:#888;margin-top:4px">💰 Total vendido</div>
    </div>
    <div style="background:#f8f8f8;border-radius:8px;padding:14px;text-align:center">
      <div style="font-size:1.5rem;font-weight:900;color:#3b82f6">${numVentas}</div>
      <div style="font-size:.8rem;color:#888;margin-top:4px">🧾 Número de ventas</div>
    </div>
  </div>
  ${items.length ? `
  <table style="width:100%;border-collapse:collapse;margin-bottom:16px">
    <thead>
      <tr style="background:#1C1C1E;color:#fff">
        <th style="padding:9px 10px;text-align:left;font-size:.82rem">Producto</th>
        <th style="padding:9px 10px;text-align:center;font-size:.82rem">Cant.</th>
        <th style="padding:9px 10px;text-align:right;font-size:.82rem">Total</th>
      </tr>
    </thead>
    <tbody>
      ${items.map((it, i) => `
      <tr style="${i % 2 ? 'background:#f9f9f9' : ''}">
        <td style="padding:8px 10px;font-size:.85rem">${esc(it.name || '—')}</td>
        <td style="padding:8px 10px;text-align:center;font-size:.85rem">${it.qty || 0}</td>
        <td style="padding:8px 10px;text-align:right;font-size:.85rem;font-weight:600">${fmt(it.total || 0)}</td>
      </tr>`).join('')}
    </tbody>
  </table>` : ''}
  ${cuadre.notas ? `<div style="background:#fffde7;border-radius:6px;padding:10px 14px;font-size:.82rem;color:#666;margin-bottom:14px"><strong>Notas:</strong> ${esc(cuadre.notas)}</div>` : ''}
  <div style="border-top:2px solid #C9A96E;padding-top:14px;text-align:center;font-size:.77rem;color:#aaa">
    ${esc(empresa.nombre || 'ONNE STORE RD')} — Cuadre generado el ${new Date().toLocaleDateString('es-DO')}
  </div>
</div>`;
  }

  window.printCuadre = function (cuadreId) {
    const cfg = getCfg();
    const cuadre = (cfg.cuadres || []).find(c => c.id === cuadreId);
    if (!cuadre) { toast('Cuadre no encontrado', 'err'); return; }
    const empresa = cfg.empresa || {};
    const html = buildCuadreHTML(cuadre, empresa);

    const w = window.open('', '_blank', 'width=700,height=600');
    if (!w) { toast('Permite ventanas emergentes', 'err'); return; }
    w.document.write(`<!DOCTYPE html><html lang="es"><head>
      <meta charset="UTF-8"><title>Cuadre del Día</title>
      <style>* { margin:0; padding:0; box-sizing:border-box; } body { padding:24px; font-family:'Helvetica Neue',Arial,sans-serif; } @media print { body { padding:0; } }</style>
    </head><body>${html}</body></html>`);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 350);
  };

  window.downloadCuadrePDF = function (cuadreId) {
    window.printCuadre(cuadreId); // triggers browser PDF save
    toast('Selecciona "Guardar como PDF" en el diálogo de impresión', 'info');
  };

  /* ════════════════════════════════════════════════════════════
     8. INYECTAR CHART HOST EN DASHBOARD ADMIN
        Se inserta ANTES del bloque "Vista previa del sitio"
  ════════════════════════════════════════════════════════════ */

  function injectChartsHost() {
    if (isVendedor()) return;

    // Static host now exists in HTML — just bind and render
    const existingHost = document.getElementById('v78-charts-host');
    if (existingHost) {
      renderAdminChartsInner();
      const refreshBtn = document.getElementById('v78-refresh-charts');
      if (refreshBtn && !refreshBtn._bound) {
        refreshBtn._bound = true;
        refreshBtn.addEventListener('click', () => { _v78RetryCount = 0; renderAdminChartsInner(); });
      }
      return;
    }

    // Fallback: dynamic injection (legacy, should not be needed)
    const preview = document.querySelector('#view-dashboard .admin-card iframe#preview')?.closest('.admin-card');
    if (!preview) return;

    const host = document.createElement('div');
    host.id = 'v78-charts-host';
    host.className = 'v78-charts-section';
    host.style.cssText = 'margin-bottom:16px';
    host.innerHTML = `
      <div class="admin-card" style="margin-bottom:16px">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px">
          <div class="admin-card-title" style="margin:0">📊 Resumen de ventas</div>
          <button id="v78-refresh-charts" style="background:transparent;border:none;cursor:pointer;font-size:.8rem;color:#888;padding:4px 8px;border-radius:6px" title="Actualizar">↺ Actualizar</button>
        </div>
        <div id="v78-charts-inner" style="margin-top:12px"></div>
      </div>`;
    preview.parentNode.insertBefore(host, preview);

    renderAdminChartsInner();
    document.getElementById('v78-refresh-charts')?.addEventListener('click', () => {
      _v78RetryCount = 0;
      renderAdminChartsInner();
    });
  }

  let _v78RetryCount = 0;
  function renderAdminChartsInner() {
    const inner = document.getElementById('v78-charts-inner');
    if (!inner) return;

    // Wait for StorageAPI and data — retry up to 10x with 600ms gap
    const cfg = window.StorageAPI ? window.StorageAPI.load() : {};
    const sales = cfg.sales || [];

    if (!sales.length && _v78RetryCount < 10) {
      _v78RetryCount++;
      inner.innerHTML = `<div style="text-align:center;padding:20px;color:#ccc;font-size:.82rem">⏳ Cargando datos de ventas…</div>`;
      setTimeout(() => renderAdminChartsInner(), 600);
      return;
    }
    _v78RetryCount = 0; // reset for next manual refresh

    inner.innerHTML = '';

    if (!sales.length) {
      inner.innerHTML = `<div style="text-align:center;padding:28px;color:#bbb;font-size:.84rem">📊 Sin ventas registradas aún.<br><a href="#" onclick="document.querySelector('[data-view=ventas]')?.click();return false" style="color:#C9A96E">Registrar primera venta →</a></div>`;
      return;
    }

    // KPIs
    const todayStr = today();
    const monthStart = todayStr.slice(0, 8) + '01';
    const todaySales = sales.filter(s => s.date === todayStr);
    const monthSales = sales.filter(s => s.date >= monthStart);
    const totalHoy = todaySales.reduce((a, s) => a + (s.total || 0), 0);
    const totalMes = monthSales.reduce((a, s) => a + (s.total || 0), 0);
    const totalGen = sales.reduce((a, s) => a + (s.total || 0), 0);
    const ticketProm = sales.length ? totalGen / sales.length : 0;

    // Clientes únicos
    const uniqueClients = new Set(sales.map(s => s.customerId || s.customerName).filter(Boolean)).size;

    inner.innerHTML = `
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px;margin-bottom:18px">
        ${[
          { v: fmt(totalHoy), l: 'Ventas hoy', c: '#C9A96E', icon: '💰' },
          { v: fmt(totalMes), l: 'Ventas del mes', c: '#3b82f6', icon: '📅' },
          { v: String(todaySales.length), l: 'Ventas hoy (cant.)', c: '#10b981', icon: '🧾' },
          { v: fmt(ticketProm), l: 'Ticket promedio', c: '#8b5cf6', icon: '🎫' },
          { v: String(uniqueClients), l: 'Clientes únicos', c: '#f59e0b', icon: '👥' },
          { v: String(sales.length), l: 'Total transacciones', c: '#64748b', icon: '📊' }
        ].map(k => `
          <div style="background:rgba(${hexToRgb(k.c)},.07);border:1px solid rgba(${hexToRgb(k.c)},.18);
                      border-radius:12px;padding:14px;text-align:center">
            <div style="font-size:.9rem">${k.icon}</div>
            <div style="font-size:1.35rem;font-weight:900;color:${k.c};line-height:1.2;margin-top:2px">${k.v}</div>
            <div style="font-size:.72rem;color:#888;margin-top:3px">${k.l}</div>
          </div>`).join('')}
      </div>
      <div style="display:grid;grid-template-columns:3fr 2fr;gap:14px">
        <div>
          <div style="font-size:.8rem;font-weight:700;color:#666;margin-bottom:8px">📈 Ventas diarias — últimos 14 días</div>
          <canvas id="v78-inline-bar" height="120" style="width:100%;display:block;border-radius:8px"></canvas>
        </div>
        <div>
          <div style="font-size:.8rem;font-weight:700;color:#666;margin-bottom:8px">🏆 Top productos</div>
          <div id="v78-inline-top"></div>
        </div>
      </div>`;

    // Draw inline bar chart
    const last14 = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const ds = d.toISOString().slice(0, 10);
      last14.push({
        day: ds,
        label: d.toLocaleDateString('es-DO', { day: '2-digit', month: 'short' }),
        total: sales.filter(s => s.date === ds).reduce((a, s) => a + (s.total || 0), 0)
      });
    }

    requestAnimationFrame(() => requestAnimationFrame(() => {
      drawBarChartInline(document.getElementById('v78-inline-bar'), last14);
      const prodMap = {};
      sales.forEach(s => {
        const k = s.productName || 'Sin nombre';
        prodMap[k] = (prodMap[k] || 0) + (s.total || 0);
      });
      const topProds = Object.entries(prodMap).sort((a, b) => b[1] - a[1]).slice(0, 5);
      renderTopProducts(document.getElementById('v78-inline-top'), topProds, totalGen);
    }));
  }

  function drawBarChartInline(canvas, data) {
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.offsetWidth || canvas.parentElement?.offsetWidth || 500;
    const H = 120;
    canvas.width = W;
    canvas.height = H;

    const maxVal = Math.max(...data.map(d => d.total), 1);
    const gap = 2;
    const barW = Math.floor((W - 10) / data.length) - gap;
    const padL = 5, padT = 10, padB = 22;
    const chartH = H - padT - padB;

    ctx.clearRect(0, 0, W, H);

    // grid
    ctx.strokeStyle = 'rgba(0,0,0,.05)';
    ctx.lineWidth = 1;
    [0.5, 1].forEach(f => {
      const y = padT + chartH * (1 - f);
      ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(W - 5, y); ctx.stroke();
    });

    data.forEach((d, i) => {
      const h = Math.max(2, (d.total / maxVal) * chartH);
      const x = padL + i * (barW + gap);
      const y = padT + chartH - h;
      const isToday = d.day === today();

      const grad = ctx.createLinearGradient(x, y, x, y + h);
      if (isToday) { grad.addColorStop(0, '#C9A96E'); grad.addColorStop(1, '#a0844a'); }
      else if (d.total > 0) { grad.addColorStop(0, '#6DBF8A'); grad.addColorStop(1, '#4a9e6a'); }
      else { grad.addColorStop(0, '#e8e8e8'); grad.addColorStop(1, '#ddd'); }

      ctx.fillStyle = grad;
      const r = 2;
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + barW - r, y);
      ctx.quadraticCurveTo(x + barW, y, x + barW, y + r);
      ctx.lineTo(x + barW, y + h);
      ctx.lineTo(x, y + h);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
      ctx.fill();

      // Date label every 3rd
      if (i === 0 || i === 6 || i === 13) {
        ctx.fillStyle = isToday ? '#C9A96E' : '#bbb';
        ctx.font = `${isToday ? '700 ' : ''}9px system-ui`;
        ctx.textAlign = 'center';
        ctx.fillText(d.label, x + barW / 2, H - 5);
      }
    });
  }

  function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r},${g},${b}`;
  }

  /* ════════════════════════════════════════════════════════════
     9. REPORTES — botón exportar PDF
  ════════════════════════════════════════════════════════════ */

  function patchReportesExport() {
    const existing = document.getElementById('rp-export-pdf-btn');
    if (existing) return;

    const header = document.querySelector('#view-reportes .admin-card-title, .reporte-section-header');
    if (!header) return;

    const btn = document.createElement('button');
    btn.id = 'rp-export-pdf-btn';
    btn.className = 'btn btn-outline btn-sm';
    btn.textContent = '📄 Exportar PDF';
    btn.style.cssText = 'margin-left:auto;font-size:.78rem';

    btn.addEventListener('click', () => {
      const content = document.getElementById('rp-financiero') || document.querySelector('.reporte-tab-panel[style*="block"]');
      if (!content) return;

      const cfg = getCfg();
      const empresa = cfg.empresa || {};
      const w = window.open('', '_blank', 'width=800,height=700');
      if (!w) { toast('Permite ventanas emergentes', 'err'); return; }
      w.document.write(`<!DOCTYPE html><html lang="es"><head>
        <meta charset="UTF-8"><title>Reporte — ${esc(empresa.nombre || 'ONNE STORE RD')}</title>
        <style>
          * { margin:0; padding:0; box-sizing:border-box; }
          body { font-family:'Helvetica Neue',Arial,sans-serif; padding:24px; color:#111; }
          table { width:100%; border-collapse:collapse; margin-bottom:16px; }
          thead tr { background:#1C1C1E; color:#fff; }
          th { padding:9px 10px; font-size:.8rem; }
          td { padding:8px 10px; font-size:.85rem; border-bottom:1px solid #eee; }
          tr:nth-child(even) td { background:#f9f9f9; }
          h2,h3 { color:#1C1C1E; margin:18px 0 10px; }
          .stat { display:inline-block; background:#f5f5f7; border-radius:8px; padding:10px 14px; margin:4px; }
          @media print { body { padding:0; } }
        </style>
      </head><body>
        <h2>${esc(empresa.nombre || 'ONNE STORE RD')} — Reporte de Ventas</h2>
        <p style="font-size:.82rem;color:#888;margin-bottom:18px">Generado: ${new Date().toLocaleDateString('es-DO',{weekday:'long',day:'2-digit',month:'long',year:'numeric'})}</p>
        ${content.innerHTML}
      </body></html>`);
      w.document.close();
      w.focus();
      setTimeout(() => w.print(), 400);
    });

    if (header.style.display === 'flex' || getComputedStyle(header).display === 'flex') {
      header.appendChild(btn);
    } else {
      header.style.display = 'flex';
      header.style.alignItems = 'center';
      header.appendChild(btn);
    }
  }

  /* ════════════════════════════════════════════════════════════
     10. INICIALIZACIÓN
  ════════════════════════════════════════════════════════════ */

  function init() {
    // Fix products per row (index.html context)
    if (window.StorageAPI && document.getElementById('home-new-grid')) {
      const cfg = getCfg();
      fixProductsPerRow(cfg);
    }

    // Admin panel enhancements
    if (document.getElementById('view-dashboard')) {
      // Inject (or activate) charts — static host in HTML means no poll needed
      if (document.getElementById('v78-charts-host')) {
        // Static placeholder already in DOM — just render
        setTimeout(() => injectChartsHost(), 300);
      } else {
        // Fallback: wait for preview iframe to exist
        const waitForDash = setInterval(() => {
          const dash = document.getElementById('view-dashboard');
          if (dash && !dash.querySelector('iframe#preview')) return;
          clearInterval(waitForDash);
          injectChartsHost();
        }, 400);
        setTimeout(() => clearInterval(waitForDash), 6000);
      }

      // Bind sale popup
      bindSalePopup();
      hookOnneBus();

      // Patch factura modal
      setTimeout(() => {
        patchFacturaModal();
        patchVentasHistoryButtons();
        patchRenderVentasSection();
        patchReportesExport();
      }, 800);

      // Re-render charts when switching to dashboard
      document.addEventListener('click', e => {
        const link = e.target.closest('[data-view="dashboard"]');
        if (link) {
          setTimeout(() => {
            if (!isVendedor()) renderAdminChartsInner();
          }, 200);
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 100);
  }

  /* ── Expose public API ── */
  window.V78 = {
    buildInvoiceHTML,
    downloadFacturaPDF: window.downloadFacturaPDF,
    showPrintSizeDialog,
    showPDFSizeDialog,
    printCuadre: window.printCuadre,
    downloadCuadrePDF: window.downloadCuadrePDF,
    renderAdminChartsInner,
    fixProductsPerRow,
    _retryReset: () => { _v78RetryCount = 0; }
  };

})();

/* ═══ v79-fixes.js ═══════════════════════════════════════════════════════════════════ */
/*!
 * ONNE STORE RD — v79 Mejoras Completas del Sistema POS/ERP
 * ══════════════════════════════════════════════════════════════════
 *  1.  DASHBOARD VENDEDOR mejorado — KPIs completos, accesos rápidos
 *  2.  ROLE-BASED NAV mejorado — secciones ocultas según rol
 *  3.  POPUP POST-VENTA robusto — bind seguro, siempre disponible
 *  4.  REPORTES AUTOMÁTICOS — ventas/día, vendedor, producto, categoría
 *  5.  ESTADÍSTICAS SHOPIFY mejoradas — tendencias mensuales, clientes
 *  6.  FACTURA mejorada — vendedor, multi-producto, exportación limpia
 *  7.  CUADRE DEL DÍA mejorado — resumen detallado con diferencia
 *  8.  CONTROL DE CAJA mejorado — estado en tiempo real
 *  9.  FIX: productos por fila HOME ONLY (doble protección)
 * 10.  FIX: renderVendedorDashboard binding correcto
 * ══════════════════════════════════════════════════════════════════
 */
(function () {
  'use strict';

  /* ── Helpers ────────────────────────────────────────────── */
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  function getCfg() { return window.StorageAPI ? window.StorageAPI.load() : {}; }
  function saveCfg(c) { if (window.StorageAPI) window.StorageAPI.save(c); }
  function esc(s) {
    return (s || '').replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }
  function fmt(n) { return 'RD$' + Number(n || 0).toLocaleString('es-DO', { minimumFractionDigits: 0, maximumFractionDigits: 0 }); }
  function fmt2(n) { return 'RD$' + Number(n || 0).toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function fmtDate(d) {
    if (!d) return '—';
    const iso = typeof d === 'number' ? new Date(d).toISOString().slice(0, 10) : String(d).slice(0, 10);
    try { return new Date(iso + 'T12:00:00').toLocaleDateString('es-DO', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }); } catch { return d; }
  }
  function fmtShort(d) {
    if (!d) return '—';
    const iso = typeof d === 'number' ? new Date(d).toISOString().slice(0, 10) : String(d).slice(0, 10);
    try { return new Date(iso + 'T12:00:00').toLocaleDateString('es-DO', { day: '2-digit', month: 'short', year: 'numeric' }); } catch { return d; }
  }
  function fmtTime(ts) {
    try { return new Date(ts).toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit' }); } catch { return '—'; }
  }
  function today() { return new Date().toISOString().slice(0, 10); }
  function nowTime() { return new Date().toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit' }); }
  function uid(p) { return (p || 'x') + '_' + Math.random().toString(16).slice(2, 10); }
  function toast(msg, type) { if (window.toast) window.toast(msg, type || 'info'); }
  function getSession() {
    try { return JSON.parse(localStorage.getItem('adminSession') || '{}'); } catch { return {}; }
  }
  function getCurrentUser() { return getSession().user || { rol: 'admin', nombre: 'Administrador' }; }
  function getRole() { return getCurrentUser().rol || 'admin'; }
  function getUserName() { return getCurrentUser().nombre || 'Usuario'; }
  function getUserId() { return getCurrentUser().id || 'admin_master'; }
  function isAdmin() { const r = getRole(); return r === 'admin' || r === 'manager'; }
  function isVendedor() { return getRole() === 'vendedor'; }
  function hexToRgb(hex) {
    const r = parseInt((hex || '#000').slice(1, 3), 16);
    const g = parseInt((hex || '#000').slice(3, 5), 16);
    const b = parseInt((hex || '#000').slice(5, 7), 16);
    return `${r},${g},${b}`;
  }

  /* ════════════════════════════════════════════════════════════
     1. DASHBOARD DEL VENDEDOR — Completamente reimplementado
        Muestra KPIs simplificados + accesos rápidos
  ════════════════════════════════════════════════════════════ */

  function renderVendedorDashboard() {
    const dashView = document.getElementById('view-dashboard');
    if (!dashView || !isVendedor()) return;

    const cfg = getCfg();
    const sales = cfg.sales || [];
    const todayStr = today();
    const userId = getUserId();
    const userName = getUserName();

    // Filter today's sales for this vendor
    const todaySales = sales.filter(s =>
      s.date === todayStr && (s.vendedorId === userId || !s.vendedorId)
    );

    const totalHoy = todaySales.reduce((a, s) => a + (s.total || 0), 0);
    const countHoy = todaySales.length;

    // Productos diferentes vendidos hoy
    const prodSet = new Set(todaySales.map(s => s.productId || s.productName).filter(Boolean));
    const prodDiferentes = prodSet.size;

    // Ticket promedio
    const ticketProm = countHoy > 0 ? totalHoy / countHoy : 0;

    // Último producto vendido
    const lastSale = todaySales[0];
    const ultimoProd = lastSale ? (lastSale.productName || '—') : '—';

    // Caja actual
    const cajaHoy = (cfg.cajas || []).find(c => c.fecha === todayStr && c.userId === userId && !c.cerradaAt);
    const cajaAbierta = !!cajaHoy;

    dashView.innerHTML = `
      <div id="vendor-dashboard" style="max-width:900px">

        <!-- Bienvenida -->
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:22px;flex-wrap:wrap;gap:10px">
          <div>
            <h2 style="font-size:1.25rem;font-weight:800;margin:0">👋 Hola, ${esc(userName)}!</h2>
            <div style="font-size:.82rem;color:var(--adm-text-mid);margin-top:3px">${fmtDate(todayStr)}</div>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            ${cajaAbierta
              ? `<button onclick="window.v77OpenCierreCaja&&window.v77OpenCierreCaja()" style="padding:9px 16px;background:#dc2626;color:#fff;border:none;border-radius:9px;font-weight:700;cursor:pointer;font-size:.82rem">🔒 Cerrar Caja</button>`
              : `<button onclick="window.v77OpenAperturaCaja&&window.v77OpenAperturaCaja()" style="padding:9px 16px;background:#16a34a;color:#fff;border:none;border-radius:9px;font-weight:700;cursor:pointer;font-size:.82rem">💵 Abrir Caja</button>`
            }
          </div>
        </div>

        <!-- Estado de caja -->
        ${cajaAbierta
          ? `<div style="background:linear-gradient(135deg,#dcfce7,#bbf7d0);border:1px solid #86efac;border-radius:12px;padding:12px 18px;margin-bottom:18px;display:flex;align-items:center;gap:10px">
               <span style="font-size:1.2rem">🟢</span>
               <div>
                 <div style="font-weight:700;color:#166534;font-size:.88rem">Caja abierta desde las ${esc(cajaHoy.abiertaAt)}</div>
                 <div style="font-size:.78rem;color:#15803d">Monto inicial: ${fmt(cajaHoy.montoInicial)}</div>
               </div>
             </div>`
          : `<div style="background:#fef3c7;border:1px solid #fbbf24;border-radius:12px;padding:12px 18px;margin-bottom:18px;display:flex;align-items:center;gap:10px">
               <span style="font-size:1.2rem">⚠️</span>
               <div style="font-weight:700;color:#92400e;font-size:.88rem">Caja cerrada. Abre la caja antes de registrar ventas.</div>
             </div>`
        }

        <!-- KPI Cards -->
        <div class="v79-kpi-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin-bottom:22px">
          ${[
            { v: fmt(totalHoy), l: 'Ventas de hoy', c: '#C9A96E', icon: '💰' },
            { v: String(countHoy), l: 'Cantidad de ventas', c: '#3b82f6', icon: '🧾' },
            { v: String(prodDiferentes), l: 'Productos vendidos', c: '#10b981', icon: '📦' },
            { v: fmt(ticketProm), l: 'Ticket promedio', c: '#8b5cf6', icon: '🎫' }
          ].map(k => `
            <div class="admin-card" style="margin:0;padding:18px;text-align:center;border-top:3px solid ${k.c}">
              <div style="font-size:1.1rem">${k.icon}</div>
              <div style="font-size:1.5rem;font-weight:900;color:${k.c};margin-top:4px;line-height:1.1">${k.v}</div>
              <div style="font-size:.73rem;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--adm-text-mid);margin-top:5px">${k.l}</div>
            </div>`).join('')}
        </div>

        ${lastSale ? `
        <div style="background:var(--adm-bg,#f5f5f7);border-radius:12px;padding:12px 18px;margin-bottom:22px;display:flex;align-items:center;gap:10px">
          <span style="font-size:1.1rem">🛍️</span>
          <div>
            <div style="font-size:.72rem;font-weight:700;text-transform:uppercase;color:var(--adm-text-mid)">Última venta</div>
            <div style="font-weight:700;font-size:.9rem">${esc(ultimoProd)} — ${fmt(lastSale.total)}</div>
            <div style="font-size:.77rem;color:var(--adm-text-mid)">${esc(lastSale.customerName || 'Cliente general')} · ${esc(lastSale.numeroFactura || '—')}</div>
          </div>
        </div>` : ''}

        <!-- Accesos Rápidos -->
        <div class="admin-card" style="margin-bottom:18px">
          <div class="admin-card-title" style="margin-bottom:14px">⚡ Accesos Rápidos</div>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">
            ${[
              { icon: '🛒', label: 'Nueva Venta', view: 'ventas', color: '#C9A96E' },
              { icon: '📋', label: 'Historial', view: 'ventas', color: '#3b82f6' },
              { icon: '👥', label: 'Clientes', view: 'customers', color: '#10b981' }
            ].map(a => `
              <button onclick="document.querySelector('[data-view=\\'${a.view}\\']')?.click()"
                style="padding:14px 10px;background:rgba(${hexToRgb(a.color)},.08);border:1.5px solid rgba(${hexToRgb(a.color)},.25);border-radius:12px;cursor:pointer;text-align:center;transition:all .2s"
                onmouseover="this.style.background='rgba(${hexToRgb(a.color)},.15)'"
                onmouseout="this.style.background='rgba(${hexToRgb(a.color)},.08)'">
                <div style="font-size:1.4rem">${a.icon}</div>
                <div style="font-size:.78rem;font-weight:700;color:${a.color};margin-top:4px">${a.label}</div>
              </button>`).join('')}
          </div>
        </div>

        <!-- Ventas del día (tabla) -->
        <div class="admin-card" style="margin:0">
          <div class="admin-card-title" style="margin-bottom:12px">🧾 Mis ventas de hoy (${countHoy})</div>
          ${todaySales.length === 0
            ? '<div style="text-align:center;padding:20px;color:var(--adm-text-mid);font-size:.84rem">No hay ventas registradas hoy.<br><a href="#" onclick="document.querySelector(\'[data-view=ventas]\')?.click();return false" style="color:#C9A96E;font-weight:700">Registrar primera venta →</a></div>'
            : `<div style="overflow-x:auto">
                <table style="width:100%;border-collapse:collapse;font-size:.82rem">
                  <thead><tr style="background:var(--adm-bg,#f5f5f7)">
                    <th style="padding:8px 10px;text-align:left">Factura</th>
                    <th style="padding:8px 10px;text-align:left">Cliente</th>
                    <th style="padding:8px 10px;text-align:left">Producto</th>
                    <th style="padding:8px 10px;text-align:right">Total</th>
                  </tr></thead>
                  <tbody>
                    ${todaySales.slice(0, 10).map(s => `
                      <tr style="border-bottom:1px solid var(--border)">
                        <td style="padding:7px 10px;font-weight:700;color:#C9A96E">${esc(s.numeroFactura || '—')}</td>
                        <td style="padding:7px 10px">${esc(s.customerName || 'General')}</td>
                        <td style="padding:7px 10px;color:var(--adm-text-mid)">${esc(s.productName || '—')}</td>
                        <td style="padding:7px 10px;text-align:right;font-weight:700">${fmt(s.total)}</td>
                      </tr>`).join('')}
                    ${todaySales.length > 10 ? `<tr><td colspan="4" style="padding:8px 10px;text-align:center;font-size:.78rem;color:var(--adm-text-mid)">... y ${todaySales.length - 10} ventas más</td></tr>` : ''}
                  </tbody>
                </table>
              </div>`
          }
        </div>
      </div>`;
  }

  // Expose globally
  window.renderVendedorDashboard = renderVendedorDashboard;

  /* ════════════════════════════════════════════════════════════
     2. ROLE-BASED NAV — Mejorado para ocultar secciones admin
  ════════════════════════════════════════════════════════════ */

  const ROLE_VIEWS = {
    admin: null, // null = all
    manager: ['dashboard', 'ventas', 'compras', 'inventario', 'customers', 'reportes', 'analytics', 'products', 'cuadre', 'caja'],
    vendedor: ['dashboard', 'ventas', 'customers', 'cuadre', 'caja']
  };

  function applyRoleBasedUI() {
    const role = getRole();
    if (role === 'admin') return;

    const allowed = ROLE_VIEWS[role] || ['dashboard', 'ventas', 'customers'];

    // Hide nav links not in allowed list
    $$('.admin-nav-link[data-view]').forEach(el => {
      const view = el.dataset.view;
      el.style.display = allowed.includes(view) ? '' : 'none';
    });

    // Hide group separators that have no visible children
    $$('.admin-nav-sep').forEach(sep => {
      let next = sep.nextElementSibling;
      let hasVisible = false;
      while (next && !next.classList.contains('admin-nav-sep')) {
        if (next.style.display !== 'none') hasVisible = true;
        next = next.nextElementSibling;
      }
      sep.style.display = hasVisible ? '' : 'none';
    });

    // Add role badge to sidebar header
    const sideHead = document.querySelector('.admin-sidebar-header, .admin-logo');
    if (sideHead && !sideHead.querySelector('.v79-role-badge')) {
      const badge = document.createElement('div');
      badge.className = 'v79-role-badge';
      const roleBadges = {
        vendedor: { label: 'Vendedor', color: '#10b981' },
        manager: { label: 'Manager', color: '#3b82f6' }
      };
      const rb = roleBadges[role];
      if (rb) {
        badge.style.cssText = `display:inline-block;padding:2px 8px;border-radius:20px;font-size:.67rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;background:${rb.color};color:#fff;margin-top:4px`;
        badge.textContent = rb.label;
        sideHead.appendChild(badge);
      }
    }
  }

  /* ════════════════════════════════════════════════════════════
     3. POST-SALE POPUP MEJORADO
        Bind robusto usando event delegation, no se pierde
  ════════════════════════════════════════════════════════════ */

  function ensureSalePopup() {
    const existing = document.getElementById('v79-sale-popup');
    if (existing) return;

    const popup = document.createElement('div');
    popup.id = 'v79-sale-popup';
    popup.style.cssText = 'display:none;position:fixed;inset:0;z-index:99999;align-items:center;justify-content:center;background:rgba(0,0,0,.55)';
    popup.innerHTML = `
      <div style="background:var(--card,#fff);border-radius:20px;padding:28px 26px;width:360px;max-width:95vw;box-shadow:0 24px 70px rgba(0,0,0,.3);text-align:center">
        <div style="font-size:2.8rem;margin-bottom:8px">✅</div>
        <div style="font-size:1.1rem;font-weight:900;color:#1e1e1e;margin-bottom:6px">¡Venta registrada!</div>
        <div id="v79-popup-sub" style="font-size:.82rem;color:var(--adm-text-mid);margin-bottom:22px">Selecciona una acción</div>

        <!-- Selector de tamaño compacto -->
        <div style="margin-bottom:16px">
          <select id="v79-popup-size" style="width:100%;padding:9px 12px;border:1px solid rgba(0,0,0,.12);border-radius:9px;font-family:inherit;font-size:.85rem;background:var(--card,#fff)">
            <option value="ticket">🧾 Ticket POS (80mm)</option>
            <option value="a5">📄 A5</option>
            <option value="a4" selected>📃 A4 (recomendado)</option>
            <option value="media">📋 Media hoja</option>
          </select>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px">
          <button id="v79-popup-print" style="padding:12px 8px;background:var(--adm-gold,#C9A96E);color:#fff;border:none;border-radius:10px;font-size:.88rem;font-weight:700;cursor:pointer">
            🖨️ Imprimir
          </button>
          <button id="v79-popup-pdf" style="padding:12px 8px;background:#1C1C1E;color:#fff;border:none;border-radius:10px;font-size:.88rem;font-weight:700;cursor:pointer">
            📄 Guardar PDF
          </button>
        </div>
        <button id="v79-popup-close" style="width:100%;padding:10px;background:transparent;border:1px solid rgba(0,0,0,.12);border-radius:10px;font-size:.84rem;cursor:pointer;color:var(--adm-text-mid)">
          Cerrar sin imprimir
        </button>
      </div>`;
    document.body.appendChild(popup);

    // Event delegation — never gets lost
    popup.addEventListener('click', function (e) {
      const saleId = popup._saleId;
      const size = document.getElementById('v79-popup-size')?.value || 'a4';

      if (e.target.id === 'v79-popup-print' || e.target.closest('#v79-popup-print')) {
        popup.style.display = 'none';
        if (saleId && window.downloadFacturaPDF) window.downloadFacturaPDF(saleId, size);
      } else if (e.target.id === 'v79-popup-pdf' || e.target.closest('#v79-popup-pdf')) {
        popup.style.display = 'none';
        if (saleId && window.downloadFacturaPDF) window.downloadFacturaPDF(saleId, size);
        toast('Selecciona "Guardar como PDF" en el diálogo de impresión', 'info');
      } else if (e.target.id === 'v79-popup-close' || e.target === popup) {
        popup.style.display = 'none';
      }
    });
  }

  function showSalePopup(sale) {
    ensureSalePopup();
    const popup = document.getElementById('v79-sale-popup');
    if (!popup) return;
    popup._saleId = sale ? sale.id : null;
    const sub = document.getElementById('v79-popup-sub');
    if (sub && sale) {
      sub.textContent = `${sale.numeroFactura || 'FAC-???'} · ${fmt(sale.total || 0)} · ${sale.customerName || 'Cliente general'}`;
    }
    popup.style.display = 'flex';
  }
  window._v79ShowSalePopup = showSalePopup;

  /* ════════════════════════════════════════════════════════════
     4. REPORTES AUTOMÁTICOS MEJORADOS
        ventas/día, vendedor, producto, categoría + export PDF
  ════════════════════════════════════════════════════════════ */

  function buildAutoReports() {
    const cfg = getCfg();
    const sales = cfg.sales || [];
    const users = cfg.usuarios || [];

    // ── Ventas por día (últimos 30 días) ──────────────────
    const last30 = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      last30.push(d.toISOString().slice(0, 10));
    }
    const byDay = last30.map(day => ({
      day,
      count: sales.filter(s => s.date === day).length,
      total: sales.filter(s => s.date === day).reduce((a, s) => a + (s.total || 0), 0)
    })).filter(d => d.count > 0);

    // ── Ventas por vendedor ──────────────────────────────
    const byVendedor = {};
    sales.forEach(s => {
      const key = s.vendedorNombre || s.vendedor || s.vendedorId || 'Sin asignar';
      if (!byVendedor[key]) byVendedor[key] = { count: 0, total: 0 };
      byVendedor[key].count++;
      byVendedor[key].total += s.total || 0;
    });
    const byVendedorArr = Object.entries(byVendedor).sort((a, b) => b[1].total - a[1].total);

    // ── Ventas por producto ──────────────────────────────
    const byProd = {};
    sales.forEach(s => {
      const key = s.productName || 'Sin nombre';
      if (!byProd[key]) byProd[key] = { count: 0, total: 0 };
      byProd[key].count += s.quantity || 1;
      byProd[key].total += s.total || 0;
    });
    const byProdArr = Object.entries(byProd).sort((a, b) => b[1].total - a[1].total).slice(0, 15);

    // ── Ventas por categoría ─────────────────────────────
    const byCat = {};
    sales.forEach(s => {
      const key = s.category || 'Sin categoría';
      if (!byCat[key]) byCat[key] = { count: 0, total: 0 };
      byCat[key].count++;
      byCat[key].total += s.total || 0;
    });
    const byCatArr = Object.entries(byCat).sort((a, b) => b[1].total - a[1].total);

    return { byDay, byVendedorArr, byProdArr, byCatArr };
  }

  function renderReportesPanel() {
    if (!isAdmin()) return;
    const view = document.getElementById('view-reportes');
    if (!view) return;

    // Inject v79 enhanced reports tab
    const existingV79 = document.getElementById('v79-reports-panel');
    if (existingV79) return;

    // Find or create a place to inject
    const firstCard = view.querySelector('.admin-card');
    if (!firstCard) return;

    const panel = document.createElement('div');
    panel.id = 'v79-reports-panel';
    panel.style.cssText = 'margin-top:18px';

    panel.innerHTML = `
      <div class="admin-card" style="margin-bottom:0">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;flex-wrap:wrap">
          <div class="admin-card-title" style="margin:0">📊 Reportes Automáticos</div>
          <div style="display:flex;gap:8px;margin-left:auto;flex-wrap:wrap">
            <button id="v79-rpt-tab-dia"     class="v79-rpt-tab active" data-tab="dia">Por Día</button>
            <button id="v79-rpt-tab-vend"    class="v79-rpt-tab"        data-tab="vendedor">Por Vendedor</button>
            <button id="v79-rpt-tab-prod"    class="v79-rpt-tab"        data-tab="producto">Por Producto</button>
            <button id="v79-rpt-tab-cat"     class="v79-rpt-tab"        data-tab="categoria">Por Categoría</button>
            <button id="v79-rpt-export"      style="padding:6px 14px;background:#C9A96E;color:#fff;border:none;border-radius:7px;font-size:.77rem;font-weight:700;cursor:pointer">📄 Exportar PDF</button>
          </div>
        </div>
        <div id="v79-rpt-content" style="overflow-x:auto"></div>
      </div>`;
    view.appendChild(panel);

    injectV79ReportStyles();
    renderRptTab('dia');

    // Tab switching
    panel.querySelectorAll('.v79-rpt-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        panel.querySelectorAll('.v79-rpt-tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderRptTab(btn.dataset.tab);
      });
    });

    // Export PDF
    document.getElementById('v79-rpt-export')?.addEventListener('click', exportReportPDF);
  }

  function renderRptTab(tab) {
    const content = document.getElementById('v79-rpt-content');
    if (!content) return;
    const { byDay, byVendedorArr, byProdArr, byCatArr } = buildAutoReports();
    const totalGen = getCfg().sales?.reduce((a, s) => a + (s.total || 0), 0) || 0;

    let html = '';

    if (tab === 'dia') {
      if (!byDay.length) { content.innerHTML = '<p style="padding:16px;color:var(--adm-text-mid);font-size:.84rem">No hay ventas en los últimos 30 días.</p>'; return; }
      html = `<table style="width:100%;border-collapse:collapse;font-size:.83rem">
        <thead><tr style="background:var(--adm-bg,#f5f5f7)">
          <th style="padding:9px 12px;text-align:left">Fecha</th>
          <th style="padding:9px 12px;text-align:right">Cantidad</th>
          <th style="padding:9px 12px;text-align:right">Total vendido</th>
          <th style="padding:9px 12px;text-align:right">Ticket prom.</th>
        </tr></thead>
        <tbody>
          ${byDay.map((d, i) => `
          <tr style="border-bottom:1px solid var(--border);${d.day === today() ? 'background:rgba(201,169,110,.07)' : ''}">
            <td style="padding:8px 12px;font-weight:${d.day === today() ? '700' : 'normal'}">${fmtShort(d.day)}${d.day === today() ? ' <span style="font-size:.7rem;background:#C9A96E;color:#fff;padding:1px 6px;border-radius:9px">HOY</span>' : ''}</td>
            <td style="padding:8px 12px;text-align:right">${d.count}</td>
            <td style="padding:8px 12px;text-align:right;font-weight:700">${fmt(d.total)}</td>
            <td style="padding:8px 12px;text-align:right;color:var(--adm-text-mid)">${fmt(d.count > 0 ? d.total / d.count : 0)}</td>
          </tr>`).join('')}
        </tbody>
        <tfoot><tr style="border-top:2px solid #C9A96E;background:var(--adm-bg,#f5f5f7)">
          <td style="padding:9px 12px;font-weight:800">Total (30 días)</td>
          <td style="padding:9px 12px;text-align:right;font-weight:800">${byDay.reduce((a, d) => a + d.count, 0)}</td>
          <td style="padding:9px 12px;text-align:right;font-weight:800;color:#C9A96E">${fmt(byDay.reduce((a, d) => a + d.total, 0))}</td>
          <td></td>
        </tr></tfoot>
      </table>`;
    }

    if (tab === 'vendedor') {
      if (!byVendedorArr.length) { content.innerHTML = '<p style="padding:16px;color:var(--adm-text-mid);font-size:.84rem">No hay ventas registradas.</p>'; return; }
      html = `<table style="width:100%;border-collapse:collapse;font-size:.83rem">
        <thead><tr style="background:var(--adm-bg,#f5f5f7)">
          <th style="padding:9px 12px;text-align:left">Vendedor</th>
          <th style="padding:9px 12px;text-align:right">Ventas</th>
          <th style="padding:9px 12px;text-align:right">Total vendido</th>
          <th style="padding:9px 12px;text-align:right">% del total</th>
        </tr></thead>
        <tbody>
          ${byVendedorArr.map(([nombre, data]) => `
          <tr style="border-bottom:1px solid var(--border)">
            <td style="padding:8px 12px;font-weight:700">${esc(nombre)}</td>
            <td style="padding:8px 12px;text-align:right">${data.count}</td>
            <td style="padding:8px 12px;text-align:right;font-weight:700">${fmt(data.total)}</td>
            <td style="padding:8px 12px;text-align:right">
              <div style="display:flex;align-items:center;gap:6px;justify-content:flex-end">
                <div style="width:60px;height:6px;background:#f0f0f0;border-radius:3px;overflow:hidden">
                  <div style="height:100%;width:${totalGen > 0 ? (data.total / totalGen * 100).toFixed(1) : 0}%;background:#C9A96E;border-radius:3px"></div>
                </div>
                <span style="font-size:.78rem;color:var(--adm-text-mid)">${totalGen > 0 ? (data.total / totalGen * 100).toFixed(1) : 0}%</span>
              </div>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>`;
    }

    if (tab === 'producto') {
      if (!byProdArr.length) { content.innerHTML = '<p style="padding:16px;color:var(--adm-text-mid);font-size:.84rem">No hay ventas registradas.</p>'; return; }
      html = `<table style="width:100%;border-collapse:collapse;font-size:.83rem">
        <thead><tr style="background:var(--adm-bg,#f5f5f7)">
          <th style="padding:9px 12px;text-align:left">Producto</th>
          <th style="padding:9px 12px;text-align:right">Cant. vendida</th>
          <th style="padding:9px 12px;text-align:right">Total vendido</th>
          <th style="padding:9px 12px;text-align:right">% del total</th>
        </tr></thead>
        <tbody>
          ${byProdArr.map(([name, data]) => `
          <tr style="border-bottom:1px solid var(--border)">
            <td style="padding:8px 12px;font-weight:700">${esc(name)}</td>
            <td style="padding:8px 12px;text-align:right">${data.count}</td>
            <td style="padding:8px 12px;text-align:right;font-weight:700">${fmt(data.total)}</td>
            <td style="padding:8px 12px;text-align:right">
              <span style="font-size:.78rem;color:var(--adm-text-mid)">${totalGen > 0 ? (data.total / totalGen * 100).toFixed(1) : 0}%</span>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>`;
    }

    if (tab === 'categoria') {
      if (!byCatArr.length) { content.innerHTML = '<p style="padding:16px;color:var(--adm-text-mid);font-size:.84rem">No hay ventas registradas.</p>'; return; }
      html = `<table style="width:100%;border-collapse:collapse;font-size:.83rem">
        <thead><tr style="background:var(--adm-bg,#f5f5f7)">
          <th style="padding:9px 12px;text-align:left">Categoría</th>
          <th style="padding:9px 12px;text-align:right">Ventas</th>
          <th style="padding:9px 12px;text-align:right">Total vendido</th>
          <th style="padding:9px 12px;text-align:right">% del total</th>
        </tr></thead>
        <tbody>
          ${byCatArr.map(([cat, data]) => `
          <tr style="border-bottom:1px solid var(--border)">
            <td style="padding:8px 12px;font-weight:700">${esc(cat)}</td>
            <td style="padding:8px 12px;text-align:right">${data.count}</td>
            <td style="padding:8px 12px;text-align:right;font-weight:700">${fmt(data.total)}</td>
            <td style="padding:8px 12px;text-align:right">
              <div style="display:flex;align-items:center;gap:6px;justify-content:flex-end">
                <div style="width:60px;height:6px;background:#f0f0f0;border-radius:3px;overflow:hidden">
                  <div style="height:100%;width:${totalGen > 0 ? (data.total / totalGen * 100).toFixed(1) : 0}%;background:#3b82f6;border-radius:3px"></div>
                </div>
                <span style="font-size:.78rem;color:var(--adm-text-mid)">${totalGen > 0 ? (data.total / totalGen * 100).toFixed(1) : 0}%</span>
              </div>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>`;
    }

    content.innerHTML = html;
  }

  function exportReportPDF() {
    const cfg = getCfg();
    const empresa = cfg.empresa || {};
    const { byDay, byVendedorArr, byProdArr, byCatArr } = buildAutoReports();
    const totalGen = (cfg.sales || []).reduce((a, s) => a + (s.total || 0), 0);

    const w = window.open('', '_blank', 'width=900,height=750');
    if (!w) { toast('Permite ventanas emergentes', 'err'); return; }
    w.document.write(`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
      <title>Reporte — ${esc(empresa.nombre || 'ONNE STORE RD')}</title>
      <style>
        *{margin:0;padding:0;box-sizing:border-box}
        body{font-family:'Helvetica Neue',Arial,sans-serif;padding:30px;color:#111;font-size:12px}
        h1{font-size:1.4rem;font-weight:800;color:#111;margin-bottom:4px}
        h2{font-size:1rem;font-weight:800;color:#C9A96E;margin:24px 0 10px;text-transform:uppercase;letter-spacing:.04em}
        .meta{font-size:.8rem;color:#666;margin-bottom:28px}
        table{width:100%;border-collapse:collapse;margin-bottom:20px}
        thead tr{background:#1C1C1E;color:#fff}
        th{padding:8px 10px;font-size:.78rem;font-weight:600;text-align:left}
        td{padding:7px 10px;font-size:.82rem;border-bottom:1px solid #eee}
        tr:nth-child(even) td{background:#f9f9f9}
        tfoot tr{background:#f0ebe2;border-top:2px solid #C9A96E}
        tfoot td{font-weight:800;font-size:.85rem}
        .right{text-align:right}
        @media print{body{padding:0}@page{size:A4;margin:12mm}}
      </style>
    </head><body>
      <h1>${esc(empresa.nombre || 'ONNE STORE RD')}</h1>
      <div class="meta">Reporte generado el ${fmtDate(today())} a las ${nowTime()}</div>

      <h2>📅 Ventas por Día (últimos 30 días)</h2>
      <table>
        <thead><tr><th>Fecha</th><th class="right">Ventas</th><th class="right">Total</th><th class="right">Ticket Prom.</th></tr></thead>
        <tbody>${byDay.map(d => `<tr><td>${fmtShort(d.day)}</td><td class="right">${d.count}</td><td class="right">${fmt(d.total)}</td><td class="right">${fmt(d.count > 0 ? d.total / d.count : 0)}</td></tr>`).join('')}</tbody>
        <tfoot><tr><td>Total</td><td class="right">${byDay.reduce((a, d) => a + d.count, 0)}</td><td class="right">${fmt(byDay.reduce((a, d) => a + d.total, 0))}</td><td></td></tr></tfoot>
      </table>

      <h2>👤 Ventas por Vendedor</h2>
      <table>
        <thead><tr><th>Vendedor</th><th class="right">Ventas</th><th class="right">Total</th><th class="right">%</th></tr></thead>
        <tbody>${byVendedorArr.map(([n, d]) => `<tr><td>${esc(n)}</td><td class="right">${d.count}</td><td class="right">${fmt(d.total)}</td><td class="right">${totalGen > 0 ? (d.total / totalGen * 100).toFixed(1) : 0}%</td></tr>`).join('')}</tbody>
      </table>

      <h2>📦 Top Productos</h2>
      <table>
        <thead><tr><th>Producto</th><th class="right">Unidades</th><th class="right">Total</th><th class="right">%</th></tr></thead>
        <tbody>${byProdArr.map(([n, d]) => `<tr><td>${esc(n)}</td><td class="right">${d.count}</td><td class="right">${fmt(d.total)}</td><td class="right">${totalGen > 0 ? (d.total / totalGen * 100).toFixed(1) : 0}%</td></tr>`).join('')}</tbody>
      </table>

      <h2>🏷️ Ventas por Categoría</h2>
      <table>
        <thead><tr><th>Categoría</th><th class="right">Ventas</th><th class="right">Total</th><th class="right">%</th></tr></thead>
        <tbody>${byCatArr.map(([n, d]) => `<tr><td>${esc(n)}</td><td class="right">${d.count}</td><td class="right">${fmt(d.total)}</td><td class="right">${totalGen > 0 ? (d.total / totalGen * 100).toFixed(1) : 0}%</td></tr>`).join('')}</tbody>
      </table>
    </body></html>`);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 400);
  }

  /* ════════════════════════════════════════════════════════════
     5. ESTADÍSTICAS SHOPIFY MEJORADAS
        Tendencias mensuales + clientes recurrentes
  ════════════════════════════════════════════════════════════ */

  function renderEnhancedStats() {
    if (isVendedor()) return;

    // Static host already in HTML — just bind refresh button and render
    const existingHost = document.getElementById('v79-stats-host');
    if (existingHost) {
      const refreshBtn = document.getElementById('v79-refresh-stats');
      if (refreshBtn && !refreshBtn._bound) {
        refreshBtn._bound = true;
        refreshBtn.addEventListener('click', () => { _v79RetryCount = 0; refreshStatsCharts(); });
      }
      refreshStatsCharts();
      return;
    }

    // Fallback: legacy dynamic injection
    const chartsHost = document.getElementById('v78-charts-host') || document.getElementById('v79-charts-host');
    if (!chartsHost) return;

    const statsDiv = document.createElement('div');
    statsDiv.id = 'v79-stats-host';
    statsDiv.style.cssText = 'margin-top:14px';
    statsDiv.innerHTML = `
      <div class="admin-card" style="margin-bottom:14px">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
          <div class="admin-card-title" style="margin:0">📈 Tendencias & Análisis</div>
          <button id="v79-refresh-stats" style="background:transparent;border:none;cursor:pointer;font-size:.8rem;color:#888;padding:4px 8px;border-radius:6px">↺ Actualizar</button>
        </div>
        <div id="v79-stats-inner"></div>
      </div>`;
    chartsHost.appendChild(statsDiv);
    document.getElementById('v79-refresh-stats')?.addEventListener('click', () => {
      _v79RetryCount = 0;
      refreshStatsCharts();
    });
    refreshStatsCharts();
  }

  let _v79RetryCount = 0;
  function refreshStatsCharts() {
    const inner = document.getElementById('v79-stats-inner');
    if (!inner) return;

    // Wait for StorageAPI and data — retry up to 10x with 600ms gap
    const cfg = window.StorageAPI ? window.StorageAPI.load() : {};
    const sales = cfg.sales || [];

    if (!sales.length && _v79RetryCount < 10) {
      _v79RetryCount++;
      inner.innerHTML = `<div style="text-align:center;padding:20px;color:#ccc;font-size:.82rem">⏳ Cargando datos de tendencias…</div>`;
      setTimeout(() => refreshStatsCharts(), 650);
      return;
    }
    _v79RetryCount = 0; // reset for next manual refresh

    if (!sales.length) {
      inner.innerHTML = `<div style="text-align:center;padding:20px;color:#bbb;font-size:.84rem">Sin ventas para analizar</div>`;
      return;
    }

    // Monthly trend (last 6 months)
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setDate(1);
      d.setMonth(d.getMonth() - i);
      const key = d.toISOString().slice(0, 7);
      const label = d.toLocaleDateString('es-DO', { month: 'short', year: '2-digit' });
      const monthSales = sales.filter(s => (s.date || '').startsWith(key));
      months.push({
        key, label,
        total: monthSales.reduce((a, s) => a + (s.total || 0), 0),
        count: monthSales.length
      });
    }

    // Recurring customers
    const custMap = {};
    sales.forEach(s => {
      const key = s.customerId || s.customerName;
      if (key && key !== 'Cliente General' && key !== 'General') {
        custMap[key] = (custMap[key] || 0) + 1;
      }
    });
    const recurring = Object.entries(custMap)
      .filter(([, c]) => c > 1)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // Today stats
    const todayStr = today();
    const monthStart = todayStr.slice(0, 8) + '01';
    const totalHoy = sales.filter(s => s.date === todayStr).reduce((a, s) => a + (s.total || 0), 0);
    const totalMes = sales.filter(s => s.date >= monthStart).reduce((a, s) => a + (s.total || 0), 0);
    const totalGen = sales.reduce((a, s) => a + (s.total || 0), 0);
    const avgTicket = sales.length ? totalGen / sales.length : 0;
    const uniqueClients = new Set(sales.map(s => s.customerId || s.customerName).filter(Boolean)).size;
    const countHoy = sales.filter(s => s.date === todayStr).length;

    inner.innerHTML = `
      <!-- KPIs Row -->
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px;margin-bottom:16px">
        ${[
          { v: fmt(totalHoy), l: 'Hoy', c: '#C9A96E', icon: '💰' },
          { v: fmt(totalMes), l: 'Este mes', c: '#3b82f6', icon: '📅' },
          { v: String(countHoy), l: 'Ventas hoy', c: '#10b981', icon: '🧾' },
          { v: fmt(avgTicket), l: 'Ticket prom.', c: '#8b5cf6', icon: '🎫' },
          { v: String(uniqueClients), l: 'Clientes únicos', c: '#f59e0b', icon: '👥' },
          { v: String(sales.length), l: 'Total ventas', c: '#64748b', icon: '📊' }
        ].map(k => `
          <div style="background:rgba(${hexToRgb(k.c)},.07);border:1px solid rgba(${hexToRgb(k.c)},.2);border-radius:11px;padding:13px 10px;text-align:center">
            <div style="font-size:.85rem">${k.icon}</div>
            <div style="font-size:1.2rem;font-weight:900;color:${k.c};margin-top:2px">${k.v}</div>
            <div style="font-size:.68rem;color:#888;margin-top:2px">${k.l}</div>
          </div>`).join('')}
      </div>

      <!-- Trend + Customers grid -->
      <div style="display:grid;grid-template-columns:3fr 2fr;gap:12px">
        <!-- Monthly bar chart -->
        <div>
          <div style="font-size:.78rem;font-weight:700;color:#666;margin-bottom:8px">📈 Tendencia mensual (6 meses)</div>
          <canvas id="v79-month-chart" height="100" style="width:100%;display:block"></canvas>
          <div style="display:flex;justify-content:space-around;margin-top:4px">
            ${months.map(m => `<span style="font-size:.64rem;color:#999">${m.label}</span>`).join('')}
          </div>
        </div>
        <!-- Recurring customers -->
        <div>
          <div style="font-size:.78rem;font-weight:700;color:#666;margin-bottom:8px">🔄 Clientes recurrentes</div>
          ${recurring.length
            ? recurring.map(([name, count], i) => {
                const colors = ['#C9A96E', '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b'];
                const cfg2 = getCfg();
                const clientSales = (cfg2.sales || []).filter(s => (s.customerId || s.customerName) === name);
                const clientTotal = clientSales.reduce((a, s) => a + (s.total || 0), 0);
                return `<div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid rgba(0,0,0,.06)">
                  <div style="width:28px;height:28px;background:rgba(${hexToRgb(colors[i])},.12);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.75rem;font-weight:800;color:${colors[i]};flex-shrink:0">${i + 1}</div>
                  <div style="min-width:0;flex:1">
                    <div style="font-size:.78rem;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(name)}</div>
                    <div style="font-size:.68rem;color:#888">${count} compras · ${fmt(clientTotal)}</div>
                  </div>
                </div>`;
              }).join('')
            : '<div style="font-size:.78rem;color:#bbb;text-align:center;padding:16px">Sin clientes recurrentes aún</div>'
          }
        </div>
      </div>`;

    // Draw monthly chart
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const canvas = document.getElementById('v79-month-chart');
      if (!canvas || !canvas.getContext) return;
      const ctx = canvas.getContext('2d');
      const W = canvas.offsetWidth || canvas.parentElement?.offsetWidth || 400;
      const H = 100;
      canvas.width = W;
      canvas.height = H;

      const maxVal = Math.max(...months.map(m => m.total), 1);
      const barW = Math.floor((W - 20) / months.length) - 4;
      const padL = 10, padT = 10, padB = 5;
      const chartH = H - padT - padB;

      ctx.clearRect(0, 0, W, H);
      // Grid line
      ctx.strokeStyle = 'rgba(0,0,0,.05)';
      ctx.lineWidth = 1;
      [0.5, 1].forEach(f => {
        const y = padT + chartH * (1 - f);
        ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(W - 10, y); ctx.stroke();
      });

      const currentMonth = today().slice(0, 7);
      months.forEach((m, i) => {
        const h = Math.max(2, (m.total / maxVal) * chartH);
        const x = padL + i * (barW + 4);
        const y = padT + chartH - h;
        const isCurrent = m.key === currentMonth;

        const grad = ctx.createLinearGradient(x, y, x, y + h);
        if (isCurrent) { grad.addColorStop(0, '#C9A96E'); grad.addColorStop(1, '#a0844a'); }
        else { grad.addColorStop(0, '#6DBF8A'); grad.addColorStop(1, '#4a9e6a'); }

        ctx.fillStyle = grad;
        const r = 3;
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + barW - r, y);
        ctx.quadraticCurveTo(x + barW, y, x + barW, y + r);
        ctx.lineTo(x + barW, y + h);
        ctx.lineTo(x, y + h);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
        ctx.fill();
      });
    }));
  }

  /* ════════════════════════════════════════════════════════════
     6. FIX: PRODUCTOS POR FILA — HOME ONLY (triple protección)
  ════════════════════════════════════════════════════════════ */

  function applyHomeProductsPerRow(cfg) {
    ['dynamic-grid-style-v75','dynamic-grid-style'].forEach(id=>{const e=document.getElementById(id);if(e)e.remove();});
  }

  /* ════════════════════════════════════════════════════════════
     7. INJECT V79 STYLES
  ════════════════════════════════════════════════════════════ */

  function injectV79Styles() {
    if (document.getElementById('v79-styles')) return;
    const style = document.createElement('style');
    style.id = 'v79-styles';
    style.textContent = `
      /* Report tab buttons */
      .v79-rpt-tab {
        padding:6px 12px;background:var(--adm-bg,#f5f5f7);
        border:1.5px solid var(--adm-border-c,rgba(0,0,0,.12));
        border-radius:7px;font-size:.77rem;font-weight:700;cursor:pointer;
        color:var(--adm-text,#1e1e1e);transition:all .15s;
      }
      .v79-rpt-tab:hover { border-color:#C9A96E; }
      .v79-rpt-tab.active {
        background:#C9A96E;border-color:#C9A96E;color:#fff;
      }

      /* Vendor KPI grid responsive */
      @media (max-width: 600px) {
        .v79-kpi-grid { grid-template-columns: 1fr 1fr !important; }
      }
      @media (max-width: 380px) {
        .v79-kpi-grid { grid-template-columns: 1fr !important; }
      }

      /* Stats charts responsive */
      #v79-stats-inner > div:last-child {
        grid-template-columns: 1fr !important;
      }
      @media (min-width: 640px) {
        #v79-stats-inner > div:last-child {
          grid-template-columns: 3fr 2fr !important;
        }
      }

      /* Smooth card hover */
      .admin-card { transition: box-shadow .18s; }
      .admin-card:hover { box-shadow: 0 4px 24px rgba(0,0,0,.08); }

      /* Sale popup */
      #v79-sale-popup[style*="flex"] { display: flex !important; }
    `;
    document.head.appendChild(style);
  }

  function injectV79ReportStyles() {
    // Report styles injected when report tab is loaded
  }

  /* ════════════════════════════════════════════════════════════
     8. HOOK VENDEDOR DASHBOARD — binding robusto con MutationObserver
  ════════════════════════════════════════════════════════════ */

  function hookVendedorDashboard() {
    if (!isVendedor()) return;
    const dashView = document.getElementById('view-dashboard');
    if (!dashView) return;

    // Render immediately if dashboard is visible
    if (dashView.style.display !== 'none') {
      renderVendedorDashboard();
    }

    // Observe style changes to catch when dashboard becomes visible
    const observer = new MutationObserver(() => {
      if (dashView.style.display !== 'none' && !dashView.querySelector('#vendor-dashboard')) {
        renderVendedorDashboard();
      }
    });
    observer.observe(dashView, { attributes: true, attributeFilter: ['style'] });

    // Also hook nav click
    document.addEventListener('click', e => {
      const link = e.target.closest('[data-view="dashboard"]');
      if (link && isVendedor()) {
        setTimeout(() => renderVendedorDashboard(), 150);
      }
    });
  }

  /* ════════════════════════════════════════════════════════════
     9. HOOK OnneBus — captura sale:created para popup y dashboard
  ════════════════════════════════════════════════════════════ */

  function hookOnneBus() {
    const maxWait = 6000, step = 200;
    let waited = 0;
    const interval = setInterval(() => {
      waited += step;
      if (window.OnneBus) {
        clearInterval(interval);
        window.OnneBus.on('sale:created', (sale) => {
          // Enrich sale with vendedor info
          const cfg = getCfg();
          const s = (cfg.sales || []).find(x => x.id === sale.id);
          if (s && !s.vendedorNombre) {
            s.vendedorNombre = getUserName();
            s.vendedorId = getUserId();
            saveCfg(cfg);
          }
          // Show v79 popup (override v77/v78 if possible)
          setTimeout(() => showSalePopup(s || sale), 300);
          // Refresh vendedor dashboard
          if (isVendedor()) {
            setTimeout(() => renderVendedorDashboard(), 500);
          }
        });
      }
      if (waited >= maxWait) clearInterval(interval);
    }, step);
  }

  /* ════════════════════════════════════════════════════════════
     10. REPORTES — hook cuando se abre la sección
  ════════════════════════════════════════════════════════════ */

  function hookReportesSection() {
    if (!isAdmin()) return;
    document.addEventListener('click', e => {
      const link = e.target.closest('[data-view="reportes"]');
      if (link) setTimeout(() => renderReportesPanel(), 350);
    });
  }

  function hookDashboardStats() {
    if (isVendedor()) return;
    document.addEventListener('click', e => {
      const link = e.target.closest('[data-view="dashboard"]');
      if (link) setTimeout(() => renderEnhancedStats(), 300);
    });
    // Also render on initial load if dashboard is active
    const dashView = document.getElementById('view-dashboard');
    if (dashView && dashView.style.display !== 'none') {
      setTimeout(() => renderEnhancedStats(), 800);
    }
  }

  /* ════════════════════════════════════════════════════════════
     INIT
  ════════════════════════════════════════════════════════════ */

  function init() {
    injectV79Styles();
    ensureSalePopup();

    // Fix: productos por fila HOME ONLY
    if (document.getElementById('home-new-grid')) {
      const cfg = getCfg();
      applyHomeProductsPerRow(cfg);
    }

    // Admin panel
    if (document.getElementById('view-dashboard')) {
      setTimeout(() => {
        applyRoleBasedUI();
        hookVendedorDashboard();
        hookOnneBus();
        hookReportesSection();
        hookDashboardStats();

        // If reportes view is active, render now
        const rpView = document.getElementById('view-reportes');
        if (rpView && rpView.style.display !== 'none') renderReportesPanel();

        // If dashboard active & admin, render stats
        const dashView = document.getElementById('view-dashboard');
        if (dashView && dashView.style.display !== 'none' && !isVendedor()) {
          setTimeout(() => renderEnhancedStats(), 600);
        }
      }, 700);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 100);
  }

  /* ── Public API ── */
  window.V79 = {
    renderVendedorDashboard,
    applyRoleBasedUI,
    showSalePopup,
    buildAutoReports,
    renderReportesPanel,
    exportReportPDF,
    renderEnhancedStats,
    refreshStatsCharts,
    applyHomeProductsPerRow,
    _retryReset: () => { _v79RetryCount = 0; }
  };

})();

/* ═══ v86-core.js ════════════════════════════════════════════════════════════════════ */
/*!
 * ONNE STORE RD — v86 Core Fixes
 * ═══════════════════════════════════════════════════════════════
 * FIX 1: PRINT — Sale ID missing in popup → print fails silently
 * FIX 2: VENDOR TRACKING — Sales stamped with vendedor ID/name/user
 * FIX 3: VENDOR VISIBILITY — Vendedores see only their own sales
 * FIX 4: PRODUCTS PER ROW — Works in admin + index, card sizing
 * ═══════════════════════════════════════════════════════════════
 */
(function(){
'use strict';

const $=(s,c)=>(c||document).querySelector(s);
const $$=(s,c)=>Array.from((c||document).querySelectorAll(s));
const getCfg=()=>window.StorageAPI?window.StorageAPI.load():(window.__adminCfg||{});
const saveCfg=c=>{if(window.StorageAPI)window.StorageAPI.save(c);window.__adminCfg=c;};
const esc=s=>s==null?'':String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=n=>'RD$'+Number(n||0).toLocaleString('es-DO',{minimumFractionDigits:0,maximumFractionDigits:0});
const today=()=>new Date().toISOString().slice(0,10);
const toast=(m,t)=>{if(window.toast)window.toast(m,t||'info');};

function getSession(){try{return JSON.parse(localStorage.getItem('adminSession')||'{}')}catch{return{}}}
function getCurrentUser(){return getSession().user||{rol:'admin',nombre:'Administrador',id:'admin_master',email:'admin@onnestore.rd'}}
function getRole(){return getCurrentUser().rol||'admin'}
function getUserId(){return getCurrentUser().id||getCurrentUser().email||'admin_master'}
function getUserName(){return getCurrentUser().nombre||'Usuario'}
function getUserEmail(){return getCurrentUser().email||''}
function isAdmin(){return getRole()==='admin'}
function isManager(){return getRole()==='manager'}
function isVendedor(){return getRole()==='vendedor'}

/* ═══════════════════════════════════════════════════════════
   FIX 1: PRINT — Root cause: enrichedSale emitted via OnneBus
   does NOT have an `id` field (id is created inside registerSale).
   Solution: Patch registerSale to RETURN the sale with id, and
   patch the OnneBus emit to use the sale WITH the id.
   Also: rebuild the popup to be fully self-contained.
   ═══════════════════════════════════════════════════════════ */

function fixPrintSystem(){
  // Intercept the sale:created event to ensure the popup gets the correct sale ID
  // The problem: registerSale creates sale.id but OnneBus emits the pre-id saleData
  // Solution: After OnneBus emits, find the ACTUAL sale in cfg.sales (newest first)

  if(!window.OnneBus)return;

  // Replace ALL sale:created handlers with our fixed one
  const existing=window.OnneBus._handlers?.['sale:created']||[];
  // Keep dashboard/analytics refresh handlers
  const keepHandlers=existing.filter(fn=>{
    const s=fn.toString();
    return s.includes('renderSaaSDashboard')||s.includes('refreshAnalytics')||
           s.includes('refreshCustomers')||s.includes('v83CajaRefresh')||
           s.includes('v85')||s.includes('v84');
  });

  let _cooldown=false;
  window.OnneBus._handlers['sale:created']=[
    ...keepHandlers,
    function v86SaleCreatedHandler(saleData){
      if(_cooldown)return;
      _cooldown=true;
      setTimeout(()=>{_cooldown=false;},800);

      // Find the REAL sale with ID from cfg.sales (the newest one matching this data)
      const cfg=getCfg();
      const realSale=(cfg.sales||[]).find(s=>
        s.productId===saleData.productId &&
        s.total===saleData.total &&
        s.date===(saleData.date||today())
      )||(cfg.sales||[])[0]; // fallback to newest sale

      if(!realSale||!realSale.id){
        console.warn('v86: Could not find sale with ID');
        return;
      }

      // Show the popup with the REAL sale (has id)
      setTimeout(()=>showPrintPopup(realSale),200);

      // Refresh vendedor dashboard
      if(isVendedor()&&window.renderVendedorDashboard)
        setTimeout(()=>window.renderVendedorDashboard(),400);
    }
  ];
}

/** Create and show the print popup with guaranteed working buttons */
function showPrintPopup(sale){
  // Remove any existing popups
  ['v81-sale-popup','v79-sale-popup','v80-sale-popup','v86-sale-popup'].forEach(id=>{
    const el=document.getElementById(id);
    if(el)el.style.display='none';
  });

  let popup=document.getElementById('v86-sale-popup');
  if(!popup){
    popup=document.createElement('div');
    popup.id='v86-sale-popup';
    popup.style.cssText='position:fixed;inset:0;z-index:99999;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.6);backdrop-filter:blur(4px)';
    popup.innerHTML=`
      <div style="background:var(--adm-card-bg,#fff);border-radius:20px;padding:28px 26px 22px;width:400px;max-width:calc(100vw - 32px);box-shadow:0 32px 80px rgba(0,0,0,.25);text-align:center">
        <div style="font-size:3rem;margin-bottom:8px">✅</div>
        <div style="font-size:1.1rem;font-weight:900;color:var(--adm-text,#1e1e1e);margin-bottom:5px">¡Venta registrada!</div>
        <div id="v86-popup-info" style="font-size:.83rem;color:var(--adm-text-mid,#6E6E73);margin-bottom:18px"></div>
        <div style="margin-bottom:14px">
          <label style="font-size:.72rem;font-weight:800;letter-spacing:.07em;text-transform:uppercase;color:var(--adm-text-mid,#6E6E73);display:block;margin-bottom:6px">Tamaño de impresión</label>
          <select id="v86-popup-size" style="width:100%;padding:10px 14px;border:1.5px solid var(--adm-border-c,rgba(0,0,0,.12));border-radius:10px;font-family:inherit;font-size:.86rem;background:var(--adm-card-bg,#fff);color:var(--adm-text,#1e1e1e);cursor:pointer;outline:none">
            <option value="ticket">🧾 Ticket POS (80mm)</option>
            <option value="a5">📄 A5 (148×210mm)</option>
            <option value="a4" selected>📃 A4 — Recomendado</option>
            <option value="media">📋 Media hoja</option>
          </select>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px">
          <button id="v86-popup-print" style="padding:13px 8px;background:#1C1C1E;color:#fff;border:none;border-radius:12px;font-size:.88rem;font-weight:700;cursor:pointer;transition:opacity .15s">🖨️ Imprimir</button>
          <button id="v86-popup-pdf" style="padding:13px 8px;background:#C9A96E;color:#fff;border:none;border-radius:12px;font-size:.88rem;font-weight:700;cursor:pointer;transition:opacity .15s">📄 Guardar PDF</button>
        </div>
        <button id="v86-popup-close" style="width:100%;padding:10px;background:transparent;border:1.5px solid var(--adm-border-c,rgba(0,0,0,.12));border-radius:10px;font-size:.83rem;cursor:pointer;color:var(--adm-text-mid,#6E6E73)">Cerrar sin imprimir</button>
      </div>`;
    document.body.appendChild(popup);

    // Event delegation — clicks handled here
    popup.addEventListener('click',function(e){
      const sid=popup.dataset.saleId;
      const size=$('#v86-popup-size')?.value||'a4';
      if(e.target.id==='v86-popup-print'||e.target.closest('#v86-popup-print')){
        popup.style.display='none';
        if(sid)doPrint(sid,size,false);
      }else if(e.target.id==='v86-popup-pdf'||e.target.closest('#v86-popup-pdf')){
        popup.style.display='none';
        if(sid)doPrint(sid,size,true);
      }else if(e.target.id==='v86-popup-close'||e.target===popup){
        popup.style.display='none';
      }
    });
  }

  // Set sale data
  popup.dataset.saleId=sale.id;
  const info=$('#v86-popup-info');
  if(info){
    const parts=[sale.numeroFactura||'',fmt(sale.total||0),sale.customerName||'Cliente general'];
    if(sale.vendedorNombre)parts.push('Vendedor: '+sale.vendedorNombre);
    info.textContent=parts.filter(Boolean).join(' · ');
  }
  popup.style.display='flex';
}

/** Print/PDF function — standalone, doesn't depend on v81 */
function doPrint(saleId,size,asPDF){
  const cfg=getCfg();
  const sale=(cfg.sales||[]).find(s=>s.id===saleId);
  if(!sale){toast('Venta no encontrada','err');return;}
  const empresa=cfg.empresa||{};

  // Try v81/v78 print if available
  if(window.v81PrintFactura){
    window.v81PrintFactura(saleId,size,asPDF);
    return;
  }

  // Fallback: build our own invoice
  const sizeMap={
    ticket:{maxW:'302px',fs:'10px',page:'@page{size:80mm auto;margin:4mm}'},
    a5:{maxW:'559px',fs:'11px',page:'@page{size:A5;margin:10mm}'},
    a4:{maxW:'793px',fs:'12px',page:'@page{size:A4;margin:12mm}'},
    media:{maxW:'793px',fs:'11px',page:'@page{size:A4;margin:12mm}'}
  };
  const o=sizeMap[size]||sizeMap.a4;
  const items=sale.items?.length?sale.items:[{name:sale.productName||'—',quantity:sale.quantity||1,appliedPrice:sale.appliedPrice||0}];
  const subtotal=sale.subtotal||sale.total||0;
  const itbis=sale.itbis||0;
  const total=sale.total||0;

  const w=window.open('','_blank',`width=${parseInt(o.maxW)+60},height=780`);
  if(!w){toast('Permite ventanas emergentes','warn');return;}

  w.document.write(`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>${esc(sale.numeroFactura||'Factura')}</title>
  <style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;background:#fff;color:#111;padding:24px;max-width:${o.maxW};margin:0 auto;font-size:${o.fs}}
  .hdr{display:flex;justify-content:space-between;margin-bottom:20px;padding-bottom:14px;border-bottom:2.5px solid #C9A96E;gap:20px}
  .ename{font-size:1.3em;font-weight:800}.edetail{font-size:.82em;color:#555;margin-top:3px}.meta{text-align:right}.fnum{font-size:1.05em;font-weight:800;color:#C9A96E}
  .fdate{font-size:.8em;color:#555;margin-top:3px}.cbox{background:#f8f8f8;border-radius:8px;padding:12px 16px;margin-bottom:16px}
  .clbl{font-size:.63em;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#999;margin-bottom:5px}.cname{font-size:.97em;font-weight:700}
  table{width:100%;border-collapse:collapse;margin-bottom:14px}thead tr{background:#1C1C1E;color:#fff}th{padding:9px 10px;font-size:.8em;font-weight:600}
  tbody tr:nth-child(even){background:#f9f9f9}td{padding:8px 10px;font-size:.87em;border-bottom:1px solid #eee}
  .totals{margin-left:auto;width:260px}.trow{display:flex;justify-content:space-between;padding:5px 0;font-size:.88em;border-bottom:1px solid #eee}
  .grand{font-size:1.12em;font-weight:800;border-bottom:2.5px solid #C9A96E;padding-top:8px;margin-top:3px}
  .footer{margin-top:24px;text-align:center;font-size:.76em;color:#aaa;padding-top:12px;border-top:1px solid #eee}
  ${o.page}@media print{body{padding:0}.no-print{display:none}}</style></head><body>
  ${asPDF?'<div class="no-print" style="background:#1C1C1E;color:#fff;padding:10px 16px;font-size:13px;display:flex;align-items:center;gap:12px;margin-bottom:12px;border-radius:0 0 8px 8px"><span>📄</span><span><strong>Para PDF:</strong> Destino → "Guardar como PDF"</span></div>':''}
  <div class="hdr"><div><div class="ename">${esc(empresa.nombre||'ONNE STORE RD')}</div>
  ${empresa.rnc?`<div class="edetail">RNC: ${esc(empresa.rnc)}</div>`:''}
  ${empresa.direccion?`<div class="edetail">📍 ${esc(empresa.direccion)}</div>`:''}
  ${empresa.telefono?`<div class="edetail">📞 ${esc(empresa.telefono)}</div>`:''}</div>
  <div class="meta"><div class="fnum">${esc(sale.numeroFactura||'FAC-????')}</div>
  <div class="fdate">Fecha: ${esc(sale.date||'')}</div>
  <div class="fdate">Pago: <strong>${esc((sale.metodoPago||'efectivo').toUpperCase())}</strong></div>
  ${sale.vendedorNombre?`<div class="fdate">Vendedor: ${esc(sale.vendedorNombre)}</div>`:''}
  ${sale.vendedorId?`<div class="fdate" style="font-size:.7em;color:#aaa">ID: ${esc(sale.vendedorId)}</div>`:''}</div></div>
  <div class="cbox"><div class="clbl">Cliente</div><div class="cname">${esc(sale.customerName||'Cliente General')}</div>
  ${sale.customerPhone?`<div class="edetail">📱 ${esc(sale.customerPhone)}</div>`:''}
  ${sale.customerEmail?`<div class="edetail">✉️ ${esc(sale.customerEmail)}</div>`:''}</div>
  <table><thead><tr><th style="text-align:left">Descripción</th><th style="text-align:center">Cant.</th><th style="text-align:right">P. Unit.</th><th style="text-align:right">Total</th></tr></thead>
  <tbody>${items.map(it=>{const p=it.price||it.appliedPrice||0;const q=it.qty||it.quantity||1;
    return`<tr><td>${esc(it.name||it.productName||'—')}</td><td style="text-align:center">${q}</td><td style="text-align:right">${fmt(p)}</td><td style="text-align:right;font-weight:700">${fmt(p*q)}</td></tr>`;
  }).join('')}</tbody></table>
  <div class="totals"><div class="trow"><span>Subtotal</span><span>${fmt(subtotal)}</span></div>
  ${itbis>0?`<div class="trow"><span>ITBIS (18%)</span><span>${fmt(itbis)}</span></div>`:''}
  <div class="trow grand"><span>TOTAL</span><span>${fmt(total)}</span></div></div>
  <div class="footer">${esc(empresa.nombre||'ONNE STORE RD')} · Gracias por su compra</div>
  </body></html>`);
  w.document.close();w.focus();
  setTimeout(()=>{try{w.print();}catch(_){}},400);
}

// Expose globally as fallbacks
window.v86PrintFactura=doPrint;
window.downloadFacturaPDF=window.downloadFacturaPDF||(function(id,sz){doPrint(id,sz||'a4',true);});

/* ═══════════════════════════════════════════════════════════
   FIX 2: VENDOR TRACKING — Stamp every sale with vendor info
   Patch registerSale to include vendedor fields.
   Also patch existing sales retroactively.
   ═══════════════════════════════════════════════════════════ */

function fixVendorTracking(){
  // 1. Patch the form submit to inject vendor fields BEFORE registerSale
  const form=document.getElementById('vta-register-form');
  if(form&&!form._v86){
    form._v86=true;
    form.addEventListener('submit',function(){
      // This runs BEFORE admin-ventas-inventario.js's handler
      // We can't modify saleData directly, but we can patch registerSale
    },true); // capture phase
  }

  // 2. Override registerSale to always stamp vendor info
  // We need to monkey-patch admin-ventas-inventario's registerSale
  // Since it's in an IIFE, we patch the OnneBus emit and the save
  patchSaleCreation();

  // 3. Fix existing sales that lack vendor info
  enrichExistingSales();
}

function patchSaleCreation(){
  // Intercept saveCfg calls to stamp vendor info on newest sale
  const origSave=window.StorageAPI?.save;
  if(!origSave||origSave._v86)return;

  const wrappedSave=function(cfg){
    // Check if a new sale was just added (it would be at index 0)
    if(cfg.sales?.length){
      const newest=cfg.sales[0];
      // If this sale has no vendedorId, stamp it now
      if(newest&&newest.createdAt&&!newest.vendedorId){
        const timeDiff=Date.now()-new Date(newest.createdAt).getTime();
        if(timeDiff<5000){ // Only stamp if created in last 5 seconds
          const user=getCurrentUser();
          newest.vendedorId=user.id||'admin_master';
          newest.vendedorNombre=user.nombre||'Administrador';
          newest.vendedorEmail=user.email||'';
          newest.vendedorUsuario=user.email||user.nombre||'admin';
        }
      }
    }
    return origSave.call(window.StorageAPI,cfg);
  };
  wrappedSave._v86=true;
  window.StorageAPI.save=wrappedSave;
}

function enrichExistingSales(){
  const cfg=getCfg();
  const sales=cfg.sales||[];
  const usuarios=cfg.usuarios||[];
  let changed=false;

  sales.forEach(s=>{
    // If sale has no vendor info at all, try to resolve
    if(!s.vendedorId&&!s.vendedorNombre){
      s.vendedorId='admin_master';
      s.vendedorNombre='Administrador';
      s.vendedorEmail='admin@onnestore.rd';
      s.vendedorUsuario='admin';
      changed=true;
    }
    // If has vendedorId but no name, resolve from usuarios
    if(s.vendedorId&&(!s.vendedorNombre||s.vendedorNombre==='Sin asignar')){
      const u=usuarios.find(x=>x.id===s.vendedorId);
      if(u){
        s.vendedorNombre=u.nombre||u.email||s.vendedorId;
        s.vendedorEmail=u.email||'';
        s.vendedorUsuario=u.email||u.nombre||'';
        changed=true;
      }
    }
    // Ensure vendedorUsuario field exists
    if(s.vendedorId&&!s.vendedorUsuario){
      const u=usuarios.find(x=>x.id===s.vendedorId);
      s.vendedorUsuario=u?.email||s.vendedorEmail||s.vendedorNombre||'';
      changed=true;
    }
  });

  if(changed)saveCfg(cfg);
}

/* ═══════════════════════════════════════════════════════════
   FIX 3: VENDOR VISIBILITY — Vendedores see only their sales
   Patch the sales history table rendering to filter by vendor
   ═══════════════════════════════════════════════════════════ */

function fixVendorVisibility(){
  if(!isVendedor())return;

  // Filter sales table after it renders
  const observer=new MutationObserver(()=>{
    filterSalesTable();
  });

  const historyHost=document.getElementById('vta-history-table');
  if(historyHost){
    observer.observe(historyHost,{childList:true,subtree:true});
  }

  // Also filter on view switch
  document.addEventListener('click',e=>{
    const link=e.target.closest('[data-view="ventas"]');
    if(link)setTimeout(filterSalesTable,300);
  });
}

function filterSalesTable(){
  if(!isVendedor())return;
  const userId=getUserId();
  const host=document.getElementById('vta-history-table');
  if(!host)return;

  // Find the table inside the history host
  const rows=host.querySelectorAll('tr[data-sale-id], .vta-sale-row, tbody tr');
  if(!rows.length)return;

  const cfg=getCfg();
  const mySales=new Set((cfg.sales||[]).filter(s=>s.vendedorId===userId).map(s=>s.id));

  // Filter KPIs for vendedor
  const mySalesArr=(cfg.sales||[]).filter(s=>s.vendedorId===userId);
  const todayStr=today();
  const myToday=mySalesArr.filter(s=>s.date===todayStr);

  const kpis={
    'vta-kpi-total':mySalesArr.length,
    'vta-kpi-revenue':fmt(mySalesArr.reduce((a,s)=>a+(s.total||0),0)),
    'vta-kpi-today':myToday.length,
    'vta-kpi-today-rev':fmt(myToday.reduce((a,s)=>a+(s.total||0),0))
  };
  Object.entries(kpis).forEach(([id,val])=>{
    const el=document.getElementById(id);
    if(el)el.textContent=val;
  });
}

/* ═══════════════════════════════════════════════════════════
   FIX 4: PRODUCTS PER ROW — Make it work in both admin & index
   ═══════════════════════════════════════════════════════════ */

function fixProductsPerRow(){
  // For admin page: ensure saveProductsPerRow works properly
  window.saveProductsPerRow=function(val){
    const cfg=getCfg();
    const n=Math.max(2,Math.min(6,Number(val)||5));
    cfg.homeProductsPerRow=n;
    saveCfg(cfg);
    toast('✅ '+n+' productos por fila','ok');

    // Remove ALL previous PPR styles
    ['dynamic-grid-style','v82-ppr-style','v83-ppr-style','v84-ppr','v85-ppr','v86-ppr'].forEach(id=>{
      const e=document.getElementById(id);if(e)e.remove();
    });

    // Inject new style (admin page - for preview iframe)
    injectPPRStyle(n);

    // Refresh preview iframe
    const pv=document.getElementById('preview');
    if(pv)pv.src='index.html?t='+Date.now();
  };

  // Apply on admin page load
  const cfg=getCfg();
  if(cfg.homeProductsPerRow){
    const n=Number(cfg.homeProductsPerRow);
    injectPPRStyle(n);
  }

  // FOR INDEX PAGE: also apply if we're on the index
  applyPPRToIndex();
}

function injectPPRStyle(n){['v86-ppr','dynamic-grid-style'].forEach(id=>{const e=document.getElementById(id);if(e)e.remove();});}
function applyPPRToIndex(){}

/* ═══════════════════════════════════════════════════════════
   SALE DETAIL: Show vendor info in description
   ═══════════════════════════════════════════════════════════ */

function patchSaleDetailVendorInfo(){
  // Observe the vta-detail-modal for changes and inject vendor info
  const observer=new MutationObserver(()=>{
    const modal=document.getElementById('vta-detail-modal');
    if(!modal||modal.style.display==='none')return;

    // Check if vendor info is already injected
    if(modal.querySelector('.v86-vendor-info'))return;

    const saleId=modal._currentSaleId||modal.dataset.saleId;
    if(!saleId)return;

    const cfg=getCfg();
    const sale=(cfg.sales||[]).find(s=>s.id===saleId);
    if(!sale)return;

    // Find a good place to inject — after the first info section
    const target=modal.querySelector('.admin-card')||modal.querySelector('[style*="padding"]');
    if(!target)return;

    // Only inject if sale has vendor info
    if(sale.vendedorNombre||sale.vendedorId){
      const div=document.createElement('div');
      div.className='v86-vendor-info';
      div.style.cssText='margin-top:12px;padding:10px 14px;background:var(--adm-bg,#f5f5f7);border-radius:10px;font-size:.82rem';
      div.innerHTML=`
        <div style="font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--adm-text-mid);margin-bottom:4px">👤 Vendedor</div>
        <div style="font-weight:700;color:var(--adm-text,#1e1e1e)">${esc(sale.vendedorNombre||'—')}</div>
        ${sale.vendedorId?`<div style="font-size:.74rem;color:var(--adm-text-mid);font-family:monospace">ID: ${esc(sale.vendedorId)}</div>`:''}
        ${sale.vendedorUsuario||sale.vendedorEmail?`<div style="font-size:.74rem;color:var(--adm-text-mid)">Usuario: ${esc(sale.vendedorUsuario||sale.vendedorEmail||'')}</div>`:''}
      `;
      target.appendChild(div);
    }
  });
  observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['style','class']});
}

/* ═══════════════════════════════════════════════════════════
   INIT
   ═══════════════════════════════════════════════════════════ */

function init(){
  // Products per row (works on both admin and index)
  fixProductsPerRow();

  // Admin-only features
  if(!document.getElementById('view-dashboard'))return;

  fixVendorTracking();
  fixVendorVisibility();
  patchSaleDetailVendorInfo();

  // Print fix — wait for OnneBus to be ready
  setTimeout(fixPrintSystem,1200);
}

if(document.readyState==='loading')
  document.addEventListener('DOMContentLoaded',()=>setTimeout(init,400));
else
  setTimeout(init,400);

window.V86={doPrint,showPrintPopup,enrichExistingSales,filterSalesTable,injectPPRStyle};
})();

/* ═══ v87-core.js ════════════════════════════════════════════════════════════════════ */
/*!
 * ONNE STORE RD — v87
 * 1. HOME: Exactly 5 cards visible, calc-based sizing, clip overflow
 * 2. VENDOR: Codes, table, stamping, detail
 * 3. DASHBOARD: Debounce
 * 4. RECURRING: Name fix
 * 5. SALES: Vendor visibility + column
 * 6. REFRESH: Rewritten cleanly
 */
(function(){
'use strict';

const getCfg=()=>window.StorageAPI?window.StorageAPI.load():(window.__adminCfg||{});
const saveCfg=c=>{if(window.StorageAPI)window.StorageAPI.save(c);window.__adminCfg=c;};
const esc=s=>s==null?'':String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=n=>'RD$'+Number(n||0).toLocaleString('es-DO',{minimumFractionDigits:0});
const today=()=>new Date().toISOString().slice(0,10);
const toast=(m,t)=>{if(window.toast)window.toast(m,t||'info');};
const h2r=h=>{h=(h||'#888').replace('#','');return[parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)].join(',');};

function getSession(){try{return JSON.parse(localStorage.getItem('adminSession')||'{}')}catch{return{}}}
function getUser(){return getSession().user||{rol:'admin',nombre:'Administrador',id:'admin_master',email:'admin@onnestore.rd'}}
function getRole(){return getUser().rol||'admin'}
function getUserId(){return getUser().id||'admin_master'}
function isAdmin(){return getRole()==='admin'}
function canSeeAll(){return getRole()==='admin'||getRole()==='manager'}


/* ═══════════════════════════════════
   1. HOME CAROUSEL
   Math: container inner = 1332px max (1380 - 48 padding)
   5 cards + 4 gaps(18px) = 72px gap total
   card = calc((100% - 72px) / 5) ≈ 252px at max width
   ═══════════════════════════════════ */

function cleanOld(){
  ['dynamic-grid-style','dynamic-grid-style-v75','v82-ppr-style',
   'v83-ppr-style','v84-ppr','v85-ppr','v86-ppr','v87-home-grid','v87-carousel','v87-home'].forEach(id=>{
    const e=document.getElementById(id);if(e)e.remove();
  });
}

function injectHome(){
  if(document.getElementById('v87-h'))return;
  const s=document.createElement('style');
  s.id='v87-h';
  s.textContent=`
/* Shell clips overflow — no partial cards visible */
.carousel-shell{overflow:hidden}

/* Reset track horizontal padding so calc is exact */
#home-new-grid.carousel-track,
#home-best-grid.carousel-track,
#home-offers-grid.carousel-track{
  padding-left:0!important;padding-right:0!important;
  scrollbar-width:none;-ms-overflow-style:none;
}
#home-new-grid.carousel-track::-webkit-scrollbar,
#home-best-grid.carousel-track::-webkit-scrollbar,
#home-offers-grid.carousel-track::-webkit-scrollbar{display:none}

/* Card sizing: exactly 5 fill the visible area */
/* 100% = track visible width = container inner width */
/* 4 gaps × 18px = 72px */
.carousel-track .product-card{
  width:calc((100% - 72px)/5)!important;
  min-width:calc((100% - 72px)/5)!important;
  max-width:calc((100% - 72px)/5)!important;
  flex:0 0 auto!important;
}
.carousel-track .product-card .pc-img{aspect-ratio:3/4;overflow:hidden}
.carousel-track .product-card .pc-img img{width:100%;height:100%;object-fit:cover}

/* ── Minimalist arrows ── */
.carousel-shell .carousel-arrow{
  width:28px;height:28px;border-radius:50%;
  background:rgba(0,0,0,.04);border:none;box-shadow:none;
  opacity:0;transition:opacity .15s;
}
.carousel-shell:hover .carousel-arrow{opacity:1}
.carousel-shell .carousel-arrow:hover{background:rgba(0,0,0,.08)}
.carousel-shell .carousel-arrow[disabled]{opacity:0!important;pointer-events:none}
.carousel-shell .carousel-arrow.left{left:4px}
.carousel-shell .carousel-arrow.right{right:4px}
.carousel-shell .carousel-arrow svg{width:14px;height:14px;stroke:#555;stroke-width:2.5}

/* Tablet: 4 cards, 3 gaps × 18px = 54px */
@media(max-width:1100px){
  .carousel-track .product-card{
    width:calc((100% - 54px)/4)!important;
    min-width:calc((100% - 54px)/4)!important;
    max-width:calc((100% - 54px)/4)!important;
  }
}
/* Mobile: 2 cards, 1 gap × 14px = 14px */
@media(max-width:768px){
  .carousel-track{gap:14px!important}
  .carousel-track .product-card{
    width:calc((100% - 14px)/2)!important;
    min-width:calc((100% - 14px)/2)!important;
    max-width:calc((100% - 14px)/2)!important;
  }
  .carousel-shell .carousel-arrow{opacity:.6;width:24px;height:24px;display:flex!important}
  .carousel-shell .carousel-arrow.left{left:2px}
  .carousel-shell .carousel-arrow.right{right:2px}
  .carousel-shell .carousel-arrow svg{width:12px;height:12px}
}
/* Small: 2 cards tighter */
@media(max-width:480px){
  .carousel-track{gap:10px!important}
  .carousel-track .product-card{
    width:calc((100% - 10px)/2)!important;
    min-width:calc((100% - 10px)/2)!important;
    max-width:calc((100% - 10px)/2)!important;
  }
}

/* Testimonials also hide scrollbar */
#home-testi-grid.carousel-track{scrollbar-width:none}
#home-testi-grid.carousel-track::-webkit-scrollbar{display:none}
`;
  document.head.appendChild(s);
}


/* ═══════════════════════════════════
   2. VENDOR SYSTEM
   ═══════════════════════════════════ */

function vCode(cfg){
  const used=new Set((cfg.usuarios||[]).map(u=>u.vendedorCode).filter(Boolean));
  let n=1;while(used.has('VND-'+String(n).padStart(3,'0')))n++;
  return'VND-'+String(n).padStart(3,'0');
}

function ensureVC(){
  const cfg=getCfg();let ch=false;
  (cfg.usuarios||[]).forEach(u=>{if(!u.vendedorCode){u.vendedorCode=vCode(cfg);ch=true;}});
  if(ch)saveCfg(cfg);
}

function enrichSales(){
  const cfg=getCfg();const u=cfg.usuarios||[];let ch=false;
  (cfg.sales||[]).forEach(s=>{
    if(s.vendedorId&&!s.vendedorCode){const v=u.find(x=>x.id===s.vendedorId);if(v?.vendedorCode){s.vendedorCode=v.vendedorCode;ch=true;}}
    if(s.vendedorId&&(!s.vendedorNombre||s.vendedorNombre==='Sin asignar')){const v=u.find(x=>x.id===s.vendedorId);if(v){s.vendedorNombre=v.nombre;ch=true;}}
    if(!s.vendedorId){s.vendedorId='unknown';s.vendedorNombre='(Sin asignar)';ch=true;}
  });
  if(ch)saveCfg(cfg);
}

function hookStamp(){
  if(!window.OnneBus)return;
  window.OnneBus.on('sale:created',function(){
    const cfg=getCfg();if(!cfg.sales?.length)return;
    const s=cfg.sales[0];if(!s||s._v87)return;
    const user=getUser();const v=(cfg.usuarios||[]).find(u=>u.id===user.id);
    s.vendedorId=user.id||'admin_master';s.vendedorNombre=user.nombre||'Administrador';
    s.vendedorEmail=user.email||'';s.vendedorCode=v?.vendedorCode||'';s._v87=true;
    saveCfg(cfg);
  });
}

function patchUsers(){
  const orig=window.renderUsuariosSection;if(!orig||orig._v87)return;
  window.renderUsuariosSection=function(){
    const cfg=getCfg();cfg.usuarios=cfg.usuarios||[];
    let ch=false;cfg.usuarios.forEach(u=>{if(!u.vendedorCode){u.vendedorCode=vCode(cfg);ch=true;}});
    if(ch)saveCfg(cfg);
    const host=document.getElementById('usuarios-list-host');if(!host)return;
    const users=cfg.usuarios;const cur=getUser();
    const cEl=document.getElementById('usuarios-count');
    if(cEl)cEl.textContent=users.length+' usuario'+(users.length!==1?'s':'');
    if(!users.length){host.innerHTML='<div class="empty-state"><div class="empty-state-icon">👤</div>No hay usuarios.</div>';return;}
    const rl=r=>({admin:'Administrador',manager:'Manager',vendedor:'Vendedor'}[r]||r);
    const rc=r=>({admin:'role-badge-admin',manager:'role-badge-manager',vendedor:'role-badge-vendedor'}[r]||'role-badge-vendedor');
    const fd=iso=>{if(!iso)return'—';const d=new Date(iso);return d.toLocaleDateString('es-DO',{day:'2-digit',month:'short'})+' '+d.toLocaleTimeString('es-DO',{hour:'2-digit',minute:'2-digit'});};
    const sc={};(cfg.sales||[]).forEach(s=>{sc[s.vendedorId]=(sc[s.vendedorId]||0)+1;});
    host.innerHTML=`<div class="admin-table-wrap"><table class="users-table">
      <thead><tr><th>Usuario</th><th>ID Vendedor</th><th>Email</th><th>Rol</th><th style="text-align:center">Ventas</th><th>Estado</th><th>Último acceso</th><th>Acciones</th></tr></thead>
      <tbody>${users.map(u=>`<tr data-uid="${u.id}">
        <td><div class="user-avatar-row"><div class="user-avatar">${(u.nombre||'?')[0].toUpperCase()}</div><div><div style="font-weight:600;font-size:.84rem">${esc(u.nombre)}</div><div style="font-size:.68rem;color:var(--adm-text-mid)">#${u.id.slice(-6)}</div></div></div></td>
        <td><span style="font-family:monospace;font-size:.8rem;font-weight:700;color:var(--adm-gold-c,#C9A96E);background:rgba(201,169,110,.07);padding:3px 9px;border-radius:6px;border:1px solid rgba(201,169,110,.1)">${esc(u.vendedorCode||'—')}</span></td>
        <td style="font-size:.82rem">${esc(u.email||'—')}</td>
        <td><span class="role-badge ${rc(u.rol)}">${rl(u.rol)}</span></td>
        <td style="text-align:center;font-weight:700">${sc[u.id]||0}</td>
        <td><span class="status-badge ${u.estado==='activo'?'status-active':'status-inactive'}">${u.estado==='activo'?'● Activo':'○ Inactivo'}</span></td>
        <td style="font-size:.78rem;color:var(--adm-text-mid)">${u.ultimoLogin?fd(u.ultimoLogin):'Nunca'}</td>
        <td class="action-cell">
          <button class="btn btn-outline btn-sm" data-act="edit-user" data-uid="${u.id}" style="padding:4px 10px;font-size:.72rem">✏️ Editar</button>
          ${cur&&cur.id!==u.id?`<button class="btn btn-rose btn-sm" data-act="del-user" data-uid="${u.id}" style="padding:4px 9px;font-size:.72rem;margin-left:4px">🗑</button>`:''}
        </td></tr>`).join('')}</tbody></table></div>`;
    host.onclick=e=>{const b=e.target.closest('button[data-act]');if(!b)return;const uid=b.dataset.uid;
      if(b.dataset.act==='edit-user')openUF(uid);
      if(b.dataset.act==='del-user'){if(!confirm('¿Eliminar este usuario?'))return;const c2=getCfg();c2.usuarios=(c2.usuarios||[]).filter(u=>u.id!==uid);saveCfg(c2);toast('Usuario eliminado','ok');window.renderUsuariosSection();}};
  };
  window.renderUsuariosSection._v87=true;
}

function openUF(userId){
  const cfg=getCfg();const user=userId?(cfg.usuarios||[]).find(u=>u.id===userId):null;
  const modal=document.getElementById('user-modal');if(!modal)return;
  document.getElementById('um-id').value=userId||'';
  document.getElementById('um-nombre').value=user?user.nombre:'';
  document.getElementById('um-email').value=user?user.email:'';
  document.getElementById('um-password').value=user?user.password:'';
  document.getElementById('um-rol').value=user?user.rol:'vendedor';
  document.getElementById('um-estado').value=user?user.estado:'activo';
  document.getElementById('um-form-title').textContent=user?'Editar usuario':'Nuevo usuario';
  let vc=document.getElementById('um-vc87');
  if(!vc){const body=modal.querySelector('.user-modal-body');if(!body)return;
    vc=document.createElement('div');vc.id='um-vc87';vc.style.cssText='margin-bottom:14px';
    vc.innerHTML='<label style="font-size:.7rem;font-weight:800;letter-spacing:.07em;text-transform:uppercase;color:var(--adm-text-mid,#6E6E73);display:block;margin-bottom:4px">ID de Vendedor</label><div id="um-vc87-val" style="font-family:monospace;font-size:1rem;font-weight:800;color:var(--adm-gold-c,#C9A96E);background:rgba(201,169,110,.06);padding:9px 14px;border-radius:10px;border:1.5px solid rgba(201,169,110,.12)"></div><div style="font-size:.64rem;color:var(--adm-text-mid);margin-top:3px">Identifica al vendedor en facturas y reportes</div>';
    body.insertBefore(vc,body.firstChild);}
  document.getElementById('um-vc87-val').textContent=user?.vendedorCode||vCode(cfg)+' (se asigna al guardar)';
  modal.classList.add('open');
}

function hookDetail(){
  new MutationObserver(()=>{
    const m=document.getElementById('vta-detail-modal');
    if(!m||!m.classList.contains('open')||m.querySelector('.v87vd'))return;
    const sid=m._currentSaleId;if(!sid)return;
    const cfg=getCfg();const sale=(cfg.sales||[]).find(s=>s.id===sid);if(!sale)return;
    const grid=m.querySelector('.sale-detail-grid');if(!grid)return;
    const divs=grid.querySelectorAll('.sale-detail-divider');
    const bl=document.createElement('div');bl.className='v87vd';bl.style.cssText='grid-column:1/-1';
    bl.innerHTML=`<div class="sale-detail-divider"></div><div class="sale-detail-section-title">🏷️ Vendedor</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <div class="sale-detail-item"><div class="sale-detail-label">Nombre</div><div class="sale-detail-value">${esc(sale.vendedorNombre||'Sin asignar')}</div></div>
        <div class="sale-detail-item"><div class="sale-detail-label">ID</div><div class="sale-detail-value muted" style="font-family:monospace">${esc(sale.vendedorCode||sale.vendedorId||'—')}</div></div></div>`;
    if(divs.length>=2)grid.insertBefore(bl,divs[1]);else grid.appendChild(bl);
  }).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
}


/* ═══════════════════════════════════
   3. DASHBOARD DEBOUNCE
   ═══════════════════════════════════ */

function fixDash(){
  const orig=window.renderSaaSDashboard;if(!orig||orig._v87)return;
  let t=null;
  window.renderSaaSDashboard=function(){if(t)clearTimeout(t);t=setTimeout(()=>{t=null;try{orig();}catch(e){console.error(e);}if(!canSeeAll())setTimeout(fDash,120);},200);};
  window.renderSaaSDashboard._v87=true;
  if(window.V79?.renderEnhancedStats&&!window.V79.renderEnhancedStats._v87){const os=window.V79.renderEnhancedStats;let t2=null;
    window.V79.renderEnhancedStats=function(){if(t2)clearTimeout(t2);t2=setTimeout(()=>{t2=null;try{os();}catch(e){}setTimeout(fixRec,100);},250);};window.V79.renderEnhancedStats._v87=true;}
  if(window.V79?.refreshStatsCharts&&!window.V79.refreshStatsCharts._v87){const or2=window.V79.refreshStatsCharts;let t3=null;
    window.V79.refreshStatsCharts=function(){if(t3)clearTimeout(t3);t3=setTimeout(()=>{t3=null;try{or2();}catch(e){}setTimeout(fixRec,100);},200);};window.V79.refreshStatsCharts._v87=true;}
}

function fDash(){
  if(canSeeAll())return;const uid=getUserId();const cfg=getCfg();
  const my=(cfg.sales||[]).filter(s=>s.vendedorId===uid);const td=today();const mo=td.slice(0,7);
  const host=document.getElementById('dash-saas-kpis');if(!host)return;
  const cards=host.querySelectorAll('.saas-kpi-card');
  if(cards[0]){const v=cards[0].querySelector('.saas-kpi-value'),sub=cards[0].querySelector('.saas-kpi-sub');const d=my.filter(x=>x.date===td);if(v)v.textContent=d.length;if(sub)sub.textContent=fmt(d.reduce((a,x)=>a+(x.total||0),0))+' en ingresos';}
  if(cards[1]){const v=cards[1].querySelector('.saas-kpi-value'),sub=cards[1].querySelector('.saas-kpi-sub');const m=my.filter(x=>(x.date||'').startsWith(mo));if(v)v.textContent=fmt(m.reduce((a,x)=>a+(x.total||0),0));if(sub)sub.textContent=m.length+' ventas';}
}


/* ═══════════════════════════════════
   4. RECURRING CUSTOMERS
   ═══════════════════════════════════ */

function fixRec(){
  const inner=document.getElementById('v79-stats-inner');if(!inner)return;
  const cfg=getCfg();const sales=cfg.sales||[];const custs=cfg.customers||[];
  if(!sales.length)return;
  const data={};
  sales.forEach(s=>{
    const cid=s.customerId||'';const cn=s.customerName||'';
    if(!cid&&!cn)return;if(cn==='Cliente General'||cn==='General')return;
    const k=cid||cn;
    if(!data[k]){let name=cn;if(cid){const c=custs.find(x=>x.id===cid);if(c?.name)name=c.name;}
      if(!name||/^(cust|c|cl)_[a-f0-9]+$/i.test(name)){const c=custs.find(x=>x.id===k);name=c?.name||cn||k;}
      data[k]={name,count:0,total:0};}
    data[k].count++;data[k].total+=(s.total||0);
  });
  const rec=Object.values(data).filter(c=>c.count>1).sort((a,b)=>b.count-a.count).slice(0,5);
  let box=null;inner.querySelectorAll('div').forEach(d=>{if(d.textContent.includes('Clientes recurrentes')&&d.style.fontSize)box=d.parentElement;});
  if(!box)return;
  const cols=['#C9A96E','#3b82f6','#10b981','#8b5cf6','#f59e0b'];
  box.innerHTML=`<div style="font-size:.78rem;font-weight:700;color:#666;margin-bottom:8px">🔄 Clientes recurrentes</div>
    ${rec.length?rec.map((c,i)=>`<div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid rgba(0,0,0,.06)">
      <div style="width:26px;height:26px;background:rgba(${h2r(cols[i])},.12);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.72rem;font-weight:800;color:${cols[i]};flex-shrink:0">${i+1}</div>
      <div style="min-width:0;flex:1"><div style="font-size:.78rem;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(c.name)}</div>
      <div style="font-size:.68rem;color:#888">${c.count} compras · ${fmt(c.total)}</div></div></div>`).join('')
    :'<div style="font-size:.78rem;color:#bbb;text-align:center;padding:16px">Sin clientes recurrentes aún</div>'}`;
}


/* ═══════════════════════════════════
   5. SALES VISIBILITY
   ═══════════════════════════════════ */

function hookSales(){
  const host=document.getElementById('vta-history-table');if(!host||host._v87)return;host._v87=true;
  let d=null;
  new MutationObserver(()=>{if(d)clearTimeout(d);d=setTimeout(()=>{fSales();addVC();},100);}).observe(host,{childList:true,subtree:true});
  document.addEventListener('click',e=>{if(e.target.closest('[data-view="ventas"]'))setTimeout(()=>{fSales();addVC();},350);});
}
function fSales(){
  if(canSeeAll())return;const uid=getUserId();const cfg=getCfg();
  const ids=new Set((cfg.sales||[]).filter(s=>s.vendedorId===uid).map(s=>s.id));
  const host=document.getElementById('vta-history-table');if(!host)return;
  host.querySelectorAll('tr[data-sale-id]').forEach(r=>{r.style.display=ids.has(r.dataset.saleId)?'':'none';});
  const my=(cfg.sales||[]).filter(s=>s.vendedorId===uid);const td=today();const mt=my.filter(s=>s.date===td);
  const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v;};
  set('vta-kpi-total',my.length);set('vta-kpi-revenue',fmt(my.reduce((a,s)=>a+(s.total||0),0)));
  set('vta-kpi-today',mt.length);set('vta-kpi-today-rev',fmt(mt.reduce((a,s)=>a+(s.total||0),0)));
}
function addVC(){
  if(!canSeeAll())return;const host=document.getElementById('vta-history-table');if(!host)return;
  const tbl=host.querySelector('table.sales-table');if(!tbl||tbl.querySelector('.v87c'))return;
  const cfg=getCfg();const sm=new Map((cfg.sales||[]).map(s=>[s.id,s]));
  const hdr=tbl.querySelector('thead tr');
  if(hdr){const th=document.createElement('th');th.className='v87c';th.textContent='Vendedor';th.style.cssText='font-size:.78rem;min-width:85px';hdr.insertBefore(th,hdr.lastElementChild);}
  tbl.querySelectorAll('tbody tr[data-sale-id]').forEach(r=>{
    const s=sm.get(r.dataset.saleId);const td=document.createElement('td');td.className='v87c';td.style.cssText='font-size:.78rem';
    if(s)td.innerHTML=`<div style="font-weight:600;font-size:.78rem">${esc(s.vendedorNombre||'—')}</div>${s.vendedorCode?`<div style="font-size:.64rem;color:var(--adm-text-mid);font-family:monospace">${esc(s.vendedorCode)}</div>`:''}`;
    else td.textContent='—';r.insertBefore(td,r.lastElementChild);
  });
}
function restrictDel(){
  const host=document.getElementById('vta-history-table');if(!host||host._v87d)return;host._v87d=true;
  new MutationObserver(()=>{if(!isAdmin())host.querySelectorAll('button[data-act="del-sale"]').forEach(b=>{b.style.display='none';});}).observe(host,{childList:true,subtree:true});
}
function auditNames(){
  const cfg=getCfg();const cm=new Map((cfg.customers||[]).map(c=>[c.id,c]));let ch=false;
  (cfg.sales||[]).forEach(s=>{if(s.customerId&&(!s.customerName||s.customerName===s.customerId)){
    const c=cm.get(s.customerId);if(c?.name){s.customerName=c.name;ch=true;}}});
  if(ch)saveCfg(cfg);
}


/* ═══════════════════════════════════
   6. REFRESH BUTTON — Rewrite cleanly
   Removes the old handler entirely and
   replaces with a simple clean reload.
   ═══════════════════════════════════ */

function fixRefresh(){
  const btn=document.getElementById('btn-refresh');
  if(!btn)return;
  // Clone to remove ALL old handlers
  const fresh=btn.cloneNode(true);
  btn.parentNode.replaceChild(fresh,btn);
  fresh.addEventListener('click',function(e){
    e.preventDefault();
    e.stopPropagation();
    const active=document.querySelector('.admin-nav-link.on');
    if(active?.dataset?.view) try{sessionStorage.setItem('adminActiveView',active.dataset.view);}catch(x){}
    window.location.reload();
  });
}

/* Also fix the v79 stats refresh button */
function fixStatsRefresh(){
  const btn=document.getElementById('v79-refresh-stats');
  if(!btn||btn._v87)return;
  btn._v87=true;
  const fresh=btn.cloneNode(true);
  btn.parentNode.replaceChild(fresh,btn);
  fresh.addEventListener('click',function(){
    if(window.V79?.refreshStatsCharts)window.V79.refreshStatsCharts();
    setTimeout(fixRec,200);
  });
}


/* ═══════════════════════════════════
   INIT
   ═══════════════════════════════════ */

function init(){
  /* Index: carousel */
  if(document.getElementById('home-new-grid')){
    cleanOld();
    injectHome();
    setTimeout(cleanOld,300);
    setTimeout(cleanOld,1000);
  }

  /* Admin */
  if(!document.getElementById('view-dashboard'))return;
  ensureVC();
  patchUsers();
  hookStamp();
  enrichSales();
  fixDash();
  hookSales();
  hookDetail();
  restrictDel();
  auditNames();
  fixRefresh();
  setTimeout(fixStatsRefresh,2000);
}

if(document.readyState==='loading')
  document.addEventListener('DOMContentLoaded',()=>setTimeout(init,500));
else setTimeout(init,500);

window.V87={cleanOld,injectHome,fixRec,vCode};
})();

/* ═══ v88-core.js ════════════════════════════════════════════════════════════════════ */
/*!
 * ONNE STORE RD — v88-core.js
 * ═══════════════════════════════════════════════════════════
 * Consolidated fixes & improvements:
 *  1. Dashboard reload error fix (race condition resolution)
 *  2. Recurring customers — correct query & display
 *  3. Analytics panel — restructured 6+5 KPI grid
 *  4. Mobile bottom nav — active state sync
 *  5. Code cleanup & error handling
 * ═══════════════════════════════════════════════════════════
 */
(function () {
  'use strict';

  // ── Utilities ──
  const getCfg = () => window.StorageAPI ? window.StorageAPI.load() : (window.__adminCfg || {});
  const esc = s => s == null ? '' : String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = n => 'RD$' + Number(n || 0).toLocaleString('es-DO', { minimumFractionDigits: 0 });
  const h2r = h => {
    h = (h || '#888').replace('#', '');
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)].join(',');
  };

  /* ═══════════════════════════════════════════
     1. DASHBOARD RELOAD FIX
     Problem: setActiveView("dashboard") fires at ~80ms,
     but v78/v79 scripts create DOM elements at ~500-800ms.
     Multiple renderSaaSDashboard calls create race conditions.
     
     Solution: Ensure renderSaaSDashboard is safe to call
     at any time by wrapping it with null-checks and deferred
     re-renders when DOM is ready.
  ═══════════════════════════════════════════ */

  function fixDashboardReload() {
    const origRender = window.renderSaaSDashboard;
    if (!origRender || origRender._v88) return;

    let debounceTimer = null;
    let renderCount = 0;

    window.renderSaaSDashboard = function () {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function () {
        debounceTimer = null;
        renderCount++;
        try {
          origRender();
        } catch (e) {
          console.warn('[v88] Dashboard render error caught:', e.message);
          // If first render fails, retry after scripts have loaded
          if (renderCount <= 2) {
            setTimeout(function () {
              try { origRender(); } catch (e2) { /* silent */ }
            }, 1000);
          }
        }
      }, renderCount === 0 ? 100 : 200);
    };
    window.renderSaaSDashboard._v88 = true;
  }

  // Fix: Ensure __adminCfg is always available before dashboard renders
  function ensureAdminCfg() {
    if (!window.__adminCfg && window.StorageAPI) {
      window.__adminCfg = window.StorageAPI.load();
    }
  }


  /* ═══════════════════════════════════════════
     2. RECURRING CUSTOMERS — Proper Query
     Problem: v79/v87 try to find customers by DOM traversal
     which is fragile. Customer names show as IDs when the
     customerId → customer name lookup fails.
     
     Solution: Rewrite recurring customer logic with proper
     data aggregation and inject directly into the stats panel.
  ═══════════════════════════════════════════ */

  function getRecurringCustomers() {
    const cfg = getCfg();
    const sales = cfg.sales || [];
    const customers = cfg.customers || [];
    
    if (!sales.length) return [];

    // Build a lookup map: customerId → customer record
    const custMap = new Map();
    customers.forEach(c => { if (c && c.id) custMap.set(c.id, c); });

    // Aggregate sales by customer
    const aggregated = {};
    sales.forEach(s => {
      const cid = s.customerId || '';
      const cname = s.customerName || '';
      
      // Skip generic/unidentified customers
      if (!cid && !cname) return;
      if (cname === 'Cliente General' || cname === 'General') return;
      if (cid === 'general' || cid === 'walk-in') return;

      const key = cid || cname;

      if (!aggregated[key]) {
        // Resolve the best possible name
        let resolvedName = cname;
        
        // Try to get name from customers table via ID
        if (cid && custMap.has(cid)) {
          const cust = custMap.get(cid);
          if (cust.name && cust.name.trim()) {
            resolvedName = cust.name;
          }
        }
        
        // If name still looks like an ID (hex patterns), try harder
        if (!resolvedName || /^(cust|c|cl|id)_[a-f0-9]+$/i.test(resolvedName) || resolvedName === key) {
          // Search by name across customers
          const match = customers.find(c => c.id === key || c.id === cid);
          if (match && match.name) resolvedName = match.name;
          else resolvedName = cname || key;
        }

        aggregated[key] = {
          name: resolvedName,
          count: 0,
          total: 0
        };
      }

      aggregated[key].count++;
      aggregated[key].total += (s.total || 0);
    });

    // Filter to recurring (2+ purchases), sort by count desc
    return Object.values(aggregated)
      .filter(c => c.count > 1)
      .sort((a, b) => b.count - a.count || b.total - a.total)
      .slice(0, 5);
  }

  function renderRecurringCustomers() {
    const inner = document.getElementById('v79-stats-inner');
    if (!inner) return;

    const recurring = getRecurringCustomers();
    const colors = ['#C9A96E', '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b'];

    // Find the recurring customers container
    let box = null;
    inner.querySelectorAll('div').forEach(d => {
      if (d.textContent.includes('Clientes recurrentes') && (d.style.fontSize || d.style.fontWeight)) {
        box = d.parentElement;
      }
    });
    if (!box) return;

    box.innerHTML = `
      <div style="font-size:.82rem;font-weight:700;color:#555;margin-bottom:10px;display:flex;align-items:center;gap:6px">
        🔄 Clientes recurrentes
        <span style="font-size:.65rem;color:#aaa;font-weight:500">(${recurring.length})</span>
      </div>
      ${recurring.length
        ? recurring.map((c, i) => `
          <div class="recurring-item">
            <div class="recurring-rank" style="background:rgba(${h2r(colors[i])},.1);color:${colors[i]}">${i + 1}</div>
            <div class="recurring-info">
              <div class="recurring-name">${esc(c.name)}</div>
              <div class="recurring-meta">
                <strong>${c.count}</strong> compras · <strong>${fmt(c.total)}</strong>
              </div>
            </div>
          </div>`).join('')
        : '<div style="font-size:.8rem;color:#bbb;text-align:center;padding:20px">Sin clientes recurrentes aún</div>'
      }`;
  }

  // Override v87's fixRec with our improved version
  function overrideFixRec() {
    if (window.V87 && !window.V87._v88Rec) {
      window.V87.fixRec = renderRecurringCustomers;
      window.V87._v88Rec = true;
    }
  }


  /* ═══════════════════════════════════════════
     3. ANALYTICS PANEL — Restructured Layout
     Replaces the old auto-fill grid with explicit
     6-card first row + 5-card second row layout.
     Cards are larger with better number display.
  ═══════════════════════════════════════════ */

  function restructureAnalytics() {
    const oldKpis = document.querySelector('#view-analytics > .analytics-kpis');
    if (!oldKpis) return;
    
    // Check if already restructured
    if (document.getElementById('analytics-kpis-v88')) return;

    // Create new structure with 2 rows
    const wrapper = document.createElement('div');
    wrapper.id = 'analytics-kpis-v88';
    wrapper.className = 'analytics-section-v88';

    wrapper.innerHTML = `
      <!-- Row 1: 6 cards -->
      <div class="analytics-kpis-row row-1">
        <div class="analytics-kpi-v88">
          <div class="kpi-icon">📦</div>
          <div class="kpi-value" id="akpi-products-v88">0</div>
          <div class="kpi-label">Productos</div>
        </div>
        <div class="analytics-kpi-v88">
          <div class="kpi-icon">👥</div>
          <div class="kpi-value" id="akpi-customers-v88">0</div>
          <div class="kpi-label">Clientes</div>
        </div>
        <div class="analytics-kpi-v88">
          <div class="kpi-icon">🛒</div>
          <div class="kpi-value" id="akpi-orders-v88">0</div>
          <div class="kpi-label">Pedidos</div>
        </div>
        <div class="analytics-kpi-v88">
          <div class="kpi-icon">💰</div>
          <div class="kpi-value" id="akpi-revenue-v88">RD$0</div>
          <div class="kpi-label">Ingresos totales</div>
        </div>
        <div class="analytics-kpi-v88">
          <div class="kpi-icon">👁️</div>
          <div class="kpi-value" id="akpi-views-v88">0</div>
          <div class="kpi-label">Vistas productos</div>
        </div>
        <div class="analytics-kpi-v88">
          <div class="kpi-icon">📈</div>
          <div class="kpi-value" id="akpi-conversion-v88">0%</div>
          <div class="kpi-label">Tasa conversión</div>
        </div>
      </div>
      <!-- Row 2: 5 cards -->
      <div class="analytics-kpis-row row-2">
        <div class="analytics-kpi-v88">
          <div class="kpi-icon">📅</div>
          <div class="kpi-value" id="akpi-today-orders-v88">0</div>
          <div class="kpi-label">Pedidos hoy</div>
        </div>
        <div class="analytics-kpi-v88">
          <div class="kpi-icon">💵</div>
          <div class="kpi-value" id="akpi-today-revenue-v88">RD$0</div>
          <div class="kpi-label">Ingresos hoy</div>
        </div>
        <div class="analytics-kpi-v88">
          <div class="kpi-icon">🎫</div>
          <div class="kpi-value" id="akpi-avg-ticket-v88">RD$0</div>
          <div class="kpi-label">Ticket promedio</div>
        </div>
        <div class="analytics-kpi-v88">
          <div class="kpi-icon">📊</div>
          <div class="kpi-value" id="akpi-units-v88">0</div>
          <div class="kpi-label">Uds. vendidas</div>
        </div>
        <div class="analytics-kpi-v88">
          <div class="kpi-icon">⭐</div>
          <div class="kpi-value" id="akpi-top-cat-v88">—</div>
          <div class="kpi-label">Categoría top</div>
        </div>
      </div>`;

    // Insert before the old kpis
    oldKpis.parentNode.insertBefore(wrapper, oldKpis);

    // Hook into renderAnalyticsDashboard to populate new cards
    hookAnalyticsRender();
  }

  function hookAnalyticsRender() {
    const origRender = window.renderAnalyticsDashboard;
    if (!origRender || origRender._v88) return;

    window.renderAnalyticsDashboard = async function () {
      // Call original to populate data
      await origRender();

      // Sync values from old IDs to new IDs
      const sync = (oldId, newId) => {
        const oldEl = document.getElementById(oldId);
        const newEl = document.getElementById(newId);
        if (oldEl && newEl) newEl.textContent = oldEl.textContent;
      };

      sync('akpi-products', 'akpi-products-v88');
      sync('akpi-customers', 'akpi-customers-v88');
      sync('akpi-orders', 'akpi-orders-v88');
      sync('akpi-revenue', 'akpi-revenue-v88');
      sync('akpi-views', 'akpi-views-v88');
      sync('akpi-conversion', 'akpi-conversion-v88');
      sync('akpi-today-orders', 'akpi-today-orders-v88');
      sync('akpi-today-revenue', 'akpi-today-revenue-v88');

      // Compute additional KPIs for row 2
      const cfg = window.__adminCfg || getCfg();
      const sales = cfg.sales || [];
      const products = cfg.products || [];

      // Average ticket
      const totalRevenue = sales.reduce((s, x) => s + (x.total || 0), 0);
      const avgTicket = sales.length ? totalRevenue / sales.length : 0;
      const avgEl = document.getElementById('akpi-avg-ticket-v88');
      if (avgEl) avgEl.textContent = fmt(avgTicket);

      // Units sold (all time)
      const totalUnits = sales.reduce((s, x) => s + (x.quantity || 1), 0);
      const unitsEl = document.getElementById('akpi-units-v88');
      if (unitsEl) unitsEl.textContent = totalUnits.toLocaleString('es-DO');

      // Top category
      const catCount = {};
      sales.forEach(s => {
        const prod = products.find(p => p.id === s.productId);
        const cat = prod?.categoryId || 'sin-cat';
        catCount[cat] = (catCount[cat] || 0) + 1;
      });
      const shopTabs = cfg.shopTabs?.categories || [];
      const topCatEntry = Object.entries(catCount).sort((a, b) => b[1] - a[1])[0];
      const topCatEl = document.getElementById('akpi-top-cat-v88');
      if (topCatEl && topCatEntry) {
        const catObj = shopTabs.find(c => c.id === topCatEntry[0]);
        topCatEl.textContent = catObj?.name || (topCatEntry[0] === 'sin-cat' ? 'General' : topCatEntry[0]);
      }
    };
    window.renderAnalyticsDashboard._v88 = true;
  }


  /* ═══════════════════════════════════════════
     4. MOBILE BOTTOM NAV — Active State Sync
     (for index.html tienda)
  ═══════════════════════════════════════════ */

  function initMobileBottomNav() {
    const nav = document.getElementById('mobile-bottom-nav-v88');
    if (!nav) return;

    const map = {
      home: 'bnav88-home',
      shop: 'bnav88-shop',
      offers: 'bnav88-offers',
      cart: 'bnav88-cart',
      checkout: 'bnav88-cart',
      product: 'bnav88-shop',
      about: 'bnav88-home'
    };

    function updateActive() {
      const hash = (location.hash.slice(1) || 'home').split('/')[0];
      nav.querySelectorAll('.bnav-v88-link').forEach(link => link.classList.remove('active'));
      const targetId = map[hash] || 'bnav88-home';
      const el = document.getElementById(targetId);
      if (el) el.classList.add('active');
    }

    // Sync cart badge
    function updateBadge() {
      const badge = document.getElementById('bnav88-badge');
      const origBadge = document.getElementById('cart-badge');
      if (badge && origBadge) {
        const count = origBadge.textContent || '0';
        badge.textContent = count;
        badge.dataset.count = count;
      }
    }

    window.addEventListener('hashchange', updateActive);
    updateActive();

    // Observe cart badge changes
    const origBadge = document.getElementById('cart-badge');
    if (origBadge) {
      new MutationObserver(updateBadge).observe(origBadge, { childList: true, characterData: true, subtree: true });
      updateBadge();
    }
  }


  /* ═══════════════════════════════════════════
     5. CODE CLEANUP & AUDIT
  ═══════════════════════════════════════════ */

  // Audit: Fix customer names in sales that show as IDs
  function auditSalesCustomerNames() {
    const cfg = getCfg();
    const sales = cfg.sales || [];
    const customers = cfg.customers || [];
    if (!sales.length || !customers.length) return;

    const custMap = new Map();
    customers.forEach(c => { if (c && c.id) custMap.set(c.id, c); });

    let changed = false;
    sales.forEach(s => {
      if (s.customerId && custMap.has(s.customerId)) {
        const cust = custMap.get(s.customerId);
        if (cust.name && (!s.customerName || s.customerName === s.customerId || /^(cust|c)_[a-f0-9]+$/i.test(s.customerName))) {
          s.customerName = cust.name;
          changed = true;
        }
      }
    });

    if (changed && window.StorageAPI) {
      window.StorageAPI.save(cfg);
    }
  }


  /* ═══════════════════════════════════════════
     INIT
  ═══════════════════════════════════════════ */

  function init() {
    // Store (index.html)
    if (document.getElementById('mobile-bottom-nav-v88')) {
      initMobileBottomNav();
    }

    // Admin (admin.html)
    if (!document.getElementById('view-dashboard')) return;

    ensureAdminCfg();
    fixDashboardReload();
    auditSalesCustomerNames();
    overrideFixRec();

    // Hook analytics render to populate new v88 KPI cards
    hookAnalyticsRender();

    // Restructure analytics when navigating to it (fallback if HTML wasn't pre-built)
    document.addEventListener('click', function (e) {
      const link = e.target.closest('[data-view="analytics"]');
      if (link) {
        setTimeout(restructureAnalytics, 50);
      }
    });

    // Also restructure if analytics is already visible
    const analyticsView = document.getElementById('view-analytics');
    if (analyticsView && analyticsView.style.display !== 'none') {
      setTimeout(restructureAnalytics, 100);
    }

    // Hook recurring customers re-render after v79 stats render
    const hookRecurring = function () {
      const statsInner = document.getElementById('v79-stats-inner');
      if (statsInner) {
        new MutationObserver(function () {
          setTimeout(renderRecurringCustomers, 150);
        }).observe(statsInner, { childList: true });
      }
    };
    setTimeout(hookRecurring, 1500);

    // Safety: re-render dashboard after all scripts loaded
    setTimeout(function () {
      const activeNav = document.querySelector('.admin-nav-link.on');
      if (activeNav && activeNav.dataset.view === 'dashboard') {
        if (window.renderSaaSDashboard) {
          try { window.renderSaaSDashboard(); } catch (e) { /* safe */ }
        }
      }
    }, 1200);
  }

  // Robust init timing
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      setTimeout(init, 600);
    });
  } else {
    setTimeout(init, 600);
  }

  // Expose for debugging
  window.V88 = {
    getRecurringCustomers: getRecurringCustomers,
    renderRecurringCustomers: renderRecurringCustomers,
    restructureAnalytics: restructureAnalytics
  };

})();
