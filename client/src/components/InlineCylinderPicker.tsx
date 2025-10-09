import { useEffect, useRef, useState } from "react";

interface InlineCylinderPickerProps {
  items: string[] | { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  label: string;
}

export function InlineCylinderPicker({ items, value, onChange, label }: InlineCylinderPickerProps) {
  const [centeredIndex, setCenteredIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isScrollingRef = useRef(false);

  // Create infinite scrolling by repeating items
  const infiniteItems = [...items, ...items, ...items];

  useEffect(() => {
    // Find and scroll to the selected value in the middle copy
    const originalIndex = items.findIndex((item: any) => 
      typeof item === 'string' ? item === value : item.value === value
    );
    
    if (originalIndex !== -1 && scrollRef.current) {
      const itemHeight = 40;
      const middleSetIndex = items.length + originalIndex;
      scrollRef.current.scrollTop = middleSetIndex * itemHeight;
      setCenteredIndex(middleSetIndex);
    }
  }, [value, items]);

  const getCenteredIndex = (): number => {
    if (!scrollRef.current) return 0;
    const itemHeight = 40;
    const scrollTop = scrollRef.current.scrollTop;
    return Math.round(scrollTop / itemHeight);
  };

  const getValueFromIndex = (index: number): string => {
    const item = infiniteItems[Math.max(0, Math.min(index, infiniteItems.length - 1))];
    return typeof item === 'string' ? item : item.value;
  };

  const snapToNearest = () => {
    if (!scrollRef.current) return;
    const itemHeight = 40;
    const scrollTop = scrollRef.current.scrollTop;
    const index = Math.round(scrollTop / itemHeight);
    scrollRef.current.scrollTo({ top: index * itemHeight, behavior: 'smooth' });
  };

  const handleInfiniteScroll = () => {
    if (!scrollRef.current || isScrollingRef.current) return;
    
    const itemHeight = 40;
    const scrollTop = scrollRef.current.scrollTop;
    const currentIndex = Math.round(scrollTop / itemHeight);
    const originalLength = items.length;
    
    // Reset to middle section if scrolling beyond boundaries
    if (currentIndex < originalLength / 2) {
      isScrollingRef.current = true;
      scrollRef.current.scrollTop = (currentIndex + originalLength) * itemHeight;
      setTimeout(() => { isScrollingRef.current = false; }, 50);
    } else if (currentIndex >= originalLength * 2.5) {
      isScrollingRef.current = true;
      scrollRef.current.scrollTop = (currentIndex - originalLength) * itemHeight;
      setTimeout(() => { isScrollingRef.current = false; }, 50);
    }
  };

  const handleScroll = () => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      if (scrollRef.current) {
        handleInfiniteScroll();
        const selectedValue = getValueFromIndex(getCenteredIndex());
        const centeredIdx = getCenteredIndex();
        onChange(selectedValue);
        setCenteredIndex(centeredIdx);
        snapToNearest();
      }
    }, 100);
  };

  const handleClick = (item: any, idx: number) => {
    const selectedValue = typeof item === 'string' ? item : item.value;
    onChange(selectedValue);
    setCenteredIndex(idx);
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: idx * 40, behavior: 'smooth' });
    }
  };

  return (
    <div>
      <span className="font-['Inter',Helvetica] font-normal text-[#697282] text-xs block mb-1">{label}</span>
      <div className="relative h-[120px] border border-[#0000001a] rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="w-full h-10 border-t border-b border-[#6d10b0] bg-[#6d10b0]/5"></div>
        </div>
        <div 
          className="h-full overflow-y-auto scrollbar-hide" 
          ref={scrollRef} 
          onScroll={handleScroll}
        >
          <div className="py-[40px]">
            {infiniteItems.map((item, idx) => (
              <div
                key={idx}
                onClick={() => handleClick(item, idx)}
                className={`h-10 flex items-center justify-center cursor-pointer transition-colors ${
                  idx === centeredIndex 
                    ? 'font-semibold text-[#6d10b0]' 
                    : 'text-gray-600'
                }`}
              >
                {typeof item === 'string' ? item : item.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
