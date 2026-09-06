// components/SearchInput.tsx
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import debounce from 'lodash/debounce';

interface SearchInputProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  debounceDelay?: number;
  className?: string;
  maxLength?: number;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  onSearch,
  placeholder = 'Поиск...',
  debounceDelay = 300,
  className = '',
  maxLength = 100,
}) => {
  const [value, setValue] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Дебаунс для поиска, чтобы не дергать API на каждое нажатие
  const debouncedSearch = useMemo(
    () => debounce((query: string) => onSearch(query), debounceDelay),
    [onSearch, debounceDelay]
  );

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value.slice(0, maxLength);
      setValue(newValue);
      debouncedSearch(newValue);
    },
    [debouncedSearch, maxLength]
  );

  const handleClear = useCallback(() => {
    setValue('');
    onSearch('');
    inputRef.current?.focus();
  }, [onSearch]);

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const characterCount = useMemo(
    () => `${value.length}/${maxLength}`,
    [value.length, maxLength]
  );

  return (
    <div className={`search-wrapper ${className}`}>
      <div className="search-container">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className="search-input"
          aria-label="Поиск"
          maxLength={maxLength}
        />
        
        {value && (
          <button
            onClick={handleClear}
            className="clear-button"
            type="button"
            aria-label="Очистить"
          >
            ✕
          </button>
        )}
      </div>
      
      <div className="search-footer">
        <span className="character-counter">{characterCount}</span>
      </div>
    </div>
  );
};