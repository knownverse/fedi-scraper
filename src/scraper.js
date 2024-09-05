const fedi_wk = require('fedi-well-known');
const assert = require('assert');
const pLimit = require('p-limit');


async function* fetchNodeInfos(domains, concurrencyLimit=100) {
    assert.ok(Array.isArray(domains), 'domains must be an array');
    console.log(`Scraping nodeinfo from ${domains.length} domains with councurrencyLimit ${concurrencyLimit}`);
    
    const limit = pLimit(concurrencyLimit); // Set concurrency limit
    const tasks =  domains.map(domain => limit(async () => {
        try {
            const nodeInfo = await fedi_wk.fetchNodeInfo(domain);
            return { domain, nodeInfo };
        }
        catch (err) {
            return { domain, nodeInfo: fedi_wk.WellKnowResult.Error(err) };

        }
    }));

    for await (const result of tasks) {
        yield result;
    }

    console.log('Scraping finished');
}

module.exports = {fetchNodeInfos}