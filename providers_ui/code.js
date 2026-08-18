figma.showUI(__html__, { width: 300, height: 500 });

// ── DESIGN TOKENS ─────────────────────────────────────────────────
const F = {
  bold:     { family: "Inter", style: "Bold" },
  semiBold: { family: "Inter", style: "Semi Bold" },
  regular:  { family: "Inter", style: "Regular" },
  medium:   { family: "Inter", style: "Medium" },
};

const C = {
  green:      { r: 0.059, g: 0.302, b: 0.180 },
  greenDark:  { r: 0.039, g: 0.200, b: 0.118 },
  greenLight: { r: 0.882, g: 0.937, b: 0.906 },
  gold:       { r: 0.945, g: 0.706, b: 0.118 },
  goldDark:   { r: 0.620, g: 0.447, b: 0.000 },
  navy:       { r: 0.106, g: 0.227, b: 0.361 },
  coral:      { r: 0.863, g: 0.282, b: 0.216 },
  coralLight: { r: 0.988, g: 0.906, b: 0.898 },
  bg:         { r: 0.973, g: 0.976, b: 0.973 },
  surface:    { r: 1.000, g: 1.000, b: 1.000 },
  border:     { r: 0.906, g: 0.914, b: 0.910 },
  textPri:    { r: 0.082, g: 0.098, b: 0.090 },
  textSec:    { r: 0.380, g: 0.408, b: 0.396 },
  textMuted:  { r: 0.612, g: 0.631, b: 0.624 },
  white:      { r: 1, g: 1, b: 1 },
  black:      { r: 0, g: 0, b: 0 },
};

const RADIUS = { sm: 8, md: 12, lg: 16, xl: 24, full: 100 };

// ── HELPERS ───────────────────────────────────────────────────────
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
  if (opts.width) { t.textAutoResize = "HEIGHT"; t.resize(opts.width, 40); }
  if (opts.align) t.textAlignHorizontal = opts.align;
  if (opts.lineHeight) t.lineHeight = { value: opts.lineHeight, unit: "PIXELS" };
  return t;
}

function ellipse(w, h, x, y, color) {
  const e = figma.createEllipse();
  e.resize(w, h); e.x = x; e.y = y;
  e.fills = [{ type: "SOLID", color }];
  return e;
}

// ── ICON SYSTEM ───────────────────────────────────────────────────
function iconHome(x, y, color, size = 22) {
  const g = figma.createFrame();
  g.resize(size, size); g.x = x; g.y = y;
  g.fills = []; g.clipsContent = false;
  const roof = figma.createPolygon();
  roof.resize(size, size * 0.5); roof.x = 0; roof.y = 0;
  roof.fills = [{ type: "SOLID", color }];
  g.appendChild(roof);
  const body = rect(size * 0.7, size * 0.5, size * 0.15, size * 0.48, color, 2);
  g.appendChild(body);
  const door = rect(size * 0.28, size * 0.32, size * 0.36, size * 0.66, C.white, 1);
  g.appendChild(door);
  return g;
}

function iconDoc(x, y, color, size = 20) {
  const g = figma.createFrame();
  g.resize(size, size + 2); g.x = x; g.y = y;
  g.fills = []; g.clipsContent = false;
  const body = rect(size, size + 2, 0, 0, color, 3);
  g.appendChild(body);
  [0.3, 0.52, 0.72].forEach(yFrac => {
    const ln = rect(size * 0.55, 1.5, size * 0.2, (size + 2) * yFrac, C.white);
    g.appendChild(ln);
  });
  const corner = rect(size * 0.28, size * 0.28, size * 0.72, 0, C.white, 0);
  corner.fills = [{ type: "SOLID", color: { r: 0.85, g: 0.93, b: 0.88 } }];
  g.appendChild(corner);
  return g;
}

function iconPeople(x, y, color, size = 22) {
  const g = figma.createFrame();
  g.resize(size, size); g.x = x; g.y = y;
  g.fills = []; g.clipsContent = false;
  const head = ellipse(size * 0.36, size * 0.36, size * 0.13, 0, color);
  g.appendChild(head);
  const body = rect(size * 0.55, size * 0.32, size * 0.04, size * 0.42, color, 4);
  g.appendChild(body);
  const head2 = ellipse(size * 0.3, size * 0.3, size * 0.56, size * 0.04, color);
  head2.opacity = 0.55;
  g.appendChild(head2);
  const body2 = rect(size * 0.42, size * 0.28, size * 0.52, size * 0.44, color, 4);
  body2.opacity = 0.55;
  g.appendChild(body2);
  return g;
}

function iconGear(x, y, color, size = 22) {
  const g = figma.createFrame();
  g.resize(size, size); g.x = x; g.y = y;
  g.fills = []; g.clipsContent = false;
  const outer = ellipse(size, size, 0, 0, color);
  g.appendChild(outer);
  const inner = ellipse(size * 0.45, size * 0.45, size * 0.275, size * 0.275, C.white);
  g.appendChild(inner);
  [[size*0.38, -1], [size*0.38, size*0.82], [-1, size*0.38], [size*0.82, size*0.38]].forEach(([tx, ty]) => {
    const tooth = rect(size * 0.24, size * 0.2, tx, ty, color, 1);
    g.appendChild(tooth);
  });
  return g;
}

function iconChevron(x, y, color, size = 16) {
  const g = figma.createFrame();
  g.resize(size, size); g.x = x; g.y = y;
  g.fills = []; g.clipsContent = false;
  const top = rect(size * 0.55, 2, size * 0.18, size * 0.28, color, 1);
  top.rotation = -40;
  g.appendChild(top);
  const bot = rect(size * 0.55, 2, size * 0.18, size * 0.58, color, 1);
  bot.rotation = 40;
  g.appendChild(bot);
  return g;
}

function iconEye(x, y, color) {
  const g = figma.createFrame();
  g.resize(20, 20); g.x = x; g.y = y;
  g.fills = []; g.clipsContent = false;
  const outer = ellipse(20, 13, 0, 3, color);
  outer.opacity = 0.3;
  g.appendChild(outer);
  const pupil = ellipse(7, 7, 6, 6, color);
  g.appendChild(pupil);
  const shine = ellipse(3, 3, 8, 8, C.white);
  g.appendChild(shine);
  return g;
}

// ── SHARED COMPONENTS ─────────────────────────────────────────────
function addNavbar(frame, providerName, initials) {
  frame.appendChild(rect(440, 72, 0, 0, C.green));
  frame.appendChild(rect(440, 1, 0, 71, C.greenDark));
  frame.appendChild(text("Scholaris", F.bold, 21, C.white, 20, 24));
  const pill = rect(92, 26, 178, 23, C.greenDark, RADIUS.full);
  frame.appendChild(pill);
  const pillT = text(providerName, F.medium, 11, C.greenLight, 0, 28);
  pillT.x = 178 + 46 - pillT.width / 2;
  frame.appendChild(pillT);
  const av = ellipse(36, 36, 380, 18, C.gold);
  frame.appendChild(av);
  const avT = text(initials, F.bold, 12, C.greenDark, 0, 0);
  avT.x = 380 + 18 - avT.width / 2;
  avT.y = 18 + 18 - avT.height / 2;
  frame.appendChild(avT);
  const caret = rect(6, 4, 420, 34, C.white);
  caret.opacity = 0.6;
  frame.appendChild(caret);
}

function addTabBar(frame, activeIdx) {
  frame.appendChild(rect(440, 80, 0, 876, C.surface));
  frame.appendChild(rect(440, 1, 0, 876, C.border));
  const tabs = [
    { label: "Home",         icon: iconHome },
    { label: "Scholarships", icon: iconDoc },
    { label: "Applicants",   icon: iconPeople },
    { label: "Settings",     icon: iconGear },
  ];
  tabs.forEach((t, i) => {
    const cx = 55 + i * 110;
    const active = i === activeIdx;
    const color = active ? C.green : C.textMuted;
    if (active) frame.appendChild(rect(32, 3, cx - 16, 876, C.green, 2));
    frame.appendChild(t.icon(cx - 11, 890, color, 22));
    const lbl = text(t.label, active ? F.semiBold : F.regular, 10, color, 0, 918);
    lbl.x = cx - lbl.width / 2;
    frame.appendChild(lbl);
  });
}

