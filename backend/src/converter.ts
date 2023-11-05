import { sanitize } from "isomorphic-dompurify";
import { Converter } from "showdown";

export const converter = new Converter({
	completeHTMLDocument: false,
	emoji: true,
});

export function convertAndEscape(markdown: string) {
	return sanitize(converter.makeHtml(markdown));
}
