const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

async function generateSpriteSheet() {
  const spriteSize = 32;
  const framesPerAnimation = 4;
  
  // Create canvas for sprite sheet
  const canvas = createCanvas(spriteSize * 8, spriteSize * 2);
  const ctx = canvas.getContext('2d');
  
  try {
    // Load the character image
    const chogImage = await loadImage(path.join(__dirname, '../public/chog.png'));
    
    // Fill background with transparent
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Extract character region (assuming character is centered in the image)
    const sourceX = chogImage.width / 2 - 50;
    const sourceY = chogImage.height / 2 - 50;
    const sourceSize = 100;
    
    // Generate idle frame
    ctx.drawImage(
      chogImage,
      sourceX, sourceY, sourceSize, sourceSize,
      0, 0, spriteSize, spriteSize
    );
    
    // Generate running frames with slight modifications
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 0.5; // Slight rotation for running effect
      ctx.save();
      ctx.translate(spriteSize * (i + 1) + spriteSize / 2, spriteSize / 2);
      
      // Add slight bounce effect
      const bounce = Math.sin(angle) * 2;
      ctx.translate(0, -bounce);
      
      // Draw frame
      ctx.drawImage(
        chogImage,
        sourceX, sourceY, sourceSize, sourceSize,
        -spriteSize / 2, -spriteSize / 2, spriteSize, spriteSize
      );
      ctx.restore();
    }
    
    // Generate jump frames
    ctx.save();
    ctx.translate(spriteSize * 5 + spriteSize / 2, spriteSize / 2);
    ctx.drawImage(
      chogImage,
      sourceX, sourceY - 10, sourceSize, sourceSize,
      -spriteSize / 2, -spriteSize / 2, spriteSize, spriteSize
    );
    ctx.restore();
    
    // Generate fall frame
    ctx.save();
    ctx.translate(spriteSize * 6 + spriteSize / 2, spriteSize / 2);
    ctx.drawImage(
      chogImage,
      sourceX, sourceY + 10, sourceSize, sourceSize,
      -spriteSize / 2, -spriteSize / 2, spriteSize, spriteSize
    );
    ctx.restore();
    
    // Save the sprite sheet
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(path.join(__dirname, '../public/chog-sprites.png'), buffer);
    
    console.log('Sprite sheet generated successfully!');
  } catch (error) {
    console.error('Error generating sprite sheet:', error);
    console.log('Please ensure canvas package is installed: npm install canvas');
  }
}

generateSpriteSheet();