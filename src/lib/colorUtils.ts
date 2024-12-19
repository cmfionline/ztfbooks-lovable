// Function to get the dominant color from an image
export const getImageColor = async (imageUrl: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Set canvas size to 1x1 to get average color
      canvas.width = 1;
      canvas.height = 1;
      
      // Draw and get color
      ctx?.drawImage(img, 0, 0, 1, 1);
      const [r, g, b] = ctx?.getImageData(0, 0, 1, 1).data || [155, 135, 245]; // Default purple if fails
      
      // Convert to HSL and adjust saturation/lightness for better gradients
      const hsl = rgbToHsl(r, g, b);
      resolve(hslToTailwindGradient(hsl));
    };
    
    img.onerror = () => {
      // Default purple gradient if image fails to load
      resolve('from-purple-100 to-purple-50');
    };
    
    img.src = imageUrl;
  });
};

// Convert RGB to HSL
const rgbToHsl = (r: number, g: number, b: number): [number, number, number] => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    
    h /= 6;
  }

  return [h * 360, s * 100, l * 100];
};

// Convert HSL values to Tailwind gradient classes
const hslToTailwindGradient = ([h, s, l]: [number, number, number]): string => {
  // Adjust saturation and lightness for better gradients
  const adjustedS = Math.min(s * 0.8, 30); // Reduce saturation
  const adjustedL = Math.max(l * 1.2, 90); // Increase lightness for primary
  const secondaryL = Math.max(l * 1.3, 95); // Even lighter for secondary

  // Get the base color name based on hue
  const colorName = getColorName(h);
  
  return `from-${colorName}-100 to-${colorName}-50`;
};

// Map hue to Tailwind color names
const getColorName = (hue: number): string => {
  if (hue >= 330 || hue < 20) return 'red';
  if (hue >= 20 && hue < 45) return 'orange';
  if (hue >= 45 && hue < 70) return 'yellow';
  if (hue >= 70 && hue < 150) return 'green';
  if (hue >= 150 && hue < 200) return 'teal';
  if (hue >= 200 && hue < 240) return 'blue';
  if (hue >= 240 && hue < 280) return 'indigo';
  if (hue >= 280 && hue < 330) return 'purple';
  return 'purple'; // Default
};