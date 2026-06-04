export const DEFAULT_RESUME_FONT_SIZE_PT = 10.5;
export const DEFAULT_RESUME_PAGE_MARGIN_MM = 12;

export const RESUME_FONT_SIZE_OPTIONS = [
	9.5,
	10,
	10.5,
	11,
	11.5,
	12,
] as const;

export type ResumeFontSizePt = (typeof RESUME_FONT_SIZE_OPTIONS)[number];

export const RESUME_PAGE_MARGIN_OPTIONS = [8, 10, 12, 14, 16] as const;

export type ResumePageMarginMm = (typeof RESUME_PAGE_MARGIN_OPTIONS)[number];

export function isResumeFontSizePt(value: number): value is ResumeFontSizePt {
	return RESUME_FONT_SIZE_OPTIONS.some((option) => option === value);
}

export function normalizeResumeFontSize(value: unknown): ResumeFontSizePt {
	const numericValue =
		typeof value === "string" || typeof value === "number"
			? Number(value)
			: DEFAULT_RESUME_FONT_SIZE_PT;

	return isResumeFontSizePt(numericValue)
		? numericValue
		: DEFAULT_RESUME_FONT_SIZE_PT;
}

export function isResumePageMarginMm(
	value: number,
): value is ResumePageMarginMm {
	return RESUME_PAGE_MARGIN_OPTIONS.some((option) => option === value);
}

export function normalizeResumePageMargin(
	value: unknown,
): ResumePageMarginMm {
	const numericValue =
		typeof value === "string" || typeof value === "number"
			? Number(value)
			: DEFAULT_RESUME_PAGE_MARGIN_MM;

	return isResumePageMarginMm(numericValue)
		? numericValue
		: DEFAULT_RESUME_PAGE_MARGIN_MM;
}

export function getAdjacentResumeFontSize(
	value: ResumeFontSizePt,
	direction: "smaller" | "larger",
): ResumeFontSizePt {
	const index = RESUME_FONT_SIZE_OPTIONS.indexOf(value);
	const nextIndex = direction === "smaller" ? index - 1 : index + 1;
	const clampedIndex = Math.min(
		Math.max(nextIndex, 0),
		RESUME_FONT_SIZE_OPTIONS.length - 1,
	);

	return RESUME_FONT_SIZE_OPTIONS[clampedIndex];
}

export function getAdjacentResumePageMargin(
	value: ResumePageMarginMm,
	direction: "smaller" | "larger",
): ResumePageMarginMm {
	const index = RESUME_PAGE_MARGIN_OPTIONS.indexOf(value);
	const nextIndex = direction === "smaller" ? index - 1 : index + 1;
	const clampedIndex = Math.min(
		Math.max(nextIndex, 0),
		RESUME_PAGE_MARGIN_OPTIONS.length - 1,
	);

	return RESUME_PAGE_MARGIN_OPTIONS[clampedIndex];
}
