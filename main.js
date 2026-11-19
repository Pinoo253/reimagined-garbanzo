(() => {
  const $ = (s, root=document) => root.querySelector(s);
  const toast = (message) => { const el=$("#toast"); el.textContent=message; el.classList.add("show"); setTimeout(()=>el.classList.remove("show"),3200); };
  $("#year").textContent = new Date().getFullYear();
  const menu=$(".menu-toggle"), nav=$(".nav");
  menu.addEventListener("click",()=>{const open=nav.classList.toggle("open");menu.setAttribute("aria-expanded",String(open));});
  nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>nav.classList.remove("open")));
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");observer.unobserve(e.target)}}),{threshold:.12});
  document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));

  const cfg=window.ADB_CONFIG||{};
  const configured=cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY && window.supabase;
  const client=configured ? window.supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_ANON_KEY) : null;
  window.adbSupabase=client;
  if(client) loadPublicContent();

  async function loadPublicContent(){
    try{
      const {data:p}=await client.from("profiles").select("description").eq("id",1).maybeSingle();
      if(p?.description) $("#profile-description").textContent=p.description;
      const {data:projects,error:pe}=await client.from("projects").select("id,title,description,creator,published_at,image_url,category_id").order("published_at",{ascending:false}).limit(6);
      if(!pe && projects?.length){
        $("#project-list").innerHTML=projects.map((p,i)=>`<article class="project-card"><div class="project-visual ${["visual-blue","visual-lilac","visual-dark"][i%3]}"><span class="visual-label">${String(i+1).padStart(2,"0")} / ADB PROJECT</span><div class="motion-title">${escapeHtml(p.title)}</div></div><div class="project-info"><div><h3>${escapeHtml(p.title)}</h3><p>${escapeHtml(p.creator||"ADB Creative Team")}</p></div><span>↗</span></div></article>`).join("");
        $("#projects-note").textContent="Menampilkan karya terbaru dari Supabase.";
      }
      const {data:acts,error:ae}=await client.from("activities").select("id,title,date,description,location").order("date",{ascending:false}).limit(6);
      if(!ae && acts?.length) $("#activity-list").innerHTML=acts.map((a,i)=>`<article><span class="activity-number">${String(i+1).padStart(2,"0")}</span><div><h3>${escapeHtml(a.title)}</h3><p>${escapeHtml(a.description||a.location||"Dokumentasi kegiatan ADB Creative Team.")}</p></div><span class="activity-arrow">↗</span></article>`).join("");
      const {data:gallery,error:ge}=await client.from("gallery").select("id,title,url,media_type").order("created_at",{ascending:false}).limit(6);
      if(!ge && gallery?.length) $("#gallery-list").innerHTML=gallery.map((g,i)=>`<a class="gallery-tile ${["tile-a","tile-b","tile-c"][i%3]}" href="${safeUrl(g.url)}" target="_blank" rel="noopener"><span>${String(i+1).padStart(2,"0")} / ${escapeHtml(g.media_type||"MEDIA")}</span><b>${escapeHtml(g.title)}</b></a>`).join("");
    }catch(e){console.warn("Supabase content load:",e)}
  }
  function escapeHtml(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
  function safeUrl(v){try{const u=new URL(v);return ["http:","https:"].includes(u.protocol)?u.href:"#"}catch{return "#"}}
  $("#feedback-form").addEventListener("submit",async e=>{
    e.preventDefault();const form=e.currentTarget,btn=form.querySelector("button"),status=$("#form-status");
    if(!client){toast("Supabase belum dikonfigurasi. Isi config.js terlebih dahulu.");status.textContent="Database belum terhubung.";return;}
    const fd=new FormData(form),payload={name:String(fd.get("name")).trim(),type:fd.get("type"),message:String(fd.get("message")).trim()};
    btn.disabled=true;btn.textContent="Sending...";
    try{const {error}=await client.from("feedback").insert(payload);if(error)throw error;form.reset();status.textContent="Message sent successfully.";toast("Terima kasih! Pesan kamu berhasil dikirim.");}
    catch(err){console.error(err);status.textContent="Pesan belum terkirim.";toast(err.message||"Gagal mengirim pesan.");}
    finally{btn.disabled=false;btn.innerHTML='Send message <span>↗</span>';}
  });
})();