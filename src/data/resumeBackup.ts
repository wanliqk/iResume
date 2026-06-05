import {
	DEFAULT_RESUME_FONT_SIZE_PT,
	DEFAULT_RESUME_PAGE_MARGIN_MM,
	normalizeResumeFontSize,
	normalizeResumePageMargin,
	normalizeResumeSectionPreferences,
	type ResumeFontSizePt,
	type ResumePageMarginMm,
	type ResumeSectionPreferences,
} from "./resumeStyle";
import { DEFAULT_THEME_ID, isThemeId } from "./themes";
import {
	createSectionIconVisibility,
	isRecord,
	normalizeResumeData,
	normalizeSectionIconVisibility,
} from "./resumeData";
import type { ResumeData, SectionIconVisibility } from "../types/resume";
import type { ThemeId } from "../types/theme";

export interface ResumeBackup {
	version: 5;
	data: ResumeData;
	appearance: {
		themeId: ThemeId;
		fontSizePt: ResumeFontSizePt;
		pageMarginMm: ResumePageMarginMm;
		sectionIcons: SectionIconVisibility;
		sectionPreferences: ResumeSectionPreferences;
	};
}

export interface ImportedResumeBackup {
	data: ResumeData;
	themeId?: ThemeId;
	fontSizePt?: ResumeFontSizePt;
	pageMarginMm?: ResumePageMarginMm;
	sectionIcons?: SectionIconVisibility;
	sectionPreferences?: ResumeSectionPreferences;
}

export function createResumeBackup(
	data: ResumeData,
	themeId: ThemeId,
	fontSizePt: ResumeFontSizePt,
	pageMarginMm: ResumePageMarginMm,
	sectionIcons: SectionIconVisibility,
	sectionPreferences: ResumeSectionPreferences,
): ResumeBackup {
	return {
		version: 5,
		data,
		appearance: {
			themeId,
			fontSizePt,
			pageMarginMm,
			sectionIcons,
			sectionPreferences,
		},
	};
}

export function normalizeResumeBackup(raw: unknown): ImportedResumeBackup {
	if (!isRecord(raw)) {
		throw new Error("Invalid resume backup");
	}

	const rawData = "data" in raw ? raw.data : raw;
	const appearance = isRecord(raw.appearance) ? raw.appearance : {};
	const themeValue = appearance.themeId ?? raw.themeId;
	const fontSizeValue = appearance.fontSizePt ?? raw.fontSizePt;
	const pageMarginValue = appearance.pageMarginMm ?? raw.pageMarginMm;
	const sectionIconsValue = appearance.sectionIcons ?? raw.sectionIcons;
	const sectionPreferencesValue =
		appearance.sectionPreferences ?? raw.sectionPreferences;
	const legacyProjectLinksPosition =
		appearance.projectLinksPosition ?? raw.projectLinksPosition;
	const legacyShowProjectTags =
		appearance.showProjectTags ?? raw.showProjectTags;

	const result: ImportedResumeBackup = {
		data: normalizeResumeData(rawData),
	};

	if (typeof themeValue === "string") {
		result.themeId = isThemeId(themeValue) ? themeValue : DEFAULT_THEME_ID;
	}

	if (fontSizeValue !== undefined) {
		result.fontSizePt = normalizeResumeFontSize(
			fontSizeValue ?? DEFAULT_RESUME_FONT_SIZE_PT,
		);
	}

	if (pageMarginValue !== undefined) {
		result.pageMarginMm = normalizeResumePageMargin(
			pageMarginValue ?? DEFAULT_RESUME_PAGE_MARGIN_MM,
		);
	}

	if (sectionIconsValue !== undefined) {
		result.sectionIcons = normalizeSectionIconVisibility(
			sectionIconsValue,
			createSectionIconVisibility(false),
		);
	}

	if (
		sectionPreferencesValue !== undefined ||
		legacyProjectLinksPosition !== undefined ||
		legacyShowProjectTags !== undefined
	) {
		result.sectionPreferences = normalizeResumeSectionPreferences(
			sectionPreferencesValue,
			undefined,
			{
				projectLinksPosition: legacyProjectLinksPosition,
				showProjectTags: legacyShowProjectTags,
			},
		);
	}

	return result;
}
