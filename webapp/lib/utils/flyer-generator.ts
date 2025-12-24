/**
 * Canvas-based flyer generator
 * Creates promotional flyers by overlaying text on uploaded images
 */

export interface FlyerConfig {
  backgroundImage: string; // Image data URL
  headline: string;
  subheadline: string;
  eventDetails: string;
  logoUrl?: string;
  template?: "modern" | "minimal" | "bold";
}

export class FlyerGenerator {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d")!;
  }

  /**
   * Generate flyer image
   */
  async generate(config: FlyerConfig): Promise<string> {
    const { backgroundImage, headline, subheadline, eventDetails, logoUrl, template = "modern" } = config;

    // Load background image
    const bgImage = await this.loadImage(backgroundImage);

    // Set canvas size (Instagram square)
    this.canvas.width = 1080;
    this.canvas.height = 1080;

    // Draw background
    this.ctx.drawImage(bgImage, 0, 0, 1080, 1080);

    // Add dark overlay for text readability
    this.addOverlay();

    // Draw text based on template
    switch (template) {
      case "modern":
        this.drawModernTemplate(headline, subheadline, eventDetails, logoUrl);
        break;
      case "minimal":
        this.drawMinimalTemplate(headline, subheadline, eventDetails, logoUrl);
        break;
      case "bold":
        this.drawBoldTemplate(headline, subheadline, eventDetails, logoUrl);
        break;
    }

    // Return as data URL
    return this.canvas.toDataURL("image/jpeg", 0.95);
  }

  /**
   * Load image from URL
   */
  private loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  }

  /**
   * Add gradient overlay for text readability
   */
  private addOverlay(): void {
    const gradient = this.ctx.createLinearGradient(0, 0, 0, 1080);
    gradient.addColorStop(0, "rgba(0, 0, 0, 0.3)");
    gradient.addColorStop(0.5, "rgba(0, 0, 0, 0.1)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0.7)");

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, 1080, 1080);
  }

  /**
   * Modern template design
   */
  private drawModernTemplate(
    headline: string,
    subheadline: string,
    eventDetails: string,
    logoUrl?: string
  ): void {
    // Headline
    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.font = "bold 90px sans-serif";
    this.ctx.textAlign = "center";
    this.wrapText(headline.toUpperCase(), 540, 450, 900, 100);

    // Subheadline
    this.ctx.font = "40px sans-serif";
    this.ctx.fillStyle = "#E9D5FF";
    this.wrapText(subheadline, 540, 580, 800, 50);

    // Event details
    this.ctx.font = "32px sans-serif";
    this.ctx.fillStyle = "#FFFFFF";
    const details = eventDetails.split("\n");
    let y = 750;
    details.forEach((line) => {
      this.ctx.fillText(line, 540, y);
      y += 45;
    });

    // Accent line
    this.ctx.fillStyle = "#A855F7";
    this.ctx.fillRect(240, 640, 600, 4);
  }

  /**
   * Minimal template design
   */
  private drawMinimalTemplate(
    headline: string,
    subheadline: string,
    eventDetails: string,
    logoUrl?: string
  ): void {
    // White box background
    this.ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
    this.ctx.fillRect(90, 300, 900, 480);

    // Headline
    this.ctx.fillStyle = "#000000";
    this.ctx.font = "bold 70px sans-serif";
    this.ctx.textAlign = "center";
    this.wrapText(headline.toUpperCase(), 540, 420, 800, 85);

    // Subheadline
    this.ctx.font = "35px sans-serif";
    this.ctx.fillStyle = "#6B7280";
    this.wrapText(subheadline, 540, 530, 800, 45);

    // Event details
    this.ctx.font = "28px sans-serif";
    this.ctx.fillStyle = "#000000";
    const details = eventDetails.split("\n");
    let y = 630;
    details.forEach((line) => {
      this.ctx.fillText(line, 540, y);
      y += 38;
    });
  }

  /**
   * Bold template design
   */
  private drawBoldTemplate(
    headline: string,
    subheadline: string,
    eventDetails: string,
    logoUrl?: string
  ): void {
    // Purple box at bottom
    this.ctx.fillStyle = "#7C3AED";
    this.ctx.fillRect(0, 650, 1080, 430);

    // Headline
    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.font = "bold 100px sans-serif";
    this.ctx.textAlign = "center";
    this.wrapText(headline.toUpperCase(), 540, 760, 950, 110);

    // Subheadline
    this.ctx.font = "45px sans-serif";
    this.ctx.fillStyle = "#E9D5FF";
    this.wrapText(subheadline, 540, 880, 900, 55);

    // Event details
    this.ctx.font = "30px sans-serif";
    this.ctx.fillStyle = "#FFFFFF";
    const details = eventDetails.split("\n");
    let y = 960;
    details.forEach((line) => {
      this.ctx.fillText(line, 540, y);
      y += 40;
    });
  }

  /**
   * Wrap text to fit width
   */
  private wrapText(
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ): void {
    const words = text.split(" ");
    let line = "";
    let currentY = y;

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + " ";
      const metrics = this.ctx.measureText(testLine);

      if (metrics.width > maxWidth && i > 0) {
        this.ctx.fillText(line, x, currentY);
        line = words[i] + " ";
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    this.ctx.fillText(line, x, currentY);
  }

  /**
   * Download flyer as image
   */
  downloadFlyer(dataUrl: string, filename: string = "flyer.jpg"): void {
    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    link.click();
  }
}
