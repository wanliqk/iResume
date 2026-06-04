import { ArrowDown, ArrowUp, ChevronDown, Plus, Trash2 } from "lucide-react";
import { useId, useState, type ReactNode } from "react";
import { createResumeItemId } from "../data/resumeData";
import type {
	Education,
	Experience,
	Project,
	ResumeData,
	SectionKey,
	SectionIconVisibility,
	SkillItem,
} from "../types/resume";

interface InputGroupProps {
	label: string;
	value: string;
	onChange: (value: string) => void;
	type?: "text" | "textarea";
	placeholder?: string;
}

const InputGroup = ({
	label,
	value,
	onChange,
	type = "text",
	placeholder = "",
}: InputGroupProps) => {
	const id = useId();
	return (
		<div className="mb-3">
			<label
				htmlFor={id}
				className="block text-xs font-medium text-slate-500 mb-1"
			>
				{label}
			</label>
			{type === "textarea" ? (
				<textarea
					id={id}
					className="w-full resize-y rounded-md border border-slate-200 bg-white p-2 text-sm outline-none transition focus:border-transparent focus:ring-2 focus:ring-blue-500"
					rows={4}
					value={value}
					onChange={(e) => onChange(e.target.value)}
					placeholder={placeholder}
				/>
			) : (
				<input
					id={id}
					type="text"
					className="w-full rounded-md border border-slate-200 bg-white p-2 text-sm outline-none transition focus:border-transparent focus:ring-2 focus:ring-blue-500"
					value={value}
					onChange={(e) => onChange(e.target.value)}
					placeholder={placeholder}
				/>
			)}
		</div>
	);
};

interface ResumeEditorProps {
	data: ResumeData;
	sectionIcons: SectionIconVisibility;
	onChange: (data: ResumeData) => void;
	onSectionIconsChange: (sectionIcons: SectionIconVisibility) => void;
}

interface ItemActionsProps {
	index: number;
	total: number;
	onMove: (direction: "up" | "down") => void;
	onRemove: () => void;
}

const ItemActions = ({
	index,
	total,
	onMove,
	onRemove,
}: ItemActionsProps) => (
	<div className="absolute top-2 right-2 flex gap-0.5">
		<button
			type="button"
			onClick={() => onMove("up")}
			disabled={index === 0}
			className="flex h-7 w-7 items-center justify-center rounded text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-500 disabled:cursor-not-allowed disabled:opacity-30"
			title="上移"
		>
			<ArrowUp size={14} />
		</button>
		<button
			type="button"
			onClick={() => onMove("down")}
			disabled={index === total - 1}
			className="flex h-7 w-7 items-center justify-center rounded text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-500 disabled:cursor-not-allowed disabled:opacity-30"
			title="下移"
		>
			<ArrowDown size={14} />
		</button>
		<button
			type="button"
			onClick={onRemove}
			className="flex h-7 w-7 items-center justify-center rounded text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
			title="删除"
		>
			<Trash2 size={14} />
		</button>
	</div>
);

interface EditorSectionProps {
	title: string;
	description?: string;
	action?: ReactNode;
	children: ReactNode;
}

const EditorSection = ({
	title,
	description,
	action,
	children,
}: EditorSectionProps) => {
	const [open, setOpen] = useState(true);

	return (
		<section className="border-b border-slate-200 pb-5 last:border-b-0">
			<div className="mb-3 flex items-start gap-2">
				<button
					type="button"
					onClick={() => setOpen((value) => !value)}
					className="flex min-w-0 flex-1 items-start gap-2 rounded-md text-left transition-colors hover:text-blue-600"
					aria-expanded={open}
				>
					<ChevronDown
						size={16}
						className={`mt-0.5 shrink-0 text-slate-400 transition-transform ${
							open ? "" : "-rotate-90"
						}`}
					/>
					<span className="min-w-0">
						<span className="block font-bold text-slate-800">{title}</span>
						{description && (
							<span className="mt-1 block text-xs leading-relaxed text-slate-400">
								{description}
							</span>
						)}
					</span>
				</button>
				{action}
			</div>
			{open && <div>{children}</div>}
		</section>
	);
};

