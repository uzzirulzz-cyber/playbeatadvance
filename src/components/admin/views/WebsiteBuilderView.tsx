import React, { useState, useEffect } from 'react';
import { useStore } from '../../../store/useStore';
import { 
  Palette, 
  Layout, 
  Sparkles, 
  Eye, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  Image as ImageIcon, 
  Sliders, 
  Type, 
  Tv, 
  ShieldCheck, 
  MessageCircle, 
  Smartphone, 
  CreditCard, 
  Code,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
  Plus
} from 'lucide-react';
import { ThemePreset } from '../../../types';

export const WebsiteBuilderView: React.FC = () => {
  const { themePreset, setThemePreset, setActiveView } = useStore();

  // Section visibility states
  const [sections, setSections] = useState({
    announcementBar: true,
    heroSpotlight: true,
    smartProjectors: true,
    categoryFilter: true,
    trustBadges: true,
    whatsappWidget: true,
    liveSupportDesk: true,
    newsletterBox: true,
  });

  // Hero & Announcement texts
  const [announcementText, setAnnouncementText] = useState('Welcome to PlayBeat Digital (playbeat.digital) — Instant Delivery');
  const [promoCode, setPromoCode] = useState('PLAYBEAT20');
  const [heroHeading, setHeroHeading] = useState('Next-Gen Digital Goods & 4K Cinema Projectors');
  const [heroSubheading, setHeroSubheading] = useState('Buy official Windows 11 Pro, Office 2024, ChatGPT Plus, IPTV 4K passes, and ZeroByte Android 11 smart projectors with instant dispatch across Pakistan.');
  const [whatsappPhone, setWhatsappPhone] = useState('+923321029333');
  const [customCss, setCustomCss] = useState('/* Custom Storefront CSS overrides */\n.theme-martfury { --primary: #fcb800; }');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('playbeat_sections_config');
    if (saved) {
      try {
        setSections(prev => ({ ...prev, ...JSON.parse(saved) }));
      } catch (e) {}
    }
  }, []);

  const toggleSection = (key: keyof typeof sections) => {
    setSections(prev => {
      const next = { ...prev, [key]: !prev[key] };
      localStorage.setItem('playbeat_sections_config', JSON.stringify(next));
      window.dispatchEvent(new Event('sections_updated'));
      return next;
    });
  };

  const handleSaveConfig = () => {
    localStorage.setItem('playbeat_sections_config', JSON.stringify(sections));
    window.dispatchEvent(new Event('sections_updated'));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const themeOptions: { id: ThemePreset; name: string; desc: string; colors: string[] }[] = [
    {
      id: 'martfury',
      name: 'Martfury Yellow & Navy (Default)',
      desc: 'High-contrast e-commerce palette with rich navy slate canvas and bright yellow accents.',
      colors: ['#070b14', '#0f172a', '#fcb800', '#10b981']
    },
    {
      id: 'obsidian',
      name: 'Obsidian Royal Purple',
      desc: 'Sleek luxury dark theme with electric violet gradients and purple highlights.',
      colors: ['#070b14', '#131127', '#a855f7', '#6366f1']
    },
    {
      id: 'titanium',
      name: 'Titanium Light Retail',
      desc: 'Crisp, high-readability off-white theme with high contrast typography.',
      colors: ['#f8fafc', '#ffffff', '#2563eb', '#0f172a']
    },
    {
      id: 'cyberpunk',
      name: 'Cyberpunk Neon Matrix',
      desc: 'Bold arcade aesthetic with neon cyan and yellow contrast borders.',
      colors: ['#050811', '#0b1329', '#06b6d4', '#facc15']
    },
    {
      id: 'emerald',
      name: 'Emerald Mint Tech',
      desc: 'Organic high-trust fintech palette with deep emerald greens and mint chips.',
      colors: ['#06110d', '#0c221a', '#10b981', '#34d399']
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#11192e]/90 border border-slate-800/80 p-4 rounded-2xl shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold uppercase tracking-wider">
              Visual Customizer
            </span>
            <span className="text-xs text-slate-400">Teamgress Figma-to-Webflow Engine</span>
          </div>
          <h2 className="text-lg font-black text-white flex items-center gap-2 mt-1">
            <Layout className="w-5 h-5 text-[#fcb800]" />
            <span>Storefront Website Builder & Layout Manager</span>
          </h2>
          <p className="text-xs text-slate-400">
            Control live sections, branding themes, announcement bars, and WhatsApp support widgets in real-time.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveView('storefront')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-purple-400" />
            <span>Live Preview</span>
          </button>

          <button
            onClick={handleSaveConfig}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#fcb800] hover:bg-[#e5a700] text-slate-950 text-xs font-black transition-all shadow-lg shadow-yellow-500/20 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save & Publish</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Website changes published successfully! Live storefront has been updated.</span>
        </div>
      )}

      {/* Grid: Sections Manager & Theme Presets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Col (7 cols): Layout Sections Builder */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#11192e]/90 border border-slate-800/80 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#fcb800]" />
                  <span>Homepage Modular Section Toggles</span>
                </h3>
                <p className="text-xs text-slate-400">Toggle or re-order sections displayed on the public storefront.</p>
              </div>
            </div>

            <div className="space-y-2.5">
              {[
                { key: 'announcementBar' as const, label: 'Top Announcement & Micro-Utility Bar', desc: 'Promo coupon alerts, currency switcher, and phone badge' },
                { key: 'heroSpotlight' as const, label: 'Dynamic Hero Showcase & Search Spotlight', desc: 'Main headline, quick tag filters, and value proposition' },
                { key: 'smartProjectors' as const, label: 'ZeroByte 4K Cinema Projectors Showcase', desc: '8 verified cinema projectors with wholesale cost & retail pricing' },
                { key: 'categoryFilterBar' as const, label: 'Category Slider & Marketplace Filters', desc: 'Interactive category selector, type badges, and sorting pills' },
                { key: 'trustBadges' as const, label: 'Trust & Verification Guarantee Badges', desc: '24/7 delivery, replacement warranty, and official licensing chips' },
                { key: 'whatsappWidget' as const, label: 'Floating WhatsApp Direct Support Widget', desc: 'Interactive floating chat button (+923321029333)' },
                { key: 'liveSupportDesk' as const, label: '24/7 AI & Human Live Support Modal', desc: 'Instant support chat for license queries and bank transfer verification' },
                { key: 'newsletterBox' as const, label: 'Footer Newsletter & App Download Box', desc: 'Email subscription form with auto-coupon rewards' },
              ].map((sec) => (
                <div 
                  key={sec.key}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors"
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-white">{sec.label}</div>
                    <div className="text-[11px] text-slate-400">{sec.desc}</div>
                  </div>

                  <button
                    onClick={() => toggleSection(sec.key as any)}
                    className="cursor-pointer text-xl p-1 transition-transform active:scale-95"
                  >
                    {(sections as any)[sec.key] ? (
                      <ToggleRight className="w-8 h-8 text-[#fcb800]" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-slate-600" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Banner & Hero Copy Customizer */}
          <div className="bg-[#11192e]/90 border border-slate-800/80 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Type className="w-4 h-4 text-purple-400" />
              <span>Branding & Header Content Customizer</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Top Announcement Bar Text</label>
                <input
                  type="text"
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#fcb800]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Active Promo Code</label>
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-[#fcb800] font-mono font-bold focus:outline-none focus:border-[#fcb800]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Official WhatsApp Phone</label>
                  <input
                    type="text"
                    value={whatsappPhone}
                    onChange={(e) => setWhatsappPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Hero Main Headline</label>
                <input
                  type="text"
                  value={heroHeading}
                  onChange={(e) => setHeroHeading(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-[#fcb800]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Hero Subheading Description</label>
                <textarea
                  rows={2}
                  value={heroSubheading}
                  onChange={(e) => setHeroSubheading(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-[#fcb800]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Col (5 cols): Theme Presets & Custom CSS */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#11192e]/90 border border-slate-800/80 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Palette className="w-4 h-4 text-[#fcb800]" />
              <span>Theme Archetype & Color Engine</span>
            </h3>

            <div className="space-y-3">
              {themeOptions.map((th) => (
                <div
                  key={th.id}
                  onClick={() => setThemePreset(th.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    themePreset === th.id
                      ? 'bg-slate-900 border-[#fcb800] shadow-lg shadow-yellow-500/10'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {th.colors.map((c, i) => (
                          <span
                            key={i}
                            className="w-3.5 h-3.5 rounded-full border border-black/40 shadow-sm"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-white">{th.name}</span>
                    </div>

                    {themePreset === th.id && (
                      <span className="px-2 py-0.5 rounded-md bg-[#fcb800] text-slate-950 text-[10px] font-black uppercase tracking-wider">
                        Active
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed">{th.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Custom CSS Engine */}
          <div className="bg-[#11192e]/90 border border-slate-800/80 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Code className="w-4 h-4 text-emerald-400" />
              <span>Custom CSS & Webflow Scripts</span>
            </h3>
            <p className="text-[11px] text-slate-400">Inject custom stylesheet rules for specialized branding.</p>
            
            <textarea
              rows={4}
              value={customCss}
              onChange={(e) => setCustomCss(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-mono text-[11px] focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

      </div>
    </div>
  );
};
