import { useState } from 'react';
import { Monitor, Moon, Sun, MessageSquare, Shield, Smartphone } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import { useThemeStore } from '../store/useThemeStore';
import { cn } from '../lib/utils';

export default function SettingsPage() {
  const { theme, setTheme } = useThemeStore();

  return (
    <PageLayout title="Settings">
      <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl rounded-3xl shadow-xl shadow-black/5 border border-zinc-200/50 dark:border-zinc-800/50 overflow-hidden">
        <div className="p-6 md:p-8 space-y-10">
          
          {/* Appearance Section */}
          <section>
            <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2">
              <Monitor className="w-5 h-5 text-indigo-500" />
              Appearance
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <ThemeCard 
                active={theme === 'light'} 
                onClick={() => setTheme('light')} 
                icon={<Sun className="w-6 h-6" />} 
                title="Light" 
                desc="Clean and bright"
              />
              <ThemeCard 
                active={theme === 'dark'} 
                onClick={() => setTheme('dark')} 
                icon={<Moon className="w-6 h-6" />} 
                title="Dark" 
                desc="Easy on the eyes"
              />
              <ThemeCard 
                active={theme === 'system'} 
                onClick={() => setTheme('system')} 
                icon={<Smartphone className="w-6 h-6" />} 
                title="System" 
                desc="Matches your device"
              />
            </div>
          </section>

          <hr className="border-zinc-200 dark:border-zinc-800" />

          {/* Chat Preferences Section */}
          <section>
            <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-500" />
              Chat Preferences
            </h3>
            <div className="space-y-6 max-w-2xl">
              <ToggleSetting label="Enter to send" description="Pressing Enter will send the message. Use Shift+Enter for a new line." defaultChecked={true} />
              <ToggleSetting label="Auto-generate chat titles" description="Automatically create a title based on your first message." defaultChecked={true} />
              <ToggleSetting label="Sound notifications" description="Play a subtle sound when a response is complete." defaultChecked={false} />
            </div>
          </section>

          <hr className="border-zinc-200 dark:border-zinc-800" />

          {/* Privacy Section */}
          <section>
            <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-500" />
              Data & Privacy
            </h3>
            <div className="space-y-4 max-w-2xl">
              <button className="w-full flex flex-col text-left px-5 py-4 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors">
                <span className="font-medium text-sm text-zinc-900 dark:text-zinc-100">Export Data</span>
                <span className="text-sm text-zinc-500 mt-1">Download a copy of your conversations, account settings, and personal data as a JSON file.</span>
              </button>
              <button className="w-full flex flex-col text-left px-5 py-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">
                <span className="font-medium text-sm text-red-600 dark:text-red-400">Delete all history</span>
                <span className="text-sm text-red-500/80 mt-1">Permanently delete all conversations from your account. This action cannot be undone.</span>
              </button>
            </div>
          </section>
        </div>
      </div>
    </PageLayout>
  );
}

function ThemeCard({ active, onClick, icon, title, desc }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-start text-left p-5 rounded-xl border transition-all",
        active 
          ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-500/10 shadow-sm" 
          : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
      )}
    >
      <div className={cn(
        "mb-4 p-2 rounded-lg",
        active ? "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
      )}>
        {icon}
      </div>
      <div className="font-medium text-sm text-zinc-900 dark:text-zinc-100 mb-1">{title}</div>
      <div className="text-xs text-zinc-500 leading-relaxed">{desc}</div>
    </button>
  );
}

function ToggleSetting({ label, description, defaultChecked = true }: any) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <label className="flex items-start justify-between cursor-pointer group">
      <div className="pr-8">
        <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{label}</div>
        <div className="text-sm text-zinc-500 mt-1">{description}</div>
      </div>
      <div className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
        checked ? "bg-indigo-600" : "bg-zinc-300 dark:bg-zinc-700"
      )}>
        <input 
          type="checkbox" 
          className="sr-only" 
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        <span
          className={cn(
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </div>
    </label>
  );
}