const ResumeEditor = ({
	data,
	sectionIcons,
	onChange,
	onSectionIconsChange,
}: ResumeEditorProps) => {
	const updatePersonal = (key: keyof ResumeData["personal"], value: string) => {
		onChange({ ...data, personal: { ...data.personal, [key]: value } });
	};

	const updateSectionTitle = (
		key: keyof ResumeData["sectionTitles"],
		value: string,
	) => {
		onChange({
			...data,
			sectionTitles: { ...data.sectionTitles, [key]: value },
		});
	};

	const updateSectionIcon = (key: SectionKey, visible: boolean) => {
		onSectionIconsChange({ ...sectionIcons, [key]: visible });
	};

	// --- Skills (dynamic array) ---
	const updateSkill = (id: number, key: keyof SkillItem, value: string) => {
		onChange({
			...data,
			skills: data.skills.map((s) =>
				s.id === id ? { ...s, [key]: value } : s,
			),
		});
	};

	const addSkill = () => {
		onChange({
			...data,
			skills: [
				...data.skills,
				{ id: createResumeItemId(), label: "新分类", content: "" },
			],
		});
	};

	const removeSkill = (id: number) => {
		onChange({ ...data, skills: data.skills.filter((s) => s.id !== id) });
	};

	// --- Education (dynamic array) ---
	const updateEducation = (id: number, key: keyof Education, value: string) => {
		onChange({
			...data,
			education: data.education.map((e) =>
				e.id === id ? { ...e, [key]: value } : e,
			),
		});
	};

	const addEducation = () => {
		onChange({
			...data,
			education: [
				...data.education,
				{
					id: createResumeItemId(),
					school: "学校名称",
					degree: "学位",
					date: "时间",
				},
			],
		});
	};

	const removeEducation = (id: number) => {
		onChange({
			...data,
			education: data.education.filter((e) => e.id !== id),
		});
	};

	// --- Experience & Projects (array operations) ---
	const updateArrayItem = <T extends Experience | Project>(
		section: "experience" | "projects",
		id: number,
		key: keyof T,
		value: string,
	) => {
		const newSection = data[section].map((item) =>
			item.id === id ? { ...item, [key]: value } : item,
		);
		onChange({ ...data, [section]: newSection });
	};

	const addItem = <T extends Experience | Project>(
		section: "experience" | "projects",
		template: Omit<T, "id">,
	) => {
		onChange({
			...data,
			[section]: [...data[section], { ...template, id: createResumeItemId() }],
		});
	};

	const removeItem = (section: "experience" | "projects", id: number) => {
		onChange({
			...data,
			[section]: data[section].filter((item) => item.id !== id),
		});
	};

	// --- Generic move up/down ---
	const moveItem = <T extends { id: number }>(
		arr: T[],
		index: number,
		direction: "up" | "down",
	): T[] => {
		const newArr = [...arr];
		const targetIndex = direction === "up" ? index - 1 : index + 1;
		if (targetIndex < 0 || targetIndex >= newArr.length) return newArr;
		[newArr[index], newArr[targetIndex]] = [newArr[targetIndex], newArr[index]];
		return newArr;
	};

	const moveSkillItem = (index: number, direction: "up" | "down") => {
		onChange({ ...data, skills: moveItem(data.skills, index, direction) });
	};

	const moveExperienceItem = (index: number, direction: "up" | "down") => {
		onChange({
			...data,
			experience: moveItem(data.experience, index, direction),
		});
	};

	const moveProjectItem = (index: number, direction: "up" | "down") => {
		onChange({ ...data, projects: moveItem(data.projects, index, direction) });
	};

	const moveEducationItem = (index: number, direction: "up" | "down") => {
		onChange({
			...data,
			education: moveItem(data.education, index, direction),
		});
	};

	// --- Section ordering ---
	const moveSectionOrder = (index: number, direction: "up" | "down") => {
		const newOrder = [...data.sectionOrder];
		const targetIndex = direction === "up" ? index - 1 : index + 1;
		if (targetIndex < 0 || targetIndex >= newOrder.length) return;
		[newOrder[index], newOrder[targetIndex]] = [
			newOrder[targetIndex],
			newOrder[index],
		];
		onChange({ ...data, sectionOrder: newOrder });
	};

	// 区块的默认备用名（防止 sectionTitles 被清空时显示空白）
	const sectionFallbackNames: Record<SectionKey, string> = {
		skills: "技术栈",
		experience: "工作经历",
		projects: "项目经历",
		education: "教育背景",
		other: "其他",
	};

	return (
		<div className="space-y-5 p-4 pb-20 sm:p-5 lg:p-6">
			{/* 个人信息 */}
			<EditorSection title="个人信息">
				<div className="grid grid-cols-1 gap-2">
					<InputGroup
						label="姓名"
						value={data.personal.name}
						onChange={(v) => updatePersonal("name", v)}
					/>
					<InputGroup
						label="职位头衔"
						value={data.personal.title}
						onChange={(v) => updatePersonal("title", v)}
					/>
					<div className="grid grid-cols-2 gap-2">
						<InputGroup
							label="电话"
							value={data.personal.phone}
							onChange={(v) => updatePersonal("phone", v)}
						/>
						<InputGroup
							label="邮箱"
							value={data.personal.email}
							onChange={(v) => updatePersonal("email", v)}
						/>
					</div>
					<InputGroup
						label="所在地"
						value={data.personal.location}
						onChange={(v) => updatePersonal("location", v)}
						placeholder="例：北京, 中国"
					/>
					<InputGroup
						label="到岗情况"
						value={data.personal.availability}
						onChange={(v) => updatePersonal("availability", v)}
						placeholder="例：4天/周 3个月+"
					/>
					<InputGroup
						label="Github (不带 https://)"
						value={data.personal.github}
						onChange={(v) => updatePersonal("github", v)}
						placeholder="例：github.com/yourname"
					/>
					<InputGroup
						label="个人网站 (不带 https://)"
						value={data.personal.website}
						onChange={(v) => updatePersonal("website", v)}
						placeholder="例：your-portfolio.com"
					/>
				</div>
			</EditorSection>

			{/* 区块顺序 */}
			<EditorSection
				title="区块顺序"
				description="点击箭头调整各区块在简历中的上下顺序"
			>
				<div className="space-y-1.5">
					{data.sectionOrder.map((key, index) => (
						<div
							key={key}
							className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded px-3 py-2"
						>
							<span className="flex-1 text-sm text-slate-700 font-medium">
								{data.sectionTitles[key] || sectionFallbackNames[key]}
							</span>
							<button
								type="button"
								onClick={() => moveSectionOrder(index, "up")}
								disabled={index === 0}
								className="text-slate-400 hover:text-blue-500 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
								title="上移"
							>
								<ArrowUp size={14} />
							</button>
							<button
								type="button"
								onClick={() => moveSectionOrder(index, "down")}
								disabled={index === data.sectionOrder.length - 1}
								className="text-slate-400 hover:text-blue-500 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
								title="下移"
							>
								<ArrowDown size={14} />
							</button>
						</div>
					))}
				</div>
			</EditorSection>

			{/* 区块标题自定义 */}
			<EditorSection
				title="区块标题"
				description="自定义各区块标题，并控制是否显示线性小图标"
			>
				<div className="grid grid-cols-2 gap-2">
					<InputGroup
						label="技术栈标题"
						value={data.sectionTitles.skills}
						onChange={(v) => updateSectionTitle("skills", v)}
					/>
					<InputGroup
						label="工作经历标题"
						value={data.sectionTitles.experience}
						onChange={(v) => updateSectionTitle("experience", v)}
					/>
					<InputGroup
						label="项目经历标题"
						value={data.sectionTitles.projects}
						onChange={(v) => updateSectionTitle("projects", v)}
					/>
					<InputGroup
						label="教育背景标题"
						value={data.sectionTitles.education}
						onChange={(v) => updateSectionTitle("education", v)}
					/>
					<InputGroup
						label="其他标题"
						value={data.sectionTitles.other}
						onChange={(v) => updateSectionTitle("other", v)}
					/>
				</div>
				<div className="mt-2 rounded border border-slate-200 bg-slate-50 px-3 py-2">
					<p className="text-xs font-medium text-slate-500 mb-2">
						区块标题图标
					</p>
					<div className="grid grid-cols-2 gap-2">
						{data.sectionOrder.map((key) => (
							<label
								key={key}
								className="flex items-center gap-2 text-xs text-slate-600"
							>
								<input
									type="checkbox"
									checked={sectionIcons[key]}
									onChange={(e) => updateSectionIcon(key, e.target.checked)}
									className="h-3.5 w-3.5 accent-blue-600"
								/>
								<span>{data.sectionTitles[key] || sectionFallbackNames[key]}</span>
							</label>
						))}
					</div>
				</div>
			</EditorSection>

			{/* 技术栈 (动态) */}
			<EditorSection
				title={data.sectionTitles.skills || "技术栈"}
				description="支持粗体和链接语法，内容会实时反映到预览"
				action={
					<button
						type="button"
						onClick={addSkill}
						className="flex h-8 w-8 items-center justify-center rounded-md text-blue-600 transition-colors hover:bg-blue-50"
						title="添加技能分类"
					>
						<Plus size={16} />
					</button>
				}
			>
				<p className="text-xs text-slate-400 mb-3 leading-relaxed">
					内容支持行内语法：
					<code className="bg-slate-100 px-1 rounded text-slate-600">
						**粗体**
					</code>
					{" · "}
					<code className="bg-slate-100 px-1 rounded text-slate-600">
						[链接文字](https://url)
					</code>
				</p>
				{data.skills.map((skill, index) => (
					<div
						key={skill.id}
						className="relative mb-3 rounded-md border border-slate-200 bg-slate-50 p-4"
					>
						<ItemActions
							index={index}
							total={data.skills.length}
							onMove={(direction) => moveSkillItem(index, direction)}
							onRemove={() => removeSkill(skill.id)}
						/>
						<InputGroup
							label="分类名称"
							value={skill.label}
							onChange={(v) => updateSkill(skill.id, "label", v)}
							placeholder="例：核心能力"
						/>
						<InputGroup
							label="内容（支持 **粗体** 语法）"
							value={skill.content}
							onChange={(v) => updateSkill(skill.id, "content", v)}
							placeholder="例：**JavaScript**, TypeScript, React"
						/>
					</div>
				))}
				{data.skills.length === 0 && (
					<p className="text-xs text-slate-400 text-center py-4">
						暂无技能分类，点击 + 添加
					</p>
				)}
			</EditorSection>

			{/* 工作经历 */}
			<EditorSection
				title={data.sectionTitles.experience || "工作经历"}
				action={
					<button
						type="button"
						onClick={() =>
							addItem<Experience>("experience", {
								company: "新公司",
								role: "职位",
								date: "时间",
								details: "",
							})
						}
						className="flex h-8 w-8 items-center justify-center rounded-md text-blue-600 transition-colors hover:bg-blue-50"
						title="添加工作经历"
					>
						<Plus size={16} />
					</button>
				}
			>
				{data.experience.map((exp, index) => (
					<div
						key={exp.id}
						className="relative mb-4 rounded-md border border-slate-200 bg-slate-50 p-4"
					>
						<ItemActions
							index={index}
							total={data.experience.length}
							onMove={(direction) => moveExperienceItem(index, direction)}
							onRemove={() => removeItem("experience", exp.id)}
						/>
						<InputGroup
							label="公司"
							value={exp.company}
							onChange={(v) =>
								updateArrayItem<Experience>("experience", exp.id, "company", v)
							}
						/>
						<div className="grid grid-cols-2 gap-2">
							<InputGroup
								label="职位"
								value={exp.role}
								onChange={(v) =>
									updateArrayItem<Experience>("experience", exp.id, "role", v)
								}
							/>
							<InputGroup
								label="时间"
								value={exp.date}
								onChange={(v) =>
									updateArrayItem<Experience>("experience", exp.id, "date", v)
								}
							/>
						</div>
						<InputGroup
							type="textarea"
							label="详情 (每行一点)"
							value={exp.details}
							onChange={(v) =>
								updateArrayItem<Experience>("experience", exp.id, "details", v)
							}
							placeholder="使用 React 优化了..."
						/>
					</div>
				))}
				{data.experience.length === 0 && (
					<p className="text-xs text-slate-400 text-center py-4">
						暂无工作经历，点击 + 添加
					</p>
				)}
			</EditorSection>

			{/* 项目 */}
			<EditorSection
				title={data.sectionTitles.projects || "项目经历"}
				action={
					<button
						type="button"
						onClick={() =>
							addItem<Project>("projects", {
								name: "新项目",
								tags: "",
								link: "",
								source: "",
								description: "",
							})
						}
						className="flex h-8 w-8 items-center justify-center rounded-md text-blue-600 transition-colors hover:bg-blue-50"
						title="添加项目"
					>
						<Plus size={16} />
					</button>
				}
			>
				{data.projects.map((proj, index) => (
					<div
						key={proj.id}
						className="relative mb-4 rounded-md border border-slate-200 bg-slate-50 p-4"
					>
						<ItemActions
							index={index}
							total={data.projects.length}
							onMove={(direction) => moveProjectItem(index, direction)}
							onRemove={() => removeItem("projects", proj.id)}
						/>
						<InputGroup
							label="项目名"
							value={proj.name}
							onChange={(v) =>
								updateArrayItem<Project>("projects", proj.id, "name", v)
							}
						/>
						<InputGroup
							label="技术标签"
							value={proj.tags}
							onChange={(v) =>
								updateArrayItem<Project>("projects", proj.id, "tags", v)
							}
						/>
						<div className="grid grid-cols-2 gap-2">
							<InputGroup
								label="Demo 链接"
								value={proj.link}
								onChange={(v) =>
									updateArrayItem<Project>("projects", proj.id, "link", v)
								}
								placeholder="不带 https://"
							/>
							<InputGroup
								label="源码链接"
								value={proj.source}
								onChange={(v) =>
									updateArrayItem<Project>("projects", proj.id, "source", v)
								}
								placeholder="不带 https://"
							/>
						</div>
						<InputGroup
							type="textarea"
							label="描述 (每行一点)"
							value={proj.description}
							onChange={(v) =>
								updateArrayItem<Project>("projects", proj.id, "description", v)
							}
						/>
					</div>
				))}
				{data.projects.length === 0 && (
					<p className="text-xs text-slate-400 text-center py-4">
						暂无项目经历，点击 + 添加
					</p>
				)}
			</EditorSection>

			{/* 教育 */}
			<EditorSection
				title={data.sectionTitles.education || "教育背景"}
				action={
					<button
						type="button"
						onClick={addEducation}
						className="flex h-8 w-8 items-center justify-center rounded-md text-blue-600 transition-colors hover:bg-blue-50"
						title="添加教育经历"
					>
						<Plus size={16} />
					</button>
				}
			>
				{data.education.map((edu, index) => (
					<div
						key={edu.id}
						className="relative mb-4 rounded-md border border-slate-200 bg-slate-50 p-4"
					>
						<ItemActions
							index={index}
							total={data.education.length}
							onMove={(direction) => moveEducationItem(index, direction)}
							onRemove={() => removeEducation(edu.id)}
						/>
						<InputGroup
							label="学校"
							value={edu.school}
							onChange={(v) => updateEducation(edu.id, "school", v)}
						/>
						<InputGroup
							label="学位"
							value={edu.degree}
							onChange={(v) => updateEducation(edu.id, "degree", v)}
						/>
						<InputGroup
							label="时间"
							value={edu.date}
							onChange={(v) => updateEducation(edu.id, "date", v)}
						/>
					</div>
				))}
				{data.education.length === 0 && (
					<p className="text-xs text-slate-400 text-center py-4">
						暂无教育经历，点击 + 添加
					</p>
				)}
			</EditorSection>

			{/* 其他 */}
			<EditorSection title={data.sectionTitles.other || "其他"}>
				<p className="text-xs text-slate-400 mb-2 leading-relaxed">
					每行一条，支持行内语法：
					<br />
					<code className="bg-slate-100 px-1 rounded text-slate-600">
						**粗体**
					</code>
					{" · "}
					<code className="bg-slate-100 px-1 rounded text-slate-600">
						[链接文字](https://url)
					</code>
					<br />
					行首{" "}
					<code className="bg-slate-100 px-1 rounded text-slate-600">- </code>{" "}
					可选（写不写都会显示为列表）
				</p>
				<textarea
					className="w-full resize-y rounded-md border border-slate-200 bg-white p-2 font-mono text-sm outline-none transition focus:border-transparent focus:ring-2 focus:ring-blue-500"
					rows={6}
					value={data.other}
					onChange={(e) => onChange({ ...data, other: e.target.value })}
					placeholder={
						"**开源项目**：维护 [my-project](https://github.com/yourname/project)，简介\n**工具链**：日常使用 Vercel、Cloudflare Pages 进行项目部署"
					}
				/>
				{data.other.trim() === "" && (
					<p className="text-xs text-slate-400 mt-1">
						清空内容后「其他」区块将不在简历中显示
					</p>
				)}
			</EditorSection>
		</div>
	);
};

export default ResumeEditor;