function addStatCard(frame, num, label, numColor, x, y, trend = null) {
  const card = rect(196, 100, x, y, C.surface, RADIUS.md);
  card.strokes = [{ type: "SOLID", color: C.border }];
  card.strokeWeight = 1;
  frame.appendChild(card);
  frame.appendChild(rect(3, 60, x, y + 20, numColor, 2));
  frame.appendChild(text(num, F.bold, 30, numColor, x + 16, y + 16));
  frame.appendChild(text(label, F.regular, 11, C.textSec, x + 16, y + 56, { width: 160, lineHeight: 16 }));
  if (trend) {
    frame.appendChild(rect(36, 18, x + 152, y + 14, trend.up ? C.greenLight : C.coralLight, RADIUS.full));
    const trendT = text(trend.label, F.semiBold, 9, trend.up ? C.green : C.coral, 0, y + 18);
    trendT.x = x + 152 + 18 - trendT.width / 2;
    frame.appendChild(trendT);
  }
  frame.appendChild(iconChevron(x + 172, y + 40, C.textMuted, 14));
}

// ── SETTINGS ROW HELPER ───────────────────────────────────────────
function addSettingsRow(frame, iconChar, label, sub, y) {
  const rowBg = rect(408, 60, 16, y, C.surface, RADIUS.md);
  rowBg.strokes = [{ type: "SOLID", color: C.border }];
  rowBg.strokeWeight = 1;
  frame.appendChild(rowBg);
  const iconBg = ellipse(36, 36, 28, y + 12, C.bg);
  frame.appendChild(iconBg);
  const iconT = text(iconChar, F.regular, 16, C.textSec, 0, 0);
  iconT.x = 28 + 18 - iconT.width / 2;
  iconT.y = y + 12 + 18 - iconT.height / 2;
  frame.appendChild(iconT);
  frame.appendChild(text(label, F.semiBold, 13, C.textPri, 76, y + 12));
  frame.appendChild(text(sub,   F.regular,  11, C.textSec,  76, y + 32));
  frame.appendChild(iconChevron(396, y + 20, C.textMuted, 14));
}

// ── FORM FIELD HELPER ─────────────────────────────────────────────
function addFormField(frame, label, placeholder, value, x, y, w, focused = false, hint = null) {
  frame.appendChild(text(label, F.semiBold, 12, C.textPri, x, y));
  const field = rect(w, 48, x, y + 18, C.bg, RADIUS.sm);
  field.strokes = [{ type: "SOLID", color: focused ? C.green : C.border }];
  field.strokeWeight = focused ? 2 : 1.5;
  frame.appendChild(field);
  const valColor = value ? C.textPri : C.textMuted;
  frame.appendChild(text(value || placeholder, F.regular, 13, valColor, x + 16, y + 31));
  if (hint) {
    frame.appendChild(text(hint, F.regular, 10, C.textMuted, x, y + 72));
  }
}

// ── ADD SCHOLARSHIP BUILDER ───────────────────────────────────────
function buildAddScholarship(frame, provider) {
  frame.appendChild(rect(440, 956, 0, 0, C.bg));
  addNavbar(frame, provider.shortName, provider.initials);

  // ── Header band ──
  frame.appendChild(rect(440, 88, 0, 72, provider.headerColor));

  // Back button
  const backBtn = rect(72, 26, 20, 82, C.white, RADIUS.full);
  backBtn.opacity = 0.15;
  frame.appendChild(backBtn);
  const backT = text("← Back", F.medium, 11, C.white, 30, 89);
  frame.appendChild(backT);

  frame.appendChild(text("Add Scholarship", F.bold, 20, C.white, 20, 86));
  frame.appendChild(text("Post a new scholarship for applicants", F.regular, 13, C.greenLight, 20, 112));

  // ── Step indicator ──
  const stepBg = rect(408, 36, 16, 176, C.surface, RADIUS.md);
  stepBg.strokes = [{ type: "SOLID", color: C.border }];
  stepBg.strokeWeight = 1;
  frame.appendChild(stepBg);

  // Step dots
  const steps = ["Details", "Eligibility", "Review"];
  steps.forEach((s, i) => {
    const cx = 60 + i * 144;
    const active = i === 0;
    const done = false;
    const dotColor = active ? provider.headerColor : C.border;
    const dot = ellipse(10, 10, cx - 5, 187, dotColor);
    frame.appendChild(dot);
    if (active) {
      const dotInner = ellipse(4, 4, cx - 2, 190, C.white);
      frame.appendChild(dotInner);
    }
    const stepLbl = text(s, active ? F.semiBold : F.regular, 10, active ? provider.headerColor : C.textMuted, 0, 200);
    stepLbl.x = cx - stepLbl.width / 2;
    frame.appendChild(stepLbl);
    if (i < 2) {
      const connector = rect(124, 1, cx + 8, 192, C.border);
      frame.appendChild(connector);
    }
  });

  // ── SECTION: Scholarship Details ──────────────────────────────
  frame.appendChild(text("SCHOLARSHIP DETAILS", F.semiBold, 10, C.textMuted, 16, 228));

  const detailCard = rect(408, 292, 16, 244, C.surface, RADIUS.md);
  detailCard.strokes = [{ type: "SOLID", color: C.border }];
  detailCard.strokeWeight = 1;
  frame.appendChild(detailCard);

  // Scholarship Name — focused state
  frame.appendChild(text("Scholarship Name", F.semiBold, 12, C.textPri, 28, 256));
  const nameField = rect(376, 48, 28, 274, C.bg, RADIUS.sm);
  nameField.strokes = [{ type: "SOLID", color: provider.headerColor }];
  nameField.strokeWeight = 2;
  frame.appendChild(nameField);
  // Cursor blink indicator
  frame.appendChild(text("DOST-SEI Merit Scholarship|", F.regular, 13, C.textPri, 44, 287));

  frame.appendChild(rect(376, 1, 28, 330, C.border));

  // Sponsoring Organization — prefilled + locked
  frame.appendChild(text("Sponsoring Organization", F.semiBold, 12, C.textPri, 28, 338));
  const orgField = rect(376, 48, 28, 356, C.bg, RADIUS.sm);
  orgField.strokes = [{ type: "SOLID", color: C.border }];
  orgField.strokeWeight = 1.5;
  frame.appendChild(orgField);
  frame.appendChild(text(provider.name, F.regular, 13, C.textPri, 44, 369));
  const lockT = text("🔒", F.regular, 12, C.textMuted, 382, 370);
  frame.appendChild(lockT);
  frame.appendChild(text("Auto-filled from your account", F.regular, 10, C.textMuted, 28, 410));

  frame.appendChild(rect(376, 1, 28, 420, C.border));

  // Short Description — textarea style
  frame.appendChild(text("Short Description", F.semiBold, 12, C.textPri, 28, 428));
  const descField = rect(376, 64, 28, 446, C.bg, RADIUS.sm);
  descField.strokes = [{ type: "SOLID", color: C.border }];
  descField.strokeWeight = 1.5;
  frame.appendChild(descField);
  frame.appendChild(text("Open to all Filipino students enrolled in\nscience and technology courses...", F.regular, 12, C.textSec, 44, 456, { width: 340, lineHeight: 18 }));
  frame.appendChild(text("128 / 300", F.regular, 10, C.textMuted, 368, 517));

  // ── SECTION: Amount & Slots ───────────────────────────────────
  frame.appendChild(text("AMOUNT & SLOTS", F.semiBold, 10, C.textMuted, 16, 548));

  const amountCard = rect(408, 132, 16, 564, C.surface, RADIUS.md);
  amountCard.strokes = [{ type: "SOLID", color: C.border }];
  amountCard.strokeWeight = 1;
  frame.appendChild(amountCard);

  // Award Amount (left)
  frame.appendChild(text("Award Amount (₱)", F.semiBold, 12, C.textPri, 28, 576));
  const amtField = rect(176, 48, 28, 594, C.bg, RADIUS.sm);
  amtField.strokes = [{ type: "SOLID", color: C.border }];
  amtField.strokeWeight = 1.5;
  frame.appendChild(amtField);
  frame.appendChild(text("40,000", F.semiBold, 14, C.textPri, 44, 607));

  // Period selector (right)
  frame.appendChild(text("Period", F.semiBold, 12, C.textPri, 220, 576));
  const periods = ["/ year", "/ sem", "/ mo"];
  periods.forEach((p, i) => {
    const pw = 56;
    const px = 220 + i * 62;
    const active = i === 0;
    const chipBg = rect(pw, 30, px, 594, active ? provider.headerColor : C.bg, RADIUS.full);
    if (!active) {
      chipBg.strokes = [{ type: "SOLID", color: C.border }];
      chipBg.strokeWeight = 1;
    }
    frame.appendChild(chipBg);
    const chipT = text(p, F.medium, 10, active ? C.white : C.textSec, 0, 603);
    chipT.x = px + pw / 2 - chipT.width / 2;
    frame.appendChild(chipT);
  });

  frame.appendChild(rect(376, 1, 28, 650, C.border));

  // Available Slots
  frame.appendChild(text("Available Slots", F.semiBold, 12, C.textPri, 28, 658));
  const slotsField = rect(176, 48, 28, 676, C.bg, RADIUS.sm);
  slotsField.strokes = [{ type: "SOLID", color: C.border }];
  slotsField.strokeWeight = 1.5;
  frame.appendChild(slotsField);
  frame.appendChild(text("68", F.semiBold, 14, C.textPri, 44, 689));
  // Stepper buttons
  const minusBtn = rect(32, 32, 186, 680, C.bg, RADIUS.sm);
  minusBtn.strokes = [{ type: "SOLID", color: C.border }];
  minusBtn.strokeWeight = 1;
  frame.appendChild(minusBtn);
  const minusT = text("−", F.bold, 16, C.textSec, 0, 684);
  minusT.x = 186 + 16 - minusT.width / 2;
  frame.appendChild(minusT);

  // ── SECTION: Deadline ─────────────────────────────────────────
  frame.appendChild(text("DEADLINE", F.semiBold, 10, C.textMuted, 16, 716));

  const deadlineCard = rect(408, 72, 16, 732, C.surface, RADIUS.md);
  deadlineCard.strokes = [{ type: "SOLID", color: C.border }];
  deadlineCard.strokeWeight = 1;
  frame.appendChild(deadlineCard);

  frame.appendChild(text("Application Deadline", F.semiBold, 12, C.textPri, 28, 744));
  const dateField = rect(280, 40, 28, 762, C.bg, RADIUS.sm);
  dateField.strokes = [{ type: "SOLID", color: C.border }];
  dateField.strokeWeight = 1.5;
  frame.appendChild(dateField);
  frame.appendChild(text("📅", F.regular, 14, C.textMuted, 40, 771));
  frame.appendChild(text("Aug 31, 2025", F.regular, 13, C.textPri, 64, 772));

  // ── Action buttons ────────────────────────────────────────────
  frame.appendChild(rect(440, 1, 0, 820, C.border));

  // Save Draft button
  const draftBtn = rect(192, 52, 16, 832, C.bg, RADIUS.md);
  draftBtn.strokes = [{ type: "SOLID", color: C.border }];
  draftBtn.strokeWeight = 1;
  frame.appendChild(draftBtn);
  const draftT = text("Save Draft", F.semiBold, 14, C.textSec, 0, 847);
  draftT.x = 16 + 96 - draftT.width / 2;
  frame.appendChild(draftT);

  // Next: Eligibility button (provider themed)
  const nextBtn = rect(192, 52, 232, 832, provider.headerColor, RADIUS.md);
  frame.appendChild(nextBtn);
  const nextT = text("Next: Eligibility →", F.semiBold, 14, C.white, 0, 847);
  nextT.x = 232 + 96 - nextT.width / 2;
  frame.appendChild(nextT);

  // Discard link
  const discardT = text("Discard and go back", F.regular, 12, C.coral, 0, 896);
  discardT.x = 220 - discardT.width / 2;
  frame.appendChild(discardT);

  addTabBar(frame, 1);
}

