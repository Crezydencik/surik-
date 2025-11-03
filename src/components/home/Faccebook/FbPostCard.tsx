"use client";

import { useMemo, useState } from "react";
import { Share2, ExternalLink } from "lucide-react";
import { shareLink } from "../../../lib/share";

export type FbPost = {
  id: string;
  permalink_url: string;
  message?: string;
  created_time: string;
  full_picture?: string;
};

export default function FbPostCard({ post }: { post: FbPost }) {
  const [imgLoaded, setImgLoaded] = useState(false);

  // сокращаем текст
  const short = useMemo(() => {
    if (!post.message) return "";
    const s = post.message.trim();
    return s.length > 180 ? s.slice(0, 180) + "…" : s;
  }, [post.message]);
  const handleShare = () =>
    shareLink({
      url: post.permalink_url ?? window.location.href,
      title: "MeepleCave",
      text: post.message?.slice(0, 120) || "Посмотри новость!",
    });
  return (
    <article
      className="
        flex flex-col justify-between
        h-[420px] overflow-hidden
        rounded-2xl border border-white/10
        bg-gradient-to-b from-[#181827] to-[#0c0c14]
        shadow-lg shadow-black/40 transition-transform duration-300
        hover:scale-[1.02] hover:shadow-fuchsia-500/30
      "
    >
      {/* верхняя линия */}
      <div className="h-[3px] bg-gradient-to-r from-fuchsia-500 via-sky-500 to-emerald-400" />

      {/* изображение */}
      {post.full_picture && (
        <div className="relative flex-shrink-0">
          <img
            src={post.full_picture}
            alt=""
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            className={`w-full h-40 object-cover transition-transform duration-700 group-hover:scale-105 ${
              imgLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c14]/80 via-transparent to-transparent" />
        </div>
      )}

      {/* контент */}
      <div className="flex flex-col flex-1 p-5 text-gray-100">
        <div className="text-xs text-gray-400 mb-2">
          {new Date(post.created_time).toLocaleDateString("ru-RU")}
        </div>

        {short && (
          <p className="text-sm leading-6 text-gray-200 line-clamp-4">
            {short}
          </p>
        )}

        {/* хэштеги */}
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-fuchsia-500/20 px-3 py-1 text-xs font-medium text-fuchsia-300">
            #boardgames
          </span>
          <span className="rounded-full bg-sky-500/20 px-3 py-1 text-xs font-medium text-sky-300">
            #events
          </span>
        </div>
      </div>

      {/* кнопки */}
      <div className="mt-auto border-t border-white/10 p-4 flex items-center justify-between">
        <button
          type="button"
          onClick={handleShare}
          className="flex items-center gap-2 text-xs text-gray-300 hover:text-white transition"
        >
          <Share2 className="h-4 w-4" />
          Поделиться
        </button>

        <a
          href={post.permalink_url}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 rounded-lg bg-fuchsia-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-fuchsia-500 transition"
        >
          <ExternalLink className="h-4 w-4" />
          Открыть
        </a>
      </div>
    </article>
  );
}
