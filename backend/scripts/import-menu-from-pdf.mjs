#!/usr/bin/env node
/**
 * import-menu-from-pdf.mjs
 *
 * Trimite un PDF cu meniu la un model AI și îl importă în bar.
 *
 * USAGE:
 *   # Cu Claude (recomandat, free tier generos):
 *   node scripts/import-menu-from-pdf.mjs \
 *     --pdf ./menu.pdf --slug central-pub \
 *     --username admin --password parola \
 *     --provider claude --ai-key sk-ant-...
 *
 *   # Cu Gemini (necesită billing activat):
 *   node scripts/import-menu-from-pdf.mjs \
 *     --pdf ./menu.pdf --slug central-pub \
 *     --username admin --password parola \
 *     --provider gemini --ai-key AIza...
 */

import fs from "fs";
import path from "path";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

// ─── Parse argumente CLI ──────────────────────────────────────────────────────
const args = process.argv.slice(2);
const get = (flag) => {
  const idx = args.indexOf(flag);
  return idx !== -1 ? args[idx + 1] : null;
};

const PDF_PATH = get("--pdf");
const SLUG     = get("--slug");
const USERNAME = get("--username");
const PASSWORD = get("--password");
const API_URL  = get("--api-url") || process.env.BAR_API_URL || "http://localhost:3001";
const PROVIDER = (get("--provider") || "claude").toLowerCase();
const AI_KEY   = get("--ai-key")
  || (PROVIDER === "gemini"  ? process.env.GEMINI_API_KEY
    : PROVIDER === "claude"  ? process.env.ANTHROPIC_API_KEY
    : PROVIDER === "openai"  ? process.env.OPENAI_API_KEY
    :                          process.env.GROQ_API_KEY);

if (!PDF_PATH || !SLUG || !USERNAME || !PASSWORD) {
  console.error(`
❌ Argumente lipsă. Folosire:

  node scripts/import-menu-from-pdf.mjs \\
    --pdf ./menu.pdf \\
    --slug central-pub \\
    --username admin \\
    --password parola \\
    --provider groq          ← GRATUIT, recomandat
    --ai-key gsk_...

  Provideri disponibili:
    groq    → groq.com (gratuit, fără card)
    openai  → platform.openai.com (ieftin, ~0.01$)
    claude  → console.anthropic.com (5$ credit)
    gemini  → aistudio.google.com (necesită billing)
`);
  process.exit(1);
}

if (!AI_KEY) {
  console.error(`❌ Lipsă API key pentru provider "${PROVIDER}".
  Pasează --ai-key <key> sau setează GROQ_API_KEY / OPENAI_API_KEY / ANTHROPIC_API_KEY / GEMINI_API_KEY.`);
  process.exit(1);
}

if (!fs.existsSync(PDF_PATH)) {
  console.error(`❌ Fișierul PDF nu există: ${PDF_PATH}`);
  process.exit(1);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const delay = (ms) => new Promise((r) => setTimeout(r, ms));
const log   = (emoji, msg) => console.log(`${emoji}  ${msg}`);

const PROMPT = `
Ești un expert în extragerea structurată de date din meniuri de bar/restaurant.

Din documentul de mai jos extrage TOATE categoriile și produsele din meniu.

Returnează DOAR un JSON valid (fără markdown, fără text extra) în formatul exact:
{
  "categories": [
    {
      "name": "Cafea",
      "products": [
        { "name": "Espresso", "price": 8.5, "description": "200ml, shot dublu" }
      ]
    }
  ]
}

Reguli:
- "name" categorie: exact ca în meniu (ex: "Cafea", "Băuturi Alcoolice", "Cocktailuri")
- "name" produs: numele exact
- "price": număr zecimal în RON fără simbol (ex: 12.50). Dacă lipsește, pune null
- "description": dimensiune/ingrediente dacă există, altfel ""
- Variante (mic/mare) → produse separate
- Nu inventa produse care nu există
- Păstrează diacriticele românești
`;

// ─── Extract text from PDF (for text-based providers) ────────────────────────
async function extractPDFText(pdfPath) {
  const pdfParse = require("pdf-parse");
  const buf = fs.readFileSync(pdfPath);
  const data = await pdfParse(buf);
  return data.text;
}

// ─── Provider: Groq (GRATUIT) ─────────────────────────────────────────────────
async function extractWithGroq(pdfText) {
  log("🤖", "Trimit textul la Groq (llama-3.3-70b) — gratuit...");
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${AI_KEY}` },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      temperature: 0.1,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "Ești un expert în extragerea de date structurate din meniuri. Returnezi DOAR JSON valid." },
        { role: "user", content: `${PROMPT}\n\n--- TEXTUL MENIULUI ---\n${pdfText}` },
      ],
    }),
  });
  if (!res.ok) { const e = await res.text(); throw new Error(`Groq error ${res.status}: ${e}`); }
  const d = await res.json();
  return d.choices?.[0]?.message?.content;
}

// ─── Provider: OpenAI ────────────────────────────────────────────────────────
async function extractWithOpenAI(pdfText) {
  log("🤖", "Trimit textul la OpenAI gpt-4o-mini...");
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${AI_KEY}` },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.1,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "Ești un expert în extragerea de date structurate din meniuri. Returnezi DOAR JSON valid." },
        { role: "user", content: `${PROMPT}\n\n--- TEXTUL MENIULUI ---\n${pdfText}` },
      ],
    }),
  });
  if (!res.ok) { const e = await res.text(); throw new Error(`OpenAI error ${res.status}: ${e}`); }
  const d = await res.json();
  return d.choices?.[0]?.message?.content;
}

