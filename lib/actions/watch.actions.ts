'use server'
import { headers } from "next/headers";
import { auth } from "../better-auth";
import { redirect } from "next/navigation";
import Watchlist from "../models/WatchList";
import { revalidatePath } from "next/cache";
import { getStocksDetails } from "./alphaAdvantage.actions";
import { searchFinancialNews, searchFinancialNewsNotTool } from "../langchain/tools";

export const addToWatchList = async (symbol: string,company:string) => {
    try{
        const session = await auth.api.getSession({
            headers:await headers(),
        })

        if (!session?.user) redirect('/sign-in');

        const existingOne = await Watchlist.findOne({
            userId:session.user.id,
            symbol:symbol.toUpperCase()
        })
        if (existingOne) {
            return { success: false, error: 'Stock already in watchlist' };
          }

          const newItem = new Watchlist({
            userId: session.user.id,
            symbol: symbol.toUpperCase(),
            company: company.trim(),
            email:session.user.email
          });
          console.log("Watchlist save success")
          const res = await newItem.save();
          console.log(res)
          revalidatePath('/watchlist');

    return { success: true, message: 'Stock added to watchlist' };
    }catch(error){
        console.error("Error adding to watchlist:", error);
        throw new Error('Failed to add stock to watchlist');
    }
}

export const removeFromWatchlist = async (symbol: string) => {
    try {
      const session = await auth.api.getSession({
        headers: await headers(),
      });
      if (!session?.user) redirect('/sign-in');
  
      await Watchlist.deleteOne({
        userId: session.user.id,
        symbol: symbol.toUpperCase(),
      });

      console.log("Watchlist delete success")

      revalidatePath('/watchlist');
  
      return { success: true, message: 'Stock removed from watchlist' };
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      throw new Error('Failed to remove stock from watchlist');
    }
  };

  export const getWatchlistSymbolsByEmail = async (email:string) =>{
    try {
      const session = await auth.api.getSession({
        headers: await headers(),
      });
      if (!session?.user) redirect('/sign-in');
  
      const list = await Watchlist.find(
        {
          userId: session.user.id,
          email: email,
        }
      ).select("symbol");

      console.log("Watchlist find success")
  
      return { success: true, message: ' watchlist fetched successfully',list:list };
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      throw new Error('Failed to remove stock from watchlist');
    }
  }


  export const getUserWatchlist = async () => {
    try {
      const session = await auth.api.getSession({
        headers: await headers(),
      });
      if (!session?.user) redirect('/sign-in');
  
      const watchlist = await Watchlist.find({ userId: session.user.id })
        .sort({ addedAt: -1 })
        .lean();
  
      return JSON.parse(JSON.stringify(watchlist));
    } catch (error) {
      console.error('Error fetching watchlist:', error);
      throw new Error('Failed to fetch watchlist');
    }
  }

export const getWatchlistWithData = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) redirect('/sign-in');

    const watchlist = await Watchlist.find({ userId: session.user.id }).sort({ addedAt: -1 }).lean();

    if (watchlist.length === 0) return [];

    const stocksWithData = await Promise.all(
      watchlist.map(async (item) => {
        const stockData = await getStocksDetails(item.symbol);
        if (!stockData) {
          console.warn(`Failed to fetch data for ${item.symbol}`);
          return item;
        }
        const stockNews = await searchFinancialNewsNotTool({ 
          companyName: item.company, 
          symbol: item.symbol 
        })
        const result = JSON.parse(stockNews)
        return {
          company: stockData.company,
          symbol: stockData.symbol,
          currentPrice: stockData.currentPrice,
          priceFormatted: stockData.priceFormatted,
          changeFormatted: stockData.changeFormatted,
          changePercent: stockData.changePercent,
          marketCap: stockData.marketCapFormatted,
          peRatio: stockData.peRatio,
          stockNews:result?.results?.results
        };
      }),
    );
    

    return JSON.parse(JSON.stringify(stocksWithData));
  } catch (error) {
    console.error('Error loading watchlist:', error);
    throw new Error('Failed to fetch watchlist');
  }
};


export const getWatchListSymbolNewsData = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) redirect('/sign-in');

    const watchlist = await Watchlist.find({ userId: session.user.id }).sort({ addedAt: -1 }).lean();

    if (watchlist.length === 0) return [];
    const stocksWithData = await Promise.all(
      watchlist.map(async (item) => {
        const stockNews = await searchFinancialNewsNotTool({ 
          companyName: item.company, 
          symbol: item.symbol 
        });
        
        const result = JSON.parse(stockNews);
        const newsArray = result?.results?.results;
        
        if (newsArray && newsArray.length > 0) {
          return newsArray.slice(0,3).map(newsItem => ({
            companyName: item.company,
            symbol: item.symbol,
            content: newsItem.content || newsItem.description || '',
            url: newsItem.url || newsItem.link || '',
            title: newsItem.title || ''
          }));
        }
        
        return [];
      }),
    );
    

    return JSON.parse(JSON.stringify(stocksWithData.flat()));
  } catch (error) {
    console.error('Error loading watchlist:', error);
    throw new Error('Failed to fetch watchlist');
  }
};