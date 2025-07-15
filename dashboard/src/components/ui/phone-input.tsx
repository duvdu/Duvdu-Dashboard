import { cn, formatPhoneNumberInput, isValidEgyptianPhone } from "@/lib/utils";
import * as React from "react";
import { Input } from "./input";
import { Label } from "./label";

export interface PhoneInputProps
  extends Omit<
    React.ComponentProps<typeof Input>,
    "type" | "maxLength" | "onChange"
  > {
  onChange?: (value: string, isValid: boolean) => void;
  showValidationStyles?: boolean;
  showCountryCode?: boolean;
  hasLabel?: boolean;
  label?: string;
}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      className,
      onChange,
      showValidationStyles = true,
      showCountryCode = true,
      value: controlledValue,
      hasLabel = true,
      label = "Phone Number",
      ...props
    },
    ref
  ) => {
    const [valueState, setValueState] = React.useState<string>("");

    // Handle both controlled and uncontrolled scenarios
    const internalValue =
      controlledValue !== undefined ? String(controlledValue) : valueState;

    // Function to transform the internal value for display (hide leading 0)
    const getDisplayValue = (val: string): string => {
      if (!val) return "";
      return val.startsWith("0") ? val.substring(1) : val;
    };

    // Display value with leading 0 removed
    const displayValue = getDisplayValue(internalValue);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      // Add leading 0 if user entered a number starting with 1
      const valueToFormat =
        inputValue.startsWith("1") && !inputValue.startsWith("01")
          ? "0" + inputValue
          : inputValue;

      const formattedValue = formatPhoneNumberInput(valueToFormat);
      const isValidPhone = isValidEgyptianPhone(formattedValue);

      if (controlledValue === undefined) {
        setValueState(formattedValue);
      }

      if (onChange) {
        onChange(formattedValue, isValidPhone);
      }
    };

    // Special handler for paste events to process them before maxLength is applied
    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();

      const pastedText = e.clipboardData.getData("text");
      const formattedValue = formatPhoneNumberInput(pastedText);
      const isValidPhone = isValidEgyptianPhone(formattedValue);

      if (controlledValue === undefined) {
        setValueState(formattedValue);
      }

      if (onChange) {
        onChange(formattedValue, isValidPhone);
      }
    };

    return (
      <>
        {hasLabel && (
          <Label htmlFor="phone" className="font-medium">
            {label}
          </Label>
        )}
        <div className="relative flex items-center">
          {showCountryCode && (
            <div className="absolute left-3 flex items-center gap-1 pointer-events-none">
              <span className="text-muted-foreground text-sm">+20</span>
            </div>
          )}
          <Input
            type="tel"
            inputMode="tel"
            name="phone"
            id="phone"
            maxLength={10} // 10 digits after removing leading 0
            className={cn(
              "rounded-md",
              showCountryCode && "pl-12",
              showValidationStyles && internalValue && className
            )}
            value={displayValue}
            onChange={handleInputChange}
            onPaste={handlePaste}
            placeholder="1XXXXXXXXX"
            ref={ref}
            {...props}
          />
        </div>
      </>
    );
  }
);

PhoneInput.displayName = "PhoneInput";

export { PhoneInput };
