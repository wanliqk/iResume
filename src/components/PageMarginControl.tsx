import { Frame, Minus, Plus, RotateCcw } from "lucide-react";
import {
	DEFAULT_RESUME_PAGE_MARGIN_MM,
	RESUME_PAGE_MARGIN_OPTIONS,
	getAdjacentResumePageMargin,
	type ResumePageMarginMm,
} from "../data/resumeStyle";

interface PageMarginControlProps {
	value: ResumePageMarginMm;
	onChange: (value: ResumePageMarginMm) => void;
}

const MIN_PAGE_MARGIN = RESUME_PAGE_MARGIN_OPTIONS[0];
const MAX_PAGE_MARGIN =
	RESUME_PAGE_MARGIN_OPTIONS[RESUME_PAGE_MARGIN_OPTIONS.length - 1];

const PageMarginControl = ({ value, onChange }: PageMarginControlProps) => {
	const isDefault = value === DEFAULT_RESUME_PAGE_MARGIN_MM;

	return (
		<div
			className="flex h-8 items-center gap-0.5 rounded-lg bg-white/60 px-1 text-xs ring-1 ring-slate-200/60"
			title="调整 PDF 页边距"
		>
			<Frame size={14} className="ml-1 text-slate-400" aria-hidden="true" />
			<button
				type="button"
				onClick={() =>
					onChange(getAdjacentResumePageMargin(value, "smaller"))
				}
				disabled={value === MIN_PAGE_MARGIN}
				className="flex h-6 w-6 items-center justify-center rounded text-slate-500 transition-colors hover:bg-slate-100/80 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-25"
				title="减小页边距"
				aria-label="减小 PDF 页边距"
			>
				<Minus size={14} />
			</button>
			<span className="min-w-11 text-center font-medium tabular-nums text-slate-600">
				{value}mm
			</span>
			<button
				type="button"
				onClick={() => onChange(getAdjacentResumePageMargin(value, "larger"))}
				disabled={value === MAX_PAGE_MARGIN}
				className="flex h-6 w-6 items-center justify-center rounded text-slate-500 transition-colors hover:bg-slate-100/80 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-25"
				title="增大页边距"
				aria-label="增大 PDF 页边距"
			>
				<Plus size={14} />
			</button>
			<button
				type="button"
				onClick={() => onChange(DEFAULT_RESUME_PAGE_MARGIN_MM)}
				disabled={isDefault}
				className="flex h-6 w-6 items-center justify-center rounded text-slate-400 transition-colors hover:bg-slate-100/80 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-25"
				title="恢复默认页边距"
				aria-label="恢复默认 PDF 页边距"
			>
				<RotateCcw size={13} />
			</button>
		</div>
	);
};

export default PageMarginControl;
