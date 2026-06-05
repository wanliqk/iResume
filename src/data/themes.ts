import { createSectionIconVisibility } from "./resumeData";
import type { SectionIconVisibility } from "../types/resume";
import type { ThemeConfig, ThemeId } from "../types/theme";

// ─── 经典蓝（默认） ───────────────────────────────────
const classic: ThemeConfig = {
	id: "classic",
	name: "经典蓝",
	nameEn: "Classic",
	description: "清晰专业，蓝色点缀，适合大多数求职场景",
	previewColors: ["#2563eb", "#dbeafe"],
	colors: {
		primary: "text-blue-600",
		primaryHover: "hover:text-blue-700",
		primaryLight: "bg-blue-50",
		primaryBorder: "border-blue-600",
		heading: "text-slate-900",
		body: "text-slate-700",
		muted: "text-slate-500",
		link: "text-blue-600",
		divider: "border-slate-200",
		tagBg: "bg-slate-100",
		tagText: "text-slate-600",
		tagBorder: "border-slate-200",
	},
	headerLayout: "split",
	sectionHeaderStyle: "underline",
	contactStyle: "icons-right",
	headerDivider: true,
	showLinkIcons: true,
	showContactIcons: true,
};

// ─── 极简黑白 ─────────────────────────────────────────
const minimal: ThemeConfig = {
	id: "minimal",
	name: "极简",
	nameEn: "Minimal",
	description: "纯黑白排版，零色彩干扰，让内容本身说话",
	previewColors: ["#18181b", "#f4f4f5"],
	colors: {
		primary: "text-zinc-900",
		primaryHover: "hover:text-zinc-700",
		primaryLight: "bg-zinc-50",
		primaryBorder: "border-zinc-900",
		heading: "text-zinc-900",
		body: "text-zinc-700",
		muted: "text-zinc-400",
		link: "text-zinc-700",
		divider: "border-zinc-200",
		tagBg: "bg-zinc-100",
		tagText: "text-zinc-600",
		tagBorder: "border-zinc-300",
	},
	headerLayout: "centered",
	sectionHeaderStyle: "minimal",
	contactStyle: "centered-icons",
	headerDivider: false,
	showLinkIcons: true,
	showContactIcons: true,
	contentDensity: "compact",
	skillLayout: "inline",
	experienceStyle: "compact",
	projectStyle: "compact",
	tagStyle: "plain",
};

// ─── 线框极简 ─────────────────────────────────────────
const outline: ThemeConfig = {
	id: "outline",
	name: "线框",
	nameEn: "Outline",
	description: "黑白极简搭配线性小图标，信息层级更直观",
	previewColors: ["#27272a", "#e4e4e7"],
	colors: {
		primary: "text-zinc-800",
		primaryHover: "hover:text-zinc-950",
		primaryLight: "bg-zinc-50",
		primaryBorder: "border-zinc-700",
		heading: "text-zinc-900",
		body: "text-zinc-700",
		muted: "text-zinc-500",
		link: "text-zinc-700",
		divider: "border-zinc-200",
		tagBg: "bg-white",
		tagText: "text-zinc-600",
		tagBorder: "border-zinc-300",
	},
	headerLayout: "split",
	sectionHeaderStyle: "minimal",
	contactStyle: "inline-dots",
	headerDivider: true,
	showLinkIcons: false,
	showContactIcons: false,
	showSectionIcons: true,
	contentDensity: "compact",
	skillLayout: "columns",
	experienceStyle: "plain",
	projectStyle: "boxed",
	tagStyle: "outline",
};

// ─── ATS 清晰 ────────────────────────────────────────
const ats: ThemeConfig = {
	id: "ats",
	name: "ATS 清晰",
	nameEn: "ATS",
	description: "单栏高可读，少装饰，适合投递系统与通用岗位",
	previewColors: ["#111827", "#f9fafb"],
	colors: {
		primary: "text-gray-900",
		primaryHover: "hover:text-black",
		primaryLight: "bg-gray-50",
		primaryBorder: "border-gray-800",
		heading: "text-gray-950",
		body: "text-gray-700",
		muted: "text-gray-500",
		link: "text-gray-800",
		divider: "border-gray-300",
		tagBg: "bg-white",
		tagText: "text-gray-700",
		tagBorder: "border-gray-300",
	},
	headerLayout: "split",
	sectionHeaderStyle: "underline",
	contactStyle: "inline-dots",
	headerDivider: true,
	showLinkIcons: false,
	showContactIcons: false,
	contentDensity: "compact",
	skillLayout: "inline",
	experienceStyle: "compact",
	projectStyle: "compact",
	tagStyle: "plain",
};

