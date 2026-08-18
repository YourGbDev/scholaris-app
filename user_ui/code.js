// ─── Scholaris Design Toolkit ───────────────────────────────────────────────
// Figma plugin code.js — runs in the Figma sandbox

const BRAND = {
  colors: {
    bridgeGreen:      { r: 0.059, g: 0.302, b: 0.180 }, // #0F4D2E
    goldenOpportunity:{ r: 0.945, g: 0.706, b: 0.118 }, // #F1B41E
    navyTrust:        { r: 0.106, g: 0.227, b: 0.361 }, // #1B3A5C
    coralConnect:     { r: 1.000, g: 0.435, b: 0.349 }, // #FF6F59
    warmWhite:        { r: 0.980, g: 0.980, b: 0.973 }, // #FAFAF8
    white:            { r: 1.000, g: 1.000, b: 1.000 },
  },
  cornerRadius: 12,
  inputRadius: 10,
  buttonRadius: 50,
};

// Fonts
const F = {
  poppinsBold:     { family: 'Poppins', style: 'Bold' },
  poppinsSemi:     { family: 'Poppins', style: 'SemiBold' },
  poppinsRegular:  { family: 'Poppins', style: 'Regular' },
  openSansRegular: { family: 'Open Sans', style: 'Regular' },
  openSansSemi:    { family: 'Open Sans', style: 'SemiBold' },
};

async function loadFonts() {
  await figma.loadFontAsync(F.poppinsBold);
  await figma.loadFontAsync(F.poppinsSemi);
  await figma.loadFontAsync(F.poppinsRegular);
  await figma.loadFontAsync(F.openSansRegular);
  await figma.loadFontAsync(F.openSansSemi);
}

function hex(h) {
  const n = parseInt(h.replace('#',''), 16);
  return { r: ((n>>16)&255)/255, g: ((n>>8)&255)/255, b: (n&255)/255 };
}

figma.showUI(__html__, { width: 320, height: 780, title: 'Scholaris Toolkit' });

