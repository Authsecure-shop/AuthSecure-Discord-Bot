const fs = require("fs");
const path = require("path");

const configPath = path.join(process.cwd(), "config.json");

// 🚀 Ensure config.json exists
function ensureFile() {
    if (!fs.existsSync(configPath)) {
        fs.writeFileSync(configPath, JSON.stringify({ sellerkey: "" }, null, 2));
    }
}

function getSellerKey() {
    ensureFile();
    const file = JSON.parse(fs.readFileSync(configPath, "utf8"));
    return file.sellerkey || null;
}

function setSellerKey(key) {
    ensureFile();
    fs.writeFileSync(configPath, JSON.stringify({ sellerkey: key }, null, 2));
}

module.exports = { getSellerKey, setSellerKey };