// ── APPLICANT DETAIL BUILDER ──────────────────────────────────────
function buildApplicantDetail(frame, provider) {
  const a = provider.applicants[0]; // first applicant
  const initials = a.name.split(" ").map(n => n[0]).join("").slice(0, 2);

  frame.appendChild(rect(440, 956, 0, 0, C.bg));

  // ── Header band with back button ──
  frame.appendChild(rect(440, 120, 0, 0, provider.headerColor));

  // Back button
  const backBtn = rect(80, 28, 16, 20, C.white, RADIUS.full);
  backBtn.opacity = 0.15;
  frame.appendChild(backBtn);
  const backArrow = text("← Back", F.medium, 11, C.white, 26, 27);
  frame.appendChild(backArrow);

  // Screen title
  frame.appendChild(text("Applicant Detail", F.semiBold, 13, C.white, 0, 22));
  const titleT = frame.children[frame.children.length - 1];
  titleT.x = 220 - titleT.width / 2;
  titleT.opacity = 0.8;

  // ── Profile card ──
  const profileCard = rect(408, 120, 16, 96, C.surface, RADIUS.lg);
  profileCard.strokes = [{ type: "SOLID", color: C.border }];
  profileCard.strokeWeight = 1;
  frame.appendChild(profileCard);

  // Avatar
  const avBg = ellipse(64, 64, 28, 112, provider.headerColor);
  frame.appendChild(avBg);
  const avT = text(initials, F.bold, 22, C.white, 0, 0);
  avT.x = 28 + 32 - avT.width / 2;
  avT.y = 112 + 32 - avT.height / 2;
  frame.appendChild(avT);

  // Name + scholarship
  frame.appendChild(text(a.name, F.bold, 17, C.textPri, 106, 114));
  frame.appendChild(text(a.scholarship, F.regular, 12, C.textSec, 106, 136));
  frame.appendChild(text(a.date, F.regular, 11, C.textMuted, 106, 154));

  // Status badge (top-right of card)
  const badgeW = 72;
  const badge = rect(badgeW, 24, 328, 108, a.statusC, RADIUS.full);
  frame.appendChild(badge);
  const badgeT = text(a.status, F.semiBold, 10, a.statusTc, 0, 113);
  badgeT.x = 328 + badgeW / 2 - badgeT.width / 2;
  frame.appendChild(badgeT);

  // ── Info section ──
  frame.appendChild(text("APPLICANT INFO", F.semiBold, 10, C.textMuted, 16, 238));

  const infoCard = rect(408, 148, 16, 256, C.surface, RADIUS.md);
  infoCard.strokes = [{ type: "SOLID", color: C.border }];
  infoCard.strokeWeight = 1;
  frame.appendChild(infoCard);

  const infoRows = [
    { label: "Course",     value: "BS Computer Science" },
    { label: "Year Level", value: "3rd Year" },
    { label: "School",     value: "Western Leyte College" },
    { label: "GWA",        value: "1.45" },
  ];

  infoRows.forEach((row, i) => {
    const ry = 268 + i * 32;
    if (i > 0) frame.appendChild(rect(376, 1, 28, ry - 2, C.border));
    frame.appendChild(text(row.label, F.regular, 12, C.textSec, 28, ry));
    const valT = text(row.value, F.semiBold, 12, C.textPri, 0, ry);
    valT.x = 424 - valT.width - 16;
    frame.appendChild(valT);
  });

  // ── Documents section ──
  frame.appendChild(text("SUBMITTED DOCUMENTS", F.semiBold, 10, C.textMuted, 16, 422));

  const docs = [
    { name: "Grade Report (TOR)",       status: "✓ Verified"  },
    { name: "Certificate of Enrollment", status: "✓ Verified"  },
    { name: "PSA Birth Certificate",     status: "✓ Verified"  },
    { name: "Income Tax Return (ITR)",   status: "⏳ Pending"  },
  ];

  docs.forEach((doc, i) => {
    const dy = 440 + i * 58;
    const docCard = rect(408, 48, 16, dy, C.surface, RADIUS.md);
    docCard.strokes = [{ type: "SOLID", color: C.border }];
    docCard.strokeWeight = 1;
    frame.appendChild(docCard);

    // Doc icon
    const docIconBg = ellipse(32, 32, 26, dy + 8, C.bg);
    frame.appendChild(docIconBg);
    const docIconT = text("📄", F.regular, 14, C.textSec, 0, 0);
    docIconT.x = 26 + 16 - docIconT.width / 2;
    docIconT.y = dy + 8 + 16 - docIconT.height / 2;
    frame.appendChild(docIconT);

    frame.appendChild(text(doc.name, F.medium, 12, C.textPri, 68, dy + 10));

    const isVerified = doc.status.startsWith("✓");
    const statusColor = isVerified ? C.green : C.goldDark;
    frame.appendChild(text(doc.status, F.semiBold, 10, statusColor, 68, dy + 28));

    frame.appendChild(iconChevron(396, dy + 16, C.textMuted, 14));
  });

  // ── Remarks / Notes field ──
  frame.appendChild(text("REVIEWER NOTES", F.semiBold, 10, C.textMuted, 16, 676));

  const notesCard = rect(408, 72, 16, 694, C.surface, RADIUS.md);
  notesCard.strokes = [{ type: "SOLID", color: C.border }];
  notesCard.strokeWeight = 1;
  frame.appendChild(notesCard);
  frame.appendChild(text("Add notes or remarks for this applicant...", F.regular, 12, C.textMuted, 32, 718, { width: 360 }));

  // ── Action buttons ──
  frame.appendChild(rect(408, 1, 16, 782, C.border));

  // Approve button
  const approveBtn = rect(192, 52, 16, 796, C.green, RADIUS.md);
  frame.appendChild(approveBtn);
  const approvT = text("✓  Approve", F.semiBold, 14, C.white, 0, 811);
  approvT.x = 16 + 96 - approvT.width / 2;
  frame.appendChild(approvT);

  // Reject button
  const rejectBtn = rect(192, 52, 232, 796, C.coralLight, RADIUS.md);
  rejectBtn.strokes = [{ type: "SOLID", color: C.coral }];
  rejectBtn.strokeWeight = 1;
  frame.appendChild(rejectBtn);
  const rejectT = text("✕  Reject", F.semiBold, 14, C.coral, 0, 811);
  rejectT.x = 232 + 96 - rejectT.width / 2;
  frame.appendChild(rejectT);

  // Mark for review button (full width)
  const reviewBtn = rect(408, 44, 16, 856, C.bg, RADIUS.md);
  reviewBtn.strokes = [{ type: "SOLID", color: C.navy }];
  reviewBtn.strokeWeight = 1;
  frame.appendChild(reviewBtn);
  const reviewT = text("⊙  Mark for Review", F.semiBold, 13, C.navy, 0, 869);
  reviewT.x = 220 - reviewT.width / 2;
  frame.appendChild(reviewT);
}

