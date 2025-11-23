'use server'
import { headers } from "next/headers";
import { auth } from "../better-auth";
import { redirect } from "next/navigation";
import AlertsList, { IAlerts } from "../models/Alerts";
import { revalidatePath } from "next/cache";

export const addToAlerts = async ({alertName,stockIdentifier,alertType,alertCondition,alertValue,companyName}) => {
    try{
        const session = await auth.api.getSession({
            headers:await headers(),
        })

        if (!session?.user) redirect('/sign-in');

        const count = await AlertsList.countDocuments({
            userId:session.user.id,
            email:session.user.email,

        })
          const seqNum = count + 1;
          const newItem = new AlertsList({
            userId: session.user.id,
            email:session.user.email,
            seqNum:seqNum,
            alertName:alertName,
            companyName,
            symbol:stockIdentifier,
            stockIdentifier:stockIdentifier,
            alertType:alertType,
            alertCondition:alertCondition,
            alertValue:alertValue,
          });
          console.log("Alert save success")
          await newItem.save();
          revalidatePath('/watchlist');
    return { success: true, message: 'New Alert added to alert list' };
    }catch(error){
        console.error("Error adding to alertlist:", error);
        throw new Error('Failed to add new alert to list');
    }
}

export const removeAlertFromList = async ({seqNum}) => {
    try {
      const session = await auth.api.getSession({
        headers: await headers(),
      });
      if (!session?.user) redirect('/sign-in');
  
      await AlertsList.deleteOne({
        userId: session.user.id,
        email:session.user.email,
        seqNum:seqNum,
      });

      console.log("Alert delete success")

      revalidatePath('/watchlist');
  
      return { success: true, message: 'Alert removed from alertlist' };
    } catch (error) {
      console.error('Error removing from alertlist:', error);
      throw new Error('Failed to remove stock from alertlist');
    }
  };

  export const updateFromWatchlist = async ({alertName,stockIdentifier,alertType,alertCondition,alertValue,companyName}) => {
    try {
      const session = await auth.api.getSession({
        headers: await headers(),
      });
      if (!session?.user) redirect('/sign-in');
  
      await AlertsList.updateOne({
         userId: session.user.id,
            email:session.user.email,
            seqNum:seqNum,
            alertName:alertName,
            companyName,
            symbol:stockIdentifier,
            stockIdentifier:stockIdentifier,
            alertType:alertType,
            alertCondition:alertCondition,
            alertValue:alertValue,
      });

      console.log("Alert update success")

      revalidatePath('/watchlist');
  
      return { success: true, message: 'Alert updated from alertlist' };
    } catch (error) {
      console.error('Error removing from alertlist:', error);
      throw new Error('Failed to update stock from alertlist');
    }
  };


  export const getUserAlertList = async () => {
    try {
      const session = await auth.api.getSession({
        headers: await headers(),
      });
      if (!session?.user) redirect('/sign-in');
  
      const alertList = await AlertsList.find({ userId: session.user.id,email:session.user.email })
        .sort({ addedAt: -1 })
        .lean();
  
      return JSON.parse(JSON.stringify(alertList));
    } catch (error) {
      console.error('Error fetching getUserAlertList:', error);
      throw new Error('Failed to fetch getUserAlertList');
    }
  }