const babel = require("@babel/core");
const fs = require("fs");
const path = require("path");

const src = fs.readFileSync(path.join(__dirname, "eatyblinders.jsx"), "utf-8");

const result = babel.transformSync(src, {
  filename: "eatyblinders.jsx",
  presets: [
    ["@babel/preset-react", { runtime: "automatic", importSource: "react" }],
  ],
  babelrc: false,
  configFile: false,
  sourceType: "module",
  retainLines: false,
});

const deployDir = path.join(__dirname, "deploy");
if (!fs.existsSync(deployDir)) {
  fs.mkdirSync(deployDir, { recursive: true });
}

fs.writeFileSync(path.join(deployDir, "app.js"), result.code, "utf-8");
console.log("✓ Compiled OK, bytes:", result.code.length);
