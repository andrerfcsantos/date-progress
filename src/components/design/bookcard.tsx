'use client'

import { DatePicker } from '@/components/design/datepicker'
import { DateRange } from 'react-day-picker'
import {
    differenceInHours,
    differenceInDays,
    addHours,
    format as formatDate,
} from 'date-fns'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import * as React from 'react'

function statsForDates(from: Date, to: Date) {
    const now = new Date()
    const _from = from || now
    const _to = to || now

    const intervalDiffHours = differenceInHours(_to, _from)
    const elapsedHours = differenceInHours(now, _from)
    const progress = (elapsedHours / intervalDiffHours) * 100

    const intervalDays = differenceInDays(_to, _from)
    const elapsedDays = differenceInDays(now, _from)
    const daysToGo = intervalDays - elapsedDays

    return {
        daysToGo,
        intervalDays,
        elapsedDays,
        elapsedHours,
        progress,
    }
}

export type BookCardProps = {
    title: string
    dateStart: Date
    dateEnd: Date
}

export default function BookCard({ title, dateStart, dateEnd }: BookCardProps) {
    const [dateFrom, setDateFrom] = React.useState(dateStart)
    const [dateTo, setDateTo] = React.useState(dateEnd)
    const [currentPercent, setCurrentPercent] = React.useState('')

    function onSelectDate(dateRange: DateRange) {
        console.log('Date selected', dateRange)
        setDateFrom(dateRange.from || new Date())
        setDateTo(dateRange.to || new Date())
    }
    const cardID = `book-card-${title.replace(/\s+/g, '-').toLowerCase()}`
    const { elapsedDays, elapsedHours, daysToGo, progress } = statsForDates(
        dateFrom,
        dateTo
    )

    const textColor =
        daysToGo < 7
            ? 'text-red-500'
            : daysToGo < 30
              ? 'text-orange-500'
              : 'text-green-500'

    let finishDate = dateTo
    const currentProgress = parseFloat(currentPercent)
    const isValidProgress =
        !isNaN(currentProgress) &&
        currentProgress >= 0 &&
        currentProgress <= 100

    let deltaToEstimated = 0
    let laterOrBefore = 'on time'
    if (isValidProgress) {
        const percentPerHour = currentProgress / elapsedHours
        const hoursToGo = (100 - currentProgress) / percentPerHour

        finishDate = addHours(new Date(), hoursToGo)
        deltaToEstimated = differenceInDays(finishDate, dateTo)
        laterOrBefore = deltaToEstimated > 0 ? 'after' : 'before'
    }

    return (
        <div className="flex flex-col gap-[16px] items-center sm:items-start">
            <h1 className="text-2xl">{title}</h1>
            <DatePicker onSelect={onSelectDate} />
            <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-1">
                    <p className={`font-bold ${textColor}`}>
                        {daysToGo} days left
                    </p>
                    <p className="font-bold">
                        {elapsedDays} days passed, you should be at least at{' '}
                        {progress.toFixed(2)}%
                    </p>
                    <div
                        className="grid grid-cols-2 items-center gap-x-2 col-auto"
                        style={{ gridTemplateColumns: 'auto 1fr' }}
                    >
                        <div className="flex justify-end">
                            <Label
                                className="inline font-bold"
                                htmlFor={cardID}
                            >
                                Current progress:
                            </Label>
                        </div>

                        <div>
                            <Input
                                id={cardID}
                                className="inline w-14"
                                type="text"
                                value={currentPercent}
                                onInput={(e) => {
                                    const textVal = e.currentTarget.value
                                    setCurrentPercent(textVal)
                                }}
                            />
                            <span>%</span>
                        </div>

                        <div className="font-bold flex justify-end">
                            Estimated finish date:
                        </div>
                        <div>
                            <span>{formatDate(finishDate, 'dd MMM yyyy')}</span>
                            {isValidProgress ? (
                                <span>
                                    <br />(
                                    {deltaToEstimated < 0
                                        ? -deltaToEstimated
                                        : deltaToEstimated}{' '}
                                    days {laterOrBefore} the end date)
                                </span>
                            ) : (
                                <span>
                                    <br />
                                    On time
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
