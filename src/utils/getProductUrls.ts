import { GenerateContentResult, GoogleGenerativeAI } from '@google/generative-ai';
import { Config, googleAIConfigs } from '../config';
import { promptForFetchingProductUrls } from '../config/prompts';

export const getProductUrls = async (foundUrls: string[]): Promise<string[]> => {
    try {
        const genAI = new GoogleGenerativeAI(String(Config.GEMINI_AI_API_KEY));
        const model = genAI.getGenerativeModel(googleAIConfigs);

        const prompt = `${promptForFetchingProductUrls}\n${foundUrls}`;

        const result: GenerateContentResult = await model.generateContent(prompt);
        const generatedText: string = result.response.text();
        const productUrls: string[] = JSON.parse(generatedText);
        return productUrls;
    } catch (error) {
        console.log('Something went wrong :( with google AI, using regex as fallback', error);

        let productUrls: string[] = [];

        const productUrlRegex =
            /\/product\/|\/products\/|\/item\/|\/items\/|\/p\/|\/dp\/|\/buy\/|product_id=|item=/;

        for (const foundUrl of foundUrls) {
            if (productUrlRegex.test(foundUrl)) {
                productUrls.push(foundUrl);
            }
        }

        return productUrls;
    }
};