// ─── Provider: Claude ─────────────────────────────────────────────────────────
async function extractWithClaude(base64PDF) {
  log("🤖", "Trimit PDF-ul la Claude 3.5 Haiku...");
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": AI_KEY,
      "anthropic-version": "2023-06-01",
      "anthropic-beta": "pdfs-2024-09-25",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5",
      max_tokens: 8192,
      messages: [{ role: "user", content: [
        { type: "document", source: { type: "base64", media_type: "application/pdf", data: base64PDF } },
        { type: "text", text: PROMPT },
      ]}],
    }),
  });
  if (!res.ok) { const e = await res.text(); throw new Error(`Claude error ${res.status}: ${e}`); }
  const d = await res.json();
  return d.content?.[0]?.text;
}

// ─── Provider: Gemini ─────────────────────────────────────────────────────────
async function extractWithGemini(base64PDF) {
  log("🤖", "Trimit PDF-ul la Gemini 2.0 Flash...");
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${AI_KEY}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ inlineData: { mimeType: "application/pdf", data: base64PDF } }, { text: PROMPT }] }],
      generationConfig: { temperature: 0.1, responseMimeType: "application/json" },
    }),
  });
  if (!res.ok) { const e = await res.text(); throw new Error(`Gemini error ${res.status}: ${e}`); }
  const d = await res.json();
  return d.candidates?.[0]?.content?.parts?.[0]?.text;
}

// ─── Extracție + parsing ──────────────────────────────────────────────────────
async function extractMenuFromPDF(pdfPath) {
  log("📄", `Citesc PDF-ul: ${path.resolve(pdfPath)}`);
  const pdfBytes = fs.readFileSync(pdfPath);
  log("📊", `Mărime PDF: ${(pdfBytes.length / 1024 / 1024).toFixed(2)} MB`);

  let rawText;
  if (PROVIDER === "groq" || PROVIDER === "openai") {
    // Extragem textul din PDF cu pdf-parse (nu necesită suport nativ PDF în API)
    log("📝", "Extrag textul din PDF...");
    const pdfText = await extractPDFText(pdfPath);
    if (!pdfText.trim()) throw new Error("PDF-ul nu conține text selectabil (e probabil o imagine scanată). Folosește --provider claude sau --provider gemini.");
    log("✅", `Text extras: ${pdfText.length} caractere`);
    rawText = PROVIDER === "openai" ? await extractWithOpenAI(pdfText) : await extractWithGroq(pdfText);
  } else {
    const base64PDF = pdfBytes.toString("base64");
    rawText = PROVIDER === "gemini" ? await extractWithGemini(base64PDF) : await extractWithClaude(base64PDF);
  }

  if (!rawText) throw new Error("Modelul AI nu a returnat niciun răspuns");

  const cleaned = rawText.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
  let menu;
  try { menu = JSON.parse(cleaned); }
  catch { throw new Error(`JSON invalid returnat de AI:\n${cleaned.slice(0, 400)}`); }

  if (!Array.isArray(menu.categories)) throw new Error('Răspuns invalid: lipsă câmp "categories"');

  log("✅", `AI a identificat ${menu.categories.length} categorii`);
  let total = 0;
  for (const cat of menu.categories) {
    const n = cat.products?.length || 0; total += n;
    log("  📂", `${cat.name} — ${n} produse`);
  }
  log("📦", `Total: ${total} produse extrase`);
  return menu;
}


