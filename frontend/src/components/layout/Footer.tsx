import { GitBranch, LinkIcon, Mail, MapPin, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="glass rounded-3xl p-6 md:p-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="space-y-3">
              <div className="text-sm font-semibold text-zinc-900 dark:text-white">LocalTown</div>
              <p className="text-sm text-zinc-700 dark:text-zinc-300">
                Smart town community platform—rentals, workers, offers, services, emergencies and real-time alerts.
              </p>
              <div className="flex items-center gap-2">
                <a className="grid size-10 place-items-center rounded-2xl hover:bg-white/10" href="#" aria-label="Website">
                  <LinkIcon className="size-5 text-zinc-800 dark:text-white" />
                </a>
                <a className="grid size-10 place-items-center rounded-2xl hover:bg-white/10" href="#" aria-label="Git">
                  <GitBranch className="size-5 text-zinc-800 dark:text-white" />
                </a>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
                Quick links
              </div>
              <div className="grid gap-2 text-sm">
                <Link className="text-zinc-800 hover:underline dark:text-zinc-200" to="/rentals">
                  Rentals
                </Link>
                <Link className="text-zinc-800 hover:underline dark:text-zinc-200" to="/workers">
                  Workers
                </Link>
                <Link className="text-zinc-800 hover:underline dark:text-zinc-200" to="/offers">
                  Offers
                </Link>
                <Link className="text-zinc-800 hover:underline dark:text-zinc-200" to="/events">
                  Events
                </Link>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
                Contact
              </div>
              <div className="space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
                <div className="flex items-center gap-2">
                  <MapPin className="size-4 opacity-80" />
                  <span>Your Town, India</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="size-4 opacity-80" />
                  <span>+91 00000 00000</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="size-4 opacity-80" />
                  <span>support@localtown.app</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
                Newsletter
              </div>
              <p className="text-sm text-zinc-700 dark:text-zinc-300">
                Weekly town updates: offers, alerts, and events.
              </p>
              <div className="flex gap-2">
                <input
                  className="w-full rounded-2xl border border-white/10 bg-white/15 px-3 py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-500 dark:text-white dark:placeholder:text-zinc-400"
                  placeholder="you@example.com"
                />
                <button className="rounded-2xl bg-zinc-900 px-4 py-2 text-sm text-white dark:bg-white dark:text-zinc-900">
                  Join
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-zinc-600 dark:text-zinc-300 md:flex-row">
            <div>© {new Date().getFullYear()} LocalTown. All rights reserved.</div>
            <div className="flex items-center gap-4">
              <a className="hover:underline" href="#">
                Privacy
              </a>
              <a className="hover:underline" href="#">
                Terms
              </a>
              <a className="hover:underline" href="#">
                Security
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

