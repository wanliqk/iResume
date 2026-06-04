import {
	Clock3,
	Copy,
	FilePlus2,
	Github,
	LayoutGrid,
	Plus,
	Tags,
	Trash2,
} from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { normalizeResumeTags, type ResumeDocument } from "../data/resumeLibrary";
import ResumePreview from "./ResumePreview";

interface CreateResumeInput {
	name: string;
	tags: string[];
}

interface ResumeManagerProps {
	documents: ResumeDocument[];
	onCreate: (input: CreateResumeInput) => void;
	onOpen: (id: string) => void;
	onDuplicate: (id: string) => void;
	onDelete: (id: string) => void;
}

interface ResumeCardProps {
	document: ResumeDocument;
	canDelete: boolean;
	onOpen: () => void;
	onDuplicate: () => void;
	onDelete: () => void;
}

const formatUpdatedAt = (value: string) => {
	const date = new Date(value);
	if (!Number.isFinite(date.getTime())) return "未知时间";

	return new Intl.DateTimeFormat("zh-CN", {
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
	}).format(date);
};

const inputClass =
	"w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-transparent focus:ring-2 focus:ring-blue-500";

const BrandMark = () => (
	<div className="flex items-center gap-2 text-xl font-bold">
		<span className="inline-flex items-center justify-center rounded bg-blue-600 px-2 py-1 text-sm font-black leading-none tracking-tight text-white">
			i
		</span>
		<span className="leading-none">Resume</span>
	</div>
);

const inertProps = { inert: true };

const ResumeThumbnail = ({
	document,
	className = "",
	scale = 0.17,
}: {
	document: ResumeDocument;
	className?: string;
	scale?: number;
}) => (
	<div
		{...inertProps}
		aria-hidden="true"
		className={`relative shrink-0 overflow-hidden rounded-md border border-slate-200/80 bg-white ${className}`}
	>
		<div
			className="absolute left-1/2 top-0 w-[210mm]"
			style={{
				marginLeft: "-105mm",
				transform: `scale(${scale})`,
				transformOrigin: "top center",
			}}
		>
			<ResumePreview
				data={document.data}
				themeId={document.appearance.themeId}
				fontSizePt={document.appearance.fontSizePt}
				pageMarginMm={document.appearance.pageMarginMm}
				sectionIcons={document.appearance.sectionIcons}
				minPageCount={1}
			/>
		</div>
	</div>
);

const DocumentMeta = ({ document }: { document: ResumeDocument }) => (
	<>
		<div className="flex items-center gap-2 text-xs text-slate-400">
			<span className="font-mono">v{document.version}</span>
			<span className="h-1 w-1 rounded-full bg-slate-300" />
			<span className="inline-flex items-center gap-1">
				<Clock3 size={13} />
				{formatUpdatedAt(document.updatedAt)}
			</span>
		</div>
		<div className="mt-2 min-h-6">
			{document.tags.length > 0 ? (
				<div className="flex flex-wrap gap-1.5">
					{document.tags.map((tag) => (
						<span
							key={tag}
							className="rounded border border-slate-200/70 bg-slate-50/70 px-1.5 py-0.5 text-[11px] font-medium text-slate-400"
						>
							{tag}
						</span>
					))}
				</div>
			) : (
				<span className="text-xs text-slate-300">未添加标签</span>
			)}
		</div>
	</>
);

const RecentResumePanel = ({
	document,
	onOpen,
}: {
	document: ResumeDocument;
	onOpen: () => void;
}) => (
	<button
		type="button"
		onClick={onOpen}
		className="grid min-h-[268px] rounded-lg border border-slate-200/70 bg-white/55 p-4 text-left transition-colors hover:border-slate-300 hover:bg-white/75 sm:grid-cols-[minmax(0,1fr)_190px] sm:gap-5"
	>
		<div className="flex min-w-0 flex-col justify-between">
			<div>
				<p className="mb-2 text-xs font-semibold text-slate-400">最近修改</p>
				<h2 className="line-clamp-2 text-xl font-bold tracking-tight text-slate-900">
					{document.name}
				</h2>
				<div className="mt-3">
					<DocumentMeta document={document} />
				</div>
			</div>
			<span className="mt-5 inline-flex w-fit rounded-md px-2 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800">
				继续编辑
			</span>
		</div>
		<ResumeThumbnail
			document={document}
			className="mx-auto mt-4 h-[252px] w-[178px] sm:mt-0"
			scale={0.225}
		/>
	</button>
);

