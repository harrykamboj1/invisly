import SearchCommand from "@/components/SearchCommand";
import { WatchlistTable } from "@/components/WatchListTable";
import { getUserAlertList } from "@/lib/actions/alerts.actions";
import { searchStocks } from "@/lib/actions/alphaAdvantage.actions";
import {
  getWatchListSymbolNewsData,
  getWatchlistWithData,
} from "@/lib/actions/watch.actions";
import { Star, Trash2 } from "lucide-react";

import { IAlerts } from "@/lib/models/Alerts";
import AlertList from "@/components/AlertList";

const WatchListPage = async () => {
  const [watchlist, alertList, news, initialStocks] = await Promise.all([
    getWatchlistWithData(),
    getUserAlertList(),
    getWatchListSymbolNewsData(),
    searchStocks(),
  ]);

  const deletAlert = (item: IAlerts) => {};
  if (watchlist.length == 0) {
    return (
      <section className="flex justify-center container gap-8 flex-col items-center md:mt-10 p-6 text-center">
        <div className="flex flex-col items-center justify-center text-center">
          <Star className="h-16 w-16 text-gray-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-400 mb-2">
            Your Watchlist is empty
          </h2>
          <p className="text-gray-500 mb-6 max-w-md">
            Add stocks to your watchlist to keep track of them here.
          </p>
        </div>
        <SearchCommand initialStocks={initialStocks} />
      </section>
    );
  }
  return (
    <section className="watchlist flex flex-row">
      <div className="flex flex-col gap-6 flex-4">
        <div className="flex items-center justify-between">
          <h2 className="watchlist-title">Watchlist</h2>
          <SearchCommand initialStocks={initialStocks} />
        </div>
        <WatchlistTable watchlist={watchlist} />
        <div className="news-section w-full">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold text-white">Latest News</h1>
            <p className="text-sm text-gray-400">
              {news?.length ?? 0} articles
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {news?.map((item, index) => (
              <WatchListNewsCard
                key={item.url ?? index}
                symbol={item.symbol}
                name={item.companyName}
                title={item.title}
                description={item.content}
                url={item.url}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col flex-2 ml-6 ">
        <h1 className="text-2xl font-semibold text-white pb-3">Alerts</h1>
        <div className="bg-gray-800 border-2 p-3 rounded-sm">
          <div>
            <AlertList alertList={alertList} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WatchListPage;

function WatchListNewsCard({ symbol, name, title, description, url }: any) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="block">
      <div className="bg-gray-700 p-5 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col gap-3 border border-gray-700 hover:border-gray-500 h-full">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              {/* <span className="text-xs font-semibold bg-yellow-400 text-zinc-900 px-2 py-1 rounded">
                {symbol}
              </span> */}
              <span className="text-lg text-green-300 font-medium">{name}</span>
            </div>
            <h3 className="mt-3 text-sm font-bold text-yellow-400 leading-tight">
              {title}
            </h3>
          </div>
        </div>

        <p className="text-gray-400 text-sm max-h-20 overflow-hidden">
          {description}
        </p>

        <div className="mt-auto flex items-center justify-between">
          {/* <span className="text-xs text-gray-500">Source</span> */}
          <span className="text-xs underline text-blue-400">
            Read full article ↗
          </span>
        </div>
      </div>
    </a>
  );
}
