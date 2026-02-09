import Image from "next/image"
import { useEffect, useMemo, useState } from 'react'
import { FastAverageColor } from 'fast-average-color';
import { skill } from "@/types/main";
import { useTheme } from "next-themes";

type SkillCardProps = skill & {
    hoverItems?: string[];
};

const Skill = ({ name, image, hoverItems }: SkillCardProps) => {

    const { theme } = useTheme();
    const [bgColor, setBgColor] = useState("")
    const [imageOk, setImageOk] = useState(true)
    const safeImage = typeof image === "string" ? image.trim() : "";
    const lowerName = (name ?? "").toLowerCase();
    const isActiveDirectory = lowerName.includes("active directory");
    const isGraph = lowerName.includes("graph");
    const initials = useMemo(() => {
        if (!name) return "";
        return name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
    }, [name]);
    useEffect(() => {
        if (!safeImage) {
            setBgColor("rgba(14, 165, 233, 0.08)");
            return;
        }
        new FastAverageColor().getColorAsync(safeImage)
            .then(color => {
                const rgba = color.rgb.split(')')
                setBgColor(rgba[0] + ',0.07)')
            })
            .catch(() => {
                setBgColor("rgba(14, 165, 233, 0.08)");
            })
    }, [safeImage])

    useEffect(() => {
        setImageOk(Boolean(safeImage));
    }, [safeImage]);

    const tileColor = isActiveDirectory ? "rgba(14, 165, 233, 0.12)" : bgColor;

    return (
        <div className="group relative flex flex-col justify-center items-center gap-2">
            <div title={name} style={{ backgroundColor: tileColor }}
                className={"h-20 w-20 md:h-24 md:w-24 rounded-full bg-gray-100 dark:bg-grey-800 flex items-center justify-center"}>
                {safeImage && imageOk ? (
                    <Image
                        alt={`${name ?? "skill"} logo`}
                        width={100}
                        height={100}
                        className={`h-12 w-12 md:h-14 md:w-14 object-contain ${isGraph ? "scale-[1.75]" : ""} ${isActiveDirectory ? "mix-blend-multiply dark:mix-blend-screen" : ""} ${theme === 'dark' && (name === "GitHub" || name === "Vercel" || name === "NextJS" || name === "ExpressJS" ? 'invert' : 'invert-0')}`}
                        src={safeImage}
                        unoptimized
                        onError={() => setImageOk(false)}
                    />
                ) : (
                    <span className="text-sm font-semibold text-slate-500">
                        {initials || "?"}
                    </span>
                )}
            </div>
            <p className="text-sm md:text-base">{name}</p>
            {hoverItems && hoverItems.length ? (
                <div className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 w-max max-w-[220px] -translate-x-1/2 rounded-xl border border-black/10 bg-white/95 px-3 py-2 text-xs text-slate-700 shadow-lg opacity-0 transition-opacity duration-200 group-hover:opacity-100 dark:border-white/10 dark:bg-grey-900/95 dark:text-slate-100">
                    <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Adobe Tools
                    </div>
                    <ul className="mt-2 space-y-1 text-left">
                        {hoverItems.map((item) => (
                            <li key={item} className="leading-snug">
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            ) : null}
        </div>
    )
}

export default Skill