figma.ui.onmessage = async (msg) => {

  // ── 1. APPLY BRAND STYLES ────────────────────────────────────────────────
  if (msg.type === 'apply-styles') {
    const nodes = figma.currentPage.selection;
    if (!nodes.length) { figma.notify('⚠️ Select at least one layer first.'); return; }
    for (const node of nodes) { applyBrandStyle(node, msg.role); }
    figma.notify('✅ Scholaris styles applied!');
  }

  // ── 2. CREATE LOGIN SCREEN ───────────────────────────────────────────────
  if (msg.type === 'create-login') {
    await loadFonts();
    const frame = figma.createFrame();
    frame.name = 'Scholaris — Login';
    frame.resize(440, 956);
    frame.fills = [{ type: 'SOLID', color: BRAND.colors.warmWhite }];
    figma.currentPage.appendChild(frame);

    // BG blob
    const blob = figma.createEllipse();
    blob.resize(420, 420); blob.x = -60; blob.y = -160;
    blob.fills = [{ type: 'SOLID', color: BRAND.colors.bridgeGreen, opacity: 0.08 }];
    frame.appendChild(blob);

    // Wordmark
    const wordmark = figma.createText();
    wordmark.fontName = F.poppinsBold;
    wordmark.characters = 'Scholaris'; wordmark.fontSize = 32;
    wordmark.fills = [{ type: 'SOLID', color: BRAND.colors.bridgeGreen }];
    wordmark.letterSpacing = { value: -0.5, unit: 'PIXELS' };
    wordmark.textAlignHorizontal = 'CENTER';
    wordmark.resize(440, 48); wordmark.y = 140;
    frame.appendChild(wordmark);

    // Tagline
    const tagline = figma.createText();
    tagline.fontName = F.openSansRegular;
    tagline.characters = 'Your scholarship, found.'; tagline.fontSize = 14;
    tagline.fills = [{ type: 'SOLID', color: BRAND.colors.navyTrust, opacity: 0.6 }];
    tagline.textAlignHorizontal = 'CENTER';
    tagline.resize(440, 22); tagline.y = 196;
    frame.appendChild(tagline);

    // Welcome heading
    const welcome = figma.createText();
    welcome.fontName = F.poppinsBold;
    welcome.characters = 'Welcome back'; welcome.fontSize = 24;
    welcome.fills = [{ type: 'SOLID', color: BRAND.colors.navyTrust }];
    welcome.x = 32; welcome.y = 266;
    frame.appendChild(welcome);

    const sub = figma.createText();
    sub.fontName = F.openSansRegular;
    sub.characters = 'Sign in to continue to Scholaris'; sub.fontSize = 14;
    sub.fills = [{ type: 'SOLID', color: BRAND.colors.navyTrust, opacity: 0.55 }];
    sub.x = 32; sub.y = 300;
    frame.appendChild(sub);

    // Inputs
    frame.appendChild(createInputField('Email address', 32, 362, 376));
    frame.appendChild(createInputField('Password', 32, 432, 376));

    // Forgot password
    const forgot = figma.createText();
    forgot.fontName = F.openSansSemi;
    forgot.characters = 'Forgot password?'; forgot.fontSize = 13;
    forgot.fills = [{ type: 'SOLID', color: BRAND.colors.bridgeGreen }];
    forgot.x = 280; forgot.y = 502;
    frame.appendChild(forgot);

    // Sign In button
    frame.appendChild(createButton('Sign In', 32, 550, 376));

    // Divider
    const divTxt = figma.createText();
    divTxt.fontName = F.openSansRegular;
    divTxt.characters = 'or continue with'; divTxt.fontSize = 13;
    divTxt.fills = [{ type: 'SOLID', color: BRAND.colors.navyTrust, opacity: 0.4 }];
    divTxt.textAlignHorizontal = 'CENTER';
    divTxt.resize(376, 20); divTxt.x = 32; divTxt.y = 630;
    frame.appendChild(divTxt);

    frame.appendChild(createOutlineButton('Continue with Google', 32, 664, 376));

    // Sign up link
    const signupRow = figma.createText();
    signupRow.fontName = F.openSansRegular;
    signupRow.characters = "Don't have an account?  Sign up"; signupRow.fontSize = 13;
    signupRow.fills = [{ type: 'SOLID', color: BRAND.colors.navyTrust, opacity: 0.55 }];
    signupRow.textAlignHorizontal = 'CENTER';
    signupRow.resize(376, 20); signupRow.x = 32; signupRow.y = 902;
    frame.appendChild(signupRow);

    figma.viewport.scrollAndZoomIntoView([frame]);
    figma.notify('✅ Login screen created!');
  }

  // ── 3. CREATE SIGN UP SCREEN ─────────────────────────────────────────────
  if (msg.type === 'create-signup') {
    await loadFonts();
    const frame = figma.createFrame();
    frame.name = 'Scholaris — Sign Up';
    frame.resize(440, 956);
    frame.fills = [{ type: 'SOLID', color: BRAND.colors.warmWhite }];
    figma.currentPage.appendChild(frame);

    // BG blob
    const blob = figma.createEllipse();
    blob.resize(380, 380); blob.x = 120; blob.y = -140;
    blob.fills = [{ type: 'SOLID', color: BRAND.colors.goldenOpportunity, opacity: 0.07 }];
    frame.appendChild(blob);

    // Back button
    const back = figma.createRectangle();
    back.resize(40, 40); back.x = 24; back.y = 60; back.cornerRadius = 50;
    back.fills = [{ type: 'SOLID', color: BRAND.colors.navyTrust, opacity: 0.08 }];
    frame.appendChild(back);

    // Wordmark
    const wordmark = figma.createText();
    wordmark.fontName = F.poppinsBold;
    wordmark.characters = 'Scholaris'; wordmark.fontSize = 28;
    wordmark.fills = [{ type: 'SOLID', color: BRAND.colors.bridgeGreen }];
    wordmark.letterSpacing = { value: -0.5, unit: 'PIXELS' };
    wordmark.textAlignHorizontal = 'CENTER';
    wordmark.resize(440, 40); wordmark.y = 120;
    frame.appendChild(wordmark);

    // Heading
    const heading = figma.createText();
    heading.fontName = F.poppinsBold;
    heading.characters = 'Create your account'; heading.fontSize = 24;
    heading.fills = [{ type: 'SOLID', color: BRAND.colors.navyTrust }];
    heading.x = 32; heading.y = 186;
    frame.appendChild(heading);

    const sub = figma.createText();
    sub.fontName = F.openSansRegular;
    sub.characters = 'Start finding scholarships that match you'; sub.fontSize = 14;
    sub.fills = [{ type: 'SOLID', color: BRAND.colors.navyTrust, opacity: 0.55 }];
    sub.x = 32; sub.y = 220;
    frame.appendChild(sub);

    // Inputs
    frame.appendChild(createInputField('Full name', 32, 272, 376));
    frame.appendChild(createInputField('Email address', 32, 340, 376));
    frame.appendChild(createInputField('Password', 32, 408, 376));
    frame.appendChild(createInputField('Confirm password', 32, 476, 376));

    // Terms
    const terms = figma.createText();
    terms.fontName = F.openSansRegular;
    terms.characters = 'By signing up, you agree to our Terms & Privacy Policy'; terms.fontSize = 12;
    terms.fills = [{ type: 'SOLID', color: BRAND.colors.navyTrust, opacity: 0.45 }];
    terms.textAlignHorizontal = 'CENTER';
    terms.resize(376, 18); terms.x = 32; terms.y = 550;
    frame.appendChild(terms);

    frame.appendChild(createButton('Create Account', 32, 586, 376));

    // Divider
    const divTxt = figma.createText();
    divTxt.fontName = F.openSansRegular;
    divTxt.characters = 'or sign up with'; divTxt.fontSize = 13;
    divTxt.fills = [{ type: 'SOLID', color: BRAND.colors.navyTrust, opacity: 0.4 }];
    divTxt.textAlignHorizontal = 'CENTER';
    divTxt.resize(376, 20); divTxt.x = 32; divTxt.y = 660;
    frame.appendChild(divTxt);

    frame.appendChild(createOutlineButton('Continue with Google', 32, 694, 376));

    // Login link
    const loginRow = figma.createText();
    loginRow.fontName = F.openSansRegular;
    loginRow.characters = 'Already have an account?  Sign in'; loginRow.fontSize = 13;
    loginRow.fills = [{ type: 'SOLID', color: BRAND.colors.navyTrust, opacity: 0.55 }];
    loginRow.textAlignHorizontal = 'CENTER';
    loginRow.resize(376, 20); loginRow.x = 32; loginRow.y = 902;
    frame.appendChild(loginRow);

    figma.viewport.scrollAndZoomIntoView([frame]);
    figma.notify('✅ Sign Up screen created!');
  }

  // ── 4. CREATE HOME SCREEN ────────────────────────────────────────────────
  if (msg.type === 'create-home') {
    await loadFonts();
    const frame = figma.createFrame();
    frame.name = 'Scholaris — Home';
    frame.resize(440, 956);
    frame.fills = [{ type: 'SOLID', color: BRAND.colors.warmWhite }];
    figma.currentPage.appendChild(frame);

    // ── Top header bg
    const headerBg = figma.createRectangle();
    headerBg.resize(440, 200);
    headerBg.x = 0; headerBg.y = 0;
    headerBg.fills = [{ type: 'SOLID', color: BRAND.colors.bridgeGreen }];
    frame.appendChild(headerBg);

    // Greeting
    const greeting = figma.createText();
    greeting.fontName = F.openSansRegular;
    greeting.characters = 'Good morning 👋'; greeting.fontSize = 13;
    greeting.fills = [{ type: 'SOLID', color: BRAND.colors.white, opacity: 0.75 }];
    greeting.x = 28; greeting.y = 64;
    frame.appendChild(greeting);

    const name = figma.createText();
    name.fontName = F.poppinsBold;
    name.characters = 'Gilbert Bulado'; name.fontSize = 22;
    name.fills = [{ type: 'SOLID', color: BRAND.colors.white }];
    name.x = 28; name.y = 86;
    frame.appendChild(name);

    // Notification bell — flat icon in rounded square
    const bellBox = figma.createFrame();
    bellBox.resize(40, 40); bellBox.x = 372; bellBox.y = 72;
    bellBox.cornerRadius = 10;
    bellBox.fills = [{ type: 'SOLID', color: BRAND.colors.white, opacity: 0.15 }];
    frame.appendChild(bellBox);
    // Bell body
    const bellBody = figma.createEllipse();
    bellBody.resize(22, 20); bellBody.x = 9; bellBody.y = 6;
    bellBody.fills = [{ type: 'SOLID', color: BRAND.colors.white }];
    bellBox.appendChild(bellBody);
    // Bell stem
    const bellStem = figma.createRectangle();
    bellStem.resize(6, 6); bellStem.x = 17; bellStem.y = 2;
    bellStem.cornerRadius = 3;
    bellStem.fills = [{ type: 'SOLID', color: BRAND.colors.white }];
    bellBox.appendChild(bellStem);
    // Bell base
    const bellBase = figma.createRectangle();
    bellBase.resize(24, 4); bellBase.x = 8; bellBase.y = 24;
    bellBase.cornerRadius = 2;
    bellBase.fills = [{ type: 'SOLID', color: BRAND.colors.white }];
    bellBox.appendChild(bellBase);
    // Bell clapper
    const clapper = figma.createEllipse();
    clapper.resize(6, 6); clapper.x = 17; clapper.y = 27;
    clapper.fills = [{ type: 'SOLID', color: BRAND.colors.white }];
    bellBox.appendChild(clapper);

    // ── Search bar (overlapping header)
    const searchBar = figma.createFrame();
    searchBar.name = 'Search Bar';
    searchBar.resize(384, 48);
    searchBar.x = 28; searchBar.y = 170;
    searchBar.cornerRadius = 50;
    searchBar.fills = [{ type: 'SOLID', color: BRAND.colors.white }];
    searchBar.effects = [{
      type: 'DROP_SHADOW',
      color: { r: 0.106, g: 0.227, b: 0.361, a: 0.10 },
      offset: { x: 0, y: 4 }, radius: 12, spread: 0,
      visible: true, blendMode: 'NORMAL',
    }];
    frame.appendChild(searchBar);

    const searchTxt = figma.createText();
    searchTxt.fontName = F.openSansRegular;
    searchTxt.characters = '🔍  Search scholarships...'; searchTxt.fontSize = 13;
    searchTxt.fills = [{ type: 'SOLID', color: BRAND.colors.navyTrust, opacity: 0.4 }];
    searchTxt.x = 16; searchTxt.y = 14;
    searchBar.appendChild(searchTxt);

    // ── Matched count card
    const matchCard = figma.createFrame();
    matchCard.name = 'Matched Card';
    matchCard.resize(384, 88);
    matchCard.x = 28; matchCard.y = 240;
    matchCard.cornerRadius = BRAND.cornerRadius;
    matchCard.fills = [{ type: 'SOLID', color: BRAND.colors.goldenOpportunity, opacity: 0.15 }];
    frame.appendChild(matchCard);

    const matchNum = figma.createText();
    matchNum.fontName = F.poppinsBold;
    matchNum.characters = '12'; matchNum.fontSize = 36;
    matchNum.fills = [{ type: 'SOLID', color: BRAND.colors.bridgeGreen }];
    matchNum.x = 20; matchNum.y = 12;
    matchCard.appendChild(matchNum);

    const matchLabel = figma.createText();
    matchLabel.fontName = F.openSansRegular;
    matchLabel.characters = 'Scholarships matched\nto your profile'; matchLabel.fontSize = 13;
    matchLabel.fills = [{ type: 'SOLID', color: BRAND.colors.navyTrust, opacity: 0.7 }];
    matchLabel.x = 80; matchLabel.y = 20;
    matchCard.appendChild(matchLabel);

    const viewAll = figma.createText();
    viewAll.fontName = F.openSansSemi;
    viewAll.characters = 'View all →'; viewAll.fontSize = 12;
    viewAll.fills = [{ type: 'SOLID', color: BRAND.colors.bridgeGreen }];
    viewAll.x = 290; viewAll.y = 36;
    matchCard.appendChild(viewAll);

    // ── Section label: Featured
    const featuredLabel = figma.createText();
    featuredLabel.fontName = F.poppinsSemi;
    featuredLabel.characters = 'Featured Scholarships'; featuredLabel.fontSize = 16;
    featuredLabel.fills = [{ type: 'SOLID', color: BRAND.colors.navyTrust }];
    featuredLabel.x = 28; featuredLabel.y = 350;
    frame.appendChild(featuredLabel);

    // ── Scholarship Card 1
    const card1 = createScholarshipCard(28, 384, 384, 'DOST-SEI Scholarship', 'Dept. of Science & Technology', '₱40,000 / year', 'Deadline: Aug 31, 2025', 'Matched');
    frame.appendChild(card1);

    // ── Scholarship Card 2
    const card2 = createScholarshipCard(28, 560, 384, 'CHED Full Merit Scholarship', 'Commission on Higher Education', '₱60,000 / year', 'Deadline: Sep 15, 2025', 'Under Review');
    frame.appendChild(card2);

    // ── Section label: Application Status
    const statusLabel = figma.createText();
    statusLabel.fontName = F.poppinsSemi;
    statusLabel.characters = 'My Applications'; statusLabel.fontSize = 16;
    statusLabel.fills = [{ type: 'SOLID', color: BRAND.colors.navyTrust }];
    statusLabel.x = 28; statusLabel.y = 738;
    frame.appendChild(statusLabel);

    // Status pill row
    const statuses = [
      { label: 'Submitted', color: hex('#1B3A5C'), bg: 0.1 },
      { label: 'Under Review', color: hex('#F1B41E'), bg: 0.15 },
      { label: 'Approved', color: hex('#0F4D2E'), bg: 0.12 },
    ];
    let sx = 28;
    for (const s of statuses) {
      const pill = figma.createFrame();
      pill.resize(110, 36); pill.x = sx; pill.y = 772;
      pill.cornerRadius = 50;
      pill.fills = [{ type: 'SOLID', color: s.color, opacity: s.bg }];
      frame.appendChild(pill);
      const pillTxt = figma.createText();
      pillTxt.fontName = F.openSansSemi;
      pillTxt.characters = s.label; pillTxt.fontSize = 11;
      pillTxt.fills = [{ type: 'SOLID', color: s.color }];
      pillTxt.textAlignHorizontal = 'CENTER';
      pillTxt.textAlignVertical = 'CENTER';
      pillTxt.resize(110, 36);
      pill.appendChild(pillTxt);
      sx += 120;
    }

    // ── Bottom Nav Bar
    frame.appendChild(createBottomNav('Home', frame));

    figma.viewport.scrollAndZoomIntoView([frame]);
    figma.notify('✅ Home screen created!');
  }

  // ── 5. CREATE SPLASH SCREEN ──────────────────────────────────────────────
  if (msg.type === 'create-splash') {
    await loadFonts();
    await figma.loadFontAsync({ family: 'Roboto Mono', style: 'Regular' });

    const frame = figma.createFrame();
    frame.name = 'Scholaris — Splash';
    frame.resize(440, 956);
    frame.fills = [{ type: 'SOLID', color: BRAND.colors.bridgeGreen }];
    figma.currentPage.appendChild(frame);

    // Subtle radial glow behind logo
    const glow = figma.createEllipse();
    glow.resize(400, 400);
    glow.x = 20; glow.y = 200;
    glow.fills = [{ type: 'SOLID', color: BRAND.colors.white, opacity: 0.04 }];
    frame.appendChild(glow);

    // ── Bridge arch (rectangle as base)
    const archBase = figma.createRectangle();
    archBase.name = 'Bridge Base';
    archBase.resize(220, 12);
    archBase.x = 110; archBase.y = 490;
    archBase.cornerRadius = 6;
    archBase.fills = [{ type: 'SOLID', color: BRAND.colors.goldenOpportunity }];
    frame.appendChild(archBase);

    // Left pillar
    const pillarL = figma.createRectangle();
    pillarL.resize(16, 80); pillarL.x = 130; pillarL.y = 414;
    pillarL.cornerRadius = 4;
    pillarL.fills = [{ type: 'SOLID', color: BRAND.colors.white, opacity: 0.9 }];
    frame.appendChild(pillarL);

    // Right pillar
    const pillarR = figma.createRectangle();
    pillarR.resize(16, 80); pillarR.x = 294; pillarR.y = 414;
    pillarR.cornerRadius = 4;
    pillarR.fills = [{ type: 'SOLID', color: BRAND.colors.white, opacity: 0.9 }];
    frame.appendChild(pillarR);

    // Arch curve (ellipse top half)
    const arch = figma.createEllipse();
    arch.name = 'Bridge Arch';
    arch.resize(180, 90);
    arch.x = 130; arch.y = 400;
    arch.fills = [];
    arch.strokes = [{ type: 'SOLID', color: BRAND.colors.white, opacity: 0.9 }];
    arch.strokeWeight = 8;
    arch.strokeAlign = 'CENTER';
    frame.appendChild(arch);

    // ── Graduation cap (on top of arch)
    // Cap board
    const capBoard = figma.createRectangle();
    capBoard.name = 'Cap Board';
    capBoard.resize(80, 12);
    capBoard.x = 180; capBoard.y = 368;
    capBoard.cornerRadius = 3;
    capBoard.fills = [{ type: 'SOLID', color: BRAND.colors.goldenOpportunity }];
    frame.appendChild(capBoard);

    // Cap top (diamond shape via rotation)
    const capTop = figma.createRectangle();
    capTop.name = 'Cap Top';
    capTop.resize(56, 56);
    capTop.x = 192; capTop.y = 342;
    capTop.cornerRadius = 4;
    capTop.rotation = 45;
    capTop.fills = [{ type: 'SOLID', color: BRAND.colors.goldenOpportunity }];
    frame.appendChild(capTop);

    // Tassel
    const tassel = figma.createRectangle();
    tassel.name = 'Tassel';
    tassel.resize(4, 36);
    tassel.x = 248; tassel.y = 368;
    tassel.cornerRadius = 2;
    tassel.fills = [{ type: 'SOLID', color: BRAND.colors.goldenOpportunity, opacity: 0.8 }];
    frame.appendChild(tassel);

    const tasselEnd = figma.createEllipse();
    tasselEnd.resize(10, 10); tasselEnd.x = 245; tasselEnd.y = 402;
    tasselEnd.fills = [{ type: 'SOLID', color: BRAND.colors.goldenOpportunity }];
    frame.appendChild(tasselEnd);

    // ── Wordmark
    const wordmark = figma.createText();
    wordmark.fontName = F.poppinsBold;
    wordmark.characters = 'Scholaris';
    wordmark.fontSize = 40;
    wordmark.fills = [{ type: 'SOLID', color: BRAND.colors.white }];
    wordmark.letterSpacing = { value: -0.5, unit: 'PIXELS' };
    wordmark.textAlignHorizontal = 'CENTER';
    wordmark.resize(440, 56); wordmark.y = 536;
    frame.appendChild(wordmark);

    // Tagline
    const tagline = figma.createText();
    tagline.fontName = F.openSansRegular;
    tagline.characters = 'Your scholarship, found.';
    tagline.fontSize = 15;
    tagline.fills = [{ type: 'SOLID', color: BRAND.colors.white, opacity: 0.7 }];
    tagline.textAlignHorizontal = 'CENTER';
    tagline.resize(440, 24); tagline.y = 602;
    frame.appendChild(tagline);

    // ── Bottom section
    // Thin divider line
    const divider = figma.createRectangle();
    divider.resize(60, 2); divider.x = 190; divider.y = 650;
    divider.cornerRadius = 1;
    divider.fills = [{ type: 'SOLID', color: BRAND.colors.goldenOpportunity, opacity: 0.6 }];
    frame.appendChild(divider);

    // Subtitle
    const subtitle = figma.createText();
    subtitle.fontName = F.openSansRegular;
    subtitle.characters = 'Bridging students to opportunities\nthat change their lives.';
    subtitle.fontSize = 13;
    subtitle.fills = [{ type: 'SOLID', color: BRAND.colors.white, opacity: 0.55 }];
    subtitle.textAlignHorizontal = 'CENTER';
    subtitle.lineHeight = { value: 22, unit: 'PIXELS' };
    subtitle.resize(320, 50); subtitle.x = 60; subtitle.y = 668;
    frame.appendChild(subtitle);

    // Loading dots
    const dotColors = [1, 0.5, 0.25];
    for (let i = 0; i < 3; i++) {
      const dot = figma.createEllipse();
      dot.resize(8, 8); dot.x = 204 + i * 18; dot.y = 750;
      dot.fills = [{ type: 'SOLID', color: BRAND.colors.goldenOpportunity, opacity: dotColors[i] }];
      frame.appendChild(dot);
    }

    // Version tag
    const version = figma.createText();
    version.fontName = { family: 'Roboto Mono', style: 'Regular' };
    version.characters = 'v1.0.0';
    version.fontSize = 11;
    version.fills = [{ type: 'SOLID', color: BRAND.colors.white, opacity: 0.25 }];
    version.textAlignHorizontal = 'CENTER';
    version.resize(440, 18); version.y = 900;
    frame.appendChild(version);

    figma.viewport.scrollAndZoomIntoView([frame]);
    figma.notify('✅ Splash screen created!');
  }

  // ── 6. CREATE COMPONENTS ──────────────────────────────────────────────────
  if (msg.type === 'create-components') {
    await loadFonts();
    await figma.loadFontAsync({ family: 'Roboto Mono', style: 'Regular' });

    let x = 0;
    let y = 0;

    // ── SECTION LABEL: SAMPLE ICON SET ──
    const iconLabel = figma.createText();
    iconLabel.fontName = F.openSansSemi;
    iconLabel.characters = 'SAMPLE ICON SET'; iconLabel.fontSize = 11;
    iconLabel.fills = [{ type: 'SOLID', color: BRAND.colors.navyTrust, opacity: 0.45 }];
    iconLabel.letterSpacing = { value: 1.2, unit: 'PIXELS' };
    iconLabel.x = 0; iconLabel.y = y;
    figma.currentPage.appendChild(iconLabel);
    y += 28;

    // Icon data from PPT: student, match, search, upload, check, bell
    const icons = [
      { name: '🎓 Student', emoji: '🎓' },
      { name: '📋 Match',   emoji: '🤝' },
      { name: '🔍 Search',  emoji: '🔍' },
      { name: '⬆ Upload',  emoji: '⬆️' },
      { name: '✅ Check',   emoji: '✅' },
      { name: '🔔 Bell',    emoji: '🔔' },
    ];

    x = 0;
    for (const icon of icons) {
      // White rounded square bg
      const iconBox = figma.createFrame();
      iconBox.name = icon.name;
      iconBox.resize(64, 64); iconBox.x = x; iconBox.y = y;
      iconBox.cornerRadius = 14;
      iconBox.fills = [{ type: 'SOLID', color: BRAND.colors.white }];
      iconBox.strokes = [{ type: 'SOLID', color: BRAND.colors.navyTrust, opacity: 0.1 }];
      iconBox.strokeWeight = 1.5; iconBox.strokeAlign = 'INSIDE';
      iconBox.effects = [{
        type: 'DROP_SHADOW',
        color: { r: 0.106, g: 0.227, b: 0.361, a: 0.06 },
        offset: { x: 0, y: 2 }, radius: 8, spread: 0,
        visible: true, blendMode: 'NORMAL',
      }];
      figma.currentPage.appendChild(iconBox);

      // Icon emoji in green
      const iconTxt = figma.createText();
      iconTxt.fontName = F.openSansRegular;
      iconTxt.characters = icon.emoji; iconTxt.fontSize = 28;
      iconTxt.textAlignHorizontal = 'CENTER';
      iconTxt.textAlignVertical = 'CENTER';
      iconTxt.resize(64, 64);
      iconBox.appendChild(iconTxt);

      x += 80;
    }
    y += 96;

    // ── SECTION LABEL: SAMPLE BUTTONS & TAGS ──
    const btnLabel = figma.createText();
    btnLabel.fontName = F.openSansSemi;
    btnLabel.characters = 'SAMPLE BUTTONS & TAGS'; btnLabel.fontSize = 11;
    btnLabel.fills = [{ type: 'SOLID', color: BRAND.colors.navyTrust, opacity: 0.45 }];
    btnLabel.letterSpacing = { value: 1.2, unit: 'PIXELS' };
    btnLabel.x = 0; btnLabel.y = y;
    figma.currentPage.appendChild(btnLabel);
    y += 28;

    // Apply Now — dark green pill (primary)
    const applyBtn = createButton('Apply Now', 0, y, 148);
    applyBtn.name = '🟢 Btn — Apply Now';
    figma.currentPage.appendChild(applyBtn);

    // View Match — coral pill
    const viewMatchBtn = figma.createFrame();
    viewMatchBtn.name = '🟠 Btn — View Match';
    viewMatchBtn.resize(148, 52); viewMatchBtn.x = 164; viewMatchBtn.y = y;
    viewMatchBtn.cornerRadius = BRAND.buttonRadius;
    viewMatchBtn.fills = [{ type: 'SOLID', color: BRAND.colors.coralConnect }];
    figma.currentPage.appendChild(viewMatchBtn);
    const vmTxt = figma.createText();
    vmTxt.fontName = F.openSansSemi;
    vmTxt.characters = 'View Match'; vmTxt.fontSize = 15;
    vmTxt.fills = [{ type: 'SOLID', color: BRAND.colors.white }];
    vmTxt.textAlignHorizontal = 'CENTER';
    vmTxt.textAlignVertical = 'CENTER';
    vmTxt.resize(148, 52);
    viewMatchBtn.appendChild(vmTxt);

    // Learn More — outline pill
    const learnBtn = createOutlineButton('Learn More', 328, y, 148);
    learnBtn.name = '⬜ Btn — Learn More';
    figma.currentPage.appendChild(learnBtn);

    y += 72;

    // ── STATUS TAGS ──
    const tags = [
      { label: 'Approved',        bg: BRAND.colors.bridgeGreen,      txt: BRAND.colors.bridgeGreen,      opacity: 0.12 },
      { label: 'Under Review',    bg: BRAND.colors.goldenOpportunity, txt: BRAND.colors.goldenOpportunity, opacity: 0.15 },
      { label: 'Needs Documents', bg: BRAND.colors.coralConnect,      txt: BRAND.colors.coralConnect,      opacity: 0.12 },
    ];

    x = 0;
    for (const tag of tags) {
      const tagW = tag.label.length * 9 + 24;
      const tagFrame = figma.createFrame();
      tagFrame.name = `🏷 Tag — ${tag.label}`;
      tagFrame.resize(tagW, 32); tagFrame.x = x; tagFrame.y = y;
      tagFrame.cornerRadius = 50;
      tagFrame.fills = [{ type: 'SOLID', color: tag.bg, opacity: tag.opacity }];
      figma.currentPage.appendChild(tagFrame);

      const tagTxt = figma.createText();
      tagTxt.fontName = F.openSansSemi;
      tagTxt.characters = tag.label; tagTxt.fontSize = 12;
      tagTxt.fills = [{ type: 'SOLID', color: tag.txt }];
      tagTxt.textAlignHorizontal = 'CENTER';
      tagTxt.textAlignVertical = 'CENTER';
      tagTxt.resize(tagW, 32);
      tagFrame.appendChild(tagTxt);

      x += tagW + 16;
    }
    y += 56;

    // ── INPUT FIELD ──
    const inputLabel = figma.createText();
    inputLabel.fontName = F.openSansSemi;
    inputLabel.characters = 'INPUT FIELD'; inputLabel.fontSize = 11;
    inputLabel.fills = [{ type: 'SOLID', color: BRAND.colors.navyTrust, opacity: 0.45 }];
    inputLabel.letterSpacing = { value: 1.2, unit: 'PIXELS' };
    inputLabel.x = 0; inputLabel.y = y;
    figma.currentPage.appendChild(inputLabel);
    y += 28;

    const inputField = createInputField('Placeholder text', 0, y, 380);
    inputField.name = '📝 Input/Default';
    figma.currentPage.appendChild(inputField);
    y += 72;

    // ── SCHOLARSHIP CARD ──
    const cardLabel = figma.createText();
    cardLabel.fontName = F.openSansSemi;
    cardLabel.characters = 'SCHOLARSHIP CARD'; cardLabel.fontSize = 11;
    cardLabel.fills = [{ type: 'SOLID', color: BRAND.colors.navyTrust, opacity: 0.45 }];
    cardLabel.letterSpacing = { value: 1.2, unit: 'PIXELS' };
    cardLabel.x = 0; cardLabel.y = y;
    figma.currentPage.appendChild(cardLabel);
    y += 28;

    const card = createScholarshipCard(0, y, 380, 'DOST-SEI Scholarship', 'Dept. of Science & Technology', '₱40,000 / year', 'Deadline: Aug 31, 2025', 'Matched');
    card.name = '📋 Card/Scholarship';
    figma.currentPage.appendChild(card);

    figma.viewport.scrollAndZoomIntoView(figma.currentPage.children);
    figma.notify('✅ Scholaris components created!');
  }

  // ── 7. SCHOLARSHIP LIST SCREEN ───────────────────────────────────────────
  if (msg.type === 'create-list') {
    await loadFonts();
    const frame = figma.createFrame();
    frame.name = 'Scholaris — Scholarship List';
    frame.resize(440, 956);
    frame.fills = [{ type: 'SOLID', color: BRAND.colors.warmWhite }];
    figma.currentPage.appendChild(frame);

    // Header bg
    const headerBg = figma.createRectangle();
    headerBg.resize(440, 130); headerBg.x = 0; headerBg.y = 0;
    headerBg.fills = [{ type: 'SOLID', color: BRAND.colors.bridgeGreen }];
    frame.appendChild(headerBg);

    // Back arrow icon (two rectangles forming <)
    const arrowH = figma.createRectangle();
    arrowH.resize(20, 3); arrowH.x = 28; arrowH.y = 67;
    arrowH.cornerRadius = 2;
    arrowH.fills = [{ type: 'SOLID', color: BRAND.colors.white }];
    frame.appendChild(arrowH);
    const arrowT = figma.createRectangle();
    arrowT.resize(10, 3); arrowT.x = 28; arrowT.y = 61;
    arrowT.cornerRadius = 2; arrowT.rotation = -45;
    arrowT.fills = [{ type: 'SOLID', color: BRAND.colors.white }];
    frame.appendChild(arrowT);
    const arrowB = figma.createRectangle();
    arrowB.resize(10, 3); arrowB.x = 28; arrowB.y = 73;
    arrowB.cornerRadius = 2; arrowB.rotation = 45;
    arrowB.fills = [{ type: 'SOLID', color: BRAND.colors.white }];
    frame.appendChild(arrowB);

    // Title
    const title = figma.createText();
    title.fontName = F.poppinsBold;
    title.characters = 'Scholarships'; title.fontSize = 20;
    title.fills = [{ type: 'SOLID', color: BRAND.colors.white }];
    title.x = 60; title.y = 58;
    frame.appendChild(title);

    // Filter icon (three horizontal lines — funnel)
    for (let i = 0; i < 3; i++) {
      const line = figma.createRectangle();
      line.resize(20 - i * 4, 2.5);
      line.x = 394 + i * 2; line.y = 60 + i * 7;
      line.cornerRadius = 2;
      line.fills = [{ type: 'SOLID', color: BRAND.colors.white }];
      frame.appendChild(line);
    }

    // Search bar
    const searchBar = figma.createFrame();
    searchBar.resize(384, 46); searchBar.x = 28; searchBar.y = 102;
    searchBar.cornerRadius = 50;
    searchBar.fills = [{ type: 'SOLID', color: BRAND.colors.white }];
    searchBar.effects = [{
      type: 'DROP_SHADOW',
      color: { r: 0.106, g: 0.227, b: 0.361, a: 0.10 },
      offset: { x: 0, y: 4 }, radius: 10, spread: 0,
      visible: true, blendMode: 'NORMAL',
    }];
    frame.appendChild(searchBar);

    // 🔍 search icon text
    const searchIcon = figma.createText();
    searchIcon.fontName = F.openSansRegular;
    searchIcon.characters = '🔍'; searchIcon.fontSize = 14;
    searchIcon.x = 14; searchIcon.y = 12;
    searchBar.appendChild(searchIcon);

    const searchTxt = figma.createText();
    searchTxt.fontName = F.openSansRegular;
    searchTxt.characters = 'Search scholarships...'; searchTxt.fontSize = 13;
    searchTxt.fills = [{ type: 'SOLID', color: BRAND.colors.navyTrust, opacity: 0.4 }];
    searchTxt.x = 40; searchTxt.y = 14;
    searchBar.appendChild(searchTxt);

    // Filter chips
    const filters = ['All', 'Government', 'Private', 'School-based'];
    const filterColors = [true, false, false, false];
    let fx = 28;
    for (let i = 0; i < filters.length; i++) {
      const chip = figma.createFrame();
      const chipW = filters[i].length * 9 + 24;
      chip.resize(chipW, 34); chip.x = fx; chip.y = 162;
      chip.cornerRadius = 50;
      chip.fills = [{ type: 'SOLID', color: filterColors[i] ? BRAND.colors.bridgeGreen : BRAND.colors.white }];
      if (!filterColors[i]) {
        chip.strokes = [{ type: 'SOLID', color: BRAND.colors.navyTrust, opacity: 0.2 }];
        chip.strokeWeight = 1.5; chip.strokeAlign = 'INSIDE';
      }
      frame.appendChild(chip);
      const chipTxt = figma.createText();
      chipTxt.fontName = F.openSansSemi;
      chipTxt.characters = filters[i]; chipTxt.fontSize = 12;
      chipTxt.fills = [{ type: 'SOLID', color: filterColors[i] ? BRAND.colors.white : BRAND.colors.navyTrust, opacity: filterColors[i] ? 1 : 0.7 }];
      chipTxt.textAlignHorizontal = 'CENTER';
      chipTxt.textAlignVertical = 'CENTER';
      chipTxt.resize(chipW, 34);
      chip.appendChild(chipTxt);
      fx += chipW + 8;
    }

    // Results count
    const resultCount = figma.createText();
    resultCount.fontName = F.openSansRegular;
    resultCount.characters = '12 scholarships found'; resultCount.fontSize = 12;
    resultCount.fills = [{ type: 'SOLID', color: BRAND.colors.navyTrust, opacity: 0.5 }];
    resultCount.x = 28; resultCount.y = 214;
    frame.appendChild(resultCount);

    // Scholarship cards list
    const listItems = [
      { title: 'DOST-SEI Scholarship', org: 'Dept. of Science & Technology', amount: '₱40,000 / year', deadline: 'Deadline: Aug 31, 2025', status: 'Matched' },
      { title: 'CHED Full Merit', org: 'Commission on Higher Education', amount: '₱60,000 / year', deadline: 'Deadline: Sep 15, 2025', status: 'Under Review' },
      { title: 'SM Foundation Scholar', org: 'SM Foundation Inc.', amount: '₱25,000 / year', deadline: 'Deadline: Oct 1, 2025', status: 'Matched' },
      { title: 'Ayala Foundation Grant', org: 'Ayala Foundation', amount: '₱30,000 / year', deadline: 'Deadline: Sep 30, 2025', status: 'Approved' },
    ];

    let cardY = 242;
    for (const item of listItems) {
      const card = createScholarshipCard(28, cardY, 384, item.title, item.org, item.amount, item.deadline, item.status);
      frame.appendChild(card);
      cardY += 172;
    }

    // Bottom nav
    frame.appendChild(createBottomNav('Search', frame));

    figma.viewport.scrollAndZoomIntoView([frame]);
    figma.notify('✅ Scholarship List screen created!');
  }

  // ── 8. SCHOLARSHIP DETAILS SCREEN ────────────────────────────────────────
  if (msg.type === 'create-details') {
    await loadFonts();
    const frame = figma.createFrame();
    frame.name = 'Scholaris — Scholarship Details';
    frame.resize(440, 956);
    frame.fills = [{ type: 'SOLID', color: BRAND.colors.warmWhite }];
    figma.currentPage.appendChild(frame);

    // Header bg
    const headerBg = figma.createRectangle();
    headerBg.resize(440, 180); headerBg.x = 0; headerBg.y = 0;
    headerBg.fills = [{ type: 'SOLID', color: BRAND.colors.bridgeGreen }];
    frame.appendChild(headerBg);

    // Back arrow
    const arrowH = figma.createRectangle();
    arrowH.resize(20, 3); arrowH.x = 28; arrowH.y = 67;
    arrowH.cornerRadius = 2;
    arrowH.fills = [{ type: 'SOLID', color: BRAND.colors.white }];
    frame.appendChild(arrowH);
    const arrowT = figma.createRectangle();
    arrowT.resize(10, 3); arrowT.x = 28; arrowT.y = 61;
    arrowT.cornerRadius = 2; arrowT.rotation = -45;
    arrowT.fills = [{ type: 'SOLID', color: BRAND.colors.white }];
    frame.appendChild(arrowT);
    const arrowB2 = figma.createRectangle();
    arrowB2.resize(10, 3); arrowB2.x = 28; arrowB2.y = 73;
    arrowB2.cornerRadius = 2; arrowB2.rotation = 45;
    arrowB2.fills = [{ type: 'SOLID', color: BRAND.colors.white }];
    frame.appendChild(arrowB2);

    // Scholarship name in header
    const schName = figma.createText();
    schName.fontName = F.poppinsBold;
    schName.characters = 'DOST-SEI Scholarship'; schName.fontSize = 20;
    schName.fills = [{ type: 'SOLID', color: BRAND.colors.white }];
    schName.x = 28; schName.y = 100;
    frame.appendChild(schName);

    const orgName = figma.createText();
    orgName.fontName = F.openSansRegular;
    orgName.characters = 'Dept. of Science & Technology'; orgName.fontSize = 13;
    orgName.fills = [{ type: 'SOLID', color: BRAND.colors.white, opacity: 0.75 }];
    orgName.x = 28; orgName.y = 130;
    frame.appendChild(orgName);

    // Matched badge in header
    const mBadge = figma.createFrame();
    mBadge.resize(80, 26); mBadge.x = 332; mBadge.y = 100;
    mBadge.cornerRadius = 50;
    mBadge.fills = [{ type: 'SOLID', color: BRAND.colors.goldenOpportunity, opacity: 0.25 }];
    frame.appendChild(mBadge);
    const mBadgeTxt = figma.createText();
    mBadgeTxt.fontName = F.openSansSemi;
    mBadgeTxt.characters = '✓ Matched'; mBadgeTxt.fontSize = 11;
    mBadgeTxt.fills = [{ type: 'SOLID', color: BRAND.colors.goldenOpportunity }];
    mBadgeTxt.textAlignHorizontal = 'CENTER';
    mBadgeTxt.textAlignVertical = 'CENTER';
    mBadgeTxt.resize(80, 26);
    mBadge.appendChild(mBadgeTxt);

    // Info cards row
    const infoItems = [
      { icon: '₱', label: 'Amount', value: '40,000/yr' },
      { icon: '📅', label: 'Deadline', value: 'Aug 31' },
      { icon: '🎓', label: 'Slots', value: '500' },
    ];
    const infoW = 118;
    for (let i = 0; i < infoItems.length; i++) {
      const infoCard = figma.createFrame();
      infoCard.resize(infoW, 76); infoCard.x = 28 + i * (infoW + 10); infoCard.y = 196;
      infoCard.cornerRadius = BRAND.cornerRadius;
      infoCard.fills = [{ type: 'SOLID', color: BRAND.colors.white }];
      infoCard.effects = [{
        type: 'DROP_SHADOW',
        color: { r: 0.106, g: 0.227, b: 0.361, a: 0.06 },
        offset: { x: 0, y: 2 }, radius: 8, spread: 0,
        visible: true, blendMode: 'NORMAL',
      }];
      frame.appendChild(infoCard);

      const iconTxt = figma.createText();
      iconTxt.fontName = F.poppinsBold;
      iconTxt.characters = infoItems[i].icon; iconTxt.fontSize = 18;
      iconTxt.fills = [{ type: 'SOLID', color: BRAND.colors.bridgeGreen }];
      iconTxt.x = 12; iconTxt.y = 10;
      infoCard.appendChild(iconTxt);

      const valTxt = figma.createText();
      valTxt.fontName = F.poppinsBold;
      valTxt.characters = infoItems[i].value; valTxt.fontSize = 13;
      valTxt.fills = [{ type: 'SOLID', color: BRAND.colors.navyTrust }];
      valTxt.x = 12; valTxt.y = 34;
      infoCard.appendChild(valTxt);

      const labelTxt = figma.createText();
      labelTxt.fontName = F.openSansRegular;
      labelTxt.characters = infoItems[i].label; labelTxt.fontSize = 10;
      labelTxt.fills = [{ type: 'SOLID', color: BRAND.colors.navyTrust, opacity: 0.5 }];
      labelTxt.x = 12; labelTxt.y = 54;
      infoCard.appendChild(labelTxt);
    }

    // About section
    const aboutLabel = figma.createText();
    aboutLabel.fontName = F.poppinsSemi;
    aboutLabel.characters = 'About this Scholarship'; aboutLabel.fontSize = 16;
    aboutLabel.fills = [{ type: 'SOLID', color: BRAND.colors.navyTrust }];
    aboutLabel.x = 28; aboutLabel.y = 296;
    frame.appendChild(aboutLabel);

    const aboutTxt = figma.createText();
    aboutTxt.fontName = F.openSansRegular;
    aboutTxt.characters = 'The DOST-SEI Scholarship supports academically outstanding students pursuing science and technology courses. Recipients receive full tuition, monthly stipend, and book allowance throughout their degree.';
    aboutTxt.fontSize = 13;
    aboutTxt.fills = [{ type: 'SOLID', color: BRAND.colors.navyTrust, opacity: 0.65 }];
    aboutTxt.lineHeight = { value: 22, unit: 'PIXELS' };
    aboutTxt.resize(384, 90); aboutTxt.x = 28; aboutTxt.y = 326;
    frame.appendChild(aboutTxt);

    // Requirements section
    const reqLabel = figma.createText();
    reqLabel.fontName = F.poppinsSemi;
    reqLabel.characters = 'Requirements'; reqLabel.fontSize = 16;
    reqLabel.fills = [{ type: 'SOLID', color: BRAND.colors.navyTrust }];
    reqLabel.x = 28; reqLabel.y = 434;
    frame.appendChild(reqLabel);

    const requirements = [
      '📄  Transcript of Records (TOR)',
      '🪪  Valid School ID',
      '📝  Filled Application Form',
      '💰  Certificate of Financial Need',
      '✅  Recommendation Letter',
    ];

    let reqY = 466;
    for (const req of requirements) {
      const reqTxt = figma.createText();
      reqTxt.fontName = F.openSansRegular;
      reqTxt.characters = req; reqTxt.fontSize = 13;
      reqTxt.fills = [{ type: 'SOLID', color: BRAND.colors.navyTrust, opacity: 0.75 }];
      reqTxt.x = 28; reqTxt.y = reqY;
      frame.appendChild(reqTxt);
      reqY += 34;
    }

    // Upload docs button (outline)
    const uploadBtn = figma.createFrame();
    uploadBtn.resize(384, 48); uploadBtn.x = 28; uploadBtn.y = 648;
    uploadBtn.cornerRadius = BRAND.buttonRadius;
    uploadBtn.fills = [{ type: 'SOLID', color: BRAND.colors.warmWhite }];
    uploadBtn.strokes = [{ type: 'SOLID', color: BRAND.colors.bridgeGreen, opacity: 0.6 }];
    uploadBtn.strokeWeight = 1.5; uploadBtn.strokeAlign = 'INSIDE';
    frame.appendChild(uploadBtn);
    const uploadTxt = figma.createText();
    uploadTxt.fontName = F.openSansSemi;
    uploadTxt.characters = '⬆  Upload Documents'; uploadTxt.fontSize = 14;
    uploadTxt.fills = [{ type: 'SOLID', color: BRAND.colors.bridgeGreen }];
    uploadTxt.textAlignHorizontal = 'CENTER';
    uploadTxt.textAlignVertical = 'CENTER';
    uploadTxt.resize(384, 48);
    uploadBtn.appendChild(uploadTxt);

    // Apply Now button
    frame.appendChild(createButton('Apply Now', 28, 712, 384));

    // Learn More link
    const learnMore = figma.createText();
    learnMore.fontName = F.openSansSemi;
    learnMore.characters = 'Learn More →'; learnMore.fontSize = 13;
    learnMore.fills = [{ type: 'SOLID', color: BRAND.colors.bridgeGreen }];
    learnMore.textAlignHorizontal = 'CENTER';
    learnMore.resize(384, 20); learnMore.x = 28; learnMore.y = 782;
    frame.appendChild(learnMore);

    // Bottom nav
    frame.appendChild(createBottomNav('Apply', frame));

    figma.viewport.scrollAndZoomIntoView([frame]);
    figma.notify('✅ Scholarship Details screen created!');
  }

  // ── 9. PROFILE SCREEN ────────────────────────────────────────────────────
  if (msg.type === 'create-profile') {
    await loadFonts();
    const frame = figma.createFrame();
    frame.name = 'Scholaris — Profile';
    frame.resize(440, 956);
    frame.fills = [{ type: 'SOLID', color: BRAND.colors.warmWhite }];
    figma.currentPage.appendChild(frame);

    // Header bg
    const headerBg = figma.createRectangle();
    headerBg.resize(440, 220); headerBg.x = 0; headerBg.y = 0;
    headerBg.fills = [{ type: 'SOLID', color: BRAND.colors.bridgeGreen }];
    frame.appendChild(headerBg);

    // Header title
    const headerTitle = figma.createText();
    headerTitle.fontName = F.poppinsBold;
    headerTitle.characters = 'My Profile'; headerTitle.fontSize = 20;
    headerTitle.fills = [{ type: 'SOLID', color: BRAND.colors.white }];
    headerTitle.x = 28; headerTitle.y = 64;
    frame.appendChild(headerTitle);

    // Edit icon (pencil — two rectangles)
    const editBox = figma.createFrame();
    editBox.resize(36, 36); editBox.x = 376; editBox.y = 60;
    editBox.cornerRadius = 50;
    editBox.fills = [{ type: 'SOLID', color: BRAND.colors.white, opacity: 0.15 }];
    frame.appendChild(editBox);
    const editTxt = figma.createText();
    editTxt.fontName = F.openSansRegular;
    editTxt.characters = '✏️'; editTxt.fontSize = 14;
    editTxt.x = 8; editTxt.y = 8;
    editBox.appendChild(editTxt);

    // Avatar circle
    const avatar = figma.createEllipse();
    avatar.resize(80, 80); avatar.x = 180; avatar.y = 110;
    avatar.fills = [{ type: 'SOLID', color: BRAND.colors.goldenOpportunity, opacity: 0.3 }];
    avatar.strokes = [{ type: 'SOLID', color: BRAND.colors.white }];
    avatar.strokeWeight = 3; avatar.strokeAlign = 'OUTSIDE';
    frame.appendChild(avatar);

    // Avatar initials
    const initials = figma.createText();
    initials.fontName = F.poppinsBold;
    initials.characters = 'GB'; initials.fontSize = 28;
    initials.fills = [{ type: 'SOLID', color: BRAND.colors.white }];
    initials.textAlignHorizontal = 'CENTER';
    initials.resize(80, 80); initials.x = 180; initials.y = 110;
    initials.textAlignVertical = 'CENTER';
    frame.appendChild(initials);

    // Name
    const profileName = figma.createText();
    profileName.fontName = F.poppinsBold;
    profileName.characters = 'Gilbert Bulado'; profileName.fontSize = 20;
    profileName.fills = [{ type: 'SOLID', color: BRAND.colors.navyTrust }];
    profileName.textAlignHorizontal = 'CENTER';
    profileName.resize(384, 30); profileName.x = 28; profileName.y = 210;
    frame.appendChild(profileName);

    const courseTxt = figma.createText();
    courseTxt.fontName = F.openSansRegular;
    courseTxt.characters = 'BSIT — 3rd Year'; courseTxt.fontSize = 13;
    courseTxt.fills = [{ type: 'SOLID', color: BRAND.colors.navyTrust, opacity: 0.55 }];
    courseTxt.textAlignHorizontal = 'CENTER';
    courseTxt.resize(384, 20); courseTxt.x = 28; courseTxt.y = 246;
    frame.appendChild(courseTxt);

    // Stats row
    const stats = [
      { value: '12', label: 'Matched' },
      { value: '3', label: 'Applied' },
      { value: '1', label: 'Approved' },
    ];
    const statW = 118;
    for (let i = 0; i < stats.length; i++) {
      const statCard = figma.createFrame();
      statCard.resize(statW, 68); statCard.x = 28 + i * (statW + 10); statCard.y = 284;
      statCard.cornerRadius = BRAND.cornerRadius;
      statCard.fills = [{ type: 'SOLID', color: BRAND.colors.white }];
      statCard.effects = [{
        type: 'DROP_SHADOW',
        color: { r: 0.106, g: 0.227, b: 0.361, a: 0.06 },
        offset: { x: 0, y: 2 }, radius: 8, spread: 0,
        visible: true, blendMode: 'NORMAL',
      }];
      frame.appendChild(statCard);

      const statVal = figma.createText();
      statVal.fontName = F.poppinsBold;
      statVal.characters = stats[i].value; statVal.fontSize = 24;
      statVal.fills = [{ type: 'SOLID', color: BRAND.colors.bridgeGreen }];
      statVal.textAlignHorizontal = 'CENTER';
      statVal.resize(statW, 36); statVal.y = 8;
      statCard.appendChild(statVal);

      const statLabel = figma.createText();
      statLabel.fontName = F.openSansRegular;
      statLabel.characters = stats[i].label; statLabel.fontSize = 11;
      statLabel.fills = [{ type: 'SOLID', color: BRAND.colors.navyTrust, opacity: 0.5 }];
      statLabel.textAlignHorizontal = 'CENTER';
      statLabel.resize(statW, 20); statLabel.y = 44;
      statCard.appendChild(statLabel);
    }

    // Info section
    const infoLabel = figma.createText();
    infoLabel.fontName = F.poppinsSemi;
    infoLabel.characters = 'Student Information'; infoLabel.fontSize = 16;
    infoLabel.fills = [{ type: 'SOLID', color: BRAND.colors.navyTrust }];
    infoLabel.x = 28; infoLabel.y = 374;
    frame.appendChild(infoLabel);

    const infoFields = [
      { icon: '🎓', label: 'Course', value: 'BS Information Technology' },
      { icon: '⭐', label: 'GPA', value: '1.75 (Cum Laude)' },
      { icon: '🏫', label: 'School', value: 'University of the Philippines' },
      { icon: '📍', label: 'Address', value: 'Ormoc City, Leyte' },
    ];

    let infoY = 410;
    for (const field of infoFields) {
      const infoRow = figma.createFrame();
      infoRow.resize(384, 56); infoRow.x = 28; infoRow.y = infoY;
      infoRow.cornerRadius = BRAND.cornerRadius;
      infoRow.fills = [{ type: 'SOLID', color: BRAND.colors.white }];
      frame.appendChild(infoRow);

      const iconT = figma.createText();
      iconT.fontName = F.openSansRegular;
      iconT.characters = field.icon; iconT.fontSize = 18;
      iconT.x = 14; iconT.y = 16;
      infoRow.appendChild(iconT);

      const fieldLabel = figma.createText();
      fieldLabel.fontName = F.openSansRegular;
      fieldLabel.characters = field.label; fieldLabel.fontSize = 10;
      fieldLabel.fills = [{ type: 'SOLID', color: BRAND.colors.navyTrust, opacity: 0.45 }];
      fieldLabel.x = 46; fieldLabel.y = 10;
      infoRow.appendChild(fieldLabel);

      const fieldVal = figma.createText();
      fieldVal.fontName = F.openSansSemi;
      fieldVal.characters = field.value; fieldVal.fontSize = 13;
      fieldVal.fills = [{ type: 'SOLID', color: BRAND.colors.navyTrust }];
      fieldVal.x = 46; fieldVal.y = 28;
      infoRow.appendChild(fieldVal);

      infoY += 66;
    }

    // Documents section
    const docLabel = figma.createText();
    docLabel.fontName = F.poppinsSemi;
    docLabel.characters = 'My Documents'; docLabel.fontSize = 16;
    docLabel.fills = [{ type: 'SOLID', color: BRAND.colors.navyTrust }];
    docLabel.x = 28; docLabel.y = 690;
    frame.appendChild(docLabel);

    const docs = [
      { name: 'Transcript of Records', status: 'Verified', color: BRAND.colors.bridgeGreen },
      { name: 'Certificate of Financial Need', status: 'Needs Documents', color: BRAND.colors.coralConnect },
    ];

    let docY = 724;
    for (const doc of docs) {
      const docRow = figma.createFrame();
      docRow.resize(384, 52); docRow.x = 28; docRow.y = docY;
      docRow.cornerRadius = BRAND.cornerRadius;
      docRow.fills = [{ type: 'SOLID', color: BRAND.colors.white }];
      frame.appendChild(docRow);

      // Upload arrow icon
      const upIcon = figma.createText();
      upIcon.fontName = F.openSansRegular;
      upIcon.characters = '📄'; upIcon.fontSize = 18;
      upIcon.x = 12; upIcon.y = 14;
      docRow.appendChild(upIcon);

      const docName = figma.createText();
      docName.fontName = F.openSansSemi;
      docName.characters = doc.name; docName.fontSize = 12;
      docName.fills = [{ type: 'SOLID', color: BRAND.colors.navyTrust }];
      docName.x = 44; docName.y = 16;
      docRow.appendChild(docName);

      const docStatus = figma.createText();
      docStatus.fontName = F.openSansSemi;
      docStatus.characters = doc.status; docStatus.fontSize = 10;
      docStatus.fills = [{ type: 'SOLID', color: doc.color }];
      docStatus.x = 280; docStatus.y = 18;
      docRow.appendChild(docStatus);

      docY += 62;
    }

    // Sign out button
    frame.appendChild(createOutlineButton('Sign Out', 28, 856, 384));

    // Bottom nav
    frame.appendChild(createBottomNav('Profile', frame));

    figma.viewport.scrollAndZoomIntoView([frame]);
    figma.notify('✅ Profile screen created!');
  }

  // ── 10. SEARCH SCREEN ───────────────────────────────────────────────────
  if (msg.type === 'create-search') {
    await loadFonts();
    const frame = figma.createFrame();
    frame.name = 'Scholaris — Search';
    frame.resize(440, 956);
    frame.fills = [{ type: 'SOLID', color: BRAND.colors.warmWhite }];
    figma.currentPage.appendChild(frame);

    // Header
    const headerBg = figma.createRectangle();
    headerBg.resize(440, 130); headerBg.x = 0; headerBg.y = 0;
    headerBg.fills = [{ type: 'SOLID', color: BRAND.colors.bridgeGreen }];
    frame.appendChild(headerBg);

    const title = figma.createText();
    title.fontName = F.poppinsBold;
    title.characters = 'Find Scholarships'; title.fontSize = 20;
    title.fills = [{ type: 'SOLID', color: BRAND.colors.white }];
    title.x = 28; title.y = 58;
    frame.appendChild(title);

    // Search bar
    const searchBar = figma.createFrame();
    searchBar.resize(384, 48); searchBar.x = 28; searchBar.y = 102;
    searchBar.cornerRadius = 50;
    searchBar.fills = [{ type: 'SOLID', color: BRAND.colors.white }];
    searchBar.effects = [{ type: 'DROP_SHADOW', color: { r: 0.106, g: 0.227, b: 0.361, a: 0.10 }, offset: { x: 0, y: 4 }, radius: 10, spread: 0, visible: true, blendMode: 'NORMAL' }];
    frame.appendChild(searchBar);
    const searchTxt = figma.createText();
    searchTxt.fontName = F.openSansRegular;
    searchTxt.characters = '🔍  Search scholarships...'; searchTxt.fontSize = 13;
    searchTxt.fills = [{ type: 'SOLID', color: BRAND.colors.navyTrust, opacity: 0.4 }];
    searchTxt.x = 16; searchTxt.y = 14;
    searchBar.appendChild(searchTxt);

    // Filter chips
    const filters = ['All', 'Government', 'Private', 'School-based', 'STEM', 'Arts'];
    let fx = 28; let fy = 168;
    for (let i = 0; i < filters.length; i++) {
      if (i === 4) { fx = 28; fy = 212; }
      const chipW = filters[i].length * 9 + 24;
      const chip = figma.createFrame();
      chip.resize(chipW, 34); chip.x = fx; chip.y = fy;
      chip.cornerRadius = 50;
      chip.fills = [{ type: 'SOLID', color: i === 0 ? BRAND.colors.bridgeGreen : BRAND.colors.white }];
      if (i !== 0) { chip.strokes = [{ type: 'SOLID', color: BRAND.colors.navyTrust, opacity: 0.2 }]; chip.strokeWeight = 1.5; chip.strokeAlign = 'INSIDE'; }
      frame.appendChild(chip);
      const chipTxt = figma.createText();
      chipTxt.fontName = F.openSansSemi;
      chipTxt.characters = filters[i]; chipTxt.fontSize = 12;
      chipTxt.fills = [{ type: 'SOLID', color: i === 0 ? BRAND.colors.white : BRAND.colors.navyTrust, opacity: i === 0 ? 1 : 0.7 }];
      chipTxt.textAlignHorizontal = 'CENTER'; chipTxt.textAlignVertical = 'CENTER';
      chipTxt.resize(chipW, 34);
      chip.appendChild(chipTxt);
      fx += chipW + 8;
    }

    // Results
    const resultCount = figma.createText();
    resultCount.fontName = F.openSansRegular;
    resultCount.characters = '12 scholarships found'; resultCount.fontSize = 12;
    resultCount.fills = [{ type: 'SOLID', color: BRAND.colors.navyTrust, opacity: 0.5 }];
    resultCount.x = 28; resultCount.y = 258;
    frame.appendChild(resultCount);

    const listItems = [
      { title: 'DOST-SEI Scholarship', org: 'Dept. of Science & Technology', amount: '₱40,000 / year', deadline: 'Deadline: Aug 31, 2025', status: 'Matched' },
      { title: 'CHED Full Merit', org: 'Commission on Higher Education', amount: '₱60,000 / year', deadline: 'Deadline: Sep 15, 2025', status: 'Under Review' },
      { title: 'SM Foundation Scholar', org: 'SM Foundation Inc.', amount: '₱25,000 / year', deadline: 'Deadline: Oct 1, 2025', status: 'Matched' },
      { title: 'Ayala Foundation Grant', org: 'Ayala Foundation', amount: '₱30,000 / year', deadline: 'Deadline: Sep 30, 2025', status: 'Approved' },
    ];
    let cardY = 286;
    for (const item of listItems) {
      frame.appendChild(createScholarshipCard(28, cardY, 384, item.title, item.org, item.amount, item.deadline, item.status));
      cardY += 172;
    }

    frame.appendChild(createBottomNav('Search', frame));
    figma.viewport.scrollAndZoomIntoView([frame]);
    figma.notify('✅ Search screen created!');
  }

  // ── 11. APPLY SCREEN ─────────────────────────────────────────────────────
  if (msg.type === 'create-apply') {
    await loadFonts();
    const frame = figma.createFrame();
    frame.name = 'Scholaris — Apply';
    frame.resize(440, 956);
    frame.fills = [{ type: 'SOLID', color: BRAND.colors.warmWhite }];
    figma.currentPage.appendChild(frame);

    // Header
    const headerBg = figma.createRectangle();
    headerBg.resize(440, 130); headerBg.x = 0; headerBg.y = 0;
    headerBg.fills = [{ type: 'SOLID', color: BRAND.colors.bridgeGreen }];
    frame.appendChild(headerBg);

    // Back arrow
    const arrowH = figma.createRectangle();
    arrowH.resize(20, 3); arrowH.x = 28; arrowH.y = 67; arrowH.cornerRadius = 2;
    arrowH.fills = [{ type: 'SOLID', color: BRAND.colors.white }];
    frame.appendChild(arrowH);

    const title = figma.createText();
    title.fontName = F.poppinsBold;
    title.characters = 'Apply for Scholarship'; title.fontSize = 18;
    title.fills = [{ type: 'SOLID', color: BRAND.colors.white }];
    title.x = 60; title.y = 58;
    frame.appendChild(title);

    const schName = figma.createText();
    schName.fontName = F.openSansRegular;
    schName.characters = 'DOST-SEI Scholarship'; schName.fontSize = 13;
    schName.fills = [{ type: 'SOLID', color: BRAND.colors.white, opacity: 0.75 }];
    schName.x = 60; schName.y = 84;
    frame.appendChild(schName);

    // Progress bar
    const progBg = figma.createRectangle();
    progBg.resize(384, 6); progBg.x = 28; progBg.y = 148;
    progBg.cornerRadius = 3;
    progBg.fills = [{ type: 'SOLID', color: BRAND.colors.navyTrust, opacity: 0.1 }];
    frame.appendChild(progBg);
    const progFill = figma.createRectangle();
    progFill.resize(192, 6); progFill.x = 28; progFill.y = 148;
    progFill.cornerRadius = 3;
    progFill.fills = [{ type: 'SOLID', color: BRAND.colors.goldenOpportunity }];
    frame.appendChild(progFill);
    const progTxt = figma.createText();
    progTxt.fontName = F.openSansRegular;
    progTxt.characters = 'Step 2 of 4 — Personal Information'; progTxt.fontSize = 11;
    progTxt.fills = [{ type: 'SOLID', color: BRAND.colors.navyTrust, opacity: 0.5 }];
    progTxt.x = 28; progTxt.y = 162;
    frame.appendChild(progTxt);

    // Form heading
    const formHead = figma.createText();
    formHead.fontName = F.poppinsBold;
    formHead.characters = 'Personal Information'; formHead.fontSize = 18;
    formHead.fills = [{ type: 'SOLID', color: BRAND.colors.navyTrust }];
    formHead.x = 28; formHead.y = 196;
    frame.appendChild(formHead);

    // Form fields
    const fields = ['Full Name', 'Date of Birth', 'Contact Number', 'Home Address', 'Course & Year Level', 'GPA / Grade Average'];
    let fieldY = 234;
    for (const field of fields) {
      const label = figma.createText();
      label.fontName = F.openSansSemi;
      label.characters = field; label.fontSize = 12;
      label.fills = [{ type: 'SOLID', color: BRAND.colors.navyTrust, opacity: 0.7 }];
      label.x = 28; label.y = fieldY;
      frame.appendChild(label);
      frame.appendChild(createInputField(field, 28, fieldY + 20, 384));
      fieldY += 90;
    }

    // Next button
    frame.appendChild(createButton('Next →', 28, 848, 384));
    frame.appendChild(createBottomNav('Apply', frame));
    figma.viewport.scrollAndZoomIntoView([frame]);
    figma.notify('✅ Apply screen created!');
  }

  // ── 12. SUBMITTED SCREEN ─────────────────────────────────────────────────
  if (msg.type === 'create-submitted') {
    await loadFonts();
    const frame = figma.createFrame();
    frame.name = 'Scholaris — Submitted';
    frame.resize(440, 956);
    frame.fills = [{ type: 'SOLID', color: BRAND.colors.warmWhite }];
    figma.currentPage.appendChild(frame);

    // Top green blob
    const blob = figma.createEllipse();
    blob.resize(440, 440); blob.x = 0; blob.y = -100;
    blob.fills = [{ type: 'SOLID', color: BRAND.colors.bridgeGreen, opacity: 0.06 }];
    frame.appendChild(blob);

    // Big checkmark circle
    const checkCircle = figma.createEllipse();
    checkCircle.resize(120, 120); checkCircle.x = 160; checkCircle.y = 180;
    checkCircle.fills = [{ type: 'SOLID', color: BRAND.colors.bridgeGreen, opacity: 0.12 }];
    checkCircle.strokes = [{ type: 'SOLID', color: BRAND.colors.bridgeGreen }];
    checkCircle.strokeWeight = 3; checkCircle.strokeAlign = 'INSIDE';
    frame.appendChild(checkCircle);

    // Checkmark
    const checkL = figma.createRectangle();
    checkL.resize(3, 30); checkL.x = 197; checkL.y = 238;
    checkL.cornerRadius = 2; checkL.rotation = -45;
    checkL.fills = [{ type: 'SOLID', color: BRAND.colors.bridgeGreen }];
    frame.appendChild(checkL);
    const checkR = figma.createRectangle();
    checkR.resize(3, 50); checkR.x = 218; checkR.y = 218;
    checkR.cornerRadius = 2; checkR.rotation = 45;
    checkR.fills = [{ type: 'SOLID', color: BRAND.colors.bridgeGreen }];
    frame.appendChild(checkR);

    // Heading
    const heading = figma.createText();
    heading.fontName = F.poppinsBold;
    heading.characters = 'Application Submitted!'; heading.fontSize = 24;
    heading.fills = [{ type: 'SOLID', color: BRAND.colors.navyTrust }];
    heading.textAlignHorizontal = 'CENTER';
    heading.resize(384, 36); heading.x = 28; heading.y = 326;
    frame.appendChild(heading);

    const sub = figma.createText();
    sub.fontName = F.openSansRegular;
    sub.characters = 'Your application for DOST-SEI Scholarship\nhas been successfully submitted.'; sub.fontSize = 14;
    sub.fills = [{ type: 'SOLID', color: BRAND.colors.navyTrust, opacity: 0.6 }];
    sub.textAlignHorizontal = 'CENTER';
    sub.lineHeight = { value: 24, unit: 'PIXELS' };
    sub.resize(384, 56); sub.x = 28; sub.y = 374;
    frame.appendChild(sub);

    // Tracking ID
    const trackCard = figma.createFrame();
    trackCard.resize(384, 80); trackCard.x = 28; trackCard.y = 454;
    trackCard.cornerRadius = BRAND.cornerRadius;
    trackCard.fills = [{ type: 'SOLID', color: BRAND.colors.white }];
    trackCard.effects = [{ type: 'DROP_SHADOW', color: { r: 0.106, g: 0.227, b: 0.361, a: 0.06 }, offset: { x: 0, y: 2 }, radius: 8, spread: 0, visible: true, blendMode: 'NORMAL' }];
    frame.appendChild(trackCard);
    const trackLabel = figma.createText();
    trackLabel.fontName = F.openSansRegular;
    trackLabel.characters = 'Tracking ID'; trackLabel.fontSize = 11;
    trackLabel.fills = [{ type: 'SOLID', color: BRAND.colors.navyTrust, opacity: 0.5 }];
    trackLabel.textAlignHorizontal = 'CENTER';
    trackLabel.resize(384, 20); trackLabel.y = 14;
    trackCard.appendChild(trackLabel);
    const trackId = figma.createText();
    trackId.fontName = { family: 'Roboto Mono', style: 'Regular' };
    trackId.characters = 'SCH-2025-00847'; trackId.fontSize = 20;
    trackId.fills = [{ type: 'SOLID', color: BRAND.colors.bridgeGreen }];
    trackId.textAlignHorizontal = 'CENTER';
    trackId.resize(384, 30); trackId.y = 40;
    trackCard.appendChild(trackId);

    // What happens next
    const nextLabel = figma.createText();
    nextLabel.fontName = F.poppinsSemi;
    nextLabel.characters = 'What happens next?'; nextLabel.fontSize = 16;
    nextLabel.fills = [{ type: 'SOLID', color: BRAND.colors.navyTrust }];
    nextLabel.x = 28; nextLabel.y = 560;
    frame.appendChild(nextLabel);

    const steps = [
      '1. Your documents will be reviewed within 5-7 business days',
      '2. You will receive an email notification on your status',
      '3. Check your application status anytime in the app',
    ];
    let stepY = 596;
    for (const step of steps) {
      const stepTxt = figma.createText();
      stepTxt.fontName = F.openSansRegular;
      stepTxt.characters = step; stepTxt.fontSize = 13;
      stepTxt.fills = [{ type: 'SOLID', color: BRAND.colors.navyTrust, opacity: 0.65 }];
      stepTxt.lineHeight = { value: 22, unit: 'PIXELS' };
      stepTxt.resize(384, 44); stepTxt.x = 28; stepTxt.y = stepY;
      frame.appendChild(stepTxt);
      stepY += 52;
    }

    frame.appendChild(createButton('Go to Home', 28, 780, 384));
    frame.appendChild(createOutlineButton('Track Application', 28, 844, 384));
    frame.appendChild(createBottomNav('Apply', frame));
    figma.viewport.scrollAndZoomIntoView([frame]);
    figma.notify('✅ Submitted screen created!');
  }

  // ── 13. UNDER REVIEW SCREEN ───────────────────────────────────────────────
  if (msg.type === 'create-under-review') {
    await loadFonts();
    await figma.loadFontAsync({ family: 'Roboto Mono', style: 'Regular' });
    const frame = figma.createFrame();
    frame.name = 'Scholaris — Under Review';
    frame.resize(440, 956);
    frame.fills = [{ type: 'SOLID', color: BRAND.colors.warmWhite }];
    figma.currentPage.appendChild(frame);

    // Header
    const headerBg = figma.createRectangle();
    headerBg.resize(440, 160); headerBg.x = 0; headerBg.y = 0;
    headerBg.fills = [{ type: 'SOLID', color: BRAND.colors.navyTrust }];
    frame.appendChild(headerBg);

    const title = figma.createText();
    title.fontName = F.poppinsBold;
    title.characters = 'Application Status'; title.fontSize = 20;
    title.fills = [{ type: 'SOLID', color: BRAND.colors.white }];
    title.x = 28; title.y = 64;
    frame.appendChild(title);

    // Under Review badge in header
    const badge = figma.createFrame();
    badge.resize(130, 30); badge.x = 28; badge.y = 100;
    badge.cornerRadius = 50;
    badge.fills = [{ type: 'SOLID', color: BRAND.colors.goldenOpportunity, opacity: 0.25 }];
    frame.appendChild(badge);
    const badgeTxt = figma.createText();
    badgeTxt.fontName = F.openSansSemi;
    badgeTxt.characters = '⏳ Under Review'; badgeTxt.fontSize = 12;
    badgeTxt.fills = [{ type: 'SOLID', color: BRAND.colors.goldenOpportunity }];
    badgeTxt.textAlignHorizontal = 'CENTER'; badgeTxt.textAlignVertical = 'CENTER';
    badgeTxt.resize(130, 30);
    badge.appendChild(badgeTxt);

    // Scholarship info card
    const infoCard = figma.createFrame();
    infoCard.resize(384, 90); infoCard.x = 28; infoCard.y = 180;
    infoCard.cornerRadius = BRAND.cornerRadius;
    infoCard.fills = [{ type: 'SOLID', color: BRAND.colors.white }];
    infoCard.effects = [{ type: 'DROP_SHADOW', color: { r: 0.106, g: 0.227, b: 0.361, a: 0.06 }, offset: { x: 0, y: 2 }, radius: 8, spread: 0, visible: true, blendMode: 'NORMAL' }];
    frame.appendChild(infoCard);
    const schTitle = figma.createText();
    schTitle.fontName = F.poppinsSemi;
    schTitle.characters = 'DOST-SEI Scholarship'; schTitle.fontSize = 15;
    schTitle.fills = [{ type: 'SOLID', color: BRAND.colors.navyTrust }];
    schTitle.x = 16; schTitle.y = 14;
    infoCard.appendChild(schTitle);
    const schOrg = figma.createText();
    schOrg.fontName = F.openSansRegular;
    schOrg.characters = 'Dept. of Science & Technology'; schOrg.fontSize = 12;
    schOrg.fills = [{ type: 'SOLID', color: BRAND.colors.navyTrust, opacity: 0.55 }];
    schOrg.x = 16; schOrg.y = 38;
    infoCard.appendChild(schOrg);
    const trackTxt = figma.createText();
    trackTxt.fontName = { family: 'Roboto Mono', style: 'Regular' };
    trackTxt.characters = 'ID: SCH-2025-00847'; trackTxt.fontSize = 11;
    trackTxt.fills = [{ type: 'SOLID', color: BRAND.colors.bridgeGreen }];
    trackTxt.x = 16; trackTxt.y = 62;
    infoCard.appendChild(trackTxt);

    // Timeline
    const timelineLabel = figma.createText();
    timelineLabel.fontName = F.poppinsSemi;
    timelineLabel.characters = 'Application Timeline'; timelineLabel.fontSize = 16;
    timelineLabel.fills = [{ type: 'SOLID', color: BRAND.colors.navyTrust }];
    timelineLabel.x = 28; timelineLabel.y = 296;
    frame.appendChild(timelineLabel);

    const timelineSteps = [
      { label: 'Application Submitted', date: 'July 31, 2025', done: true },
      { label: 'Documents Verified', date: 'Aug 2, 2025', done: true },
      { label: 'Under Review', date: 'In progress...', done: false, active: true },
      { label: 'Final Decision', date: 'Est. Aug 15, 2025', done: false },
    ];

    let ty = 336;
    for (const step of timelineSteps) {
      // Dot
      const dot = figma.createEllipse();
      dot.resize(16, 16); dot.x = 28; dot.y = ty + 2;
      dot.fills = [{ type: 'SOLID', color: step.done ? BRAND.colors.bridgeGreen : step.active ? BRAND.colors.goldenOpportunity : BRAND.colors.navyTrust, opacity: step.done || step.active ? 1 : 0.2 }];
      frame.appendChild(dot);

      // Line connector
      if (timelineSteps.indexOf(step) < timelineSteps.length - 1) {
        const line = figma.createRectangle();
        line.resize(2, 40); line.x = 35; line.y = ty + 18;
        line.fills = [{ type: 'SOLID', color: step.done ? BRAND.colors.bridgeGreen : BRAND.colors.navyTrust, opacity: step.done ? 0.5 : 0.15 }];
        frame.appendChild(line);
      }

      const stepLabel = figma.createText();
      stepLabel.fontName = step.active ? F.openSansSemi : F.openSansRegular;
      stepLabel.characters = step.label; stepLabel.fontSize = 14;
      stepLabel.fills = [{ type: 'SOLID', color: step.active ? BRAND.colors.goldenOpportunity : BRAND.colors.navyTrust, opacity: step.done || step.active ? 1 : 0.4 }];
      stepLabel.x = 56; stepLabel.y = ty;
      frame.appendChild(stepLabel);

      const stepDate = figma.createText();
      stepDate.fontName = F.openSansRegular;
      stepDate.characters = step.date; stepDate.fontSize = 11;
      stepDate.fills = [{ type: 'SOLID', color: BRAND.colors.navyTrust, opacity: 0.45 }];
      stepDate.x = 56; stepDate.y = ty + 20;
      frame.appendChild(stepDate);

      ty += 68;
    }

    // Estimated decision card
    const estCard = figma.createFrame();
    estCard.resize(384, 70); estCard.x = 28; estCard.y = 640;
    estCard.cornerRadius = BRAND.cornerRadius;
    estCard.fills = [{ type: 'SOLID', color: BRAND.colors.goldenOpportunity, opacity: 0.1 }];
    frame.appendChild(estCard);
    const estTxt = figma.createText();
    estTxt.fontName = F.openSansSemi;
    estTxt.characters = '⏰ Estimated Decision: Aug 15, 2025'; estTxt.fontSize = 13;
    estTxt.fills = [{ type: 'SOLID', color: BRAND.colors.navyTrust }];
    estTxt.textAlignHorizontal = 'CENTER';
    estTxt.resize(384, 24); estTxt.y = 24;
    estCard.appendChild(estTxt);

    frame.appendChild(createOutlineButton('Contact Support', 28, 740, 384));
    frame.appendChild(createButton('Go to Home', 28, 804, 384));
    frame.appendChild(createBottomNav('Apply', frame));
    figma.viewport.scrollAndZoomIntoView([frame]);
    figma.notify('✅ Under Review screen created!');
  }

  // ── 14. APPROVED SCREEN ───────────────────────────────────────────────────
  if (msg.type === 'create-approved') {
    await loadFonts();
    await figma.loadFontAsync({ family: 'Roboto Mono', style: 'Regular' });
    const frame = figma.createFrame();
    frame.name = 'Scholaris — Approved';
    frame.resize(440, 956);
    frame.fills = [{ type: 'SOLID', color: BRAND.colors.warmWhite }];
    figma.currentPage.appendChild(frame);

    // Green header
    const headerBg = figma.createRectangle();
    headerBg.resize(440, 280); headerBg.x = 0; headerBg.y = 0;
    headerBg.fills = [{ type: 'SOLID', color: BRAND.colors.bridgeGreen }];
    frame.appendChild(headerBg);

    // Confetti dots
    const confettiColors = [BRAND.colors.goldenOpportunity, BRAND.colors.white, BRAND.colors.coralConnect];
    const confettiPositions = [[60,40],[120,20],[200,60],[300,30],[360,50],[80,100],[340,90],[160,110]];
    for (let i = 0; i < confettiPositions.length; i++) {
      const c = figma.createEllipse();
      c.resize(8, 8); c.x = confettiPositions[i][0]; c.y = confettiPositions[i][1];
      c.fills = [{ type: 'SOLID', color: confettiColors[i % 3], opacity: 0.7 }];
      frame.appendChild(c);
    }

    // Trophy/star icon
    const trophyCircle = figma.createEllipse();
    trophyCircle.resize(100, 100); trophyCircle.x = 170; trophyCircle.y = 80;
    trophyCircle.fills = [{ type: 'SOLID', color: BRAND.colors.white, opacity: 0.2 }];
    frame.appendChild(trophyCircle);
    const trophyTxt = figma.createText();
    trophyTxt.fontName = F.poppinsBold;
    trophyTxt.characters = '🏆'; trophyTxt.fontSize = 48;
    trophyTxt.textAlignHorizontal = 'CENTER';
    trophyTxt.resize(100, 70); trophyTxt.x = 170; trophyTxt.y = 98;
    frame.appendChild(trophyTxt);

    // Congrats text
    const congrats = figma.createText();
    congrats.fontName = F.poppinsBold;
    congrats.characters = 'Congratulations! 🎉'; congrats.fontSize = 24;
    congrats.fills = [{ type: 'SOLID', color: BRAND.colors.white }];
    congrats.textAlignHorizontal = 'CENTER';
    congrats.resize(384, 36); congrats.x = 28; congrats.y = 200;
    frame.appendChild(congrats);

    const conSub = figma.createText();
    conSub.fontName = F.openSansRegular;
    conSub.characters = 'Your scholarship has been approved!'; conSub.fontSize = 14;
    conSub.fills = [{ type: 'SOLID', color: BRAND.colors.white, opacity: 0.8 }];
    conSub.textAlignHorizontal = 'CENTER';
    conSub.resize(384, 22); conSub.x = 28; conSub.y = 244;
    frame.appendChild(conSub);

    // Award card
    const awardCard = figma.createFrame();
    awardCard.resize(384, 130); awardCard.x = 28; awardCard.y = 300;
    awardCard.cornerRadius = BRAND.cornerRadius;
    awardCard.fills = [{ type: 'SOLID', color: BRAND.colors.white }];
    awardCard.effects = [{ type: 'DROP_SHADOW', color: { r: 0.106, g: 0.227, b: 0.361, a: 0.08 }, offset: { x: 0, y: 4 }, radius: 16, spread: 0, visible: true, blendMode: 'NORMAL' }];
    frame.appendChild(awardCard);

    const awardAccent = figma.createRectangle();
    awardAccent.resize(4, 90); awardAccent.x = 0; awardAccent.y = 20;
    awardAccent.cornerRadius = 4;
    awardAccent.fills = [{ type: 'SOLID', color: BRAND.colors.goldenOpportunity }];
    awardCard.appendChild(awardAccent);

    const schNameTxt = figma.createText();
    schNameTxt.fontName = F.poppinsBold;
    schNameTxt.characters = 'DOST-SEI Scholarship'; schNameTxt.fontSize = 16;
    schNameTxt.fills = [{ type: 'SOLID', color: BRAND.colors.navyTrust }];
    schNameTxt.x = 20; schNameTxt.y = 18;
    awardCard.appendChild(schNameTxt);

    const awardAmount = figma.createText();
    awardAmount.fontName = F.poppinsBold;
    awardAmount.characters = '₱40,000 / year'; awardAmount.fontSize = 24;
    awardAmount.fills = [{ type: 'SOLID', color: BRAND.colors.bridgeGreen }];
    awardAmount.x = 20; awardAmount.y = 50;
    awardCard.appendChild(awardAmount);

    const awardId = figma.createText();
    awardId.fontName = { family: 'Roboto Mono', style: 'Regular' };
    awardId.characters = 'ID: SCH-2025-00847'; awardId.fontSize = 11;
    awardId.fills = [{ type: 'SOLID', color: BRAND.colors.navyTrust, opacity: 0.45 }];
    awardId.x = 20; awardId.y = 92;
    awardCard.appendChild(awardId);

    // Next steps
    const nextLabel = figma.createText();
    nextLabel.fontName = F.poppinsSemi;
    nextLabel.characters = 'Next Steps'; nextLabel.fontSize = 16;
    nextLabel.fills = [{ type: 'SOLID', color: BRAND.colors.navyTrust }];
    nextLabel.x = 28; nextLabel.y = 454;
    frame.appendChild(nextLabel);

    const nextSteps = [
      '✅  Check your email for the award letter',
      '📄  Submit final acceptance form within 7 days',
      '🏦  Provide bank details for disbursement',
      '🎓  Maintain GPA requirements each semester',
    ];
    let nsY = 490;
    for (const step of nextSteps) {
      const stepTxt = figma.createText();
      stepTxt.fontName = F.openSansRegular;
      stepTxt.characters = step; stepTxt.fontSize = 13;
      stepTxt.fills = [{ type: 'SOLID', color: BRAND.colors.navyTrust, opacity: 0.75 }];
      stepTxt.x = 28; stepTxt.y = nsY;
      frame.appendChild(stepTxt);
      nsY += 42;
    }

    // Share button
    frame.appendChild(createOutlineButton('Share Achievement 🎉', 28, 724, 384));
    frame.appendChild(createButton('Go to Home', 28, 788, 384));
    frame.appendChild(createBottomNav('Apply', frame));
    figma.viewport.scrollAndZoomIntoView([frame]);
    figma.notify('✅ Approved screen created!');
  }


  // ── ONBOARDING SLIDE 1 — "Find Your Match" ──────────────────────────────
  if (msg.type === 'create-onboarding-1') {
    await loadFonts();
    const frame = figma.createFrame();
    frame.name = 'Scholaris — Onboarding 1';
    frame.resize(440, 956);
    frame.fills = [{ type: 'SOLID', color: BRAND.colors.warmWhite }];
    figma.currentPage.appendChild(frame);

    // Green illustration area (top half)
    const illustBg = figma.createRectangle();
    illustBg.resize(440, 480); illustBg.x = 0; illustBg.y = 0;
    illustBg.fills = [{ type: 'SOLID', color: BRAND.colors.bridgeGreen }];
    frame.appendChild(illustBg);

    // Subtle glow circle behind cap
    const glow = figma.createEllipse();
    glow.resize(280, 280); glow.x = 80; glow.y = 90;
    glow.fills = [{ type: 'SOLID', color: BRAND.colors.white, opacity: 0.06 }];
    frame.appendChild(glow);

    // Graduation cap illustration — white circle bg + emoji
    const capCircle = figma.createEllipse();
    capCircle.resize(200, 200); capCircle.x = 120; capCircle.y = 120;
    capCircle.fills = [{ type: 'SOLID', color: BRAND.colors.white, opacity: 0.12 }];
    frame.appendChild(capCircle);

    // Cap emoji centered
    const capEmoji = figma.createText();
    capEmoji.fontName = F.poppinsBold;
    capEmoji.characters = '🎓'; capEmoji.fontSize = 100;
    capEmoji.textAlignHorizontal = 'CENTER'; capEmoji.textAlignVertical = 'CENTER';
    capEmoji.resize(200, 200); capEmoji.x = 120; capEmoji.y = 120;
    frame.appendChild(capEmoji);

    // Gold accent ring around circle
    const capRing = figma.createEllipse();
    capRing.resize(220, 220); capRing.x = 110; capRing.y = 110;
    capRing.fills = [];
    capRing.strokes = [{ type: 'SOLID', color: BRAND.colors.goldenOpportunity, opacity: 0.4 }];
    capRing.strokeWeight = 3; capRing.strokeAlign = 'CENTER';
    frame.appendChild(capRing);

    // Small gold dot accents
    const dotAccents = [{x:110,y:110},{x:320,y:115},{x:105,y:305},{x:325,y:300}];
    for (const d of dotAccents) {
      const dot = figma.createEllipse();
      dot.resize(10, 10); dot.x = d.x; dot.y = d.y;
      dot.fills = [{ type: 'SOLID', color: BRAND.colors.goldenOpportunity, opacity: 0.5 }];
      frame.appendChild(dot);
    }

    // Floating sparkle dots
    const sparklePositions = [{x:90,y:130,r:6},{x:340,y:150,r:4},{x:80,y:300,r:5},{x:350,y:280,r:7},{x:200,y:380,r:4}];
    for (const sp of sparklePositions) {
      const sparkle = figma.createEllipse();
      sparkle.resize(sp.r*2, sp.r*2); sparkle.x = sp.x; sparkle.y = sp.y;
      sparkle.fills = [{ type: 'SOLID', color: BRAND.colors.goldenOpportunity, opacity: 0.4 }];
      frame.appendChild(sparkle);
    }

    // Curved divider (rectangle with rounded top to simulate wave)
    const divider = figma.createRectangle();
    divider.resize(440, 60); divider.x = 0; divider.y = 440;
    divider.cornerRadius = 32; divider.cornerRadius = 0;
    divider.fills = [{ type: 'SOLID', color: BRAND.colors.warmWhite }];
    frame.appendChild(divider);

    // Title
    const titleTxt = figma.createText();
    titleTxt.fontName = F.poppinsBold;
    titleTxt.characters = 'Find Your Match'; titleTxt.fontSize = 28;
    titleTxt.fills = [{ type: 'SOLID', color: BRAND.colors.navyTrust }];
    titleTxt.textAlignHorizontal = 'CENTER';
    titleTxt.resize(384, 40); titleTxt.x = 28; titleTxt.y = 500;
    frame.appendChild(titleTxt);

    // Description
    const descTxt = figma.createText();
    descTxt.fontName = F.openSansRegular;
    descTxt.characters = 'We connect you to scholarships that fit your profile, course, and goals.';
    descTxt.fontSize = 15; descTxt.lineHeight = { value: 24, unit: 'PIXELS' };
    descTxt.fills = [{ type: 'SOLID', color: BRAND.colors.navyTrust, opacity: 0.6 }];
    descTxt.textAlignHorizontal = 'CENTER';
    descTxt.resize(320, 72); descTxt.x = 60; descTxt.y = 556;
    frame.appendChild(descTxt);

    // Dots (dot 1 active)
    const dotColors = [true, false, false];
    let dx = 196;
    for (let i = 0; i < 3; i++) {
      const dot = figma.createEllipse();
      dot.resize(dotColors[i] ? 24 : 8, 8);
      dot.x = dx; dot.y = 660;
      dot.fills = [{ type: 'SOLID', color: BRAND.colors.bridgeGreen, opacity: dotColors[i] ? 1 : 0.25 }];
      frame.appendChild(dot);
      dx += dotColors[i] ? 32 : 16;
    }

    // Skip button (left)
    const skipTxt = figma.createText();
    skipTxt.fontName = F.openSansSemi; skipTxt.characters = 'Skip'; skipTxt.fontSize = 15;
    skipTxt.fills = [{ type: 'SOLID', color: BRAND.colors.navyTrust, opacity: 0.4 }];
    skipTxt.x = 40; skipTxt.y = 820;
    frame.appendChild(skipTxt);

    // Next button (right, green pill)
    const nextBtn = figma.createFrame();
    nextBtn.resize(140, 52); nextBtn.x = 260; nextBtn.y = 808;
    nextBtn.cornerRadius = BRAND.buttonRadius;
    nextBtn.fills = [{ type: 'SOLID', color: BRAND.colors.bridgeGreen }];
    frame.appendChild(nextBtn);
    const nextTxt = figma.createText();
    nextTxt.fontName = F.openSansSemi; nextTxt.characters = 'Next →'; nextTxt.fontSize = 15;
    nextTxt.fills = [{ type: 'SOLID', color: BRAND.colors.white }];
    nextTxt.textAlignHorizontal = 'CENTER'; nextTxt.textAlignVertical = 'CENTER';
    nextTxt.resize(140, 52); nextBtn.appendChild(nextTxt);

    figma.viewport.scrollAndZoomIntoView([frame]);
    figma.notify('✅ Onboarding Slide 1 created!');
  }

  // ── ONBOARDING SLIDE 2 — "Apply with Ease" ──────────────────────────────
  if (msg.type === 'create-onboarding-2') {
    await loadFonts();
    const frame = figma.createFrame();
    frame.name = 'Scholaris — Onboarding 2';
    frame.resize(440, 956);
    frame.fills = [{ type: 'SOLID', color: BRAND.colors.warmWhite }];
    figma.currentPage.appendChild(frame);

    // Green illustration area
    const illustBg = figma.createRectangle();
    illustBg.resize(440, 480); illustBg.x = 0; illustBg.y = 0;
    illustBg.fills = [{ type: 'SOLID', color: BRAND.colors.bridgeGreen }];
    frame.appendChild(illustBg);

    // Glow circle
    const glow = figma.createEllipse();
    glow.resize(260, 260); glow.x = 90; glow.y = 100;
    glow.fills = [{ type: 'SOLID', color: BRAND.colors.white, opacity: 0.06 }];
    frame.appendChild(glow);

    // Document illustration — checkmark card
    const docCard = figma.createFrame();
    docCard.resize(160, 200); docCard.x = 140; docCard.y = 120;
    docCard.cornerRadius = 12;
    docCard.fills = [{ type: 'SOLID', color: BRAND.colors.white }];
    docCard.effects = [{ type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.15 }, offset: { x: 0, y: 8 }, radius: 20, spread: 0, visible: true, blendMode: 'NORMAL' }];
    frame.appendChild(docCard);

    for (let i = 0; i < 4; i++) {
      const line = figma.createRectangle();
      line.resize(i === 0 ? 100 : 120, 8); line.x = 20; line.y = 30 + i * 36;
      line.cornerRadius = 4;
      line.fills = [{ type: 'SOLID', color: BRAND.colors.navyTrust, opacity: 0.12 }];
      docCard.appendChild(line);
    }

    const checkCircle = figma.createEllipse();
    checkCircle.resize(36, 36); checkCircle.x = 102; checkCircle.y = 148;
    checkCircle.fills = [{ type: 'SOLID', color: BRAND.colors.goldenOpportunity }];
    docCard.appendChild(checkCircle);

    const checkTxt = figma.createText();
    checkTxt.fontName = { family: 'Open Sans', style: 'SemiBold' };
    checkTxt.characters = '✓'; checkTxt.fontSize = 18;
    checkTxt.fills = [{ type: 'SOLID', color: BRAND.colors.navyTrust }];
    checkTxt.textAlignHorizontal = 'CENTER';
    checkTxt.textAlignVertical = 'CENTER';
    checkTxt.resize(36, 36);
    checkCircle.appendChild(checkTxt);

    // Floating mini cards (multiple scholarships)
    const miniCard1 = figma.createFrame();
    miniCard1.resize(120, 44); miniCard1.x = 280; miniCard1.y = 140;
    miniCard1.cornerRadius = 10;
    miniCard1.fills = [{ type: 'SOLID', color: BRAND.colors.goldenOpportunity, opacity: 0.15 }];
    miniCard1.rotation = 8;
    frame.appendChild(miniCard1);
    const m1txt = figma.createText();
    m1txt.fontName = F.openSansSemi; m1txt.characters = 'DOST-SEI'; m1txt.fontSize = 11;
    m1txt.fills = [{ type: 'SOLID', color: BRAND.colors.bridgeGreen }];
    m1txt.x = 10; m1txt.y = 14; miniCard1.appendChild(m1txt);

    const miniCard2 = figma.createFrame();
    miniCard2.resize(110, 44); miniCard2.x = 50; miniCard2.y = 300;
    miniCard2.cornerRadius = 10;
    miniCard2.fills = [{ type: 'SOLID', color: BRAND.colors.navyTrust, opacity: 0.08 }];
    miniCard2.rotation = -6;
    frame.appendChild(miniCard2);
    const m2txt = figma.createText();
    m2txt.fontName = F.openSansSemi; m2txt.characters = 'CHED Merit'; m2txt.fontSize = 11;
    m2txt.fills = [{ type: 'SOLID', color: BRAND.colors.navyTrust }];
    m2txt.x = 10; m2txt.y = 14; miniCard2.appendChild(m2txt);

    // Divider
    const divider = figma.createRectangle();
    divider.resize(440, 60); divider.x = 0; divider.y = 440;
    divider.fills = [{ type: 'SOLID', color: BRAND.colors.warmWhite }];
    frame.appendChild(divider);

    // Title
    const titleTxt = figma.createText();
    titleTxt.fontName = F.poppinsBold; titleTxt.characters = 'Apply with Ease'; titleTxt.fontSize = 28;
    titleTxt.fills = [{ type: 'SOLID', color: BRAND.colors.navyTrust }];
    titleTxt.textAlignHorizontal = 'CENTER';
    titleTxt.resize(384, 40); titleTxt.x = 28; titleTxt.y = 500;
    frame.appendChild(titleTxt);

    // Description
    const descTxt = figma.createText();
    descTxt.fontName = F.openSansRegular;
    descTxt.characters = 'Upload your documents once and apply to multiple scholarships in just a few taps.';
    descTxt.fontSize = 15; descTxt.lineHeight = { value: 24, unit: 'PIXELS' };
    descTxt.fills = [{ type: 'SOLID', color: BRAND.colors.navyTrust, opacity: 0.6 }];
    descTxt.textAlignHorizontal = 'CENTER';
    descTxt.resize(320, 72); descTxt.x = 60; descTxt.y = 556;
    frame.appendChild(descTxt);

    // Dots (dot 2 active)
    const dotPositions = [false, true, false];
    let dx = 196;
    for (let i = 0; i < 3; i++) {
      const dot = figma.createEllipse();
      dot.resize(dotPositions[i] ? 24 : 8, 8);
      dot.x = dx; dot.y = 660;
      dot.fills = [{ type: 'SOLID', color: BRAND.colors.bridgeGreen, opacity: dotPositions[i] ? 1 : 0.25 }];
      frame.appendChild(dot);
      dx += dotPositions[i] ? 32 : 16;
    }

    // Skip
    const skipTxt = figma.createText();
    skipTxt.fontName = F.openSansSemi; skipTxt.characters = 'Skip'; skipTxt.fontSize = 15;
    skipTxt.fills = [{ type: 'SOLID', color: BRAND.colors.navyTrust, opacity: 0.4 }];
    skipTxt.x = 40; skipTxt.y = 820;
    frame.appendChild(skipTxt);

    // Next button
    const nextBtn = figma.createFrame();
    nextBtn.resize(140, 52); nextBtn.x = 260; nextBtn.y = 808;
    nextBtn.cornerRadius = BRAND.buttonRadius;
    nextBtn.fills = [{ type: 'SOLID', color: BRAND.colors.bridgeGreen }];
    frame.appendChild(nextBtn);
    const nextTxt = figma.createText();
    nextTxt.fontName = F.openSansSemi; nextTxt.characters = 'Next →'; nextTxt.fontSize = 15;
    nextTxt.fills = [{ type: 'SOLID', color: BRAND.colors.white }];
    nextTxt.textAlignHorizontal = 'CENTER'; nextTxt.textAlignVertical = 'CENTER';
    nextTxt.resize(140, 52); nextBtn.appendChild(nextTxt);

    figma.viewport.scrollAndZoomIntoView([frame]);
    figma.notify('✅ Onboarding Slide 2 created!');
  }

  // ── ONBOARDING SLIDE 3 — "Track Your Journey" ───────────────────────────
  if (msg.type === 'create-onboarding-3') {
    await loadFonts();
    const frame = figma.createFrame();
    frame.name = 'Scholaris — Onboarding 3';
    frame.resize(440, 956);
    frame.fills = [{ type: 'SOLID', color: BRAND.colors.warmWhite }];
    figma.currentPage.appendChild(frame);

    // Green illustration area
    const illustBg = figma.createRectangle();
    illustBg.resize(440, 480); illustBg.x = 0; illustBg.y = 0;
    illustBg.fills = [{ type: 'SOLID', color: BRAND.colors.bridgeGreen }];
    frame.appendChild(illustBg);

    // Gold glow circle (large, behind trophy)
    const glowOuter = figma.createEllipse();
    glowOuter.resize(300, 300); glowOuter.x = 70; glowOuter.y = 80;
    glowOuter.fills = [{ type: 'SOLID', color: BRAND.colors.goldenOpportunity, opacity: 0.08 }];
    frame.appendChild(glowOuter);

    const glowInner = figma.createEllipse();
    glowInner.resize(200, 200); glowInner.x = 120; glowInner.y = 130;
    glowInner.fills = [{ type: 'SOLID', color: BRAND.colors.goldenOpportunity, opacity: 0.12 }];
    frame.appendChild(glowInner);

    // Trophy illustration — gold circle bg + emoji
    const trophyCircle = figma.createEllipse();
    trophyCircle.resize(200, 200); trophyCircle.x = 120; trophyCircle.y = 120;
    trophyCircle.fills = [{ type: 'SOLID', color: BRAND.colors.goldenOpportunity, opacity: 0.15 }];
    frame.appendChild(trophyCircle);

    // Trophy emoji
    const trophyEmoji = figma.createText();
    trophyEmoji.fontName = F.poppinsBold;
    trophyEmoji.characters = '🏆'; trophyEmoji.fontSize = 100;
    trophyEmoji.textAlignHorizontal = 'CENTER'; trophyEmoji.textAlignVertical = 'CENTER';
    trophyEmoji.resize(200, 200); trophyEmoji.x = 120; trophyEmoji.y = 120;
    frame.appendChild(trophyEmoji);

    // Gold glow ring
    const trophyRing = figma.createEllipse();
    trophyRing.resize(240, 240); trophyRing.x = 100; trophyRing.y = 100;
    trophyRing.fills = [];
    trophyRing.strokes = [{ type: 'SOLID', color: BRAND.colors.goldenOpportunity, opacity: 0.35 }];
    trophyRing.strokeWeight = 3; trophyRing.strokeAlign = 'CENTER';
    frame.appendChild(trophyRing);

    // Outer glow ring
    const trophyRing2 = figma.createEllipse();
    trophyRing2.resize(280, 280); trophyRing2.x = 80; trophyRing2.y = 80;
    trophyRing2.fills = [];
    trophyRing2.strokes = [{ type: 'SOLID', color: BRAND.colors.goldenOpportunity, opacity: 0.15 }];
    trophyRing2.strokeWeight = 2; trophyRing2.strokeAlign = 'CENTER';
    frame.appendChild(trophyRing2);

    // Status pills floating around trophy
    const statusPills = [
      { label: 'Submitted', x: 40, y: 180, color: BRAND.colors.navyTrust },
      { label: 'Under Review', x: 280, y: 160, color: BRAND.colors.goldenOpportunity },
      { label: 'Approved ✓', x: 60, y: 320, color: BRAND.colors.bridgeGreen },
    ];
    for (const pill of statusPills) {
      const pillFrame = figma.createFrame();
      const pillW = pill.label.length * 8 + 24;
      pillFrame.resize(pillW, 30); pillFrame.x = pill.x; pillFrame.y = pill.y;
      pillFrame.cornerRadius = 50;
      pillFrame.fills = [{ type: 'SOLID', color: pill.color, opacity: 0.15 }];
      frame.appendChild(pillFrame);
      const pillTxt = figma.createText();
      pillTxt.fontName = F.openSansSemi; pillTxt.characters = pill.label; pillTxt.fontSize = 11;
      pillTxt.fills = [{ type: 'SOLID', color: pill.color }];
      pillTxt.textAlignHorizontal = 'CENTER'; pillTxt.textAlignVertical = 'CENTER';
      pillTxt.resize(pillW, 30); pillFrame.appendChild(pillTxt);
    }

    // Divider
    const divider = figma.createRectangle();
    divider.resize(440, 60); divider.x = 0; divider.y = 440;
    divider.fills = [{ type: 'SOLID', color: BRAND.colors.warmWhite }];
    frame.appendChild(divider);

    // Title
    const titleTxt = figma.createText();
    titleTxt.fontName = F.poppinsBold; titleTxt.characters = 'Track Your Journey'; titleTxt.fontSize = 28;
    titleTxt.fills = [{ type: 'SOLID', color: BRAND.colors.navyTrust }];
    titleTxt.textAlignHorizontal = 'CENTER';
    titleTxt.resize(384, 40); titleTxt.x = 28; titleTxt.y = 500;
    frame.appendChild(titleTxt);

    // Description
    const descTxt = figma.createText();
    descTxt.fontName = F.openSansRegular;
    descTxt.characters = 'Monitor your application status in real time, from submitted to approved.';
    descTxt.fontSize = 15; descTxt.lineHeight = { value: 24, unit: 'PIXELS' };
    descTxt.fills = [{ type: 'SOLID', color: BRAND.colors.navyTrust, opacity: 0.6 }];
    descTxt.textAlignHorizontal = 'CENTER';
    descTxt.resize(320, 72); descTxt.x = 60; descTxt.y = 556;
    frame.appendChild(descTxt);

    // Dots (dot 3 active)
    const dotPositions = [false, false, true];
    let dx = 196;
    for (let i = 0; i < 3; i++) {
      const dot = figma.createEllipse();
      dot.resize(dotPositions[i] ? 24 : 8, 8);
      dot.x = dx; dot.y = 660;
      dot.fills = [{ type: 'SOLID', color: BRAND.colors.bridgeGreen, opacity: dotPositions[i] ? 1 : 0.25 }];
      frame.appendChild(dot);
      dx += dotPositions[i] ? 32 : 16;
    }

    // Get Started button (full width, no Skip)
    const getStartedBtn = figma.createFrame();
    getStartedBtn.resize(360, 56); getStartedBtn.x = 40; getStartedBtn.y = 808;
    getStartedBtn.cornerRadius = BRAND.buttonRadius;
    getStartedBtn.fills = [{ type: 'SOLID', color: BRAND.colors.bridgeGreen }];
    frame.appendChild(getStartedBtn);
    const getStartedTxt = figma.createText();
    getStartedTxt.fontName = F.poppinsBold; getStartedTxt.characters = 'Get Started'; getStartedTxt.fontSize = 16;
    getStartedTxt.fills = [{ type: 'SOLID', color: BRAND.colors.white }];
    getStartedTxt.textAlignHorizontal = 'CENTER'; getStartedTxt.textAlignVertical = 'CENTER';
    getStartedTxt.resize(360, 56); getStartedBtn.appendChild(getStartedTxt);

    figma.viewport.scrollAndZoomIntoView([frame]);
    figma.notify('✅ Onboarding Slide 3 created!');
  }

  if (msg.type === 'cancel') figma.closePlugin();
};

