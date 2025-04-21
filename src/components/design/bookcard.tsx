"use client";

import {DatePicker} from "@/components/design/datepicker";
import {DateRange} from "react-day-picker";
import {differenceInHours, differenceInDays} from "date-fns";
import * as React from "react";

function statsForDates(from: Date, to: Date) {
    const now = new Date();
    const _from = from || now;
    const _to = to || now;

    const intervalDiffHours = differenceInHours(_to, _from)
    const elapsedHours = differenceInHours(now, _from)
    const progress = (elapsedHours / intervalDiffHours) * 100;

    const intervalDays = differenceInDays(_to, _from);
    const elapsedDays = differenceInDays(now, _from)
    const daysToGo = intervalDays - elapsedDays

    return {
        daysToGo,
        intervalDays,
        elapsedDays,
        progress
    }

}

export type BookCardProps = {
    title: string,
    dateStart: Date,
    dateEnd: Date,
}

export default function BookCard({title, dateStart, dateEnd}: BookCardProps) {

    const [dateFrom, setDateFrom] = React.useState(dateStart)
    const [dateTo, setDateTo] = React.useState(dateEnd)

    function onSelectDate(dateRange: DateRange) {
        console.log("Date selected", dateRange);
        setDateFrom(dateRange.from || new Date())
        setDateTo(dateRange.to || new Date())
    }

    const {elapsedDays, daysToGo, progress} = statsForDates(dateFrom, dateTo)


    return (
        <div className="flex flex-col gap-[16px] items-center sm:items-start">
            <h1 className="text-2xl">{title}</h1>
            <DatePicker onSelect={onSelectDate}/>
            <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-1">
                    <p className="font-bold">{elapsedDays} days passed, you should be at least
                        at {progress.toFixed(2)}%</p>
                    <p>{daysToGo} days left</p>
                </div>
            </div>
        </div>
    );
}