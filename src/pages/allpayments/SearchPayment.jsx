import React from 'react'
import { Search, X, CalendarDays } from 'lucide-react'


const SearchPayment = ({ dateFilter, setDateFilter, search, setSearch }) => {
    return (
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 pb-4 text-sm">
            {/* Date Filter */}
            <div className="flex rounded justify-between px-2 py-1 bg-slate-900 w-36">
                <CalendarDays className=" text-gray-400 w-5" />
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
            </div>
        </div>
    )
}

export default SearchPayment
