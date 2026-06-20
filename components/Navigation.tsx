'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ExportImport } from '@/components/ExportImport';

const links = [
  { href: '/', label: 'Dashboard' },
  { href: '/ingredients', label: 'Ingredients' },
  { href: '/recipes', label: 'Recipes' },
  { href: '/how-to', label: 'How To' },
];

export function Navigation() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3 py-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl" aria-hidden>
              🧮
            </span>
            <Link href="/" className="font-semibold text-lg text-slate-900">
              Recipe Price Calculator
            </Link>
          </div>

          <nav className="flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <ExportImport />
        </div>
      </div>
    </header>
  );
}
