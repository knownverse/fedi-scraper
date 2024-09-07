import crypto from 'crypto';
import path from 'path';
import fs from 'fs-extra';


async function storeUsageData({domain, wellKnownData, folderPath='.fedi-node', md5Subfolder=false}){
    const domainHash = crypto.createHash('md5').update(domain).digest('hex');
    const subfolder = md5Subfolder ? domainHash.slice(0, 2) : '';
    const filePath = path.join(folderPath, subfolder, domain, 'nodeinfo');

    await fs.ensureDir(path.dirname(filePath));
    await fs.writeJson(filePath, wellKnownData, { spaces: 2 });
}

export {storeUsageData};
