import { globSync } from "glob";
import sharp from "sharp";

for (const file of globSync("*.{jpg,jpeg,png}")) {
    const ctx = sharp(file);
    const stats = await ctx.stats();
    console.log(stats.entropy.toFixed(4), file);
}
