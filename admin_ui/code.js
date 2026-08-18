figma.showUI(__html__, { width: 300, height: 760 });

// ── DESIGN TOKENS ────────────────────────────────────────────────
const F = {
  bold:     { family: "Inter", style: "Bold" },
  semiBold: { family: "Inter", style: "Semi Bold" },
  medium:   { family: "Inter", style: "Medium" },
  regular:  { family: "Inter", style: "Regular" },
};

const C = {
  green:       { r: 0.059, g: 0.302, b: 0.180 },
  greenDark:   { r: 0.039, g: 0.200, b: 0.118 },
  greenLight:  { r: 0.882, g: 0.937, b: 0.906 },
  gold:        { r: 0.945, g: 0.706, b: 0.118 },
  goldDark:    { r: 0.620, g: 0.447, b: 0.000 },
  goldLight:   { r: 0.996, g: 0.969, b: 0.878 },
  navy:        { r: 0.106, g: 0.227, b: 0.361 },
  coral:       { r: 0.863, g: 0.282, b: 0.216 },
  coralLight:  { r: 0.988, g: 0.906, b: 0.898 },
  blue:        { r: 0.118, g: 0.396, b: 0.820 },
  blueLight:   { r: 0.878, g: 0.929, b: 0.996 },
  purple:      { r: 0.341, g: 0.192, b: 0.663 },
  purpleLight: { r: 0.933, g: 0.906, b: 0.988 },
  bg:          { r: 0.953, g: 0.961, b: 0.957 },
  surface:     { r: 1.000, g: 1.000, b: 1.000 },
  border:      { r: 0.906, g: 0.914, b: 0.910 },
  textPri:     { r: 0.082, g: 0.098, b: 0.090 },
  textSec:     { r: 0.380, g: 0.408, b: 0.396 },
  textMuted:   { r: 0.612, g: 0.631, b: 0.624 },
  white:       { r: 1, g: 1, b: 1 },
  black:       { r: 0, g: 0, b: 0 },
};

const W = 1024;
const H = 1366;
const SIDEBAR  = 240;
const TOPBAR   = 64;
const CONTENT_X = SIDEBAR;
const CONTENT_Y = TOPBAR;
const CONTENT_W = W - SIDEBAR;
const CONTENT_H = H - TOPBAR;
const RADIUS = { sm: 6, md: 10, lg: 14, xl: 20, full: 100 };
const SCREEN_GAP = W + 80;

const STATUS_CONFIGS = {
  "Pending":   { bg: C.goldLight,   tc: C.goldDark },
  "Approved":  { bg: C.greenLight,  tc: C.green },
  "Rejected":  { bg: C.coralLight,  tc: C.coral },
  "Active":    { bg: C.greenLight,  tc: C.green },
  "Flagged":   { bg: C.coralLight,  tc: C.coral },
  "Review":    { bg: C.blueLight,   tc: C.blue },
  "Suspended": { bg: C.purpleLight, tc: C.purple },
  "Verified":  { bg: C.blueLight,   tc: C.navy },
};

// ── HELPERS ──────────────────────────────────────────────────────
async function loadFonts() {
  await Promise.all(Object.values(F).map(f => figma.loadFontAsync(f)));
}

function rect(w, h, x, y, color, radius = 0, alpha = 1) {
  const r = figma.createRectangle();
  r.resize(w, h); r.x = x; r.y = y;
  r.fills = [{ type: "SOLID", color, opacity: alpha }];
  if (radius) r.cornerRadius = radius;
  return r;
}

function text(chars, font, size, color, x, y, opts = {}) {
  const t = figma.createText();
  t.fontName = font; t.fontSize = size;
  t.characters = String(chars);
  t.fills = [{ type: "SOLID", color }];
  t.x = x; t.y = y;
  if (opts.width)       { t.textAutoResize = "HEIGHT"; t.resize(opts.width, 40); }
  if (opts.align)         t.textAlignHorizontal = opts.align;
  if (opts.lineHeight)    t.lineHeight = { value: opts.lineHeight, unit: "PIXELS" };
  if (opts.letterSpacing) t.letterSpacing = { value: opts.letterSpacing, unit: "PIXELS" };
  return t;
}

function ellipse(w, h, x, y, color, alpha = 1) {
  const e = figma.createEllipse();
  e.resize(w, h); e.x = x; e.y = y;
  e.fills = [{ type: "SOLID", color, opacity: alpha }];
  return e;
}

function addCard(frame, w, h, x, y, radius = RADIUS.md) {
  const card = rect(w, h, x, y, C.surface, radius);
  card.strokes = [{ type: "SOLID", color: C.border }];
  card.strokeWeight = 1;
  frame.appendChild(card);
  return card;
}

function statusPill(frame, val, x, y) {
  const cfg = STATUS_CONFIGS[val] || { bg: C.bg, tc: C.textSec };
  const pw = 70;
  frame.appendChild(rect(pw, 20, x, y, cfg.bg, RADIUS.full));
  const t = text(val, F.semiBold, 8, cfg.tc, x + pw / 2, y + 5);
  t.x = x + pw / 2 - t.width / 2;
  frame.appendChild(t);
}

function paginationRow(frame, x, y, w) {
  const rowH = 40;
  frame.appendChild(rect(w, rowH, x, y, C.bg));
  // Prev
  frame.appendChild(rect(64, 26, x + 12, y + 7, C.surface, RADIUS.sm));
  frame.appendChild(text("← Prev", F.medium, 10, C.textSec, x + 12 + 8, y + 13));
  // Pages
  [1, 2, 3].forEach((n, i) => {
    const active = n === 1;
    const px = x + w / 2 - 36 + i * 28;
    frame.appendChild(rect(24, 24, px, y + 8, active ? C.green : C.surface, RADIUS.sm));
    frame.appendChild(text(String(n), F.semiBold, 10, active ? C.white : C.textSec, px + 12 - 12, y + 13));
  });
  frame.appendChild(text("…", F.regular, 10, C.textMuted, x + w / 2 + 52, y + 13));
  // Next
  frame.appendChild(rect(64, 26, x + w - 76, y + 7, C.surface, RADIUS.sm));
  frame.appendChild(text("Next →", F.medium, 10, C.textSec, x + w - 76 + 8, y + 13));
}

// ── SIDEBAR ──────────────────────────────────────────────────────
function addSidebar(frame, activeItem) {
  frame.appendChild(rect(SIDEBAR, H, 0, 0, C.green));
  frame.appendChild(rect(W - SIDEBAR, H, SIDEBAR, 0, C.bg));

  // Dot pattern
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 4; col++) {
      frame.appendChild(ellipse(2, 2, 20 + col * 52, 20 + row * 130, C.white, 0.05));
    }
  }

  // Logo
  frame.appendChild(rect(SIDEBAR, 70, 0, 0, C.greenDark));
  const logo = text("Scholaris", F.bold, 20, C.white, 18, 20);
  frame.appendChild(logo);
  frame.appendChild(ellipse(6, 6, 18 + logo.width + 4, 31, C.gold));
  frame.appendChild(text("Admin Portal", F.medium, 10, C.gold, 18, 46));

  // Admin profile
  frame.appendChild(ellipse(40, 40, 18, 82, C.goldDark));
  const avT = text("AD", F.bold, 13, C.white, 0, 0);
  avT.x = 38 - avT.width / 2; avT.y = 102 - avT.height / 2;
  frame.appendChild(avT);
  frame.appendChild(text("System Admin", F.semiBold, 11, C.white, 68, 88));
  frame.appendChild(text("admin@scholaris.gov.ph", F.regular, 9, C.greenLight, 68, 104));

  // Divider
  frame.appendChild(rect(SIDEBAR - 24, 1, 12, H - 134, C.white, 0, 0.12));

  // Nav items
  const navItems = [
    { key: "dashboard",    label: "Dashboard" },
    { key: "applicants",   label: "Applicants",   badge: "12" },
    { key: "scholarships", label: "Scholarships" },
    { key: "providers",    label: "Providers",    badge: "3" },
    { key: "users",        label: "Users" },
    { key: "analytics",    label: "Analytics" },
    { key: "logs",         label: "Audit Logs" },
  ];

  let navY = 150;
  navItems.forEach(item => {
    const isActive = item.key === activeItem;
    if (isActive) {
      frame.appendChild(rect(3, 34, 0, navY - 1, C.gold));
      frame.appendChild(rect(SIDEBAR, 34, 0, navY - 1, C.white, 0, 0.08));
    }
    const lbl = text(item.label, isActive ? F.semiBold : F.regular, 12, isActive ? C.gold : C.white, 20, navY + 9);
    frame.appendChild(lbl);
    if (item.badge) {
      const bw = 22;
      frame.appendChild(rect(bw, 16, SIDEBAR - bw - 12, navY + 10, C.coral, RADIUS.full));
      const bt = text(item.badge, F.bold, 8, C.white, 0, navY + 13);
      bt.x = SIDEBAR - bw - 12 + bw / 2 - bt.width / 2;
      frame.appendChild(bt);
    }
    navY += 40;
  });

  // Bottom links
  frame.appendChild(rect(SIDEBAR - 24, 1, 12, H - 90, C.white, 0, 0.12));
  frame.appendChild(text("⚙  Settings", F.regular, 12, C.greenLight, 20, H - 120));
  frame.appendChild(text("→  Sign out", F.regular, 12, C.coral, 20, H - 90));
}

// ── TOP BAR ──────────────────────────────────────────────────────
function addTopBar(frame, pageTitle) {
  frame.appendChild(rect(W, TOPBAR, 0, 0, C.surface));
  frame.appendChild(rect(W, 1, 0, TOPBAR, C.border));
  frame.appendChild(text("Admin", F.regular, 11, C.textMuted, SIDEBAR + 20, 26));
  frame.appendChild(text("›", F.regular, 11, C.textMuted, SIDEBAR + 58, 26));
  frame.appendChild(text(pageTitle, F.semiBold, 11, C.green, SIDEBAR + 70, 26));

  // Search
  const searchW = 280;
  const searchX = SIDEBAR + (CONTENT_W - searchW) / 2 - 40;
  const searchBar = rect(searchW, 36, searchX, 14, C.bg, RADIUS.full);
  searchBar.strokes = [{ type: "SOLID", color: C.border }];
  frame.appendChild(searchBar);
  frame.appendChild(text("🔍  Search anything…", F.regular, 11, C.textMuted, searchX + 16, 24));

  // Bell
  const bellX = W - 96;
  frame.appendChild(ellipse(34, 34, bellX, 15, C.bg, 1));
  const bellHandle = rect(2, 24, bellX, TOPBAR - 20, C.textSec);
  bellHandle.cornerRadius = 1;
  frame.appendChild(bellHandle);
  frame.appendChild(ellipse(16, 16, bellX + 22, TOPBAR - 24, C.coral));
  const badgeT = text("4", F.bold, 7, C.white, 0, 15);
  badgeT.x = bellX + 28 - badgeT.width / 2;
  frame.appendChild(badgeT);

  // Avatar
  frame.appendChild(ellipse(34, 34, W - 52, TOPBAR - 20, C.navy));
  const avT = text("AD", F.bold, 10, C.white, 0, 0);
  avT.x = W - 35 - avT.width / 2;
  avT.y = 20 - avT.height / 2;
  frame.appendChild(avT);
}