// ─── 时间线 ─────────────────────────────────────────
const timeline: ThemeConfig = {
	id: "timeline",
	name: "时间线",
	nameEn: "Timeline",
	description: "用细线串联经历，适合经历连续、成长路径清晰的候选人",
	previewColors: ["#1d4ed8", "#e0f2fe"],
	colors: {
		primary: "text-sky-700",
		primaryHover: "hover:text-sky-800",
		primaryLight: "bg-sky-50",
		primaryBorder: "border-sky-600",
		heading: "text-slate-950",
		body: "text-slate-700",
		muted: "text-slate-500",
		link: "text-sky-700",
		divider: "border-sky-200",
		tagBg: "bg-sky-50",
		tagText: "text-sky-800",
		tagBorder: "border-sky-200",
	},
	headerLayout: "accent",
	sectionHeaderStyle: "left-border",
	contactStyle: "inline-bar",
	headerDivider: false,
	showLinkIcons: true,
	showContactIcons: false,
	showSectionIcons: true,
	contentDensity: "standard",
	skillLayout: "columns",
	experienceStyle: "timeline",
	projectStyle: "timeline",
	tagStyle: "outline",
};

// ─── 重点突出 ───────────────────────────────────────
const focus: ThemeConfig = {
	id: "focus",
	name: "重点突出",
	nameEn: "Focus",
	description: "紧凑但有强调块，适合项目成果和关键能力需要被快速看到",
	previewColors: ["#4f46e5", "#eef2ff"],
	colors: {
		primary: "text-indigo-700",
		primaryHover: "hover:text-indigo-800",
		primaryLight: "bg-indigo-50",
		primaryBorder: "border-indigo-600",
		heading: "text-slate-950",
		body: "text-slate-700",
		muted: "text-slate-500",
		link: "text-indigo-700",
		divider: "border-indigo-100",
		tagBg: "bg-indigo-50",
		tagText: "text-indigo-700",
		tagBorder: "border-indigo-200",
	},
	headerLayout: "accent",
	sectionHeaderStyle: "pill",
	contactStyle: "inline-dots",
	headerDivider: false,
	showLinkIcons: false,
	showContactIcons: false,
	showSectionIcons: true,
	contentDensity: "compact",
	skillLayout: "chips",
	experienceStyle: "plain",
	projectStyle: "boxed",
	tagStyle: "soft",
};

// ─── 商务精英 ─────────────────────────────────────────
const executive: ThemeConfig = {
	id: "executive",
	name: "商务精英",
	nameEn: "Executive",
	description: "深色头部搭配金色点缀，沉稳权威，适合资深候选人",
	previewColors: ["#1e293b", "#d97706"],
	colors: {
		primary: "text-amber-600",
		primaryHover: "hover:text-amber-700",
		primaryLight: "bg-amber-50",
		primaryBorder: "border-amber-600",
		heading: "text-slate-900",
		body: "text-slate-700",
		muted: "text-slate-500",
		link: "text-amber-700",
		divider: "border-slate-200",
		tagBg: "bg-amber-50",
		tagText: "text-amber-800",
		tagBorder: "border-amber-200",
	},
	headerLayout: "banner",
	sectionHeaderStyle: "left-border",
	contactStyle: "inline-bar",
	headerDivider: false,
	showLinkIcons: true,
	showContactIcons: true,
	bannerBg: "bg-slate-800",
	bannerAccent: "text-amber-400",
	contentDensity: "standard",
	skillLayout: "columns",
	experienceStyle: "timeline",
	projectStyle: "timeline",
	tagStyle: "outline",
};

