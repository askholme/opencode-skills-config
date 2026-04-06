const PptxGenJS = require("pptxgenjs");
const path = require("path");
const ICONS = path.join(__dirname, "icons");

const C = {
  navy: "0E2841", cream: "F3F0EB", black: "000000", white: "FFFFFF",
  teal: "009B81", periwinkle: "8FA1FF", orange: "FF562C", tan: "C0A883",
  burgundy: "943C31", gray: "C6C6D0", amber: "FBAE40", softOrange: "F26B43",
};
const SW = 13.33, SH = 7.5, M = 0.5;
const makeShadow = () => ({ type: "outer", blur: 4, offset: 2, angle: 135, color: "000000", opacity: 0.08 });

let _p;
function vLine(s, x, y1, y2, c) { c=c||C.gray; s.addShape(_p.shapes.RECTANGLE, { x:x-0.01, y:y1, w:0.02, h:y2-y1, fill:{color:c}, line:{color:c,width:0} }); }
function hLine(s, x1, x2, y, c) { c=c||C.gray; s.addShape(_p.shapes.RECTANGLE, { x:x1, y:y-0.01, w:x2-x1, h:0.02, fill:{color:c}, line:{color:c,width:0} }); }
function thinRect(s, x, y, w, h, c) { s.addShape(_p.shapes.RECTANGLE, { x, y, w, h, fill:{color:c}, line:{color:c,width:0} }); }
// Dashed horizontal line (series of small rectangles)
function dashedHLine(s, x1, x2, y, c, dashLen, gapLen) {
  dashLen = dashLen || 0.12; gapLen = gapLen || 0.08;
  let cx = x1;
  while (cx + dashLen <= x2) {
    thinRect(s, cx, y - 0.005, dashLen, 0.01, c);
    cx += dashLen + gapLen;
  }
}

