export function success<T extends Record<any, any>>(
	arg: T
): T & { success: true } {
	return { success: true, ...arg };
}
