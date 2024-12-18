import { vi } from 'vitest';
import { Control } from 'react-hook-form';

export const createMockControl = (defaultValues = {}) => {
  return {
    register: vi.fn(),
    setValue: vi.fn(),
    watch: vi.fn().mockReturnValue(defaultValues),
    _formValues: defaultValues,
  } as unknown as Control<any>;
};