// ── HELPERS ──────────────────────────────────────────────────────────────────

function createBottomNav(active, frame) {
  const navBar = figma.createFrame();
  navBar.name = 'Bottom Nav';
  navBar.resize(440, 90); navBar.x = 0; navBar.y = 866;
  navBar.fills = [{ type: 'SOLID', color: BRAND.colors.white }];
  navBar.effects = [{
    type: 'DROP_SHADOW',
    color: { r: 0.106, g: 0.227, b: 0.361, a: 0.08 },
    offset: { x: 0, y: -4 }, radius: 12, spread: 0,
    visible: true, blendMode: 'NORMAL',
  }];

  const navItems = [
    { key: 'Home',    label: 'Home' },
    { key: 'Search',  label: 'Search' },
    { key: 'Apply',   label: 'Apply' },
    { key: 'Profile', label: 'Profile' },
  ];

  let nx = 18;
  for (const item of navItems) {
    const isActive = item.key === active;
    const col = BRAND.colors.bridgeGreen;
    const iconOp = isActive ? 1 : 0.3;
    const txtOp  = isActive ? 1 : 0.35;

    // White rounded square box (like sample icon set)
    const box = figma.createFrame();
    box.resize(44, 44); box.x = nx + 14; box.y = 6;
    box.cornerRadius = 10;
    box.fills = [{ type: 'SOLID', color: isActive ? BRAND.colors.bridgeGreen : BRAND.colors.warmWhite }];
    if (!isActive) {
      box.strokes = [{ type: 'SOLID', color: BRAND.colors.navyTrust, opacity: 0.1 }];
      box.strokeWeight = 1; box.strokeAlign = 'INSIDE';
    }
    navBar.appendChild(box);

    const iconCol = isActive ? BRAND.colors.white : BRAND.colors.bridgeGreen;

    if (item.key === 'Home') {
      // Roof triangle
      const roof = figma.createPolygon();
      roof.resize(26, 13); roof.x = 9; roof.y = 6;
      roof.fills = [{ type: 'SOLID', color: iconCol }];
      box.appendChild(roof);
      // Body
      const body = figma.createRectangle();
      body.resize(18, 13); body.x = 13; body.y = 17;
      body.cornerRadius = 2;
      body.fills = [{ type: 'SOLID', color: iconCol }];
      box.appendChild(body);
      // Door cutout
      const door = figma.createRectangle();
      door.resize(7, 8); door.x = 18; door.y = 22;
      door.cornerRadius = 1;
      door.fills = [{ type: 'SOLID', color: isActive ? BRAND.colors.bridgeGreen : BRAND.colors.warmWhite }];
      box.appendChild(door);

    } else if (item.key === 'Search') {
      // Magnifying glass circle
      const glass = figma.createEllipse();
      glass.resize(22, 22); glass.x = 5; glass.y = 5;
      glass.fills = [];
      glass.strokes = [{ type: 'SOLID', color: iconCol }];
      glass.strokeWeight = 3.5;
      box.appendChild(glass);
      // Handle
      const handle = figma.createRectangle();
      handle.resize(3, 11); handle.x = 32; handle.y = 26;
      handle.cornerRadius = 2; handle.rotation = -45;
      handle.fills = [{ type: 'SOLID', color: iconCol }];
      box.appendChild(handle);

    } else if (item.key === 'Apply') {
      // Document body
      const doc = figma.createRectangle();
      doc.resize(22, 28); doc.x = 11; doc.y = 6;
      doc.cornerRadius = 3;
      doc.fills = [{ type: 'SOLID', color: iconCol }];
      box.appendChild(doc);
      // Arrow shaft
      const shaft = figma.createRectangle();
      shaft.resize(3, 10); shaft.x = 20; shaft.y = 10;
      shaft.cornerRadius = 1;
      shaft.fills = [{ type: 'SOLID', color: isActive ? BRAND.colors.bridgeGreen : BRAND.colors.warmWhite }];
      box.appendChild(shaft);
      // Arrow head left
      const aL = figma.createRectangle();
      aL.resize(7, 2.5); aL.x = 12; aL.y = 10;
      aL.cornerRadius = 1; aL.rotation = -45;
      aL.fills = [{ type: 'SOLID', color: isActive ? BRAND.colors.bridgeGreen : BRAND.colors.warmWhite }];
      box.appendChild(aL);
      // Arrow head right
      const aR = figma.createRectangle();
      aR.resize(7, 2.5); aR.x = 22; aR.y = 10;
      aR.cornerRadius = 1; aR.rotation = 45;
      aR.fills = [{ type: 'SOLID', color: isActive ? BRAND.colors.bridgeGreen : BRAND.colors.warmWhite }];
      box.appendChild(aR);

    } else if (item.key === 'Profile') {
      // Head circle
      const head = figma.createEllipse();
      head.resize(14, 14); head.x = 15; head.y = 5;
      head.fills = [{ type: 'SOLID', color: iconCol }];
      box.appendChild(head);
      // Shoulders
      const shoulders = figma.createEllipse();
      shoulders.resize(28, 16); shoulders.x = 8; shoulders.y = 22;
      shoulders.fills = [{ type: 'SOLID', color: iconCol }];
      box.appendChild(shoulders);
    }

    // Label
    const navTxt = figma.createText();
    navTxt.fontName = isActive ? F.openSansSemi : F.openSansRegular;
    navTxt.characters = item.label; navTxt.fontSize = 10;
    navTxt.fills = [{ type: 'SOLID', color: col, opacity: txtOp }];
    navTxt.textAlignHorizontal = 'CENTER';
    navTxt.resize(72, 14); navTxt.x = nx + 6; navTxt.y = 54;
    navBar.appendChild(navTxt);

    nx += 110;
  }
  return navBar;
}

