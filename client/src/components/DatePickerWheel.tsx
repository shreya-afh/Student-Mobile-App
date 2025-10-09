import { useEffect, useRef, useState } from "react";

interface DatePickerWheelProps {
  value: { day: string; month: string; year: string };
  onChange: (date: { day: string; month: string; year: string }) => void;
}

export function DatePickerWheel({ value, onChange }: DatePickerWheelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempDate, setTempDate] = useState(value);

  const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => String(currentYear - i));

  const dayRef = useRef<HTMLDivElement>(null);
  const monthRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setTempDate(value);
  }, [value, isOpen]);

  const scrollToValue = (ref: HTMLDivElement | null, selectedValue: string, items: string[]) => {
    if (!ref) return;
    const index = items.indexOf(selectedValue);
    if (index !== -1) {
      const itemHeight = 40;
      ref.scrollTop = index * itemHeight;
    }
  };

  const getSelectedValueFromScroll = (ref: HTMLDivElement | null, items: string[]): string => {
    if (!ref) return items[0];
    const itemHeight = 40;
    const scrollTop = ref.scrollTop;
    const index = Math.round(scrollTop / itemHeight);
    return items[Math.max(0, Math.min(index, items.length - 1))];
  };

  const snapToNearest = (ref: HTMLDivElement | null) => {
    if (!ref) return;
    const itemHeight = 40;
    const scrollTop = ref.scrollTop;
    const index = Math.round(scrollTop / itemHeight);
    ref.scrollTo({ top: index * itemHeight, behavior: 'smooth' });
  };

  const handleScroll = (type: 'day' | 'month' | 'year') => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      if (type === 'day' && dayRef.current) {
        const selectedDay = getSelectedValueFromScroll(dayRef.current, days);
        setTempDate(prev => ({ ...prev, day: selectedDay }));
        snapToNearest(dayRef.current);
      } else if (type === 'month' && monthRef.current) {
        const selectedMonth = getSelectedValueFromScroll(monthRef.current, months.map(m => m.value));
        setTempDate(prev => ({ ...prev, month: selectedMonth }));
        snapToNearest(monthRef.current);
      } else if (type === 'year' && yearRef.current) {
        const selectedYear = getSelectedValueFromScroll(yearRef.current, years);
        setTempDate(prev => ({ ...prev, year: selectedYear }));
        snapToNearest(yearRef.current);
      }
    }, 100);
  };

  useEffect(() => {
    if (isOpen) {
      scrollToValue(dayRef.current, tempDate.day || '01', days);
      scrollToValue(monthRef.current, tempDate.month || '01', months.map(m => m.value));
      scrollToValue(yearRef.current, tempDate.year || String(currentYear - 20), years);
    }
  }, [isOpen]);

  const handleDone = () => {
    onChange(tempDate);
    setIsOpen(false);
  };

  const displayText = value.day && value.month && value.year
    ? `${value.day}/${value.month}/${value.year}`
    : "Select Date of Birth";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full h-10 px-3 py-2 text-sm rounded-md border border-input bg-transparent text-left font-['Inter',Helvetica] focus:outline-none focus:ring-1 focus:ring-ring"
      >
        <span className={value.day && value.month && value.year ? "text-foreground" : "text-muted-foreground"}>
          {displayText}
        </span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50" onClick={() => setIsOpen(false)}>
          <div className="bg-white w-full max-w-md rounded-t-2xl pb-safe" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-[#6d10b0] font-['Inter',Helvetica] font-medium"
              >
                Cancel
              </button>
              <span className="font-['Inter',Helvetica] font-semibold text-[#1d2838]">Date of Birth</span>
              <button
                type="button"
                onClick={handleDone}
                className="text-[#6d10b0] font-['Inter',Helvetica] font-medium"
              >
                Done
              </button>
            </div>

            <div className="flex h-[240px] relative">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-full h-10 border-t border-b border-gray-300 bg-gray-50/30"></div>
              </div>

              <div className="flex-1 overflow-y-auto scrollbar-hide" ref={dayRef} onScroll={() => handleScroll('day')}>
                <div className="py-[100px]">
                  {days.map((day) => (
                    <div
                      key={day}
                      onClick={() => setTempDate({ ...tempDate, day })}
                      className={`h-10 flex items-center justify-center cursor-pointer transition-colors ${
                        tempDate.day === day ? 'font-semibold text-[#6d10b0]' : 'text-gray-600'
                      }`}
                    >
                      {day}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-[2] overflow-y-auto scrollbar-hide" ref={monthRef} onScroll={() => handleScroll('month')}>
                <div className="py-[100px]">
                  {months.map((month) => (
                    <div
                      key={month.value}
                      onClick={() => setTempDate({ ...tempDate, month: month.value })}
                      className={`h-10 flex items-center justify-center cursor-pointer transition-colors ${
                        tempDate.month === month.value ? 'font-semibold text-[#6d10b0]' : 'text-gray-600'
                      }`}
                    >
                      {month.label}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto scrollbar-hide" ref={yearRef} onScroll={() => handleScroll('year')}>
                <div className="py-[100px]">
                  {years.map((year) => (
                    <div
                      key={year}
                      onClick={() => setTempDate({ ...tempDate, year })}
                      className={`h-10 flex items-center justify-center cursor-pointer transition-colors ${
                        tempDate.year === year ? 'font-semibold text-[#6d10b0]' : 'text-gray-600'
                      }`}
                    >
                      {year}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
