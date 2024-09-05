const fs_storage = require('./fs-storage');
const scraper = require('./scraper');
const utils = require('./utils');
const ProgressBar = require('progress');

main();

async function main(){
    const { src, firstN, concurrencyLimit, outputPath, md5Subfolder} = utils.getArgs();
    const domains = await utils.getDomainsList(src, firstN);

    let counterCompleted = 0, counterFailed = 0;
    const bar = new ProgressBar('scraping [:bar] success: [:success] fail: [:fail] :percent :etas', { total: domains.length, stream: process.stdout });

    for await (const {domain, nodeInfo} of scraper.fetchNodeInfos(domains, concurrencyLimit)) {
        if (nodeInfo.success)
        {
            counterCompleted++;
            fs_storage.storeUsageData({domain, wellKnownData: nodeInfo, folderPath: outputPath, md5Subfolder});
        }
        else {
            console.error(`\n${domain}: ${nodeInfo.error}`);
            counterFailed++;
        }
        bar.tick({
            current: counterCompleted + counterFailed,
            success: counterCompleted,
            fail: counterFailed,
        });
    }
    console.log('storage finished');
}