"use client";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type DatePickerExampleProps = {
  selectedTime: Date | null;
  setSelectedTime: (date: Date | null) => void;
};

export default function DatePickerExample({
  selectedTime,
  setSelectedTime,
}: DatePickerExampleProps) {
  return (
     <div className="input">
      <div className="">

        <DatePicker
          selected={selectedTime}
          onChange={(d: Date | null) => setSelectedTime(d)}
          timeInputLabel="Time:"
          dateFormat="MM/dd/yyyy"
          showTimeInput
        />
      </div>
    </div>
  );
}
