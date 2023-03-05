import { globSync } from "glob";
import sharp from "sharp";

for (const file of globSync("*.{jpg,jpeg,png}")) {
    const ctx = sharp(file);
    const metadata = await ctx.metadata();
    const stats = await ctx.stats();
    console.log(file, metadata.format, metadata.width, metadata.height, stats.entropy);
}