// ── TABLE HELPERS ────────────────────────────────────────────────
function addTableHeader(frame, cols, x, y, totalW) {
  frame.appendChild(rect(totalW, 32, x, y, C.bg));
  let cx = x + 14;
  cols.forEach(col => {
    frame.appendChild(text(col.label.toUpperCase(), F.semiBold, 9, C.textMuted, cx, y + 11));
    cx += col.w;
  });
}

function addTableRow(frame, cols, data, x, y, totalW, i, selected = false) {
  const ROW_H = 52;
  if (selected) {
    frame.appendChild(rect(totalW, ROW_H, x, y, C.greenLight, 0, 0.3));
  } else if (i % 2 === 1) {
    frame.appendChild(rect(totalW, ROW_H, x, y, C.bg, 0, 0.4));
  }
  let cx = x + 14;
  cols.forEach((col, ci) => {
    const val = data[ci];
    const midY = y + ROW_H / 2;
    if (col.type === "avatar") {
      frame.appendChild(ellipse(30, 30, cx, midY - 15, C.greenLight));
      const initials = val.split(" ").map(n => n[0]).join("").slice(0, 2);
      const avT = text(initials, F.semiBold, 9, C.green, 0, 0);
      avT.x = cx + 15 - avT.width / 2; avT.y = midY - 15 + 15 - avT.height / 2;
      frame.appendChild(avT);
      frame.appendChild(text(val, F.semiBold, 11, C.textPri, cx + 36, midY - 8));
    } else if (col.type === "pill") {
      statusPill(frame, val, cx, midY - 10);
    } else {
      frame.appendChild(text(val, F.regular, 11, C.textSec, cx, midY - 8));
    }
    cx += col.w;
  });
  frame.appendChild(rect(totalW, 1, x, y + ROW_H, C.border, 0, 0.6));
}

// ── STAT CARD ────────────────────────────────────────────────────
function addStatCard(frame, value, label, accent, x, y, w = 168, trend = null, sparkData = []) {
  addCard(frame, w, 108, x, y);
  frame.appendChild(rect(3, 60, x, y + 24, accent, 2));
  frame.appendChild(text(value, F.bold, 28, accent, x + 14, y + 16));
  frame.appendChild(text(label, F.regular, 10, C.textSec, x + 14, y + 56, { width: w - 60, lineHeight: 14 }));

  // Sparkline
  if (sparkData.length) {
    const barW = 6;
    const barMaxH = 18;
    const sparkX = x + w - 14 - sparkData.length * (barW + 3);
    const sparkY = y + 88;
    sparkData.forEach((pct, i) => {
      const bh = Math.max(4, Math.floor(barMaxH * pct));
      frame.appendChild(rect(barW, bh, sparkX + i * (barW + 3), sparkY - bh, accent, 1, 0.25 + pct * 0.75));
    });
  }

  // Trend
  if (trend) {
    const up = trend.startsWith("+");
    const tc = up ? C.green : C.coral;
    const tbg = up ? C.greenLight : C.coralLight;
    const tw = 40;
    frame.appendChild(rect(tw, 18, x + w - tw - 10, y + 10, tbg, RADIUS.full));
    const tt = text(trend, F.semiBold, 8, tc, x + w - tw - 10 + tw / 2, y + 14);
    tt.x = x + w - tw - 10 + tw / 2 - tt.width / 2;
    frame.appendChild(tt);
  }
}

// ── SCREEN FRAME ─────────────────────────────────────────────────
function createScreenFrame(name, xOffset) {
  const frame = figma.createFrame();
  frame.name = name;
  frame.resize(W, H);
  frame.clipsContent = true;
  frame.x = xOffset;
  frame.y = 0;
  frame.fills = [{ type: "SOLID", color: C.bg }];
  return frame;
}

// ═══════════════════════════════════════════════════════════════════
// SCREEN BUILDERS
// ═══════════════════════════════════════════════════════════════════

// 1. LOGIN
function buildLogin(frame) {
  const SPLIT = 400;
  frame.appendChild(rect(SPLIT, H, 0, 0, C.green));

  // Dot pattern
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 6; col++) {
      frame.appendChild(ellipse(3, 3, 24 + col * 60, 24 + row * 132, C.white, 0.07));
    }
  }

  // Logo block
  frame.appendChild(rect(80, 80, 160, 220, C.greenDark, RADIUS.xl));
  const mono = text("S", F.bold, 42, C.gold, 0, 232);
  mono.x = 200 - mono.width / 2;
  frame.appendChild(mono);
  const appName = text("Scholaris", F.bold, 36, C.white, 0, 316);
  appName.x = 200 - appName.width / 2;
  frame.appendChild(appName);
  const tagline = text("Admin Control Panel", F.medium, 14, C.greenLight, 0, 360);
  tagline.x = 200 - tagline.width / 2;
  frame.appendChild(tagline);

  // Trust badges
  ["🔒  Secure", "🏛  Government-Grade", "👤  Role-Based"].forEach((b, i) => {
    const bw = 140, bx = 200 - bw / 2, by = 420 + i * 44;
    frame.appendChild(rect(bw, 28, bx, by, C.white, RADIUS.full, 0.1));
    frame.appendChild(text(b, F.medium, 11, C.white, 0, by + 8, { width: bw - 8 }));
  });

  // Login card
  const cardW = 480, cardH = 580, cardX = SPLIT + (W - SPLIT - cardW) / 2, cardY = (H - cardH) / 2;
  addCard(frame, cardW, cardH, cardX, cardY, RADIUS.xl);

  frame.appendChild(text("Welcome back", F.bold, 26, C.textPri, cardX + 40, cardY + 40));
  frame.appendChild(text("Sign in to your admin account", F.regular, 13, C.textSec, cardX + 40, cardY + 74));
  frame.appendChild(rect(cardW - 80, 1, cardX + 40, cardY + 104, C.border));

  // Email
  frame.appendChild(text("Email address", F.semiBold, 11, C.textPri, cardX + 40, cardY + 120));
  const ef = rect(cardW - 80, 46, cardX + 40, cardY + 138, C.bg, RADIUS.sm);
  ef.strokes = [{ type: "SOLID", color: C.border }]; ef.strokeWeight = 1.5;
  frame.appendChild(ef);
  frame.appendChild(text("admin@scholaris.gov.ph", F.regular, 13, C.textMuted, cardX + 56, cardY + 151));

  // Password
  frame.appendChild(text("Password", F.semiBold, 11, C.textPri, cardX + 40, cardY + 202));
  const pf = rect(cardW - 80, 46, cardX + 40, cardY + 220, C.bg, RADIUS.sm);
  pf.strokes = [{ type: "SOLID", color: C.green }]; pf.strokeWeight = 1.5;
  frame.appendChild(pf);
  frame.appendChild(text("••••••••••••", F.regular, 18, C.textPri, cardX + 56, cardY + 231));

  // Role
  frame.appendChild(text("Role", F.semiBold, 11, C.textPri, cardX + 40, cardY + 284));
  const rf = rect(cardW - 80, 46, cardX + 40, cardY + 302, C.bg, RADIUS.sm);
  rf.strokes = [{ type: "SOLID", color: C.border }]; rf.strokeWeight = 1.5;
  frame.appendChild(rf);
  frame.appendChild(text("System Administrator", F.regular, 13, C.textPri, cardX + 56, cardY + 315));
  frame.appendChild(text("▾", F.regular, 13, C.textMuted, cardX + cardW - 80 - 20, cardY + 317));

  // Forgot
  const fw = text("Forgot password?", F.medium, 12, C.goldDark, 0, cardY + 364);
  fw.x = cardX + cardW / 2 - fw.width / 2;
  frame.appendChild(fw);

  // Sign in
  frame.appendChild(rect(cardW - 80, 50, cardX + 40, cardY + 392, C.green, RADIUS.sm));
  const bt = text("Sign in to Admin Portal  →", F.semiBold, 14, C.white, 0, cardY + 406);
  bt.x = cardX + cardW / 2 - bt.width / 2;
  frame.appendChild(bt);

  // Footer
  frame.appendChild(rect(cardW - 80, 1, cardX + 40, cardY + 458, C.border));
  frame.appendChild(text("🔒  Government-secured  ·  Access logged & monitored", F.regular, 10, C.textMuted, 0, cardY + 470));
  const vt = text("Scholaris Admin v2.0  ·  © 2026", F.regular, 9, C.textMuted, 0, cardY + 494);
  vt.x = cardX + cardW / 2 - vt.width / 2;
  frame.appendChild(vt);
}

