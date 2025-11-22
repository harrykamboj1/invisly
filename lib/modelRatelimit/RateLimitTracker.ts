import { GEMINI_MODELS } from "../constants";
type ModelNameType={
    requestsThisMinute : number[],
    requestsToday : number[],
    tokensThisMinute : number,
    lastMinuteReset : number,
    lastDayReset: number
}
class RateLimitTracker{
    usage: Map<string, ModelNameType> = new Map();
    constructor(){
        this.usage = new Map();
    }

    getModelUsage(modelName:string){
        if(!this.usage.has(modelName)){
            this.usage.set(modelName, {
                requestsThisMinute: [],
                requestsToday: [],
                tokensThisMinute: 0,
                lastMinuteReset: Date.now(),
                lastDayReset: new Date().setHours(0, 0, 0, 0)
            });
        }
        return this.usage.get(modelName);
    }

    canUseModel(modelName: keyof typeof GEMINI_MODELS){
        const config = GEMINI_MODELS[modelName];
        const usage = this.getModelUsage(modelName)!;
        const now = Date.now();

        if(now - usage.lastMinuteReset >= 60000){
            usage.requestsThisMinute = [];
            usage.tokensThisMinute = 0;
            usage.lastMinuteReset = now;
        }

        const todayStart = new Date().setHours(0, 0, 0, 0);
        if (todayStart > usage.lastDayReset) {
            usage.requestsToday = [];
            usage.lastDayReset = todayStart;
        }

        const withinRPM = usage.requestsThisMinute.length < config.rpm;
        const withinRPD = usage.requestsToday.length < config.rpd;

        return withinRPM && withinRPD;
    }

    recordUsage(modelName:string,tokenCount = 0){
    const usage = this.getModelUsage(modelName);
    const now = Date.now();

    if (usage) {
        usage.requestsThisMinute.push(now);
        usage.requestsToday.push(now);
        usage.tokensThisMinute += tokenCount;
    }
    }
}


const rateLimitTracker = new RateLimitTracker();
export default rateLimitTracker;