import fs from "fs";

const ttf = fs.readFileSync("./NotoSansDevanagari-Regular.ttf");
const base64 = ttf.toString("base64");

fs.writeFileSync("./NotoSansDevanagari.txt", base64, { encoding: "ascii" });

console.log("done");
