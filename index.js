const fs = require('fs');
const fedi_wk = require('fedi-well-known');

function readDomainsFromFile(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading file:', err);
        return [];
    }
}


async function loadNodeInfo(filePath) {
    const domains = readDomainsFromFile(filePath);
    const selectedDomains = domains.slice(0, 6);

    for (const domain of selectedDomains) {
        const nodeInfo = await fedi_wk.fetchNodeInfo(domain);
        if (nodeInfo) {
            console.log(`Node info for ${domain}:`, nodeInfo);
        }
    }
}

loadNodeInfo('fedi-nodes.json');