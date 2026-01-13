import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900 text-white selection:bg-indigo-500 selection:text-white">
      <header className="fixed w-full z-50 bg-slate-900/80 backdrop-blur border-b border-slate-800">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            AppCreator
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-400">
            <Link href="#" className="hover:text-white transition">Features</Link>
            <Link href="#" className="hover:text-white transition">Pricing</Link>
            <Link href="#" className="hover:text-white transition">Showcase</Link>
          </nav>
          <div className="flex gap-4">
            <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white px-4 py-2">
              Sign In
            </Link>
            <Link href="/create" className="text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-full transition shadow-lg shadow-indigo-500/20">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-medium text-slate-400 mb-8">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            v1.0 Public Beta
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
            Turn ideas into <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              shipping code.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12">
            Describe your application in plain English. We extract requirements,
            generate specifications, and write the code for you.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/create" className="h-12 px-8 rounded-full bg-white text-slate-900 font-semibold flex items-center hover:bg-slate-100 transition">
              Build an App
            </Link>
            <Link href="/demo" className="h-12 px-8 rounded-full bg-slate-800 border border-slate-700 text-white font-semibold flex items-center hover:bg-slate-700 transition">
              View Demo
            </Link>
          </div>

          {/* Visual Placeholder */}
          <div className="mt-20 relative mx-auto max-w-5xl">
            <div className="aspect-video rounded-xl bg-slate-800 border border-slate-700 shadow-2xl overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-slate-800 to-indigo-900/20 opacity-50"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-slate-500 font-mono">APP PREVIEW INTERFACE</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