// ── PROVIDER LOGIN BUILDER ─────────────────────────────────────────
function buildProviderLogin(frame, provider) {
  frame.appendChild(rect(440, 956, 0, 0, C.bg));
  frame.appendChild(rect(440, 320, 0, 0, provider.headerColor));

  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 8; col++) {
      const dot = ellipse(3, 3, 28 + col * 54, 28 + row * 58, C.white);
      dot.opacity = 0.07;
      frame.appendChild(dot);
    }
  }

  frame.appendChild(rect(64, 64, 188, 80, provider.badgeColor, RADIUS.xl));
  const mono = text(provider.monogram, F.bold, 28, C.gold, 0, 88);
  mono.x = 188 + 32 - mono.width / 2;
  frame.appendChild(mono);

  const wm = text("Scholaris", F.bold, 26, C.white, 0, 158);
  wm.x = 220 - wm.width / 2;
  frame.appendChild(wm);

  const sub = text("Provider Portal", F.medium, 13, C.greenLight, 0, 188);
  sub.x = 220 - sub.width / 2;
  sub.opacity = 0.85;
  frame.appendChild(sub);

  const card = rect(400, 480, 20, 260, C.surface, RADIUS.xl);
  card.strokes = [{ type: "SOLID", color: C.border }];
  card.strokeWeight = 1;
  frame.appendChild(card);

  frame.appendChild(text("Sign in", F.bold, 24, C.textPri, 36, 288));
  frame.appendChild(text(`Welcome back, ${provider.shortName} team`, F.regular, 14, C.textSec, 36, 318));
  frame.appendChild(rect(328, 1, 36, 344, C.border));

  frame.appendChild(text("Email address", F.semiBold, 12, C.textPri, 36, 360));
  const emailField = rect(368, 52, 36, 380, C.bg, RADIUS.sm);
  emailField.strokes = [{ type: "SOLID", color: C.border }];
  emailField.strokeWeight = 1.5;
  frame.appendChild(emailField);
  frame.appendChild(text(provider.emailPlaceholder, F.regular, 14, C.textMuted, 52, 393));

  frame.appendChild(text("Password", F.semiBold, 12, C.textPri, 36, 448));
  const passField = rect(368, 52, 36, 468, C.bg, RADIUS.sm);
  passField.strokes = [{ type: "SOLID", color: provider.headerColor }];
  passField.strokeWeight = 1.5;
  frame.appendChild(passField);
  frame.appendChild(text("••••••••••••", F.regular, 16, C.textPri, 52, 480));
  frame.appendChild(iconEye(364, 478, C.textMuted));

  const forgot = text("Forgot password?", F.medium, 13, C.goldDark, 0, 534);
  forgot.x = 220 - forgot.width / 2;
  frame.appendChild(forgot);

  frame.appendChild(rect(368, 54, 36, 562, provider.headerColor, RADIUS.sm));
  const btnT = text("Sign in", F.semiBold, 16, C.white, 0, 576);
  btnT.x = 220 - btnT.width / 2;
  frame.appendChild(btnT);
  frame.appendChild(text("→", F.bold, 16, C.white, 376, 576));

  frame.appendChild(rect(140, 1, 36, 634, C.border));
  frame.appendChild(rect(140, 1, 264, 634, C.border));
  const secLabel = text("secured by", F.regular, 11, C.textMuted, 0, 628);
  secLabel.x = 220 - secLabel.width / 2;
  frame.appendChild(secLabel);
  frame.appendChild(rect(160, 32, 140, 650, C.greenLight, RADIUS.sm));
  const secT = text("🔒  Government Portal", F.medium, 12, C.green, 0, 659);
  secT.x = 220 - secT.width / 2;
  frame.appendChild(secT);

  const ft = text("Scholaris © 2025  ·  Privacy  ·  Support", F.regular, 11, C.textMuted, 0, 920);
  ft.x = 220 - ft.width / 2;
  frame.appendChild(ft);
}

// ── DASHBOARD BUILDER ─────────────────────────────────────────────
function buildDashboard(frame, provider) {
  frame.appendChild(rect(440, 956, 0, 0, C.bg));
  addNavbar(frame, provider.shortName, provider.initials);

  frame.appendChild(rect(440, 100, 0, 72, provider.headerColor));
  frame.appendChild(text(`Good morning, ${provider.shortName} 👋`, F.semiBold, 16, C.white, 20, 88));
  frame.appendChild(text("Here's your scholarship overview", F.regular, 13, C.greenLight, 20, 112));

  provider.stats.forEach(s => addStatCard(frame, s.n, s.l, s.c, s.x, s.y, s.trend));

  frame.appendChild(rect(408, 1, 16, 392, C.border));
  frame.appendChild(text("Quick actions", F.semiBold, 14, C.textPri, 16, 404));
  const actions = [
    { label: "Review pending", sub: `${provider.pending} awaiting`, color: C.coral, x: 16  },
    { label: "Add scholarship", sub: "Post new",                    color: C.green, x: 148 },
    { label: "Export report",   sub: "Download CSV",                color: C.navy,  x: 280 },
  ];
  actions.forEach(a => {
    const qCard = rect(116, 72, a.x, 428, C.surface, RADIUS.md);
    qCard.strokes = [{ type: "SOLID", color: C.border }];
    qCard.strokeWeight = 1;
    frame.appendChild(qCard);
    frame.appendChild(ellipse(8, 8, a.x + 12, 440, a.color));
    frame.appendChild(text(a.label, F.semiBold, 11, C.textPri, a.x + 12, 456, { width: 92, lineHeight: 15 }));
    frame.appendChild(text(a.sub, F.regular, 10, C.textSec, a.x + 12, 478));
  });

  frame.appendChild(rect(408, 1, 16, 516, C.border));
  frame.appendChild(text("Recent activity", F.semiBold, 14, C.textPri, 16, 528));
  frame.appendChild(text("View all →", F.medium, 12, C.goldDark, 340, 530));

  provider.activity.forEach((a, i) => {
    const ay = 554 + i * 76;
    const rowBg = rect(408, 68, 16, ay, C.surface, RADIUS.md);
    rowBg.strokes = [{ type: "SOLID", color: C.border }];
    rowBg.strokeWeight = 1;
    frame.appendChild(rowBg);
    const avBg = ellipse(36, 36, 28, ay + 16, C.greenLight);
    frame.appendChild(avBg);
    const initials = a.name.split(" ").map(n => n[0]).join("").slice(0, 2);
    const avT = text(initials, F.semiBold, 12, C.green, 0, 0);
    avT.x = 28 + 18 - avT.width / 2;
    avT.y = ay + 16 + 18 - avT.height / 2;
    frame.appendChild(avT);
    frame.appendChild(text(a.name,   F.semiBold, 13, C.textPri,   74, ay + 14));
    frame.appendChild(text(a.action, F.regular,  11, C.textSec,   74, ay + 32, { width: 200, lineHeight: 16 }));
    frame.appendChild(text(a.time,   F.regular,  10, C.textMuted, 74, ay + 50));
    const badgeW = 52;
    const badge = rect(badgeW, 22, 340, ay + 22, a.statusC, RADIUS.full);
    frame.appendChild(badge);
    const badgeT = text(a.status, F.semiBold, 9, a.statusTc, 0, ay + 27);
    badgeT.x = 340 + badgeW / 2 - badgeT.width / 2;
    frame.appendChild(badgeT);
    frame.appendChild(iconChevron(394, ay + 24, C.textMuted, 14));
  });

  frame.appendChild(rect(408, 1, 16, 862, C.border));
  const hint = text("Showing last 24 hours · Tap any row to review", F.regular, 11, C.textMuted, 0, 866);
  hint.x = 220 - hint.width / 2;
  frame.appendChild(hint);

  addTabBar(frame, 0);
}