// ─── 清新 ─────────────────────────────────────────────
const fresh: ThemeConfig = {
	id: "fresh",
	name: "清新",
	nameEn: "Fresh",
	description: "青绿色调，轻盈现代，适合互联网与创意行业",
	previewColors: ["#0d9488", "#ccfbf1"],
	colors: {
		primary: "text-teal-600",
		primaryHover: "hover:text-teal-700",
		primaryLight: "bg-teal-50",
		primaryBorder: "border-teal-600",
		heading: "text-slate-900",
		body: "text-slate-700",
		muted: "text-slate-500",
		link: "text-teal-600",
		divider: "border-teal-100",
		tagBg: "bg-teal-50",
		tagText: "text-teal-700",
		tagBorder: "border-teal-200",
	},
	headerLayout: "centered",
	sectionHeaderStyle: "pill",
	contactStyle: "centered-icons",
	headerDivider: false,
	showLinkIcons: true,
	showContactIcons: true,
	contentDensity: "airy",
	skillLayout: "chips",
	experienceStyle: "plain",
	projectStyle: "boxed",
	tagStyle: "soft",
};

// ─── 素雅文墨 ─────────────────────────────────────────
const elegant: ThemeConfig = {
	id: "elegant",
	name: "素雅",
	nameEn: "Elegant",
	description: "温暖灰调搭配精致细节，书卷气质，适合学术与文化行业",
	previewColors: ["#57534e", "#f5f5f4"],
	colors: {
		primary: "text-stone-700",
		primaryHover: "hover:text-stone-800",
		primaryLight: "bg-stone-50",
		primaryBorder: "border-stone-400",
		heading: "text-stone-800",
		body: "text-stone-600",
		muted: "text-stone-400",
		link: "text-stone-700",
		divider: "border-stone-200",
		tagBg: "bg-stone-100",
		tagText: "text-stone-600",
		tagBorder: "border-stone-300",
	},
	headerLayout: "split",
	sectionHeaderStyle: "dotted",
	contactStyle: "icons-right",
	headerDivider: true,
	showLinkIcons: true,
	showContactIcons: true,
	contentDensity: "airy",
	skillLayout: "rows",
	experienceStyle: "timeline",
	projectStyle: "plain",
	tagStyle: "plain",
};

// ─── 单色排版 ─────────────────────────────────────────
const mono: ThemeConfig = {
	id: "mono",
	name: "单色",
	nameEn: "Mono",
	description: "克制的单色层级，适合偏正式与 ATS 友好场景",
	previewColors: ["#111827", "#e5e7eb"],
	colors: {
		primary: "text-gray-800",
		primaryHover: "hover:text-black",
		primaryLight: "bg-gray-50",
		primaryBorder: "border-gray-700",
		heading: "text-gray-950",
		body: "text-gray-700",
		muted: "text-gray-500",
		link: "text-gray-800",
		divider: "border-gray-300",
		tagBg: "bg-gray-50",
		tagText: "text-gray-700",
		tagBorder: "border-gray-300",
	},
	headerLayout: "split",
	sectionHeaderStyle: "underline",
	contactStyle: "inline-bar",
	headerDivider: true,
	showLinkIcons: false,
	showContactIcons: false,
	contentDensity: "compact",
	skillLayout: "inline",
	experienceStyle: "compact",
	projectStyle: "compact",
	tagStyle: "plain",
};

// ─── 鼠尾草绿 ─────────────────────────────────────────
const sage: ThemeConfig = {
	id: "sage",
	name: "鼠尾草",
	nameEn: "Sage",
	description: "低饱和绿色与细线标题，温和但不松散",
	previewColors: ["#4d7c0f", "#ecfccb"],
	colors: {
		primary: "text-lime-700",
		primaryHover: "hover:text-lime-800",
		primaryLight: "bg-lime-50",
		primaryBorder: "border-lime-600",
		heading: "text-stone-900",
		body: "text-stone-700",
		muted: "text-stone-500",
		link: "text-lime-700",
		divider: "border-lime-200",
		tagBg: "bg-lime-50",
		tagText: "text-lime-800",
		tagBorder: "border-lime-200",
	},
	headerLayout: "centered",
	sectionHeaderStyle: "dotted",
	contactStyle: "centered-icons",
	headerDivider: false,
	showLinkIcons: true,
	showContactIcons: false,
	contentDensity: "standard",
	skillLayout: "chips",
	experienceStyle: "plain",
	projectStyle: "boxed",
	tagStyle: "soft",
};

