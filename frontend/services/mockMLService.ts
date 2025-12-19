
// Mock ML Service for Campaign Prediction

export interface Prediction {
    bestTime: { day: string; time: string; score: number }[];
    audience: { segment: string; likelihood: number }[];
    template: { name: string; score: number; reason: string };
    metrics: {
        engagementScore: number;
        predictedDeliverability: number;
        costEfficiency: number;
    };
}

export const getCampaignPrediction = async (campaignId?: string): Promise<Prediction> => {
    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return {
        bestTime: [
            { day: 'Tuesday', time: '10:00 AM', score: 95 },
            { day: 'Wednesday', time: '02:00 PM', score: 88 },
            { day: 'Thursday', time: '11:00 AM', score: 82 },
        ],
        audience: [
            { segment: 'Recent Purchasers', likelihood: 85 },
            { segment: 'Engaged Leads', likelihood: 72 },
            { segment: 'Inactive Users', likelihood: 30 },
        ],
        template: {
            name: 'Summer Sale Promo B',
            score: 9.2,
            reason: 'Short text + Image performs 15% better for this segment.'
        },
        metrics: {
            engagementScore: 88,
            predictedDeliverability: 98,
            costEfficiency: 92,
        },
    };
};

export const getABTestSimulation = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
        templateA: { openRate: 45, replyRate: 12 },
        templateB: { openRate: 62, replyRate: 18 },
        winner: 'B',
        confidence: 94
    };
};
