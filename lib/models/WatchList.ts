import mongoose, { Schema, model, models } from "mongoose";


export interface IWatchlist {
    userId: string;
    symbol: string;
    company: string;
    createdAt?: Date;
    email?:string,
  }

  const watchlistSchema = new Schema<IWatchlist>({
    userId: { type: String, required: true },
    symbol: { type: String, required: true },
    company: { type: String, required: true },
    email:{type:String,required:true},
    createdAt: { type: Date, default: () => new Date() },
  });

  watchlistSchema.index({ userId: 1, symbol: 1 }, { unique: true });
  const Watchlist = models.Watchlist || model<IWatchlist>("Watchlist", watchlistSchema);
  export default Watchlist;