// ── SCHOLARSHIPS BUILDER ───────────────────────────────────────────
function buildScholarships(frame, provider) {
  frame.appendChild(rect(440, 956, 0, 0, C.bg));
  addNavbar(frame, provider.shortName, provider.initials);

  frame.appendChild(rect(440, 88, 0, 72, provider.headerColor));
  frame.appendChild(text("Scholarships", F.bold, 20, C.white, 20, 86));
  frame.appendChild(text(`${provider.scholarships.length} active · 0 draft`, F.regular, 13, C.greenLight, 20, 112));

  const searchField = rect(260, 44, 16, 176, C.surface, RADIUS.sm);
  searchField.strokes = [{ type: "SOLID", color: C.border }];
  searchField.strokeWeight = 1;
  frame.appendChild(searchField);
  frame.appendChild(text("Search scholarships...", F.regular, 13, C.textMuted, 32, 189));

  const filterBtn = rect(104, 44, 284, 176, C.surface, RADIUS.sm);
  filterBtn.strokes = [{ type: "SOLID", color: C.border }];
  filterBtn.strokeWeight = 1;
  frame.appendChild(filterBtn);
  const filterLabel = text("Filter ▾", F.medium, 13, C.textPri, 0, 189);
  filterLabel.x = 284 + 52 - filterLabel.width / 2;
  frame.appendChild(filterLabel);

  frame.appendChild(text("All scholarships", F.semiBold, 14, C.textPri, 16, 240));
  frame.appendChild(text("+ Add new", F.medium, 13, C.goldDark, 340, 240));

  provider.scholarships.forEach((s, i) => {
    const y = 258 + i * 136;
    const cardBg = rect(408, 120, 16, y, C.surface, RADIUS.md);
    cardBg.strokes = [{ type: "SOLID", color: C.border }];
    cardBg.strokeWeight = 1;
    frame.appendChild(cardBg);
    frame.appendChild(rect(3, 80, 16, y + 20, provider.headerColor));
    frame.appendChild(text(s.name,     F.semiBold, 15, C.textPri,             32, y + 16));
    frame.appendChild(text(s.provider, F.regular,  12, C.textSec,             32, y + 36));
    frame.appendChild(text(s.amount,   F.bold,     18, provider.headerColor,  32, y + 60));
    frame.appendChild(text("Deadline", F.regular,  10, C.textMuted,           32, y + 86));
    frame.appendChild(text(s.deadline, F.medium,   11, C.textPri,             84, y + 86));
    const badge = rect(56, 24, 340, y + 16, C.greenLight, RADIUS.full);
    frame.appendChild(badge);
    const badgeT = text("Active", F.semiBold, 10, C.green, 0, y + 21);
    badgeT.x = 340 + 28 - badgeT.width / 2;
    frame.appendChild(badgeT);
    frame.appendChild(rect(64, 22, 32, y + 92, C.bg, RADIUS.full));
    frame.appendChild(text(s.slots, F.regular, 10, C.textSec, 44, y + 96));
    frame.appendChild(rect(32, 32, 336, y + 76, C.bg, RADIUS.sm));
    const editIcon = text("✎", F.regular, 14, C.navy, 0, y + 82);
    editIcon.x = 336 + 16 - editIcon.width / 2;
    frame.appendChild(editIcon);
    frame.appendChild(rect(32, 32, 376, y + 76, C.bg, RADIUS.sm));
    const moreIcon = text("⋯", F.bold, 14, C.textSec, 0, y + 82);
    moreIcon.x = 376 + 16 - moreIcon.width / 2;
    frame.appendChild(moreIcon);
    frame.appendChild(iconChevron(396, y + 48, C.textMuted, 14));
  });

  const lastCardBottom = 258 + provider.scholarships.length * 136 + 8;
  frame.appendChild(rect(408, 1, 16, lastCardBottom, C.border));
  const hint = text("Tap any scholarship to view applicants", F.regular, 11, C.textMuted, 0, lastCardBottom + 8);
  hint.x = 220 - hint.width / 2;
  frame.appendChild(hint);

  const footerCard = rect(408, 72, 16, lastCardBottom + 28, C.surface, RADIUS.md);
  footerCard.strokes = [{ type: "SOLID", color: C.border }];
  footerCard.strokeWeight = 1;
  frame.appendChild(footerCard);
  frame.appendChild(text("Total scholarship budget", F.regular, 11, C.textSec,            28, lastCardBottom + 42));
  frame.appendChild(text(provider.totalBudget,        F.bold,    20, provider.headerColor, 28, lastCardBottom + 58));
  frame.appendChild(text(`Across ${provider.scholarships.length} active programs`, F.regular, 11, C.textMuted, 28, lastCardBottom + 82));
  frame.appendChild(iconChevron(396, lastCardBottom + 60, C.textMuted, 14));

  addTabBar(frame, 1);
}

// ── APPLICANTS BUILDER ────────────────────────────────────────────
function buildApplicants(frame, provider) {
  frame.appendChild(rect(440, 956, 0, 0, C.bg));
  addNavbar(frame, provider.shortName, provider.initials);

  frame.appendChild(rect(440, 88, 0, 72, provider.headerColor));
  frame.appendChild(text("Applicants", F.bold, 20, C.white, 20, 86));
  frame.appendChild(text(`${provider.applicants.length} total · ${provider.pending} pending review`, F.regular, 13, C.greenLight, 20, 112));

  const searchField = rect(260, 44, 16, 176, C.surface, RADIUS.sm);
  searchField.strokes = [{ type: "SOLID", color: C.border }];
  searchField.strokeWeight = 1;
  frame.appendChild(searchField);
  frame.appendChild(text("Search applicants...", F.regular, 13, C.textMuted, 32, 189));

  const filterBtn = rect(104, 44, 284, 176, C.surface, RADIUS.sm);
  filterBtn.strokes = [{ type: "SOLID", color: C.border }];
  filterBtn.strokeWeight = 1;
  frame.appendChild(filterBtn);
  const filterLabel = text("Status ▾", F.medium, 13, C.textPri, 0, 189);
  filterLabel.x = 284 + 52 - filterLabel.width / 2;
  frame.appendChild(filterLabel);

  const chips = ["All", "Pending", "Review", "Approved", "Rejected"];
  const chipColors = [provider.headerColor, C.coral, C.navy, C.green, C.textMuted];
  chips.forEach((chip, i) => {
    const cw = chip === "All" ? 36 : chip === "Pending" ? 60 : chip === "Review" ? 56 : chip === "Approved" ? 72 : 68;
    const cx = i === 0 ? 16 : i === 1 ? 60 : i === 2 ? 128 : i === 3 ? 192 : 272;
    const isActive = i === 0;
    const chipBg = rect(cw, 28, cx, 234, isActive ? chipColors[i] : C.surface, RADIUS.full);
    if (!isActive) {
      chipBg.strokes = [{ type: "SOLID", color: C.border }];
      chipBg.strokeWeight = 1;
    }
    frame.appendChild(chipBg);
    const chipT = text(chip, F.medium, 11, isActive ? C.white : C.textSec, 0, 240);
    chipT.x = cx + cw / 2 - chipT.width / 2;
    frame.appendChild(chipT);
  });

  frame.appendChild(text("All applicants", F.semiBold, 14, C.textPri, 16, 276));
  frame.appendChild(text("Export ↓", F.medium, 12, C.goldDark, 356, 278));

  provider.applicants.forEach((a, i) => {
    const ay = 298 + i * 86;
    const rowBg = rect(408, 76, 16, ay, C.surface, RADIUS.md);
    rowBg.strokes = [{ type: "SOLID", color: C.border }];
    rowBg.strokeWeight = 1;
    frame.appendChild(rowBg);

    const avBg = ellipse(40, 40, 28, ay + 18, C.greenLight);
    frame.appendChild(avBg);
    const initials = a.name.split(" ").map(n => n[0]).join("").slice(0, 2);
    const avT = text(initials, F.semiBold, 13, C.green, 0, 0);
    avT.x = 28 + 20 - avT.width / 2;
    avT.y = ay + 18 + 20 - avT.height / 2;
    frame.appendChild(avT);

    frame.appendChild(text(a.name,        F.semiBold, 13, C.textPri,   78, ay + 14));
    frame.appendChild(text(a.scholarship, F.regular,  11, C.textSec,   78, ay + 32, { width: 180, lineHeight: 15 }));
    frame.appendChild(text(a.date,        F.regular,  10, C.textMuted, 78, ay + 54));

    const badgeW = 62;
    const badge = rect(badgeW, 22, 328, ay + 26, a.statusC, RADIUS.full);
    frame.appendChild(badge);
    const badgeT = text(a.status, F.semiBold, 9, a.statusTc, 0, ay + 31);
    badgeT.x = 328 + badgeW / 2 - badgeT.width / 2;
    frame.appendChild(badgeT);

    frame.appendChild(iconChevron(396, ay + 28, C.textMuted, 14));
  });

  const lastRowBottom = 298 + provider.applicants.length * 86 + 8;
  frame.appendChild(rect(408, 1, 16, lastRowBottom, C.border));
  const hint = text("Tap any applicant to review their documents", F.regular, 11, C.textMuted, 0, lastRowBottom + 8);
  hint.x = 220 - hint.width / 2;
  frame.appendChild(hint);

  addTabBar(frame, 2);
}

