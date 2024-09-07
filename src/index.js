import {storeUsageData} from './fs-storage.js';
import {fetchNodeInfos} from './scraper.js';
import {getDomainsList, getArgs} from './utils.js';
import ProgressBar from 'progress';

main();

async function main(){
    const { src, firstN, concurrencyLimit, outputPath, md5Subfolder} = getArgs();
    const domains = await getDomainsList(src, firstN);

    let counterCompleted = 0, counterFailed = 0;
    const bar = new ProgressBar('scraping [:bar] success: [:success] fail: [:fail] :percent :etas', { total: domains.length, stream: process.stdout });

    for await (const {domain, nodeInfo} of fetchNodeInfos(domains, concurrencyLimit)) {
        if (nodeInfo.success)
        {
            counterCompleted++;
            storeUsageData({domain, wellKnownData: nodeInfo, folderPath: outputPath, md5Subfolder});
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