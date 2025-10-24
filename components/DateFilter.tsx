"use client";

import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";

import { parseAsTimestamp, useQueryState } from "nuqs";
import { DateTimePicker } from "react-datetime-picker";

export default function DatePicker() {
  const [startDate, setStartDate] = useQueryState(
    "startDate",
    parseAsTimestamp.withOptions({ shallow: false })
  );

  const handleStartChange = (date: Date | null) => {
    setStartDate(date);
  };

  const [endDate, setEndDate] = useQueryState(
    "endDate",
    parseAsTimestamp.withOptions({ shallow: false })
  );

  const handleEndChange = (date: Date | null) => {
    setEndDate(date);
  };

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <div className="relative">
        {/* Start Date */}
        <DateTimePicker
          dayPlaceholder="dd"
          hourPlaceholder="hh"
          yearPlaceholder="yyyy"
          secondPlaceholder="ss"
          minutePlaceholder="mm"
          className="px-2"
          onChange={handleStartChange}
          value={startDate}
          format="y-MM-dd hh:mm a"
          amPmAriaLabel="Select AM/PM"
          calendarAriaLabel="Toggle calendar"
          clearAriaLabel="Clear value"
          dayAriaLabel="Day"
          hourAriaLabel="Hour"
          maxDetail="second"
          minuteAriaLabel="Minute"
          monthAriaLabel="Month"
          nativeInputAriaLabel="Date and time"
          secondAriaLabel="Second"
          yearAriaLabel="Year"
        />
      </div>

      <div className="relative">
        {/* Start Date */}
        <DateTimePicker
          dayPlaceholder="dd"
          hourPlaceholder="hh"
          yearPlaceholder="yyyy"
          secondPlaceholder="ss"
          minutePlaceholder="mm"
          className="px-2"
          onChange={handleEndChange}
          value={endDate}
          format="y-MM-dd hh:mm a"
          amPmAriaLabel="Select AM/PM"
          calendarAriaLabel="Toggle calendar"
          clearAriaLabel="Clear value"
          dayAriaLabel="Day"
          hourAriaLabel="Hour"
          maxDetail="second"
          minuteAriaLabel="Minute"
          monthAriaLabel="Month"
          nativeInputAriaLabel="Date and time"
          secondAriaLabel="Second"
          yearAriaLabel="Year"
        />
      </div>
    </div>
  );
}
