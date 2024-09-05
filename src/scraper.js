const fedi_wk = require('fedi-well-known');
const assert = require('assert');

async function* fetchNodeInfos(domains) {
    assert.ok(Array.isArray(domains), 'domains must be an array');
    console.log(`Scraping nodeinfo from ${domains.length} domains`);
    
    const tasks =  domains.map(async (domain) => {
        try {
            const nodeInfo = await fedi_wk.fetchNodeInfo(domain);
            return { domain, nodeInfo };
        }
        catch (err) {
            return { domain, nodeInfo: fedi_wk.WellKnowResult.Error(err) };

        }
    });

    for await (const result of tasks) {
        yield result;
    }

    console.log('Scraping finished');
}

module.exports = {fetchNodeInfos}