import { useCallback, useEffect, useRef, useState } from 'react';

type PlaybackState = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

interface UsePronunciationOptions {
  audioUrl?: string;
  /** Fallback text-to-speech when audio URL is missing or fails */
  fallbackText?: string;
}

interface UsePronunciationReturn {
  playbackState: PlaybackState;
  hasAudio: boolean;
  play: () => Promise<void>;
  pause: () => Promise<void>;
  stop: () => Promise<void>;
  toggle: () => Promise<void>;
}

type AudioStatus = {
  isLoaded: boolean;
  playing: boolean;
  didJustFinish: boolean;
};

type AudioPlayerInstance = {
  play: () => void;
  pause: () => void;
  seekTo: (seconds: number) => Promise<void>;
  remove: () => void;
  addListener: (
    event: 'playbackStatusUpdate',
    listener: (status: AudioStatus) => void,
  ) => { remove: () => void };
};

/**
 * Manages pronunciation playback via expo-audio with event-driven state.
 *
 * Playback state is derived from the player's `playbackStatusUpdate` events so
 * the UI accurately reflects loading, playing, paused, and finished states.
 * Falls back to expo-speech TTS when no audio URL is available or playback fails.
 */
export function usePronunciation({
  audioUrl,
  fallbackText,
}: UsePronunciationOptions): UsePronunciationReturn {
  const playerRef = useRef<AudioPlayerInstance | null>(null);
  const subscriptionRef = useRef<{ remove: () => void } | null>(null);
  const [playbackState, setPlaybackState] = useState<PlaybackState>('idle');

  const hasAudioUrl = Boolean(audioUrl?.trim());
  const hasFallback = Boolean(fallbackText?.trim());
  const hasAudio = hasAudioUrl || hasFallback;

  const cleanupPlayer = useCallback(() => {
    if (subscriptionRef.current) {
      subscriptionRef.current.remove();
      subscriptionRef.current = null;
    }
    if (playerRef.current) {
      try {
        playerRef.current.remove();
      } catch {
        // Player may already be released
      }
      playerRef.current = null;
    }
  }, []);

  // Release native resources when the component unmounts.
  useEffect(() => cleanupPlayer, [cleanupPlayer]);

  // Reset playback when the audio source changes (e.g. navigating to a new word).
  useEffect(() => {
    cleanupPlayer();
    setPlaybackState('idle');
  }, [audioUrl, cleanupPlayer]);

  const stopSpeech = useCallback(async () => {
    const Speech = await import('expo-speech');
    await Speech.stop();
  }, []);

  const speakFallback = useCallback(async () => {
    if (!fallbackText?.trim()) return false;

    const Speech = await import('expo-speech');
    await Speech.stop();

    setPlaybackState('playing');
    await new Promise<void>((resolve, reject) => {
      Speech.speak(fallbackText, {
        language: 'en-US',
        onDone: resolve,
        onStopped: resolve,
        onError: () => reject(new Error('Speech synthesis failed')),
      });
    });
    return true;
  }, [fallbackText]);

  const playAudioUrl = useCallback(async () => {
    if (!audioUrl?.trim()) return false;

    const { createAudioPlayer, setAudioModeAsync } = await import('expo-audio');
    await setAudioModeAsync({ playsInSilentMode: true });

    cleanupPlayer();

    const player = createAudioPlayer({ uri: audioUrl }) as unknown as AudioPlayerInstance;
    playerRef.current = player;

    // Derive UI state from real playback events rather than assuming success.
    subscriptionRef.current = player.addListener('playbackStatusUpdate', (status) => {
      if (player !== playerRef.current) return;

      if (status.didJustFinish) {
        setPlaybackState('idle');
        return;
      }
      if (status.playing) {
        setPlaybackState('playing');
      }
    });

    player.play();
    return true;
  }, [audioUrl, cleanupPlayer]);

  const play = useCallback(async () => {
    if (!hasAudio) return;

    // Resume an existing native player instead of restarting from the beginning.
    if (playerRef.current && playbackState === 'paused') {
      playerRef.current.play();
      setPlaybackState('playing');
      return;
    }

    try {
      setPlaybackState('loading');

      if (hasAudioUrl) {
        await playAudioUrl();
        return;
      }

      await speakFallback();
      setPlaybackState('idle');
    } catch {
      // Audio playback failed — gracefully fall back to text-to-speech.
      cleanupPlayer();
      try {
        if (hasFallback) {
          await speakFallback();
          setPlaybackState('idle');
          return;
        }
      } catch {
        // Both audio and speech failed
      }
      setPlaybackState('error');
    }
  }, [
    hasAudio,
    hasAudioUrl,
    hasFallback,
    playbackState,
    playAudioUrl,
    speakFallback,
    cleanupPlayer,
  ]);

  const pause = useCallback(async () => {
    try {
      if (playerRef.current) {
        playerRef.current.pause();
        setPlaybackState('paused');
        return;
      }
      await stopSpeech();
      setPlaybackState('idle');
    } catch {
      setPlaybackState('error');
    }
  }, [stopSpeech]);

  const stop = useCallback(async () => {
    try {
      await stopSpeech();
      cleanupPlayer();
      setPlaybackState('idle');
    } catch {
      cleanupPlayer();
      setPlaybackState('idle');
    }
  }, [stopSpeech, cleanupPlayer]);

  const toggle = useCallback(async () => {
    if (playbackState === 'playing') {
      await pause();
    } else {
      await play();
    }
  }, [playbackState, pause, play]);

  return { playbackState, hasAudio, play, pause, stop, toggle };
}
