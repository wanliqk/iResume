import {
	Download,
	Github,
	ImageDown,
	Printer,
	RotateCcw,
	Tags,
	TrendingUp,
	Upload,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import FontSizeControl from "./components/FontSizeControl";
import PageMarginControl from "./components/PageMarginControl";
import ResumeEditor from "./components/ResumeEditor";
import ResumeManager from "./components/ResumeManager";
import ResumePreview from "./components/ResumePreview";
import ThemePicker from "./components/ThemePicker";
import {
	createResumeBackup,
	normalizeResumeBackup,
} from "./data/resumeBackup";
import {
	normalizeResumeData,
	normalizeSectionIconVisibility,
} from "./data/resumeData";
import {
	createResumeDocument,
	createResumeLibrary,
	incrementResumePatchVersion,
	normalizeResumeAppearance,
	normalizeResumeLibrary,
	normalizeResumeTags,
	normalizeResumeVersion,
	type ResumeDocument,
	type ResumeLibrary,
} from "./data/resumeLibrary";
import {
	DEFAULT_RESUME_FONT_SIZE_PT,
	DEFAULT_RESUME_PAGE_MARGIN_MM,
	normalizeResumeFontSize,
	normalizeResumePageMargin,
	type ResumeFontSizePt,
	type ResumePageMarginMm,
} from "./data/resumeStyle";
import {
	DEFAULT_THEME_ID,
	getDefaultSectionIconVisibility,
	isThemeId,
	normalizeThemeIdList,
} from "./data/themes";
import type { ResumeData, SectionIconVisibility } from "./types/resume";
import type { ThemeId } from "./types/theme";

const STORAGE_KEY = "resume-data";
const THEME_STORAGE_KEY = "resume-theme";
const FONT_SIZE_STORAGE_KEY = "resume-font-size";
const PAGE_MARGIN_STORAGE_KEY = "resume-page-margin";
const SECTION_ICONS_STORAGE_KEY = "resume-section-icons";
const FAVORITE_THEMES_STORAGE_KEY = "resume-favorite-themes";
const LIBRARY_STORAGE_KEY = "resume-library";
const A4_HEIGHT_MM = 297;
const A4_WIDTH_MM = 210;

const getPrintablePageHeightMm = (pageMarginMm: ResumePageMarginMm) =>
	A4_HEIGHT_MM - pageMarginMm * 2;

type AppView = "manager" | "editor";

interface ResumeMetaEditorProps {
	document: ResumeDocument;
	onUpdate: (
		meta: Partial<Pick<ResumeDocument, "name" | "tags" | "version">>,
	) => void;
}

const metaInputClass =
	"w-full rounded-md border border-slate-200 bg-white px-2.5 py-2 text-sm text-slate-700 outline-none transition focus:border-transparent focus:ring-2 focus:ring-blue-500";

const ResumeMetaEditor = ({ document, onUpdate }: ResumeMetaEditorProps) => (
	<div className="border-b border-slate-200 bg-white p-4 sm:p-5 lg:p-6">
		<div className="mb-3">
			<h2 className="text-sm font-bold text-slate-800">简历信息</h2>
			<p className="mt-1 text-xs text-slate-400">
				管理名称、标签和版本号
			</p>
		</div>

		<label className="mb-3 block">
			<span className="mb-1 block text-xs font-medium text-slate-500">
				简历名称
			</span>
			<input
				value={document.name}
				onChange={(event) => onUpdate({ name: event.target.value })}
				className={metaInputClass}
			/>
		</label>

		<div className="mb-3 grid grid-cols-[1fr_auto] gap-2">
			<label className="block">
				<span className="mb-1 block text-xs font-medium text-slate-500">
					版本号
				</span>
				<input
					value={document.version}
					onChange={(event) => onUpdate({ version: event.target.value })}
					className={`${metaInputClass} font-mono tabular-nums`}
				/>
			</label>
			<button
				type="button"
				onClick={() =>
					onUpdate({ version: incrementResumePatchVersion(document.version) })
				}
				className="mt-5 flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-400 transition hover:bg-slate-50 hover:text-blue-600"
				title="版本 +0.0.1"
				aria-label="版本 +0.0.1"
			>
				<TrendingUp size={15} />
			</button>
		</div>

		<label className="block">
			<span className="mb-1 block text-xs font-medium text-slate-500">
				标签
			</span>
			<div className="relative">
				<Tags
					size={14}
					className="pointer-events-none absolute left-2.5 top-2.5 text-slate-300"
				/>
				<input
					key={document.id}
					defaultValue={document.tags.join(", ")}
					onBlur={(event) =>
						onUpdate({ tags: normalizeResumeTags(event.target.value) })
					}
					onKeyDown={(event) => {
						if (event.key === "Enter") event.currentTarget.blur();
					}}
					className={`${metaInputClass} pl-8`}
					placeholder="前端, 社招, 北京"
				/>
			</div>
		</label>
	</div>
);

function readLegacyResumeDocument(): ResumeDocument {
	const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
	const themeId = isThemeId(savedTheme) ? savedTheme : DEFAULT_THEME_ID;
	const fallbackIcons = getDefaultSectionIconVisibility(themeId);
	const savedSectionIcons = localStorage.getItem(SECTION_ICONS_STORAGE_KEY);
	let sectionIcons = fallbackIcons;

	if (savedSectionIcons) {
		try {
			sectionIcons = normalizeSectionIconVisibility(
				JSON.parse(savedSectionIcons),
				fallbackIcons,
			);
		} catch {
			sectionIcons = fallbackIcons;
		}
	}

	let data: ResumeData | undefined;
	const savedData = localStorage.getItem(STORAGE_KEY);
	if (savedData) {
		try {
			data = normalizeResumeData(JSON.parse(savedData));
		} catch (error) {
			console.error("Failed to parse resume data", error);
		}
	}

	return createResumeDocument({
		name: data?.personal.name.trim() || "默认简历",
		data,
		appearance: {
			themeId,
			fontSizePt: normalizeResumeFontSize(
				localStorage.getItem(FONT_SIZE_STORAGE_KEY) ??
					DEFAULT_RESUME_FONT_SIZE_PT,
			),
			pageMarginMm: normalizeResumePageMargin(
				localStorage.getItem(PAGE_MARGIN_STORAGE_KEY) ??
					DEFAULT_RESUME_PAGE_MARGIN_MM,
			),
			sectionIcons,
		},
	});
}

function readInitialLibrary(): ResumeLibrary {
	const legacyDocument = readLegacyResumeDocument();
	const savedLibrary = localStorage.getItem(LIBRARY_STORAGE_KEY);
	if (savedLibrary) {
		try {
			return normalizeResumeLibrary(JSON.parse(savedLibrary), legacyDocument);
		} catch {
			return createResumeLibrary([legacyDocument], legacyDocument.id);
		}
	}

	return createResumeLibrary([legacyDocument], legacyDocument.id);
}

function App() {
	const importInputRef = useRef<HTMLInputElement>(null);
	const resumePreviewRef = useRef<HTMLDivElement>(null);
	const resumePreviewInnerRef = useRef<HTMLDivElement>(null);
	const [view, setView] = useState<AppView>("manager");
	const [library, setLibrary] = useState<ResumeLibrary>(readInitialLibrary);
	const [importError, setImportError] = useState<string | null>(null);
	const [imageExportStatus, setImageExportStatus] = useState<
		"idle" | "exporting" | "error"
	>("idle");
	const [previewPageCount, setPreviewPageCount] = useState(1);

	const activeDocument =
		library.documents.find((document) => document.id === library.activeId) ??
		library.documents[0];
	const resumeData = activeDocument.data;
	const {
		themeId,
		fontSizePt,
		pageMarginMm,
		sectionIcons,
	} = activeDocument.appearance;

	useEffect(() => {
		localStorage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify(library));
	}, [library]);

	useEffect(() => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(resumeData));
		localStorage.setItem(THEME_STORAGE_KEY, themeId);
		localStorage.setItem(FONT_SIZE_STORAGE_KEY, String(fontSizePt));
		localStorage.setItem(PAGE_MARGIN_STORAGE_KEY, String(pageMarginMm));
		localStorage.setItem(SECTION_ICONS_STORAGE_KEY, JSON.stringify(sectionIcons));
	}, [fontSizePt, pageMarginMm, resumeData, sectionIcons, themeId]);

	const [favoriteThemeIds, setFavoriteThemeIds] = useState<ThemeId[]>(() => {
		const saved = localStorage.getItem(FAVORITE_THEMES_STORAGE_KEY);
		if (!saved) return [];

		try {
			return normalizeThemeIdList(JSON.parse(saved));
		} catch {
			return [];
		}
	});

	useEffect(() => {
		localStorage.setItem(
			FAVORITE_THEMES_STORAGE_KEY,
			JSON.stringify(favoriteThemeIds),
		);
	}, [favoriteThemeIds]);

	const handleToggleFavoriteTheme = (id: ThemeId) => {
		setFavoriteThemeIds((current) =>
			current.includes(id)
				? current.filter((item) => item !== id)
				: [id, ...current],
		);
	};

	useEffect(() => {
		const styleId = "resume-print-page-margin";
		let style = document.getElementById(styleId) as HTMLStyleElement | null;
		if (!style) {
			style = document.createElement("style");
			style.id = styleId;
			document.head.appendChild(style);
		}

		style.textContent = `@media print { @page { size: A4; margin: ${pageMarginMm}mm ${pageMarginMm}mm; } }`;
	}, [pageMarginMm]);

	useEffect(() => {
		if (!importError) return;
		const timer = setTimeout(() => setImportError(null), 4000);
		return () => clearTimeout(timer);
	}, [importError]);

	useEffect(() => {
		if (imageExportStatus !== "error") return;
		const timer = setTimeout(() => setImageExportStatus("idle"), 4000);
		return () => clearTimeout(timer);
	}, [imageExportStatus]);

	const updateActiveDocument = useCallback(
		(updater: (document: ResumeDocument) => ResumeDocument) => {
			setLibrary((current) => ({
				...current,
				documents: current.documents.map((document) =>
					document.id === current.activeId
						? {
								...updater(document),
								updatedAt: new Date().toISOString(),
							}
						: document,
				),
			}));
		},
		[],
	);

	const handleResumeDataChange = (nextData: ResumeData) => {
		updateActiveDocument((document) => ({ ...document, data: nextData }));
	};

	const handleThemeChange = (nextThemeId: ThemeId) => {
		updateActiveDocument((document) => ({
			...document,
			appearance: {
				...document.appearance,
				themeId: nextThemeId,
				sectionIcons: getDefaultSectionIconVisibility(nextThemeId),
			},
		}));
	};

	const handleFontSizeChange = (nextFontSize: ResumeFontSizePt) => {
		updateActiveDocument((document) => ({
			...document,
			appearance: { ...document.appearance, fontSizePt: nextFontSize },
		}));
	};

	const handlePageMarginChange = (nextPageMargin: ResumePageMarginMm) => {
		updateActiveDocument((document) => ({
			...document,
			appearance: { ...document.appearance, pageMarginMm: nextPageMargin },
		}));
	};

	const handleSectionIconsChange = (
		nextSectionIcons: SectionIconVisibility,
	) => {
		updateActiveDocument((document) => ({
			...document,
			appearance: {
				...document.appearance,
				sectionIcons: nextSectionIcons,
			},
		}));
	};

	const handleCreateResume = (input: { name: string; tags: string[] }) => {
		const nextDocument = createResumeDocument({
			name: input.name,
			tags: input.tags,
			template: "blank",
		});
		setLibrary((current) => ({
			...current,
			activeId: nextDocument.id,
			documents: [nextDocument, ...current.documents],
		}));
		setView("editor");
	};

	const handleOpenResume = (id: string) => {
		setLibrary((current) => ({ ...current, activeId: id }));
		setView("editor");
	};

	const handleDuplicateResume = (id: string) => {
		setLibrary((current) => {
			const source = current.documents.find((document) => document.id === id);
			if (!source) return current;
			const nextDocument = createResumeDocument({
				name: `${source.name} 副本`,
				tags: source.tags,
				version: source.version,
				data: source.data,
				appearance: source.appearance,
			});

			return {
				...current,
				activeId: nextDocument.id,
				documents: [nextDocument, ...current.documents],
			};
		});
	};

	const handleDeleteResume = (id: string) => {
		if (library.documents.length <= 1) return;
		if (!window.confirm("确定要删除这份简历吗？")) return;

		setLibrary((current) => {
			const documents = current.documents.filter((document) => document.id !== id);
			if (documents.length === 0) return current;

			return {
				...current,
				activeId:
					current.activeId === id ? documents[0].id : current.activeId,
				documents,
			};
		});
	};

	const handleUpdateResumeMeta = (
		id: string,
		meta: Partial<Pick<ResumeDocument, "name" | "tags" | "version">>,
	) => {
		setLibrary((current) => ({
			...current,
			documents: current.documents.map((document) =>
				document.id === id
					? {
							...document,
							name:
								meta.name !== undefined
									? meta.name.slice(0, 80)
									: document.name,
							tags:
								meta.tags !== undefined
									? normalizeResumeTags(meta.tags)
									: document.tags,
							version:
								meta.version !== undefined
									? normalizeResumeVersion(meta.version)
									: document.version,
							updatedAt: new Date().toISOString(),
						}
					: document,
			),
		}));
	};

	const measurePreviewPages = useCallback(() => {
		const preview = resumePreviewRef.current;
		const inner = resumePreviewInnerRef.current;
		if (!preview || !inner) return;

		const previewWidth = preview.getBoundingClientRect().width || preview.scrollWidth;
		const pxPerMm = previewWidth / A4_WIDTH_MM;
		const printablePageHeight = Math.max(
			1,
			getPrintablePageHeightMm(pageMarginMm) * pxPerMm,
		);
		const contentHeight = inner.getBoundingClientRect().height;
		const nextPageCount = Math.max(
			1,
			Math.ceil(contentHeight / printablePageHeight - 0.01),
		);

		setPreviewPageCount((current) =>
			current === nextPageCount ? current : nextPageCount,
		);
	}, [pageMarginMm]);

	useEffect(() => {
		const inner = resumePreviewInnerRef.current;
		if (!inner || view !== "editor") return;

		measurePreviewPages();
		const observer = new ResizeObserver(measurePreviewPages);
		observer.observe(inner);
		window.addEventListener("resize", measurePreviewPages);
		const frame = window.requestAnimationFrame(measurePreviewPages);

		return () => {
			observer.disconnect();
			window.removeEventListener("resize", measurePreviewPages);
			window.cancelAnimationFrame(frame);
		};
	}, [
		measurePreviewPages,
		resumeData,
		themeId,
		fontSizePt,
		sectionIcons,
		view,
	]);

	const handleReset = () => {
		if (window.confirm("确定要重置当前简历到默认模版吗？")) {
			updateActiveDocument((document) => ({
				...document,
				data: normalizeResumeData(undefined),
				appearance: {
					themeId: DEFAULT_THEME_ID,
					fontSizePt: DEFAULT_RESUME_FONT_SIZE_PT,
					pageMarginMm: DEFAULT_RESUME_PAGE_MARGIN_MM,
					sectionIcons: getDefaultSectionIconVisibility(DEFAULT_THEME_ID),
				},
			}));
		}
	};

	const handlePrint = useCallback(() => {
		const name =
			resumeData.personal.name.trim() || activeDocument.name.trim() || "简历";
		const originalTitle = document.title;
		document.title = `${name} - iResume 简历`;

		const restore = () => {
			document.title = originalTitle;
			window.removeEventListener("afterprint", restore);
		};
		window.addEventListener("afterprint", restore);

		window.print();
	}, [activeDocument.name, resumeData.personal.name]);

	const handleExport = () => {
		const backup = createResumeBackup(
			resumeData,
			themeId,
			fontSizePt,
			pageMarginMm,
			sectionIcons,
		);
		const json = JSON.stringify(backup, null, 2);
		const blob = new Blob([json], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const name =
			activeDocument.name.trim() || resumeData.personal.name.trim() || "resume";
		const filename = `${name}_iResume.json`;

		const a = document.createElement("a");
		a.href = url;
		a.download = filename;
		a.click();
		URL.revokeObjectURL(url);
	};

	const handleExportImage = async () => {
		const node = resumePreviewRef.current;
		const inner = resumePreviewInnerRef.current;
		if (!node || !inner) return;

		setImageExportStatus("exporting");
		try {
			const { toPng } = await import("html-to-image");
			const nodeRect = node.getBoundingClientRect();
			const innerRect = inner.getBoundingClientRect();
			const styles = window.getComputedStyle(node);
			const paddingBottom = Number.parseFloat(styles.paddingBottom) || 0;
			const exportHeight = Math.ceil(
				innerRect.bottom - nodeRect.top + paddingBottom,
			);
			const exportWidth = Math.ceil(nodeRect.width);
			const dataUrl = await toPng(node, {
				backgroundColor: "#ffffff",
				cacheBust: true,
				height: exportHeight,
				pixelRatio: 2,
				width: exportWidth,
				style: {
					boxShadow: "none",
					height: `${exportHeight}px`,
					minHeight: "0",
					overflow: "hidden",
					width: `${exportWidth}px`,
				},
			});

			const name =
				activeDocument.name.trim() || resumeData.personal.name.trim() || "resume";
			const a = document.createElement("a");
			a.href = dataUrl;
			a.download = `${name}_iResume.png`;
			a.click();
			setImageExportStatus("idle");
		} catch (error) {
			console.error("Failed to export resume image", error);
			setImageExportStatus("error");
		}
	};

	const handleImportClick = () => {
		setImportError(null);
		importInputRef.current?.click();
	};

	const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		event.target.value = "";
		if (!file) return;

		if (!file.name.endsWith(".json")) {
			setImportError("请选择 .json 文件");
			return;
		}

		const reader = new FileReader();
		reader.onload = (ev) => {
			try {
				const parsed = JSON.parse(ev.target?.result as string);
				const imported = normalizeResumeBackup(parsed);
				const importedThemeId = imported.themeId ?? themeId;
				updateActiveDocument((document) => ({
					...document,
					data: imported.data,
					appearance: normalizeResumeAppearance(
						{
							themeId: importedThemeId,
							fontSizePt: imported.fontSizePt ?? fontSizePt,
							pageMarginMm: imported.pageMarginMm ?? pageMarginMm,
							sectionIcons:
								imported.sectionIcons ??
								getDefaultSectionIconVisibility(importedThemeId),
						},
						document.appearance,
					),
				}));
			} catch {
				setImportError("文件解析失败，请确认是有效的简历 JSON 文件");
			}
		};
		reader.readAsText(file);
	};

	const printablePageHeightMm = getPrintablePageHeightMm(pageMarginMm);

	if (view === "manager") {
		return (
			<ResumeManager
				documents={library.documents}
				onCreate={handleCreateResume}
				onOpen={handleOpenResume}
				onDuplicate={handleDuplicateResume}
				onDelete={handleDeleteResume}
			/>
		);
	}

	return (
		<div className="min-h-screen bg-slate-100 print:bg-white font-sans text-slate-900">
			<nav className="sticky top-0 z-50 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-3 py-2.5 shadow-sm print:hidden sm:px-4 lg:px-6">
				<div className="flex items-center gap-4">
					<button
						type="button"
						onClick={() => setView("manager")}
						className="flex items-center gap-2 rounded-md font-bold text-xl transition hover:opacity-75"
						title="返回简历库"
					>
						<span className="inline-flex items-center justify-center bg-blue-600 text-white px-2 py-1 rounded text-sm font-black leading-none tracking-tight">
							i
						</span>
						<span className="leading-none">Resume</span>
					</button>

					<span className="hidden max-w-[240px] truncate text-xs font-medium text-slate-400 xl:block">
						{activeDocument.name} · v{activeDocument.version}
					</span>

					<a
						href="https://github.com/dogxii/iResume"
						target="_blank"
						rel="noreferrer"
						aria-label="GitHub 仓库"
						className="hidden lg:flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-700 transition-colors"
					>
						<Github size={18} />
					</a>
				</div>

				<div className="flex flex-wrap items-center justify-end gap-2">
					{importError && (
						<span className="text-xs text-red-500 bg-red-50 border border-red-200 px-3 py-1.5 rounded-md">
							{importError}
						</span>
					)}
					{imageExportStatus === "error" && (
						<span className="text-xs text-red-500 bg-red-50 border border-red-200 px-3 py-1.5 rounded-md">
							图片导出失败
						</span>
					)}

					<ThemePicker
						current={themeId}
						favoriteThemeIds={favoriteThemeIds}
						onChange={handleThemeChange}
						onToggleFavorite={handleToggleFavoriteTheme}
					/>
					<FontSizeControl
						value={fontSizePt}
						onChange={handleFontSizeChange}
					/>
					<PageMarginControl
						value={pageMarginMm}
						onChange={handlePageMarginChange}
					/>

					<div className="w-px h-5 bg-slate-200" />

					<button
						type="button"
						onClick={handleReset}
						className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
						title="重置为默认模版"
					>
						<RotateCcw size={16} />
						<span className="hidden sm:inline">重置</span>
					</button>

					<div className="w-px h-5 bg-slate-200" />

					<button
						type="button"
						onClick={handleImportClick}
						className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
						title="从 JSON 文件导入简历数据"
					>
						<Upload size={16} />
						<span className="hidden sm:inline">导入</span>
					</button>

					<button
						type="button"
						onClick={handleExport}
						className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
						title="导出当前简历数据为 JSON 文件"
					>
						<Download size={16} />
						<span className="hidden sm:inline">导出</span>
					</button>

					<button
						type="button"
						onClick={handleExportImage}
						disabled={imageExportStatus === "exporting"}
						className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-md transition-colors disabled:cursor-wait disabled:opacity-60 sm:px-4"
						title="导出当前简历为 PNG 图片"
					>
						<ImageDown size={16} />
						<span className="hidden sm:inline">
							{imageExportStatus === "exporting" ? "导出中" : "图片"}
						</span>
					</button>

					<div className="w-px h-5 bg-slate-200" />

					<button
						type="button"
						onClick={handlePrint}
						className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm transition-colors sm:px-4"
					>
						<Printer size={16} />
						<span>保存 PDF</span>
					</button>
				</div>
			</nav>

			<input
				ref={importInputRef}
				type="file"
				accept=".json,application/json"
				className="hidden print:hidden"
				onChange={handleImportFile}
			/>

			<main className="mx-auto flex min-h-[calc(100vh-64px)] max-w-[1600px] flex-col print:block print:h-auto print:max-w-none lg:h-[calc(100vh-60px)] lg:flex-row">
				<div className="w-full shrink-0 border-b border-slate-200 bg-white print:hidden lg:h-full lg:w-[420px] lg:overflow-y-auto lg:border-b-0 lg:border-r xl:w-[450px] custom-scrollbar">
					<ResumeMetaEditor
						key={activeDocument.id}
						document={activeDocument}
						onUpdate={(meta) =>
							handleUpdateResumeMeta(activeDocument.id, meta)
						}
					/>
					<ResumeEditor
						data={resumeData}
						sectionIcons={sectionIcons}
						onChange={handleResumeDataChange}
						onSectionIconsChange={handleSectionIconsChange}
					/>
				</div>

				<div className="flex-1 overflow-auto bg-slate-100 p-3 print:block print:h-auto print:flex-none print:overflow-visible print:bg-transparent print:p-0 sm:p-5 lg:h-full lg:p-8">
					<div className="mx-auto w-fit">
						<div className="sticky top-2 z-20 mb-3 flex justify-end print:hidden">
							<span className="rounded-full border border-slate-200/60 bg-white/70 px-3 py-1 text-xs font-medium text-slate-400 opacity-80 shadow-sm backdrop-blur-sm">
								预计 {previewPageCount} 页
							</span>
						</div>
						<div
							className="relative w-[210mm] bg-white shadow-2xl print:w-full print:min-h-0 print:bg-white print:shadow-none"
							style={{ minHeight: `${previewPageCount * A4_HEIGHT_MM}mm` }}
						>
							<ResumePreview
								ref={resumePreviewRef}
								contentRef={resumePreviewInnerRef}
								data={resumeData}
								themeId={themeId}
								fontSizePt={fontSizePt}
								pageMarginMm={pageMarginMm}
								sectionIcons={sectionIcons}
								minPageCount={previewPageCount}
							/>
							{Array.from({ length: previewPageCount - 1 }, (_, index) => (
								<div
									key={index}
									className="pointer-events-none absolute left-0 right-0 z-10 border-t border-dashed border-blue-300/35 print:hidden"
									style={{
										top: `${pageMarginMm + (index + 1) * printablePageHeightMm}mm`,
									}}
								>
									<span className="absolute right-3 -top-3 rounded-full border border-blue-100/70 bg-white/70 px-2 py-0.5 text-[10px] font-medium text-blue-400/75 opacity-80 shadow-sm backdrop-blur-sm">
										第 {index + 2} 页
									</span>
								</div>
							))}
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}

export default App;
