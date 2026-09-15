'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/language-context';
import {
  LuDownload,
  LuSmartphone,
  LuX,
  LuShare2,
  LuSquarePlus,
  LuCheck,
  LuArrowDownToLine,
} from 'react-icons/lu';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function PwaInstallButton() {
  const { lang } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showIosModal, setShowIosModal] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode (already installed)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // Check if iOS device
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    const handleCustomTrigger = () => {
      if (deferredPrompt) {
        deferredPrompt.prompt().then(() => {
          deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
              setIsInstalled(true);
            }
            setDeferredPrompt(null);
          });
        });
      } else {
        setShowIosModal(true);
      }
    };

    window.addEventListener('pwa:trigger-install', handleCustomTrigger);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('pwa:trigger-install', handleCustomTrigger);
    };
  }, [deferredPrompt]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      setShowIosModal(true);
    }
  };

  if (isInstalled && !showIosModal) {
    return null;
  }

  const isOd = lang === 'OD';

  return (
    <>
      {/* Floating Action Button */}
      {!isDismissed && !isInstalled && (
        <div className="fixed bottom-20 lg:bottom-6 right-4 z-40 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="group relative flex items-center bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#ea580c] text-white p-1.5 pl-3 pr-3.5 rounded-full shadow-lg shadow-orange-500/30 border border-white/25 hover:shadow-xl hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer">
            <button
              type="button"
              onClick={handleInstallClick}
              className="flex items-center gap-2.5 text-left select-none cursor-pointer"
              title={isOd ? 'ଆପ୍ ଇନଷ୍ଟଲ୍ କରନ୍ତୁ' : 'Install Korei Sevaka App'}
            >
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
                <LuArrowDownToLine className="w-4 h-4 text-white animate-bounce" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-medium text-orange-100 leading-tight">
                  {isOd ? 'ମୋବାଇଲ୍ ଆପ୍' : 'Fast & Offline'}
                </span>
                <span className="text-xs font-black tracking-tight text-white leading-tight">
                  {isOd ? 'ଆପ୍ ଡାଉନଲୋଡ୍ କରନ୍ତୁ' : 'Download App'}
                </span>
              </div>
            </button>

            {/* Dismiss button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsDismissed(true);
              }}
              className="ml-2 p-1 text-white/60 hover:text-white rounded-full hover:bg-white/15 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <LuX className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* iOS / General Install Guide Modal */}
      {showIosModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowIosModal(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-orange-50 border border-orange-100 p-1 flex items-center justify-center">
                  <img src="/images/lotus-img.png" alt="Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {isOd ? 'କୋରେଇ ସେବକ ଆପ୍' : 'Korei Sevaka App'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {isOd ? 'ଆପଣଙ୍କ ଫୋନରେ ଇନଷ୍ଟଲ୍ କରନ୍ତୁ' : 'Install on your device'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowIosModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700"
              >
                <LuX className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <p className="text-xs text-slate-600">
                {isIos
                  ? isOd
                    ? 'ଆପଣଙ୍କ iPhone/iPad ରେ ଆପ୍ ଇନଷ୍ଟଲ୍ କରିବା ପାଇଁ ଏହି ସହଜ ପଦକ୍ଷେପ ଅନୁସରଣ କରନ୍ତୁ:'
                    : 'Follow these quick steps to install this app on your iPhone or iPad:'
                  : isOd
                  ? 'ଆପ୍ ଇନଷ୍ଟଲ୍ କରିବା ପାଇଁ ବ୍ରାଉଜର୍ ମେନୁରୁ "Add to Home Screen" ବାଛନ୍ତୁ:'
                  : 'Install this app on your phone for quick 1-tap access and offline support:'}
              </p>

              <div className="bg-slate-50 rounded-2xl p-3 space-y-2.5 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold shrink-0">
                    1
                  </div>
                  <div className="text-xs text-slate-700 flex items-center gap-1.5 flex-wrap">
                    <span>{isOd ? 'ନିମ୍ନରେ ଥିବା' : 'Tap the'}</span>
                    <span className="inline-flex items-center gap-1 font-semibold text-slate-900 bg-white px-2 py-0.5 rounded-lg border border-slate-200">
                      <LuShare2 className="w-3.5 h-3.5 text-blue-600" />
                      Share
                    </span>
                    <span>{isOd ? 'ବଟନ୍ କ୍ଲିକ୍ କରନ୍ତୁ' : 'button'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold shrink-0">
                    2
                  </div>
                  <div className="text-xs text-slate-700 flex items-center gap-1.5 flex-wrap">
                    <span>{isOd ? 'ତାଲିକାରୁ' : 'Scroll down & tap'}</span>
                    <span className="inline-flex items-center gap-1 font-semibold text-slate-900 bg-white px-2 py-0.5 rounded-lg border border-slate-200">
                      <LuSquarePlus className="w-3.5 h-3.5 text-orange-600" />
                      Add to Home Screen
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold shrink-0">
                    <LuCheck className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-xs text-slate-700">
                    <span>{isOd ? 'ଉପରେ "Add" କ୍ଲିକ୍ କରନ୍ତୁ ଏବଂ ଆପ୍ ରେଡି ହୋଇଯିବ!' : 'Tap "Add" in the top right to complete.'}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowIosModal(false)}
                className="w-full py-2.5 bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white text-xs font-bold rounded-xl shadow-md hover:brightness-105 active:scale-98 transition-all"
              >
                {isOd ? 'ବୁଝିଗଲି' : 'Got it'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