function createInputField(placeholder, x, y, width) {
  const field = figma.createFrame();
  field.name = `Input — ${placeholder}`;
  field.resize(width, 52); field.x = x; field.y = y;
  field.cornerRadius = BRAND.inputRadius;
  field.fills = [{ type: 'SOLID', color: BRAND.colors.white }];
  field.strokes = [{ type: 'SOLID', color: BRAND.colors.navyTrust, opacity: 0.2 }];
  field.strokeWeight = 1.5; field.strokeAlign = 'INSIDE';
  const label = figma.createText();
  label.fontName = F.openSansRegular;
  label.characters = placeholder; label.fontSize = 14;
  label.fills = [{ type: 'SOLID', color: BRAND.colors.navyTrust, opacity: 0.4 }];
  label.x = 16; label.y = 17; field.appendChild(label);
  return field;
}

function createButton(label, x, y, width) {
  const btn = figma.createFrame();
  btn.name = `Button — ${label}`;
  btn.resize(width, 52); btn.x = x; btn.y = y;
  btn.cornerRadius = BRAND.buttonRadius;
  btn.fills = [{ type: 'SOLID', color: BRAND.colors.bridgeGreen }];
  const txt = figma.createText();
  txt.fontName = F.openSansSemi;
  txt.characters = label; txt.fontSize = 15;
  txt.fills = [{ type: 'SOLID', color: BRAND.colors.white }];
  txt.textAlignHorizontal = 'CENTER';
  txt.textAlignVertical = 'CENTER';
  txt.resize(width, 52);
  btn.appendChild(txt);
  return btn;
}