async function build() {
  const pres = new PptxGenJS();
  _p = pres;
  pres.layout = "LAYOUT_WIDE";
  pres.author = "Numa Collective";
  pres.title = "AI Setup \u2014 Building Blocks & Custom Architecture";

  // ═══════════════════════════════════════════════════════════════════════════
  // SLIDE 1: Building Blocks (font min 12pt)
  // ═══════════════════════════════════════════════════════════════════════════
  const s1 = pres.addSlide(); s1.background = { color: C.cream };
  s1.addText("The Building Blocks of AI Tools", {
    x: M, y: 0.3, w: SW-2*M, h: 0.65,
    fontSize: 36, fontFace: "Calibri Light", color: C.navy, align: "left", valign: "middle", margin: 0,
  });

  const blocks = [
    { color: C.teal,       iconFile: "brain.png",     title: "Model",           what: "The raw intelligence engine",                                        examples: "Claude Opus, Sonnet,\nChatGPT, Gemini, Grok" },
    { color: C.navy,       iconFile: "hammer.png",    title: "Skill",           what: "Packaged instructions for a specific task",                           examples: '"Write a .pptx",\n"Proofread a doc"' },
    { color: C.periwinkle, iconFile: "team.png",      title: "Agent",           what: "Persistent personality \u2014 static instructions that steer focus",  examples: '"You are a business\nconsultant: rigorous,\nconcise"' },
    { color: C.orange,     iconFile: "connector.png", title: "Connector / MCP", what: "Bridge that lets the model reach external systems",                   examples: "Email, Notion,\nCalendar, CRM" },
    { color: C.burgundy,   iconFile: "sewing.png",    title: "Harness",         what: "Technical wrapper \u2014 data flow, tools, model access",             examples: "Claude Code, Cursor,\nChatGPT app" },
  ];
  const bGap = 0.25, bW = (SW-2*M - bGap*4)/5, bH = 4.6, bY = 1.15;
  blocks.forEach((b, i) => {
    const bx = M + i*(bW+bGap);
    s1.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:bx, y:bY, w:bW, h:bH, fill:{color:b.color}, rectRadius:0.15 });
    s1.addImage({ path: path.join(ICONS, b.iconFile), x:bx+(bW-0.8)/2, y:bY+0.1, w:0.8, h:0.8 });
    s1.addText(b.title, { x:bx+0.2, y:bY+0.85, w:bW-0.4, h:0.45, fontSize:16, bold:true, fontFace:"Calibri", color:C.white, align:"left", valign:"top", margin:0 });
    thinRect(s1, bx+0.2, bY+1.35, bW-0.4, 0.01, C.white);
    s1.addText(b.what, { x:bx+0.2, y:bY+1.5, w:bW-0.4, h:1.2, fontSize:14, fontFace:"Calibri", color:C.white, align:"left", valign:"top", margin:0 });
    s1.addText("Examples", { x:bx+0.2, y:bY+2.8, w:bW-0.4, h:0.3, fontSize:12, bold:true, fontFace:"Calibri", color:C.white, align:"left", valign:"top", margin:0 });
    s1.addText(b.examples, { x:bx+0.2, y:bY+3.1, w:bW-0.4, h:1.2, fontSize:12, italic:true, fontFace:"Calibri", color:C.white, align:"left", valign:"top", margin:0 });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // SLIDE 2: Curated Package (font min 12pt)
  // ═══════════════════════════════════════════════════════════════════════════
  const s2 = pres.addSlide(); s2.background = { color: C.cream };
  s2.addText("What You Typically See \u2014 A Curated Package", {
    x: M, y: 0.3, w: SW-2*M, h: 0.65,
    fontSize: 36, fontFace: "Calibri Light", color: C.navy, align: "left", valign: "middle", margin: 0,
  });
  const outerX=1.5, outerY=1.3, outerW=10.33, outerH=5.6;
  s2.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:outerX, y:outerY, w:outerW, h:outerH, fill:{color:C.navy}, rectRadius:0.2 });
  s2.addText("Typical Harness \u2014 e.g. Claude Cowork", { x:outerX, y:outerY+0.15, w:outerW, h:0.55, fontSize:22, bold:true, fontFace:"Calibri", color:C.white, align:"center", valign:"middle", margin:0 });
  s2.addText("A curated, pre-assembled package of building blocks", { x:outerX, y:outerY+0.6, w:outerW, h:0.35, fontSize:13, italic:true, fontFace:"Calibri", color:C.periwinkle, align:"center", valign:"middle", margin:0 });

  const iPd=0.4, cX=outerX+iPd, cW=outerW-2*iPd, cH=0.95, cGp=0.15, fCY=outerY+1.15;
  const stackCards = [
    { iconFile:"sewing.png",    label:"Harness",    desc:"Handles files, runs todo lists, manages tool access, and adds memory across chats", accent:C.burgundy },
    { iconFile:"team.png",      label:"Agent",      desc:"Persistent personality that steers focus; Projects feature allows multiple agents", accent:C.periwinkle },
    { iconFile:"hammer.png",    label:"Skills",     desc:"Ships with built-in skills (docx, pptx, \u2026); you can install more from a library", accent:C.teal },
    { iconFile:"connector.png", label:"Connectors", desc:"MCP marketplace for connections to major SaaS tools (email, calendar, CRM, \u2026)", accent:C.orange },
  ];
  stackCards.forEach((c, i) => {
    const cy = fCY + i*(cH+cGp);
    s2.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:cX, y:cy, w:cW, h:cH, fill:{color:C.white}, rectRadius:0.08, shadow:makeShadow() });
    s2.addShape(pres.shapes.RECTANGLE, { x:cX, y:cy, w:0.06, h:cH, fill:{color:c.accent} });
    s2.addImage({ path: path.join(ICONS, c.iconFile), x:cX+0.25, y:cy+(cH-0.45)/2, w:0.45, h:0.45 });
    s2.addText(c.label, { x:cX+0.9, y:cy+0.12, w:2.0, h:0.35, fontSize:16, bold:true, fontFace:"Calibri", color:C.navy, align:"left", valign:"middle", margin:0 });
    s2.addText(c.desc, { x:cX+0.9, y:cy+0.48, w:cW-1.2, h:0.4, fontSize:14, fontFace:"Calibri", color:C.black, align:"left", valign:"top", margin:0 });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // SLIDE 3: Context — AI Processing Loop
  // Shifted right, row numbers aligned, "Iterations" label left,
  // "Harness controls the loop" box on right
  // ═══════════════════════════════════════════════════════════════════════════
  const s3 = pres.addSlide(); s3.background = { color: C.cream };
  s3.addText("Context: The AI Does Not Actually Have Memory!", {
    x: M, y: 0.1, w: SW-2*M, h: 0.5,
    fontSize: 30, fontFace: "Calibri Light", color: C.navy, align: "left", valign: "middle", margin: 0,
  });
  s3.addText("Simplified: each call sends the full conversation so far. The harness orchestrates what actually goes in.", {
    x: M, y: 0.55, w: SW-2*M, h: 0.28,
    fontSize: 12, italic: true, fontFace: "Calibri", color: C.tan, align: "left", valign: "middle", margin: 0,
  });

  // Layout: "Iterations" label top-left | row badges | Input → Processing → Output | return arrows | Harness box right
  // Everything on one horizontal line per row, no whitespace gap
  const harnessBoxW = 2.8;
  const badgeW = 0.28;
  const rowH = 1.15;
  const rowGap = 0.1;
  const rowStartY = 0.95;
  const oItemH = 0.28;
  const oItemGap = 0.05;

  // "Iterations" label — horizontal, top-left above the rows
  s3.addText("Iterations", {
    x: M, y: rowStartY - 0.28, w: 1.2, h: 0.25,
    fontSize: 12, bold: true, fontFace: "Calibri", color: C.burgundy,
    align: "left", valign: "middle", margin: 0,
  });

  // Compute positions: badge | input | arrow | proc | arrow | output | return | harness
  const badgeX = M;
  const inputX = badgeX + badgeW + 0.06;
  const inputW = 1.5;
  const arrowW = 0.3;
  const a1X = inputX + inputW;
  const procX = a1X + arrowW;
  const procW = 1.5;
  const a2X = procX + procW;
  const outputX = a2X + arrowW;
  const outputW = 1.4;
  const returnX = outputX + outputW + 0.1;
  // Harness box starts after return zone, with whitespace gap
  const harnessBoxX = returnX + 0.75;
  // Ensure harness box fits
  const harnessActualW = SW - M - harnessBoxX;

  const outputItems = [
    { label: "Reasoning", color: C.navy },
    { label: "Tool Call", color: C.orange },
    { label: "User Message", color: C.teal },
  ];

  for (let row = 0; row < 4; row++) {
    const ry = rowStartY + row*(rowH+rowGap);
    const isFirst = row === 0;
    const inputLabel = isFirst ? "User Input" : "User Input\nor Tool Result";
    const rowMidY = ry + rowH/2;

    // Row badge
    s3.addShape(pres.shapes.RECTANGLE, { x:badgeX, y:ry+(rowH-badgeW)/2, w:badgeW, h:badgeW, fill:{color:C.burgundy} });
    s3.addText(String(row+1), { x:badgeX, y:ry+(rowH-badgeW)/2, w:badgeW, h:badgeW, fontSize:14, bold:true, fontFace:"Calibri", color:C.white, align:"center", valign:"middle", margin:0 });

    // Input box
    s3.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:inputX, y:ry+0.1, w:inputW, h:rowH-0.2, fill:{color:C.white}, rectRadius:0.08, line:{color:C.gray,width:0.75} });
    s3.addText(inputLabel, { x:inputX+0.05, y:ry+0.1, w:inputW-0.1, h:rowH-0.2, fontSize:12, bold:true, fontFace:"Calibri", color:C.navy, align:"center", valign:"middle", margin:0 });

    // Arrow →
    thinRect(s3, a1X+0.04, rowMidY-0.01, arrowW-0.1, 0.02, C.teal);
    s3.addText("\u25B6", { x:procX-0.14, y:rowMidY-0.1, w:0.16, h:0.2, fontSize:12, fontFace:"Calibri", color:C.teal, align:"center", valign:"middle", margin:0 });

    // AI Processing box
    s3.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:procX, y:ry+0.03, w:procW, h:rowH-0.06, fill:{color:C.teal}, rectRadius:0.1 });
    s3.addImage({ path: path.join(ICONS, "brain.png"), x:procX+(procW-0.3)/2, y:ry+0.08, w:0.3, h:0.3 });
    s3.addText("AI Processing", { x:procX, y:ry+0.38, w:procW, h:0.3, fontSize:11, bold:true, fontFace:"Calibri", color:C.white, align:"center", valign:"middle", margin:0 });

    // Arrow →
    thinRect(s3, a2X+0.04, rowMidY-0.01, arrowW-0.1, 0.02, C.teal);
    s3.addText("\u25B6", { x:outputX-0.14, y:rowMidY-0.1, w:0.16, h:0.2, fontSize:12, fontFace:"Calibri", color:C.teal, align:"center", valign:"middle", margin:0 });

    // Output: vertical stack
    const stackTopY = ry + (rowH - 3*oItemH - 2*oItemGap)/2;
    outputItems.forEach((item, idx) => {
      const iy = stackTopY + idx*(oItemH+oItemGap);
      s3.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:outputX, y:iy, w:outputW, h:oItemH, fill:{color:item.color}, rectRadius:0.05 });
      s3.addText(item.label, { x:outputX, y:iy, w:outputW, h:oItemH, fontSize:12, bold:true, fontFace:"Calibri", color:C.white, align:"center", valign:"middle", margin:0 });
    });

    // Circular arrow: Reasoning top → up → left → down into AI Processing
    const reasonTopY = stackTopY;
    const loopY = ry - 0.02;
    const procCX = procX + procW/2;
    const reasonCX = outputX + outputW/2;
    vLine(s3, reasonCX, loopY, reasonTopY, C.navy);
    hLine(s3, procCX, reasonCX, loopY, C.navy);
    vLine(s3, procCX, loopY, ry+0.03, C.navy);
    s3.addText("\u25BC", { x:procCX-0.1, y:ry-0.01, w:0.2, h:0.16, fontSize:12, fontFace:"Calibri", color:C.navy, align:"center", valign:"middle", margin:0 });

    // Return arrow to next row
    if (row < 3) {
      const nextRy = rowStartY + (row+1)*(rowH+rowGap);
      const nextMidY = nextRy + rowH/2;
      hLine(s3, outputX+outputW, returnX, rowMidY, C.periwinkle);
      vLine(s3, returnX, rowMidY, nextMidY, C.periwinkle);
      hLine(s3, inputX, returnX, nextMidY, C.periwinkle);
      s3.addText("\u25B6", { x:inputX-0.16, y:nextMidY-0.1, w:0.18, h:0.2, fontSize:12, fontFace:"Calibri", color:C.periwinkle, align:"center", valign:"middle", margin:0 });
      s3.addText("context\nforward", { x:returnX+0.04, y:(rowMidY+nextMidY)/2-0.18, w:0.48, h:0.36, fontSize:9, italic:true, fontFace:"Calibri", color:C.periwinkle, align:"left", valign:"middle", margin:0 });
    }
  }

  // "Harness controls the loop" box — with whitespace gap from flow
  const hbY = rowStartY;
  const hbContentH = 3.8; // fit to content, less whitespace at bottom
  s3.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:harnessBoxX, y:hbY, w:harnessActualW, h:hbContentH, fill:{color:C.navy}, rectRadius:0.12 });
  s3.addText("Harness Controls the Loop", {
    x:harnessBoxX+0.15, y:hbY+0.1, w:harnessActualW-0.3, h:0.4,
    fontSize:16, bold:true, fontFace:"Calibri", color:C.white, align:"left", valign:"middle", margin:0,
  });
  thinRect(s3, harnessBoxX+0.15, hbY+0.55, harnessActualW-0.3, 0.01, C.white);
  const harnessPoints = [
    "Local tool execution\n(file read/write, web search, code run)",
    "Skills, MCP tools, chat history, and agent personality combined into one big context input",
    "Adds features like memory \u2014 a dynamic agent personality that evolves",
  ];
  let hpY = hbY + 0.65;
  harnessPoints.forEach((pt) => {
    s3.addText("\u2022 " + pt, {
      x:harnessBoxX+0.15, y:hpY, w:harnessActualW-0.3, h:0.75,
      fontSize:14, fontFace:"Calibri", color:C.white, align:"left", valign:"top", margin:0,
    });
    hpY += 0.85;
  });
  s3.addText("Harness can have big impact on output quality!", {
    x:harnessBoxX+0.15, y:hpY+0.05, w:harnessActualW-0.3, h:0.4,
    fontSize:14, bold:true, fontFace:"Calibri", color:C.amber, align:"left", valign:"middle", margin:0,
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // SLIDE 4: Models Framework (smaller 2x2 + "Other differences" box)
  // ═══════════════════════════════════════════════════════════════════════════
  const s4 = pres.addSlide(); s4.background = { color: C.cream };
  s4.addText("Models Differ \u2014 One Mental Model to Start With", {
    x: M, y: 0.2, w: SW-2*M, h: 0.55,
    fontSize: 36, fontFace: "Calibri Light", color: C.navy, align: "left", valign: "middle", margin: 0,
  });
  s4.addText("Other dimensions matter too \u2014 see right panel", {
    x: M, y: 0.72, w: SW-2*M, h: 0.28,
    fontSize: 12, italic: true, fontFace: "Calibri", color: C.tan, align: "left", valign: "middle", margin: 0,
  });

  // Smaller matrix on the left
  const matX=1.5, matY=1.5, matW=6.5, matH=4.8;
  const halfW=matW/2, halfH=matH/2;
  const midX=matX+halfW, midY4=matY+halfH;

  // Quadrant tints
  s4.addShape(pres.shapes.RECTANGLE, { x:matX, y:matY, w:halfW, h:halfH, fill:{color:"E8F5F1"} });
  s4.addShape(pres.shapes.RECTANGLE, { x:midX, y:matY, w:halfW, h:halfH, fill:{color:"E6EAFF"} });
  s4.addShape(pres.shapes.RECTANGLE, { x:matX, y:midY4, w:halfW, h:halfH, fill:{color:"F5F0E8"} });
  s4.addShape(pres.shapes.RECTANGLE, { x:midX, y:midY4, w:halfW, h:halfH, fill:{color:"FDE8E2"} });

  // Axes
  thinRect(s4, matX, midY4-0.015, matW, 0.03, C.navy);
  thinRect(s4, midX-0.015, matY, 0.03, matH, C.navy);

  // Arrowheads
  s4.addText("\u25B2", { x:midX-0.12, y:matY-0.22, w:0.24, h:0.24, fontSize:12, fontFace:"Calibri", color:C.navy, align:"center", valign:"middle", margin:0 });
  s4.addText("\u25BC", { x:midX-0.12, y:matY+matH-0.02, w:0.24, h:0.24, fontSize:12, fontFace:"Calibri", color:C.navy, align:"center", valign:"middle", margin:0 });
  s4.addText("\u25C0", { x:matX-0.22, y:midY4-0.12, w:0.24, h:0.24, fontSize:12, fontFace:"Calibri", color:C.navy, align:"center", valign:"middle", margin:0 });
  s4.addText("\u25B6", { x:matX+matW-0.02, y:midY4-0.12, w:0.24, h:0.24, fontSize:12, fontFace:"Calibri", color:C.navy, align:"center", valign:"middle", margin:0 });

  // Axis labels
  s4.addText("High Safety", { x:matX-1.3, y:matY+0.2, w:1.2, h:0.4, fontSize:14, bold:true, fontFace:"Calibri", color:C.teal, align:"right", valign:"middle", margin:0 });
  s4.addText("Low Safety", { x:matX-1.3, y:matY+matH-0.6, w:1.2, h:0.4, fontSize:14, bold:true, fontFace:"Calibri", color:C.orange, align:"right", valign:"middle", margin:0 });
  s4.addText("Oracle", { x:matX+0.2, y:matY+matH+0.1, w:1.5, h:0.35, fontSize:14, bold:true, fontFace:"Calibri", color:C.navy, align:"left", valign:"middle", margin:0 });
  s4.addText("Agentic", { x:matX+matW-1.7, y:matY+matH+0.1, w:1.5, h:0.35, fontSize:14, bold:true, fontFace:"Calibri", color:C.navy, align:"right", valign:"middle", margin:0 });

  // Model boxes
  function mBox(sl, x, y, name, sub, fc) {
    const bw=1.8, bh=0.5;
    sl.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w:bw, h:bh, fill:{color:fc}, rectRadius:0.08, shadow:makeShadow() });
    sl.addText([
      { text: name, options: { fontSize:13, bold:true, color:C.white, fontFace:"Calibri", breakLine:true } },
      { text: sub, options: { fontSize:10, italic:true, color:C.white, fontFace:"Calibri" } },
    ], { x, y, w:bw, h:bh, align:"center", valign:"middle", margin:0 });
  }
  // Top-left (High Safety + Oracle): Claude Opus, ChatGPT, Gemini
  mBox(s4, matX+0.5, matY+0.2, "Claude Opus", "Deep reasoning", C.teal);
  mBox(s4, matX+0.5, matY+0.85, "ChatGPT", "General purpose", C.tan);
  mBox(s4, matX+0.5, matY+1.5, "Gemini", "Search-integrated", C.tan);
  // Top-right (High Safety + Agentic): Claude Sonnet, ChatGPT Codex
  mBox(s4, midX+0.7, matY+0.2, "Claude Sonnet", "Fast agentic", C.periwinkle);
  mBox(s4, midX+0.7, matY+0.85, "ChatGPT Codex", "Code-focused agentic", C.navy);
  // Bottom-left (Low Safety + Oracle): Grok
  mBox(s4, matX+0.5, midY4+0.5, "Grok", "Unfiltered", C.orange);

  // "Other differences" box on the right
  const odX = matX + matW + 0.5;
  const odW = SW - M - odX;
  const odY = matY;
  const odH = matH;
  s4.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:odX, y:odY, w:odW, h:odH, fill:{color:C.white}, rectRadius:0.12, line:{color:C.gray,width:0.75} });
  s4.addText("Other Differences", { x:odX+0.2, y:odY+0.15, w:odW-0.4, h:0.4, fontSize:16, bold:true, fontFace:"Calibri", color:C.navy, align:"left", valign:"middle", margin:0 });
  thinRect(s4, odX+0.2, odY+0.6, odW-0.4, 0.01, C.gray);

  // ChatGPT section
  s4.addText("ChatGPT", { x:odX+0.2, y:odY+0.7, w:odW-0.4, h:0.3, fontSize:14, bold:true, fontFace:"Calibri", color:C.tan, align:"left", valign:"middle", margin:0 });
  s4.addText("\u2022 More pedantic + good in many languages\n\u2022 More clear recommendations (less safe) on legal matters\n\u2022 Strong at structured, step-by-step tasks", {
    x:odX+0.2, y:odY+1.0, w:odW-0.4, h:1.2,
    fontSize:12, fontFace:"Calibri", color:C.black, align:"left", valign:"top", margin:0,
  });

  thinRect(s4, odX+0.2, odY+2.3, odW-0.4, 0.01, C.gray);

  // Claude section
  s4.addText("Claude", { x:odX+0.2, y:odY+2.4, w:odW-0.4, h:0.3, fontSize:14, bold:true, fontFace:"Calibri", color:C.teal, align:"left", valign:"middle", margin:0 });
  s4.addText("\u2022 More corporate-rounded and very safe in output\n\u2022 Extremely good analytical capability\n\u2022 Better at nuanced, ambiguous problems", {
    x:odX+0.2, y:odY+2.7, w:odW-0.4, h:1.2,
    fontSize:12, fontFace:"Calibri", color:C.black, align:"left", valign:"top", margin:0,
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // SLIDE 5: My Setup — skills inside lane panels, not agent boxes
  // ═══════════════════════════════════════════════════════════════════════════
  const s5 = pres.addSlide(); s5.background = { color: C.cream };
  s5.addText("My Setup", { x:M, y:0.1, w:SW-2*M, h:0.5, fontSize:36, fontFace:"Calibri Light", color:C.navy, align:"left", valign:"middle", margin:0 });

  // Agent box helper (simple, no skills inside)
  const boxH5 = 0.75;
  function drawBox5(sl, x, y, w, label, model, role, fc) {
    const isLight = fc === C.tan;
    const tc = isLight ? C.navy : C.white;
    sl.addShape(pres.shapes.RECTANGLE, { x, y, w, h:boxH5, fill:{color:fc} });
    sl.addText([
      { text: label, options: { fontSize:12, bold:true, color:tc, fontFace:"Calibri", breakLine:true } },
      { text: model, options: { fontSize:10, color:tc, fontFace:"Calibri", breakLine:true } },
      { text: role, options: { fontSize:9, italic:true, color:tc, fontFace:"Calibri" } },
    ], { x, y, w, h:boxH5, align:"center", valign:"middle", margin:0 });
  }

  // Lane layout
  const lTop = 0.7, lGap = 0.2;
  const lW = (SW-2*M-lGap)/2;
  const bizX = M, devX = M+lW+lGap;
  const lH = 6.3;

  // Lane backgrounds
  s5.addShape(pres.shapes.RECTANGLE, { x:bizX, y:lTop, w:lW, h:lH, fill:{color:"F9F7F4"}, line:{color:C.gray,width:0.75} });
  s5.addShape(pres.shapes.RECTANGLE, { x:devX, y:lTop, w:lW, h:lH, fill:{color:"F9F7F4"}, line:{color:C.gray,width:0.75} });
  s5.addText("Business", { x:bizX, y:lTop+0.03, w:lW, h:0.3, fontSize:15, bold:true, fontFace:"Calibri", color:C.teal, align:"center", valign:"middle", margin:0 });
  s5.addText("Development", { x:devX, y:lTop+0.03, w:lW, h:0.3, fontSize:15, bold:true, fontFace:"Calibri", color:C.teal, align:"center", valign:"middle", margin:0 });

  // ─── BUSINESS LANE: agents ────────────────────────────────────────────────
  const bxW = 1.85, bxGap = 0.08;
  const bRow1Y = lTop + 0.5;
  const bTotW = 3*bxW + 2*bxGap;
  const bStartX = bizX + (lW-bTotW)/2;
  const b1X=bStartX, b2X=bStartX+bxW+bxGap, b3X=bStartX+2*(bxW+bxGap);

  drawBox5(s5, b1X, bRow1Y, bxW, "Business Consultant", "Claude Opus", "PRIMARY", C.teal);
  drawBox5(s5, b2X, bRow1Y, bxW, "Business Brainstorm", "Claude Opus", "PRIMARY", C.teal);
  drawBox5(s5, b3X, bRow1Y, bxW, "LinkedIn Support", "Claude Opus", "PRIMARY", C.teal);

  const bRow2Y = bRow1Y + boxH5 + 0.35;
  drawBox5(s5, b1X, bRow2Y, bxW, "Business Reviewer", "ChatGPT 5.4", "SUBAGENT (read-only)", C.tan);
  vLine(s5, b1X+bxW/2, bRow1Y+boxH5, bRow2Y);

  // ─── BUSINESS LANE: skills section ────────────────────────────────────────
  const bSkillY = bRow2Y + boxH5 + 0.25;
  thinRect(s5, bizX+0.15, bSkillY, lW-0.3, 0.01, C.gray);
  s5.addText("Available Skills", { x:bizX+0.15, y:bSkillY+0.05, w:lW-0.3, h:0.25, fontSize:12, bold:true, fontFace:"Calibri", color:C.navy, align:"left", valign:"middle", margin:0 });

  // Skill pill helper
  function drawPill(sl, x, y, label, fc) {
    const pw = Math.max(label.length*0.075+0.2, 0.55);
    sl.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w:pw, h:0.22, fill:{color:fc}, rectRadius:0.05 });
    sl.addText(label, { x, y, w:pw, h:0.22, fontSize:9, bold:true, fontFace:"Calibri", color:C.white, align:"center", valign:"middle", margin:0 });
    return pw;
  }

  // All agents share these
  let bpY = bSkillY + 0.35;
  s5.addText("All agents:", { x:bizX+0.15, y:bpY, w:1.5, h:0.22, fontSize:12, italic:true, fontFace:"Calibri", color:C.gray, align:"left", valign:"middle", margin:0 });
  bpY += 0.25;
  let bpX = bizX + 0.15;
  ["docx","pptx","pptx-numa","xlsx","pdf","brainstorming","proofreader","nano-banana"].forEach(sk => {
    const pw = Math.max(sk.length*0.075+0.2, 0.55);
    if (bpX + pw > bizX+lW-0.15) { bpX = bizX+0.15; bpY += 0.28; }
    drawPill(s5, bpX, bpY, sk, C.teal);
    bpX += pw + 0.06;
  });

  // Dashed divider
  bpY += 0.35;
  dashedHLine(s5, bizX+0.15, bizX+lW-0.15, bpY, C.gray);

  // LinkedIn Support specific
  bpY += 0.1;
  s5.addText("LinkedIn Support only:", { x:bizX+0.15, y:bpY, w:2.5, h:0.22, fontSize:12, italic:true, fontFace:"Calibri", color:C.gray, align:"left", valign:"middle", margin:0 });
  bpY += 0.25;
  bpX = bizX + 0.15;
  ["linkedin-cli","linkedin-content","social-media-carousel"].forEach(sk => {
    const pw = drawPill(s5, bpX, bpY, sk, C.orange);
    bpX += pw + 0.06;
    if (bpX > bizX+lW-0.5) { bpX = bizX+0.15; bpY += 0.28; }
  });

  // ─── DEVELOPMENT LANE: agents ─────────────────────────────────────────────
  const dRow1Y = lTop + 0.5;
  const archW = 2.0;
  const archX5 = devX + (lW-archW)/2;
  drawBox5(s5, archX5, dRow1Y, archW, "Architect", "Claude Opus", "PRIMARY", C.teal);

  const dRow2Y = dRow1Y + boxH5 + 0.35;
  const dSubGap = 0.3;
  const dBxW = 2.2;
  const dPairW = 2*dBxW + dSubGap;
  const dPairX = devX + (lW-dPairW)/2;
  const repoX5 = dPairX, devX5 = dPairX+dBxW+dSubGap;

  drawBox5(s5, repoX5, dRow2Y, dBxW, "Repo Scout", "Claude Sonnet", "SUBAGENT", C.periwinkle);
  drawBox5(s5, devX5, dRow2Y, dBxW, "Developer", "Claude Sonnet", "SUBAGENT", C.periwinkle);

  // Architect → Repo Scout + Developer
  const archCX5 = archX5+archW/2, repoCX5 = repoX5+dBxW/2, devCX5 = devX5+dBxW/2;
  const aBarY = dRow1Y+boxH5+(dRow2Y-dRow1Y-boxH5)/2;
  vLine(s5, archCX5, dRow1Y+boxH5, aBarY);
  hLine(s5, repoCX5, devCX5, aBarY);
  vLine(s5, repoCX5, aBarY, dRow2Y);
  vLine(s5, devCX5, aBarY, dRow2Y);

  // Code Reviewers
  const dRow3Y = dRow2Y + boxH5 + 0.35;
  const crW5 = 2.0, crGap5 = 0.2;
  const crPW = 2*crW5+crGap5;
  const crSX = devX + (lW-crPW)/2;
  const cr1X5 = crSX, cr2X5 = crSX+crW5+crGap5;

  drawBox5(s5, cr1X5, dRow3Y, crW5, "Code Reviewer", "GPT Codex", "SUBAGENT (read-only)", C.tan);
  drawBox5(s5, cr2X5, dRow3Y, crW5, "Code Reviewer 2", "Claude Opus", "SUBAGENT (read-only)", C.tan);

  const cr1CX5=cr1X5+crW5/2, cr2CX5=cr2X5+crW5/2;
  const dBarY = dRow2Y+boxH5+(dRow3Y-dRow2Y-boxH5)/2;
  vLine(s5, devCX5, dRow2Y+boxH5, dBarY);
  hLine(s5, cr1CX5, cr2CX5, dBarY);
  vLine(s5, cr1CX5, dBarY, dRow3Y);
  vLine(s5, cr2CX5, dBarY, dRow3Y);

  // ─── DEVELOPMENT LANE: skills section ─────────────────────────────────────
  const dSkillY = dRow3Y + boxH5 + 0.25;
  thinRect(s5, devX+0.15, dSkillY, lW-0.3, 0.01, C.gray);
  s5.addText("Available Skills", { x:devX+0.15, y:dSkillY+0.05, w:lW-0.3, h:0.25, fontSize:12, bold:true, fontFace:"Calibri", color:C.navy, align:"left", valign:"middle", margin:0 });

  let dpY = dSkillY + 0.35;
  s5.addText("All agents:", { x:devX+0.15, y:dpY, w:1.5, h:0.22, fontSize:12, italic:true, fontFace:"Calibri", color:C.gray, align:"left", valign:"middle", margin:0 });
  dpY += 0.25;
  let dpX = devX + 0.15;
  ["docx","pptx","pptx-numa","xlsx","pdf","frontend-design","skill-creator"].forEach(sk => {
    const pw = drawPill(s5, dpX, dpY, sk, C.periwinkle);
    dpX += pw + 0.06;
    if (dpX > devX+lW-0.5) { dpX = devX+0.15; dpY += 0.28; }
  });

  dpY += 0.35;
  dashedHLine(s5, devX+0.15, devX+lW-0.15, dpY, C.gray);

  dpY += 0.1;
  s5.addText("Developer only:", { x:devX+0.15, y:dpY, w:2.0, h:0.22, fontSize:12, italic:true, fontFace:"Calibri", color:C.gray, align:"left", valign:"middle", margin:0 });
  dpY += 0.25;
  dpX = devX + 0.15;
  ["replit-plan","replit-prd","replit-prompt"].forEach(sk => {
    const pw = drawPill(s5, dpX, dpY, sk, C.navy);
    dpX += pw + 0.06;
  });

  // ─── WRITE ────────────────────────────────────────────────────────────────
  const out = "/home/ask/sync/projects/dev/numa-ai-pres/ai-setup-numa.pptx";
  await pres.writeFile({ fileName: out });
  console.log("\u2713 Saved:", out);
}

build().catch(e => { console.error("FAIL:", e); process.exit(1); });
