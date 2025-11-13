'use client';

import { useEffect, useState } from 'react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

export function useFingerprint() {
  const [fingerprint, setFingerprint] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    FingerprintJS.load()
      .then(fp => fp.get())
      .then(result => {
        if (!cancelled) {
          setFingerprint(result.visitorId);
        }
      })
      .catch(() => {
        if (!cancelled) setFingerprint(null);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return fingerprint;
}


