// components/ui/shadcn/Calendar22.tsx

import * as React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';

import { Button } from './button';
import { Calendar } from './calendar';
import { Label } from './label';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

interface Calendar22Props {
    value: Date | undefined;
    onChange: (date: Date | undefined) => void;
    error?: string;
    className?: string;
    classNamebg?: string; // Optional prop for background color
}

const Calendar22 = ({ value, onChange, error, className, classNamebg }: Calendar22Props) => {
    const [open, setOpen] = React.useState(false);

    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            <Label htmlFor='dob' className='px-2 text-white'>
                Date of birth <span className='text-red-400'>*</span>
            </Label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant='outline'
                        id='dob'
                        className={`max-w-full h-13 justify-between font-normal text-white border-white/10 rounded-xl  ${classNamebg}`}
                    >
                        <div className='flex items-center justify-between w-full'>
                            <div className='flex items-center w-full cursor-pointer'>
                                <span className='text-base md:text-lg lg:text-sm'>
                                    {value ? value.toLocaleDateString() : 'Select Date'}
                                </span>

                                <CalendarIcon className='ml-auto h-5 w-5 opacity-70 md:h-6 md:w-6 lg:h-7 lg:w-7 ' />
                            </div>
                        </div>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='start'>
                    <Calendar
                        mode='single'
                        selected={value}
                        captionLayout='dropdown'
                        onSelect={(date) => {
                            onChange(date);
                            setOpen(false);
                        }}
                        disabled={(date) => date > new Date()} // 🔒 Disable future dates
                    />
                </PopoverContent>
            </Popover>
            {error && <p className='text-red-400 text-xs'>{error}</p>}
        </div>
    );
};

export default Calendar22;
