import { useState, useRef, useEffect } from 'react';

function Home() {
  const blocks = [
    { position: 'top', segment: 5 },
    { position: 'bottom', segment: 6 },
    { position: 'top', segment: 6 },
    { position: 'top', segment: 4 },
  ];

  const banners = [
    { src: '/images/default.jpeg', block: blocks[0], font: '75px Georgia' , color: '#003057'},
    { src: '/images/pool.jpeg', block: blocks[1], font: '75px Times New Roman' , color: 'white'},
    { src: '/images/tower.jpeg', block: blocks[2], font: '75px Georgia' , color: 'white'},
  ];

  const [selectedBanner, setSelectedBanner] = useState(banners[0]);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);

  const input1Ref = useRef<HTMLInputElement>(null);
  const input2Ref = useRef<HTMLInputElement>(null);
  const input3Ref = useRef<HTMLInputElement>(null);

  const generateImage = () => {
    if (!selectedBanner) return;
  
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
  
    const img = new Image();
    img.src = selectedBanner.src;
  
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
  
      const segmentWidth = img.width / 6;
      let xPosition = (selectedBanner.block.segment - 1) * segmentWidth + segmentWidth - 50;
  
      let yPosition;
      if (selectedBanner.block.position === 'top') {
        yPosition = 100;
      } else {
        yPosition = img.height - 100;
      }
      const fontSizeMatch = selectedBanner.font.match(/\d+/g);
      const bannerFontSize = fontSizeMatch ? parseInt(fontSizeMatch[0], 10) : 50; 
      
  
      ctx.font = `${bannerFontSize}px ${selectedBanner.font.split(' ')[1]}`;

      const adjustFontSize = (initialSize: number, text: string) => {
        let currentSize = initialSize;
        let currentWidth = ctx.measureText(text).width;
    
        const maxAllowableWidth = window.innerWidth * 0.25;
    
        while (currentWidth > maxAllowableWidth && currentSize > 10) {  
          currentSize -= 1;
          ctx.font = `${currentSize}px ${selectedBanner.font.split(' ')[1]}`;
          currentWidth = ctx.measureText(text).width;
        }
    
        return currentSize;
      };
    
      ctx.fillStyle = selectedBanner.color;
    
      const adjustedFontSize1 = adjustFontSize(bannerFontSize, input1Ref.current?.value || '');
      ctx.font = `${adjustedFontSize1}px ${selectedBanner.font.split(' ')[1]}`;
      const input1Width = ctx.measureText(input1Ref.current?.value || '').width;
      ctx.fillText(input1Ref.current?.value || '', xPosition - input1Width, yPosition);
    
      const adjustedFontSize2 = adjustFontSize(bannerFontSize / 2, input2Ref.current?.value || '');
      ctx.font = `${adjustedFontSize2}px ${selectedBanner.font.split(' ')[1]}`;
      const input2Width = ctx.measureText(input2Ref.current?.value || '').width;
      ctx.fillText(input2Ref.current?.value || '', xPosition - input2Width, yPosition + 60);
    
      const adjustedFontSize3 = adjustFontSize(bannerFontSize / 2, input3Ref.current?.value || '');
      ctx.font = `${adjustedFontSize3}px ${selectedBanner.font.split(' ')[1]}`;
      const input3Width = ctx.measureText(input3Ref.current?.value || '').width;
      ctx.fillText(input3Ref.current?.value || '', xPosition - input3Width, yPosition + 110);
    
      setPreviewSrc(canvas.toDataURL('image/png'));
    };
  };

  useEffect(() => {
    generateImage();
  }, [selectedBanner, input1Ref.current?.value, input2Ref.current?.value, input3Ref.current?.value]);

  return (
    <div>
      <input type="text" ref={input1Ref} placeholder="Input 1" onInput={generateImage} />
      <input type="text" ref={input2Ref} placeholder="Input 2" onInput={generateImage} />
      <input type="text" ref={input3Ref} placeholder="Input 3" onInput={generateImage} />

      <div>
        {banners.map((banner, index) => (
          <img
            key={index}
            src={banner.src}
            alt={`Banner ${index}`}
            style={{ width: '100px', margin: '10px', cursor: 'pointer', border: selectedBanner.src === banner.src ? '2px solid red' : '' }}
            onClick={() => setSelectedBanner(banner)}
          />
        ))}
      </div>

      {previewSrc && (
        <div>
          <h3>Preview:</h3>
          <img src={previewSrc} alt="Generated Banner" style={{ width: '50%' }} />
        </div>
      )}
    </div>
  );
}

export default Home;
