import { vi } from 'vitest';
import { Control } from "react-hook-form";

export const createMockControl = (formValues = {}): Control<any> => {
  return {
    _subjects: { 
      array: { next: vi.fn(), subscribe: vi.fn(), unsubscribe: vi.fn() }, 
      state: { next: vi.fn(), subscribe: vi.fn(), unsubscribe: vi.fn() }, 
      watch: { next: vi.fn(), subscribe: vi.fn(), unsubscribe: vi.fn() } 
    },
    _removeUnmounted: vi.fn(),
    _names: { 
      mount: new Set(), 
      array: new Set(), 
      watch: new Set(), 
      unMount: new Set(), 
      focus: "", 
      watchAll: false 
    },
    _state: { 
      mount: new Set(), 
      watch: new Set(), 
      array: new Set(), 
      unMount: new Set() 
    },
    _options: { 
      mode: "onSubmit", 
      reValidateMode: "onChange", 
      shouldFocusError: true 
    },
    _formState: {
      isDirty: false,
      isValidating: false,
      isSubmitted: false,
      isSubmitting: false,
      isSubmitSuccessful: false,
      isValid: false,
      submitCount: 0,
      dirtyFields: {},
      touchedFields: {},
      errors: {},
      defaultValues: {}
    },
    _fields: {},
    _defaultValues: {},
    _formValues: formValues,
    _getWatch: vi.fn(),
    _getDirty: vi.fn(),
    _updateValid: vi.fn(),
    _updateFieldArray: vi.fn(),
    _getFieldArray: vi.fn(),
    _proxyFormState: {
      isDirty: false,
      dirtyFields: {},
      touchedFields: {},
      isValidating: false,
      isValid: false,
      errors: {}
    },
    register: vi.fn(),
    unregister: vi.fn(),
    getFieldState: vi.fn(),
    handleSubmit: vi.fn(),
    trigger: vi.fn(),
    setValue: vi.fn(),
    getValues: vi.fn(),
    reset: vi.fn(),
    resetField: vi.fn(),
    watch: vi.fn(),
    setError: vi.fn(),
    clearErrors: vi.fn(),
    setFocus: vi.fn(),
    getFieldNames: vi.fn()
  } as unknown as Control<any>;
};

class Subject {
  next = vi.fn();
  subscribe = vi.fn();
  unsubscribe = vi.fn();
}