// 2. DASHBOARD
function buildDashboard(frame) {
  addSidebar(frame, "dashboard");
  addTopBar(frame, "Dashboard");

  const CX = CONTENT_X + 20, CW = CONTENT_W - 40;
  let y = CONTENT_Y + 18;

  addCard(frame, CW, 60, CX, y);
  frame.appendChild(text("Good morning, Admin 👋", F.semiBold, 14, C.white, CX + 18, y + 12));
  frame.appendChild(text("Here's your Scholaris platform overview  ·  Mon, Aug 10, 2026", F.regular, 11, C.greenLight, CX + 18, y + 34));
  const rbtn = rect(88, 28, CX + CW - 100, y + 16, C.greenDark, RADIUS.sm);
  frame.appendChild(rbtn);
  frame.appendChild(text("↺  Refresh", F.medium, 10, C.white, 0, y + 22));
  rbtn.x = rbtn.x; rbtn.y;

  y += 76;

  const kpis = [
    { v: "384", l: "Total applicants", c: C.green, trend: "+24", spark: [0.4,0.6,0.5,0.8,0.7,1.0] },
    { v: "261", l: "Approved", c: C.gold, trend: "+18", spark: [0.3,0.5,0.6,0.7,0.9,1.0] },
    { v: "46", l: "Rejected", c: C.coral, trend: "-3", spark: [1.0,0.8,0.6,0.5,0.4,0.3] },
    { v: "77", l: "Pending review", c: C.navy, trend: "+6", spark: [0.5,0.4,0.7,0.6,0.8,0.9] },
  ];
  const cardW = Math.floor((CW - 36) / 4);
  kpis.forEach((k, i) => addStatCard(frame, k.v, k.l, k.c, CX + i * (cardW + 12), y, cardW, k.trend, k.spark));

  y += 124;

  const leftW = Math.floor(CW * 0.58), rightW = CW - leftW - 16, rightX = CX + leftW + 16;

  addCard(frame, leftW, 340, CX, y);
  frame.appendChild(text("Recent activity", F.semiBold, 13, C.textPri, CX + 16, y + 16));
  const viewAllT = text("View all →", F.medium, 10, C.green, 0, y + 18);
  viewAllT.x = CX + leftW - viewAllT.width - 16;
  frame.appendChild(viewAllT);

  const activities = [
    { dot: C.green, msg: "Application #0088 approved — Juan Reyes (DOST Merit Award)", time: "9:38 AM" },
    { dot: C.coral, msg: "Application #0091 flagged for review — Ana Lim", time: "9:11 AM" },
    { dot: C.gold, msg: "New scholarship listed — LGU Ormoc 2026 Grant", time: "8:54 AM" },
    { dot: C.blue, msg: "Provider verified — SM Foundation account activated", time: "Aug 9" },
    { dot: C.coral, msg: "Application #0081 rejected — incomplete documents", time: "Aug 9" },
    { dot: C.green, msg: "User Maria Santos completed her profile", time: "Aug 9" },
    { dot: C.purple, msg: "User Nico Bautista account suspended by admin", time: "Aug 8" },
    { dot: C.gold, msg: "CHED Tertiary Grant — 50 new slots opened", time: "Aug 8" },
  ];
  activities.forEach((a, i) => {
    const ay = y + 48 + i * 36;
    frame.appendChild(ellipse(8, 8, CX + 16, ay + 5, a.dot));
    frame.appendChild(text(a.msg, F.regular, 10, C.textPri, CX + 32, ay, { width: leftW - 100, lineHeight: 15 }));
    const tt = text(a.time, F.regular, 9, C.textMuted, 0, ay);
    tt.x = CX + leftW - tt.width - 16;
    frame.appendChild(tt);
    if (i < activities.length - 1)
      frame.appendChild(rect(leftW - 32, 1, CX + 16, ay + 28, C.border, 0, 0.4));
  });

  addCard(frame, rightW, 340, rightX, y);
  frame.appendChild(text("Status breakdown", F.semiBold, 13, C.textPri, rightX + 16, y + 16));

  const breakdown = [
    { label: "Approved", count: "261", pct: 68, color: C.green },
    { label: "Pending", count: "77", pct: 20, color: C.gold },
    { label: "Rejected", count: "46", pct: 12, color: C.coral },
    { label: "Flagged", count: "12", pct: 3, color: C.blue },
  ];
  breakdown.forEach((b, i) => {
    const by = y + 56 + i * 68;
    frame.appendChild(text(b.label, F.semiBold, 11, C.textPri, rightX + 16, by));
    const ct = text(b.count, F.bold, 13, b.color, 0, by - 2);
    ct.x = rightX + rightW - ct.width - 16;
    frame.appendChild(ct);
    frame.appendChild(text(b.pct + "%", F.regular, 9, C.textMuted, rightX + 16, by + 18));
    const barW = rightW - 32;
    frame.appendChild(rect(barW, 12, rightX + 16, by + 32, C.bg, 6));
    frame.appendChild(rect(Math.floor(barW * b.pct / 100), 12, rightX + 16, by + 32, b.color, 6));
  });

  y += 356;

  frame.appendChild(text("Recent applicants", F.semiBold, 13, C.textPri, CX, y));
  const seeAll = text("See all →", F.medium, 10, C.green, 0, y + 2);
  seeAll.x = CX + CW - seeAll.width;
  frame.appendChild(seeAll);
  y += 24;

  addCard(frame, CW, 52 * 5 + 32 + 40, CX, y);
  addTableHeader(frame, [
    { label: "Name", w: 160, type: "avatar" },
    { label: "Scholarship", w: 150, type: "text" },
    { label: "School", w: 120, type: "text" },
    { label: "Date", w: 96, type: "text" },
    { label: "Status", w: 80, type: "pill" },
  ], CX, y, CW);
  const rows = [
    ["Maria Santos", "CHED Tertiary Grant", "WLC Ormoc", "Aug 9, 2026", "Pending"],
    ["Juan Reyes", "DOST Merit Award", "ORO State", "Aug 8, 2026", "Approved"],
    ["Ana Lim", "WLC Ormoc", "Aug 7, 2026", "Flagged"],
    ["Ben Macias", "Visayas State", "Aug 6, 2026", "Rejected"],
    ["Cleo Pante", "ORO State", "Aug 5, 2026", "Approved"],
    ["Diana Flores", "WLC Ormoc", "Aug 4, 2026", "Active"],
    ["Nico Bautista", "Visayas State", "Aug 3, 2026", "Pending"],
    ["Rosa Mercado", "ORO State", "Aug 2, 2026", "Active"],
  ];
  rows.forEach((r, i) => addTableRow(frame, [
    { label: "Name", w: 160, type: "avatar" },
    { label: "Scholarship", w: 150, type: "text" },
    { label: "School", w: 120, type: "text" },
    { label: "Date", w: 96, type: "text" },
    { label: "Status", w: 80, type: "pill" },
  ], r, CX, y + 32 + i * 52, CW, i));
  paginationRow(frame, CX, y + 32 + 8 * 52, CW);
}

// 3. APPLICANTS
function buildApplicants(frame) {
  addSidebar(frame, "applicants");
  addTopBar(frame, "Applicants");

  const CX = CONTENT_X + 20, CW = CONTENT_W - 40;
  let y = CONTENT_Y + 18;

  const FP = 148;
  addCard(frame, FP, CONTENT_H - 36, CX, y);
  frame.appendChild(text("FILTER", F.semiBold, 9, C.textMuted, CX + 14, y + 14));
  const filters = ["All","Pending","Approved","Rejected","Flagged","Review","Suspended"];
  const filterCounts = ["384","77","261","46","12","8","4"];
  filters.forEach((f, i) => {
    const fy = y + 34 + i * 44, isActive = i === 0;
    if (isActive) {
      frame.appendChild(rect(FP - 16, 32, CX + 8, fy - 4, C.greenLight, RADIUS.sm));
      frame.appendChild(rect(FP - 20, 32, CX + 4, fy - 8, C.green, RADIUS.sm));
    }
    frame.appendChild(text(f, isActive ? F.semiBold : F.regular, 11, isActive ? C.white : C.textSec, CX + 16, fy + 4));
    const ct = text(filterCounts[i], F.semiBold, 9, isActive ? C.greenLight : C.textMuted, 0, fy + 6);
    ct.x = CX + FP - ct.width - 18;
    frame.appendChild(ct);
  });

  const MX = CX + FP + 14, MW = CW - FP - 14;
  frame.appendChild(text("Applicants", F.bold, 20, C.textPri, MX, y));

  const searchF = rect(240, 38, MX, y + 32, C.surface, RADIUS.full);
  searchF.strokes = [{ type: "SOLID", color: C.border }]; searchF.strokeWeight = 1;
  frame.appendChild(searchF);
  frame.appendChild(text("🔍  Search applicants…", F.regular, 11, C.textMuted, MX + 14, y + 43));

  const filterDD = rect(130, 38, MX + 252, y + 32, C.surface, RADIUS.sm);
  filterDD.strokes = [{ type: "SOLID", color: C.border }]; filterDD.strokeWeight = 1;
  frame.appendChild(filterDD);
  frame.appendChild(text("All users  ▾", F.medium, 11, C.textPri, MX + 264, y + 43));

  const exportBtn = rect(90, 38, MX + MW - 90, y + 32, C.surface, RADIUS.sm);
  exportBtn.strokes = [{ type: "SOLID", color: C.border }]; exportBtn.strokeWeight = 1;
  frame.appendChild(exportBtn);
  const et = text("↓  Export", F.semiBold, 10, C.textPri, 0, y + 43);
  et.x = MX + MW - 90 + 45 - et.width / 2;
  frame.appendChild(et);

  y += 56;

  const tableH = 52 * 8 + 32 + 40;
  addCard(frame, MW, tableH, MX, y);
  addTableHeader(frame, [
    { label: "Name", w: 160, type: "avatar" },
    { label: "Scholarship", w: 150, type: "text" },
    { label: "School", w: 120, type: "text" },
    { label: "Date", w: 96, type: "text" },
    { label: "GWA", w: 56, type: "text" },
    { label: "Status", w: 60, type: "pill" },
  ], MX, y, MW);

  const applicants = [
    ["Maria Santos", "CHED Tertiary Grant", "WLC Ormoc", "Aug 9, 2026", "1.50", "Pending"],
    ["Juan Reyes", "DOST Merit Award", "ORO State", "Aug 8, 2026", "1.25", "Approved"],
    ["Ana Lim", "WLC Ormoc", "Aug 7, 2026", "1.75", "Flagged"],
    ["Ben Macias", "Visayas State", "Aug 6, 2026", "2.00", "Rejected"],
    ["Cleo Pante", "ORO State", "Aug 5, 2026", "1.00", "Approved"],
    ["Diana Flores", "WLC Ormoc", "Aug 4, 2026", "1.50", "Active"],
    ["Nico Bautista", "Visayas State", "Aug 3, 2026", "1.75", "Suspended"],
    ["Rosa Mercado", "ORO State", "Aug 2, 2026", "1.25", "Active"],
  ];
  applicants.forEach((r, i) => addTableRow(frame, [
    { label: "Name", w: 160, type: "avatar" },
    { label: "Scholarship", w: 150, type: "text" },
    { label: "School", w: 120, type: "text" },
    { label: "Date", w: 96, type: "text" },
    { label: "GWA", w: 56, type: "text" },
    { label: "Status", w: 60, type: "pill" },
  ], r, MX, y + 32 + i * 52, MW, i, i === 1));

  const selY = y + 32 + 1 * 52, actX = MX + MW - 180, actY = selY + 14;
  frame.appendChild(rect(52, 24, actX, actY, C.green, RADIUS.sm));
  frame.appendChild(text("Approve", F.semiBold, 8, C.white, actX + 26 - 22, actY + 7));
  frame.appendChild(rect(40, 24, actX + 58, actY, C.coralLight, RADIUS.sm));
  frame.appendChild(text("Flag", F.semiBold, 8, C.coral, actX + 58 + 20 - 8, actY + 7));
  frame.appendChild(rect(40, 24, actX + 104, actY, C.bg, RADIUS.sm));
  frame.appendChild(text("View", F.semiBold, 8, C.textSec, actX + 104 + 20 - 4, actY + 7));

  paginationRow(frame, MX, y + 32 + 10 * 52, MW);
}

