"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

export interface QrCamera {
  id: string;
  label: string;
}

export interface UseQrScannerOptions {
  /** Only starts the camera once this is true. */
  enabled: boolean;
  /** id of the element the video stream mounts into. */
  regionId: string;
  /** Called with the raw decoded text of each successful read. */
  onDecode: (decodedText: string) => void;
}

/**
 * Owns the html5-qrcode instance: enumerates cameras, starts the stream, and
 * tears it down on unmount.
 *
 * `onDecode` is read through a ref, so passing an inline function does not
 * restart the camera on every render.
 */
export function useQrScanner({ enabled, regionId, onDecode }: UseQrScannerOptions) {
  const [cameras, setCameras] = useState<QrCamera[]>([]);
  const [activeCameraId, setActiveCameraId] = useState<string | null>(null);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isRunningRef = useRef(false);
  const onDecodeRef = useRef(onDecode);

  useEffect(() => {
    onDecodeRef.current = onDecode;
  }, [onDecode]);

  // Enumerate cameras once access has been granted.
  useEffect(() => {
    if (!enabled) return;
    let active = true;

    Html5Qrcode.getCameras()
      .then((devices) => {
        if (!active || !devices?.length) return;
        setCameras(devices);
        const rear = devices.find((device) =>
          /back|rear|environment/i.test(device.label)
        );
        setActiveCameraId(rear ? rear.id : devices[0].id);
      })
      .catch(() => {
        // Enumeration can fail while the camera still works; fall back to
        // facingMode below.
      });

    return () => {
      active = false;
    };
  }, [enabled]);

  // Run the stream.
  useEffect(() => {
    if (!enabled) return;

    let active = true;
    const scanner = new Html5Qrcode(regionId);
    scannerRef.current = scanner;

    const stop = () => {
      if (!isRunningRef.current) return Promise.resolve();
      isRunningRef.current = false;
      return scanner
        .stop()
        .catch(() => {})
        .finally(() => {
          try {
            scanner.clear();
          } catch {
            // Already torn down.
          }
        });
    };

    scanner
      .start(
        activeCameraId
          ? { deviceId: { exact: activeCameraId } }
          : { facingMode: "environment" },
        { fps: 12, qrbox: { width: 240, height: 240 }, aspectRatio: 1 },
        (decodedText) => {
          if (active) onDecodeRef.current(decodedText);
        },
        () => {
          // Per-frame decode misses are normal and not surfaced.
        }
      )
      .then(() => {
        if (active) {
          isRunningRef.current = true;
        } else {
          void stop();
        }
      })
      .catch(() => {
        // Start can abort when the component unmounts mid-initialisation.
      });

    return () => {
      active = false;
      void stop();
      scannerRef.current = null;
    };
  }, [enabled, regionId, activeCameraId]);

  const switchCamera = useCallback(() => {
    setCameras((current) => {
      if (current.length <= 1) return current;
      setActiveCameraId((activeId) => {
        const index = current.findIndex((camera) => camera.id === activeId);
        return current[(index + 1) % current.length].id;
      });
      return current;
    });
  }, []);

  return { cameras, activeCameraId, switchCamera };
}
