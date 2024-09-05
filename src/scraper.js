const ProgressBar = require('progress');
const fs_storage = require('./fs-storage');
const fedi_wk = require('fedi-well-known');
const assert = require('assert');

async function fetchNodeInfos(domains) {
    assert.ok(Array.isArray(domains));
    let counterCompleted = 0, counterFailed = 0;
    const bar = new ProgressBar('scraping [:bar] success: [:success] fail: [:fail] :percent :etas', { total: domains.length });

    console.log(`Scraping nodeinfo from ${domains.length} domains`);

    for (const domain of domains) {
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

module.exports = {fetchNodeInfos}