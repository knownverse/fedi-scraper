import fs from 'fs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers'

function getArgs() {
return yargs(hideBin(process.argv))
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
  .option('concurrencyLimit', {
    alias: 'c',
    description: '# of parallel fetches',
    type: 'number',
    demandOption: false,
  })
  .option('outputPath', {
    alias: 'o',
    description: '# of parallel fetches',
    type: 'string',
    demandOption: false,
  })
  .option('md5Subfolders', {
    alias: 'm',
    description: '# of parallel fetches',
    type: 'boolean',
    demandOption: false,
  })
  .help()
  .alias('help', 'h')
  .argv;
}

async function getDomainsList(src, firstN){
    const domains = src.startsWith('http') ? await _readFromUrl(src) : _readDomainsFromFile(src);
    return firstN ? domains.slice(0, firstN) : domains;
}

export {getArgs, getDomainsList}

function _readDomainsFromFile(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading file with nodes list:', err);
        return []
    }
}

async function _readFromUrl(url){
    let response = await fetch(url);
    if (!response.ok) {
        console.error('Error reading file with nodes list:', response.status);
        return [];
    }
    const data = await response.json();
    return data;
}
