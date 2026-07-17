"use client";

import { usePathname, useRouter } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const router = useRouter();

  const scrollTo = (href: string) => {
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleNavClick = (href: string) => {
    if (href === "#products") {
      if (pathname === "/services") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        router.push("/services");
      }
    } else if (href === "#3d-model") {
      if (pathname === "/3d-model") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        router.push("/3d-model");
      }
    } else if (href === "#pangkas") {
      if (pathname === "/pangkas") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        router.push("/pangkas");
      }
    } else if (href === "#about") {
      if (pathname === "/about") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        router.push("/about");
      }
    } else {
      if (pathname === "/") {
        scrollTo(href);
      } else {
        sessionStorage.setItem("scrollToSection", href);
        router.push("/");
      }
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
            onClick={() => handleNavClick("#about")}
            className="text-[12px] text-mauve tracking-[0.05em] hover:text-coral transition-colors"
          >
            About
          </button>
        </li>
        <li>
          <button
            onClick={() => handleNavClick("#process")}
            className="text-[12px] text-mauve tracking-[0.05em] hover:text-coral transition-colors"
          >
            Process
          </button>
        </li>
        <li>
          <button
            onClick={() => handleNavClick("#products")}
            className="text-[12px] text-mauve tracking-[0.05em] hover:text-coral transition-colors"
          >
            Services
          </button>
        </li>
        <li>
          <button
            onClick={() => handleNavClick("#3d-model")}
            className="text-[12px] text-mauve tracking-[0.05em] hover:text-coral transition-colors"
          >
            3D Model
          </button>
        </li>
        <li>
          <button
            onClick={() => handleNavClick("#pangkas")}
            className="text-[12px] text-mauve tracking-[0.05em] hover:text-coral transition-colors"
          >
            Pangkas
          </button>
        </li>
      </ul>
      <p className="text-[13px] text-mauve font-dm-sans">
        © {new Date().getFullYear()} STINABLIS. Kuching, Sarawak, Malaysia.
      </p>
    </footer>
  );
}
