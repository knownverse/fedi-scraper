const fs = require('fs');
const fedi_wk = require('fedi-well-known');
const fs_storage = require('./fs-storage');
const ProgressBar = require('progress');
const yargs = require('yargs');

const argv = yargs
  .option('src', {
    alias: 's',
    description: 'The URI to fetch data from',
    type: 'string',
    demandOption: true,
  })
  .option('firstN', {
    alias: 'n',
    description: 'The amount of domains to fetch',
    type: 'number',
    demandOption: false,
  })
  .help()
  .alias('help', 'h')
  .argv;

const { src, firstN } = argv;

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
        return [];
    }
    const data = await response.json();
    return data;
}

async function loadNodeInfo(path, firstN) {
    const domains = path.startsWith('http') ? await readFromUrl(path) : readDomainsFromFile(path);
    const selectedDomains = firstN ? domains.slice(0, firstN) : domains;

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

loadNodeInfo(src, firstN);