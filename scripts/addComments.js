const fs = require('fs');
const path = require('path');

const DOCS_DIR = path.resolve("docs");
const GISCUS_TAG = "<GiscusComments />";

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      walkDir(filePath, callback);
    } else if (stat.isFile() && file.endsWith(".md")) {
      callback(filePath);
    }
  });
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, "utf-8");

  if (!content.includes(GISCUS_TAG)) {
    console.log(`Adding GiscusComments to: ${filePath}`);
    content = content.trimEnd() + "\n\n" + GISCUS_TAG + "\n";
    fs.writeFileSync(filePath, content, "utf-8");
  } else {
    console.log(`Already has GiscusComments: ${filePath}`);
  }
}

walkDir(DOCS_DIR, processFile);

console.log("Done ✅");