// ── SETTINGS BUILDER ──────────────────────────────────────────────
function buildSettings(frame, provider) {
  frame.appendChild(rect(440, 956, 0, 0, C.bg));
  addNavbar(frame, provider.shortName, provider.initials);

  frame.appendChild(rect(440, 88, 0, 72, provider.headerColor));
  frame.appendChild(text("Settings", F.bold, 20, C.white, 20, 86));
  frame.appendChild(text(`${provider.name} Provider Portal`, F.regular, 13, C.greenLight, 20, 112));

  const profileCard = rect(408, 88, 16, 176, C.surface, RADIUS.md);
  profileCard.strokes = [{ type: "SOLID", color: C.border }];
  profileCard.strokeWeight = 1;
  frame.appendChild(profileCard);

  const av = ellipse(52, 52, 28, 194, C.gold);
  frame.appendChild(av);
  const avT = text(provider.initials, F.bold, 18, C.greenDark, 0, 0);
  avT.x = 28 + 26 - avT.width / 2;
  avT.y = 194 + 26 - avT.height / 2;
  frame.appendChild(avT);

  frame.appendChild(text(`${provider.name} Admin`, F.semiBold, 15, C.textPri, 92, 196));
  frame.appendChild(text(provider.emailPlaceholder,  F.regular,  12, C.textSec, 92, 218));

  const provBadge = rect(provider.name.length * 7 + 16, 22, 92, 242, C.greenLight, RADIUS.full);
  frame.appendChild(provBadge);
  const provBadgeT = text("Provider Admin", F.semiBold, 10, C.green, 0, 247);
  provBadgeT.x = 100;
  frame.appendChild(provBadgeT);

  frame.appendChild(text("ACCOUNT", F.semiBold, 11, C.textMuted, 16, 284));
  addSettingsRow(frame, "👤", "My Profile",     "Name, email, photo",    300);
  addSettingsRow(frame, "🏢", "Organization",   `${provider.name} details`, 368);
  addSettingsRow(frame, "🔔", "Notifications",  "Alerts & reminders",    436);

  frame.appendChild(text("SECURITY", F.semiBold, 11, C.textMuted, 16, 512));
  addSettingsRow(frame, "🔒", "Change Password",    "Last changed 30d ago",  528);
  addSettingsRow(frame, "🛡", "Two-Factor Auth",    "SMS verification on",   596);

  frame.appendChild(text("HELP & SUPPORT", F.semiBold, 11, C.textMuted, 16, 672));
  addSettingsRow(frame, "💬", "Contact Support", "support@scholaris.gov",  688);
  addSettingsRow(frame, "📄", "Terms & Privacy", "Legal documents",        756);

  frame.appendChild(rect(408, 1, 16, 832, C.border));

  const signOutBtn = rect(408, 52, 16, 848, C.coralLight, RADIUS.md);
  signOutBtn.strokes = [{ type: "SOLID", color: C.coral }];
  signOutBtn.strokeWeight = 1;
  frame.appendChild(signOutBtn);

  const signOutIcon = text("→", F.bold, 16, C.coral, 36, 859);
  frame.appendChild(signOutIcon);

  const signOutT = text("Sign out", F.semiBold, 15, C.coral, 0, 861);
  signOutT.x = 220 - signOutT.width / 2;
  frame.appendChild(signOutT);

  addTabBar(frame, 3);
}