// 4. SCHOLARSHIPS
function buildScholarships(frame) {
  addSidebar(frame, "scholarships");
  addTopBar(frame, "Scholarships");

  const CX = CONTENT_X + 20, CW = CONTENT_W - 40;
  let y = CONTENT_Y + 18;

  frame.appendChild(text("Scholarships", F.bold, 20, C.textPri, CX, y));

  frame.appendChild(rect(CW, 42, CX, y, C.coralLight, RADIUS.md));
  frame.appendChild(rect(4, 42, CX, y, C.coral, RADIUS.sm));
  frame.appendChild(text("⚠  3 providers are pending approval and need your review.", F.semiBold, 11, C.coral, CX + 16, y + 14));
  frame.appendChild(text("Review now →", F.semiBold, 11, C.coral, 0, y + 14));

  y += 56;

  const sf = rect(260, 38, CX, y, C.surface, RADIUS.full);
  sf.strokes = [{ type: "SOLID", color: C.border }]; sf.strokeWeight = 1;
  frame.appendChild(sf);
  frame.appendChild(text("🔍  Search scholarships…", F.regular, 11, C.textMuted, CX + 14, y + 11));

  const fdd = rect(120, 38, CX + 252, y, C.surface, RADIUS.sm);
  fdd.strokes = [{ type: "SOLID", color: C.border }]; fdd.strokeWeight = 1;
  frame.appendChild(fdd);
  frame.appendChild(text("All status  ▾", F.medium, 11, C.textPri, CX + 264, y + 11));

  y += 52;

  const scholarships = [
    { name: "CHED Tertiary Grant", provider: "CHED Region VIII", slots: "50", deadline: "Sep 15", applicants: "128", budget: "₱60,000/yr", status: "Active" },
    { name: "DOST Merit Award", provider: "DOST Region VIII", slots: "20", deadline: "Aug 30", applicants: "77", budget: "₱40,000/yr", status: "Active" },
    { name: "LGU Ormoc Scholarship", provider: "Ormoc City Gov't", slots: "30", deadline: "Sep 1", applicants: "54", budget: "₱20,000/yr", status: "Pending" },
    { name: "SM Foundation Scholar", provider: "SM Foundation", slots: "50", deadline: "Oct 1", applicants: "88", budget: "₱25,000/yr", status: "Active" },
  ];

  const cardW = Math.floor((CW - 16) / 2), cardH = 168;
  scholarships.forEach((s, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const cx = CX + col * (cardW + 16), cy = y + row * (cardH + 16);

    addCard(frame, cardW, cardH, cx, cy, RADIUS.lg);
    statusPill(frame, s.status, cx + cardW - 84, cy + 14);

    frame.appendChild(ellipse(36, 36, cx + 16, cy + 16, C.greenLight));
    const initials = s.provider.split(" ").map(w => w[0]).join("").slice(0, 2);
    const avT = text(initials, F.bold, 11, C.green, 0, 0);
    avT.x = cx + 16 + 18 - avT.width / 2; avT.y = cy + 16 + 18 - avT.height / 2;
    frame.appendChild(avT);

    frame.appendChild(text(s.name, F.semiBold, 13, C.textPri, cx + 60, cy + 18));
    frame.appendChild(text(s.provider, F.regular, 10, C.textMuted, cx + 60, cy + 36));
    frame.appendChild(rect(cardW - 32, 1, cx + 16, cy + 64, C.border, 0, 0.6));

    const stats = [{ label: "Slots", val: s.slots }, { label: "Applicants", val: s.applicants }, { label: "Budget", val: s.budget }];
    stats.forEach((st, si) => {
      const sx = cx + 16 + si * Math.floor((cardW - 32) / 3);
      frame.appendChild(text(st.val, F.bold, 14, C.green, sx, cy + 78));
      frame.appendChild(text(st.label, F.regular, 9, C.textMuted, sx, cy + 96));
    });

    frame.appendChild(rect(cardW - 32, 1, cx + 16, cy + 116, C.border, 0, 0.6));
    frame.appendChild(rect(90, 22, cx + 16, cy + 132, C.goldLight, RADIUS.full));
    frame.appendChild(text("📅  " + s.deadline, F.medium, 9, C.goldDark, 0, cy + 137));

    const editBtn = rect(64, 22, cx + cardW - 80, cy + 132, C.bg, RADIUS.sm);
    editBtn.strokes = [{ type: "SOLID", color: C.border }]; editBtn.strokeWeight = 1;
    frame.appendChild(editBtn);
    frame.appendChild(text("Edit  →", F.semiBold, 9, C.textSec, 0, cy + 137));
  });
}

// 5. PROVIDERS
function buildProviders(frame) {
  addSidebar(frame, "providers");
  addTopBar(frame, "Providers");

  const CX = CONTENT_X + 20, CW = CONTENT_W - 40;
  let y = CONTENT_Y + 18;

  frame.appendChild(text("Providers", F.bold, 20, C.textPri, CX, y));

  frame.appendChild(rect(CW, 42, CX, y, C.coralLight, RADIUS.md));
  frame.appendChild(rect(4, 42, CX, y, C.coral, RADIUS.sm));
  frame.appendChild(text("⚠  3 providers are pending approval and need your review.", F.semiBold, 11, C.coral, CX + 16, y + 14));
  frame.appendChild(text("Review now →", F.semiBold, 11, C.coral, 0, y + 14));

  y += 56;

  const sf = rect(260, 38, CX, y, C.surface, RADIUS.full);
  sf.strokes = [{ type: "SOLID", color: C.border }]; sf.strokeWeight = 1;
  frame.appendChild(sf);
  frame.appendChild(text("🔍  Search providers…", F.regular, 11, C.textMuted, CX + 14, y + 11));

  y += 52;

  addCard(frame, CW, 52 * 7 + 32 + 40, CX, y);
  addTableHeader(frame, [
    { label: "Organization", w: 180, type: "avatar" },
    { label: "Contact Email", w: 180, type: "text" },
    { label: "Scholarships", w: 100, type: "text" },
    { label: "Applicants", w: 90, type: "text" },
    { label: "Joined", w: 90, type: "text" },
    { label: "Status", w: 60, type: "pill" },
  ], CX, y, CW);

  const providers = [
    ["CHED Region VIII", "ched8@gov.ph", "3","210","Jan 2026","Active"],
    ["DOST Region VIII", "dost8@gov.ph", "2","124","Feb 2026","Active"],
    ["SM Foundation", "sm@smfoundation.org", "1","88","Mar 2026","Active"],
    ["Ayala Foundation", "ayala@ayalafound.org", "1","76","Apr 2026","Active"],
    ["Ormoc City Gov't", "scholar@ormoc.gov.ph", "1","54","Jul 2026","Pending"],
    ["DSWD Region VIII", "dswd8@gov.ph", "1","12","Aug 2026","Pending"],
    ["Gaisano Found.", "gaisano@foundation.ph", "0","0","Aug 2026","Pending"],
  ];
  providers.forEach((r, i) => addTableRow(frame, [
    { label: "Organization", w: 180, type: "avatar" },
    { label: "Contact Email", w: 180, type: "text" },
    { label: "Scholarships", w: 100, type: "text" },
    { label: "Applicants", w: 90, type: "text" },
    { label: "Joined", w: 90, type: "text" },
    { label: "Status", w: 60, type: "pill" },
  ], r, CX, y + 32 + i * 52, CW, i));
  paginationRow(frame, CX, y + 32 + 7 * 52, CW);
}

// 6. USERS
function buildUsers(frame) {
  addSidebar(frame, "users");
  addTopBar(frame, "Users");

  const CX = CONTENT_X + 20, CW = CONTENT_W - 40;
  let y = CONTENT_Y + 18;

  frame.appendChild(text("Users", F.bold, 20, C.textPri, CX, y));

  const exportBtn = rect(90, 34, CX + CW - 90, y - 2, C.surface, RADIUS.sm);
  exportBtn.strokes = [{ type: "SOLID", color: C.border }]; exportBtn.strokeWeight = 1;
  frame.appendChild(exportBtn);
  frame.appendChild(text("↓  Export", F.semiBold, 10, C.textPri, 0, y + 9));

  y += 38;

  const strip = rect(CW, 40, CX, y, C.bg, RADIUS.sm);
  strip.strokes = [{ type: "SOLID", color: C.border }]; strip.strokeWeight = 1;
  frame.appendChild(strip);

  const pills = [
    { label: "Total Users", val: "384", color: C.textPri },
    { label: "Active", val: "361", color: C.green },
    { label: "Flagged", val: "19", color: C.gold },
    { label: "Suspended", val: "4", color: C.coral },
  ];
  pills.forEach((p, i) => {
    const px = CX + 20 + i * 130;
    frame.appendChild(text(p.val, F.bold, 13, p.color, px, y + 12));
    frame.appendChild(text(p.label, F.regular, 10, C.textMuted, px + 20, y + 14));
  });

  y += 54;

  const sf = rect(240, 38, CX, y, C.surface, RADIUS.full);
  sf.strokes = [{ type: "SOLID", color: C.border }]; sf.strokeWeight = 1;
  frame.appendChild(sf);
  frame.appendChild(text("🔍  Search users…", F.regular, 11, C.textMuted, CX + 14, y + 11));

  const fdd = rect(120, 38, CX + 252, y, C.surface, RADIUS.sm);
  fdd.strokes = [{ type: "SOLID", color: C.border }]; fdd.strokeWeight = 1;
  frame.appendChild(fdd);
  frame.appendChild(text("All users  ▾", F.medium, 11, C.textPri, CX + 264, y + 11));

  y += 52;

  const tableH = 52 * 8 + 32 + 40;
  addCard(frame, CW, tableH, CX, y);
  addTableHeader(frame, [
    { label: "Name", w: 160, type: "avatar" },
    { label: "Email", w: 190, type: "text" },
    { label: "School", w: 140, type: "text" },
    { label: "Applications", w: 100, type: "text" },
    { label: "Joined", w: 90, type: "text" },
    { label: "Status", w: 60, type: "pill" },
  ], CX, y, CW);

  const users = [
    ["Maria Santos", "m.santos@email.com", "WLC Ormoc", "3","Jun 2026","Active"],
    ["Juan Reyes", "j.reyes@email.com", "ORO State", "1","Jun 2026","Active"],
    ["Ana Lim", "a.lim@email.com", "WLC Ormoc", "2","Jul 2026","Flagged"],
    ["Ben Macias", "b.macias@email.com", "Visayas State", "1","Jul 2026","Active"],
    ["Cleo Pante", "c.pante@email.com", "ORO State", "2","Jul 2026","Active"],
    ["Diana Flores", "d.flores@email.com", "WLC Ormoc", "1","Aug 2026","Active"],
    ["Nico Bautista", "n.bautista@email.com", "Visayas State", "1","Aug 2026","Suspended"],
    ["Rosa Mercado", "r.mercado@email.com", "ORO State", "3","Aug 2026","Active"],
  ];
  users.forEach((r, i) => addTableRow(frame, [
    { label: "Name", w: 160, type: "avatar" },
    { label: "Email", w: 190, type: "text" },
    { label: "School", w: 140, type: "text" },
    { label: "Applications", w: 100, type: "text" },
    { label: "Joined", w: 90, type: "text" },
    { label: "Status", w: 60, type: "pill" },
  ], r, CX, y + 32 + i * 52, CW, i));
  paginationRow(frame, CX, y + 32 + 8 * 52, CW);
}

