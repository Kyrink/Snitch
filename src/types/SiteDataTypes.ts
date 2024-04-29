

export interface Category {
    name: string;
    confidence: number;
}

export interface SiteData {
    target: string;
    safetyStatus: string;
    reputations: number;
    safetyConfidence: number;
    childSafetyReputations?: number;
    childSafetyConfidence?: number;
    categories: Category[];
    blackList?: string[];
}