function createOutlineButton(label, x, y, width) {
  const btn = figma.createFrame();
  btn.name = `Button — ${label}`;
  btn.resize(width, 52); btn.x = x; btn.y = y;
  btn.cornerRadius = BRAND.buttonRadius;
  btn.fills = [{ type: 'SOLID', color: BRAND.colors.warmWhite }];
  btn.strokes = [{ type: 'SOLID', color: BRAND.colors.navyTrust, opacity: 0.25 }];
  btn.strokeWeight = 1.5; btn.strokeAlign = 'INSIDE';
  const txt = figma.createText();
  txt.fontName = F.openSansSemi;
  txt.characters = label; txt.fontSize = 14;
  txt.fills = [{ type: 'SOLID', color: BRAND.colors.navyTrust }];
  txt.textAlignHorizontal = 'CENTER';
  txt.textAlignVertical = 'CENTER';
  txt.resize(width, 52);
  btn.appendChild(txt);
  return btn;
}

function createScholarshipCard(x, y, width, title, org, amount, deadline, status) {
  const card = figma.createFrame();
  card.name = `📋 Card — ${title}`;
  card.resize(width, 160); card.x = x; card.y = y;
  card.cornerRadius = BRAND.cornerRadius;
  card.fills = [{ type: 'SOLID', color: BRAND.colors.white }];
  card.effects = [{
    type: 'DROP_SHADOW',
    color: { r: 0.106, g: 0.227, b: 0.361, a: 0.08 },
    offset: { x: 0, y: 4 }, radius: 16, spread: 0,
    visible: true, blendMode: 'NORMAL',
  }];

  // Gold accent bar
  const accent = figma.createRectangle();
  accent.resize(4, 120); accent.x = 0; accent.y = 20; accent.cornerRadius = 4;
  accent.fills = [{ type: 'SOLID', color: BRAND.colors.goldenOpportunity }];
  card.appendChild(accent);

  const titleTxt = figma.createText();
  titleTxt.fontName = F.poppinsSemi;
  titleTxt.characters = title; titleTxt.fontSize = 14;
  titleTxt.fills = [{ type: 'SOLID', color: BRAND.colors.navyTrust }];
  titleTxt.x = 20; titleTxt.y = 18; card.appendChild(titleTxt);

  const orgTxt = figma.createText();
  orgTxt.fontName = F.openSansRegular;
  orgTxt.characters = org; orgTxt.fontSize = 11;
  orgTxt.fills = [{ type: 'SOLID', color: BRAND.colors.navyTrust, opacity: 0.55 }];
  orgTxt.x = 20; orgTxt.y = 42; card.appendChild(orgTxt);

  const amountTxt = figma.createText();
  amountTxt.fontName = F.poppinsBold;
  amountTxt.characters = amount; amountTxt.fontSize = 18;
  amountTxt.fills = [{ type: 'SOLID', color: BRAND.colors.bridgeGreen }];
  amountTxt.x = 20; amountTxt.y = 76; card.appendChild(amountTxt);

  const deadlineTxt = figma.createText();
  deadlineTxt.fontName = F.openSansRegular;
  deadlineTxt.characters = deadline; deadlineTxt.fontSize = 11;
  deadlineTxt.fills = [{ type: 'SOLID', color: BRAND.colors.coralConnect }];
  deadlineTxt.x = 20; deadlineTxt.y = 108; card.appendChild(deadlineTxt);

  // Status badge
  const badgeColors = {
    'Matched':      { bg: BRAND.colors.goldenOpportunity, txt: hex('#9A7010') },
    'Under Review': { bg: BRAND.colors.navyTrust, txt: BRAND.colors.white },
    'Approved':     { bg: BRAND.colors.bridgeGreen, txt: BRAND.colors.white },
  };
  const bc = badgeColors[status] || badgeColors['Matched'];
  const badgeFrame = figma.createFrame();
  badgeFrame.resize(100, 26); badgeFrame.x = width - 116; badgeFrame.y = 18;
  badgeFrame.cornerRadius = 50;
  badgeFrame.fills = [{ type: 'SOLID', color: bc.bg, opacity: 0.18 }];
  card.appendChild(badgeFrame);
  const badgeTxt = figma.createText();
  badgeTxt.fontName = F.openSansSemi;
  badgeTxt.characters = status; badgeTxt.fontSize = 11;
  badgeTxt.fills = [{ type: 'SOLID', color: bc.txt }];
  badgeTxt.textAlignHorizontal = 'CENTER';
  badgeTxt.textAlignVertical = 'CENTER';
  badgeTxt.resize(100, 26);
  badgeFrame.appendChild(badgeTxt);

  return card;
}

