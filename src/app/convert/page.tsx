'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProviderLogo } from '../../components/ProviderLogo';

type Provider = 'spotify' | 'apple' | 'youtube' | 'soundcloud';

interface StepProps {
  currentStep: number;
  totalSteps: number;
}

const PROVIDER_URL_PATTERNS: Record<Provider, { example: string; pattern: RegExp }> = {
  spotify: {
    example: 'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M',
    pattern: /^https:\/\/open\.spotify\.com\/playlist\/[a-zA-Z0-9]+$/
  },
  apple: {
    example: 'https://music.apple.com/us/playlist/pl.u-AkAmPpluNXjv8x',
    pattern: /^https:\/\/music\.apple\.com\/[a-z]{2}\/playlist\/.*$/
  },
  youtube: {
    example: 'https://music.youtube.com/playlist?list=PLMC9KNkIncKtPzgY-5rmhvj7fax8fdxoj',
    pattern: /^https:\/\/music\.youtube\.com\/playlist\?list=[a-zA-Z0-9_-]+$/
  },
  soundcloud: {
    example: 'https://soundcloud.com/user/sets/playlist-name',
    pattern: /^https:\/\/soundcloud\.com\/.*\/sets\/.*$/
  }
};

const StepIndicator: React.FC<StepProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div
          key={i}
          className={`w-3 h-3 rounded-full ${
            i + 1 === currentStep ? 'bg-[hsl(280,100%,70%)]' : 'bg-white/30'
          }`}
        />
      ))}
    </div>
  );
};

export default function Convert() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [sourceProvider, setSourceProvider] = useState<Provider | null>(null);
  const [destinationProvider, setDestinationProvider] = useState<Provider | null>(null);
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [isUrlValid, setIsUrlValid] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);

  const providers: Provider[] = ['spotify', 'apple', 'youtube', 'soundcloud'];

  const validateUrl = (url: string, provider: Provider) => {
    if (!url) {
      setUrlError('Please enter a URL');
      setIsUrlValid(false);
      return false;
    }

    try {
      new URL(url); // Basic URL validation
    } catch {
      setUrlError('Please enter a valid URL');
      setIsUrlValid(false);
      return false;
    }

    const pattern = PROVIDER_URL_PATTERNS[provider].pattern;
    if (!pattern.test(url)) {
      setUrlError(`This doesn't look like a valid ${provider} playlist URL`);
      setIsUrlValid(false);
      return false;
    }

    setUrlError(null);
    setIsUrlValid(true);
    return true;
  };

  const handleProviderSelect = (provider: Provider) => {
    if (currentStep === 1) {
      setSourceProvider(provider);
      setCurrentStep(2);
      setPlaylistUrl('');
      setIsUrlValid(false);
      setUrlError(null);
    } else if (currentStep === 3) {
      setDestinationProvider(provider);
      setCurrentStep(4);
      setIsConverting(true);
      // TODO: Implement actual conversion logic
      setTimeout(() => {
        setConvertedUrl('https://example.com/converted-playlist');
        setIsConverting(false);
      }, 2000);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sourceProvider && validateUrl(playlistUrl, sourceProvider)) {
      setCurrentStep(3);
    }
  };

  const handleCopyUrl = () => {
    if (convertedUrl) {
      navigator.clipboard.writeText(convertedUrl);
    }
  };

  const handleDone = () => {
    router.push('/');
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-8 px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-extrabold tracking-tight text-white text-center">
          {currentStep === 1 && "Select Source Provider"}
          {currentStep === 2 && "Enter Playlist URL"}
          {currentStep === 3 && "Select Destination Provider"}
          {currentStep === 4 && (convertedUrl ? "Conversion Complete!" : "Converting...")}
        </h1>

        {currentStep === 1 && (
          <p className="text-lg text-center">
            Select the source provider where your existing playlist is located.
          </p>
        )}
        {currentStep === 2 && sourceProvider && (
          <p className="text-lg text-center">
            Enter the URL of your {sourceProvider} playlist.
          </p>
        )}
        {currentStep === 3 && (
          <p className="text-lg text-center">
            Select the destination provider where you want your playlist to be transferred.
          </p>
        )}

        <div className="w-full max-w-2xl bg-white/10 p-8 rounded-xl">
          {currentStep === 1 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {providers.map((provider) => (
                <button
                  key={provider}
                  onClick={() => handleProviderSelect(provider)}
                  className="aspect-square rounded-xl p-4 flex items-center justify-center bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <ProviderLogo provider={provider} />
                </button>
              ))}
            </div>
          )}

          {currentStep === 2 && sourceProvider && (
            <form onSubmit={handleUrlSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-4 mb-2">
                  <ProviderLogo provider={sourceProvider} className="w-12 h-12" />
                  <span className="text-lg capitalize">{sourceProvider} Playlist URL</span>
                </div>
                <input
                  type="url"
                  value={playlistUrl}
                  onChange={(e) => {
                    setPlaylistUrl(e.target.value);
                    validateUrl(e.target.value, sourceProvider);
                  }}
                  placeholder={PROVIDER_URL_PATTERNS[sourceProvider].example}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-[hsl(280,100%,70%)] transition-colors"
                />
                {urlError && (
                  <p className="text-red-400 text-sm mt-1">{urlError}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={!isUrlValid}
                className={`self-center px-8 py-3 rounded-full font-semibold transition-colors ${
                  isUrlValid
                    ? 'bg-[hsl(280,100%,70%)] hover:bg-[hsl(280,100%,65%)]'
                    : 'bg-white/10 cursor-not-allowed'
                }`}
              >
                Continue
              </button>
            </form>
          )}

          {currentStep === 3 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {providers.map((provider) => (
                <button
                  key={provider}
                  onClick={() => handleProviderSelect(provider)}
                  disabled={provider === sourceProvider}
                  className={`aspect-square rounded-xl p-4 flex items-center justify-center ${
                    provider === sourceProvider
                      ? 'bg-white/5 cursor-not-allowed'
                      : 'bg-white/20 hover:bg-white/30 transition-colors'
                  }`}
                >
                  <ProviderLogo provider={provider} />
                </button>
              ))}
            </div>
          )}

          {currentStep === 4 && isConverting && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
              <p className="mt-4 text-lg">Converting your playlist...</p>
            </div>
          )}

          {currentStep === 4 && convertedUrl && (
            <div className="flex flex-col items-center gap-6">
              <div className="flex items-center gap-8 mb-6">
                <div className="flex justify-center text-center">
                  <ProviderLogo provider={sourceProvider!} className="mb-2" />
                </div>
                <div className="text-2xl">→</div>
                <div className="flex justify-center text-center">
                  <ProviderLogo provider={destinationProvider!} className="mb-2" />
                </div>
              </div>
              <p className="text-lg text-center">
                Your playlist has been successfully converted! Here's your new playlist URL:
              </p>
              <div className="w-full flex gap-2 bg-white/5 p-4 rounded-lg">
                <input
                  type="text"
                  readOnly
                  value={convertedUrl}
                  className="flex-1 bg-transparent outline-none"
                />
                <button
                  onClick={handleCopyUrl}
                  className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                >
                  Copy
                </button>
              </div>
              <button
                onClick={handleDone}
                className="px-8 py-3 bg-[hsl(280,100%,70%)] rounded-full hover:bg-[hsl(280,100%,65%)] transition-colors"
              >
                Done
              </button>
            </div>
          )}
        </div>

        <StepIndicator currentStep={currentStep} totalSteps={4} />
      </div>
    </main>
  );
} 