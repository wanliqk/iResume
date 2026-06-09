import { ChevronDown, Type } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import {
	DEFAULT_RESUME_FONT_FAMILY,
	RESUME_FONT_FAMILY_OPTIONS,
	type ResumeFontFamily,
} from "../data/resumeStyle";

interface FontFamilyControlProps {
	value: ResumeFontFamily;
	onChange: (value: ResumeFontFamily) => void;
}

const FontFamilyControl = ({ value, onChange }: FontFamilyControlProps) => {
	const [open, setOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);
	const current = RESUME_FONT_FAMILY_OPTIONS.find((opt) => opt.value === value);
	const isDefault = value === DEFAULT_RESUME_FONT_FAMILY;

	useEffect(() => {
		if (!open) return;
		const handleClickOutside = (event: MouseEvent) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target as Node)
			) {
				setOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [open]);

	return (
		<div
			ref={containerRef}
			className="relative flex h-8 items-center gap-0.5 rounded-lg bg-white/60 px-1 text-xs ring-1 ring-slate-200/60"
			title="选择简历字体"
		>
			<Type size={14} className="ml-1 text-slate-400" aria-hidden="true" />
			<button
				type="button"
				onClick={() => setOpen((prev) => !prev)}
				className="flex h-6 w-[110px] items-center justify-between gap-1 rounded px-1.5 font-medium text-slate-600 transition-colors hover:bg-slate-100/80 hover:text-slate-800"
				aria-expanded={open}
				aria-label="选择字体"
			>
				<span className={`truncate ${isDefault ? "text-slate-400" : ""}`}>
					{current?.label ?? "默认"}
				</span>
				<ChevronDown size={12} className="shrink-0 text-slate-400" />
			</button>
			{open && (
				<div className="absolute left-0 top-full z-30 mt-1 min-w-full rounded-lg border border-slate-200/80 bg-white/95 py-1 shadow-xl shadow-slate-900/10 backdrop-blur">
					{RESUME_FONT_FAMILY_OPTIONS.map((option) => (
						<button
							key={option.value}
							type="button"
							onClick={() => {
								onChange(option.value);
								setOpen(false);
							}}
							className={`flex w-full items-center px-3 py-1.5 text-left text-xs transition-colors hover:bg-slate-50 ${
								option.value === value
									? "font-semibold text-blue-600"
									: "text-slate-600"
							}`}
						>
							{option.label}
						</button>
					))}
				</div>
			)}
		</div>
	);
};

export default FontFamilyControl;
