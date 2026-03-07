import { button, div } from "motion/react-client";
import { thumbnailStyles, type ThumbnailStyle } from "../assets/assets"
import { CpuIcon, ImageIcon, PenToolIcon, SquareIcon, SparkleIcon, ChevronDown } from "lucide-react";
const StyleSelector = ({ value, onChange, isOpen, setIsOpen }:
    {
        value: ThumbnailStyle; onChange:
        (style: ThumbnailStyle) => void; isOpen: boolean; setIsOpen: (open: boolean) => void
    }) => {
    const styleDescription: Record<ThumbnailStyle, string> = {
        "Bold & Graphic": "High contrast, Bold Typography, striking visuals",
        "Minimalist": "Clean, Simple, Lots of White Space",
        "Photorealistic": "Photo-Based, Natural Looking",
        "Illustrated": "Hand-Drawn, Artistic, Creative",
        "Tech/Futuristic": "Modern, Sleek, Tech-Inspired"


    }
    const styleIcon: Record<ThumbnailStyle, React.ReactNode> = {
        'Bold & Graphic': <SparkleIcon className="h-4 w-4" />,
        "Minimalist": <SquareIcon className="h-4 w-4" />,
        "Photorealistic": <ImageIcon className="h-4 w-4" />,
        "Illustrated": <PenToolIcon className="h-4 w-4" />,
        "Tech/Futuristic": <CpuIcon className="h-4 w-4" />


    }
    return (
        <div className="relative space-y-3 dark">
            <label className="block text-sm font-medium text-zinc-200">

            </label>
            <button type="button" onClick={() => setIsOpen(!isOpen)}
                className="flex w-full item-center justify-between 
             rounded-md border px-4  py-3 text-left transition 
             bg-white/8 border-white/10 text-zinc-200 hover:bg-white/12">
                <div className="space-y-1">
                    <div className="flex item-center gap-2 font-medium">
                        {styleIcon[value]}
                        <span>{value}</span>
                    </div>
                    <p className="text-xs text-zinc-400">{styleDescription[value]}</p>
                </div>
                <ChevronDown
                    className={`h-5 w-5 text-zinc-400 transition-transform ${isOpen ? "rotate-180" : ""
                        }`}
                />

            </button>
            {isOpen && (
                <div className="absolute top-full left-0 z-50 mt-1 w-full 
    rounded-md border border-white/12 bg-black/12 
    backdrop-blur-3xl shadow-lg">

                    {thumbnailStyles.map((style) => (
                        <button
                            key={style}
                            type="button"
                            onClick={() => {
                                onChange(style);
                                setIsOpen(false);
                            }}
                            className="flex w-full items-start gap-3 px-4 py-3 
        text-left transition hover:bg-black/30"
                        >
                            <div className="mt-0.5">{styleIcon[style]}</div>

                            <div>
                                <p className="font-medium">{style}</p>
                                <p className="text-xs text-zinc-400">
                                    {styleDescription[style]}
                                </p>
                            </div>
                        </button>
                    ))}

                </div>
            )}

        </div>
    )
}
export default StyleSelector;
