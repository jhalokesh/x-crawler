# x-crawler

Crawler for Discovering Product URLs on E-commerce Websites

### Problem Statement

Building a web crawler where uesr will provide domain as input for e.g. domain: amazon.in and web crawler has to crawl all the URLs and should return a comprehensive list of URLs found on the input URL.

Key features:

1. The crawler should be able to handle a minimum of 10 domains and scale to handle potentially hundreds.
2. URL patterns that might be used by different websites (e.g., /product/, /item/, /p/).
3. The crawler should be able to handle large websites with deep hierarchies efficiently.
4. Performance: The crawler should be able to execute in parallel or asynchronously to minimize runtime, especially for large sites.
5. Robustness: Handle edge cases such as:
    - Websites with infinite scrolling or dynamically loaded content.
    - Variations in URL structures across different e-commerce platforms.
