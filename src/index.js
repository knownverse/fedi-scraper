const scraper = require('./scraper');
const utils = require('./utils');

main();

async function main(){
    const { src, firstN } = utils.getArgs();
    const nodes = await utils.getDomainsList(src, firstN);
    scraper.fetchNodeInfos(nodes);
}