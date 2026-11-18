import { FilesetResolver, HandLandmarker, type HandLandmarkerResult } from '@mediapipe/tasks-vision';
import { useCallback, useEffect, useRef, useState } from 'react';
import { HAND_MODEL_URL, preloadHandModel } from './preload';

export type VisionStatus =
  | 'idle'
  | 'loading'
  | 'running'
  | 'denied' // user/browser blocked camera permission
  | 'insecure' // page not served over HTTPS (or localhost): browsers hide the camera API
  | 'nocamera' // no camera found / camera API not supported by this browser
  | 'busy' // camera is being used by another app/tab
  | 'error'; // AI model failed to load or something unexpected

type Delegate = 'GPU' | 'CPU';

/**
 * Many devices (older phones, Chromebooks, some Android GPUs, browsers with
 * WebGL disabled) cannot run MediaPipe on the GPU. Try GPU first for speed,
 * then fall back to CPU so the camera still works everywhere.
 */
async function createWithFallback<T>(make: (delegate: Delegate) => Promise<T>): Promise<T> {
  try {
    return await make('GPU');
  } catch (err) {
    console.warn('[vision] GPU delegate failed, falling back to CPU:', err);
    return make('CPU');
  }
}

function classifyCameraError(err: unknown): VisionStatus {
  if (!(err instanceof DOMException)) return 'error';
  switch (err.name) {
    case 'NotAllowedError':
    case 'SecurityError':
      return 'denied';
    case 'NotFoundError':
    case 'OverconstrainedError':
      return 'nocamera';
    case 'NotReadableError':
    case 'AbortError':
      return 'busy';
    default:
      return 'error';
  }
}

export interface VisionFrame {
  hand?: HandLandmarkerResult;
}

interface Options {
  onFrame: (frame: VisionFrame) => void;
}

// Assets are served locally from the app base (see scripts/setup-vision.mjs).
// BASE_URL is "/" in dev and "/<repo>/" on GitHub Pages.
const BASE = import.meta.env.BASE_URL;
const WASM_PATH = `${BASE}wasm`;

/**
 * Owns the webcam stream and the MediaPipe hand landmarker. Everything runs
 * on-device; the frame data never leaves the browser. `start`/`stop` are
 * exposed so the camera is only on when a child is actually playing.
 */
export function useVision({ onFrame }: Options) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [status, setStatus] = useState<VisionStatus>('idle');

  const handRef = useRef<HandLandmarker | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastVideoTime = useRef(-1);
  const onFrameRef = useRef(onFrame);
  useEffect(() => {
    onFrameRef.current = onFrame;
  }, [onFrame]);

  const stop = useCallback(() => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setStatus('idle');
  }, []);

  // Stable loop stored in a ref so it can recurse without capturing itself
  // during initialization and without writing refs during render.
  const loopRef = useRef<() => void>(() => {});
  useEffect(() => {
    loopRef.current = () => {
      const video = videoRef.current;
      const hand = handRef.current;
      if (video && hand && video.readyState >= 2 && video.currentTime !== lastVideoTime.current) {
        lastVideoTime.current = video.currentTime;
        const now = performance.now();
        // A single failed frame (e.g. GPU context hiccup) must not kill the
        // loop, otherwise the video keeps playing but nothing is detected.
        try {
          onFrameRef.current({ hand: hand.detectForVideo(video, now) });
        } catch (err) {
          console.warn('[vision] frame failed:', err);
        }
      }
      rafRef.current = requestAnimationFrame(() => loopRef.current());
    };
  }, []);

  const start = useCallback(async () => {
    if (status === 'loading' || status === 'running') return;
    // Browsers only expose the camera on HTTPS or localhost. Opening the dev
    // server from a phone via http://192.168.x.x makes mediaDevices undefined.
    if (!window.isSecureContext) {
      setStatus('insecure');
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus('nocamera');
      return;
    }
    setStatus('loading');
    try {
      // Ask for the camera first so permission/hardware problems are reported
      // quickly instead of after a multi-MB model download.
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false,
        });
      } catch (err) {
        if (err instanceof DOMException && (err.name === 'OverconstrainedError' || err.name === 'NotReadableError')) {
          // Some webcams/drivers reject any constraints: retry with the bare minimum.
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        } else {
          throw err;
        }
      }
      streamRef.current = stream;

      try {
        if (!handRef.current) {
          // Reuse the background download if it finished (or join it if it is running).
          const [fileset, bytes] = await Promise.all([FilesetResolver.forVisionTasks(WASM_PATH), preloadHandModel(true)]);
          handRef.current = await createWithFallback((delegate) =>
            HandLandmarker.createFromOptions(fileset, {
              baseOptions: bytes ? { modelAssetBuffer: bytes.slice(), delegate } : { modelAssetPath: HAND_MODEL_URL, delegate },
              runningMode: 'VIDEO',
              numHands: 1,
            }),
          );
        }
      } catch (err) {
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        setStatus('error');
        console.warn('[vision] model load failed:', err);
        return;
      }

      const video = videoRef.current;
      if (!video) throw new Error('No video element');
      video.srcObject = stream;
      await video.play();
      setStatus('running');
      lastVideoTime.current = -1;
      rafRef.current = requestAnimationFrame(() => loopRef.current());
    } catch (err) {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setStatus(classifyCameraError(err));
      console.warn('[vision] start failed:', err);
    }
  }, [status]);

  useEffect(() => stop, [stop]);

  return { videoRef, status, start, stop };
}
