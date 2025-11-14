'use client';

import { format } from 'date-fns';
import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Button } from './button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Calendar } from './calendar';
import { cn } from '../lib/utils';
import { CalendarIcon } from 'lucide-react';

const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];

const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);

export function DOBPicker({
    value,
    onChange,
    className // Accept className for dynamic styling
}: {
    value?: Date;
    onChange: (date: Date | undefined) => void;
    className?: string;
}) {
    const [open, setOpen] = useState(false);
    const [viewDate, setViewDate] = useState<Date>(value || new Date());

    const handleMonthChange = (monthIndex: number) => {
        const newDate = new Date(viewDate);
        newDate.setMonth(monthIndex);
        setViewDate(newDate);
    };

    const handleYearChange = (year: number) => {
        const newDate = new Date(viewDate);
        newDate.setFullYear(year);
        setViewDate(newDate);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant={'outline'}
                    className={cn(
                        'pl-3 text-left font-normal dark:bg-gray-900 dark:border-gray-600 dark:text-white',
                        !value && 'text-muted-foreground',
                        className // Apply className here
                    )}
                >
                    {value ? format(value, 'PPP') : <span>Pick a date</span>}
                    <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-2'>
                <div className='flex gap-2 mb-2'>
                    <Select
                        value={viewDate.getMonth().toString()}
                        onValueChange={(month) => handleMonthChange(parseInt(month))}
                    >
                        <SelectTrigger className='w-[140px]'>
                            <SelectValue placeholder='Month' />
                        </SelectTrigger>
                        <SelectContent>
                            {months.map((month, index) => (
                                <SelectItem key={index} value={index.toString()}>
                                    {month}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select
                        value={viewDate.getFullYear().toString()}
                        onValueChange={(year) => handleYearChange(parseInt(year))}
                    >
                        <SelectTrigger className='w-[100px]'>
                            <SelectValue placeholder='Year' />
                        </SelectTrigger>
                        <SelectContent>
                            {years.map((year) => (
                                <SelectItem key={year} value={year.toString()}>
                                    {year}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Calendar
                    mode='single'
                    selected={value}
                    onSelect={(date) => {
                        onChange(date);
                        setOpen(false);
                    }}
                    disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                    month={viewDate}
                    onMonthChange={setViewDate}
                />
            </PopoverContent>
        </Popover>
    );
}
