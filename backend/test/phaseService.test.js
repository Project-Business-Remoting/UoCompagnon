import { describe, it, expect } from 'vitest';
import {
  getUserPhase,
  getPhaseProgress,
  generateSmartNotifications
} from '../src/services/phaseService';

describe('phaseService', () => {

  const createContext = (arrivalOffsetDays, classOffsetDays) => {
    const now = new Date();
    const arrivalDate = new Date(now.getTime() + arrivalOffsetDays * 24 * 60 * 60 * 1000);
    const classStartDate = new Date(now.getTime() + classOffsetDays * 24 * 60 * 60 * 1000);
    return {
      createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), // Created 30 days ago
      arrivalDate,
      classStartDate
    };
  };

  describe('getUserPhase', () => {
    it('returns Before Arrival when arrival date is in the future', () => {
      const user = createContext(10, 20); // Arrival in 10 days
      expect(getUserPhase(user)).toBe('Before Arrival');
    });

    it('returns Welcome Week when arrival has passed but classes haven\'t started', () => {
      const user = createContext(-2, 5); // Arrived 2 days ago, classes in 5 days
      expect(getUserPhase(user)).toBe('Welcome Week');
    });

    it('returns First Month when classes started less than 30 days ago', () => {
      const user = createContext(-15, -10); // Arrived 15 days ago, classes started 10 days ago
      expect(getUserPhase(user)).toBe('First Month');
    });

    it('returns Mid-Term when classes started more than 30 days ago', () => {
      const user = createContext(-40, -35); // Classes started 35 days ago
      expect(getUserPhase(user)).toBe('Mid-Term');
    });
  });

  describe('getPhaseProgress', () => {
    it('calculates value between 0 and 25 for Before Arrival', () => {
      const user = createContext(30, 40); // User created 30 days ago, arrives in 30 days (total 60 days wait)
      const progress = getPhaseProgress(user);
      expect(progress).toBeGreaterThanOrEqual(0);
      expect(progress).toBeLessThanOrEqual(25);
    });

    it('calculates value between 25 and 50 during Welcome Week', () => {
      const user = createContext(-5, 5); // Arrived 5 days ago, classes in 5 days
      const progress = getPhaseProgress(user);
      expect(progress).toBeGreaterThanOrEqual(25);
      expect(progress).toBeLessThanOrEqual(50);
    });
    
    it('caps progress at 100 for dates far in the past', () => {
      const user = createContext(-100, -90);
      expect(getPhaseProgress(user)).toBe(100);
    });
  });

  describe('generateSmartNotifications', () => {
    it('generates arrival 30 days notification', () => {
      const user = createContext(20, 30); // Arrives in 20 days
      const notifs = generateSmartNotifications(user);
      expect(notifs).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ _id: 'smart_arrival_30' })
        ])
      );
    });

    it('generates welcome notification during welcome week', () => {
      const user = createContext(-1, 5); // Arrived yesterday
      const notifs = generateSmartNotifications(user);
      expect(notifs).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ _id: 'smart_welcome' })
        ])
      );
    });
  });
});
