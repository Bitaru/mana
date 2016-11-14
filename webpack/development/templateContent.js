const cheerio = require('cheerio');
const path = require('path');
const fs = require('fs');

module.exports = (options) => {
  const html = fs.readFileSync(
    path.resolve(process.cwd(), 'shared/templates/index_dev.html')
  ).toString();

  if (!options.pkg.dll) { return html; }

  const doc = cheerio(html);
  const body = doc.find('body');

  body.append(`<script data-dll='true' src='/uscreenDeps.dll.js'></script>`)

  return doc.toString();
};
