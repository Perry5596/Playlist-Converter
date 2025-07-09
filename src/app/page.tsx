export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          playlist <span className="text-[hsl(280,100%,70%)]">convert</span>
        </h1>
        <div className="flex flex-col gap-4 rounded-xl bg-white/10 p-6 text-center">
          <h2 className="text-2xl font-bold">Music Without Boundaries</h2>
          <p className="text-lg">
            Seamlessly convert your playlists between music streaming services. We currently support Spotify, Apple Music, YouTube Music, and SoundCloud.
          </p>
          <a
            href="/convert"
            className="max-w-xs self-center rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
          >
            Start Converting →
          </a>
        </div>
        <footer className="mt-auto text-center text-sm text-white/50">
          <a
            href="https://github.com/Perry5596/Playlist-Converter"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center mb-6 hover:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6 mr-2 hover:text-white"
            >
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.17c-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.084 1.84 1.237 1.84 1.237 1.07 1.835 2.805 1.305 3.49.998.108-.775.42-1.305.763-1.605-2.665-.3-5.467-1.332-5.467-5.93 0-1.31.467-2.38 1.235-3.22-.123-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.52 11.52 0 013.003-.403c1.02.005 2.045.137 3.003.403 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.24 2.873.117 3.176.77.84 1.233 1.91 1.233 3.22 0 4.61-2.807 5.625-5.48 5.92.43.37.823 1.102.823 2.222v3.293c0 .32.217.694.825.576C20.565 21.797 24 17.297 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            GitHub
          </a>
          <div className="mb-2">
            <a href="/privacy" className="mx-2 hover:text-white">Privacy Policy</a>
            <span>•</span>
            <a href="/terms" className="mx-2 hover:text-white">Terms of Service</a>
          </div>
          <p>© {new Date().getFullYear()} Playlist Convert. All rights reserved.</p>
        </footer>
      </div>
    </main>
  );
}