#!/usr/bin/env node

/**
 * Autonomous Gemini Pro Image Generation Bot for NESFIC-D-12
 * Connects to Google Chrome running with remote debugging on port 9222
 * using the authenticated Google Pro account (kalyanjit@gmail.com).
 *
 * Usage:
 *   node scripts/gemini_pro_image_bot.js
 *   node scripts/gemini_pro_image_bot.js --id=1
 *   node scripts/gemini_pro_image_bot.js --force
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const BASE_DIR = path.resolve(__dirname, '..');
const PROMPTS_FILE = path.join(BASE_DIR, 'scripts', 'image_prompts.json');
const ASSETS_DIR = path.join(BASE_DIR, 'assets', 'proposal_diagrams');
const PUBLIC_DIR = path.join(BASE_DIR, 'public', 'proposal_diagrams');

const args = process.argv.slice(2);
let port = 9222;
let filterId = null;
let forceOverwrite = false;

args.forEach(arg => {
  if (arg.startsWith('--port=')) {
    port = parseInt(arg.replace('--port=', '').trim(), 10);
  } else if (arg.startsWith('--id=')) {
    filterId = parseInt(arg.replace('--id=', '').trim(), 10);
  } else if (arg === '--force') {
    forceOverwrite = true;
  }
});

if (!fs.existsSync(PROMPTS_FILE)) {
  console.error(`❌ Error: Prompts file not found at ${PROMPTS_FILE}`);
  process.exit(1);
}

[ASSETS_DIR, PUBLIC_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const allPrompts = JSON.parse(fs.readFileSync(PROMPTS_FILE, 'utf8'));
const queue = allPrompts.filter(item => {
  if (filterId !== null && item.id !== filterId) return false;
  const targetPath = path.join(ASSETS_DIR, item.filename);
  if (fs.existsSync(targetPath) && !forceOverwrite) {
    const stats = fs.statSync(targetPath);
    if (stats.size > 200000) {
      return false;
    }
  }
  return true;
});

console.log('\n=============================================================');
console.log('🤖 GEMINI PRO 16:9 INFOGRAPHIC GENERATION BOT (CDP)');
console.log('=============================================================');
console.log(`🔌 Target Chrome Port      : ${port}`);
console.log(`👤 Target Google Account   : kalyanjit@gmail.com (Gemini Pro)`);
console.log(`📁 Target Assets Directory : ${ASSETS_DIR}`);
console.log(`📋 Total Prompts in Queue  : ${queue.length} of ${allPrompts.length}`);
if (filterId !== null) console.log(`🔍 Filter Prompt ID        : ID ${filterId}`);
console.log('=============================================================\n');

if (queue.length === 0) {
  console.log('✨ All images in queue already generated! Use --force to regenerate.\n');
  process.exit(0);
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  let browser;
  try {
    console.log(`⏳ Connecting to Chrome on http://127.0.0.1:${port}...`);
    browser = await puppeteer.connect({
      browserURL: `http://127.0.0.1:${port}`,
      defaultViewport: null
    });
    console.log(`✅ Connected successfully to Google Chrome!`);
  } catch (err) {
    console.error(`\n❌ Could not connect to Google Chrome on port ${port}.`);
    process.exit(1);
  }

  // Find or create Gemini tab
  const pages = await browser.pages();
  let geminiPage = pages.find(p => p.url().includes('gemini.google.com'));

  if (!geminiPage) {
    console.log(`🌐 Opening a new tab navigating to https://gemini.google.com/app...`);
    geminiPage = await browser.newPage();
    await geminiPage.goto('https://gemini.google.com/app', { waitUntil: 'networkidle2' });
  } else {
    console.log(`🌐 Found active Gemini tab: ${geminiPage.url()}`);
    await geminiPage.bringToFront();
  }

  // Verify chat interface
  console.log(`⏳ Verifying Gemini Pro chat interface...`);
  await geminiPage.waitForSelector('rich-textarea div[contenteditable="true"], div[contenteditable="true"]', { timeout: 30000 });

  let successCount = 0;
  let failureCount = 0;

  for (let i = 0; i < queue.length; i++) {
    const item = queue[i];
    const assetFile = path.join(ASSETS_DIR, item.filename);
    const publicFile = path.join(PUBLIC_DIR, item.filename);

    console.log(`\n-------------------------------------------------------------`);
    console.log(`[${i + 1}/${queue.length}] 🎨 Generating Diagram ${item.id}: ${item.title}`);
    console.log(`   📄 Output File : ${item.filename}`);
    console.log(`-------------------------------------------------------------`);

    let promptSent = false;
    let attempts = 0;

    while (attempts < 2 && !promptSent) {
      attempts++;
      try {
        console.log(`   🌐 Navigating to clean Gemini chat session...`);
        await geminiPage.goto('https://gemini.google.com/app', { waitUntil: 'networkidle2' });
        await sleep(2500);

        const inputSelector = 'rich-textarea div[contenteditable="true"], div[contenteditable="true"]';
        await geminiPage.waitForSelector(inputSelector, { timeout: 20000 });

        // Record existing images in DOM
        const existingImageUrls = await geminiPage.evaluate(() => {
          return Array.from(document.querySelectorAll('img')).map(img => img.src).filter(Boolean);
        });

        const promptFull = `Generate a high-quality 16:9 widescreen infographic image: ${item.prompt}`;

        // Focus and type into input
        const inputElem = await geminiPage.$(inputSelector);
        if (inputElem) {
          await inputElem.click();
          await sleep(500);

          await geminiPage.evaluate((sel, text) => {
            const el = document.querySelector(sel);
            if (el) {
              el.focus();
              el.innerText = text;
              el.dispatchEvent(new Event('input', { bubbles: true }));
            }
          }, inputSelector, promptFull);

          await sleep(1000);
        }

        // Click Send button
        const clicked = await geminiPage.evaluate(() => {
          const sendBtn = document.querySelector('button[aria-label="Send message"], button.send-button');
          if (sendBtn && !sendBtn.disabled) {
            sendBtn.click();
            return true;
          }
          return false;
        });

        if (!clicked) {
          console.log(`   ⌨️ Sending via Enter key...`);
          await geminiPage.keyboard.press('Enter');
        } else {
          console.log(`   🖱️ Clicked 'Send message' button.`);
        }

        console.log(`   📤 Prompt submitted to Gemini Pro. Waiting for Imagen 3 high-impact generation...`);
        promptSent = true;

        let imageBuffer = null;
        let waitAttempts = 0;

        while (!imageBuffer && waitAttempts < 45) {
          await sleep(3000);
          waitAttempts++;

          if (waitAttempts % 5 === 0) {
            process.stdout.write(`   ⏳ Generating... (${waitAttempts * 3}s elapsed)\n`);
          }

          // Check if new image appeared
          const newImageInfo = await geminiPage.evaluate((existingUrls) => {
            const allImages = Array.from(document.querySelectorAll('img'));
            const candidates = allImages.filter(img => 
              img.src && 
              !existingUrls.includes(img.src) &&
              (img.src.includes('googleusercontent.com') || img.src.startsWith('blob:') || img.src.startsWith('data:image')) &&
              img.naturalWidth > 350
            );

            if (candidates.length > 0) {
              const latest = candidates[candidates.length - 1];
              return { src: latest.src, width: latest.naturalWidth, height: latest.naturalHeight };
            }
            return null;
          }, existingImageUrls);

          if (newImageInfo) {
            console.log(`   🖼️ Image detected in Gemini chat (${newImageInfo.width}x${newImageInfo.height})! Extracting full-resolution bytes...`);

            // Method 1: Canvas extraction
            const base64Data = await geminiPage.evaluate((imgSrc) => {
              const img = Array.from(document.querySelectorAll('img')).find(i => i.src === imgSrc);
              if (!img || !img.complete || img.naturalWidth === 0) return null;
              try {
                const canvas = document.createElement('canvas');
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                const dataUrl = canvas.toDataURL('image/png', 1.0);
                return dataUrl.split(',')[1];
              } catch (e) {
                return null;
              }
            }, newImageInfo.src);

            if (base64Data) {
              imageBuffer = Buffer.from(base64Data, 'base64');
            } else {
              // Method 2: Element screenshot fallback
              console.log(`   📸 Canvas restricted. Capturing composite high-res element screenshot...`);
              const imgHandles = await geminiPage.$$('img');
              for (const handle of imgHandles) {
                const src = await geminiPage.evaluate(el => el.src, handle);
                if (src === newImageInfo.src) {
                  imageBuffer = await handle.screenshot({ type: 'png' });
                  break;
                }
              }
            }
          }
        }

        if (imageBuffer) {
          fs.writeFileSync(assetFile, imageBuffer);
          fs.writeFileSync(publicFile, imageBuffer);
          const stats = fs.statSync(assetFile);
          console.log(`   ✅ Saved: ${item.filename} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
          successCount++;
        } else {
          console.error(`   ⚠️ Timed out waiting for ${item.filename}. Skipping...`);
          failureCount++;
        }

      } catch (err) {
        console.error(`   ⚠️ Error during processing: ${err.message}`);
        if (attempts >= 2) failureCount++;
      }
    }

    if (i < queue.length - 1) {
      console.log(`   ⏳ Cooling down for 6 seconds before next prompt...`);
      await sleep(6000);
    }
  }

  console.log('\n=============================================================');
  console.log(`🎉 GENERATION COMPLETE: ${successCount} Generated, ${failureCount} Failed`);
  console.log('=============================================================\n');

  browser.disconnect();
}

main().catch(err => {
  console.error(`\n❌ Fatal Error: ${err.message}\n`);
  process.exit(1);
});
