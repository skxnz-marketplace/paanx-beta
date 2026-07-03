import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { setTimeout as wait } from "node:timers/promises";

const productFile = "src/data/products.ts";
const today = "2026-07-04";
const maxProducts = Number(process.env.PAANX_IMAGE_LIMIT || "0");
const overwriteExisting = process.env.PAANX_OVERWRITE_IMAGES === "1";

const folderByCategory = {
  "cold-drinks": "beverages",
  "water-soda": "beverages",
  chips: "chips-snacks",
  namkeen: "chips-snacks",
  biscuits: "biscuits-chocolates",
  chocolates: "biscuits-chocolates",
  "mints-gum": "mints-gum",
  "mouth-fresheners": "mouth-fresheners",
  "mints-gum": "mints-gum",
  "paan-ingredients": "paan-ingredients",
  "supari-saunf": "paan-ingredients",
  "pan-masala": "pan-masala",
  cigarettes: "cigarettes",
  "khaini-zarda": "khaini-zarda",
  "hookah-flavours": "hookah-accessories",
  "lighters-accessories": "accessories",
};

const bannedImageHosts = [
  "facebook.com",
  "instagram.com",
  "pinterest.",
  "youtube.com",
  "ytimg.com",
  "svgshare.com",
];

function getField(line, field) {
  const match = line.match(new RegExp(`${field}: "([^"]*)"`));
  return match?.[1] ?? "";
}

function setField(line, field, value) {
  const escaped = value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  if (line.includes(`${field}: "`)) {
    return line.replace(new RegExp(`${field}: "[^"]*"`), `${field}: "${escaped}"`);
  }
  if (field === "lastChecked" && line.includes("lastChecked: D")) {
    return line.replace(/lastChecked: D/, `lastChecked: "${escaped}"`);
  }
  return line.replace(/, isRestricted:/, `, ${field}: "${escaped}", isRestricted:`);
}

function removeImageNeeded(line) {
  return line
    .replace(/, "image_needed"/g, "")
    .replace(/"image_needed", /g, "")
    .replace(/"image_needed"/g, "");
}

function fileExt(contentType, url) {
  const cleanUrl = url.split("?")[0].toLowerCase();
  if (contentType.includes("png") || cleanUrl.endsWith(".png")) return ".png";
  if (contentType.includes("webp") || cleanUrl.endsWith(".webp")) return ".webp";
  return ".jpg";
}

function localBase(product) {
  const folder = folderByCategory[product.category] ?? "accessories";
  return `/products/${folder}/${product.slug}`;
}