// ── PROVIDER DATA ─────────────────────────────────────────────────
const PROVIDERS = {
  dost: {
    name: "DOST-SEI",
    shortName: "DOST-SEI",
    initials: "DS",
    monogram: "D",
    headerColor: C.green,
    badgeColor: C.greenDark,
    emailPlaceholder: "dost@example.gov.ph",
    pending: 18,
    totalBudget: "₱40,000 / year",
    stats: [
      { n: "124", l: "Total Applicants",    c: C.green, x: 16,  y: 162, trend: { up: true,  label: "+12" } },
      { n: "1",   l: "Active Scholarships", c: C.navy,  x: 228, y: 162, trend: null },
      { n: "18",  l: "Pending Reviews",     c: C.coral, x: 16,  y: 276, trend: { up: false, label: "Due" } },
      { n: "47",  l: "Approved This Month", c: C.green, x: 228, y: 276, trend: { up: true,  label: "+8" } },
    ],
    activity: [
      { name: "Juan dela Cruz", action: "Applied — DOST-SEI Scholarship", time: "2m ago",  status: "New",     statusC: C.greenLight, statusTc: C.green },
      { name: "Maria Santos",   action: "Documents verified",              time: "15m ago", status: "Done",    statusC: C.greenLight, statusTc: C.green },
      { name: "Pedro Reyes",    action: "Application under review",        time: "1h ago",  status: "Review",  statusC: { r:0.93, g:0.91, b:0.80 }, statusTc: C.navy },
      { name: "Ana Villanueva", action: "Submitted requirements",          time: "3h ago",  status: "Pending", statusC: C.coralLight, statusTc: C.coral },
    ],
    scholarships: [
      { name: "DOST-SEI Scholarship", provider: "Dept. of Science & Technology", amount: "₱40,000 / year", deadline: "Aug 31, 2025", slots: "68 slots" },
    ],
    applicants: [
      { name: "Juan dela Cruz",  scholarship: "DOST-SEI Scholarship", date: "Applied Jul 28, 2025", status: "New",      statusC: C.greenLight,                        statusTc: C.green },
      { name: "Maria Santos",    scholarship: "DOST-SEI Scholarship", date: "Applied Jul 25, 2025", status: "Approved", statusC: C.greenLight,                        statusTc: C.green },
      { name: "Pedro Reyes",     scholarship: "DOST-SEI Scholarship", date: "Applied Jul 22, 2025", status: "Review",   statusC: { r:0.93, g:0.91, b:0.80 },         statusTc: C.navy  },
      { name: "Ana Villanueva",  scholarship: "DOST-SEI Scholarship", date: "Applied Jul 20, 2025", status: "Pending",  statusC: C.coralLight,                        statusTc: C.coral },
      { name: "Carlo Mendoza",   scholarship: "DOST-SEI Scholarship", date: "Applied Jul 18, 2025", status: "Rejected", statusC: { r:0.95, g:0.92, b:0.92 },         statusTc: C.coral },
      { name: "Lara Aquino",     scholarship: "DOST-SEI Scholarship", date: "Applied Jul 15, 2025", status: "Approved", statusC: C.greenLight,                        statusTc: C.green },
    ],
  },
  ched: {
    name: "CHED",
    shortName: "CHED",
    initials: "CH",
    monogram: "C",
    headerColor: C.navy,
    badgeColor: { r: 0.059, g: 0.118, b: 0.220 },
    emailPlaceholder: "ched@example.gov.ph",
    pending: 24,
    totalBudget: "₱60,000 / year",
    stats: [
      { n: "210", l: "Total Applicants",    c: C.navy,  x: 16,  y: 162, trend: { up: true,  label: "+20" } },
      { n: "1",   l: "Active Scholarships", c: C.green, x: 228, y: 162, trend: null },
      { n: "24",  l: "Pending Reviews",     c: C.coral, x: 16,  y: 276, trend: { up: false, label: "Due" } },
      { n: "62",  l: "Approved This Month", c: C.navy,  x: 228, y: 276, trend: { up: true,  label: "+14" } },
    ],
    activity: [
      { name: "Liza Reyes",     action: "Applied — CHED Full Merit",       time: "5m ago",  status: "New",     statusC: C.greenLight,                        statusTc: C.green },
      { name: "Mark Bautista",  action: "Documents verified",              time: "30m ago", status: "Done",    statusC: C.greenLight,                        statusTc: C.green },
      { name: "Claire Santos",  action: "Application under review",        time: "2h ago",  status: "Review",  statusC: { r:0.93, g:0.91, b:0.80 },         statusTc: C.navy  },
      { name: "Jose Dela Rosa", action: "Submitted requirements",          time: "4h ago",  status: "Pending", statusC: C.coralLight,                        statusTc: C.coral },
    ],
    scholarships: [
      { name: "CHED Full Merit", provider: "Commission on Higher Education", amount: "₱60,000 / year", deadline: "Sep 15, 2025", slots: "120 slots" },
    ],
    applicants: [
      { name: "Liza Reyes",      scholarship: "CHED Full Merit", date: "Applied Jul 30, 2025", status: "New",      statusC: C.greenLight,                statusTc: C.green },
      { name: "Mark Bautista",   scholarship: "CHED Full Merit", date: "Applied Jul 27, 2025", status: "Approved", statusC: C.greenLight,                statusTc: C.green },
      { name: "Claire Santos",   scholarship: "CHED Full Merit", date: "Applied Jul 24, 2025", status: "Review",   statusC: { r:0.93, g:0.91, b:0.80 }, statusTc: C.navy  },
      { name: "Jose Dela Rosa",  scholarship: "CHED Full Merit", date: "Applied Jul 21, 2025", status: "Pending",  statusC: C.coralLight,                statusTc: C.coral },
      { name: "Rina Fernandez",  scholarship: "CHED Full Merit", date: "Applied Jul 19, 2025", status: "Approved", statusC: C.greenLight,                statusTc: C.green },
      { name: "Dante Castillo",  scholarship: "CHED Full Merit", date: "Applied Jul 16, 2025", status: "Rejected", statusC: { r:0.95, g:0.92, b:0.92 }, statusTc: C.coral },
    ],
  },
  sm: {
    name: "SM Foundation",
    shortName: "SM Found.",
    initials: "SM",
    monogram: "S",
    headerColor: { r: 0.204, g: 0.118, b: 0.482 },
    badgeColor:  { r: 0.118, g: 0.059, b: 0.290 },
    emailPlaceholder: "sm@smfoundation.org",
    pending: 11,
    totalBudget: "₱25,000 / year",
    stats: [
      { n: "88",  l: "Total Applicants",    c: { r: 0.204, g: 0.118, b: 0.482 }, x: 16,  y: 162, trend: { up: true,  label: "+6" } },
      { n: "1",   l: "Active Scholarships", c: C.green,                           x: 228, y: 162, trend: null },
      { n: "11",  l: "Pending Reviews",     c: C.coral,                           x: 16,  y: 276, trend: { up: false, label: "Due" } },
      { n: "29",  l: "Approved This Month", c: { r: 0.204, g: 0.118, b: 0.482 }, x: 228, y: 276, trend: { up: true,  label: "+5" } },
    ],
    activity: [
      { name: "Rosa Mercado", action: "Applied — SM Foundation Scholar",  time: "10m ago", status: "New",     statusC: C.greenLight,                        statusTc: C.green },
      { name: "Ben Torres",   action: "Documents verified",               time: "1h ago",  status: "Done",    statusC: C.greenLight,                        statusTc: C.green },
      { name: "Nina Garcia",  action: "Application under review",         time: "3h ago",  status: "Review",  statusC: { r:0.93, g:0.91, b:0.80 },         statusTc: C.navy  },
      { name: "Leo Cruz",     action: "Submitted requirements",           time: "5h ago",  status: "Pending", statusC: C.coralLight,                        statusTc: C.coral },
    ],
    scholarships: [
      { name: "SM Foundation Scholar", provider: "SM Foundation Inc.", amount: "₱25,000 / year", deadline: "Oct 1, 2025", slots: "50 slots" },
    ],
    applicants: [
      { name: "Rosa Mercado",  scholarship: "SM Foundation Scholar", date: "Applied Jul 29, 2025", status: "New",      statusC: C.greenLight,                statusTc: C.green },
      { name: "Ben Torres",    scholarship: "SM Foundation Scholar", date: "Applied Jul 26, 2025", status: "Approved", statusC: C.greenLight,                statusTc: C.green },
      { name: "Nina Garcia",   scholarship: "SM Foundation Scholar", date: "Applied Jul 23, 2025", status: "Review",   statusC: { r:0.93, g:0.91, b:0.80 }, statusTc: C.navy  },
      { name: "Leo Cruz",      scholarship: "SM Foundation Scholar", date: "Applied Jul 20, 2025", status: "Pending",  statusC: C.coralLight,                statusTc: C.coral },
      { name: "Pia Santos",    scholarship: "SM Foundation Scholar", date: "Applied Jul 17, 2025", status: "Approved", statusC: C.greenLight,                statusTc: C.green },
      { name: "Gino Reyes",    scholarship: "SM Foundation Scholar", date: "Applied Jul 14, 2025", status: "Rejected", statusC: { r:0.95, g:0.92, b:0.92 }, statusTc: C.coral },
    ],
  },
  ayala: {
    name: "Ayala Foundation",
    shortName: "Ayala Fnd.",
    initials: "AF",
    monogram: "A",
    headerColor: { r: 0.502, g: 0.251, b: 0.000 },
    badgeColor:  { r: 0.310, g: 0.153, b: 0.000 },
    emailPlaceholder: "ayala@ayalafoundation.org",
    pending: 9,
    totalBudget: "₱30,000 / year",
    stats: [
      { n: "76",  l: "Total Applicants",    c: { r: 0.502, g: 0.251, b: 0.000 }, x: 16,  y: 162, trend: { up: true,  label: "+4" } },
      { n: "1",   l: "Active Scholarships", c: C.green,                           x: 228, y: 162, trend: null },
      { n: "9",   l: "Pending Reviews",     c: C.coral,                           x: 16,  y: 276, trend: { up: false, label: "Due" } },
      { n: "21",  l: "Approved This Month", c: { r: 0.502, g: 0.251, b: 0.000 }, x: 228, y: 276, trend: { up: true,  label: "+3" } },
    ],
    activity: [
      { name: "Carla Tan",      action: "Applied — Ayala Foundation Grant", time: "8m ago",  status: "New",     statusC: C.greenLight,                        statusTc: C.green },
      { name: "Paolo Aquino",   action: "Documents verified",               time: "45m ago", status: "Done",    statusC: C.greenLight,                        statusTc: C.green },
      { name: "Maya Reyes",     action: "Application under review",         time: "2h ago",  status: "Review",  statusC: { r:0.93, g:0.91, b:0.80 },         statusTc: C.navy  },
      { name: "Sam Villanueva", action: "Submitted requirements",           time: "6h ago",  status: "Pending", statusC: C.coralLight,                        statusTc: C.coral },
    ],
    scholarships: [
      { name: "Ayala Foundation Grant", provider: "Ayala Foundation", amount: "₱30,000 / year", deadline: "Nov 15, 2025", slots: "40 slots" },
    ],
    applicants: [
      { name: "Carla Tan",       scholarship: "Ayala Foundation Grant", date: "Applied Jul 31, 2025", status: "New",      statusC: C.greenLight,                statusTc: C.green },
      { name: "Paolo Aquino",    scholarship: "Ayala Foundation Grant", date: "Applied Jul 28, 2025", status: "Approved", statusC: C.greenLight,                statusTc: C.green },
      { name: "Maya Reyes",      scholarship: "Ayala Foundation Grant", date: "Applied Jul 25, 2025", status: "Review",   statusC: { r:0.93, g:0.91, b:0.80 }, statusTc: C.navy  },
      { name: "Sam Villanueva",  scholarship: "Ayala Foundation Grant", date: "Applied Jul 22, 2025", status: "Pending",  statusC: C.coralLight,                statusTc: C.coral },
      { name: "Nico Bautista",   scholarship: "Ayala Foundation Grant", date: "Applied Jul 19, 2025", status: "Approved", statusC: C.greenLight,                statusTc: C.green },
      { name: "Diana Flores",    scholarship: "Ayala Foundation Grant", date: "Applied Jul 16, 2025", status: "Rejected", statusC: { r:0.95, g:0.92, b:0.92 }, statusTc: C.coral },
    ],
  },
};

