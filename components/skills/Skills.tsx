import { useState } from 'react';
import { skill } from '@/types/main';
import SkillCard from "./SkillCard"
import SectionWrapper from '../SectionWrapper';

interface Props {
    skillData: skill[]
}

const Skills = ({ skillData }: Props) => {

    const rawCategories = Array.from(
        new Set(skillData.map((s: { category: any; }) => s.category))
    ).filter(Boolean)
    const preferredOrder = [
        "Identity",
        "Endpoint",
        "Security",
        "Automation",
        "Operations",
        "Cloud",
        "Application Support",
    ]
    const categories = [
        ...preferredOrder.filter((c) => rawCategories.includes(c)),
        ...rawCategories.filter((c) => !preferredOrder.includes(c)).sort(),
    ]
    const [category, setCategory] = useState(categories[0])
    const adobeItems = skillData
        .filter((s) => (s.name ?? "").toLowerCase().startsWith("adobe "))
        .map((s) => s.name)
        .filter((name) => name && name.toLowerCase() !== "adobe creative cloud")

    const filteredSkills = skillData.filter(
        (s: skill) => s.category.toLowerCase() === category.toLowerCase()
    )

    const isAppSupport = category.toLowerCase() === "application support"
    const fontNames = new Set([
        "fontagent",
        "connectfonts",
        "adobe fonts",
        "suitcase fusion",
        "monotype fonts",
        "typeface",
    ])
    const webNames = new Set([
        "wordpress",
        "figma",
        "wix",
        "squarespace",
        "sketch",
        "adobe xd",
        "miro",
    ])

    const appSupportGroups = isAppSupport
        ? (() => {
            const adobe = filteredSkills.filter((s) =>
                (s.name ?? "").toLowerCase().startsWith("adobe ")
            )
            const fonts = filteredSkills.filter((s) =>
                fontNames.has((s.name ?? "").toLowerCase())
            )
            const webDesign = filteredSkills.filter((s) =>
                webNames.has((s.name ?? "").toLowerCase())
            )
            const used = new Set(
                [...adobe, ...fonts, ...webDesign].map((s) => s.name)
            )
            const other = filteredSkills.filter((s) => !used.has(s.name))
            return [
                { label: "Adobe", items: adobe },
                { label: "Font Management", items: fonts },
                { label: "Web Design", items: webDesign },
                { label: "Other", items: other },
            ].filter((group) => group.items.length)
        })()
        : []

    return (
        <SectionWrapper id='skills' className="min-h-screen mt-12 md:mt-0 mx-4 md:mx-0 xl:my-20 2xl:my-0">
            <h2 className="text-4xl text-center">Tech Stack</h2>

            <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start">
                <div className="fx-glow w-full lg:w-1/4 bg-white/80 dark:bg-grey-800/80 p-3 rounded-md">
                    <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
                        {categories.map((c: string, i: number) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => setCategory(c)}
                                className={`fx-glow p-2 text-sm md:text-base w-full text-center cursor-pointer rounded-md ${category.toLowerCase() === c.toLowerCase() ? "bg-sky-600 dark:bg-sky-500 text-white" : "bg-white dark:bg-grey-800 hover:bg-sky-50 hover:dark:bg-grey-900"} transition-all capitalize`}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 space-y-8">
                    {isAppSupport ? (
                        appSupportGroups.map((group) => (
                            <div key={group.label}>
                                <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                                    {group.label}
                                </div>
                                <div className="grid grid-cols-3 md:grid-cols-4 xl:grid-cols-5 place-items-center gap-8">
                                    {group.items.map((s: any, i: number) => (
                                        <SkillCard
                                            key={`${group.label}-${i}`}
                                            {...s}
                                            hoverItems={
                                                (s.name ?? "").toLowerCase() === "adobe creative cloud"
                                                    ? adobeItems
                                                    : undefined
                                            }
                                        />
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="grid grid-cols-3 md:grid-cols-4 xl:grid-cols-5 place-items-center gap-8">
                            {filteredSkills.map((s: any, i: number) => (
                                <SkillCard
                                    key={i}
                                    {...s}
                                    hoverItems={
                                        (s.name ?? "").toLowerCase() === "adobe creative cloud"
                                            ? adobeItems
                                            : undefined
                                    }
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

        </SectionWrapper>
    )
}

export default Skills
