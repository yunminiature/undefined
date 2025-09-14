import type { AudioConfig, SoundType } from './types';

export class AudioManager {
  private audioContext: AudioContext | null = null;
  private config: AudioConfig = {
    volume: 0.2,
    enabled: true,
  };

  constructor() {
    this.initializeAudioContext();
  }

  private async initializeAudioContext() {
    try {
      if (typeof window === 'undefined') {
        return;
      }

      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
  }

  setConfig(config: Partial<AudioConfig>) {
    this.config = { ...this.config, ...config };
  }

  getConfig(): AudioConfig {
    return { ...this.config };
  }

  private getAudioContext(): AudioContext | null {
    return this.audioContext;
  }

  private createPop(duration = 0.08): void {
    if (!this.audioContext || !this.config.enabled) {
      return;
    }

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + duration);

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.2, this.audioContext.currentTime + 0.005);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  private createWhoosh(duration = 0.12): void {
    if (!this.audioContext || !this.config.enabled) {
      return;
    }

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
    oscillator.frequency.linearRampToValueAtTime(100, this.audioContext.currentTime + duration);

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.15, this.audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  private createPing(frequency = 1000, duration = 0.2): void {
    if (!this.audioContext || !this.config.enabled) {
      return;
    }

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.25, this.audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  private createVictoryFanfare(): void {
    if (!this.audioContext || !this.config.enabled) {
      return;
    }

    const melody = [
      { freq: 523, duration: 0.12, type: 'square' as OscillatorType }, // C5
      { freq: 587, duration: 0.12, type: 'square' as OscillatorType }, // D5
      { freq: 659, duration: 0.12, type: 'square' as OscillatorType }, // E5
      { freq: 698, duration: 0.12, type: 'square' as OscillatorType }, // F5
      { freq: 784, duration: 0.12, type: 'square' as OscillatorType }, // G5
      { freq: 880, duration: 0.12, type: 'square' as OscillatorType }, // A5
      { freq: 988, duration: 0.12, type: 'square' as OscillatorType }, // B5
      { freq: 1047, duration: 0.4, type: 'triangle' as OscillatorType }, // C6
    ];

    let currentTime = this.audioContext.currentTime;

    melody.forEach((note) => {
      const audioContext = this.getAudioContext();
      if (!audioContext) {
        return;
      }

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(note.freq, currentTime);
      oscillator.type = note.type;

      gainNode.gain.setValueAtTime(0, currentTime);
      gainNode.gain.linearRampToValueAtTime(0.35, currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + note.duration);

      oscillator.start(currentTime);
      oscillator.stop(currentTime + note.duration);

      currentTime += note.duration * 0.8;
    });
  }

  private createGameOverMelody(): void {
    if (!this.audioContext || !this.config.enabled) {
      return;
    }

    const melody = [
      { freq: 523, duration: 0.2, type: 'sine' as OscillatorType }, // C5
      { freq: 466, duration: 0.2, type: 'sine' as OscillatorType }, // Bb4
      { freq: 415, duration: 0.2, type: 'sine' as OscillatorType }, // Ab4
      { freq: 370, duration: 0.2, type: 'sine' as OscillatorType }, // F#4
      { freq: 330, duration: 0.2, type: 'sine' as OscillatorType }, // E4
      { freq: 294, duration: 0.2, type: 'sine' as OscillatorType }, // D4
      { freq: 262, duration: 0.2, type: 'sine' as OscillatorType }, // C4
      { freq: 220, duration: 0.6, type: 'sine' as OscillatorType }, // A3
    ];

    let currentTime = this.audioContext.currentTime;

    melody.forEach((note) => {
      const audioContext = this.getAudioContext();

      if (!audioContext) {
        return;
      }

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(note.freq, currentTime);
      oscillator.type = note.type;

      gainNode.gain.setValueAtTime(0, currentTime);
      gainNode.gain.linearRampToValueAtTime(0.15, currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + note.duration);

      oscillator.start(currentTime);
      oscillator.stop(currentTime + note.duration);

      currentTime += note.duration * 0.9;
    });
  }

  private createPowerUp(): void {
    if (!this.audioContext || !this.config.enabled) {
      return;
    }

    const notes = [400, 500, 600, 700, 800, 900, 1000, 1200];

    notes.forEach((freq, index) => {
      setTimeout(() => {
        const audioContext = this.getAudioContext();
        if (!audioContext) {
          return;
        }

        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
        oscillator.type = 'triangle';

        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.12);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.12);
      }, index * 60);
    });
  }

  private createComboRush(): void {
    if (!this.audioContext || !this.config.enabled) {
      return;
    }

    const notes = [800, 900, 1000, 1100, 1200];

    notes.forEach((freq, index) => {
      setTimeout(() => {
        const audioContext = this.getAudioContext();
        if (!audioContext) return;

        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
        oscillator.type = 'square';

        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.25, audioContext.currentTime + 0.005);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.08);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.08);
      }, index * 40);
    });
  }

  playSound(soundType: SoundType, options?: { value?: number }): void {
    if (!this.audioContext || !this.config.enabled) {
      return;
    }

    switch (soundType) {
      case 'move':
        this.createWhoosh(0.1);
        break;

      case 'merge': {
        const baseFreq = 800 + (options?.value ? Math.log2(options.value) * 50 : 0);
        this.createPing(baseFreq, 0.2);
        break;
      }

      case 'newTile':
        this.createPop(0.08);
        break;

      case 'win':
        this.createVictoryFanfare();
        break;

      case 'lose':
        this.createGameOverMelody();
        break;

      case 'combo':
        this.createComboRush();
        break;

      case 'milestone':
        this.createPowerUp();
        break;
    }
  }

  async resume(): Promise<void> {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }
}
