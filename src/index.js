const fs_storage = require('./fs-storage');
const scraper = require('./scraper');
const utils = require('./utils');
const ProgressBar = require('progress');

main();

async function main(){
    const { src, firstN } = utils.getArgs();
    const domains = await utils.getDomainsList(src, firstN);

    let counterCompleted = 0, counterFailed = 0;
    const bar = new ProgressBar('scraping [:bar] success: [:success] fail: [:fail] :percent :etas', { total: domains.length });

    for await (const {domain, nodeInfo} of scraper.fetchNodeInfos(domains)) {
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
    console.log('storage finished');
}