// 7. ANALYTICS
function buildAnalytics(frame) {
  addSidebar(frame, "analytics");
  addTopBar(frame, "Analytics");

  const CX = CONTENT_X + 20, CW = CONTENT_W - 40;
  let y = CONTENT_Y + 18;

  frame.appendChild(text("Analytics", F.bold, 20, C.textPri, CX, y));
  const expBtn = rect(110, 34, CX + CW - 110, y - 2, C.surface, RADIUS.sm);
  expBtn.strokes = [{ type: "SOLID", color: C.border }]; expBtn.strokeWeight = 1;
  frame.appendChild(expBtn);
  frame.appendChild(text("↓  Export report", F.semiBold, 10, C.textPri, 0, y + 9));

  y += 38;

  const kpis = [
    { v: "68%", l: "Approval rate", c: C.green, trend: "+4%", spark: [0.5,0.6,0.7,0.8,0.9,1.0] },
    { v: "3.2d", l: "Avg. processing time", c: C.navy, trend: null, spark: [0.8,0.7,0.6,0.5,0.6,0.5] },
    { v: "₱4.8M", l: "Total awarded (est.)", c: C.gold, trend: "+0.6M", spark: [0.4,0.5,0.6,0.7,0.8,1.0] },
    { v: "14", l: "Schools represented", c: C.purple, trend: "+2", spark: [0.6,0.7,0.7,0.8,0.9,1.0] },
  ];
  const kw = Math.floor((CW - 36) / 4);
  kpis.forEach((k, i) => addStatCard(frame, k.v, k.l, k.c, CX + i * (kw + 12), y, kw, k.trend, k.spark));

  y += 124;

  const leftW = Math.floor(CW * 0.55), rightW = CW - leftW - 16, rightX = CX + leftW + 16;

  addCard(frame, leftW, 260, CX, y);
  frame.appendChild(text("Applications per month", F.semiBold, 13, C.textPri, CX + 16, y + 16));

  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"], barVals = [0.45,0.60,0.55,0.80,0.70,1.00,0.85,0.90,0.75,0.65,0.55,0.45];
  const chartH = 140, chartY = y + 44, bw = 36;
  months.forEach((m, i) => {
    const bh = Math.max(4, Math.floor(chartH * barVals[i]));
    const bx = CX + 24 + i * (bw + 1);
    const by = chartY + chartH - bh;
    frame.appendChild(rect(bw, chartH, bx, chartY, C.bg, RADIUS.sm));
    frame.appendChild(rect(bw, bh, bx, by, C.green, RADIUS.sm));
    frame.appendChild(text(String(Math.floor(60 + barVals[i] * 80)), F.semiBold, 9, C.green, bx + bw / 2 - 6, by - 16));
    frame.appendChild(text(m, F.regular, 9, C.textMuted, bx + bw / 2 - 4, chartY + chartH + 8));
  });

  addCard(frame, rightW, 260, rightX, y);
  frame.appendChild(text("Status breakdown", F.semiBold, 13, C.textPri, rightX + 16, y + 16));

  const statuses = [
    { label: "Approved", count: "261", pct: 68, color: C.green },
    { label: "Pending", count: "77", pct: 20, color: C.gold },
    { label: "Rejected", count: "46", pct: 12, color: C.coral },
    { label: "Flagged", count: "12", pct: 3, color: C.blue },
  ];
  statuses.forEach((s, i) => {
    const sy = y + 56 + i * 68;
    frame.appendChild(text(s.label, F.semiBold, 11, C.textPri, rightX + 16, sy));
    const ct = text(s.count, F.bold, 13, s.color, 0, sy - 2);
    ct.x = rightX + rightW - ct.width - 16;
    frame.appendChild(ct);
    frame.appendChild(text(s.pct + "%", F.regular, 9, C.textMuted, rightX + 16, sy + 18));
    const barW = rightW - 32;
    frame.appendChild(rect(barW, 12, rightX + 16, sy + 32, C.bg, 6));
    frame.appendChild(rect(Math.floor(barW * s.pct / 100), 12, rightX + 16, sy + 32, s.color, 6));
  });

  y += 276;

  frame.appendChild(text("School breakdown", F.semiBold, 13, C.textPri, CX, y));
  y += 24;

  addCard(frame, CW, 52 * 5 + 32 + 40, CX, y);
  addTableHeader(frame, [
    { label: "School", w: 220, type: "text" },
    { label: "Applicants", w: 110, type: "text" },
    { label: "Approved", w: 110, type: "text" },
    { label: "Approval Rate", w: 120, type: "pill" },
  ], CX, y, CW);

  const schools = [
    ["WLC Ormoc", "142", "98", "Approved"],
    ["ORO State", "118", "79", "Review"],
    ["Visayas State", "86", "54", "Approved"],
    ["ORO Tech", "28", "18", "Approved"],
    ["Ormoc City Coll.", "10", "4", "Pending"],
  ];
  schools.forEach((r, i) => addTableRow(frame, [
    { label: "School", w: 220, type: "text" },
    { label: "Applicants", w: 110, type: "text" },
    { label: "Approved", w: 110, type: "text" },
    { label: "Approval Rate", w: 120, type: "pill" },
  ], r, CX, y + 32 + i * 52, CW, i));
  paginationRow(frame, CX, y + 32 + 5 * 52, CW);
}

// 8. AUDIT LOGS
function buildLogs(frame) {
  addSidebar(frame, "logs");
  addTopBar(frame, "Audit Logs");

  const CX = CONTENT_X + 20, CW = CONTENT_W - 40;
  let y = CONTENT_Y + 18;

  frame.appendChild(text("Audit logs", F.bold, 20, C.textPri, CX, y));
  const expBtn = rect(110, 34, CX + CW - 110, y - 2, C.surface, RADIUS.sm);
  expBtn.strokes = [{ type: "SOLID", color: C.border }]; expBtn.strokeWeight = 1;
  frame.appendChild(expBtn);
  frame.appendChild(text("↓  Export logs", F.semiBold, 10, C.textPri, 0, y + 9));

  y += 38;

  const sf = rect(260, 38, CX, y, C.surface, RADIUS.full);
  sf.strokes = [{ type: "SOLID", color: C.border }]; sf.strokeWeight = 1;
  frame.appendChild(sf);
  frame.appendChild(text("🔍  Search logs…", F.regular, 11, C.textMuted, CX + 14, y + 11));

  const fdd = rect(140, 38, CX + 272, y, C.surface, RADIUS.sm);
  fdd.strokes = [{ type: "SOLID", color: C.border }]; fdd.strokeWeight = 1;
  frame.appendChild(fdd);
  frame.appendChild(text("All actions  ▾", F.medium, 11, C.textPri, CX + 284, y + 11));

  y += 52;

  const logs = [
    { time: "Aug 10, 9:38 AM", actor: "Admin", action: "Approved", target: "Application #0088 — J. Reyes", ip: "192.168.1.10", sev: C.green },
    { time: "Aug 10, 9:11 AM", actor: "Admin", action: "Flagged", target: "Application #0091 — A. Lim", ip: "192.168.1.10", sev: C.coral },
    { time: "Aug 9, 4:22 PM", actor: "DSWD (Provider)", action: "Active", target: "Scholarship: DSWD Crisis Fund", ip: "10.0.0.22", sev: C.green },
    { time: "Aug 9, 2:05 PM", actor: "Admin", action: "Rejected", target: "Application #0081 — B. Macias", ip: "—", sev: C.coral },
    { time: "Aug 9, 11:30 AM", actor: "Admin", action: "Verified", target: "Provider: SM Foundation account", ip: "192.168.1.10", sev: C.blue },
    { time: "Aug 8, 3:14 PM", actor: "Admin", action: "Pending", target: "Scholarship: LGU Ormoc — review req", ip: "192.168.1.10", sev: C.gold },
    { time: "Aug 8, 10:00 AM", actor: "System", action: "Active", target: "Scholarship: CHED Tertiary published", ip: "—", sev: C.green },
    { time: "Aug 7, 5:44 PM", actor: "Admin", action: "Suspended", target: "User: Nico Bautista account", ip: "192.168.1.10", sev: C.purple },
  ];

  const tableH = 52 * logs.length + 32 + 40;
  addCard(frame, CW, tableH, CX, y);
  addTableHeader(frame, [
    { label: "Timestamp", w: 148, type: "text" },
    { label: "Actor", w: 130, type: "text" },
    { label: "Action", w: 90, type: "pill" },
    { label: "Target", w: 260, type: "text" },
    { label: "IP Address", w: 120, type: "text" },
  ], CX, y, CW);

  logs.forEach((log, i) => {
    addTableRow(frame, [log.time, log.actor, log.action, log.target, log.ip], CX, y + 32 + i * 52, CW, i);
    frame.appendChild(rect(4, 52, CX, y + 32 + i * 52, log.sev, 0, 0.7));
  });
  paginationRow(frame, CX, y + 32 + logs.length * 52, CW);
}

// 9. APPLICANT DETAIL
function buildApplicantDetail(frame) {
  addSidebar(frame, "applicants");
  addTopBar(frame, "Applicant Detail");

  const CX = CONTENT_X + 20, CW = CONTENT_W - 40;
  let y = CONTENT_Y + 18;

  const backBtn = rect(90, 30, CX, y, C.bg, RADIUS.sm);
  backBtn.strokes = [{ type: "SOLID", color: C.border }]; backBtn.strokeWeight = 1;
  frame.appendChild(backBtn);
  frame.appendChild(text("← Back", F.medium, 11, C.textSec, CX + 10, y + 8));
  frame.appendChild(text("Applicant Detail", F.bold, 20, C.textPri, CX + 104, y + 4));

  y += 46;

  const leftW = 280, rightW = CW - leftW - 16, rightX = CX + leftW + 16;

  addCard(frame, leftW, 320, CX, y);
  frame.appendChild(ellipse(72, 72, CX + leftW / 2 - 36, y + 20, C.greenLight));
  const avT = text("MS", F.bold, 22, C.green, 0, 0);
  avT.x = CX + leftW / 2 - avT.width / 2;
  avT.y = y + 56 - avT.height / 2;
  frame.appendChild(avT);
  frame.appendChild(text("Maria Santos", F.bold, 16, C.textPri, 0, y + 104));
  frame.appendChild(text("WLC Ormoc", F.regular, 11, C.textMuted, 0, y + 124));
  statusPill(frame, "Pending", CX + leftW / 2 - 35, y + 144);

  frame.appendChild(rect(leftW - 32, 1, CX + 16, y + 174, C.border, 0, 0.6));

  const details = [{ label: "Email", val: "m.santos@email.com" }, { label: "Phone", val: "+63 912 345 6789" }, { label: "GWA", val: "1.50" }, { label: "Year Level", val: "3rd Year" }, { label: "Course", val: "BSIT" }];
  details.forEach((d, i) => {
    const dy = y + 188 + i * 24;
    frame.appendChild(text(d.label, F.regular, 10, C.textMuted, CX + 16, dy));
    const vt = text(d.val, F.semiBold, 10, C.textPri, 0, dy);
    vt.x = CX + leftW - vt.width - 16;
    frame.appendChild(vt);
  });

  addCard(frame, leftW, 200, CX, y + 336);
  frame.appendChild(text("Status history", F.semiBold, 12, C.textPri, CX + 16, y + 352));
  const history = [{ status: "Pending", date: "Aug 9, 2026", color: C.gold }, { status: "Submitted", date: "Aug 8, 2026", color: C.blue }, { status: "Draft", date: "Aug 7, 2026", color: C.textMuted }];
  history.forEach((h, i) => {
    const hy = y + 374 + i * 44;
    frame.appendChild(ellipse(10, 10, CX + 16, hy + 4, h.color));
    if (i < history.length - 1) frame.appendChild(rect(2, 34, CX + 20, hy + 14, h.color, 0, 0.3));
    frame.appendChild(text(h.status, F.semiBold, 11, C.textPri, CX + 34, hy));
    frame.appendChild(text(h.date, F.regular, 9, C.textMuted, CX + 34, hy + 2));
  });

  addCard(frame, rightW, 120, rightX, y);
  frame.appendChild(text("Applied scholarship", F.semiBold, 12, C.textPri, rightX + 16, y + 16));
  frame.appendChild(ellipse(40, 40, rightX + 16, y + 40, C.greenLight));
  const schI = text("CH", F.bold, 13, C.green, 0, 0);
  schI.x = rightX + 36 - schI.width / 2; schI.y = y + 60 - schI.height / 2;
  frame.appendChild(schI);
  frame.appendChild(text("CHED Tertiary Grant", F.semiBold, 14, C.textPri, rightX + 64, y + 44));
  frame.appendChild(text("CHED Region VIII  ·  ₱60,000/yr  ·  Deadline: Sep 15, 2026", F.regular, 10, C.textMuted, rightX + 64, y + 62));
  statusPill(frame, "Active", rightX + rightW - 86, y + 44);

  addCard(frame, rightW, 220, rightX, y + 136);
  frame.appendChild(text("Submitted documents", F.semiBold, 12, C.textPri, rightX + 16, y + 152));
  const docs = [{ name: "Form 138 / Report Card", status: "Verified" }, { name: "Certificate of Enrollment", status: "Verified" }, { name: "PSA Birth Certificate", status: "Verified" }, { name: "Barangay Indigency Certificate", status: "Pending" }, { name: "2x2 ID Photo", status: "Rejected" }];
  docs.forEach((d, i) => {
    const dy = y + 174 + i * 34;
    const dotColor = d.status === "Verified" ? C.green : d.status === "Rejected" ? C.coral : C.gold;
    frame.appendChild(ellipse(8, 8, rightX + 16, dy + 6, dotColor));
    frame.appendChild(text(d.name, F.regular, 11, C.textPri, rightX + 32, dy + 2));
    statusPill(frame, d.status, rightX + rightW - 86, dy - 1);
    if (i < docs.length - 1) frame.appendChild(rect(rightW - 32, 1, rightX + 16, dy + 28, C.border, 0, 0.4));
  });

  addCard(frame, rightW, 140, rightX, y + 372);
  frame.appendChild(text("Evaluator notes", F.semiBold, 12, C.textPri, rightX + 16, y + 388));
  frame.appendChild(rect(rightW - 32, 80, rightX + 16, y + 408, C.bg, RADIUS.sm));
  frame.appendChild(text("Applicant is missing one document (2x2 ID Photo).\nRequesting resubmission before final evaluation.", F.regular, 10, C.textSec, rightX + 28, y + 418, { width: rightW - 56, lineHeight: 16 }));

  addCard(frame, rightW, 70, rightX, y + 528);
  frame.appendChild(rect(120, 38, rightX + 16, y + 542, C.green, RADIUS.sm));
  frame.appendChild(text("✓  Approve", F.semiBold, 12, C.white, rightX + 16 + 60 - 22, y + 553));
  frame.appendChild(rect(120, 38, rightX + 172, y + 542, C.coralLight, RADIUS.sm));
  frame.appendChild(text("✕  Reject", F.semiBold, 12, C.coral, rightX + 172 + 60 - 8, y + 553));
}

