'use client';

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function WatchContent() {
    const videoPrefix = "https://storage.googleapis.com/ns-vydio-processed-videos/";
    const videoSrc = useSearchParams().get('v');
    return (
        <main className="mx-auto min-h-[calc(100vh-4rem)] w-full max-w-6xl px-4 pb-16 pt-10 sm:px-6 sm:pt-14 lg:px-8 lg:pt-16">
            <div className="mb-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-blue-600">Now playing</p>
                <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Your video</h1>
                <p className="mt-2 text-sm text-slate-600">Take a moment and enjoy the watch.</p>
            </div>
            {videoSrc ? (
                <video
                    className="aspect-video max-h-[72vh] w-full rounded-lg border border-slate-200 bg-black object-contain"
                    controls
                    playsInline
                    src={videoPrefix + videoSrc}
                >
                    Your browser does not support video playback.
                </video>
            ) : (
                <p className="border-y border-slate-200 py-5 text-sm leading-6 text-slate-500" role="alert">
                    No video was selected. Return to your library and choose a video.
                </p>
            )}
        </main>
    );
}

export default function Watch() {
    return (
        <Suspense fallback={<p className="mx-auto mt-10 w-full max-w-6xl px-4 py-5 text-sm text-slate-500 sm:px-6 lg:px-8">Loading video...</p>}>
            <WatchContent />
        </Suspense>
    );
}