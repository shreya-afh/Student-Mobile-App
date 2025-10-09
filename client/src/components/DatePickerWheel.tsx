import { useEffect, useRef, useState } from "react";

interface DatePickerWheelProps {
  value: { day: string; month: string; year: string };
  onChange: (date: { day: string; month: string; year: string }) => void;
}

export function DatePickerWheel({ value, onChange }: DatePickerWheelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempDate, setTempDate] = useState(value);
  const [centeredIndices, setCenteredIndices] = useState({ day: 0, month: 0, year: 0 });

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

  // Create infinite scrolling by repeating items
  const infiniteDays = [...days, ...days, ...days];
  const infiniteMonths = [...months, ...months, ...months];
  const infiniteYears = [...years, ...years, ...years];

  const dayRef = useRef<HTMLDivElement>(null);
  const monthRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isScrollingRef = useRef(false);

  useEffect(() => {
    setTempDate(value);
  }, [value, isOpen]);

  const scrollToValue = (ref: HTMLDivElement | null, selectedValue: string, originalItems: any[], infiniteItems: any[]) => {
    if (!ref) return;
    const itemHeight = 40;
    const originalLength = originalItems.length;
    
    // Find index in original array
    const originalIndex = originalItems.findIndex((item: any) => 
      typeof item === 'string' ? item === selectedValue : item.value === selectedValue
    );
    
    if (originalIndex !== -1) {
      // Start at middle copy plus the index
      const middleSetIndex = originalLength + originalIndex;
      ref.scrollTop = middleSetIndex * itemHeight;
    }
  };

  const getSelectedValueFromScroll = (ref: HTMLDivElement | null, originalItems: any[], infiniteItems: any[]): string => {
    if (!ref) return typeof originalItems[0] === 'string' ? originalItems[0] : originalItems[0].value;
    const itemHeight = 40;
    const scrollTop = ref.scrollTop;
    const index = Math.round(scrollTop / itemHeight);
    const item = infiniteItems[Math.max(0, Math.min(index, infiniteItems.length - 1))];
    return typeof item === 'string' ? item : item.value;
  };

  const snapToNearest = (ref: HTMLDivElement | null) => {
    if (!ref) return;
    const itemHeight = 40;
    const scrollTop = ref.scrollTop;
    const index = Math.round(scrollTop / itemHeight);
    ref.scrollTo({ top: index * itemHeight, behavior: 'smooth' });
  };

  const handleInfiniteScroll = (ref: HTMLDivElement | null, originalLength: number) => {
    if (!ref || isScrollingRef.current) return;
    
    const itemHeight = 40;
    const scrollTop = ref.scrollTop;
    const currentIndex = Math.round(scrollTop / itemHeight);
    
    // Reset to middle section if scrolling beyond boundaries
    if (currentIndex < originalLength / 2) {
      // Scrolled too far up, jump to equivalent position in middle section
      isScrollingRef.current = true;
      ref.scrollTop = (currentIndex + originalLength) * itemHeight;
      setTimeout(() => { isScrollingRef.current = false; }, 50);
    } else if (currentIndex >= originalLength * 2.5) {
      // Scrolled too far down, jump to equivalent position in middle section
      isScrollingRef.current = true;
      ref.scrollTop = (currentIndex - originalLength) * itemHeight;
      setTimeout(() => { isScrollingRef.current = false; }, 50);
    }
  };

  const getCenteredIndex = (ref: HTMLDivElement | null): number => {
    if (!ref) return 0;
    const itemHeight = 40;
    const scrollTop = ref.scrollTop;
    return Math.round(scrollTop / itemHeight);
  };

  const handleScroll = (type: 'day' | 'month' | 'year') => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      if (type === 'day' && dayRef.current) {
        handleInfiniteScroll(dayRef.current, days.length);
        const selectedDay = getSelectedValueFromScroll(dayRef.current, days, infiniteDays);
        const centeredIdx = getCenteredIndex(dayRef.current);
        setTempDate(prev => ({ ...prev, day: selectedDay }));
        setCenteredIndices(prev => ({ ...prev, day: centeredIdx }));
        snapToNearest(dayRef.current);
      } else if (type === 'month' && monthRef.current) {
        handleInfiniteScroll(monthRef.current, months.length);
        const selectedMonth = getSelectedValueFromScroll(monthRef.current, months, infiniteMonths);
        const centeredIdx = getCenteredIndex(monthRef.current);
        setTempDate(prev => ({ ...prev, month: selectedMonth }));
        setCenteredIndices(prev => ({ ...prev, month: centeredIdx }));
        snapToNearest(monthRef.current);
      } else if (type === 'year' && yearRef.current) {
        handleInfiniteScroll(yearRef.current, years.length);
        const selectedYear = getSelectedValueFromScroll(yearRef.current, years, infiniteYears);
        const centeredIdx = getCenteredIndex(yearRef.current);
        setTempDate(prev => ({ ...prev, year: selectedYear }));
        setCenteredIndices(prev => ({ ...prev, year: centeredIdx }));
        snapToNearest(yearRef.current);
      }
    }, 100);
  };

  useEffect(() => {
    if (isOpen) {
      scrollToValue(dayRef.current, tempDate.day || '01', days, infiniteDays);
      scrollToValue(monthRef.current, tempDate.month || '01', months, infiniteMonths);
      scrollToValue(yearRef.current, tempDate.year || String(currentYear - 20), years, infiniteYears);
      
      // Set initial centered indices
      setTimeout(() => {
        setCenteredIndices({
          day: getCenteredIndex(dayRef.current),
          month: getCenteredIndex(monthRef.current),
          year: getCenteredIndex(yearRef.current),
        });
      }, 50);
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
                  {infiniteDays.map((day, idx) => (
                    <div
                      key={`day-${idx}`}
                      onClick={() => {
                        setTempDate({ ...tempDate, day });
                        setCenteredIndices(prev => ({ ...prev, day: idx }));
                        if (dayRef.current) {
                          dayRef.current.scrollTo({ top: idx * 40, behavior: 'smooth' });
                        }
                      }}
                      className={`h-10 flex items-center justify-center cursor-pointer transition-colors ${
                        idx === centeredIndices.day ? 'font-semibold text-[#6d10b0]' : 'text-gray-600'
                      }`}
                    >
                      {day}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-[2] overflow-y-auto scrollbar-hide" ref={monthRef} onScroll={() => handleScroll('month')}>
                <div className="py-[100px]">
                  {infiniteMonths.map((month, idx) => (
                    <div
                      key={`month-${idx}`}
                      onClick={() => {
                        setTempDate({ ...tempDate, month: month.value });
                        setCenteredIndices(prev => ({ ...prev, month: idx }));
                        if (monthRef.current) {
                          monthRef.current.scrollTo({ top: idx * 40, behavior: 'smooth' });
                        }
                      }}
                      className={`h-10 flex items-center justify-center cursor-pointer transition-colors ${
                        idx === centeredIndices.month ? 'font-semibold text-[#6d10b0]' : 'text-gray-600'
                      }`}
                    >
                      {month.label}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto scrollbar-hide" ref={yearRef} onScroll={() => handleScroll('year')}>
                <div className="py-[100px]">
                  {infiniteYears.map((year, idx) => (
                    <div
                      key={`year-${idx}`}
                      onClick={() => {
                        setTempDate({ ...tempDate, year });
                        setCenteredIndices(prev => ({ ...prev, year: idx }));
                        if (yearRef.current) {
                          yearRef.current.scrollTo({ top: idx * 40, behavior: 'smooth' });
                        }
                      }}
                      className={`h-10 flex items-center justify-center cursor-pointer transition-colors ${
                        idx === centeredIndices.year ? 'font-semibold text-[#6d10b0]' : 'text-gray-600'
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
