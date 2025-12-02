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
     <div className="flex items-center gap-4 max-w-lg">
      <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
        Select a date:
      </label>

      <div className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 shadow-sm hover:border-blue-400 focus-within:border-blue-500 transition">

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
