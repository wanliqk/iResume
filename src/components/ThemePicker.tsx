import { Check, Palette, Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { themeIds, themes } from "../data/themes";
import type { ThemeId } from "../types/theme";

interface ThemePickerProps {
	current: ThemeId;
	favoriteThemeIds: ThemeId[];
	onChange: (id: ThemeId) => void;
	onToggleFavorite: (id: ThemeId) => void;
}

const ThemePicker = ({
	current,
	favoriteThemeIds,
	onChange,
	onToggleFavorite,
}: ThemePickerProps) => {
	const [open, setOpen] = useState(false);

	// ESC 关闭
	useEffect(() => {
		if (!open) return;
		const handleKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") setOpen(false);
		};
		document.addEventListener("keydown", handleKey);
		return () => document.removeEventListener("keydown", handleKey);
	}, [open]);

	const currentTheme = themes[current];
	const orderedThemeIds = useMemo(() => {
		const favoriteSet = new Set(favoriteThemeIds);
		return [
			...favoriteThemeIds,
			...themeIds.filter((id) => !favoriteSet.has(id)),
		];
	}, [favoriteThemeIds]);

	return (
		<>
			{/* 触发按钮 */}
				<button
					type="button"
					onClick={() => setOpen((v) => !v)}
					className="flex h-8 w-fit justify-self-start items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100/80"
					title="切换简历主题"
				>
				<Palette size={14} className="text-slate-400" />
				<span className="hidden sm:inline">{currentTheme.name}</span>
			</button>

			{open &&
				createPortal(
					<div
						className="fixed inset-0 z-[80] bg-slate-900/10 px-3 py-12 backdrop-blur-[1px]"
						onMouseDown={() => setOpen(false)}
					>
						<div
							className="mx-auto flex max-h-[min(680px,calc(100vh-6rem))] w-full max-w-[520px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white/95 shadow-2xl shadow-slate-900/15"
							style={{ animation: "fadeSlideIn 0.15s ease-out" }}
							onMouseDown={(event) => event.stopPropagation()}
						>
							<div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
								<div className="flex items-center gap-2">
									<Palette size={15} className="text-slate-400" />
									<span className="text-sm font-bold text-slate-800">
										选择主题
									</span>
								</div>
								<span className="text-xs text-slate-400">
									{orderedThemeIds.length} 个
								</span>
							</div>

							<div className="min-h-0 flex-1 overflow-y-auto p-3 custom-scrollbar">
								<div className="grid gap-2 sm:grid-cols-2">
									{orderedThemeIds.map((id) => {
										const theme = themes[id];
										const isActive = id === current;
										const isFavorite = favoriteThemeIds.includes(id);
										return (
											<div
												key={id}
												className={`flex items-center gap-2 rounded-lg border p-2 text-left transition ${
													isActive
														? "border-blue-200 bg-blue-50/70"
														: "border-slate-200/70 bg-white hover:border-slate-300 hover:bg-slate-50"
												}`}
											>
												<button
													type="button"
													onClick={() => {
														onChange(id);
														setOpen(false);
													}}
													className="flex min-w-0 flex-1 items-center gap-3 text-left"
												>
													<div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg border border-slate-200/70 shadow-sm">
														<div
															className="absolute inset-x-0 top-0 h-1/2"
															style={{
																backgroundColor: theme.previewColors[0],
															}}
														/>
														<div
															className="absolute inset-x-0 bottom-0 h-1/2"
															style={{
																backgroundColor: theme.previewColors[1],
															}}
														/>
														{isActive && (
															<div className="absolute inset-0 flex items-center justify-center bg-black/20">
																<Check
																	size={14}
																	className="text-white drop-shadow"
																/>
															</div>
														)}
													</div>

													<div className="min-w-0 flex-1">
														<div className="flex items-center gap-2">
															<span className="truncate text-sm font-semibold text-slate-800">
																{theme.name}
															</span>
															{isActive && (
																<span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-semibold text-blue-600">
																	当前
																</span>
															)}
														</div>
														<p className="mt-0.5 truncate text-[11px] leading-snug text-slate-400">
															{theme.nameEn} · {theme.description}
														</p>
													</div>
												</button>

												<button
													type="button"
													onClick={() => onToggleFavorite(id)}
													className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-colors ${
														isFavorite
															? "text-amber-500 hover:bg-amber-50"
															: "text-slate-300 hover:bg-slate-100 hover:text-slate-500"
													}`}
													title={isFavorite ? "取消收藏主题" : "收藏主题"}
													aria-label={isFavorite ? "取消收藏主题" : "收藏主题"}
												>
													<Star
														size={15}
														fill={isFavorite ? "currentColor" : "none"}
													/>
												</button>
											</div>
										);
									})}
								</div>
							</div>
						</div>
					</div>,
					document.body,
				)}
		</>
	);
};

export default ThemePicker;
