const crypto = require('crypto');
const path = require('path');
const fs = require('fs-extra');


async function storeUsageData(domain, wellKnownData){
    const domainHash = crypto.createHash('md5').update(domain).digest('hex');
    const subfolder = domainHash.slice(0, 2);
    const filePath = path.join('.fedi-nodes', subfolder, domain, 'nodeinfo')
    await fs.ensureDir(path.dirname(filePath));
    await fs.writeJson(filePath, wellKnownData, { spaces: 2 });
}

module.exports = {storeUsageData};
