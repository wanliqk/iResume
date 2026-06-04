import {
	Briefcase,
	Calendar,
	Code,
	ExternalLink,
	Folder,
	Github,
	Globe,
	GraduationCap,
	Mail,
	MapPin,
	MoreHorizontal,
	Phone,
} from "lucide-react";
import React, { forwardRef } from "react";
import {
	DEFAULT_RESUME_FONT_SIZE_PT,
	DEFAULT_RESUME_PAGE_MARGIN_MM,
	normalizeResumeFontSize,
	normalizeResumePageMargin,
	type ResumeFontSizePt,
	type ResumePageMarginMm,
} from "../data/resumeStyle";
import { themes } from "../data/themes";
import type {
	Education,
	Experience,
	Project,
	ResumeData,
	SectionIconVisibility,
	SectionKey,
	SkillItem,
} from "../types/resume";
import type { ContentDensity, ThemeId } from "../types/theme";
import { parseInline, renderMarkdownList } from "../utils/markdown";
import { normalizeSafeUrl } from "../utils/url";

interface ResumePreviewProps {
	data: ResumeData;
	themeId?: ThemeId;
	fontSizePt?: ResumeFontSizePt;
	pageMarginMm?: ResumePageMarginMm;
	sectionIcons?: SectionIconVisibility;
	minPageCount?: number;
	contentRef?: React.Ref<HTMLDivElement>;
}

interface BannerLinkProps {
	href?: string;
	text: string;
	icon?: React.ReactNode;
	accentClass?: string;
}

const A4_HEIGHT_MM = 297;

const densityClasses: Record<
	ContentDensity,
	{
		header: string;
		section: string;
		item: string;
		project: string;
		skillRow: string;
		list: string;
	}
> = {
	standard: {
		header: "mb-5",
		section: "mb-5",
		item: "mb-4",
		project: "mb-3",
		skillRow: "mb-2",
		list: "space-y-1.5",
	},
	compact: {
		header: "mb-4",
		section: "mb-4",
		item: "mb-3",
		project: "mb-2.5",
		skillRow: "mb-1.5",
		list: "space-y-1",
	},
	airy: {
		header: "mb-6",
		section: "mb-6",
		item: "mb-5",
		project: "mb-4",
		skillRow: "mb-2.5",
		list: "space-y-2",
	},
};

const sectionIconNodes: Record<SectionKey, React.ReactNode> = {
	skills: <Code size={13} />,
	experience: <Briefcase size={13} />,
	projects: <Folder size={13} />,
	education: <GraduationCap size={13} />,
	other: <MoreHorizontal size={13} />,
};

const splitSkillContent = (content: string) =>
	content
		.split(/[,，、;；|]/)
		.map((item) => item.trim())
		.filter(Boolean);

const hasSkillContent = (skill: SkillItem) =>
	skill.label.trim() || skill.content.trim();

const BannerLink = ({ href, text, icon, accentClass }: BannerLinkProps) => {
	const className = `flex items-center gap-1.5 text-slate-300 hover:opacity-80 ${accentClass ?? "hover:text-amber-300"}`;
	const content = (
		<>
			{icon}
			{text}
		</>
	);

	return href ? (
		<a href={href} target="_blank" rel="noreferrer" className={className}>
			{content}
		</a>
	) : (
		<span className={className}>{content}</span>
	);
};

