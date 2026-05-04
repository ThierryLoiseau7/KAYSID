import Link from "next/link";
import { Home, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-caribbean-950 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-caribbean-600 rounded-xl flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">
                Pou<span className="text-caribbean-400">Piyay</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Platfòm nimewo 1 pou jwenn lojman nan Sid Ayiti. Okay, Jakmèl,
              Port-Salut, Jeremi — nou kouvri tout.
            </p>
            <div className="flex items-center gap-2 mt-5 text-sm text-slate-400">
              <MapPin className="w-4 h-4 text-caribbean-500" />
              Okay, Sid Ayiti
            </div>
          </div>

          {/* Navigasyon */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Navigasyon
            </h3>
            <ul className="space-y-2.5">
              {[
                { href: "/listings", label: "Chèche Kay" },
                { href: "/listings?listing_type=rent", label: "Pou Lwaye" },
                { href: "/listings?listing_type=sale", label: "Pou Vann" },
                { href: "/listings?property_type=te", label: "Terin" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-slate-400 hover:text-caribbean-400 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kont */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Kont Ou
            </h3>
            <ul className="space-y-2.5">
              {[
                { href: "/register", label: "Enskri Gratis" },
                { href: "/login", label: "Konekte" },
                { href: "/dashboard", label: "Tableau de Bò" },
                { href: "/dashboard/new-listing", label: "Poste Anons" },
                { href: "/dashboard/favorites", label: "Favori Ou" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-slate-400 hover:text-caribbean-400 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kominikasyon */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Kontakte Nou
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-slate-400">
                <Phone className="w-4 h-4 text-caribbean-500 shrink-0" />
                <a href="tel:+50936000000" className="hover:text-caribbean-400 transition-colors">
                  +509 3600-0000
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-400">
                <Mail className="w-4 h-4 text-caribbean-500 shrink-0" />
                <a href="mailto:info@poupiyay.ht" className="hover:text-caribbean-400 transition-colors">
                  info@poupiyay.ht
                </a>
              </li>
            </ul>

            <div className="mt-6 p-3 bg-caribbean-900/50 rounded-xl border border-caribbean-800">
              <p className="text-xs text-slate-400">
                <span className="text-sunset-400 font-semibold">100% Gratis</span> pou poste
                anons. Premium disponib pou ajan k ap vle mete anons yo anlè.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-caribbean-900 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            © 2025 PouPiyay. Tout dwa rezève. Fèt ak ❤ pou Ayiti.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <Link href="/privacy" className="hover:text-slate-400 transition-colors">
              Konfidansyalite
            </Link>
            <Link href="/terms" className="hover:text-slate-400 transition-colors">
              Kondisyon
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
