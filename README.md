## Fediverse Scraper

Run to scrape: 

```
npm start -- --src <url/path> --firstN <number> 
npm start -- --src https://nodes.fediverse.party/nodes.json --firstN 10
npm start -- --src ./fedi-nodes.json
```

Scraper will fetch nodeinfos into local ./.fedi-nodes folder 