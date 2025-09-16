import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-[--color-border] bg-[--color-surface] backdrop-blur">
      <div className="container-gutter py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-[--color-foreground]">
        <p className="text-sm text-[--color-foreground-muted]">© {new Date().getFullYear()} SIGMACODE AI Robotics</p>
        <nav className="flex items-center gap-5 text-sm" aria-label="Footer">
          <Link href="#executive" className="hover:opacity-80 transition">Executive</Link>
          <Link href="#finance" className="hover:opacity-80 transition">Finance</Link>
        </nav>
      </div>
    </footer>
  );
}
