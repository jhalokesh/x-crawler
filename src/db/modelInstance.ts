import { DynamicCrawlDomain, StaticCrawlDomain } from '../models/CrawlDomain';
import { DynamicCrawlProductUrl, StaticCrawlProductUrl } from '../models/CrawlProductUrl';
import { DomainService } from '../services/DomainService';

export const staticDomainService = new DomainService(StaticCrawlDomain, StaticCrawlProductUrl);
export const dynamicDomainService = new DomainService(DynamicCrawlDomain, DynamicCrawlProductUrl);