// 10. SCHOLARSHIP DETAIL
function buildScholarshipDetail(frame) {
  addSidebar(frame, "scholarships");
  addTopBar(frame, "Scholarship Detail");

  const CX = CONTENT_X + 20, CW = CONTENT_W - 40;
  let y = CONTENT_Y + 18;

  const backBtn = rect(90, 30, CX, y, C.bg, RADIUS.sm);
  backBtn.strokes = [{ type: "SOLID", color: C.border }]; backBtn.strokeWeight = 1;
  frame.appendChild(backBtn);
  frame.appendChild(text("← Back", F.medium, 11, C.textSec, CX + 10, y + 8));
  frame.appendChild(text("Scholarship Detail", F.bold, 20, C.textPri, CX + 104, y + 4));

  y += 46;

  const leftW = 280, rightW = CW - leftW - 16, rightX = CX + leftW + 16;

  addCard(frame, leftW, 360, CX, y);
  frame.appendChild(ellipse(64, 64, CX + leftW / 2 - 32, y + 20, C.greenLight));
  const avT = text("CH", F.bold, 20, C.green, 0, 0);
  avT.x = CX + leftW / 2 - avT.width / 2; avT.y = y + 52 - avT.height / 2;
  frame.appendChild(avT);
  frame.appendChild(text("CHED Tertiary Grant", F.bold, 14, C.textPri, 0, y + 96));
  frame.appendChild(text("CHED Region VIII", F.regular, 10, C.textMuted, 0, y + 114));
  statusPill(frame, "Active", CX + leftW / 2 - 35, y + 132);

  frame.appendChild(rect(leftW - 32, 1, CX + 16, y + 162, C.border, 0, 0.6));

  const info = [{ label: "Budget", val: "₱60,000/yr" }, { label: "Total Slots", val: "50" }, { label: "Filled Slots", val: "32" }, { label: "Available", val: "18" }, { label: "Deadline", val: "Sep 15, 2026" }, { label: "Posted", val: "Jan 10, 2026" }, { label: "Region", val: "Region VIII" }];
  info.forEach((d, i) => {
    const dy = y + 176 + i * 24;
    frame.appendChild(text(d.label, F.regular, 10, C.textMuted, CX + 16, dy));
    const vt = text(d.val, F.semiBold, 10, C.green, 0, dy);
    vt.x = CX + leftW - vt.width - 16;
    frame.appendChild(vt);
  });

  frame.appendChild(rect(120, 34, CX + 16, y + 310, C.green, RADIUS.sm));
  frame.appendChild(text("Edit listing", F.semiBold, 11, C.white, CX + 76 - 18, y + 320));
  const archBtn = rect(120, 34, CX + leftW - 136, y + 310, C.bg, RADIUS.sm);
  archBtn.strokes = [{ type: "SOLID", color: C.border }]; archBtn.strokeWeight = 1;
  frame.appendChild(archBtn);
  frame.appendChild(text("Archive", F.semiBold, 11, C.textSec, CX + leftW - 76 - 6, y + 320));

  addCard(frame, rightW, 100, rightX, y);
  frame.appendChild(text("Slot utilization", F.semiBold, 12, C.textPri, rightX + 16, y + 14));
  const slotBar = rightW - 32;
  frame.appendChild(rect(slotBar, 14, rightX + 16, y + 36, C.bg, RADIUS.full));
  frame.appendChild(rect(Math.floor(slotBar * 0.64), 14, rightX + 16, y + 36, C.green, RADIUS.full));
  frame.appendChild(text("32 of 50 slots filled  (64%)", F.regular, 10, C.textMuted, rightX + 16, y + 58));

  addCard(frame, rightW, 540, rightX, y + 116);
  frame.appendChild(text("Applicants", F.semiBold, 12, C.textPri, rightX + 16, y + 132));
  const cols = [{ label: "Name", w: 160, type: "avatar" }, { label: "School", w: 130, type: "text" }, { label: "GWA", w: 60, type: "text" }, { label: "Date", w: 100, type: "text" }, { label: "Status", w: 70, type: "pill" }];
  addTableHeader(frame, cols, rightX, y + 156, rightW);

  const applicants = [["Maria Santos", "WLC Ormoc", "1.50", "Aug 9", "Pending"], ["Juan Reyes", "ORO State", "1.25", "Aug 8", "Approved"], ["Ana Lim", "WLC Ormoc", "1.75", "Aug 7", "Flagged"], ["Ben Macias", "Visayas State", "2.00", "Aug 6", "Rejected"], ["Cleo Pante", "ORO State", "1.00", "Aug 5", "Approved"]];
  applicants.forEach((r, i) => addTableRow(frame, cols, r, rightX, y + 184 + i * 52, rightW, i));
}

// 11. ADMIN SETTINGS
function buildSettings(frame) {
  addSidebar(frame, "settings");
  addTopBar(frame, "Settings");

  const CX = CONTENT_X + 20, CW = CONTENT_W - 40;
  let y = CONTENT_Y + 18;

  frame.appendChild(text("Settings", F.bold, 20, C.textPri, CX, y));
  y += 40;

  const leftW = 200, rightW = CW - leftW - 16, rightX = CX + leftW + 16;

  addCard(frame, leftW, 320, CX, y);
  const settingsNav = [{ label: "Profile", active: true }, { label: "Security" }, { label: "Notifications" }, { label: "System" }];
  settingsNav.forEach((n, i) => {
    const ny = y + 16 + i * 48;
    if (n.active) {
      frame.appendChild(rect(leftW - 16, 36, CX + 8, ny - 4, C.greenLight, RADIUS.sm));
      frame.appendChild(rect(3, 36, CX + 8, ny - 4, C.green, RADIUS.sm));
    }
    frame.appendChild(text(n.label, n.active ? F.semiBold : F.regular, 12, n.active ? C.green : C.textSec, CX + 20, ny + 8));
  });

  addCard(frame, rightW, 560, rightX, y);
  frame.appendChild(text("Profile settings", F.semiBold, 14, C.textPri, rightX + 20, y + 20));
  frame.appendChild(rect(rightW - 40, 1, rightX + 20, y + 46, C.border, 0, 0.6));

  frame.appendChild(ellipse(72, 72, rightX + 20, y + 60, C.goldDark));
  const avT = text("AD", F.bold, 22, C.white, 0, 0);
  avT.x = rightX + 56 - avT.width / 2; avT.y = y + 96 - avT.height / 2;
  frame.appendChild(avT);
  frame.appendChild(text("System Admin", F.bold, 15, C.textPri, rightX + 104, y + 70));
  frame.appendChild(text("admin@scholaris.gov.ph", F.regular, 11, C.textMuted, rightX + 104, y + 90));
  frame.appendChild(rect(110, 30, rightX + 104, y + 110, C.bg, RADIUS.sm));
  frame.appendChild(text("Change photo", F.medium, 10, C.textSec, rightX + 104 + 55 - 14, y + 120));

  const fields = [{ label: "Full name", val: "System Admin" }, { label: "Email address", val: "admin@scholaris.gov.ph" }, { label: "Role", val: "System Administrator" }];
  fields.forEach((f, i) => {
    const fy = y + 170 + i * 64;
    frame.appendChild(text(f.label, F.semiBold, 11, C.textPri, rightX + 20, fy));
    const fb = rect(rightW - 40, 38, rightX + 20, fy + 16, C.bg, RADIUS.sm);
    fb.strokes = [{ type: "SOLID", color: C.border }]; fb.strokeWeight = 1;
    frame.appendChild(fb);
    frame.appendChild(text(f.val, F.regular, 12, C.textPri, rightX + 34, fy + 26));
  });

  frame.appendChild(rect(140, 42, rightX + 20, y + 502, C.green, RADIUS.sm));
  frame.appendChild(text("Save changes", F.semiBold, 13, C.white, rightX + 90 - 43, y + 514));

  addCard(frame, rightW, 180, rightX, y + 576);
  frame.appendChild(text("Security", F.semiBold, 14, C.textPri, rightX + 20, y + 596));
  const secItems = [{ label: "Password", val: "Last changed 30 days ago" }, { label: "Two-factor auth", val: "Enabled" }];
  secItems.forEach((s, i) => {
    const sy = y + 632 + i * 38;
    frame.appendChild(text(s.label, F.semiBold, 11, C.textPri, rightX + 20, sy));
    frame.appendChild(text(s.val, F.regular, 10, C.textMuted, rightX + 20, sy + 16));
    frame.appendChild(text("Change →", F.medium, 10, C.green, rightX + rightW - 20 - 7, sy + 8));
  });
}

