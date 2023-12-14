import * as base64 from "@prokopschield/base64";

export function success<T extends Record<any, any>>(
	arg: T
): T & { success: true } {
	return { success: true, ...arg };
}

export function eh64(hex: string) {
	return base64.encode(Buffer.from(hex, "hex"));
}

export function e64h(base64str: string) {
	return Buffer.from(base64.decode(base64str)).toString("hex");
}
