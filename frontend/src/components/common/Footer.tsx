import { Compass, Mail, Twitter, Linkedin, Github } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 space-y-4">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="p-2.5 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl shadow-lg shadow-indigo-600/30">
                <Compass className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-xl font-black tracking-tight text-white leading-none">
                  Voyage<span className="text-indigo-400">AI</span>
                </span>
                <span className="block text-[9px] uppercase tracking-widest text-slate-400 font-semibold mt-1">
                  Smart Travel Planner
                </span>
              </div>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              AI-powered smart travel assistant. Craft day-by-day itineraries, flight options, hotel suggestions, and budget breakdowns instantly.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Explore</h3>
            <ul className="space-y-2.5 text-xs font-medium">
              <li><Link to="/explore" className="hover:text-indigo-400 transition-colors">Popular Destinations</Link></li>
              <li><Link to="/trips/create" className="hover:text-indigo-400 transition-colors">AI Itinerary Generator</Link></li>
              <li><Link to="/trips" className="hover:text-indigo-400 transition-colors">Saved Trips</Link></li>
              <li><Link to="/profile" className="hover:text-indigo-400 transition-colors">Traveler Persona & Avatars</Link></li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Features</h3>
            <ul className="space-y-2.5 text-xs font-medium">
              <li><span className="hover:text-indigo-400 transition-colors cursor-pointer">1-Click Offline Guest Mode</span></li>
              <li><span className="hover:text-indigo-400 transition-colors cursor-pointer">Budget Breakdown</span></li>
              <li><span className="hover:text-indigo-400 transition-colors cursor-pointer">Interactive Packing Checklist</span></li>
              <li><span className="hover:text-indigo-400 transition-colors cursor-pointer">Weather Forecasts</span></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Privacy & Safety</h3>
            <ul className="space-y-2.5 text-xs font-medium">
              <li><span className="hover:text-indigo-400 transition-colors cursor-pointer">Local Storage Privacy</span></li>
              <li><span className="hover:text-indigo-400 transition-colors cursor-pointer">Terms of Service</span></li>
              <li><span className="hover:text-indigo-400 transition-colors cursor-pointer">Guest Mode Safety</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col md:flex-row justify-between items-center text-xs">
          <p className="text-slate-500">
            © 2026 VoyageAI. All rights reserved. Built for travelers worldwide.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0 text-slate-400">
            <a href="#" className="hover:text-indigo-400 transition-colors">
              <Twitter className="h-4 w-4" />
            </a>
            <a href="#" className="hover:text-indigo-400 transition-colors">
              <Linkedin className="h-4 w-4" />
            </a>
            <a href="#" className="hover:text-indigo-400 transition-colors">
              <Github className="h-4 w-4" />
            </a>
            <a href="#" className="hover:text-indigo-400 transition-colors">
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