// ── SCREEN 0: PROVIDER SELECTION ──────────────────────────────────
async function createProviderSelection() {
  await loadFonts();
  const frame = figma.createFrame();
  frame.name = "Screen 0 — Provider Selection";
  frame.resize(440, 956); frame.x = -520; frame.y = 0;

  frame.appendChild(rect(440, 956, 0, 0, C.bg));
  frame.appendChild(rect(440, 380, 0, 0, C.green));

  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 8; col++) {
      const dot = ellipse(3, 3, 28 + col * 54, 24 + row * 58, C.white);
      dot.opacity = 0.07;
      frame.appendChild(dot);
    }
  }

  frame.appendChild(rect(72, 72, 184, 80, C.greenDark, RADIUS.xl));
  const mono = text("S", F.bold, 36, C.gold, 0, 88);
  mono.x = 184 + 36 - mono.width / 2;
  frame.appendChild(mono);

  const wm = text("Scholaris", F.bold, 28, C.white, 0, 166);
  wm.x = 220 - wm.width / 2;
  frame.appendChild(wm);

  const sub = text("Provider Portal", F.medium, 14, C.greenLight, 0, 200);
  sub.x = 220 - sub.width / 2;
  sub.opacity = 0.85;
  frame.appendChild(sub);

  const tagline = text("Select your organization to continue", F.regular, 13, C.greenLight, 0, 228);
  tagline.x = 220 - tagline.width / 2;
  tagline.opacity = 0.7;
  frame.appendChild(tagline);

  const card = rect(400, 500, 20, 300, C.surface, RADIUS.xl);
  card.strokes = [{ type: "SOLID", color: C.border }];
  card.strokeWeight = 1;
  frame.appendChild(card);

  frame.appendChild(text("Sign in as", F.bold, 20, C.textPri, 36, 326));
  frame.appendChild(text("Choose your provider account below", F.regular, 13, C.textSec, 36, 354));
  frame.appendChild(rect(328, 1, 36, 378, C.border));

  const providers = [
    { label: "DOST-SEI",         sub: "Dept. of Science & Technology",  color: C.green,                              initial: "D", y: 394 },
    { label: "CHED",             sub: "Commission on Higher Education", color: C.navy,                               initial: "C", y: 470 },
    { label: "SM Foundation",    sub: "SM Foundation Inc.",             color: { r: 0.204, g: 0.118, b: 0.482 },    initial: "S", y: 546 },
    { label: "Ayala Foundation", sub: "Ayala Foundation Grant",         color: { r: 0.502, g: 0.251, b: 0.000 },    initial: "A", y: 622 },
  ];

  providers.forEach(p => {
    const btn = rect(368, 64, 36, p.y, p.color, RADIUS.md);
    btn.opacity = 0.08;
    frame.appendChild(btn);
    const btnBorder = rect(368, 64, 36, p.y, p.color, RADIUS.md);
    btnBorder.fills = [];
    btnBorder.strokes = [{ type: "SOLID", color: p.color }];
    btnBorder.strokeWeight = 1.5;
    frame.appendChild(btnBorder);
    const av = ellipse(40, 40, 48, p.y + 12, p.color);
    frame.appendChild(av);
    const avT = text(p.initial, F.bold, 16, C.white, 0, 0);
    avT.x = 48 + 20 - avT.width / 2;
    avT.y = p.y + 12 + 20 - avT.height / 2;
    frame.appendChild(avT);
    frame.appendChild(text(`Sign in as ${p.label}`, F.semiBold, 14, p.color, 100, p.y + 14));
    frame.appendChild(text(p.sub, F.regular, 11, C.textSec, 100, p.y + 36));
    frame.appendChild(iconChevron(380, p.y + 24, p.color, 14));
  });

  frame.appendChild(rect(328, 1, 36, 706, C.border));
  const ft = text("Scholaris © 2025  ·  Privacy  ·  Support", F.regular, 11, C.textMuted, 0, 718);
  ft.x = 220 - ft.width / 2;
  frame.appendChild(ft);
  const secT = text("🔒  All connections are government-secured", F.regular, 11, C.textMuted, 0, 740);
  secT.x = 220 - secT.width / 2;
  frame.appendChild(secT);

  figma.viewport.scrollAndZoomIntoView([frame]);
  figma.closePlugin("Provider Selection screen generated!");
}

// ── SCREEN GENERATORS (7 screens per provider) ────────────────────
async function createProviderScreens(key, xOffset) {
  await loadFonts();
  const p = PROVIDERS[key];
  const gap = 520;

  const frames = [];

  const loginFrame = figma.createFrame();
  loginFrame.name = `${p.name} — Login`;
  loginFrame.resize(440, 956); loginFrame.x = xOffset; loginFrame.y = 0;
  buildProviderLogin(loginFrame, p);
  frames.push(loginFrame);

  const dashFrame = figma.createFrame();
  dashFrame.name = `${p.name} — Dashboard`;
  dashFrame.resize(440, 956); dashFrame.x = xOffset + gap; dashFrame.y = 0;
  buildDashboard(dashFrame, p);
  frames.push(dashFrame);

  const scholFrame = figma.createFrame();
  scholFrame.name = `${p.name} — Scholarships`;
  scholFrame.resize(440, 956); scholFrame.x = xOffset + gap * 2; scholFrame.y = 0;
  buildScholarships(scholFrame, p);
  frames.push(scholFrame);

  // ── NEW: Add Scholarship screen ──
  const addScholFrame = figma.createFrame();
  addScholFrame.name = `${p.name} — Add Scholarship`;
  addScholFrame.resize(440, 956); addScholFrame.x = xOffset + gap * 3; addScholFrame.y = 0;
  buildAddScholarship(addScholFrame, p);
  frames.push(addScholFrame);

  const applicantsFrame = figma.createFrame();
  applicantsFrame.name = `${p.name} — Applicants`;
  applicantsFrame.resize(440, 956); applicantsFrame.x = xOffset + gap * 4; applicantsFrame.y = 0;
  buildApplicants(applicantsFrame, p);
  frames.push(applicantsFrame);

  const detailFrame = figma.createFrame();
  detailFrame.name = `${p.name} — Applicant Detail (${p.applicants[0].name})`;
  detailFrame.resize(440, 956); detailFrame.x = xOffset + gap * 5; detailFrame.y = 0;
  buildApplicantDetail(detailFrame, p);
  frames.push(detailFrame);

  const settingsFrame = figma.createFrame();
  settingsFrame.name = `${p.name} — Settings`;
  settingsFrame.resize(440, 956); settingsFrame.x = xOffset + gap * 6; settingsFrame.y = 0;
  buildSettings(settingsFrame, p);
  frames.push(settingsFrame);

  figma.viewport.scrollAndZoomIntoView(frames);
  figma.closePlugin(`${p.name} — all 7 screens generated!`);
}

// ── MESSAGE HANDLER ───────────────────────────────────────────────
figma.ui.onmessage = async (msg) => {
  if      (msg.type === "generate-selection")  await createProviderSelection();
  else if (msg.type === "generate-dost")       await createProviderScreens("dost",  0);
  else if (msg.type === "generate-ched")       await createProviderScreens("ched",  2800);
  else if (msg.type === "generate-sm")         await createProviderScreens("sm",    5600);
  else if (msg.type === "generate-ayala")      await createProviderScreens("ayala", 8400);
};