// 12. NOTIFICATIONS
function buildNotifications(frame) {
  addSidebar(frame, "notifications");
  addTopBar(frame, "Notifications");

  const CX = CONTENT_X + 20, CW = CONTENT_W - 40;
  let y = CONTENT_Y + 18;

  frame.appendChild(text("Notifications", F.bold, 20, C.textPri, CX, y));
  frame.appendChild(text("Mark all as read", F.medium, 11, C.green, CX + CW - 94, y + 4));
  y += 40;

  const tabs = ["All", "Unread", "Applications", "System"];
  tabs.forEach((tab, i) => {
    const tw = 90, tx = CX + i * (tw + 8);
    frame.appendChild(rect(tw, 32, tx, y, i === 0 ? C.green : C.surface, RADIUS.full));
    frame.appendChild(text(tab, F.semiBold, 11, i === 0 ? C.white : C.textSec, tx + tw / 2 - 25, y + 9));
  });

  y += 48;

  addCard(frame, CW, 440, CX, y);
  const notifs = [
    { dot: C.coral, unread: true, title: "New application flagged", body: "Application #0091 from Ana Lim has been flagged for review.", time: "9:11 AM" },
    { dot: C.green, unread: true, title: "Application approved", body: "Application #0088 from Juan Reyes approved.", time: "9:38 AM" },
    { dot: C.blue, unread: false, title: "Provider verified", body: "SM Foundation account verified.", time: "Aug 9" },
  ];
  notifs.forEach((n, i) => {
    const ny = y + 8 + i * 80;
    if (n.unread) frame.appendChild(rect(CW, 80, CX, ny, C.greenLight, 0, 0.2));
    frame.appendChild(ellipse(10, 10, CX + 16, ny + 20, n.dot));
    frame.appendChild(ellipse(8, 8, CX + CW - 24, ny + 20, C.green));
    frame.appendChild(text(n.title, F.semiBold, 12, C.textPri, CX + 34, ny + 14));
    frame.appendChild(text(n.body, F.regular, 10, C.textSec, CX + 34, ny + 32, { width: CW - 80, lineHeight: 15 }));
    frame.appendChild(text(n.time, F.regular, 9, C.textMuted, CX + CW - 32, ny + 14));
  });
}

// 13. CREATE SCHOLARSHIP
function buildCreateScholarship(frame) {
  addSidebar(frame, "scholarships");
  addTopBar(frame, "Create Scholarship");

  const CX = CONTENT_X + 20, CW = CONTENT_W - 40;
  let y = CONTENT_Y + 18;

  // Back button
  const backBtn = rect(90, 30, CX, y, C.bg, RADIUS.sm);
  backBtn.strokes = [{type:"SOLID", color:C.border}]; backBtn.strokeWeight = 1;
  frame.appendChild(backBtn);
  frame.appendChild(text("← Back", F.medium, 11, C.textSec, CX + 10, y + 8));
  frame.appendChild(text("Create new scholarship", F.bold, 20, C.textPri, CX + 104, y + 4));

  y += 46;

  // Card height: 860 total to fit all content
  addCard(frame, CW, 860, CX, y);

  frame.appendChild(text("Basic information", F.semiBold, 13, C.textPri, CX + 20, y + 20));
  frame.appendChild(rect(CW - 40, 1, CX + 20, y + 44, C.border, 0, 0.6));

  // Single-column layout with 6 fields
  const fields1 = [
    { label: "Scholarship name", val: "e.g. CHED Tertiary Grant 2026" },
    { label: "Provider / Organization", val: "e.g. CHED Region VIII" },
    { label: "Total slots available", val: "e.g. 50" },
    { label: "Budget per scholar/year", val: "e.g. ₱60,000" },
    { label: "Application deadline", val: "MM / DD / YYYY" },
    { label: "Region covered", val: "e.g. Region VIII" },
  ];
  const rowH = 72;
  fields1.forEach((f, i) => {
    const fy = y + 56 + i * rowH;
    frame.appendChild(text(f.label, F.semiBold, 11, C.textPri, CX + 20, fy));
    const fb = rect(CW - 40, 36, CX + 20, fy + 22, C.bg, RADIUS.sm);
    fb.strokes = [{type:"SOLID", color:C.border}]; fb.strokeWeight = 1;
    frame.appendChild(fb);
    frame.appendChild(text(f.val, F.regular, 11, C.textMuted, CX + 34, fy + 26));
  });

  y += 56 + 6 * 72;

  // Description section
  const descStart = y + 56;
  frame.appendChild(text("Description", F.semiBold, 11, C.textPri, CX + 20, descStart));
  frame.appendChild(rect(CW - 40, 80, CX + 20, descStart + 20, C.bg, RADIUS.sm));
  frame.appendChild(text("Write a brief description...", F.regular, 11, C.textMuted, CX + 34, descStart + 36, {width: CW - 68, lineHeight: 16}));

  y += 106;
  // Eligibility
  frame.appendChild(text("Eligibility requirements", F.semiBold, 11, C.textPri, CX + 20, y));
  frame.appendChild(rect(CW - 40, 1, CX + 20, y + 24, C.border, 0, 0.6));
  const eligFields = [
    { label: "Minimum GWA required", val: "e.g. 1.75" },
    { label: "Year level", val: "e.g. 1st–4th Year" },
  ];
  eligFields.forEach((f, i) => {
    const fy = y + 36 + i * 62;
    frame.appendChild(text(f.label, F.semiBold, 11, C.textPri, CX + 20, fy));
    const fb = rect(CW - 40, 36, CX + 20, fy + 22, C.bg, RADIUS.sm);
    fb.strokes = [{type:"SOLID", color:C.border}]; fb.strokeWeight = 1;
    frame.appendChild(fb);
    frame.appendChild(text(f.val, F.regular, 11, C.textMuted, CX + 34, fy + 26));
  });

  y += 36 + 2 * 62;
  // Documents
  frame.appendChild(text("Required documents", F.semiBold, 11, C.textPri, CX + 20, y));
  const docItems = ["Form 138 / Report Card", "Certificate of Enrollment", "PSA Birth Certificate", "Barangay Indigency Certificate", "2x2 ID Photo"];
  docItems.forEach((d, i) => {
    const dy = y + 34 + i * 32;
    frame.appendChild(ellipse(16, 16, CX + 20, dy + 6, C.greenLight));
    frame.appendChild(text("✓", F.bold, 10, C.green, CX + 23, dy + 4));
    frame.appendChild(text(d, F.regular, 11, C.textPri, CX + 42, dy + 2));
  });

  y += 34 + 5 * 32 + 30;
  // Initial status
  frame.appendChild(text("Initial status", F.semiBold, 11, C.textPri, CX + 20, y));
  const statuses = ["Draft","Pending","Active"];
  statuses.forEach((s, i) => {
    const sx = CX + 20 + i * 110;
    frame.appendChild(rect(100, 32, sx, y + 12, i === 2 ? C.green : C.bg, RADIUS.sm));
    frame.appendChild(text(s, F.semiBold, 11, i === 2 ? C.white : C.textSec, sx + 50 - 12, y + 14));
  });

  y += 80;
  // Action buttons
  frame.appendChild(rect(CW - 40, 1, CX + 20, y - 10, C.border, 0, 0.6));
  frame.appendChild(rect(160, 44, CX + 20, y, C.green, RADIUS.sm));
  const pubT = text("Publish scholarship", F.semiBold, 13, C.white, 0, y + 26);
  pubT.x = CX + 20 + 80 - pubT.width / 2;
  frame.appendChild(pubT);
  frame.appendChild(rect(140, 44, CX + 192, y, C.bg, RADIUS.sm));
  const draftT = text("Save as draft", F.semiBold, 13, C.textSec, 0, y + 26);
  draftT.x = CX + 192 + 70 - draftT.width / 2;
  frame.appendChild(draftT);
  const cancelT = text("Cancel", F.medium, 12, C.textMuted, CX + 332, y + 26);
  frame.appendChild(cancelT);
}

// 14. PROVIDER DETAIL
function buildProviderDetail(frame) {
  addSidebar(frame, "providers");
  addTopBar(frame, "Provider Detail");
  const CX = CONTENT_X + 20;
  const CW = CONTENT_W - 40;
  let y = CONTENT_Y + 18;
  const backBtn = rect(90, 30, CX, y, C.bg, RADIUS.sm);
  backBtn.strokes = [{type:"SOLID", color:C.border}]; backBtn.strokeWeight = 1;
  frame.appendChild(backBtn);
  frame.appendChild(text("← Back", F.medium, 11, C.textSec, CX + 10, y + 8));
  frame.appendChild(text("Provider Detail", F.bold, 20, C.textPri, CX + 104, y + 4));
  y += 46;
  addCard(frame, CW, 880, CX, y);
  frame.appendChild(ellipse(64, 64, CX + 20, y + 20, C.greenLight));
  const avT = text("SM", F.bold, 18, C.green, 0, 0);
  avT.x = CX + 52 - avT.width/2; avT.y = y + 52 - avT.height/2;
  frame.appendChild(avT);
  frame.appendChild(text("SM Foundation", F.bold, 16, C.textPri, CX + 100, y + 20));
  frame.appendChild(text("Private Corporate Foundation", F.regular, 11, C.textMuted, CX + 100, y + 42));
  statusPill(frame, "Verified", CX + 100, y + 62);
  frame.appendChild(rect(CW - 40, 1, CX + 20, y + 104, C.border, 0, 0.6));
  const info = [
    {label:"Contact email", val:"partnerships@smfoundation.ph"},
    {label:"Contact phone", val:"+63 917 555 0199"},
    {label:"Registered address", val:"SM Corporate Center, Pasay City"},
    {label:"Verified on", val:"Mar 3, 2026"},
    {label:"Active scholarships", val:"4"},
    {label:"Total scholars funded", val:"128"},
  ];
  info.forEach((d, i) => {
    const dy = y + 118 + i * 26;
    frame.appendChild(text(d.label, F.regular, 10, C.textMuted, CX + 20, dy));
    const vt = text(d.val, F.semiBold, 10, C.textPri, 0, dy);
    vt.x = CX + CW - vt.width - 20;
    frame.appendChild(vt);
  });
  y += 216;
  addCard(frame, CW, 400, CX, y);
  frame.appendChild(text("Scholarships by this provider", F.semiBold, 12, C.textPri, CX + 16, y + 16));
  const cols = [{label:"Name", w:200, type:"text"}, {label:"Slots", w:80, type:"text"}, {label:"Filled", w:80, type:"text"}, {label:"Deadline", w:100, type:"text"}, {label:"Status", w:70, type:"pill"}];
  addTableHeader(frame, cols, CX + 16, y + 40, CW - 32);
  const provScholarships = [["SM Scholars 2026","50","32","Sep 15","Active"], ["SM STEM Grant","30","30","Aug 1","Closed"], ["SM Retail Track","20","10","Oct 1","Active"], ["SM Community Aid","25","18","Nov 5","Active"]];
  provScholarships.forEach((r, i) => addTableRow(frame, cols, r, CX + 16, y + 68 + i * 52, CW - 32, i));
}

