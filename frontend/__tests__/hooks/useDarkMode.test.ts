import { renderHook, act } from '@testing-library/react';
import { useDarkMode } from '@/hooks/useDarkMode';

describe('useDarkMode Hook', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('initializes with light mode by default', () => {
    const { result } = renderHook(() => useDarkMode());
    expect(result.current.isDark).toBe(false);
  });

  it('toggles dark mode', () => {
    const { result } = renderHook(() => useDarkMode());
    
    act(() => {
      result.current.toggleDarkMode();
    });
    
    expect(result.current.isDark).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('persists dark mode preference in localStorage', () => {
    const { result } = renderHook(() => useDarkMode());
    
    act(() => {
      result.current.toggleDarkMode();
    });
    
    expect(localStorage.getItem('darkMode')).toBe('true');
  });
});