const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>(
	function ResumePreview(
		{
			data,
			themeId = "classic",
			fontSizePt,
			pageMarginMm,
			sectionIcons,
			minPageCount = 1,
			contentRef,
		},
		ref,
	) {
		const theme = themes[themeId];
		const c = theme.colors;
		const normalizedFontSize = normalizeResumeFontSize(fontSizePt);
		const normalizedPageMargin = normalizeResumePageMargin(pageMarginMm);
		const isDefaultFontSize =
			normalizedFontSize === DEFAULT_RESUME_FONT_SIZE_PT;
		const density = theme.contentDensity ?? "standard";
		const spacing = densityClasses[density];
		const skillLayout = theme.skillLayout ?? "rows";
		const experienceStyle = theme.experienceStyle ?? "plain";
		const projectStyle = theme.projectStyle ?? "plain";
		const tagStyle = theme.tagStyle ?? "soft";
		const minHeightMm = Math.max(1, minPageCount) * A4_HEIGHT_MM;

		const previewStyle = {
			"--resume-page-margin": `${normalizedPageMargin}mm`,
			minHeight: `${minHeightMm}mm`,
			padding: `${normalizedPageMargin}mm`,
			...(isDefaultFontSize
				? {}
				: {
						"--resume-font-scale":
							normalizedFontSize / DEFAULT_RESUME_FONT_SIZE_PT,
					}),
		} as React.CSSProperties;

		const fontClass = theme.fontStyle === "serif" ? "font-serif" : "font-sans";

		const hasPhone = data.personal.phone.trim();
		const hasEmail = data.personal.email.trim();
		const hasLocation = data.personal.location.trim();
		const hasAvailability = data.personal.availability.trim();
		const hasGithub = data.personal.github.trim();
		const hasWebsite = data.personal.website.trim();
		const hasContactInfo =
			hasPhone || hasEmail || hasLocation || hasAvailability;
		const hasLinks = hasGithub || hasWebsite;

		const sectionVisible: Record<SectionKey, boolean> = {
			skills:
				data.skills.length > 0 && data.skills.some((skill) => hasSkillContent(skill)),
			experience: data.experience.length > 0,
			projects: data.projects.length > 0,
			education: data.education.length > 0,
			other: data.other.trim().length > 0,
		};

		const visibleOrder = data.sectionOrder.filter((key) => sectionVisible[key]);

		const getSectionClass = (isLast: boolean) =>
			isLast ? "" : spacing.section;

		const renderSectionTitle = (key: SectionKey) => {
			const title = data.sectionTitles[key];
			if (!sectionIcons?.[key]) return title;

			return (
				<span className="inline-flex items-center gap-1.5">
					<span className={c.muted}>{sectionIconNodes[key]}</span>
					{title}
				</span>
			);
		};

		const renderSectionHeader = (key: SectionKey) => {
			const title = renderSectionTitle(key);
			switch (theme.sectionHeaderStyle) {
				case "underline":
					return (
						<h2
							className={`text-lg font-bold ${c.heading} border-b-2 border-slate-100 mb-2 pb-1`}
						>
							{title}
						</h2>
					);

				case "left-border":
					return (
						<h2
							className={`text-lg font-bold ${c.heading} border-l-[3px] ${c.primaryBorder} pl-3 mb-3`}
						>
							{title}
						</h2>
					);

				case "pill":
					return (
						<h2 className="mb-3">
							<span
								className={`inline-block text-sm font-bold ${c.primary} ${c.primaryLight} px-3 py-1 rounded-md`}
							>
								{title}
							</span>
						</h2>
					);

				case "minimal":
					return (
						<h2
							className={`text-[11px] font-bold uppercase tracking-[0.15em] ${c.muted} border-b ${c.divider} mb-2 pb-1.5`}
						>
							{title}
						</h2>
					);

				case "dotted":
					return (
						<h2
							className={`text-base font-bold ${c.heading} border-b border-dotted ${c.divider} mb-2 pb-1`}
						>
							{title}
						</h2>
					);

				case "double-line":
					return (
						<div className="mb-3">
							<h2 className={`text-base font-bold ${c.heading} pb-1`}>
								{title}
							</h2>
							<div className="flex flex-col gap-px">
								<div className={`h-[2px] ${c.primaryBorder} border-t-2`} />
								<div className={`h-px ${c.divider} border-t`} />
							</div>
						</div>
					);

				default:
					return (
						<h2 className={`text-lg font-bold ${c.heading} mb-2`}>
							{title}
						</h2>
					);
			}
		};

		const renderContactInfo = () => {
			if (!hasContactInfo) return null;

			const items: { icon: React.ReactNode; text: string; href?: string }[] = [];
			if (hasPhone) {
				items.push({ icon: <Phone size={13} />, text: data.personal.phone });
			}
			if (hasEmail) {
				items.push({
					icon: <Mail size={13} />,
					text: data.personal.email,
					href: normalizeSafeUrl(`mailto:${data.personal.email}`),
				});
			}
			if (hasLocation) {
				items.push({
					icon: <MapPin size={13} />,
					text: data.personal.location,
				});
			}
			if (hasAvailability) {
				items.push({
					icon: <Calendar size={13} />,
					text: data.personal.availability,
				});
			}

			switch (theme.contactStyle) {
				case "icons-right":
					return (
						<div className={`text-right text-sm ${c.body} space-y-1`}>
							{items.map((item) => (
								<div
									key={item.text}
									className="flex items-center justify-end gap-2"
								>
									{item.href ? (
										<a
											href={item.href}
											className={`${c.primaryHover} hover:underline`}
										>
											{item.text}
										</a>
									) : (
										<span>{item.text}</span>
									)}
									{theme.showContactIcons && item.icon}
								</div>
							))}
						</div>
					);

				case "inline-dots":
					return (
						<div
							className={`flex flex-wrap items-center gap-x-1.5 text-sm ${c.body}`}
						>
							{items.map((item, index) => (
								<React.Fragment key={item.text}>
									{index > 0 && (
										<span className={`${c.muted} select-none`}>·</span>
									)}
									{item.href ? (
										<a
											href={item.href}
											className={`${c.primaryHover} hover:underline`}
										>
											{item.text}
										</a>
									) : (
										<span>{item.text}</span>
									)}
								</React.Fragment>
							))}
						</div>
					);

				case "inline-bar":
					return (
						<div
							className={`flex flex-wrap items-center gap-x-3 text-sm ${c.body}`}
						>
							{items.map((item, index) => (
								<React.Fragment key={item.text}>
									{index > 0 && (
										<span className={`${c.muted} select-none`}>|</span>
									)}
									<span className="flex items-center gap-1.5">
										{theme.showContactIcons && (
											<span className={c.muted}>{item.icon}</span>
										)}
										{item.href ? (
											<a
												href={item.href}
												className={`${c.primaryHover} hover:underline`}
											>
												{item.text}
											</a>
										) : (
											<span>{item.text}</span>
										)}
									</span>
								</React.Fragment>
							))}
						</div>
					);

				case "centered-icons":
					return (
						<div
							className={`flex flex-wrap justify-center items-center gap-x-5 text-sm ${c.body}`}
						>
							{items.map((item) => (
								<span key={item.text} className="flex items-center gap-1.5">
									{theme.showContactIcons && (
										<span className={c.primary}>{item.icon}</span>
									)}
									{item.href ? (
										<a
											href={item.href}
											className={`${c.primaryHover} hover:underline`}
										>
											{item.text}
										</a>
									) : (
										<span>{item.text}</span>
									)}
								</span>
							))}
						</div>
					);

				default:
					return null;
			}
		};

		const renderLinks = () => {
			if (!hasLinks) return null;

			const isCentered =
				theme.headerLayout === "centered" ||
				theme.contactStyle === "centered-icons";
			const githubHref = normalizeSafeUrl(data.personal.github);
			const websiteHref = normalizeSafeUrl(data.personal.website);
			const renderLink = (
				text: string,
				href: string | undefined,
				icon: React.ReactNode,
			) => {
				const className = `flex items-center gap-1.5 ${c.body} ${c.primaryHover}`;
				const content = (
					<>
						{theme.showLinkIcons && icon}
						{text}
					</>
				);

				return href ? (
					<a href={href} target="_blank" rel="noreferrer" className={className}>
						{content}
					</a>
				) : (
					<span className={className}>{content}</span>
				);
			};

			return (
				<div
					className={`flex flex-wrap gap-x-5 gap-y-1 mt-3 text-sm font-medium ${
						isCentered ? "justify-center" : ""
					}`}
				>
					{hasGithub &&
						renderLink(data.personal.github, githubHref, <Github size={14} />)}
					{hasWebsite &&
						renderLink(data.personal.website, websiteHref, <Globe size={14} />)}
				</div>
			);
		};

		const renderHeader = () => {
			const dividerClass =
				theme.headerDivider && (hasContactInfo || hasLinks)
					? `border-b ${c.divider} pb-4 ${spacing.header}`
					: spacing.header;
			const emailHref = normalizeSafeUrl(`mailto:${data.personal.email}`);

			switch (theme.headerLayout) {
				case "split":
					return (
						<header className={dividerClass}>
							<div
								className={`flex gap-6 ${
									hasContactInfo
										? "justify-between items-end"
										: "flex-col"
								}`}
							>
								<div>
									{data.personal.name.trim() && (
										<h1
											className={`text-3xl font-bold ${c.heading} tracking-tight`}
										>
											{data.personal.name}
										</h1>
									)}
									{data.personal.title.trim() && (
										<p className={`text-lg ${c.primary} font-medium mt-1`}>
											{data.personal.title}
										</p>
									)}
								</div>
								{renderContactInfo()}
							</div>
							{renderLinks()}
						</header>
					);

				case "centered":
					return (
						<header className={`text-center ${dividerClass}`}>
							{data.personal.name.trim() && (
								<h1
									className={`text-3xl font-bold ${c.heading} tracking-tight`}
								>
									{data.personal.name}
								</h1>
							)}
							{data.personal.title.trim() && (
								<p className={`text-base ${c.primary} font-medium mt-1`}>
									{data.personal.title}
								</p>
							)}
							{hasContactInfo && (
								<div className="mt-3">{renderContactInfo()}</div>
							)}
							{renderLinks()}
						</header>
					);

				case "accent":
					return (
						<header className={spacing.header}>
							<div className={`border-l-4 ${c.primaryBorder} pl-4`}>
								<div className="flex items-end justify-between gap-6">
									<div>
										{data.personal.name.trim() && (
											<h1
												className={`text-3xl font-bold ${c.heading} tracking-tight`}
											>
												{data.personal.name}
											</h1>
										)}
										{data.personal.title.trim() && (
											<p className={`text-base ${c.primary} font-semibold mt-1`}>
												{data.personal.title}
											</p>
										)}
									</div>
									{hasContactInfo && <div>{renderContactInfo()}</div>}
								</div>
							</div>
							{renderLinks()}
						</header>
					);

				case "banner":
					return (
						<header className={`resume-banner-header ${spacing.header}`}>
							<div
								className={`resume-banner-inner ${theme.bannerBg ?? "bg-slate-800"} text-white`}
							>
								<div className="flex justify-between items-end gap-6">
									<div>
										{data.personal.name.trim() && (
											<h1 className="text-3xl font-bold tracking-tight">
												{data.personal.name}
											</h1>
										)}
										{data.personal.title.trim() && (
											<p
												className={`${theme.bannerAccent ?? "text-amber-400"} font-medium mt-1 text-lg`}
											>
												{data.personal.title}
											</p>
										)}
									</div>
									{hasContactInfo && (
										<div className="text-right text-sm text-slate-300 space-y-1">
											{hasPhone && (
												<div className="flex items-center justify-end gap-2">
													<span>{data.personal.phone}</span>
													{theme.showContactIcons && <Phone size={13} />}
												</div>
											)}
											{hasEmail && (
												<div className="flex items-center justify-end gap-2">
													{emailHref ? (
														<a
															href={emailHref}
															className={`${theme.bannerAccent ?? "text-amber-400"} hover:opacity-80 hover:underline`}
														>
															{data.personal.email}
														</a>
													) : (
														<span>{data.personal.email}</span>
													)}
													{theme.showContactIcons && <Mail size={13} />}
												</div>
											)}
											{hasLocation && (
												<div className="flex items-center justify-end gap-2">
													<span>{data.personal.location}</span>
													{theme.showContactIcons && <MapPin size={13} />}
												</div>
											)}
											{hasAvailability && (
												<div className="flex items-center justify-end gap-2">
													<span>{data.personal.availability}</span>
													{theme.showContactIcons && <Calendar size={13} />}
												</div>
											)}
										</div>
									)}
								</div>
								{hasLinks && (
									<div className="flex flex-wrap gap-x-5 gap-y-1 mt-3 text-sm font-medium">
										{hasGithub && (
											<BannerLink
												href={normalizeSafeUrl(data.personal.github)}
												text={data.personal.github}
												icon={theme.showLinkIcons && <Github size={14} />}
												accentClass={theme.bannerAccent}
											/>
										)}
										{hasWebsite && (
											<BannerLink
												href={normalizeSafeUrl(data.personal.website)}
												text={data.personal.website}
												icon={theme.showLinkIcons && <Globe size={14} />}
												accentClass={theme.bannerAccent}
											/>
										)}
									</div>
								)}
							</div>
						</header>
					);

				default:
					return null;
			}
		};

		const renderSkillContent = (skill: SkillItem) => {
			if (skillLayout !== "chips") return parseInline(skill.content);

			const parts = splitSkillContent(skill.content);
			if (parts.length <= 1) return parseInline(skill.content);

			return (
				<span className="inline-flex flex-wrap gap-1.5 align-top">
					{parts.map((part) => (
						<span
							key={part}
							className={`rounded border ${c.tagBorder} ${c.tagBg} px-1.5 py-0.5 text-xs ${c.tagText}`}
						>
							{parseInline(part)}
						</span>
					))}
				</span>
			);
		};

		const renderSkills = (isLast: boolean) => {
			const visibleSkills = data.skills.filter(hasSkillContent);

			if (skillLayout === "columns") {
				return (
					<section key="skills" className={getSectionClass(isLast)}>
						{renderSectionHeader("skills")}
						<div className="grid grid-cols-2 gap-x-5 gap-y-2 text-sm">
							{visibleSkills.map((skill) => (
								<div key={skill.id} className="print-skill-row min-w-0">
									<div className={`font-semibold ${c.heading}`}>
										{skill.label}
									</div>
									<div className={c.body}>{parseInline(skill.content)}</div>
								</div>
							))}
						</div>
					</section>
				);
			}

			if (skillLayout === "inline") {
				return (
					<section key="skills" className={getSectionClass(isLast)}>
						{renderSectionHeader("skills")}
						<div className="text-sm">
							{visibleSkills.map((skill) => (
								<div
									key={skill.id}
									className={`print-skill-row flex flex-wrap items-baseline gap-x-2 gap-y-0.5 ${spacing.skillRow} last:mb-0`}
								>
									<span className={`font-semibold ${c.heading}`}>
										{skill.label}
									</span>
									<span className={c.body}>{parseInline(skill.content)}</span>
								</div>
							))}
						</div>
					</section>
				);
			}

			return (
				<section key="skills" className={getSectionClass(isLast)}>
					{renderSectionHeader("skills")}
					<div className="text-sm">
						{visibleSkills.map((skill) => (
							<div
								key={skill.id}
								className={`print-skill-row grid grid-cols-[100px_1fr] gap-y-0 ${spacing.skillRow} last:mb-0`}
							>
								<span className={`font-semibold ${c.heading}`}>
									{skill.label}
								</span>
								<span className={c.body}>{renderSkillContent(skill)}</span>
							</div>
						))}
					</div>
				</section>
			);
		};

		const renderExperienceHeader = (exp: Experience, compact = false) => {
			if (compact) {
				return (
					<div className="print-item-header mb-1">
						<div className="flex justify-between items-baseline gap-4">
							<h3 className={`font-bold text-base ${c.heading}`}>
								{exp.company}
								{exp.role.trim() && (
									<span className={`font-medium ${c.primary}`}>
										{" "}
										· {exp.role}
									</span>
								)}
							</h3>
							{exp.date.trim() && (
								<span className={`text-sm ${c.muted} shrink-0`}>
									{exp.date}
								</span>
							)}
						</div>
					</div>
				);
			}

			return (
				<div className="print-item-header">
					<div className="flex justify-between items-baseline mb-1 gap-4">
						<h3 className={`font-bold text-base ${c.heading}`}>
							{exp.company}
						</h3>
						{exp.date.trim() && (
							<span className={`text-sm ${c.muted} shrink-0`}>
								{exp.date}
							</span>
						)}
					</div>
					{exp.role.trim() && (
						<div className={`text-sm font-medium ${c.primary} mb-2`}>
							{exp.role}
						</div>
					)}
				</div>
			);
		};

		const renderExperienceDetails = (details: string) =>
			details.trim() ? (
				<ul
					className={`list-disc list-outside ml-4 ${spacing.list} text-sm ${c.body}`}
				>
					{renderMarkdownList(details)}
				</ul>
			) : null;

		const renderExperience = (isLast: boolean) => (
			<section key="experience" className={getSectionClass(isLast)}>
				{renderSectionHeader("experience")}
				{data.experience.map((exp) => {
					const compact = experienceStyle === "compact";
					const timeline = experienceStyle === "timeline";

					return (
						<div
							key={exp.id}
							className={`${
								timeline
									? `relative border-l ${c.divider} pl-4`
									: ""
							} ${spacing.item} last:mb-0`}
						>
							{timeline && (
								<span
									className={`absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full border-2 bg-white ${c.primaryBorder}`}
								/>
							)}
							{renderExperienceHeader(exp, compact)}
							{renderExperienceDetails(exp.details)}
						</div>
					);
				})}
			</section>
		);

		const renderProjectTag = (tags: string) => {
			const text = tags.trim();
			if (!text) return null;

			if (tagStyle === "plain") {
				return <span className={`text-xs ${c.muted}`}>{text}</span>;
			}

			return (
				<span
					className={`text-xs px-2 py-0.5 rounded border ${
						tagStyle === "outline" ? `bg-white ${c.tagText}` : `${c.tagBg} ${c.tagText}`
					} ${c.tagBorder}`}
				>
					{text}
				</span>
			);
		};

		const renderProjectLinks = (
			demoHref: string | undefined,
			sourceHref: string | undefined,
		) => {
			if (!demoHref && !sourceHref) return null;

			return (
				<div className="flex gap-3 text-xs">
					{demoHref && (
						<a
							href={demoHref}
							target="_blank"
							rel="noreferrer"
							className={`flex items-center gap-1 ${c.link} hover:underline`}
						>
							<ExternalLink size={10} /> Demo
						</a>
					)}
					{sourceHref && (
						<a
							href={sourceHref}
							target="_blank"
							rel="noreferrer"
							className={`flex items-center gap-1 ${c.link} hover:underline`}
						>
							<Github size={10} /> Code
						</a>
					)}
				</div>
			);
		};

		const renderProject = (proj: Project) => {
			const demoHref = normalizeSafeUrl(proj.link);
			const sourceHref = normalizeSafeUrl(proj.source);
			const boxed = projectStyle === "boxed";
			const compact = projectStyle === "compact";

			return (
				<div
					key={proj.id}
					className={`${boxed ? `rounded-md border ${c.divider} bg-slate-50/40 px-3 py-2.5` : ""} ${spacing.project} last:mb-0`}
				>
					<div className="print-item-header flex justify-between items-center gap-3 mb-1">
						<div className="flex min-w-0 items-center gap-2">
							<h3 className={`font-bold text-base ${c.heading}`}>
								{proj.name}
							</h3>
							{renderProjectTag(proj.tags)}
						</div>
						{renderProjectLinks(demoHref, sourceHref)}
					</div>
					{proj.description.trim() && (
						<ul
							className={`list-disc list-outside ml-4 ${
								compact ? "space-y-1" : spacing.list
							} text-sm ${c.body}`}
						>
							{renderMarkdownList(proj.description)}
						</ul>
					)}
				</div>
			);
		};

		const renderProjects = (isLast: boolean) => (
			<section key="projects" className={getSectionClass(isLast)}>
				{renderSectionHeader("projects")}
				{data.projects.map(renderProject)}
			</section>
		);

		const renderEducation = (isLast: boolean) => (
			<section key="education" className={getSectionClass(isLast)}>
				{renderSectionHeader("education")}
				{data.education.map((edu: Education) => (
					<div
						key={edu.id}
						className={`print-edu-item flex justify-between gap-4 text-sm ${spacing.skillRow} last:mb-0`}
					>
						<div>
							{edu.degree.trim() && (
								<span className={`font-bold ${c.heading}`}>{edu.degree}</span>
							)}
							{edu.degree.trim() && edu.school.trim() && (
								<span className={`mx-2 ${c.muted} opacity-40`}>|</span>
							)}
							{edu.school.trim() && (
								<span className={c.body}>{edu.school}</span>
							)}
						</div>
						{edu.date.trim() && <span className={c.muted}>{edu.date}</span>}
					</div>
				))}
			</section>
		);

		const renderOther = (isLast: boolean) => (
			<section key="other" className={getSectionClass(isLast)}>
				{renderSectionHeader("other")}
				<ul
					className={`list-disc list-outside ml-4 ${spacing.list} text-sm ${c.body}`}
				>
					{renderMarkdownList(data.other)}
				</ul>
			</section>
		);

		const sectionRenderers: Record<
			SectionKey,
			(isLast: boolean) => React.ReactElement
		> = {
			skills: renderSkills,
			experience: renderExperience,
			projects: renderProjects,
			education: renderEducation,
			other: renderOther,
		};

		return (
			<div
				ref={ref}
				className={`resume-content resume-print-root w-full bg-white ${c.body} ${fontClass} leading-relaxed text-[10.5pt]`}
				data-font-scaled={isDefaultFontSize ? undefined : "true"}
				data-page-margin={
					normalizedPageMargin === DEFAULT_RESUME_PAGE_MARGIN_MM
						? undefined
						: normalizedPageMargin
				}
				style={previewStyle}
			>
				<div ref={contentRef}>
					{renderHeader()}

					{visibleOrder.map((key, index) =>
						sectionRenderers[key](index === visibleOrder.length - 1),
					)}
				</div>
			</div>
		);
	},
);

export default ResumePreview;
