import { Control } from "react-hook-form";

export const createMockControl = (formValues = {}): Control<any> => {
  return {
    _subjects: { array: new Subject(), state: new Subject(), watch: new Subject() },
    _removeUnmounted: jest.fn(),
    _names: { mount: new Set(), array: new Set(), watch: new Set(), unMount: new Set(), focus: "", watchAll: false },
    _state: { mount: new Set(), watch: new Set(), array: new Set(), unMount: new Set() },
    _options: { mode: "onSubmit", reValidateMode: "onChange", shouldFocusError: true },
    _formState: { isDirty: false, isValidating: false, isSubmitted: false, isSubmitting: false, isSubmitSuccessful: false, isValid: false, submitCount: 0, dirtyFields: {}, touchedFields: {}, errors: {}, defaultValues: {} },
    _fields: {},
    _defaultValues: {},
    _formValues: formValues,
    _getWatch: jest.fn(),
    _getDirty: jest.fn(),
    _updateValid: jest.fn(),
    _updateFieldArray: jest.fn(),
    _getFieldArray: jest.fn(),
    _subjects: {
      watch: { next: jest.fn() },
      array: { next: jest.fn() },
      state: { next: jest.fn() }
    },
    _proxyFormState: {
      isDirty: false,
      dirtyFields: {},
      touchedFields: {},
      isValidating: false,
      isValid: false,
      errors: {}
    },
    register: jest.fn(),
    unregister: jest.fn(),
    getFieldState: jest.fn(),
    handleSubmit: jest.fn(),
    trigger: jest.fn(),
    setValue: jest.fn(),
    getValues: jest.fn(),
    reset: jest.fn(),
    resetField: jest.fn(),
    watch: jest.fn(),
    setError: jest.fn(),
    clearErrors: jest.fn(),
    setFocus: jest.fn(),
    getFieldNames: jest.fn()
  } as unknown as Control<any>;
};

class Subject {
  next = jest.fn();
  subscribe = jest.fn();
  unsubscribe = jest.fn();
}