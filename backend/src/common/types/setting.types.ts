import { z } from "zod";

export const themePreferenceSchema = z.enum(["system", "light", "dark"]);

export const focusModeSchema = z.object({
	enabled: z.boolean().default(false),
	hideSidebar: z.boolean().default(true),
	hideHeader: z.boolean().default(true),
});

export const editorPreferencesSchema = z.object({
	fontSize: z.enum(["sm", "md", "lg", "xl"]).default("md"),
	fontFamily: z.enum(["serif", "sans", "mono"]).default("sans"),
	backgroundPattern: z.enum(["none", "dots", "grid", "paper"]).default("none"),
});

export const settingsSchema = z.object({
	theme: themePreferenceSchema.default("system"),
	focusMode: focusModeSchema.default({
		enabled: false,
		hideSidebar: true,
		hideHeader: true,
	}),
	privacyMode: z.boolean().default(false),
	editor: editorPreferencesSchema.default({
		fontSize: "md",
		fontFamily: "sans",
		backgroundPattern: "none",
	}),
});

export type ThemePreference = z.infer<typeof themePreferenceSchema>;
export type FocusMode = z.infer<typeof focusModeSchema>;
export type EditorPreferences = z.infer<typeof editorPreferencesSchema>;
export type Settings = z.infer<typeof settingsSchema>;
