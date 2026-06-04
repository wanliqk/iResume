import { Minus, Plus, RotateCcw, Type } from "lucide-react";
import {
	DEFAULT_RESUME_FONT_SIZE_PT,
	RESUME_FONT_SIZE_OPTIONS,
	getAdjacentResumeFontSize,
	type ResumeFontSizePt,
} from "../data/resumeStyle";

interface FontSizeControlProps {
	value: ResumeFontSizePt;
	onChange: (value: ResumeFontSizePt) => void;
}

const MIN_FONT_SIZE = RESUME_FONT_SIZE_OPTIONS[0];
const MAX_FONT_SIZE =
	RESUME_FONT_SIZE_OPTIONS[RESUME_FONT_SIZE_OPTIONS.length - 1];

const FontSizeControl = ({ value, onChange }: FontSizeControlProps) => {
	const isDefault = value === DEFAULT_RESUME_FONT_SIZE_PT;

	return (
		<div
			className="flex items-center gap-1 rounded-md border border-slate-200 bg-white px-1.5 py-1"
			title="调整简历字号"
		>
			<Type size={15} className="text-slate-400" aria-hidden="true" />
			<button
				type="button"
				onClick={() => onChange(getAdjacentResumeFontSize(value, "smaller"))}
				disabled={value === MIN_FONT_SIZE}
				className="flex h-7 w-7 items-center justify-center rounded text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-30"
				title="减小字号"
				aria-label="减小简历字号"
			>
				<Minus size={14} />
			</button>
			<span className="min-w-12 text-center text-xs font-medium tabular-nums text-slate-600">
				{value}pt
			</span>
			<button
				type="button"
				onClick={() => onChange(getAdjacentResumeFontSize(value, "larger"))}
				disabled={value === MAX_FONT_SIZE}
				className="flex h-7 w-7 items-center justify-center rounded text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-30"
				title="增大字号"
				aria-label="增大简历字号"
			>
				<Plus size={14} />
			</button>
			<button
				type="button"
				onClick={() => onChange(DEFAULT_RESUME_FONT_SIZE_PT)}
				disabled={isDefault}
				className="flex h-7 w-7 items-center justify-center rounded text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-30"
				title="恢复默认字号"
				aria-label="恢复默认简历字号"
			>
				<RotateCcw size={13} />
			</button>
		</div>
	);
};

export default FontSizeControl;
