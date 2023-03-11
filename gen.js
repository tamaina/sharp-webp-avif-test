import sharp from "sharp";
import { statSync } from "node:fs";
import rename from "rename";
import { program } from "commander";
import mkdirp from "mkdirp";

await mkdirp("out");

program
    .option("-i, --source <source>", "source file", "photo.1.jpg")
    .option("-q, --quality <quality>", "quality", 80)
    .option("-e, --effort <effort>", "effort", 1)
    .option("-h, --height <height>", "height", 2048)
    .option("-t, --type <type>", "type", "webp")
    .option("-l, --lossless", "lossless")
    .option("-n, --near-lossless", "near-lossless")
    ;
program.parse();
const options = program.opts();

const source = options.source;
const ctx = sharp(source);
const metadata = await ctx.metadata();
const stats = await ctx.stats();
console.log(source);
console.log(metadata.format, metadata.width, metadata.height, stats.entropy);
console.log((statSync(source).size / 1000).toFixed(0), "KB");
console.log();

const target = rename(source, {
    dirname: "out",
    suffix: `.h${options.height}${options.lossless ? '.lo' : options.nearLossless ? '.nl' : ''}.q${options.quality}.e${options.effort}`,
    extname: `.${options.type}`,
}).toString();

let timer = process.hrtime();
if (options.type === "avif") {
    const avif = {
        quality: Number(options.quality),
        lossless: options.lossless || options.nearLossless,
        effort: Number(options.effort),
    };

    console.log("AVIF");
    console.log(avif);
    await ctx
        .resize({
            height: Number(options.height),
            fit: "inside",
            withoutEnlargement: true,
        })
        .avif(avif)
        .toFile(target);
} else if (options.type === "png") {
    const png = {
        quality: Number(options.quality),
        effort: Number(options.effort),
        compressionLevel: 9,
        adaptiveFiltering: false,
    };

    console.log("PNG");
    console.log(png);
    await ctx
        .resize({
            height: Number(options.height),
            fit: "inside",
            withoutEnlargement: true,
        })
        .png(png)
        .toFile(target);
} else if (options.type === "jpeg") {
    console.log("JPEG");
    await ctx
        .resize({
            height: Number(options.height),
            fit: "inside",
            withoutEnlargement: true,
        })
        .jpeg()
        .toFile(target);
} else {
    const webp = {
        quality: Number(options.quality),
        lossless: options.lossless,
        nearLossless: options.nearLossless,
        alphaQuality: 95,
        smartSubsample: true,
        effort: Number(options.effort),
    };
    
    console.log("WEBP");
    console.log(webp);
    await ctx
        .resize({
            height: Number(options.height),
            fit: "inside",
            withoutEnlargement: true,
        })
        .webp(webp)
        .toFile(target);
}

console.log(`${(process.hrtime(timer)[0] + process.hrtime(timer)[1] / 1e9).toFixed(3)}s`);
console.log((statSync(target).size / 1000).toFixed(0), "KB");
