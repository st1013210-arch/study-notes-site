(() => {
  "use strict";
  const notes = Array.isArray(window.NOTES) ? window.NOTES : [];
  const categories = ["全部筆記", ...new Set(notes.map(n => n.category))];
  let query = "";
  let activeCategory = "全部筆記";
  const app = document.getElementById("app");
  const nav = document.getElementById("category-nav");
  const bread = document.getElementById("breadcrumb");
  document.getElementById("year").textContent = new Date().getFullYear();
  const escapeHTML = v => String(v ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[ch]));
  const icon = (c) => ({"生物學":"◈","生態學":"✳","學習方法":"◇"}[c] || "▤");
  const link = id => `#/note/${encodeURIComponent(id)}`;
  function renderNav() {
    nav.innerHTML = categories.map(cat => `<button type="button" class="nav-item ${cat === activeCategory ? "active" : ""}" data-category="${escapeHTML(cat)}"><span class="nav-icon">${cat === "全部筆記" ? "▦" : icon(cat)}</span>${escapeHTML(cat)}<span class="nav-count">${cat === "全部筆記" ? notes.length : notes.filter(n => n.category === cat).length}</span></button>`).join("");
    nav.querySelectorAll("button").forEach(btn => btn.addEventListener("click", () => { activeCategory = btn.dataset.category; query = ""; location.hash = "#/"; renderHome(); }));
  }
  function renderHome() {
    renderNav();
    bread.innerHTML = `My workspace <span>/</span> ${escapeHTML(activeCategory)}`;
    const filtered = notes.filter(n => (activeCategory === "全部筆記" || n.category === activeCategory) && `${n.title} ${n.summary} ${n.tags.join(" ")} ${n.category}`.toLocaleLowerCase().includes(query.toLocaleLowerCase())).sort((a,b) => b.date.localeCompare(a.date));
    app.innerHTML = `<div class="home-head"><div><div class="eyebrow">MY LEARNING LIBRARY</div><h1>我的學習筆記<span class="title-dot">.</span></h1><p class="intro">把學過的知識整理成看得懂、找得到、能再次複習的筆記。</p></div><div class="stat"><strong>${notes.length.toString().padStart(2,"0")}</strong><small>NOTES COLLECTED</small></div></div>
      <div class="toolbar"><label class="search"><span aria-hidden="true">⌕</span><input id="search" type="search" placeholder="搜尋標題、關鍵字或內容摘要…" value="${escapeHTML(query)}" aria-label="搜尋筆記" /></label><span class="result-count">${filtered.length} 篇筆記</span></div>
      <div class="section-heading"><h2>${escapeHTML(activeCategory === "全部筆記" ? "最近整理" : activeCategory)}</h2><span>RECENT NOTES</span></div>
      <div class="cards">${filtered.map(n => `<a class="note-card" href="${link(n.id)}"><div class="card-top"><span class="chip">${icon(n.category)} ${escapeHTML(n.category)}</span><time datetime="${escapeHTML(n.date)}">${escapeHTML(n.date)}</time></div><h3>${escapeHTML(n.title)}</h3><p>${escapeHTML(n.summary)}</p><div class="card-foot"><div class="tags">${n.tags.slice(0,3).map(tag=>`<span>#${escapeHTML(tag)}</span>`).join("")}</div><span class="card-arrow" aria-label="閱讀筆記">↗</span></div></a>`).join("") || `<div class="empty">沒有符合條件的筆記，試試其他關鍵字。</div>`}</div><div class="hint"><strong>✦ 持續擴充</strong><span>新增筆記只要依照 <code>AGENTS.md</code> 的規則，在 <code>notes.js</code> 增加一筆資料，網站就會自動顯示。</span></div>`;
    const search = document.getElementById("search");
    search.addEventListener("input", e => { const pos = e.target.selectionStart; query = e.target.value; renderHome(); const s = document.getElementById("search"); s.focus(); s.setSelectionRange(pos,pos); });
  }
  function renderQuiz(note) {
    if (!Array.isArray(note.quiz) || !note.quiz.length) return "";
    return `<section class="quiz-section" aria-label="互動複習測驗"><div class="eyebrow">KNOWLEDGE CHECK</div><h2>互動式複習測驗</h2><p class="quiz-intro">選一個答案後，查看正確答案與課程概念解析。重新作答不會保留成績。</p>${note.quiz.map((q,i)=>`<fieldset class="quiz-card" data-quiz-index="${i}"><legend><span class="quiz-number">${String(i+1).padStart(2,"0")}</span> ${escapeHTML(q.question)}</legend><div class="quiz-options">${q.options.map((o,j)=>`<label class="quiz-option"><input type="radio" name="quiz-${i}" value="${j}"><span>${escapeHTML(o)}</span></label>`).join("")}</div><button type="button" class="quiz-submit" disabled>確認答案</button><div class="quiz-feedback" aria-live="polite" hidden></div></fieldset>`).join("")}</section>`;
  }
  function setupQuiz() {
    app.querySelectorAll(".quiz-card").forEach(fieldset=>{
      const index=Number(fieldset.dataset.quizIndex);
      const noteId=decodeURIComponent((location.hash || "").replace(/^#\/note\//,""));
      const note=notes.find(n=>n.id===noteId);
      const item=note?.quiz?.[index];
      if (!item) return;
      const button=fieldset.querySelector(".quiz-submit");
      const feedback=fieldset.querySelector(".quiz-feedback");
      fieldset.querySelectorAll('input[type="radio"]').forEach(input=>input.addEventListener("change",()=>{
        button.disabled=false;
        feedback.hidden=true;
        feedback.textContent="";
      }));
      button.addEventListener("click",()=>{
        const selected=fieldset.querySelector('input[type="radio"]:checked');
        if (!selected) return;
        const correct=Number(selected.value)===item.answerIndex;
        feedback.className=`quiz-feedback ${correct ? "is-correct" : "is-incorrect"}`;
        feedback.innerHTML=`<strong>${correct ? "答對了！" : "再複習一下｜正確答案：" + escapeHTML(item.options[item.answerIndex])}</strong><p>${escapeHTML(item.explanation)}</p>`;
        feedback.hidden=false;
      });
    });
  }
  function renderDetail(id) {
    const n = notes.find(note => note.id === id);
    if (!n) { app.innerHTML = `<div class="not-found"><h1>找不到這篇筆記</h1><a href="#/">← 返回全部筆記</a></div>`; bread.innerHTML = `My workspace <span>/</span> 找不到筆記`; return; }
    bread.innerHTML = `My workspace <span>/</span> ${escapeHTML(n.category)} <span>/</span> ${escapeHTML(n.title)}`;
    app.innerHTML = `<article class="article"><a href="#/" class="back">← 返回筆記列表</a><div class="article-meta"><span class="chip">${icon(n.category)} ${escapeHTML(n.category)}</span><time datetime="${escapeHTML(n.date)}">更新於 ${escapeHTML(n.date)}</time></div><h1>${escapeHTML(n.title)}</h1><p class="article-summary">${escapeHTML(n.summary)}</p><div class="article-tags">${n.tags.map(t=>`<span># ${escapeHTML(t)}</span>`).join("")}</div><div class="article-rule"></div>
      ${n.sections.map((s,i) => `<section class="note-section"><div class="section-num">${String(i+1).padStart(2,"0")}</div><div><h2>${escapeHTML(s.heading)}</h2>${(s.paragraphs||[]).map(p=>`<p>${escapeHTML(p)}</p>`).join("")}${s.bullets?.length ? `<ul>${s.bullets.map(b=>`<li>${escapeHTML(b)}</li>`).join("")}</ul>` : ""}</div></section>`).join("")}
      ${renderQuiz(n)}
      <section class="review"><div class="eyebrow">ACTIVE RECALL</div><h2>讀完試著回答</h2><ol>${n.review.map(q=>`<li>${escapeHTML(q)}</li>`).join("")}</ol></section><section class="sources"><h2>參考資料</h2><ul>${n.sources.map(s=>`<li>${escapeHTML(s)}</li>`).join("")}</ul></section></article>`;
    renderNav();
    setupQuiz();
  }
  function route() {
    const hash = decodeURIComponent(location.hash || "#/");
    if (hash.startsWith("#/note/")) renderDetail(hash.slice(7));
    else renderHome();
    window.scrollTo({top:0,behavior:"instant"});
  }
  window.addEventListener("hashchange", route);
  route();
})();
