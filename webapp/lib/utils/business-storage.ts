/**
 * localStorage utilities for business profiles
 */

import { BusinessProfile, BusinessProfileCreate } from "../models/business-profile";

const STORAGE_KEY = "frame_zero_businesses";

export class BusinessStorage {
  /**
   * Get all business profiles
   */
  static getAll(): BusinessProfile[] {
    if (typeof window === "undefined") return [];

    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];

      const businesses = JSON.parse(data);
      // Convert date strings back to Date objects
      return businesses.map((b: any) => ({
        ...b,
        createdAt: new Date(b.createdAt),
        updatedAt: new Date(b.updatedAt),
        savedMedia: b.savedMedia.map((m: any) => ({
          ...m,
          uploadedAt: new Date(m.uploadedAt),
        })),
        exampleContent: b.exampleContent.map((e: any) => ({
          ...e,
          createdAt: new Date(e.createdAt),
        })),
      }));
    } catch (error) {
      console.error("Error loading businesses:", error);
      return [];
    }
  }

  /**
   * Get business by ID
   */
  static getById(id: string): BusinessProfile | null {
    const businesses = this.getAll();
    return businesses.find((b) => b.id === id) || null;
  }

  /**
   * Create new business profile
   */
  static create(data: BusinessProfileCreate): BusinessProfile {
    const businesses = this.getAll();

    const newBusiness: BusinessProfile = {
      id: this.generateId(),
      ...data,
      savedMedia: [],
      exampleContent: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    businesses.push(newBusiness);
    this.saveAll(businesses);

    return newBusiness;
  }

  /**
   * Update existing business profile
   */
  static update(id: string, updates: Partial<BusinessProfile>): BusinessProfile | null {
    const businesses = this.getAll();
    const index = businesses.findIndex((b) => b.id === id);

    if (index === -1) return null;

    businesses[index] = {
      ...businesses[index],
      ...updates,
      updatedAt: new Date(),
    };

    this.saveAll(businesses);
    return businesses[index];
  }

  /**
   * Delete business profile
   */
  static delete(id: string): boolean {
    const businesses = this.getAll();
    const filtered = businesses.filter((b) => b.id !== id);

    if (filtered.length === businesses.length) return false;

    this.saveAll(filtered);
    return true;
  }

  /**
   * Export all businesses as JSON
   */
  static exportAll(): string {
    const businesses = this.getAll();
    return JSON.stringify(businesses, null, 2);
  }

  /**
   * Import businesses from JSON
   */
  static importAll(jsonData: string): boolean {
    try {
      const imported = JSON.parse(jsonData);
      if (!Array.isArray(imported)) return false;

      // Validate structure
      const valid = imported.every(
        (b) => b.id && b.businessName && b.brandSettings
      );

      if (!valid) return false;

      this.saveAll(imported);
      return true;
    } catch (error) {
      console.error("Error importing businesses:", error);
      return false;
    }
  }

  /**
   * Clear all businesses
   */
  static clear(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  /**
   * Save all businesses to localStorage
   */
  private static saveAll(businesses: BusinessProfile[]): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(businesses));
    }
  }

  /**
   * Generate unique ID
   */
  private static generateId(): string {
    return `biz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
