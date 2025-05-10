'use client';
import DatePicker, { DatePickerProps } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function MyDatePicker(props: DatePickerProps) {
  const { className, ...rest } = props;

  return (
    <DatePicker
      {...rest}
      className={className || "form-control calendar-date"}
    />
  );
}
