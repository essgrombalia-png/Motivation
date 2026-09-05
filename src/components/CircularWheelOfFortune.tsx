import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import {
  RotateCw,
  Sparkles,
  Flame,
  Award,
  Zap,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { SelectedPush, CategoryId } from '../types';
import { CATEGORIES, CHALLENGES, DIFFICULTIES, DURATIONS, MOTIVATIONAL_QUOTES } from '../data/challenges';
import { soundEngine } from '../utils/sound';

export interface FortuneWedge {
  id: string;
  label: string;
  sublabel: string;
  points: number;
  pointsText: string;
  color: string;
  textColor: string;
  categoryId: string;
  challengeTitle: string;
  challengeDesc: string;
  difficultyId: 'easy' | 'medium' | 'hard' | 'beast';
  durationMinutes: number;
  isSpecial?: boolean;
}

// 24 authentically styled Wheel of Fortune wedges mapped to Daily Push challenges
export const FORTUNE_WEDGES: FortuneWedge[] = [
  {
    id: 'w1',
    label: '20 PUSH-UPS',
    sublabel: 'FITNESS',
    points: 700,
    pointsText: '700',
    color: '#FFE600', // Vibrant Yellow
    textColor: '#1a1300',
    categoryId: 'fitness',
    challengeTitle: 'Drop and do 20 clean push-ups',
    challengeDesc: 'Activate fast-twitch muscle fibers and flood oxygen to your prefrontal cortex.',
    difficultyId: 'medium',
    durationMinutes: 5,
  },
  {
    id: 'w2',
    label: 'COLD SHOWER',
    sublabel: 'DISCIPLINE',
    points: 600,
    pointsText: '600',
    color: '#E60026', // Bold Red
    textColor: '#ffffff',
    categoryId: 'discipline',
    challengeTitle: 'End shower with 60s pure ice water',
    challengeDesc: 'Voluntary discomfort builds cold shock proteins and unbreakable willpower.',
    difficultyId: 'hard',
    durationMinutes: 5,
  },
  {
    id: 'w3',
    label: '500ML WATER',
    sublabel: 'HEALTH',
    points: 550,
    pointsText: '550',
    color: '#00D4FF', // Cyan Blue
    textColor: '#021e2f',
    categoryId: 'health',
    challengeTitle: 'Drink a full 500ml glass of water',
    challengeDesc: 'Cellular rehydration immediately sharpens cognition and restores focus.',
    difficultyId: 'easy',
    durationMinutes: 5,
  },
  {
    id: 'w4',
    label: 'JACKPOT PUSH',
    sublabel: 'BEAST MODE',
    points: 1000,
    pointsText: 'JACKPOT',
    color: '#FFFFFF', // White Special Wedge
    textColor: '#000000',
    categoryId: 'fitness',
    challengeTitle: '15-Minute Beast HIIT Workout',
    challengeDesc: 'Maximum effort, maximum momentum. Complete 4 rounds of high-intensity intervals.',
    difficultyId: 'beast',
    durationMinutes: 15,
    isSpecial: true,
  },
  {
    id: 'w5',
    label: 'READ 10 PAGES',
    sublabel: 'LEARNING',
    points: 650,
    pointsText: '650',
    color: '#FF2A85', // Vivid Magenta Pink
    textColor: '#ffffff',
    categoryId: 'learning',
    challengeTitle: 'Read 10 pages of a non-fiction book',
    challengeDesc: 'Absorb high-density wisdom and strengthen neuroplastic cognitive pathways.',
    difficultyId: 'medium',
    durationMinutes: 15,
  },
  {
    id: 'w6',
    label: 'DEEP WORK 25M',
    sublabel: 'PRODUCTIVITY',
    points: 800,
    pointsText: '800',
    color: '#FF6D00', // Deep Orange
    textColor: '#ffffff',
    categoryId: 'productivity',
    challengeTitle: '25-minute Pomodoro without tab switching',
    challengeDesc: 'Lock in on single-task deep flow. Zero distractions, absolute execution.',
    difficultyId: 'hard',
    durationMinutes: 25,
  },
  {
    id: 'w7',
    label: 'MEDITATE 10M',
    sublabel: 'MINDSET',
    points: 500,
    pointsText: '500',
    color: '#8B5CF6', // Purple
    textColor: '#ffffff',
    categoryId: 'mindset',
    challengeTitle: '10 minutes mindful breath stillness',
    challengeDesc: 'Silence mental chatter, observe passing thoughts, and anchor presence.',
    difficultyId: 'medium',
    durationMinutes: 10,
  },
  {
    id: 'w8',
    label: 'CLEAN DESK',
    sublabel: 'DISCIPLINE',
    points: 450,
    pointsText: '450',
    color: '#00E676', // Emerald Mint Green
    textColor: '#022410',
    categoryId: 'discipline',
    challengeTitle: 'Declutter your primary workspace entirely',
    challengeDesc: 'External order directly drives internal calm and executive control.',
    difficultyId: 'easy',
    durationMinutes: 10,
  },
  {
    id: 'w9',
    label: 'DOUBLE XP',
    sublabel: 'SPECIAL',
    points: 900,
    pointsText: '2X PUSH',
    color: '#FFD700', // Metallic Gold
    textColor: '#1f1501',
    categoryId: 'productivity',
    challengeTitle: 'Tackle your #1 hardest task first',
    challengeDesc: 'Eat the frog. Eliminating the biggest block triggers massive dopamine release.',
    difficultyId: 'hard',
    durationMinutes: 30,
    isSpecial: true,
  },
  {
    id: 'w10',
    label: 'WALK IN SUN',
    sublabel: 'HEALTH',
    points: 600,
    pointsText: '600',
    color: '#00B0FF', // Sky Blue
    textColor: '#ffffff',
    categoryId: 'health',
    challengeTitle: '15-minute outdoor walk in direct sunlight',
    challengeDesc: 'Reset your circadian clock, boost serotonin, and loosen tight joints.',
    difficultyId: 'easy',
    durationMinutes: 15,
  },
  {
    id: 'w11',
    label: 'CALL A FRIEND',
    sublabel: 'SOCIAL',
    points: 750,
    pointsText: '750',
    color: '#E60026', // Bold Red
    textColor: '#ffffff',
    categoryId: 'social',
    challengeTitle: 'Call someone you respect just to check in',
    challengeDesc: 'Cultivate meaningful bonds and share unconditional positive energy.',
    difficultyId: 'medium',
    durationMinutes: 15,
  },
  {
    id: 'w12',
    label: 'PLANK 90 SEC',
    sublabel: 'FITNESS',
    points: 500,
    pointsText: '500',
    color: '#FFE600', // Yellow
    textColor: '#1a1300',
    categoryId: 'fitness',
    challengeTitle: 'Hold an unbroken 90-second forearm plank',
    challengeDesc: 'Engage your core, tighten your glutes, and breathe through the burn.',
    difficultyId: 'medium',
    durationMinutes: 5,
  },
  {
    id: 'w13',
    label: 'MYSTERY PUSH',
    sublabel: 'SURPRISE',
    points: 850,
    pointsText: 'MYSTERY',
    color: '#090D16', // Deep Onyx
    textColor: '#00E5FF',
    categoryId: 'mindset',
    challengeTitle: 'Express genuine gratitude to someone who helped you',
    challengeDesc: 'Send an unexpected, heartfelt voice message of appreciation.',
    difficultyId: 'medium',
    durationMinutes: 5,
    isSpecial: true,
  },
  {
    id: 'w14',
    label: 'POSTURE RESET',
    sublabel: 'HEALTH',
    points: 400,
    pointsText: '400',
    color: '#00E676', // Green
    textColor: '#022410',
    categoryId: 'health',
    challengeTitle: 'Foam roll or deep thoracic spine stretch',
    challengeDesc: 'Decompress compressed vertebrae and open up breathing capacity.',
    difficultyId: 'easy',
    durationMinutes: 10,
  },
  {
    id: 'w15',
    label: 'WRITE 3 GOALS',
    sublabel: 'MINDSET',
    points: 600,
    pointsText: '600',
    color: '#FF2A85', // Pink
    textColor: '#ffffff',
    categoryId: 'mindset',
    challengeTitle: 'Define tomorrow’s top 3 needle-movers',
    challengeDesc: 'Clarity in the evening guarantees ruthless precision in the morning.',
    difficultyId: 'easy',
    durationMinutes: 10,
  },
  {
    id: 'w16',
    label: 'NO SUGAR TODAY',
    sublabel: 'DISCIPLINE',
    points: 700,
    pointsText: '700',
    color: '#FF6D00', // Orange
    textColor: '#ffffff',
    categoryId: 'discipline',
    challengeTitle: 'Zero added sugar and clean whole-food meal',
    challengeDesc: 'Stabilize blood glucose, eliminate brain fog, and conquer cravings.',
    difficultyId: 'hard',
    durationMinutes: 30,
  },
  {
    id: 'w17',
    label: 'LEARN 1 CONCEPT',
    sublabel: 'LEARNING',
    points: 550,
    pointsText: '550',
    color: '#00D4FF', // Cyan
    textColor: '#021e2f',
    categoryId: 'learning',
    challengeTitle: 'Study 1 high-value skill concept on YouTube/article',
    challengeDesc: 'Summarize the core premise in 2 sentences in your personal notes.',
    difficultyId: 'medium',
    durationMinutes: 15,
  },
  {
    id: 'w18',
    label: 'STRETCH 10M',
    sublabel: 'SELF-CARE',
    points: 450,
    pointsText: '450',
    color: '#8B5CF6', // Purple
    textColor: '#ffffff',
    categoryId: 'self-care',
    challengeTitle: 'Full-body mobility routine: hips, hamstrings, shoulders',
    challengeDesc: 'Release muscular tightness, improve blood circulation, and prevent injury.',
    difficultyId: 'easy',
    durationMinutes: 10,
  },
  {
    id: 'w19',
    label: 'SAVE $10 HABIT',
    sublabel: 'FINANCE',
    points: 650,
    pointsText: '650',
    color: '#00E676', // Green
    textColor: '#022410',
    categoryId: 'finance',
    challengeTitle: 'Transfer $10 to savings and skip 1 frivolous expense',
    challengeDesc: 'Micro-investing compounding habits build financial sovereignty.',
    difficultyId: 'easy',
    durationMinutes: 5,
  },
  {
    id: 'w20',
    label: '100 SQUATS',
    sublabel: 'FITNESS',
    points: 750,
    pointsText: '750',
    color: '#E60026', // Red
    textColor: '#ffffff',
    categoryId: 'fitness',
    challengeTitle: 'Accumulate 100 bodyweight squats today',
    challengeDesc: 'Break them into sets of 25 throughout the day for continuous metabolic burn.',
    difficultyId: 'hard',
    durationMinutes: 15,
  },
  {
    id: 'w21',
    label: 'UNSUBSCRIBE 5',
    sublabel: 'PRODUCTIVITY',
    points: 500,
    pointsText: '500',
    color: '#FFE600', // Yellow
    textColor: '#1a1300',
    categoryId: 'productivity',
    challengeTitle: 'Unsubscribe from 5 junk marketing newsletters',
    challengeDesc: 'Protect your attention span and stop letting algorithms hijack your brain.',
    difficultyId: 'easy',
    durationMinutes: 5,
  },
  {
    id: 'w22',
    label: 'BOX BREATHING',
    sublabel: 'MINDSET',
    points: 400,
    pointsText: '400',
    color: '#00B0FF', // Blue
    textColor: '#ffffff',
    categoryId: 'mindset',
    challengeTitle: '5 minutes of 4-4-4-4 Navy SEAL box breathing',
    challengeDesc: 'Lower cortisol and blood pressure through conscious breath pacing.',
    difficultyId: 'easy',
    durationMinutes: 5,
  },
  {
    id: 'w23',
    label: 'COLD AIR WALK',
    sublabel: 'HEALTH',
    points: 600,
    pointsText: '600',
    color: '#FF2A85', // Pink
    textColor: '#ffffff',
    categoryId: 'health',
    challengeTitle: 'Brisk 10-minute walk with deep belly breaths',
    challengeDesc: 'Oxygenate muscles and shake off mental and physical lethargy.',
    difficultyId: 'easy',
    durationMinutes: 10,
  },
  {
    id: 'w24',
    label: 'BEAST PROTOCOL',
    sublabel: 'BEAST MODE',
    points: 1200,
    pointsText: 'BEAST',
    color: '#111827', // Black / Gold
    textColor: '#FBBF24',
    categoryId: 'discipline',
    challengeTitle: 'Zero complaints, zero excuses for the next 4 hours',
    challengeDesc: 'Relentless forward execution. If it has to be done, do it with extreme ownership.',
    difficultyId: 'beast',
    durationMinutes: 60,
    isSpecial: true,
  },
];

interface CircularWheelOfFortuneProps {
  onChallengeSelected: (push: SelectedPush) => void;
  isSpinning: boolean;
  setIsSpinning: (val: boolean) => void;
  preferredCategories?: CategoryId[];
}

export const CircularWheelOfFortune: React.FC<CircularWheelOfFortuneProps> = ({
  onChallengeSelected,
  isSpinning,
  setIsSpinning,
  preferredCategories = [],
}) => {
  const wheelRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [currentRotation, setCurrentRotation] = useState<number>(0);
  const [selectedWedgeIndex, setSelectedWedgeIndex] = useState<number>(0);
  const [tickerKicked, setTickerKicked] = useState<boolean>(false);
  const [motionBlur, setMotionBlur] = useState<number>(0);

  // Drag interaction state
  const isDragging = useRef<boolean>(false);
  const dragStartAngle = useRef<number>(0);
  const dragStartRotation = useRef<number>(0);
  const lastAngle = useRef<number>(0);
  const lastTime = useRef<number>(0);
  const angularVelocity = useRef<number>(0);

  const totalSlices = FORTUNE_WEDGES.length; // 24
  const sliceAngle = 360 / totalSlices; // 15 degrees

  // Helper to convert wedge to SelectedPush
  const convertWedgeToPush = useCallback((wedge: FortuneWedge): SelectedPush => {
    const cat = CATEGORIES.find((c) => c.id === wedge.categoryId) || CATEGORIES[0];
    const matchedChallenge = CHALLENGES.find((ch) => ch.title === wedge.challengeTitle) || {
      id: `w_ch_${wedge.id}`,
      title: wedge.challengeTitle,
      description: wedge.challengeDesc,
      categoryId: cat.id,
      defaultDifficulty: wedge.difficultyId,
      defaultDuration: (wedge.durationMinutes <= 5 ? '5m' : wedge.durationMinutes <= 15 ? '15m' : '30m') as any,
      impactTag: wedge.sublabel,
    };

    const dif = DIFFICULTIES.find((d) => d.id === wedge.difficultyId) || DIFFICULTIES[1];
    const dur = DURATIONS.find((d) => d.minutes === wedge.durationMinutes) || DURATIONS[1];
    const quote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];

    return {
      id: `push_wheel_${Date.now()}`,
      category: cat,
      challenge: matchedChallenge,
      difficulty: dif,
      duration: dur,
      quote,
      totalXp: wedge.points,
      timestamp: Date.now(),
    };
  }, []);

  // Compute wedge currently at the 12 o'clock pointer (top)
  const getIndexAtPointer = useCallback((rotationDeg: number) => {
    const normalized = ((-rotationDeg % 360) + 360) % 360;
    const idx = Math.floor(normalized / sliceAngle) % totalSlices;
    return idx;
  }, [sliceAngle, totalSlices]);

  // Initial push emission
  useEffect(() => {
    const initialIdx = getIndexAtPointer(0);
    setSelectedWedgeIndex(initialIdx);
    onChallengeSelected(convertWedgeToPush(FORTUNE_WEDGES[initialIdx]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keyboard shortcut (Space to spin)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !isSpinning && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        handleSpin();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // Programmatic Spin logic
  const handleSpin = useCallback(() => {
    if (isSpinning) return;
    setIsSpinning(true);

    // Pick target wedge
    let targetIdx = Math.floor(Math.random() * totalSlices);
    if (preferredCategories.length > 0) {
      const preferredIndices = FORTUNE_WEDGES.map((w, i) =>
        preferredCategories.includes(w.categoryId as CategoryId) ? i : -1
      ).filter((i) => i !== -1);

      if (preferredIndices.length > 0) {
        targetIdx = preferredIndices[Math.floor(Math.random() * preferredIndices.length)];
      }
    }

    // Full rotations: 6 to 9 full spins
    const extraRotations = 7 + Math.floor(Math.random() * 3);
    const targetSliceCenter = targetIdx * sliceAngle + sliceAngle / 2;
    const targetNormalizedAngle = (360 - targetSliceCenter) % 360;

    const currentNorm = ((currentRotation % 360) + 360) % 360;
    let delta = targetNormalizedAngle - currentNorm;
    if (delta <= 0) delta += 360;
    const finalTargetRotation = currentRotation + extraRotations * 360 + delta;

    const startTime = performance.now();
    const duration = 4500; // 4.5 seconds dramatic wheel of fortune spin
    const startRot = currentRotation;
    let lastPassedPeg = Math.floor(startRot / sliceAngle);

    const animateSpin = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);

      // Natural heavy mechanical deceleration (Quintic ease-out)
      const ease = 1 - Math.pow(1 - progress, 4.2);
      const currentDeg = startRot + (finalTargetRotation - startRot) * ease;
      setCurrentRotation(currentDeg);

      // Subtle dynamic motion blur during rapid rotational velocity (fades cleanly as it stops)
      const remaining = 1 - progress;
      const blurLevel = remaining > 0.35 ? Math.min(2.4, remaining * 3.2) : remaining * 1.6;
      setMotionBlur(blurLevel);

      // Check if passing peg for pointer click sound & flapper kick
      const currentPeg = Math.floor(currentDeg / sliceAngle);
      if (currentPeg !== lastPassedPeg) {
        soundEngine.playTick(1.0 + ((currentPeg % 4) * 0.1));
        setTickerKicked(true);
        setTimeout(() => setTickerKicked(false), 45);
        lastPassedPeg = currentPeg;
      }

      if (progress < 1) {
        requestAnimationFrame(animateSpin);
      } else {
        setCurrentRotation(finalTargetRotation);
        setMotionBlur(0);
        setIsSpinning(false);
        setSelectedWedgeIndex(targetIdx);

        // Sound and vibration feedback
        soundEngine.playLock(3);
        soundEngine.vibrate([30, 20, 50]);

        const selectedWedge = FORTUNE_WEDGES[targetIdx];
        onChallengeSelected(convertWedgeToPush(selectedWedge));
      }
    };

    requestAnimationFrame(animateSpin);
  }, [isSpinning, setIsSpinning, totalSlices, preferredCategories, sliceAngle, currentRotation, onChallengeSelected, convertWedgeToPush]);

  // Pointer drag to spin physics
  const getAngleFromEvent = (e: React.PointerEvent) => {
    if (!containerRef.current) return 0;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rad = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    return (rad * 180) / Math.PI;
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isSpinning) return;
    isDragging.current = true;
    const angle = getAngleFromEvent(e);
    dragStartAngle.current = angle;
    dragStartRotation.current = currentRotation;
    lastAngle.current = angle;
    lastTime.current = performance.now();
    angularVelocity.current = 0;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const now = performance.now();
    const angle = getAngleFromEvent(e);
    let deltaAngle = angle - lastAngle.current;
    if (deltaAngle > 180) deltaAngle -= 360;
    if (deltaAngle < -180) deltaAngle += 360;

    const dt = Math.max(1, now - lastTime.current);
    angularVelocity.current = deltaAngle / dt;

    const totalDelta = angle - dragStartAngle.current;
    const nextRotation = dragStartRotation.current + totalDelta;
    setCurrentRotation(nextRotation);

    const speed = Math.abs(angularVelocity.current);
    setMotionBlur(Math.min(1.8, speed * 1.5));

    if (speed > 0.05) {
      soundEngine.playTick(1.1);
      setTickerKicked(true);
      setTimeout(() => setTickerKicked(false), 40);
    }

    lastAngle.current = angle;
    lastTime.current = now;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch {}

    const v = angularVelocity.current;
    if (Math.abs(v) > 0.15) {
      setIsSpinning(true);
      const direction = v > 0 ? 1 : -1;
      const spinSpeed = Math.min(2.5, Math.abs(v));
      const extraDistance = direction * (spinSpeed * 1800 + Math.random() * 720);
      const targetRot = currentRotation + extraDistance;

      const startTime = performance.now();
      const startRot = currentRotation;
      const duration = 2400 + Math.abs(v) * 1000;

      const inertiaFrame = (now: number) => {
        const elapsed = now - startTime;
        const p = Math.min(1, elapsed / duration);
        const ease = 1 - Math.pow(1 - p, 3.8);
        const currentDeg = startRot + (targetRot - startRot) * ease;
        setCurrentRotation(currentDeg);

        const remaining = 1 - p;
        setMotionBlur(remaining > 0.25 ? Math.min(2.0, remaining * 2.8) : 0);

        if (p < 1) {
          requestAnimationFrame(inertiaFrame);
        } else {
          setMotionBlur(0);
          setIsSpinning(false);
          const finalIdx = getIndexAtPointer(targetRot);
          setSelectedWedgeIndex(finalIdx);
          soundEngine.playLock(2);
          onChallengeSelected(convertWedgeToPush(FORTUNE_WEDGES[finalIdx]));
        }
      };
      requestAnimationFrame(inertiaFrame);
    } else {
      setMotionBlur(0);
      const idx = getIndexAtPointer(currentRotation);
      setSelectedWedgeIndex(idx);
      onChallengeSelected(convertWedgeToPush(FORTUNE_WEDGES[idx]));
    }
  };

  // SVG Geometry Constants
  const cx = 300;
  const cy = 300;
  const outerGoldBezelRadius = 280;
  const outerGoldTrackRadius = 262;
  const wedgeOuterRadius = 248;
  const innerRadius = 58;

  // Generate SVG slice paths
  const slicePaths = useMemo(() => {
    return FORTUNE_WEDGES.map((wedge, i) => {
      const startDeg = i * sliceAngle;
      const endDeg = (i + 1) * sliceAngle;
      const startRad = ((startDeg - 90) * Math.PI) / 180;
      const endRad = ((endDeg - 90) * Math.PI) / 180;

      const x1Outer = cx + wedgeOuterRadius * Math.cos(startRad);
      const y1Outer = cy + wedgeOuterRadius * Math.sin(startRad);
      const x2Outer = cx + wedgeOuterRadius * Math.cos(endRad);
      const y2Outer = cy + wedgeOuterRadius * Math.sin(endRad);

      const x1Inner = cx + innerRadius * Math.cos(startRad);
      const y1Inner = cy + innerRadius * Math.sin(startRad);
      const x2Inner = cx + innerRadius * Math.cos(endRad);
      const y2Inner = cy + innerRadius * Math.sin(endRad);

      const pathData = `
        M ${x1Inner} ${y1Inner}
        L ${x1Outer} ${y1Outer}
        A ${wedgeOuterRadius} ${wedgeOuterRadius} 0 0 1 ${x2Outer} ${y2Outer}
        L ${x2Inner} ${y2Inner}
        A ${innerRadius} ${innerRadius} 0 0 0 ${x1Inner} ${y1Inner}
        Z
      `;

      const midAngle = startDeg + sliceAngle / 2;

      return {
        wedge,
        pathData,
        midAngle,
      };
    });
  }, [sliceAngle]);

  // Pegs around circumference
  const pegs = useMemo(() => {
    return Array.from({ length: totalSlices }).map((_, i) => {
      const angle = i * sliceAngle;
      const rad = ((angle - 90) * Math.PI) / 180;
      const pegDist = 258;
      return {
        x: cx + pegDist * Math.cos(rad),
        y: cy + pegDist * Math.sin(rad),
        angle,
      };
    });
  }, [sliceAngle, totalSlices]);

  return (
    <div className="w-full flex flex-col items-center select-none">
      {/* Visual Stage Container with authentic studio background and curved neon ribbon streamers */}
      <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-b from-[#080e22] via-[#091535] to-[#040817] p-3 sm:p-7 border border-amber-400/25 shadow-[0_30px_100px_rgba(0,0,0,0.95)]">
        {/* Curved Neon Light Streamers (Matching Image Background) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {/* Top Blue-Violet Nebula Radial Glow */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-blue-600/30 via-purple-600/20 to-transparent blur-3xl opacity-80" />

          {/* Flowing Curved Ribbon Streamers SVG */}
          <svg className="absolute inset-0 w-full h-full opacity-60" preserveAspectRatio="none" viewBox="0 0 1000 600">
            {/* Ribbon 1: Cyan / Aqua */}
            <path
              d="M -100 120 C 200 40, 500 240, 1100 80"
              fill="none"
              stroke="#00E5FF"
              strokeWidth="10"
              strokeOpacity="0.4"
            />
            <path
              d="M -100 120 C 200 40, 500 240, 1100 80"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeOpacity="0.7"
            />

            {/* Ribbon 2: Warm Gold */}
            <path
              d="M -100 220 C 300 140, 600 360, 1100 210"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="12"
              strokeOpacity="0.45"
            />
            <path
              d="M -100 220 C 300 140, 600 360, 1100 210"
              fill="none"
              stroke="#FEF08A"
              strokeWidth="3"
              strokeOpacity="0.8"
            />

            {/* Ribbon 3: Lime / Green Streamer */}
            <path
              d="M -100 440 C 300 380, 700 520, 1100 400"
              fill="none"
              stroke="#10B981"
              strokeWidth="8"
              strokeOpacity="0.35"
            />

            {/* Studio Floor Dotted Stage Grid */}
            <pattern id="stageDots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="1.5" fill="#38bdf8" opacity="0.18" />
            </pattern>
            <rect y="420" width="1000" height="180" fill="url(#stageDots)" />
          </svg>
        </div>

        {/* Top Header Information inside the Console */}
        <div className="relative z-10 w-full flex items-center justify-between px-2 pb-3 mb-2 border-b border-white/[0.08] text-xs">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400" />
            </span>
            <span className="font-mono uppercase tracking-[0.2em] text-[11px] sm:text-xs text-amber-300 font-extrabold">
              DAILY PUSH WHEEL OF FORTUNE
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono text-[10px] text-slate-300">
            <span className="hidden sm:inline-block tracking-wider">SWIPE WHEEL OR TAP SPIN</span>
            <span className="px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-200 border border-amber-400/30 font-bold tracking-wide">
              SPACE
            </span>
          </div>
        </div>

        {/* The Wheel Center Stage Area */}
        <div className="relative z-10 w-full max-w-[620px] aspect-square mx-auto flex items-center justify-center my-1 sm:my-3">
          {/* Top Selected Zone Intensifying Pulse Glow Aura & Beacons */}
          {isSpinning && (
            <div className="absolute top-[-16px] sm:top-[-22px] left-1/2 -translate-x-1/2 z-35 pointer-events-none flex flex-col items-center">
              {/* Expanding pulsating beacon rings */}
              <div className="absolute top-1 w-12 h-12 -translate-x-1/2 left-1/2 rounded-full border-2 border-amber-400 animate-beacon-ring" />
              <div
                className="absolute top-1 w-12 h-12 -translate-x-1/2 left-1/2 rounded-full border-2 border-amber-300 animate-beacon-ring"
                style={{ animationDelay: '0.4s' }}
              />
              {/* Downward focused energy spotlight cone directly into selected 12 o'clock wedge zone */}
              <div className="w-24 sm:w-32 h-44 sm:h-56 bg-gradient-to-b from-amber-400/60 via-amber-300/30 to-transparent blur-md animate-pulse-glow-intense" />
            </div>
          )}

          {/* Top Ticker Needle (The Authentic Spring Flapper) */}
          <div
            className="absolute top-[-8px] sm:top-[-12px] z-40 flex flex-col items-center pointer-events-none transition-transform duration-75"
            style={{
              transform: `rotate(${tickerKicked ? '-22deg' : '0deg'})`,
              transformOrigin: '50% 10px',
            }}
          >
            {/* Ticker Pin Top Mount with Intensified Pulse Glow */}
            <div
              className={`w-7 h-7 rounded-full bg-gradient-to-b from-[#FFF2A3] via-[#EAB308] to-[#854D0E] border-2 border-white flex items-center justify-center transition-all duration-200 ${
                isSpinning
                  ? 'shadow-[0_0_20px_rgba(245,158,11,1)] scale-110'
                  : 'shadow-[0_4px_14px_rgba(0,0,0,0.9)]'
              }`}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-[#1b1202] border border-[#fef08a]" />
            </div>

            {/* Ticker Downward Arrow / Flapper Blade with Gold Metallic Bevel */}
            <div
              className={`w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[34px] border-t-amber-400 -mt-1.5 transition-all duration-200 ${
                isSpinning
                  ? 'drop-shadow-[0_0_12px_rgba(245,158,11,0.95)]'
                  : 'drop-shadow-[0_4px_8px_rgba(0,0,0,0.85)]'
              }`}
            />
          </div>

          {/* Interactive Wheel Canvas */}
          <div
            ref={containerRef}
            className="relative w-full h-full cursor-grab active:cursor-grabbing touch-none flex items-center justify-center"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            <svg
              ref={wheelRef}
              viewBox="0 0 600 600"
              className="w-full h-full max-w-[600px] drop-shadow-[0_25px_60px_rgba(0,0,0,0.95)]"
            >
              <defs>
                {/* Dynamic Motion Blur Filter */}
                <filter id="wfMotionBlur" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation={`${motionBlur.toFixed(2)} 0`} />
                </filter>

                {/* Selected Zone High-Energy Radial Glow */}
                <radialGradient id="wfSelectedZoneApexGlow" cx="50%" cy="0%" r="100%">
                  <stop offset="0%" stopColor="#FFFBEB" stopOpacity="0.85" />
                  <stop offset="35%" stopColor="#F59E0B" stopOpacity="0.5" />
                  <stop offset="70%" stopColor="#D97706" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                </radialGradient>

                {/* 3D Gold Rim Outer Gradient */}
                <linearGradient id="wfGoldOuterRim" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFFCE6" />
                  <stop offset="18%" stopColor="#FFE066" />
                  <stop offset="38%" stopColor="#D97706" />
                  <stop offset="65%" stopColor="#FEF08A" />
                  <stop offset="85%" stopColor="#CA8A04" />
                  <stop offset="100%" stopColor="#713F12" />
                </linearGradient>

                {/* 3D Gold Bevel Inner Track Gradient */}
                <linearGradient id="wfGoldInnerBezel" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#451A03" />
                  <stop offset="35%" stopColor="#B45309" />
                  <stop offset="70%" stopColor="#FDE68A" />
                  <stop offset="100%" stopColor="#78350F" />
                </linearGradient>

                {/* Center Badge Deep Blue Glitter Gradient */}
                <linearGradient id="wfBadgeBlueGlitter" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#1e3a8a" />
                  <stop offset="40%" stopColor="#0f172a" />
                  <stop offset="100%" stopColor="#020617" />
                </linearGradient>

                {/* Center 3D Gold Extruded Letters Gradient */}
                <linearGradient id="wfGold3DText" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="25%" stopColor="#FFF3A8" />
                  <stop offset="60%" stopColor="#F59E0B" />
                  <stop offset="90%" stopColor="#B45309" />
                  <stop offset="100%" stopColor="#451A03" />
                </linearGradient>

                {/* Chrome Stud Peg Gradient */}
                <radialGradient id="wfPegChrome" cx="30%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="40%" stopColor="#FEF08A" />
                  <stop offset="70%" stopColor="#D97706" />
                  <stop offset="100%" stopColor="#291403" />
                </radialGradient>

                {/* Center Logo Drop Shadow */}
                <filter id="wfBadgeShadow" x="-30%" y="-30%" width="160%" height="160%">
                  <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000000" floodOpacity="0.9" />
                </filter>
              </defs>

              {/* ROTATING WHEEL ASSEMBLY with Dynamic Motion Blur */}
              <g
                transform={`rotate(${currentRotation} ${cx} ${cy})`}
                style={{
                  willChange: 'transform',
                  filter: motionBlur > 0.1 ? 'url(#wfMotionBlur)' : undefined,
                }}
              >
                {/* Wheel Black Underlying Base Plate */}
                <circle cx={cx} cy={cy} r={outerGoldBezelRadius} fill="#090d16" />

                {/* 24 Radial Slices */}
                {slicePaths.map(({ wedge, pathData, midAngle }) => (
                  <g key={wedge.id}>
                    {/* Wedge Shape with White Hairline Separator */}
                    <path
                      d={pathData}
                      fill={wedge.color}
                      stroke="#ffffff"
                      strokeWidth="1.2"
                      strokeOpacity="0.4"
                    />

                    {/* Radially Oriented Wedge Content along slice centerline */}
                    <g transform={`rotate(${midAngle - 90} ${cx} ${cy})`}>
                      {/* Bold Point Value (Radially Placed on Outer Half) */}
                      <text
                        x={cx + 188}
                        y={cy}
                        fill={wedge.textColor}
                        textAnchor="middle"
                        dominantBaseline="central"
                        style={{
                          fontFamily: 'Outfit, sans-serif',
                          fontWeight: 900,
                          fontSize: wedge.isSpecial ? '12px' : '17px',
                          letterSpacing: '0.04em',
                        }}
                      >
                        {wedge.pointsText}
                      </text>

                      {/* Mini Action/Challenge Label Tag (Radially Placed on Inner Half) */}
                      <text
                        x={cx + 114}
                        y={cy}
                        fill={wedge.textColor}
                        textAnchor="middle"
                        dominantBaseline="central"
                        style={{
                          fontFamily: 'Plus Jakarta Sans, sans-serif',
                          fontWeight: 800,
                          fontSize: '8.5px',
                          letterSpacing: '0.06em',
                          opacity: 0.95,
                        }}
                      >
                        {wedge.label}
                      </text>
                    </g>
                  </g>
                ))}

                {/* Inner Gold Bevel Ring (Separating Slices from Track) */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={wedgeOuterRadius}
                  fill="none"
                  stroke="url(#wfGoldInnerBezel)"
                  strokeWidth="5"
                />

                {/* Recessed Dark Perimeter Peg Track */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={outerGoldTrackRadius}
                  fill="none"
                  stroke="#111827"
                  strokeWidth="20"
                />

                {/* Outermost Heavy 3D Gold Rim (Mirroring Wheel of Fortune image) */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={outerGoldBezelRadius}
                  fill="none"
                  stroke="url(#wfGoldOuterRim)"
                  strokeWidth="16"
                />

                {/* Outer Black Accent Pinstripe */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={outerGoldBezelRadius + 9}
                  fill="none"
                  stroke="#000000"
                  strokeWidth="2.5"
                />

                {/* Specular Glint Stars on Outer Gold Rim (Subtle & Elegant) */}
                <polygon
                  points={`${cx - 170},${cy - 170} ${cx - 168},${cy - 164} ${cx - 162},${cy - 162} ${cx - 168},${cy - 160} ${cx - 170},${cy - 154} ${cx - 172},${cy - 160} ${cx - 178},${cy - 162} ${cx - 172},${cy - 164}`}
                  fill="#FFFFFF"
                  opacity="0.9"
                />
                <polygon
                  points={`${cx + 170},${cy - 170} ${cx + 172},${cy - 164} ${cx + 178},${cy - 162} ${cx + 172},${cy - 160} ${cx + 170},${cy - 154} ${cx + 168},${cy - 160} ${cx + 162},${cy - 162} ${cx + 168},${cy - 164}`}
                  fill="#FFFFFF"
                  opacity="0.9"
                />

                {/* 24 Circumference Chrome/Gold Pegs */}
                {pegs.map((peg, idx) => (
                  <g key={idx}>
                    {/* Peg Base Plate */}
                    <circle
                      cx={peg.x}
                      cy={peg.y}
                      r="6.5"
                      fill="#1e1b18"
                      stroke="#ca8a04"
                      strokeWidth="1"
                    />
                    {/* Peg Shiny Chrome Stud */}
                    <circle
                      cx={peg.x}
                      cy={peg.y}
                      r="4.5"
                      fill="url(#wfPegChrome)"
                      stroke="#ffffff"
                      strokeWidth="0.8"
                    />
                  </g>
                ))}
              </g>

              {/* SELECTED TARGET ZONE INTENSIFYING PULSE GLOW IN SVG */}
              {isSpinning && (
                <g className="pointer-events-none">
                  {/* Concentrated Top Apex Target Arc Beam */}
                  <path
                    d="M 284 56 L 260 178 A 248 248 0 0 1 340 178 L 316 56 Z"
                    fill="url(#wfSelectedZoneApexGlow)"
                    className="animate-pulse-glow-intense"
                  />
                  {/* Outer Target Rim Highlighting Brackets */}
                  <path
                    d="M 270 54 A 248 248 0 0 1 330 54"
                    fill="none"
                    stroke="#FEF08A"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    className="animate-pulse"
                  />
                  {/* Dual Neon Calibrator Dots */}
                  <circle cx="270" cy="54" r="3.5" fill="#FEF08A" className="animate-ping" />
                  <circle cx="330" cy="54" r="3.5" fill="#FEF08A" className="animate-ping" />
                </g>
              )}

              {/* STATIC CENTER HUB EMBLEM */}
              <g transform={`translate(${cx}, ${cy})`}>
                {/* Center Hub Outer Gold Bezel */}
                <circle
                  cx="0"
                  cy="0"
                  r="56"
                  fill="url(#wfGoldOuterRim)"
                  stroke="#FFFBEB"
                  strokeWidth="2.5"
                  filter="url(#wfBadgeShadow)"
                />

                {/* Center Hub Midnight-Blue Faceted Enamel Plate */}
                <circle
                  cx="0"
                  cy="0"
                  r="49"
                  fill="url(#wfBadgeBlueGlitter)"
                  stroke="url(#wfGoldInnerBezel)"
                  strokeWidth="2.5"
                />

                {/* Specular Star Highlights on Emblem */}
                <polygon
                  points="0,-40 1.5,-36 5.5,-34.5 1.5,-33 0,-29 -1.5,-33 -5.5,-34.5 -1.5,-36"
                  fill="#FEF08A"
                  opacity="0.85"
                />
                <polygon
                  points="0,40 1.5,36 5.5,34.5 1.5,33 0,29 -1.5,33 -5.5,34.5 -1.5,36"
                  fill="#FEF08A"
                  opacity="0.85"
                />

                {/* Top Word: DAILY */}
                <text
                  x="0"
                  y="-11"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="url(#wfGold3DText)"
                  style={{
                    fontFamily: 'Outfit, sans-serif',
                    fontWeight: 900,
                    fontSize: '14px',
                    letterSpacing: '0.12em',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.9))',
                  }}
                >
                  DAILY
                </text>

                {/* Center Crest Divider / Mini Star Hub */}
                <circle cx="0" cy="0" r="3.5" fill="url(#wfGoldOuterRim)" stroke="#ffffff" strokeWidth="0.8" />
                <line x1="-16" y1="0" x2="-6" y2="0" stroke="#fef08a" strokeWidth="1.2" strokeLinecap="round" />
                <line x1="6" y1="0" x2="16" y2="0" stroke="#fef08a" strokeWidth="1.2" strokeLinecap="round" />

                {/* Bottom Word: PUSH */}
                <text
                  x="0"
                  y="16"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="url(#wfGold3DText)"
                  style={{
                    fontFamily: 'Outfit, sans-serif',
                    fontWeight: 900,
                    fontSize: '19px',
                    letterSpacing: '0.08em',
                    filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.95))',
                  }}
                >
                  PUSH
                </text>
              </g>
            </svg>
          </div>
        </div>

        {/* Selected Wedge Information Badge with Intensifying Pulse Glow */}
        <div
          className={`relative z-10 w-full max-w-md mx-auto mt-1 px-4 py-2.5 rounded-2xl flex items-center justify-between transition-all duration-300 overflow-hidden ${
            isSpinning
              ? 'bg-amber-950/80 border-2 border-amber-400 shadow-[0_0_35px_rgba(245,158,11,0.65)] ring-2 ring-amber-400/40 animate-pulse-glow-intense'
              : 'bg-black/60 border border-amber-400/25 shadow-lg'
          }`}
        >
          {isSpinning && (
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-amber-300/35 to-transparent w-3/4 animate-laser-shimmer" />
          )}
          <div className="relative z-10 flex items-center gap-2.5 min-w-0">
            <span
              className={`w-3.5 h-3.5 rounded-full shrink-0 border border-white/50 transition-transform duration-200 ${
                isSpinning ? 'scale-125 animate-pulse' : ''
              }`}
              style={{ backgroundColor: FORTUNE_WEDGES[selectedWedgeIndex].color }}
            />
            <span className="text-xs sm:text-sm font-display font-bold text-white uppercase tracking-wider truncate">
              {isSpinning ? 'CALIBRATING SELECTION...' : FORTUNE_WEDGES[selectedWedgeIndex].label}
            </span>
          </div>
          <span className="relative z-10 text-xs sm:text-sm font-mono font-extrabold text-amber-300 shrink-0 ml-2">
            {isSpinning ? 'SPINNING' : `+${FORTUNE_WEDGES[selectedWedgeIndex].pointsText} XP`}
          </span>
        </div>
      </div>

      {/* Main Tactile SPIN Button */}
      <div className="mt-7 flex flex-col items-center">
        <button
          id="main-spin-button"
          onClick={handleSpin}
          disabled={isSpinning}
          className={`relative group px-12 sm:px-16 py-4 sm:py-5 rounded-2xl font-display font-black text-lg sm:text-xl tracking-wider uppercase transition-all duration-300 shadow-2xl flex items-center gap-3.5 ${
            isSpinning
              ? 'bg-amber-600/80 text-amber-100 cursor-not-allowed opacity-90 scale-[0.98]'
              : 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 text-slate-950 hover:scale-[1.03] active:scale-[0.97] shadow-[0_0_40px_rgba(245,158,11,0.4)] hover:shadow-[0_0_65px_rgba(245,158,11,0.7)]'
          }`}
        >
          <RotateCw
            className={`w-6 h-6 stroke-[2.8] ${
              isSpinning ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'
            }`}
          />
          <span className="tracking-wide">
            {isSpinning ? 'SPINNING THE WHEEL...' : 'SPIN THE WHEEL'}
          </span>
        </button>

        <p className="mt-3 text-xs text-slate-400 font-medium tracking-wide">
          Press <span className="font-mono text-slate-300 font-semibold px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.08]">SPACE</span> or swipe to spin
        </p>
      </div>
    </div>
  );
};
