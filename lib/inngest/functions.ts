import {inngest} from "@/lib/inngest/client";
import { PERSONALIZED_WELCOME_EMAIL_PROMPT } from "./prompt";
import { sendWelcomeEmail } from "../nodemailer";
import { generateWithFallback } from "../modelRatelimit/availableModel";


export const sendSignUpEmail = inngest.createFunction(
    {id:"sign-up-email"},
    {event:"app/user.created"},
    async({event,step})=>{
        const userProfile = `
        - Country: ${event.data.country}
        - Investment goals: ${event.data.investmentGoals}
        - Risk tolerance: ${event.data.riskTolerance}
        - Preferred industry: ${event.data.preferredIndustry}
        `

        const prompt = PERSONALIZED_WELCOME_EMAIL_PROMPT.replace("{{userProfile}}",userProfile)

        // const response = await step.ai.infer('generate-welcome-intro',{
        //     model:step.ai.models.gemini({ model: 'gemini-2.5-flash-lite' }),
        //     body: {
        //         contents: [
        //             {
        //                 role: 'user',
        //                 parts: [
        //                     { text: prompt }
        //                 ]
        //             }]
        //     }
        // })

        const response = await generateWithFallback(step,'generate-welcome-intro',prompt,{})

        await step.run('send-welcome-email',async ()=>{
            console.log(`Sending welcome email to ${event.data.email}`)
            const part = response.candidates?.[0]?.content?.parts?.[0];
            const introText = (part && 'text' in part ? part.text : null) ||'Thanks for joining Signalist. You now have the tools to track markets and make smarter moves.'

            const { data: { email, name } } = event;
            return await sendWelcomeEmail({ email, name, intro: introText });

        })


        return {
            success:true,
            message:'Welcome email sent successfully'
        }
    }
)