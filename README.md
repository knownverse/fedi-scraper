## Fediverse Scraper

Run to scrape: 

```
npm start -- --src <url/path> --firstN <number> 2> error.log
npm start -- --src https://nodes.fediverse.party/nodes.json --firstN 10 2> error.log
npm start -- --src ./fedi-nodes.json 2> error.log
```

Scraper will fetch nodeinfos into local `.fedi-nodes` folder 

```
example.com: Error fetching url https://example.com/.well-known/nodeinfo: Error: getaddrinfo ENOTFOUND example.com. Stack: 
 TypeError: fetch failed
    at node:internal/deps/undici/undici:13178:13
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async fetchJSON (/Users/fedi/scraper/node_modules/fedi-well-known/src/index.js:19:26)
    at async fetchWellKnown (/Users/fedi/scraper/node_modules/fedi-well-known/src/index.js:32:12)
    at async fetchWellKnownLinks (/Users/fedi/scraper/node_modules/fedi-well-known/src/index.js:36:28)
    at async Object.fetchNodeInfo (/Users/fedi/scraper/node_modules/fedi-well-known/src/index.js:53:28)
    at async /Users/fedi/scraper/src/scraper.js:10:30
```
