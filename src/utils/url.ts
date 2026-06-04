const protocolPattern = /^[a-zA-Z][a-zA-Z\d+.-]*:/;
const safeProtocols = new Set(["http:", "https:", "mailto:", "tel:"]);

export function normalizeSafeUrl(value: string): string | undefined {
	const trimmed = value.trim();
	if (!trimmed) return undefined;

	const candidate = protocolPattern.test(trimmed)
		? trimmed
		: `https://${trimmed}`;

	try {
		const url = new URL(candidate);
		return safeProtocols.has(url.protocol) ? url.href : undefined;
	} catch {
		return undefined;
	}
}
