export default function formatDateOnly(isoString: Date | string): string {
	return new Date(isoString).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}