function createBadge(label, x, y) {
  const badge = figma.createFrame();
  badge.name = `Badge — ${label}`;
  badge.resize(90, 28); badge.x = x; badge.y = y; badge.cornerRadius = 50;
  badge.fills = [{ type: 'SOLID', color: BRAND.colors.goldenOpportunity, opacity: 0.18 }];
  const txt = figma.createText();
  txt.fontName = F.openSansSemi;
  txt.characters = label; txt.fontSize = 12;
  txt.fills = [{ type: 'SOLID', color: hex('#9A7010') }];
  txt.textAlignHorizontal = 'CENTER';
  txt.textAlignVertical = 'CENTER';
  txt.resize(90, 28);
  badge.appendChild(txt);
  return badge;
}

function applyBrandStyle(node, role) {
  const colorMap = {
    primary:    BRAND.colors.bridgeGreen,
    accent:     BRAND.colors.goldenOpportunity,
    secondary:  BRAND.colors.navyTrust,
    highlight:  BRAND.colors.coralConnect,
    background: BRAND.colors.warmWhite,
  };
  const color = colorMap[role] || BRAND.colors.bridgeGreen;
  if ('fills' in node) { node.fills = [{ type: 'SOLID', color }]; }
  if ('cornerRadius' in node && !('text' in node)) { node.cornerRadius = BRAND.cornerRadius; }
}