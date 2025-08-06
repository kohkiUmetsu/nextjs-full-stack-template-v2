import { cn } from './utils';

describe('cn', () => {
  it('should combine class names correctly', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
  });

  it('should handle conditional class names', () => {
    expect(cn('class1', true && 'class2', false && 'class3')).toBe('class1 class2');
  });

  it('should merge Tailwind CSS classes correctly', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
    expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
  });

  it('should handle mixed inputs', () => {
    expect(cn('class1', ['class2', 'class3'], { class4: true, class5: false })).toBe(
      'class1 class2 class3 class4'
    );
  });

  it('should return an empty string if no inputs are provided', () => {
    expect(cn()).toBe('');
  });

  it('should handle null and undefined inputs', () => {
    expect(cn('class1', null, undefined, 'class2')).toBe('class1 class2');
  });

  it('should handle complex Tailwind CSS class merging', () => {
    expect(cn('p-4', 'p-2', 'px-4', 'py-6')).toBe('p-2 px-4 py-6');
    expect(cn('text-lg', 'font-bold', 'text-sm')).toBe('font-bold text-sm');
  });
});