// ─── 玫瑰金 ──────────────────────────────────────────
const rose: ThemeConfig = {
	id: "rose",
	name: "玫瑰金",
	nameEn: "Rose",
	description: "玫瑰粉金色调，温柔细腻，适合设计、时尚与创意类岗位",
	previewColors: ["#be185d", "#fce7f3"],
	colors: {
		primary: "text-rose-600",
		primaryHover: "hover:text-rose-700",
		primaryLight: "bg-rose-50",
		primaryBorder: "border-rose-400",
		heading: "text-slate-900",
		body: "text-slate-700",
		muted: "text-slate-400",
		link: "text-rose-600",
		divider: "border-rose-100",
		tagBg: "bg-rose-50",
		tagText: "text-rose-700",
		tagBorder: "border-rose-200",
	},
	headerLayout: "centered",
	sectionHeaderStyle: "double-line",
	contactStyle: "centered-icons",
	headerDivider: false,
	showLinkIcons: true,
	showContactIcons: true,
	fontStyle: "serif",
	contentDensity: "airy",
	skillLayout: "columns",
	experienceStyle: "plain",
	projectStyle: "plain",
	tagStyle: "soft",
};

// ─── 暗夜极光 ─────────────────────────────────────────
const aurora: ThemeConfig = {
	id: "aurora",
	name: "暗夜极光",
	nameEn: "Aurora",
	description: "深色页眉搭配紫青渐变点缀，科技感十足，适合技术与游戏行业",
	previewColors: ["#1e1b4b", "#06b6d4"],
	colors: {
		primary: "text-cyan-500",
		primaryHover: "hover:text-cyan-400",
		primaryLight: "bg-indigo-50",
		primaryBorder: "border-cyan-500",
		heading: "text-slate-900",
		body: "text-slate-700",
		muted: "text-slate-400",
		link: "text-cyan-600",
		divider: "border-slate-200",
		tagBg: "bg-indigo-50",
		tagText: "text-indigo-700",
		tagBorder: "border-indigo-200",
	},
	headerLayout: "banner",
	sectionHeaderStyle: "left-border",
	contactStyle: "inline-bar",
	headerDivider: false,
	showLinkIcons: true,
	showContactIcons: true,
	bannerBg: "bg-indigo-950",
	bannerAccent: "text-cyan-400",
	contentDensity: "standard",
	skillLayout: "chips",
	experienceStyle: "timeline",
	projectStyle: "timeline",
	tagStyle: "outline",
};

// ─── 主题注册表 ───────────────────────────────────────
export const themes: Record<ThemeId, ThemeConfig> = {
	classic,
	minimal,
	outline,
	ats,
	timeline,
	focus,
	executive,
	fresh,
	elegant,
	mono,
	sage,
	rose,
	aurora,
};

// 主题 ID 有序列表（用于 UI 遍历）
export const themeIds: ThemeId[] = [
	"classic",
	"minimal",
	"outline",
	"ats",
	"timeline",
	"focus",
	"executive",
	"fresh",
	"elegant",
	"mono",
	"sage",
	"rose",
	"aurora",
];

export const isThemeId = (value: string | null): value is ThemeId =>
	themeIds.includes(value as ThemeId);

export const normalizeThemeIdList = (value: unknown): ThemeId[] => {
	if (!Array.isArray(value)) return [];

	const seen = new Set<ThemeId>();
	return value.filter((item): item is ThemeId => {
		if (typeof item !== "string" || !isThemeId(item) || seen.has(item)) {
			return false;
		}
		seen.add(item);
		return true;
	});
};

export const getDefaultSectionIconVisibility = (
	themeId: ThemeId,
): SectionIconVisibility => {
	void themeId;
	return createSectionIconVisibility(true);
};

// 默认主题
export const DEFAULT_THEME_ID: ThemeId = "classic";
