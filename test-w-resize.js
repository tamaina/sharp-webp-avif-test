import sharp from "sharp";
import { statSync } from "node:fs";

const source = "photo.4.jpg";

const ctx = sharp(source);
const metadata = await ctx.metadata();
const stats = await ctx.stats();
console.log(source);
console.log(metadata.format, metadata.width, metadata.height, stats.entropy);
console.log((statSync(source).size / 1000).toFixed(0), "KB");
console.log();

let timer = process.hrtime();
const webp = {
    quality: 80,
    lossless: false,
    nearLossless: false,
    alphaQuality: 100,
    smartSubsample: true,
    effort: 1,
};
console.log("WEBP");
console.log(webp);
await ctx
    .resize({
        width: 1024,
        height: 1024,
        fit: "inside",
        withoutEnlargement: true,
    })
    .webp(webp)
    .toFile("test.resize.webp");

console.log(`${(process.hrtime(timer)[0] + process.hrtime(timer)[1] / 1e9).toFixed(3)}s`);
console.log((statSync("test.resize.webp").size / 1000).toFixed(0), "KB");

console.log();

timer = process.hrtime();
const avif = {
    quality: 50,
    lossless: false,
    effort: 3,
};
console.log("AVIF");
console.log(avif);
await ctx
    .resize({
        width: 1024,
        height: 1024,
        fit: "inside",
        withoutEnlargement: true,
    })
    .avif(avif)
    .toFile("test.resize.avif");

console.log(`${(process.hrtime(timer)[0] + process.hrtime(timer)[1] / 1e9).toFixed(3)}s`);
console.log((statSync("test.resize.avif").size / 1000).toFixed(0), "KB");
