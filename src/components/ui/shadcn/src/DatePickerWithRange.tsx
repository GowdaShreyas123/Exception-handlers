import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import type { DateRange } from 'react-day-picker';
import { cn } from '../lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Button } from './button';
import { Calendar } from './calendar';

interface DatePickerWithRangeProps {
    className?: string;
    dateRange: DateRange | undefined;
    setDateRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
}

export function DatePickerWithRange({
    className,
    dateRange,
    setDateRange
}: DatePickerWithRangeProps) {
    const handleSelect = (range: DateRange | undefined) => {
        setDateRange(range);
    };

    return (
        <div className={cn('grid gap-2', className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id='date'
                        variant={'outline'}
                        className={cn(
                            'w-[600px] justify-start text-right font-normal dark:bg-black dark:border-none dark:text-white',
                            !dateRange && 'text-muted-foreground'
                        )}
                    >
                        <CalendarIcon />
                        {dateRange?.from ? (
                            dateRange.to ? (
                                <>
                                    {format(dateRange.from, 'LLL dd, y')} -{' '}
                                    {format(dateRange.to, 'LLL dd, y')}
                                </>
                            ) : (
                                format(dateRange.from, 'LLL dd, y')
                            )
                        ) : (
                            <span>Pick a date</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0 bg-black  dark:border-gray-50' align='start'>
                    <Calendar
                        initialFocus
                        mode='range'
                        selected={dateRange}
                        onSelect={handleSelect} // Use the new handler to update the date range
                        numberOfMonths={2}
                        captionLayout='dropdown'
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}
