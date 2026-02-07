import React, { useState } from "react";
import { Play, Volume2 } from "lucide-react";

export default function App() {
  const [user, setUser] = useState(null);
  const [videoSrc, setVideoSrc] = useState(null);
  const [text, setText] = useState("Welcome to SonicWave AI demo");

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-6">
        <div className="max-w-md w-full bg-slate-900 p-8 rounded-lg">
          <h1 className="text-2xl font-bold mb-4">SonicWave</h1>
          <p className="text-sm text-slate-400 mb-6">Demo TTS & editor</p>
          <button
            onClick={() => setUser({ name: "Alex" })}
            className="w-full py-2 rounded bg-blue-600"
          >
            Sign in (demo)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center">
            <Volume2 />
          </div>
          <h2 className="text-xl font-bold">Welcome, {user.name}</h2>
        </div>
        <button onClick={() => setUser(null)} className="text-sm text-slate-400">Sign out</button>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <section className="md:col-span-2 bg-slate-900 p-4 rounded">
          <h3 className="font-semibold mb-2">Editor</h3>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-28 p-3 bg-slate-800 rounded text-white mb-3"
          />

          <div className="flex gap-2 items-center">
            <button
              onClick={() => {
                const utterance = new SpeechSynthesisUtterance(text);
                window.speechSynthesis.speak(utterance);
              }}
              className="px-4 py-2 bg-blue-600 rounded flex items-center gap-2"
            >
              <Play /> Play TTS
            </button>

            <label className="px-3 py-2 bg-slate-800 rounded cursor-pointer">
              Upload video
              <input type="file" accept="video/*" onChange={e => {
                const f = e.target.files?.[0];
                if (f) setVideoSrc(URL.createObjectURL(f));
              }} className="hidden" />
            </label>
          </div>

          {videoSrc && (
            <div className="mt-4">
              <video src={videoSrc} controls className="w-full rounded bg-black" />
            </div>
          )}
        </section>

        <aside className="bg-slate-900 p-4 rounded">
          <h4 className="font-semibold mb-2">Voices</h4>
          <div className="text-sm text-slate-400">Demo voices (local)</div>
          <div className="mt-4">
            <button className="w-full py-2 bg-slate-800 rounded">Browse Voices</button>
            <button className="w-full mt-2 py-2 bg-blue-600 rounded">Upgrade</button>
          </div>
        </aside>
      </main>
    </div>
  );
}
