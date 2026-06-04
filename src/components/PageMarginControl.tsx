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
			className="flex items-center gap-1 rounded-md border border-slate-200 bg-white px-1.5 py-1"
			title="调整 PDF 页边距"
		>
			<Frame size={15} className="text-slate-400" aria-hidden="true" />
			<button
				type="button"
				onClick={() =>
					onChange(getAdjacentResumePageMargin(value, "smaller"))
				}
				disabled={value === MIN_PAGE_MARGIN}
				className="flex h-7 w-7 items-center justify-center rounded text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-30"
				title="减小页边距"
				aria-label="减小 PDF 页边距"
			>
				<Minus size={14} />
			</button>
			<span className="min-w-12 text-center text-xs font-medium tabular-nums text-slate-600">
				{value}mm
			</span>
			<button
				type="button"
				onClick={() => onChange(getAdjacentResumePageMargin(value, "larger"))}
				disabled={value === MAX_PAGE_MARGIN}
				className="flex h-7 w-7 items-center justify-center rounded text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-30"
				title="增大页边距"
				aria-label="增大 PDF 页边距"
			>
				<Plus size={14} />
			</button>
			<button
				type="button"
				onClick={() => onChange(DEFAULT_RESUME_PAGE_MARGIN_MM)}
				disabled={isDefault}
				className="flex h-7 w-7 items-center justify-center rounded text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-30"
				title="恢复默认页边距"
				aria-label="恢复默认 PDF 页边距"
			>
				<RotateCcw size={13} />
			</button>
		</div>
	);
};

export default PageMarginControl;
