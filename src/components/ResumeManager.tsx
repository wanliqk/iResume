import {
	ArrowRight,
	Clock3,
	Copy,
	FileText,
	Github,
	Plus,
	Tags,
	Trash2,
} from "lucide-react";
import { useState } from "react";
import { normalizeResumeTags, type ResumeDocument } from "../data/resumeLibrary";

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
	"w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-transparent focus:ring-2 focus:ring-blue-500";

const ResumeCard = ({
	document,
	canDelete,
	onOpen,
	onDuplicate,
	onDelete,
}: ResumeCardProps) => (
	<article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md">
		<div className="flex min-w-0 items-start justify-between gap-3">
			<button
				type="button"
				onClick={onOpen}
				className="flex min-w-0 flex-1 items-start gap-3 text-left"
			>
				<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
					<FileText size={19} />
				</div>
				<div className="min-w-0">
					<h2 className="truncate text-base font-bold text-slate-900">
						{document.name}
					</h2>
					<div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
						<span className="inline-flex items-center gap-1">
							<Clock3 size={13} />
							{formatUpdatedAt(document.updatedAt)}
						</span>
						<span className="font-mono">v{document.version}</span>
					</div>
				</div>
			</button>
			<button
				type="button"
				onClick={onOpen}
				className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md bg-blue-600 px-3 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
			>
				编辑
				<ArrowRight size={14} />
			</button>
		</div>

		<div className="mt-4 min-h-6">
			{document.tags.length > 0 ? (
				<div className="flex flex-wrap gap-1.5">
					{document.tags.map((tag) => (
						<span
							key={tag}
							className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[11px] font-medium text-slate-400"
						>
							{tag}
						</span>
					))}
				</div>
			) : (
				<span className="text-xs text-slate-300">暂无标签</span>
			)}
		</div>

		<div className="mt-4 flex justify-end gap-1.5 border-t border-slate-100 pt-3">
			<button
				type="button"
				onClick={onDuplicate}
				className="flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
			>
				<Copy size={14} />
				复制
			</button>
			<button
				type="button"
				onClick={onDelete}
				disabled={!canDelete}
				className="flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium text-slate-400 transition hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-35"
			>
				<Trash2 size={14} />
				删除
			</button>
		</div>
	</article>
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

	const submit = () => {
		onCreate({
			name: name.trim() || defaultName,
			tags: normalizeResumeTags(tagText),
		});
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/25 px-4 backdrop-blur-sm">
			<div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-5 shadow-2xl">
				<div className="mb-4">
					<h2 className="text-lg font-bold text-slate-900">新建简历</h2>
					<p className="mt-1 text-sm text-slate-400">
						创建后会进入空白简历，可以再补充内容和外观。
					</p>
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
								if (event.key === "Enter") submit();
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
						type="button"
						onClick={submit}
						className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
					>
						创建
					</button>
				</div>
			</div>
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

	return (
		<div className="min-h-screen bg-slate-100 font-sans text-slate-900">
			<nav className="border-b border-slate-200 bg-white px-4 py-3 shadow-sm sm:px-6">
				<div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
					<div className="flex items-center gap-3">
						<div className="flex items-center gap-2 font-bold text-xl">
							<span className="inline-flex items-center justify-center rounded bg-blue-600 px-2 py-1 text-sm font-black leading-none tracking-tight text-white">
								i
							</span>
							<span className="leading-none">Resume</span>
						</div>
						<a
							href="https://github.com/dogxii/iResume"
							target="_blank"
							rel="noreferrer"
							aria-label="GitHub 仓库"
							className="hidden items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-slate-700 sm:flex"
						>
							<Github size={18} />
						</a>
					</div>
				</div>
			</nav>

			<main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
				<div className="mb-5">
					<h1 className="text-2xl font-bold tracking-tight text-slate-900">
						简历库
					</h1>
					<p className="mt-1 text-sm text-slate-500">
						共 {documents.length} 份本地简历
					</p>
				</div>

				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{documents.map((document) => (
						<ResumeCard
							key={document.id}
							document={document}
							canDelete={documents.length > 1}
							onOpen={() => onOpen(document.id)}
							onDuplicate={() => onDuplicate(document.id)}
							onDelete={() => onDelete(document.id)}
						/>
					))}
					<button
						type="button"
						onClick={() => setCreating(true)}
						className="flex min-h-[190px] flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white/60 p-4 text-slate-400 transition hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-600"
					>
						<span className="mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-dashed border-current">
							<Plus size={22} />
						</span>
						<span className="text-sm font-medium">新建简历</span>
					</button>
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
