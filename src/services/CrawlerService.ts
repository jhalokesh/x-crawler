import url, { URL } from 'node:url';
import axios from 'axios';
import { JSDOM } from 'jsdom';

export class CrawlerService {
    // Regex to match non-HTML file extensions; TODO: improve regex or improve logic to avoid unnecessary crawling
    private static NON_HTML_EXTENSIONS =
        /\.(pdf|zip|jpg|jpeg|png|gif|mp4|mp3|exe|docx|xlsx|pptx)$/i;

    // helper function to convert relative urls to absolute urls
    private static getAbsoluteUrl(baseUrl: string, relativeUrl: string): string {
        return new URL(relativeUrl, baseUrl).href;
    }

    // Helper function to check if a url belongs to the same domain
    private static isSameDomain(domain: string, targetUrl: string) {
        try {
            let parsedDomain = new URL(domain).hostname;
            const parsedTagetUrlDomain = new URL(targetUrl).hostname;
            return parsedDomain === parsedTagetUrlDomain;
        } catch (error) {
            // TODO: implement logger
            console.log(`Error while checking if url belongs to seed url`, error);
            return false;
        }
    }

    // TODO: Helper function to check domain's protocol
    // private static checkDomainProtocol() {}

    async startCrawl(domain: string, maxDepth?: number): Promise<string[]> {
        const seedUrl = url.format({
            protocol: 'https',
            hostname: domain,
            pathname: '/',
        });

        const visitedUrls = new Set<string>(); // Track visited urls
        const visitUrlsQueue: { url: string; depth: number }[] = [{ url: seedUrl, depth: 0 }]; // BFS queue
        const productUrls = new Set<string>(); // store only unique product urls

        while (visitUrlsQueue.length > 0) {
            const delayInMS = Math.round((Math.random() + 1) * 10000);

            const { url: currentUrl, depth } = visitUrlsQueue.shift()!; // Dequeue the next URL

            console.log(`crawling: ${currentUrl}, depth: ${depth}`);

            console.log(`next request in ${delayInMS / 1000} seconds`);

            // skip it if already visited
            if (visitedUrls.has(currentUrl)) {
                console.log(`skip:: already visited: ${visitedUrls.has(currentUrl)}`);
                continue;
            }

            // skip if max depth provided and max depth reached
            if (maxDepth !== undefined && depth >= maxDepth) {
                console.log(
                    `skip:: Max Depth reached:: Max depth: ${maxDepth} :: Depth: ${depth})}`
                );
                return Array.from(productUrls);
            }

            try {
                // fetch the page content
                const response = await axios.get(currentUrl, {
                    timeout: 30000,
                });

                visitedUrls.add(currentUrl);
                console.log(visitedUrls);
                const dom = new JSDOM(response.data);

                // extract all anchor tags
                const anchorTags = dom.window.document.querySelectorAll('a');
                for (const anchorTag of anchorTags) {
                    const href = anchorTag.href;

                    // skip if href is not valid or points to non-HTML resource
                    if (
                        !href ||
                        href.includes('#') ||
                        href.includes('mailto:') ||
                        href.includes('tel:') ||
                        CrawlerService.NON_HTML_EXTENSIONS.test(href)
                    ) {
                        continue;
                    }

                    // convert relative urls to absolute urls
                    const absoluteUrl = CrawlerService.getAbsoluteUrl(currentUrl, href);

                    // skip if url is not from same domain
                    if (!CrawlerService.isSameDomain(seedUrl, absoluteUrl)) continue;

                    // skip already visited urls
                    if (absoluteUrl && visitedUrls.has(absoluteUrl)) continue;

                    productUrls.add(absoluteUrl);

                    const urlExistsInQueue = visitUrlsQueue.some(
                        (urlObj) => urlObj.url === absoluteUrl
                    );

                    if (!visitedUrls.has(absoluteUrl) && !urlExistsInQueue) {
                        visitUrlsQueue.push({
                            url: absoluteUrl,
                            depth: depth + 1,
                        });
                    }
                }
            } catch (error) {
                console.log(`Error crawling ${currentUrl}: `, error);
            }

            // add a delay between requests
            await new Promise((resolve) => setTimeout(resolve, delayInMS));
        }

        return Array.from(productUrls); // return unique product urls as an array
    }
}

export const crawlerService = new CrawlerService();
