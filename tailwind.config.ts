import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                aura: {
                    black: "#0B0F14", // Deep background
                    dark: "#121826", // Surface
                    card: "rgba(255, 255, 255, 0.06)", // Glass surface
                    border: "rgba(255, 255, 255, 0.08)", // Subtle border
                },
                accent: {
                    DEFAULT: "#3B82F6", // Blue
                    glow: "#60A5FA", // Light Blue
                    secondary: "#10B981", // Emerald
                    warn: "#F97316", // Orange
                }
            },
            backgroundImage: {
                "glass": "linear-gradient(180deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 100%)",
                "glass-hover": "linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)",
            },
            animation: {
                "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                "float": "float 6s ease-in-out infinite",
            },
            keyframes: {
                float: {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-10px)" },
                }
            }
        },
    },
    plugins: [],
};
export default config;
