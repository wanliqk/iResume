export const DEFAULT_RESUME_FONT_SIZE_PT = 10.5;
export const DEFAULT_RESUME_PAGE_MARGIN_MM = 12;

export type SectionDatePosition = "right" | "below";
export type ProjectLinksPosition = "title" | "below";
export type ProjectTagPosition = "title" | "below";
export type SkillContentStyle = "theme" | "text" | "chips";
export type OtherListStyle = "bullets" | "plain";

export interface ResumeSectionPreferences {
	skills: {
		showLabels: boolean;
		contentStyle: SkillContentStyle;
	};
	experience: {
		showDates: boolean;
		datePosition: SectionDatePosition;
		showRole: boolean;
	};
	projects: {
		showDates: boolean;
		datePosition: SectionDatePosition;
		showTags: boolean;
		tagPosition: ProjectTagPosition;
		linksPosition: ProjectLinksPosition;
	};
	education: {
		showDates: boolean;
	};
	other: {
		listStyle: OtherListStyle;
	};
}

export const DEFAULT_SECTION_PREFERENCES: ResumeSectionPreferences = {
	skills: {
		showLabels: true,
		contentStyle: "theme",
	},
	experience: {
		showDates: true,
		datePosition: "right",
		showRole: true,
	},
	projects: {
		showDates: true,
		datePosition: "right",
		showTags: true,
		tagPosition: "below",
		linksPosition: "below",
	},
	education: {
		showDates: true,
	},
	other: {
		listStyle: "bullets",
	},
};

export const RESUME_FONT_SIZE_OPTIONS = [
	8.5,
	9,
	9.5,
	10,
	10.5,
	11,
	11.5,
	12,
	12.5,
	13,
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

const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === "object" && value !== null && !Array.isArray(value);

const readBoolean = (value: unknown, fallback: boolean) =>
	typeof value === "boolean" ? value : fallback;

export function normalizeSectionDatePosition(
	value: unknown,
	fallback: SectionDatePosition = "right",
): SectionDatePosition {
	return value === "right" || value === "below" ? value : fallback;
}

export function normalizeProjectLinksPosition(
	value: unknown,
	fallback: ProjectLinksPosition = "below",
): ProjectLinksPosition {
	return value === "title" || value === "below" ? value : fallback;
}

export function normalizeProjectTagPosition(
	value: unknown,
	fallback: ProjectTagPosition = "below",
): ProjectTagPosition {
	return value === "title" || value === "below" ? value : fallback;
}

export function normalizeSkillContentStyle(
	value: unknown,
	fallback: SkillContentStyle = "theme",
): SkillContentStyle {
	return value === "theme" || value === "text" || value === "chips"
		? value
		: fallback;
}

export function normalizeOtherListStyle(
	value: unknown,
	fallback: OtherListStyle = "bullets",
): OtherListStyle {
	return value === "bullets" || value === "plain" ? value : fallback;
}

export function normalizeResumeSectionPreferences(
	value: unknown,
	fallback: ResumeSectionPreferences = DEFAULT_SECTION_PREFERENCES,
	legacy?: {
		projectLinksPosition?: unknown;
		showProjectTags?: unknown;
	},
): ResumeSectionPreferences {
	const raw = isRecord(value) ? value : {};
	const skills = isRecord(raw.skills) ? raw.skills : {};
	const experience = isRecord(raw.experience) ? raw.experience : {};
	const projects = isRecord(raw.projects) ? raw.projects : {};
	const education = isRecord(raw.education) ? raw.education : {};
	const other = isRecord(raw.other) ? raw.other : {};

	return {
		skills: {
			showLabels: readBoolean(
				skills.showLabels,
				fallback.skills.showLabels,
			),
			contentStyle: normalizeSkillContentStyle(
				skills.contentStyle,
				fallback.skills.contentStyle,
			),
		},
		experience: {
			showDates: readBoolean(
				experience.showDates,
				fallback.experience.showDates,
			),
			datePosition: normalizeSectionDatePosition(
				experience.datePosition,
				fallback.experience.datePosition,
			),
			showRole: readBoolean(experience.showRole, fallback.experience.showRole),
		},
		projects: {
			showDates: readBoolean(projects.showDates, fallback.projects.showDates),
			datePosition: normalizeSectionDatePosition(
				projects.datePosition,
				fallback.projects.datePosition,
			),
			showTags: readBoolean(
				projects.showTags ?? legacy?.showProjectTags,
				fallback.projects.showTags,
			),
			tagPosition: normalizeProjectTagPosition(
				projects.tagPosition,
				fallback.projects.tagPosition,
			),
			linksPosition: normalizeProjectLinksPosition(
				projects.linksPosition ?? legacy?.projectLinksPosition,
				fallback.projects.linksPosition,
			),
		},
		education: {
			showDates: readBoolean(education.showDates, fallback.education.showDates),
		},
		other: {
			listStyle: normalizeOtherListStyle(
				other.listStyle,
				fallback.other.listStyle,
			),
		},
	};
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