const ResumeCard = ({
	document,
	canDelete,
	onOpen,
	onDuplicate,
	onDelete,
}: ResumeCardProps) => (
	<article className="group flex min-h-[332px] flex-col rounded-lg border border-slate-200/70 bg-white/60 p-3 transition-colors hover:border-slate-300 hover:bg-white/80">
		<button
			type="button"
			onClick={onOpen}
			className="flex min-w-0 flex-1 flex-col items-center text-left"
		>
			<ResumeThumbnail document={document} className="h-48 w-[136px]" />

			<div className="mt-4 w-full min-w-0">
				<div className="mb-2 flex items-start justify-between gap-3">
					<h2 className="line-clamp-2 text-base font-bold leading-snug text-slate-900">
						{document.name}
					</h2>
					<span className="shrink-0 rounded-full border border-slate-200/70 px-2 py-0.5 font-mono text-[11px] text-slate-400">
						v{document.version}
					</span>
				</div>
				<div className="inline-flex items-center gap-1.5 text-xs text-slate-400">
					<Clock3 size={13} />
					<span>{formatUpdatedAt(document.updatedAt)}</span>
				</div>
			</div>
		</button>

		<div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
			<button
				type="button"
				onClick={onOpen}
				className="rounded-md px-2 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
			>
				打开编辑
			</button>
			<div className="flex gap-1">
				<button
					type="button"
					onClick={onDuplicate}
					className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-800"
					title="复制"
					aria-label={`复制 ${document.name}`}
				>
					<Copy size={14} />
				</button>
				<button
					type="button"
					onClick={onDelete}
					disabled={!canDelete}
					className="flex h-8 w-8 items-center justify-center rounded-md text-slate-300 transition hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-35"
					title="删除"
					aria-label={`删除 ${document.name}`}
				>
					<Trash2 size={14} />
				</button>
			</div>
		</div>
	</article>
);

const CreateResumeCard = ({ onClick }: { onClick: () => void }) => (
	<button
		type="button"
		onClick={onClick}
		className="group flex min-h-[268px] flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white/30 p-5 text-slate-400 transition-colors hover:border-slate-400 hover:bg-white/55 hover:text-slate-600"
	>
		<span className="mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-dashed border-current bg-white/40">
			<Plus size={22} />
		</span>
		<span className="text-sm font-semibold">新建简历</span>
		<span className="mt-1 text-xs text-slate-300">空白开始</span>
	</button>
);

interface CreateResumeModalProps {
	defaultName: string;
	onClose: () => void;
	onCreate: (input: CreateResumeInput) => void;
}

