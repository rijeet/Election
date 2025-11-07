declare module 'react-hook-form' {
  export interface UseFormRegisterReturn {
    onChange: (...event: unknown[]) => void;
    onBlur: (...event: unknown[]) => void;
    ref: (instance: unknown) => void;
    name: string;
  }

  export interface FieldError {
    type?: string;
    message?: string;
  }

  export interface FormState {
    errors: Record<string, FieldError>;
  }

  export interface UseFormReturn<TFieldValues> {
    register: (name: unknown, options?: unknown) => UseFormRegisterReturn;
    handleSubmit: (
      callback: (values: TFieldValues) => void | Promise<void>
    ) => (event?: unknown) => Promise<void>;
    control: unknown;
    formState: FormState;
    watch: (name: unknown) => unknown | null | undefined | boolean | string | number;
    setValue: (name: unknown, value: unknown) => void;
  }

  export function useForm<TFieldValues>(options?: {
    defaultValues?: TFieldValues;
  }): UseFormReturn<TFieldValues>;

  export interface FieldArrayWithId {
    id: string;
  }

  export interface UseFieldArrayReturn {
    fields: FieldArrayWithId[];
    append: (value: unknown) => void;
    remove: (index: number) => void;
  }

  export function useFieldArray(options: {
    control: unknown;
    name: string;
  }): UseFieldArrayReturn;
}


