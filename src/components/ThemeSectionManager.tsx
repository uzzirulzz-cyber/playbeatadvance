import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { ThemePreset } from '../types';
import { 
  Palette, 
  Layers, 
  Check, 
  X, 
  Sliders, 
  Sparkles, 
  Eye, 
  EyeOff, 
  RotateCcw,
  Sun,
  Moon,
  Zap,
  Projector
} from 'lucide-react';

interface SectionVisibility {
  smartProjectors: boolean;
  heroSpotlight: boolean;
  categoryFilter: boolean;
  trustBadges: boolean;
}

export const ThemeSectionManager: React.FC = () => {
  const { themePreset, setThemePreset } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  // Storefront Section Visibility Settings persisted in localStorage
  const [sections, setSections] = useState<SectionVisibility>(() => {
    const saved = localStorage.getItem('playbeat_sections_config');
    return saved ? JSON.parse(saved) : {
      smartProjectors: true,
      heroSpotlight: true,
      categoryFilter: true,
      trustBadges: true,
    };
  });

  const toggleSection = (key: keyof SectionVisibility) => {
    const updated = { ...sections, [key]: !sections[key] };
    setSections(updated);
    localStorage.setItem('playbeat_sections_config', JSON.stringify(updated));
    // Trigger custom event so storefront re-renders cleanly
    window.dispatchEvent(new Event('sections_updated'));
  };

  const themes: { id: ThemePreset; name: string; desc: string; colors: string; bg: string }[] = [
    {
      id: 'martfury',
      name: 'Martfury Signature',
      desc: 'Envato Martfury gold-yellow marketplace palette (#fcb800) with deep obsidian contrast',
      colors: 'from-amber-400 to-yellow-500',
      bg: 'bg-amber-500'
    },
    {
      id: 'obsidian',
      name: 'Cyber Obsidian Dark',
      desc: 'Midnight indigo & purple neon theme with high-contrast glowing accents',
      colors: 'from-purple-600 to-indigo-600',
      bg: 'bg-purple-600'
    },
    {
      id: 'titanium',
      name: 'Titanium Light',
      desc: 'Crisp, high-contrast studio white & platinum design for bright environments',
      colors: 'from-slate-200 to-slate-400',
      bg: 'bg-slate-300'
    },
    {
      id: 'cyberpunk',
      name: 'Neon Cyberpunk',
      desc: 'Vibrant hot pink, cyan and electric blue styling',
      colors: 'from-pink-500 to-cyan-400',
      bg: 'bg-pink-500'
    },
    {
      id: 'emerald',
      name: 'Emerald FinTech',
      desc: 'Polished emerald green & mint palette tailored for payment systems',
      colors: 'from-emerald-500 to-teal-400',
      bg: 'bg-emerald-500'
    }
  ];

  return (
    <>
      {/* Floating Theme & Section Customizer Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 left-4 z-40 px-3.5 py-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 shadow-2xl backdrop-blur-md flex items-center gap-2 text-xs font-bold transition-all cursor-pointer group hover:border-purple-500"
      >
        <div className="w-5 h-5 rounded-lg bg-gradient-to-tr from-amber-400 to-purple-600 flex items-center justify-center text-white">
          <Palette className="w-3 h-3" />
        </div>
        <span>Theme & Sections</span>
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      </button>

      {/* Drawer / Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e1628] border border-slate-700 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Storefront Customizer</h3>
                  <p className="text-xs text-slate-400">Select active theme preset or toggle layout sections</p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Section 1: Themes */}
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-purple-400" />
                Marketplace Theme Presets
              </label>

              <div className="grid grid-cols-1 gap-2.5">
                {themes.map(t => {
                  const isActive = themePreset === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setThemePreset(t.id)}
                      className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        isActive
                          ? 'bg-purple-950/40 border-purple-500 shadow-lg shadow-purple-900/20 ring-1 ring-purple-500/50'
                          : 'bg-slate-900/60 hover:bg-slate-800 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${t.colors} flex items-center justify-center shadow`}>
                          {isActive && <Check className="w-4 h-4 text-slate-950 font-bold" />}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-2">
                            <span>{t.name}</span>
                            {t.id === 'martfury' && (
                              <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-mono">
                                ENVATO OFFICIAL
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 leading-tight mt-0.5">{t.desc}</div>
                        </div>
                      </div>

                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isActive ? 'border-purple-400 bg-purple-500' : 'border-slate-700'}`}>
                        {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section 2: Storefront Layout Sections */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <label className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-purple-400" />
                Add / Remove Storefront Sections
              </label>

              <div className="space-y-2">
                {[
                  {
                    key: 'smartProjectors' as keyof SectionVisibility,
                    name: '🎬 Pinned Smart Projectors Spotlight',
                    desc: 'Magcubic, HY300 4K & battery models showcase under hero',
                    badge: 'PINNED'
                  },
                  {
                    key: 'heroSpotlight' as keyof SectionVisibility,
                    name: '⚡ Hero Spotlight Banner & Trending Passes',
                    desc: 'Main marketplace header with live flash statistics and search',
                    badge: 'HERO'
                  },
                  {
                    key: 'categoryFilter' as keyof SectionVisibility,
                    name: '🏷️ Category Pills & Live Filters Toolbar',
                    desc: 'Multi-category explorer and sorting options',
                    badge: 'GRID'
                  },
                  {
                    key: 'trustBadges' as keyof SectionVisibility,
                    name: '🛡️ Trust Badges & Verified Escrow Guarantee',
                    desc: 'Security certifications, payment guarantees, and 24/7 support',
                    badge: 'TRUST'
                  }
                ].map(item => {
                  const enabled = sections[item.key];
                  return (
                    <div
                      key={item.key}
                      className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-3"
                    >
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-white flex items-center gap-2">
                          <span>{item.name}</span>
                          <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 text-[9px] font-mono font-bold">
                            {item.badge}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400">{item.desc}</div>
                      </div>

                      <button
                        onClick={() => toggleSection(item.key)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                          enabled
                            ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        <span>{enabled ? 'Visible' : 'Hidden'}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <button
                onClick={() => {
                  setThemePreset('martfury');
                  const def = { smartProjectors: true, heroSpotlight: true, categoryFilter: true, trustBadges: true };
                  setSections(def);
                  localStorage.setItem('playbeat_sections_config', JSON.stringify(def));
                  window.dispatchEvent(new Event('sections_updated'));
                }}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Defaults</span>
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold cursor-pointer shadow-lg shadow-purple-600/30"
              >
                Apply & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
