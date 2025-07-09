'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProviderLogo } from '../../components/ProviderLogo';

type Provider = 'spotify' | 'apple' | 'youtube' | 'soundcloud';

interface StepProps {
  currentStep: number;
  totalSteps: number;
}

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
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);

  const providers: Provider[] = ['spotify', 'apple', 'youtube', 'soundcloud'];

  const handleProviderSelect = (provider: Provider) => {
    if (currentStep === 1) {
      setSourceProvider(provider);
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setDestinationProvider(provider);
      setCurrentStep(3);
      setIsConverting(true);
      // TODO: Implement actual conversion logic
      setTimeout(() => {
        setConvertedUrl('https://example.com/converted-playlist');
        setIsConverting(false);
      }, 2000);
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
          {currentStep === 2 && "Select Destination Provider"}
          {currentStep === 3 && (convertedUrl ? "Conversion Complete!" : "Converting...")}
        </h1>

        <div className="w-full max-w-2xl bg-white/10 p-8 rounded-xl">
          {(currentStep === 1 || currentStep === 2) && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {providers.map((provider) => (
                <button
                  key={provider}
                  onClick={() => handleProviderSelect(provider)}
                  disabled={
                    provider === sourceProvider ||
                    (currentStep === 2 && provider === sourceProvider)
                  }
                  className={`aspect-square rounded-xl p-4 flex items-center justify-center
                    ${
                      provider === sourceProvider && currentStep === 1
                        ? 'bg-white/5 cursor-not-allowed'
                        : currentStep === 2 && provider === sourceProvider
                        ? 'bg-white/5 cursor-not-allowed'
                        : 'bg-white/20 hover:bg-white/30 transition-colors'
                    }
                  `}
                >
                  <ProviderLogo provider={provider} />
                </button>
              ))}
            </div>
          )}

          {currentStep === 3 && isConverting && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
              <p className="mt-4 text-lg">Converting your playlist...</p>
            </div>
          )}

          {currentStep === 3 && convertedUrl && (
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

        <StepIndicator currentStep={currentStep} totalSteps={3} />
      </div>
    </main>
  );
} 