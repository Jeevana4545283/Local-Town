const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

const frontendSrc = path.join(__dirname, 'frontend/src');

walk(frontendSrc, (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace standard strings: 'http://localhost:4000/api/...' -> `${import.meta.env.VITE_API_BASE || 'http://localhost:4000'}/api/...`
    let updated = content.replace(/'http:\/\/localhost:4000([^']*)'/g, "`${import.meta.env.VITE_API_BASE || 'http://localhost:4000'}$1`");
    
    // Replace template literals: `http://localhost:4000/api/...` -> `${import.meta.env.VITE_API_BASE || 'http://localhost:4000'}/api/...`
    updated = updated.replace(/`http:\/\/localhost:4000([^`]*)`/g, "`${import.meta.env.VITE_API_BASE || 'http://localhost:4000'}$1`");

    if (content !== updated) {
      fs.writeFileSync(filePath, updated);
      console.log(`Updated: ${filePath}`);
    }
  }
});
