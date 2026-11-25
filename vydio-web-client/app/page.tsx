"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { getVideos, type Video } from "./firebase/functions";
import { onAuthStateChangedListener } from "./firebase/firebase";
import Upload from "./navbar/upload";

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener(setUser);
    getVideos()
      .then(setVideos)
      .catch((error: unknown) => {
        console.error("Failed to load videos:", error);
        setError("Could not load videos. Please try again later.");
      })
      .finally(() => setIsLoading(false));
    return unsubscribe;
  }, []);

  return (
    <main className="mx-auto min-h-[calc(100vh-4rem)] w-full max-w-6xl px-4 pb-16 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pt-20">
      <section className="mb-14 max-w-2xl sm:mb-16">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">A home for your videos</p>
        <h1 className="max-w-xl text-4xl font-semibold leading-tight tracking-[-0.06em] text-slate-900 sm:text-5xl lg:text-6xl">
          Your videos, <span className="text-[var(--accent)]">all in one place.</span>
        </h1>
        <p className="mt-4 max-w-md text-base leading-7 text-slate-600">
          Keep the videos you love close, and come back to them anytime.
        </p>
        <Link
          className="mt-6 inline-flex min-h-10 items-center gap-3 rounded-md border border-blue-200 bg-white px-4 text-sm font-medium text-blue-700 no-underline transition-colors hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          href="#library"
        >
          Browse your library <span className="text-[var(--accent)]" aria-hidden="true">↓</span>
        </Link>
      </section>

      <section className="scroll-mt-24 border-t border-zinc-200 pt-5" id="library" aria-label="Your videos">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Your collection</p>
            <h2 className="text-xl font-semibold tracking-tight text-slate-900">Library</h2>
          </div>
          <div className="flex shrink-0 items-center gap-3 sm:gap-4">
            {!isLoading && !error && (
              <span className="text-xs text-slate-500 sm:text-sm">
                {videos.length} {videos.length === 1 ? "video" : "videos"}
              </span>
            )}
            {user && <Upload />}
          </div>
        </div>

        {isLoading && <p className="py-5 text-sm text-slate-500">Loading your library...</p>}
        {error && <p className="py-5 text-sm text-red-700" role="alert">{error}</p>}
        {!isLoading && !error && videos.length === 0 && (
          <p className="py-5 text-sm leading-6 text-slate-500">
            Your library is empty for now. Upload a video to get started.
          </p>
        )}

        {!error && videos.length > 0 && (
          <div className="grid grid-cols-1 gap-x-6 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => {
              if (!video.filename) return null;
              const title = video.title || video.filename.split("/").pop()?.replace(/^processed-/, "") || "Untitled video";
              return (
                <Link
                  key={video.id ?? video.filename}
                  className="group min-w-0 text-slate-900 no-underline"
                  href={`/watch?v=${encodeURIComponent(video.filename)}`}
                >
                  <div className="aspect-video overflow-hidden rounded-md bg-slate-100">
                    <Image
                      src="/thumbnail.png"
                      alt=""
                      width={640}
                      height={360}
                      sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 33vw"
                      className="h-full w-full object-cover transition-opacity group-hover:opacity-90"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-3 px-px pt-2.5">
                    <h3 className="truncate text-sm font-medium">{title}</h3>
                    <span className="shrink-0 text-sm text-slate-400 transition-colors group-hover:text-blue-600" aria-hidden="true">
                      ↗
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
