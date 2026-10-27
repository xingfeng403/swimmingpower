(function () {
  "use strict";

  var DATA = window.SWIM_DATA || null;

  function el(id) { return document.getElementById(id); }

  function fmtDateTime(iso) {
    if (!iso) return "—";
    var d = new Date(iso);
    if (isNaN(d)) return iso;
    var p = function (n) { return (n < 10 ? "0" : "") + n; };
    return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate()) +
      " " + p(d.getHours()) + ":" + p(d.getMinutes());
  }

  function relative(iso) {
    if (!iso) return "";
    var d = new Date(iso);
    var now = new Date();
    var diff = Math.floor((now - d) / 1000);
    if (diff < 0) diff = 0;
    if (diff < 60) return "刚刚刷新";
    if (diff < 3600) return "约 " + Math.floor(diff / 60) + " 分钟前刷新";
    if (diff < 86400) return "约 " + Math.floor(diff / 3600) + " 小时前刷新";
    return "约 " + Math.floor(diff / 86400) + " 天前刷新";
  }

  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  if (!DATA) {
    document.body.insertAdjacentHTML("afterbegin",
      '<p style="padding:20px;color:#c00">数据加载失败：未找到 data.js。</p>');
    return;
  }

  // Header
  if (DATA.meta) {
    if (DATA.meta.title) el("site-title").textContent = DATA.meta.title;
    if (DATA.meta.subtitle) el("site-subtitle").textContent = DATA.meta.subtitle;
    if (DATA.meta.refreshNote) el("refresh-note").textContent = DATA.meta.refreshNote;
    if (DATA.meta.lastUpdated) {
      el("updated-badge").textContent =
        "更新于 " + fmtDateTime(DATA.meta.lastUpdated) + "（" + relative(DATA.meta.lastUpdated) + "）";
    }
    if (DATA.meta.disclaimer) el("disclaimer").textContent = DATA.meta.disclaimer;
  }

  // Tabs
  var tabs = document.querySelectorAll(".tab");
  // 标签页名称由数据驱动，改名只需改 data.js 的 meta.tabTitles
  if (DATA.meta && DATA.meta.tabTitles) {
    tabs.forEach(function (t) {
      var key = t.getAttribute("data-tab");
      if (DATA.meta.tabTitles[key]) t.textContent = DATA.meta.tabTitles[key];
    });
  }
  tabs.forEach(function (t) {
    t.addEventListener("click", function () {
      tabs.forEach(function (x) { x.classList.remove("active"); });
      t.classList.add("active");
      var target = "panel-" + t.getAttribute("data-tab");
      document.querySelectorAll(".panel").forEach(function (p) {
        p.classList.toggle("active", p.id === target);
      });
    });
  });

  // Youth age groups
  var youthTabs = el("youth-group-tabs");
  var currentYouth = 0;
  function renderYouth() {
    var g = DATA.ageGroups[currentYouth];
    if (!g) return;
    var parts = [];
    if (g.season) parts.push("赛季：" + g.season);
    if (g.event) parts.push("赛事：" + g.event);
    if (g.pool) parts.push("池长：" + g.pool + "米（" + (g.pool === 50 ? "长池" : "短池") + "）");
    if (g.recordType) parts.push("记录性质：" + g.recordType);
    if (g.refreshedAt) parts.push("最近刷新：" + g.refreshedAt);
    if (g.source) parts.push("来源：" + g.source);
    el("youth-source").textContent = parts.join("　·　");
    var body = el("youth-table-body");
    body.innerHTML = g.events.map(function (e) {
      return "<tr><td>" + escapeHtml(e.name) + "</td><td>" +
        escapeHtml(e.women || "—") + "</td><td>" + escapeHtml(e.men || "—") + "</td></tr>";
    }).join("");
  }
  DATA.ageGroups.forEach(function (g, i) {
    var b = document.createElement("button");
    b.textContent = g.label + (g.season ? " · " + g.season : "");
    if (i === 0) b.classList.add("active");
    b.addEventListener("click", function () {
      currentYouth = i;
      youthTabs.querySelectorAll("button").forEach(function (x) { x.classList.remove("active"); });
      b.classList.add("active");
      renderYouth();
    });
    youthTabs.appendChild(b);
  });
  renderYouth();

  // 25米短池
  if (DATA.shortPool) {
    var sp = DATA.shortPool;
    el("sp-youth-source").textContent =
      "赛事：" + (sp.youthEvent || "") + "　|　" + (sp.youthSource || "");
    el("sp-youth-body").innerHTML = (sp.youthRecords || []).map(function (r) {
      return "<tr><td>" + escapeHtml(r.group) + "</td><td>" + escapeHtml(r.event) + "</td><td>" +
        escapeHtml(r.gender) + "</td><td>" + escapeHtml(r.time || "—") + "</td><td>" +
        escapeHtml(r.holder || "—") + "</td><td>" + escapeHtml(r.note || "") + "</td></tr>";
    }).join("");

    el("sp-junior-source").textContent =
      "赛事：" + (sp.juniorEvent || "") + "　|　" + (sp.juniorSource || "");
    el("sp-junior-body").innerHTML = (sp.juniorRecords || []).map(function (e) {
      var w = escapeHtml(e.women || "—") + (e.womenHolder && e.womenHolder !== "—" ? "<br><small>" + escapeHtml(e.womenHolder) + "</small>" : "");
      var m = escapeHtml(e.men || "—") + (e.menHolder && e.menHolder !== "—" ? "<br><small>" + escapeHtml(e.menHolder) + "</small>" : "");
      return "<tr><td>" + escapeHtml(e.name) + "</td><td>" + w + "</td><td>" + m + "</td></tr>";
    }).join("");
  }

  // Adult age groups
  var adultTabs = el("adult-group-tabs");
  var currentAdult = 0;
  function renderAdult() {
    var g = DATA.adultRecords[currentAdult];
    if (!g) return;
    el("adult-source").textContent = "来源：" + (g.source || "");
    var body = el("adult-table-body");
    body.innerHTML = g.events.map(function (e) {
      var w = escapeHtml(e.women || "—") + (e.womenHolder ? "<br><small>" + escapeHtml(e.womenHolder) + "</small>" : "");
      var m = escapeHtml(e.men || "—") + (e.menHolder ? "<br><small>" + escapeHtml(e.menHolder) + "</small>" : "");
      return "<tr><td>" + escapeHtml(e.name) + "</td><td>" + w + "</td><td>" + m + "</td></tr>";
    }).join("");
  }
  DATA.adultRecords.forEach(function (g, i) {
    var b = document.createElement("button");
    b.textContent = g.label;
    if (i === 0) b.classList.add("active");
    b.addEventListener("click", function () {
      currentAdult = i;
      adultTabs.querySelectorAll("button").forEach(function (x) { x.classList.remove("active"); });
      b.classList.add("active");
      renderAdult();
    });
    adultTabs.appendChild(b);
  });
  renderAdult();

  // Leaders
  function renderLeaders(listId, arr) {
    var box = el(listId);
    if (!box) return;
    box.innerHTML = arr.map(function (p) {
      return '<div class="card">' +
        '<div class="name">' + escapeHtml(p.name) +
        '<span class="gender">' + escapeHtml(p.gender) + '</span></div>' +
        '<div class="events">' + escapeHtml(p.events) + '</div>' +
        '<p class="highlight">' + escapeHtml(p.highlight) + '</p>' +
        '<div class="src">来源：' + escapeHtml(p.source || "") + '</div>' +
        '</div>';
    }).join("");
  }
  if (DATA.leaders) {
    renderLeaders("cards-veterans", DATA.leaders.veterans || []);
    renderLeaders("cards-midgen", DATA.leaders.midGen || []);
    renderLeaders("cards-rising", DATA.leaders.risingStars || []);
  }

  // Breakthroughs timeline
  var tl = el("timeline");
  if (tl && DATA.breakthroughs) {
    tl.innerHTML = DATA.breakthroughs.map(function (b) {
      return '<li><div class="date">' + escapeHtml(b.date) + '</div>' +
        '<div class="t-title">' + escapeHtml(b.title) + '</div>' +
        '<p class="t-detail">' + escapeHtml(b.detail) + '</p>' +
        '<div class="t-src">来源：' + escapeHtml(b.source || "") + '</div></li>';
    }).join("");
  }

  // Sources
  var sl = el("sources-list");
  if (sl && DATA.meta && DATA.meta.sources) {
    sl.innerHTML = DATA.meta.sources.map(function (s) {
      return '<li><a href="' + escapeHtml(s.url) + '" target="_blank" rel="noopener">' +
        escapeHtml(s.name) + '</a></li>';
    }).join("");
  }
})();
