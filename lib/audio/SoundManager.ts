import { Howl, Howler } from 'howler';

export type SoundType = 
  | 'punch_light'
  | 'punch_heavy'
  | 'kick_light'
  | 'kick_heavy'
  | 'uppercut'
  | 'roundhouse'
  | 'block'
  | 'hit_impact'
  | 'bag_hit'
  | 'whoosh'
  | 'combo_start'
  | 'combo_break'
  | 'special_ready'
  | 'energy_full'
  | 'low_health'
  | 'victory'
  | 'defeat'
  | 'ambient';

interface SoundConfig {
  src: string[];
  volume?: number;
  loop?: boolean;
  preload?: boolean;
}

export class SoundManager {
  private sounds: Map<SoundType, Howl> = new Map();
  private enabled: boolean = true;
  private masterVolume: number = 0.7;

  constructor() {
    this.initializeSounds();
    this.setupGlobalVolume();
  }

  private initializeSounds() {
    // Combat sounds
    const soundConfigs: Record<SoundType, SoundConfig> = {
      punch_light: {
        src: ['/sounds/punch1.mp3', '/sounds/punch1.ogg'],
        volume: 0.6,
        preload: true
      },
      punch_heavy: {
        src: ['/sounds/punch2.mp3', '/sounds/punch2.ogg'],
        volume: 0.7,
        preload: true
      },
      kick_light: {
        src: ['/sounds/kick1.mp3', '/sounds/kick1.ogg'],
        volume: 0.6,
        preload: true
      },
      kick_heavy: {
        src: ['/sounds/kick2.mp3', '/sounds/kick2.ogg'],
        volume: 0.7,
        preload: true
      },
      uppercut: {
        src: ['/sounds/uppercut.mp3', '/sounds/uppercut.ogg'],
        volume: 0.8,
        preload: true
      },
      roundhouse: {
        src: ['/sounds/roundhouse.mp3', '/sounds/roundhouse.ogg'],
        volume: 0.8,
        preload: true
      },
      block: {
        src: ['/sounds/block.mp3', '/sounds/block.ogg'],
        volume: 0.5,
        preload: true
      },
      hit_impact: {
        src: ['/sounds/impact.mp3', '/sounds/impact.ogg'],
        volume: 0.9,
        preload: true
      },
      bag_hit: {
        src: ['/sounds/bag_hit.mp3', '/sounds/bag_hit.ogg'],
        volume: 0.7,
        preload: true
      },
      whoosh: {
        src: ['/sounds/whoosh.mp3', '/sounds/whoosh.ogg'],
        volume: 0.4,
        preload: true
      },
      combo_start: {
        src: ['/sounds/combo_start.mp3', '/sounds/combo_start.ogg'],
        volume: 0.6
      },
      combo_break: {
        src: ['/sounds/combo_break.mp3', '/sounds/combo_break.ogg'],
        volume: 0.5
      },
      special_ready: {
        src: ['/sounds/special_ready.mp3', '/sounds/special_ready.ogg'],
        volume: 0.7
      },
      energy_full: {
        src: ['/sounds/energy_full.mp3', '/sounds/energy_full.ogg'],
        volume: 0.6
      },
      low_health: {
        src: ['/sounds/heartbeat.mp3', '/sounds/heartbeat.ogg'],
        volume: 0.5,
        loop: true
      },
      victory: {
        src: ['/sounds/victory.mp3', '/sounds/victory.ogg'],
        volume: 0.8
      },
      defeat: {
        src: ['/sounds/defeat.mp3', '/sounds/defeat.ogg'],
        volume: 0.6
      },
      ambient: {
        src: ['/sounds/gym_ambient.mp3', '/sounds/gym_ambient.ogg'],
        volume: 0.3,
        loop: true
      }
    };

    // Create Howl instances for each sound
    Object.entries(soundConfigs).forEach(([key, config]) => {
      const sound = new Howl({
        src: config.src,
        volume: (config.volume || 0.5) * this.masterVolume,
        loop: config.loop || false,
        preload: config.preload || false,
        html5: true, // Enable HTML5 audio for better mobile support
        onloaderror: (id, error) => {
          console.warn(`Failed to load sound ${key}:`, error);
        }
      });

      this.sounds.set(key as SoundType, sound);
    });
  }

