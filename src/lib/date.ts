export const getFormattedDate = (date: Date): string => {
	// TZ adjustment for date-only values from database
	const adjustedDate = new Date(date);
	adjustedDate.setMinutes(
		adjustedDate.getMinutes() + adjustedDate.getTimezoneOffset(),
	);

	const formatter = new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
		weekday: "short",
	});

	return formatter.format(adjustedDate);
};

export const isTuesday = (date: Date): boolean => {
	const adjustedDate = new Date(date);
	adjustedDate.setMinutes(
		adjustedDate.getMinutes() + adjustedDate.getTimezoneOffset(),
	);
	return adjustedDate.getDay() === 2;
};
