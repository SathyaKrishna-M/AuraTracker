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
                    black: "#0a0a0a",
                    dark: "#121212",
                    card: "rgba(23, 23, 23, 0.7)",
                    border: "rgba(255, 255, 255, 0.1)",
                },
                accent: {
                    DEFAULT: "#8b5cf6", // Violet
                    glow: "#a78bfa",
                    secondary: "#10b981", // Emerald
                    warn: "#f97316", // Orange
                }
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-aura": "linear-gradient(to bottom right, #0a0a0a, #1a1a2e, #0a0a0a)",
                "glass": "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.0) 100%)",
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
