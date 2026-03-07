import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { colorSchemes, type ThumbnailStyle, type AspectRatio, type IThumbnail } from "../assets/assets";
import { SoftBackup } from "../components/SoftBackup";
import { AspectRatioSelector } from "../components/AspectRatioSelector";
import StyleSelector from "../components/StyleSelector";
import ColorSchemeSelector from "../components/ColorScheme";
import PreviewPanel from "../components/PreviewPanel";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import api from "../configs/api";

const Generation = () => {
  const { id } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  // Form state
  const [title, setTitle] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [thumbnail, setThumbnail] = useState<IThumbnail | null>(null);
  const [loading, setLoading] = useState(false);
  const [aspectRatios, setAspectRatio] = useState<AspectRatio>("16:9");
  const [colorSchemeId, setColorSchemeId] = useState<string>(colorSchemes[0].id);
  const [style, setStyle] = useState<ThumbnailStyle>("Bold & Graphic");
  const [styleDropdownOpen, setStyleDropDown] = useState(false);

  // Generate thumbnail
  const handleGenerate = async () => {
    if (!isLoggedIn) return toast.error("Please login to generate a thumbnail");
    if (!title.trim()) return toast.error("Title is required");

    setLoading(true);
    try {
      const api_payload = {
        title: title.trim(),
        prompt: additionalDetails || "",
        style: style || "default",
        aspect_ratio: aspectRatios || "16:9",
        color_scheme: colorSchemeId || "default",
        text_overlay: true,
      };

      const { data } = await api.post("/api/thumbnail/generate", api_payload);

      if (data.thumbnailId) {
        toast.success(data.message);

        // Navigate to generation page
        navigate("/generate/" + data.thumbnailId);

        // Fetch thumbnail immediately
        fetchThumbnail(data.thumbnailId);
      } else {
        toast.error("Failed to start thumbnail generation");
      }
    } catch (err: any) {
      console.error("API request failed:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Internal Server Error");
    } finally {
      setLoading(false);
    }
  };

  // Fetch thumbnail (safe access)
  const fetchThumbnail = async (fetchId?: string) => {
    try {
      const fetchTargetId = fetchId || id;
      if (!fetchTargetId) return;

      const { data } = await api.get(`/api/thumbnail/${fetchTargetId}`, { withCredentials: true });

      if (!data) return;

      setThumbnail(data as IThumbnail);
      setLoading(!data?.image_url);
      setAdditionalDetails(data?.user_prompt || "");
      setTitle(data?.title || "");
      setColorSchemeId(data?.color_scheme || colorSchemes[0].id);
      setAspectRatio(data?.aspect_ratio || "16:9");
      setStyle(data?.style || "Bold & Graphic");
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  // Polling effect
  useEffect(() => {
    if (!id || !isLoggedIn) return;

    // Fetch once immediately
    fetchThumbnail();

    // Start polling
    const interval = setInterval(() => {
      fetchThumbnail();
    }, 5000);

    return () => clearInterval(interval);
  }, [id, isLoggedIn]);

  // Clear thumbnail if pathname changes
  useEffect(() => {
    if (!id) setThumbnail(null);
  }, [pathname]);

  return (
    <>
      <SoftBackup />
      <div className="pt-24 min-h-screen">
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 lg:pb-8 ">
          <div className="grid lg:grid-cols-[400px_1fr] gap-8">
            {/* Left Panel */}
            <div className={`space-y-6 ${id ? "pointer-events-none" : ""}`}>
              <div className="p-6 rounded-2xl bg-white/8 border border-white/12 shadow-xl space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-zinc-100">Create Your Thumbnail</h2>
                  <p className="text-sm text-zinc-400">
                    Describe Your Vision And Let AI Bring It to Life
                  </p>
                </div>
                <div className="space-y-5">
                  {/* Title Input */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Title or Topic</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      maxLength={100}
                      placeholder="e.g., 10 Tips for Better Sleep"
                      className="w-full px-4 py-3 rounded-lg border border-white/12 bg-black/20 text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                    <div className="flex justify-end">
                      <span className="text-xs text-zinc-400">{title.length}/100</span>
                    </div>
                  </div>

                  {/* Aspect Ratio */}
                  <AspectRatioSelector value={aspectRatios} onChange={setAspectRatio} />

                  {/* Style Selector */}
                  <StyleSelector value={style} onChange={setStyle} isOpen={styleDropdownOpen} setIsOpen={setStyleDropDown} />

                  {/* Color Scheme Selector */}
                  <ColorSchemeSelector value={colorSchemeId} onChange={setColorSchemeId} />

                  {/* Additional Prompts */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">
                      Additional Prompts <span className="text-zinc-400 text-xs">(optional)</span>
                    </label>
                    <textarea
                      value={additionalDetails}
                      onChange={(e) => setAdditionalDetails(e.target.value)}
                      rows={3}
                      placeholder="Add Any Specific Elements, Mood, or Style & Preference..."
                      className="w-full px-4 py-3 rounded-lg border border-white/10 bg-white/6 text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                    />
                  </div>
                </div>

                {/* Generate Button */}
                {!id && (
                  <button
                    onClick={handleGenerate}
                    className="text-[15px] w-full py-3.5 rounded-xl font-medium bg-linear-to-b fron-pink-500 to-pink-600 hover:from-pink-700 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? "Generating..." : "Generate Thumbnail"}
                  </button>
                )}
              </div>
            </div>

            {/* Right Panel */}
            <div>
              <div className="p-6 rounded-2xl bg-white/8 border border-white/10 shadow-xl">
                <h2 className="text-lg font-semibold text-zinc-100 mb-4">Preview</h2>
                <PreviewPanel thumbnail={thumbnail} isLoading={loading} aspectRatio={aspectRatios} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Generation;