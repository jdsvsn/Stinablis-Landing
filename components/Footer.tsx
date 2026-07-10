"use client";

export default function Footer() {
  const scrollTo = (href: string) => {
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-carbon px-6 md:px-12 py-10 border-t border-frost/5 flex flex-col md:flex-row items-center justify-between flex-wrap gap-5 relative z-10">
      <div className="font-anton text-[24px] tracking-[0.1em] text-frost">
        STINABLIS
      </div>
      <ul className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-3 list-none">
        <li>
          <button
            onClick={() => scrollTo("#about")}
            className="text-[12px] text-mauve tracking-[0.05em] hover:text-coral transition-colors"
          >
            About
          </button>
        </li>
        <li>
          <button
            onClick={() => scrollTo("#process")}
            className="text-[12px] text-mauve tracking-[0.05em] hover:text-coral transition-colors"
          >
            Process
          </button>
        </li>
        <li>
          <button
            onClick={() => scrollTo("#products")}
            className="text-[12px] text-mauve tracking-[0.05em] hover:text-coral transition-colors"
          >
            Services
          </button>
        </li>
        <li>
          <button
            onClick={() => scrollTo("#pangkas")}
            className="text-[12px] text-mauve tracking-[0.05em] hover:text-coral transition-colors"
          >
            Pangkas
          </button>
        </li>
        <li>
          <a
            href="#"
            className="text-[12px] text-mauve tracking-[0.05em] hover:text-coral transition-colors"
          >
            Privacy
          </a>
        </li>
        <li>
          <a
            href="#"
            className="text-[12px] text-mauve tracking-[0.05em] hover:text-coral transition-colors"
          >
            Terms
          </a>
        </li>
      </ul>
      <p className="text-[13px] text-mauve font-dm-sans">
        © {new Date().getFullYear()} STINABLIS. Kuching, Sarawak, Malaysia.
      </p>
    </footer>
  );
}