// 15. USER DETAIL
function buildUserDetail(frame) {
  addSidebar(frame, "users");
  addTopBar(frame, "User Detail");
  const CX = CONTENT_X + 20;
  const CW = CONTENT_W - 40;
  let y = CONTENT_Y + 18;
  const backBtn = rect(90, 30, CX, y, C.bg, RADIUS.sm);
  backBtn.strokes = [{type:"SOLID", color:C.border}]; backBtn.strokeWeight = 1;
  frame.appendChild(backBtn);
  frame.appendChild(text("← Back", F.medium, 11, C.textSec, CX + 10, y + 8));
  frame.appendChild(text("User Detail", F.bold, 20, C.textPri, CX + 104, y + 4));
  y += 46;
  addCard(frame, CW, 780, CX, y);
  frame.appendChild(ellipse(64, 64, CX + 20, y + 20, C.goldLight));
  const avT = text("NB", F.bold, 18, C.goldDark, 0, 0);
  avT.x = CX + 52 - avT.width/2; avT.y = y + 52 - avT.height/2;
  frame.appendChild(avT);
  frame.appendChild(text("Nico Bautista", F.bold, 16, C.textPri, CX + 100, y + 20));
  frame.appendChild(text("Student — Visayas State University", F.regular, 11, C.textMuted, CX + 100, y + 42));
  statusPill(frame, "Suspended", CX + 100, y + 62);
  frame.appendChild(rect(CW - 40, 1, CX + 20, y + 104, C.border, 0, 0.6));
  const info = [
    {label:"Email", val:"n.bautista@email.com"},
    {label:"Phone", val:"+63 918 222 3344"},
    {label:"Joined", val:"Feb 14, 2026"},
    {label:"Applications submitted", val:"3"},
    {label:"Scholarships won", val:"1"},
    {label:"Suspended on", val:"Aug 8, 2026 — policy violation"},
  ];
  info.forEach((d, i) => {
    const dy = y + 118 + i * 26;
    frame.appendChild(text(d.label, F.regular, 10, C.textMuted, CX + 20, dy));
    const vt = text(d.val, F.semiBold, 10, C.textPri, 0, dy);
    vt.x = CX + CW - vt.width - 20;
    frame.appendChild(vt);
  });
  y += 226;
  addCard(frame, CW, 260, CX, y);
  frame.appendChild(text("Application history", F.semiBold, 12, C.textPri, CX + 16, y + 16));
  const cols = [{label:"Scholarship", w:200, type:"text"}, {label:"Date", w:100, type:"text"}, {label:"Status", w:90, type:"pill"}];
  addTableHeader(frame, cols, CX + 16, y + 40, CW - 32);
  const apps = [["DOST Merit Award","Jul 2, 2026","Approved"], ["CHED Tertiary Grant","May 10, 2026","Rejected"], ["LGU Ormoc Grant","Mar 1, 2026","Rejected"]];
  apps.forEach((r, i) => addTableRow(frame, cols, r, CX + 16, y + 68 + i * 52, CW - 32, i));
  y += 276;
  addCard(frame, CW, 100, CX, y);
  frame.appendChild(rect(140, 38, CX + 16, y + 26, C.green, RADIUS.sm));
  frame.appendChild(text("✓ Reinstate", F.semiBold, 12, C.white, 0, y + 37));
  frame.appendChild(rect(140, 38, CX + 172, y + 26, C.coralLight, RADIUS.sm));
  frame.appendChild(text("✕ Ban permanently", F.semiBold, 12, C.coral, 0, y + 37));
}

// 16. REPORTS
function buildReports(frame) {
  addSidebar(frame, "reports");
  addTopBar(frame, "Reports");
  const CX = CONTENT_X + 20;
  const CW = CONTENT_W - 40;
  let y = CONTENT_Y + 18;
  frame.appendChild(text("Reports", F.bold, 20, C.textPri, CX, y));
  y += 40;
  addCard(frame, CW, 200, CX, y);
  frame.appendChild(text("Generate a report", F.semiBold, 13, C.textPri, CX + 16, y + 16));
  frame.appendChild(rect(CW - 40, 1, CX + 16, y + 40, C.border, 0, 0.6));
  frame.appendChild(text("Report type", F.semiBold, 11, C.textPri, CX + 16, y + 54));
  const reportBg = rect(CW - 32, 40, CX + 16, y + 72, C.bg, RADIUS.sm);
  reportBg.strokes = [{type:"SOLID", color:C.border}]; reportBg.strokeWeight = 1;
  frame.appendChild(reportBg);
  frame.appendChild(text("Applications summary", F.regular, 11, C.textPri, CX + 30, y + 83));
  frame.appendChild(text("Date range", F.semiBold, 11, C.textPri, CX + 16, y + 128));
  const dateBg = rect(CW - 32, 40, CX + 16, y + 146, C.bg, RADIUS.sm);
  dateBg.strokes = [{type:"SOLID", color:C.border}]; dateBg.strokeWeight = 1;
  frame.appendChild(dateBg);
  frame.appendChild(text("Jan 1, 2026 — Aug 17, 2026", F.regular, 11, C.textPri, CX + 30, y + 157));
  y += 220;
  addCard(frame, CW, 60, CX, y);
  frame.appendChild(rect(140, 38, CX + 16, y + 10, C.green, RADIUS.sm));
  frame.appendChild(text("Generate PDF", F.semiBold, 12, C.white, 0, y + 22));
  frame.appendChild(rect(140, 38, CX + 172, y + 10, C.bg, RADIUS.sm));
  frame.appendChild(text("Export CSV", F.semiBold, 12, C.textSec, 0, y + 22));
  y += 80;
  addCard(frame, CW, 260, CX, y);
  frame.appendChild(text("Recent reports", F.semiBold, 12, C.textPri, CX + 16, y + 16));
  const reports = [
    {name:"Applications Summary — Jul 2026", date:"Aug 1, 2026", type:"PDF"},
    {name:"Scholarship Utilization — Q2 2026", date:"Jul 5, 2026", type:"CSV"},
    {name:"Provider Activity Report", date:"Jun 20, 2026", type:"PDF"},
    {name:"Regional Breakdown — H1 2026", date:"Jun 1, 2026", type:"CSV"},
  ];
  reports.forEach((r, i) => {
    const ry = y + 40 + i * 50;
    frame.appendChild(text(r.name, F.semiBold, 11, C.textPri, CX + 16, ry));
    frame.appendChild(text(r.date + "  ·  " + r.type, F.regular, 9, C.textMuted, CX + 16, ry + 18));
    frame.appendChild(text("Download →", F.medium, 10, C.green, CX + 16, ry + 6));
    frame.appendChild(text("Download →", F.medium, 10, C.green, CX + CW - 20 - 10, ry + 6));
    if(i < reports.length - 1)
      frame.appendChild(rect(CW - 32, 1, CX + 16, ry + 40, C.border, 0, 0.4));
  });
}

// ── SCREEN GENERATOR ────────────────────────────────────────────
async function generateScreen(buildFn, screenName, xOffset) {
  await loadFonts();
  const frame = createScreenFrame(screenName, xOffset);
  buildFn(frame);
  figma.viewport.scrollAndZoomIntoView([frame]);
  figma.closePlugin(`${screenName} generated!`);
}

async function generateAll() {
  await loadFonts();
  const builders = [
    { fn: buildLogin,              name: "Admin — 1 Login" },
    { fn: buildDashboard,          name: "Admin — 2 Dashboard" },
    { fn: buildApplicants,         name: "Admin — 3 Applicants" },
    { fn: buildScholarships,       name: "Admin — 4 Scholarships" },
    { fn: buildProviders,          name: "Admin — 5 Providers" },
    { fn: buildUsers,              name: "Admin — 6 Users" },
    { fn: buildAnalytics,          name: "Admin — 7 Analytics" },
    { fn: buildLogs,               name: "Admin — 8 Audit Logs" },
    { fn: buildApplicantDetail,    name: "Admin — 9 Applicant Detail" },
    { fn: buildScholarshipDetail,  name: "Admin — 10 Scholarship Detail" },
    { fn: buildSettings,           name: "Admin — 11 Settings" },
    { fn: buildNotifications,      name: "Admin — 12 Notifications" },
    { fn: buildCreateScholarship,  name: "Admin — 13 Create Scholarship" },
    { fn: buildProviderDetail,     name: "Admin — 14 Provider Detail" },
    { fn: buildUserDetail,         name: "Admin — 15 User Detail" },
    { fn: buildReports,            name: "Admin — 16 Reports" },
  ];
  const frames = builders.map((b, i) => {
    const f = createScreenFrame(b.name, i * SCREEN_GAP);
    b.fn(f);
    return f;
  });
  figma.viewport.scrollAndZoomIntoView(frames);
  figma.closePlugin("All admin screens generated!");
}

figma.ui.onmessage = async (msg) => {
  switch (msg.type) {
    case "generate-all": await generateAll(); break;
    case "generate-login": await generateScreen(buildLogin, "Admin — 1 Login", 0); break;
    case "generate-dashboard": await generateScreen(buildDashboard, "Admin — 2 Dashboard", SCREEN_GAP); break;
    case "generate-applicants": await generateScreen(buildApplicants, "Admin — 3 Applicants", SCREEN_GAP * 2); break;
    case "generate-scholarships": await generateScreen(buildScholarships, "Admin — 4 Scholarships", SCREEN_GAP * 3); break;
    case "generate-providers": await generateScreen(buildProviders, "Admin — 5 Providers", SCREEN_GAP * 4); break;
    case "generate-users": await generateScreen(buildUsers, "Admin — 6 Users", SCREEN_GAP * 5); break;
    case "generate-analytics": await generateScreen(buildAnalytics, "Admin — 7 Analytics", SCREEN_GAP * 6); break;
    case "generate-logs": await generateScreen(buildLogs, "Admin — 8 Audit Logs", SCREEN_GAP * 7); break;
    case "generate-applicant-detail": await generateScreen(buildApplicantDetail, "Admin — 9 Applicant Detail", SCREEN_GAP * 8); break;
    case "generate-scholarship-detail": await generateScreen(buildScholarshipDetail, "Admin — 10 Scholarship Detail", SCREEN_GAP * 9); break;
    case "generate-settings": await generateScreen(buildSettings, "Admin — 11 Settings", SCREEN_GAP * 10); break;
    case "generate-notifications": await generateScreen(buildNotifications, "Admin — 12 Notifications", SCREEN_GAP * 11); break;
    case "generate-create-scholarship": await generateScreen(buildCreateScholarship, "Admin — 13 Create Scholarship", SCREEN_GAP * 12); break;
    case "generate-provider-detail": await generateScreen(buildProviderDetail, "Admin — 14 Provider Detail", SCREEN_GAP * 13); break;
    case "generate-user-detail": await generateScreen(buildUserDetail, "Admin — 15 User Detail", SCREEN_GAP * 14); break;
    case "generate-reports": await generateScreen(buildReports, "Admin — 16 Reports", SCREEN_GAP * 15); break;
  }
};