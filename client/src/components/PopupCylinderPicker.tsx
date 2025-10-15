import { useEffect, useRef, useState } from "react";

interface PopupCylinderPickerProps {
  items: string[] | { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  label: string;
  disabled?: boolean;
}

export function PopupCylinderPicker({ items, value, onChange, label, disabled = false }: PopupCylinderPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isScrollingRef = useRef(false);

  const useInfiniteScroll = items.length >= 5;
  const infiniteItems = useInfiniteScroll ? [...items, ...items, ...items] : items;

  const getInitialCenteredIndex = () => {
    const originalIndex = items.findIndex((item: any) => 
      typeof item === 'string' ? item === value : item.value === value
    );
    if (originalIndex === -1) return 0;
    return useInfiniteScroll ? items.length + originalIndex : originalIndex;
  };

  const [centeredIndex, setCenteredIndex] = useState(getInitialCenteredIndex);

  const getDisplayValue = () => {
    if (!value) return "Select";
    const item = items.find((item: any) => 
      typeof item === 'string' ? item === value : item.value === value
    );
    return typeof item === 'string' ? item : (item as any)?.label || value;
  };

  useEffect(() => {
    if (isOpen) {
      const originalIndex = items.findIndex((item: any) => 
        typeof item === 'string' ? item === value : item.value === value
      );
      
      if (originalIndex !== -1 && scrollRef.current) {
        const itemHeight = 40;
        const middleSetIndex = useInfiniteScroll ? items.length + originalIndex : originalIndex;
        scrollRef.current.scrollTop = middleSetIndex * itemHeight;
        setCenteredIndex(middleSetIndex);
      }
    }
  }, [isOpen, value, items, useInfiniteScroll]);

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
    const currentCentered = getCenteredIndex();
    setCenteredIndex(currentCentered);
    
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      if (scrollRef.current) {
        if (useInfiniteScroll) {
          handleInfiniteScroll();
        }
        snapToNearest();
      }
    }, 100);
  };

  const handleSelect = () => {
    const selectedValue = getValueFromIndex(centeredIndex);
    onChange(selectedValue);
    setIsOpen(false);
  };

  return (
    <div>
      <label className="font-['Inter',Helvetica] font-medium text-[#1d2838] text-sm block mb-1">{label}</label>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(true)}
        disabled={disabled}
        className={`w-full h-10 px-3 border border-input rounded-md bg-white flex items-center justify-between transition-colors ${
          disabled 
            ? 'opacity-50 cursor-not-allowed bg-gray-50' 
            : 'hover:bg-gray-50 cursor-pointer'
        }`}
      >
        <span className={value ? 'text-[#1d2838]' : 'text-muted-foreground'}>
          {getDisplayValue()}
        </span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => setIsOpen(false)}>
          <div className="bg-white rounded-2xl p-6 w-[90%] max-w-sm" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-[#1d2838] mb-4">Select {label}</h3>
            
            <div className="relative h-[200px] border border-[#0000001a] rounded-lg overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <div className="w-full h-10 border-t border-b border-[#6d10b0] bg-[#6d10b0]/5"></div>
              </div>
              <div 
                className="h-full overflow-y-auto scrollbar-hide" 
                ref={scrollRef} 
                onScroll={handleScroll}
                style={{ 
                  scrollbarWidth: 'none', 
                  msOverflowStyle: 'none',
                  WebkitOverflowScrolling: 'touch',
                  overscrollBehavior: 'contain'
                }}
              >
                <div className="py-[80px]">
                  {infiniteItems.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        if (idx === centeredIndex) {
                          handleSelect();
                        }
                      }}
                      className={`h-10 flex items-center justify-center cursor-pointer transition-all ${
                        idx === centeredIndex 
                          ? 'font-semibold text-[#6d10b0] text-lg' 
                          : 'text-gray-400 text-sm'
                      }`}
                    >
                      {typeof item === 'string' ? item : item.label}
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
