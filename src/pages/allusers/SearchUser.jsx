import React from 'react'
import { Search, X, Loader2, CalendarDays } from 'lucide-react'


const SearchUser = ({ search, setSearch, dateFilter, setDateFilter, loader }) => {
    return (
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 pb-4 text-sm">
        <div className="w-full md:w-80 bg-slate-900 rounded px-1 sm:px-4 py-1 flex items-center">
          <Search className="text-slate-400 w-5" />
          <input
            type="text"
            placeholder="Search user by email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full ml-2 outline-none"
          />
          <X onClick={() => setSearch("")} className={`text-slate-500 w-5 cursor-pointer ${search !== "" ? "block" : "hidden"}`} />
        </div>
        <div className="flex rounded px-2 py-1 bg-slate-900">
          <select
            className="outline-none bg-slate-900"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="all">Filter</option>
            <option value="today">Today</option>
            <option value="thisWeek">This Week</option>
            <option value="lastWeek">Last Week</option>
            <option value="thisMonth">This Month</option>
            <option value="lastMonth">Last Month</option>
            <option value="thisYear">This Year</option>
            <option value="lastYear">Last Year</option>
          </select>
          <CalendarDays className=" text-gray-400 w-5" />
        </div>
      </div>
    )
}

export default SearchUser