const CreateResumeModal = ({
	defaultName,
	onClose,
	onCreate,
}: CreateResumeModalProps) => {
	const [name, setName] = useState(defaultName);
	const [tagText, setTagText] = useState("");

	const submit = (event?: FormEvent<HTMLFormElement>) => {
		event?.preventDefault();
		onCreate({
			name: name.trim() || defaultName,
			tags: normalizeResumeTags(tagText),
		});
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/15 px-4 backdrop-blur-[2px]">
			<form
				onSubmit={submit}
				className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-5 shadow-lg shadow-slate-900/[0.08]"
			>
				<div className="mb-4 flex items-center gap-3">
					<span className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-100 text-slate-500">
						<FilePlus2 size={19} />
					</span>
					<div>
						<h2 className="text-lg font-bold text-slate-900">新建简历</h2>
						<p className="mt-0.5 text-sm text-slate-400">名称与标签</p>
					</div>
				</div>

				<label className="mb-3 block">
					<span className="mb-1 block text-xs font-medium text-slate-500">
						简历名称
					</span>
					<input
						value={name}
						onChange={(event) => setName(event.target.value)}
						className={inputClass}
						autoFocus
					/>
				</label>

				<label className="block">
					<span className="mb-1 block text-xs font-medium text-slate-500">
						标签
					</span>
					<div className="relative">
						<Tags
							size={14}
							className="pointer-events-none absolute left-3 top-2.5 text-slate-300"
						/>
						<input
							value={tagText}
							onChange={(event) => setTagText(event.target.value)}
							onKeyDown={(event) => {
								if (event.key === "Escape") onClose();
							}}
							className={`${inputClass} pl-8`}
							placeholder="前端, 社招, 北京"
						/>
					</div>
				</label>

				<div className="mt-5 flex justify-end gap-2">
					<button
						type="button"
						onClick={onClose}
						className="rounded-md px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
					>
						取消
					</button>
					<button
						type="submit"
						className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
					>
						创建
					</button>
				</div>
			</form>
		</div>
	);
};

const ResumeManager = ({
	documents,
	onCreate,
	onOpen,
	onDuplicate,
	onDelete,
}: ResumeManagerProps) => {
	const [creating, setCreating] = useState(false);
	const defaultName = `新简历 ${documents.length + 1}`;
	const sortedDocuments = useMemo(
		() =>
			[...documents].sort(
				(a, b) =>
					new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
			),
		[documents],
	);
	const recentDocument = sortedDocuments[0];

	return (
		<div className="min-h-screen bg-slate-100 font-sans text-slate-900">
			<header className="sticky top-0 z-30 border-b border-slate-200/70 bg-slate-100/90 backdrop-blur">
				<div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
					<BrandMark />
					<div className="flex items-center gap-2">
						<span className="hidden items-center gap-1.5 rounded-full border border-slate-200/70 bg-white/55 px-3 py-1 text-xs font-medium text-slate-400 sm:inline-flex">
							<LayoutGrid size={14} />
							{documents.length} 份
						</span>
						<a
							href="https://github.com/dogxii/iResume"
							target="_blank"
							rel="noreferrer"
							aria-label="GitHub 仓库"
							className="flex h-9 w-9 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-white/60 hover:text-slate-700"
						>
							<Github size={18} />
						</a>
					</div>
				</div>
			</header>

			<main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
				<div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<p className="mb-1 text-xs font-semibold text-slate-400">
							本地工作台
						</p>
						<h1 className="text-2xl font-bold tracking-tight text-slate-900">
							简历库
						</h1>
					</div>
					<span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-slate-200/70 bg-white/55 px-3 py-1 text-xs font-medium text-slate-400">
						<LayoutGrid size={14} />
						共 {documents.length} 份本地简历
					</span>
				</div>

				<div className="mb-8 grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
					<CreateResumeCard onClick={() => setCreating(true)} />
					{recentDocument && (
						<RecentResumePanel
							document={recentDocument}
							onOpen={() => onOpen(recentDocument.id)}
						/>
					)}
				</div>

				<div className="mb-3 flex items-center justify-between">
					<h2 className="text-sm font-bold text-slate-700">全部简历</h2>
					<span className="text-xs text-slate-400">
						{sortedDocuments.length} 份
					</span>
				</div>
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{sortedDocuments.map((document) => (
						<ResumeCard
							key={document.id}
							document={document}
							canDelete={documents.length > 1}
							onOpen={() => onOpen(document.id)}
							onDuplicate={() => onDuplicate(document.id)}
							onDelete={() => onDelete(document.id)}
						/>
					))}
				</div>
			</main>

			{creating && (
				<CreateResumeModal
					defaultName={defaultName}
					onClose={() => setCreating(false)}
					onCreate={(input) => {
						onCreate(input);
						setCreating(false);
					}}
				/>
			)}
		</div>
	);
};

export default ResumeManager;