// ─── Step 2: Autentificare ────────────────────────────────────────────────────
async function login() {
  log("🔐", `Autentificare ca "${USERNAME}" pe ${API_URL}...`);

  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: USERNAME, password: PASSWORD }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Login eșuat: ${err.error || res.statusText}`);
  }

  const data = await res.json();
  if (!data.token) throw new Error("Nu am primit token de la server");

  log("✅", "Autentificat cu succes");
  return data.token;
}

// ─── Step 3: Obține bar_id după slug ─────────────────────────────────────────
async function getBarId() {
  log("🔍", `Caut barul cu slug "${SLUG}"...`);

  const res = await fetch(`${API_URL}/menu-complete/${SLUG}`);
  if (!res.ok) {
    if (res.status === 404) throw new Error(`Barul cu slug "${SLUG}" nu există`);
    throw new Error(`Eroare API: ${res.statusText}`);
  }

  const data = await res.json();
  if (!data.id) throw new Error("Bar ID lipsă din răspuns");

  log("✅", `Bar găsit: "${data.name}" (ID: ${data.id})`);
  return data.id;
}

// ─── Step 4: Import categorie + produse ──────────────────────────────────────
async function importMenu(menu, barId, token) {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  let createdCats = 0;
  let createdProds = 0;
  let failedProds = 0;

  log("🚀", "Încep importul în baza de date...\n");

  for (const cat of menu.categories) {
    if (!cat.name?.trim()) {
      log("⚠️", "Categorie fără nume, o sar");
      continue;
    }

    // Creăm categoria
    const catRes = await fetch(`${API_URL}/categories`, {
      method: "POST",
      headers,
      body: JSON.stringify({ bar_id: barId, name: cat.name.trim() }),
    });

    if (!catRes.ok) {
      const err = await catRes.json().catch(() => ({}));
      log("❌", `Nu am putut crea categoria "${cat.name}": ${err.error || catRes.statusText}`);
      continue;
    }

    const newCat = await catRes.json();
    const categoryId = newCat.id;
    createdCats++;
    log("📂", `Creată categoria: "${cat.name}" (ID: ${categoryId})`);

    // Creăm produsele din categorie
    for (const prod of cat.products || []) {
      if (!prod.name?.trim()) continue;
      if (prod.price === null || prod.price === undefined) {
        log("  ⚠️", `  "${prod.name}" — preț lipsă, pus 0`);
        prod.price = 0;
      }

      const prodRes = await fetch(`${API_URL}/dashboard/products`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          category_id: categoryId,
          name: prod.name.trim(),
          price: Number(prod.price) || 0,
          description: prod.description?.trim() || "",
        }),
      });

      if (!prodRes.ok) {
        const err = await prodRes.json().catch(() => ({}));
        log("  ❌", `  "${prod.name}": ${err.error || prodRes.statusText}`);
        failedProds++;
      } else {
        log("  ✅", `  ${prod.name} — ${Number(prod.price).toFixed(2)} RON`);
        createdProds++;
      }

      // Pauză mică ca să nu hammeram API-ul
      await delay(50);
    }
    console.log("");
  }

  return { createdCats, createdProds, failedProds };
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log("\n🍺  Bar Manager — Import Meniu din PDF\n" + "─".repeat(45) + "\n");

  try {
    const menu  = await extractMenuFromPDF(PDF_PATH);
    console.log("");

    const token = await login();
    const barId = await getBarId();
    console.log("");

    const { createdCats, createdProds, failedProds } = await importMenu(menu, barId, token);

    console.log("─".repeat(45));
    log("🎉", `Import finalizat!`);
    log("📂", `Categorii create: ${createdCats}`);
    log("📦", `Produse create:   ${createdProds}`);
    if (failedProds > 0) {
      log("⚠️", `Produse eșuate:   ${failedProds}`);
    }
    console.log("");
  } catch (err) {
    console.error("\n❌ Eroare fatală:", err.message);
    process.exit(1);
  }
}

main();