  private setupGlobalVolume() {
    Howler.volume(this.masterVolume);
  }

  play(soundType: SoundType, options?: {
    volume?: number;
    rate?: number;
    delay?: number;
    pan?: number;
  }) {
    if (!this.enabled) return;

    const sound = this.sounds.get(soundType);
    if (!sound) {
      console.warn(`Sound ${soundType} not found`);
      return;
    }

    // Apply options if provided
    if (options) {
      if (options.delay) {
        setTimeout(() => this.playSound(sound, options), options.delay);
      } else {
        this.playSound(sound, options);
      }
    } else {
      sound.play();
    }
  }

  private playSound(sound: Howl, options: {
    volume?: number;
    rate?: number;
    pan?: number;
  }) {
    const id = sound.play();
    
    if (options.volume !== undefined) {
      sound.volume(options.volume * this.masterVolume, id);
    }
    if (options.rate !== undefined) {
      sound.rate(options.rate, id);
    }
    if (options.pan !== undefined) {
      sound.stereo(options.pan, id);
    }
  }

  playRandomPitch(soundType: SoundType, minPitch: number = 0.9, maxPitch: number = 1.1) {
    const pitch = minPitch + Math.random() * (maxPitch - minPitch);
    this.play(soundType, { rate: pitch });
  }

  playCombo(comboCount: number) {
    if (comboCount === 3) {
      this.play('combo_start');
    } else if (comboCount > 3) {
      // Increase pitch with combo
      const pitch = Math.min(1 + (comboCount - 3) * 0.05, 1.5);
      this.play('combo_start', { rate: pitch, volume: 0.7 });
    }
  }

  playImpact(damage: number) {
    const volume = Math.min(0.5 + damage / 50, 1);
    const pitch = Math.max(1 - damage / 100, 0.7);
    
    this.play('hit_impact', { volume, rate: pitch });
    
    // Layer with bag hit for more impact
    if (damage > 10) {
      this.play('bag_hit', { volume: volume * 0.7, delay: 50 });
    }
  }

  fadeIn(soundType: SoundType, duration: number = 1000) {
    const sound = this.sounds.get(soundType);
    if (sound) {
      sound.fade(0, sound.volume(), duration);
      sound.play();
    }
  }

  fadeOut(soundType: SoundType, duration: number = 1000) {
    const sound = this.sounds.get(soundType);
    if (sound && sound.playing()) {
      sound.fade(sound.volume(), 0, duration);
      setTimeout(() => sound.stop(), duration);
    }
  }

  stop(soundType: SoundType) {
    const sound = this.sounds.get(soundType);
    if (sound) {
      sound.stop();
    }
  }

  stopAll() {
    this.sounds.forEach(sound => sound.stop());
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled) {
      this.stopAll();
    }
  }

  setMasterVolume(volume: number) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    Howler.volume(this.masterVolume);
  }

  preloadAll() {
    this.sounds.forEach(sound => {
      if (!sound.state() || sound.state() === 'unloaded') {
        sound.load();
      }
    });
  }

  // Special effect methods
  playPunchCombo() {
    this.playRandomPitch('punch_light', 0.9, 1.0);
    setTimeout(() => this.playRandomPitch('punch_heavy', 0.95, 1.05), 200);
    setTimeout(() => this.play('uppercut'), 400);
  }

  playKickCombo() {
    this.playRandomPitch('kick_light', 0.9, 1.0);
    setTimeout(() => this.playRandomPitch('kick_heavy', 0.95, 1.05), 250);
  }

  playSpecialMove() {
    this.play('whoosh', { volume: 0.6 });
    setTimeout(() => this.play('special_ready'), 100);
  }

  destroy() {
    this.stopAll();
    this.sounds.forEach(sound => sound.unload());
    this.sounds.clear();
  }
}

// Create singleton instance
export const soundManager = new SoundManager();