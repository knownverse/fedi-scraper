const fs = require('fs');
const fedi_wk = require('fedi-well-known');
const fs_storage = require('./fs-storage');
const ProgressBar = require('progress');

function readDomainsFromFile(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading file with nodes list:', err);
        return []
    }
}

async function readFromUrl(url){
    let response = await fetch(url);
    if (!response.ok) {
        console.error('Error reading file with nodes list:', response.status);
        // return WellKnowResult.Error(`HTTP error! status: ${url}: ${response.status}`);
        return [];
    }
    const data = await response.json();
    return data;
}

async function loadNodeInfo(path) {
    const domains = path.startsWith('http') ? await readFromUrl(path) : readDomainsFromFile(path);
    const selectedDomains = domains.slice(0, 10);

    let totalNodes = selectedDomains.length;
    let counterCompleted = 0, counterFailed = 0;

    const bar = new ProgressBar('scraping [:bar] success: [:success] fail: [:fail] :percent :etas', { total: totalNodes });

    console.log(`Scraping nodeinfo from ${totalNodes} domains`);

    for (const domain of selectedDomains) {
        const nodeInfo = await fedi_wk.fetchNodeInfo(domain);
        if (nodeInfo.success)
            counterCompleted++;
        else {
            console.error(`\n${domain}: ${nodeInfo.error}`);
            counterFailed++;
        }
        fs_storage.storeUsageData(domain, nodeInfo);
        bar.tick({
            current: counterCompleted + counterFailed,
            success: counterCompleted,
            fail: counterFailed,
        });
    }
    console.log('Scraping finished. Completing storing...');
}

const [,, nodesListPathOrUrl] = process.argv;

loadNodeInfo(nodesListPathOrUrl);