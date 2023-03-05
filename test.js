import sharp from "sharp";
import { statSync } from "node:fs";

const ctx = sharp("test.jpg");
const metadata = await ctx.metadata();
console.log(metadata.format, metadata.width, metadata.height);
console.log((statSync("test.jpg").size / 1000).toFixed(0), "KB");
console.log();

let timer = process.hrtime();
const webp = {
    quality: 80,
    lossless: false,
    nearLossless: false,
    alphaQuality: 100,
    smartSubsample: true,
    effort: 4,
};
console.log("WEBP");
console.log(webp);
await ctx
    .webp(webp)
    .toFile("test.webp");

console.log(`${(process.hrtime(timer)[0] + process.hrtime(timer)[1] / 1e9).toFixed(3)}s`);
console.log((statSync("test.webp").size / 1000).toFixed(0), "KB");

console.log();

timer = process.hrtime();
const avif = {
    quality: 50,
    lossless: false,
    effort: 4,
};
console.log("AVIF");
console.log(avif);
await ctx
    .avif(avif)
    .toFile("test.avif");

console.log(`${(process.hrtime(timer)[0] + process.hrtime(timer)[1] / 1e9).toFixed(3)}s`);
console.log((statSync("test.avif").size / 1000).toFixed(0), "KB");
