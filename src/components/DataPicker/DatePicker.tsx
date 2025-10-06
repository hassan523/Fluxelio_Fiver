"use client";

import React, {useState, useCallback} from "react";
import {Calendar, ChevronDown, ChevronUp} from "lucide-react";
import {Button} from "@/components/ui/button";
import {DropdownMenu, DropdownMenuContent, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";

interface DatePickerProps {
	onDateChange: (date: {month: number; year: number; day?: number}) => void;
	initialDate?: {month: number; year: number; day?: number};
	includeDay?: boolean;
	includeMonth?: boolean;
	placeholder?: string;
	className?: string;
	disabled?: boolean;
}

const DatePicker: React.FC<DatePickerProps> = ({onDateChange, initialDate, includeDay = false, includeMonth = true, placeholder = "Select Date", className = "", disabled = false}) => {
	const currentDate = new Date();
	const currentMonth = currentDate.getMonth();
	const currentYear = currentDate.getFullYear();

	const [selectedMonth, setSelectedMonth] = useState<number>(initialDate?.month ?? currentMonth);
	const [selectedYear, setSelectedYear] = useState<number>(initialDate?.year ?? currentYear);
	const [selectedDay, setSelectedDay] = useState<number | undefined>(initialDate?.day);
	const [isOpen, setIsOpen] = useState(false);

	const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

	const years = Array.from({length: 10}, (_, i) => currentYear - 5 + i);

	const getDaysInMonth = useCallback((month: number, year: number) => {
		return new Date(year, month + 1, 0).getDate();
	}, []);

	const daysInSelectedMonth = getDaysInMonth(selectedMonth, selectedYear);
	const days = Array.from({length: daysInSelectedMonth}, (_, i) => i + 1);

	const notifyDateChange = useCallback(
		(month: number, year: number, day?: number) => {
			const dateData = {
				month,
				year,
				...(includeDay && day && {day}),
			};
			onDateChange(dateData);
		},
		[onDateChange, includeDay]
	);

	const handleMonthChange = (month: number) => {
		setSelectedMonth(month);
		// Reset day if it's invalid for the new month
		let newDay = selectedDay;
		if (selectedDay && selectedDay > getDaysInMonth(month, selectedYear)) {
			newDay = undefined;
			setSelectedDay(undefined);
		}
		notifyDateChange(month, selectedYear, newDay);
	};

	const handleYearChange = (year: number) => {
		setSelectedYear(year);
		// Reset day if it's invalid for the new year (leap year considerations)
		let newDay = selectedDay;
		if (selectedDay && selectedDay > getDaysInMonth(selectedMonth, year)) {
			newDay = undefined;
			setSelectedDay(undefined);
		}
		notifyDateChange(selectedMonth, year, newDay);
	};

	const handleDayChange = (day: number | undefined) => {
		setSelectedDay(day);
		notifyDateChange(selectedMonth, selectedYear, day);
	};

	const formatDisplayValue = () => {
		if (includeDay && selectedDay) {
			return `${months[selectedMonth]} ${selectedDay}, ${selectedYear}`;
		} else if (includeMonth) {
			return `${months[selectedMonth]}, ${selectedYear}`;
		}
		return `${selectedYear}`;
	};

	return (
		<DropdownMenu
			open={isOpen}
			onOpenChange={setIsOpen}
		>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					className={`w-full justify-between border dark:border-textColorDark border-textColorLight bg-transparent ${className}`}
					disabled={disabled}
				>
					<div className="flex items-center gap-2">
						<Calendar
							size={16}
							className="text-gray-500"
						/>
						<span className={formatDisplayValue() === placeholder ? "text-gray-500" : ""}>{formatDisplayValue() || placeholder}</span>
					</div>
					{isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="end"
				className="w-96 max-w-[90vw] p-4"
			>
				<div className="space-y-4">
					{/* Month Selection */}
					{includeMonth && (
						<div>
							<label className="text-sm font-medium mb-2 block">Month</label>
							<div className="grid grid-cols-3 gap-1">
								{months.map((month, index) => (
									<Button
										key={month}
										variant={selectedMonth === index ? "default" : "outline"}
										size="sm"
										className="text-xs"
										onClick={() => handleMonthChange(index)}
									>
										{month.slice(0, 3)}
									</Button>
								))}
							</div>
						</div>
					)}

					{/* Year Selection */}
					<div>
						<label className="text-sm font-medium mb-2 block">Year</label>
						<div className="grid grid-cols-3 gap-1">
							{years.map((year) => (
								<Button
									key={year}
									variant={selectedYear === year ? "default" : "outline"}
									size="sm"
									className="text-xs"
									onClick={() => handleYearChange(year)}
								>
									{year}
								</Button>
							))}
						</div>
					</div>

					{/* Day Selection (Optional) */}
					{includeDay && (
						<div>
							<label className="text-sm font-medium mb-2 block">Day (Optional)</label>
							<div className="grid grid-cols-7 gap-1 max-h-32 overflow-y-auto">
								{days.map((day) => (
									<Button
										key={day}
										variant={selectedDay === day ? "default" : "outline"}
										size="sm"
										className="text-xs h-8 w-8 p-0"
										onClick={() => handleDayChange(selectedDay === day ? undefined : day)}
									>
										{day}
									</Button>
								))}
							</div>
						</div>
					)}

					{/* Quick Actions */}
					<div className="flex flex-wrap gap-2 pt-2 border-t">
						{includeMonth && (
							<Button
								variant="outline"
								size="sm"
								onClick={() => {
									setSelectedMonth(currentMonth);
									setSelectedYear(currentYear);
									setSelectedDay(undefined);
									notifyDateChange(currentMonth, currentYear, undefined);
								}}
								className="text-xs"
							>
								Current Month
							</Button>
						)}
						{includeMonth && (
							<Button
								variant="outline"
								size="sm"
								onClick={() => {
									setSelectedMonth(currentMonth);
									setSelectedYear(currentYear);
									setSelectedDay(currentDate.getDate());
									notifyDateChange(currentMonth, currentYear, currentDate.getDate());
								}}
								className="text-xs"
							>
								Today
							</Button>
						)}
						<Button
							variant="outline"
							size="sm"
							onClick={() => {
								if (includeMonth) {
									const newMonth = selectedMonth === 0 ? 11 : selectedMonth - 1;
									const newYear = selectedMonth === 0 ? selectedYear - 1 : selectedYear;
									setSelectedMonth(newMonth);
									setSelectedYear(newYear);
									notifyDateChange(newMonth, newYear, selectedDay);
								} else {
									const newYear = selectedYear - 1;
									setSelectedYear(newYear);
									notifyDateChange(selectedMonth, newYear, selectedDay);
								}
							}}
							className="text-xs"
						>
							Previous
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => {
								if (includeMonth) {
									const newMonth = selectedMonth === 11 ? 0 : selectedMonth + 1;
									const newYear = selectedMonth === 11 ? selectedYear + 1 : selectedYear;
									setSelectedMonth(newMonth);
									setSelectedYear(newYear);
									notifyDateChange(newMonth, newYear, selectedDay);
								} else {
									const newYear = selectedYear + 1;
									setSelectedYear(newYear);
									notifyDateChange(selectedMonth, newYear, selectedDay);
								}
							}}
							className="text-xs"
						>
							Next
						</Button>
					</div>
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default DatePicker;
