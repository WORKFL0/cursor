// Jest DOM type declarations
import '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveAttribute(attr: string, value?: string): R;
      toHaveClass(className?: string): R;
      toHaveStyle(css: string | object): R;
      toBeVisible(): R;
      toBeDisabled(): R;
      toBeEnabled(): R;
      toHaveValue(value?: string | string[] | number): R;
      toHaveDisplayValue(value: string | RegExp | string[] | RegExp[]): R;
      toBeChecked(): R;
      toHaveFocus(): R;
      toBePartiallyChecked(): R;
      toHaveDescription(text?: string | RegExp): R;
      toHaveErrorMessage(text?: string | RegExp): R;
      toBeInvalid(): R;
      toBeValid(): R;
    }
  }
}