function searchQuery(product) {
  const pack = product.packSize
    .replace(/\([^)]*\)/g, " ")
    .replace(/\bstandard\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  return `${product.name} ${pack} ${product.brand} product`
    .replace(/[()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseProducts(lines) {
  return lines
    .map((line, index) => ({ line, index }))
    .filter(({ line }) => /^  \{ id:/.test(line))
    .map(({ line, index }) => ({
      index,
      id: getField(line, "id"),
      slug: getField(line, "slug"),
      name: getField(line, "name"),
      brand: getField(line, "brand"),
      category: getField(line, "category"),
      packSize: getField(line, "packSize"),
      image: getField(line, "image"),
      sourceUrl: getField(line, "sourceUrl"),
      sourceName: getField(line, "sourceName"),
    }));
}

function fetchText(url) {
  return execFileSync(
    "curl.exe",
    [
      "--ssl-no-revoke",
      "-L",
      "--max-time",
      "25",
      "-A",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126 Safari/537.36",
      url,
    ],
    { encoding: "utf8", maxBuffer: 20 * 1024 * 1024 },
  );
}

function decodeHtml(value) {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\\\//g, "/");
}

function hostName(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "Image source";
  }
}

function bingImageCandidates(query) {
  const url = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}&form=HDRSC2&first=1`;
  const html = fetchText(url);
  const candidates = [];

  for (const match of html.matchAll(/m="({&quot;.*?})"/g)) {
    try {
      const data = JSON.parse(decodeHtml(match[1]));
      if (data.murl) {
        candidates.push({
          imageUrl: data.murl,
          pageUrl: data.purl || data.cturl || "",
          title: data.t || "",
          desc: data.desc || "",
        });
      }
    } catch {
      // Keep scanning; Bing sometimes emits partial result metadata.
    }
  }

  for (const match of html.matchAll(/murl&quot;:&quot;(.*?)&quot;/g)) {
    candidates.push({ imageUrl: decodeHtml(match[1]), pageUrl: "", title: "", desc: "" });
  }
  for (const match of html.matchAll(/"murl":"(.*?)"/g)) {
    candidates.push({ imageUrl: decodeHtml(match[1]), pageUrl: "", title: "", desc: "" });
  }

  const seen = new Set();
  return candidates
    .filter((candidate) => {
      if (!/^https?:\/\//i.test(candidate.imageUrl)) return false;
      if (seen.has(candidate.imageUrl)) return false;
      seen.add(candidate.imageUrl);
      const haystack = `${candidate.imageUrl} ${candidate.pageUrl}`.toLowerCase();
      return !bannedImageHosts.some((host) => haystack.includes(host));
    })
    .slice(0, 20);
}

function wordsFor(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function looksRelevant(candidate, product) {
  const haystack = decodeURIComponent(
    `${candidate.title} ${candidate.desc} ${candidate.pageUrl} ${candidate.imageUrl}`,
  ).toLowerCase();
  const hayWords = new Set(wordsFor(haystack));
  const badTerms = [
    "plant",
    "sapling",
    "garden",
    "field",
    "stadium",
    "jersey",
    "wallpaper",
    "logo",
    "poster",
    "clipart",
    "nutrition",
    "chart",
  ];
  if (badTerms.some((term) => haystack.includes(term))) return false;

  const brandWords = wordsFor(product.brand.replace(/\s*\([^)]*\)/g, ""));
  const nameWords = wordsFor(product.name).filter(
    (word) =>
      ![
        "soft",
        "drink",
        "can",
        "pet",
        "original",
        "classic",
        "standard",
        "pouch",
        "pack",
        "pc",
      ].includes(word),
  );
  const slugWords = product.slug.split("-").filter((word) => word.length > 2);
  const packWords = wordsFor(product.packSize).filter((word) => /\d/.test(word));

  const brandHits = brandWords.filter((word) => hayWords.has(word)).length;
  const nameHits = nameWords.filter((word) => hayWords.has(word)).length;
  const slugHits = slugWords.filter((word) => hayWords.has(word)).length;
  const packHits = packWords.filter((word) => haystack.includes(word)).length;

  const isGenericAccessory = ["cricket", "classic", "original"].includes(product.brand.toLowerCase());
  if (isGenericAccessory && !haystack.includes("lighter")) return false;

  const hasBrand = brandHits > 0 || product.brand.toLowerCase() === "7up" && haystack.includes("7up");
  const hasProductTerm = nameHits > 0 || slugHits >= 2;
  const score = brandHits * 3 + nameHits * 3 + Math.min(slugHits, 4) + packHits;
  return hasBrand && hasProductTerm && score >= 5;
}

async function downloadCandidate(url, localBasePath) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 16000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126 Safari/537.36",
        Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      },
    });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("image")) throw new Error(`not image: ${contentType}`);
    const bytes = Buffer.from(await res.arrayBuffer());
    if (bytes.length < 2500) throw new Error("image too small");
    const ext = fileExt(contentType, url);
    const localPath = `${localBasePath}${ext}`;
    const output = path.join("public", localPath.replace(/^\//, ""));
    fs.mkdirSync(path.dirname(output), { recursive: true });
    fs.writeFileSync(output, bytes);
    return { localPath, bytes: bytes.length, contentType };
  } finally {
    clearTimeout(timer);
  }
}

const lines = fs.readFileSync(productFile, "utf8").split(/\r?\n/);
const products = parseProducts(lines);
const targetProducts = products
  .filter((product) => overwriteExisting || !product.image)
  .slice(0, maxProducts > 0 ? maxProducts : undefined);
const results = [];

for (const [idx, product] of targetProducts.entries()) {
  const query = searchQuery(product);
  console.log(`[${idx + 1}/${targetProducts.length}] ${product.slug}`);
  try {
    const candidates = bingImageCandidates(query);
    let downloaded = null;
    let sourceImageUrl = "";
    let lastError = "";

    for (const candidate of candidates) {
      if (!looksRelevant(candidate, product)) continue;
      try {
        downloaded = await downloadCandidate(candidate.imageUrl, localBase(product));
        sourceImageUrl = candidate.pageUrl || candidate.imageUrl;
        break;
      } catch (error) {
        lastError = error.message;
      }
    }

    if (!downloaded) {
      results.push({
        slug: product.slug,
        status: "image_not_found",
        query,
        notes: lastError || "No usable candidates",
      });
      continue;
    }

    let line = lines[product.index];
    line = setField(line, "image", downloaded.localPath);
    line = setField(line, "sourceUrl", sourceImageUrl);
    line = setField(line, "sourceName", hostName(sourceImageUrl));
    line = setField(line, "lastChecked", today);
    line = removeImageNeeded(line);
    lines[product.index] = line;

    results.push({
      slug: product.slug,
      status: "image_downloaded",
      image: downloaded.localPath,
      bytes: downloaded.bytes,
      contentType: downloaded.contentType,
      sourceUrl: sourceImageUrl,
      query,
    });
  } catch (error) {
    results.push({
      slug: product.slug,
      status: "search_failed",
      query,
      notes: error.message,
    });
  }

  await wait(250);
}

fs.writeFileSync(productFile, `${lines.join("\n").replace(/\s+$/, "")}\n`);
fs.writeFileSync(
  "research/paanx-batch-image-fill-results.json",
  JSON.stringify(results, null, 2),
);

const downloaded = results.filter((result) => result.status === "image_downloaded").length;
console.log(
  JSON.stringify(
    {
      attempted: targetProducts.length,
      downloaded,
      unresolved: targetProducts.length - downloaded,
      totalImageBacked: parseProducts(lines).filter((product) => product.image).length,
    },
    null,
    2,
  ),
);
