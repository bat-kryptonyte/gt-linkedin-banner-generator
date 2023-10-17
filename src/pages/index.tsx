import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { useColorMode } from '@chakra-ui/react';

import {
  Input,
  Button,
  Container,
  Text,
  VStack,
  HStack,
  Image as ChakraImage,
  Box,
  FormLabel,
  Heading,
  Flex,
} from '@chakra-ui/react';
import GTNavbar from '@/components/GTNavBar';

export default function Home() {
  const blocks = [
    { position: 'top', segment: 5 },
    { position: 'bottom', segment: 6 },
    { position: 'top', segment: 6 },
    { position: 'top', segment: 2 },
  ];

  const banners = [
    { src: '/images/default-blue.jpeg', block: blocks[1], font: '75px Georgia', color: 'white' },
    { src: '/images/default.jpeg', block: blocks[0], font: '75px Georgia', color: '#003057' },
    { src: '/images/pool.jpeg', block: blocks[1], font: '75px Times New Roman', color: 'white' },
    { src: '/images/tower.jpeg', block: blocks[2], font: '75px Georgia', color: 'white' },

    { src: '/images/cap.jpeg', block: blocks[1], font: '75px Georgia', color: 'white' },

    { src: '/images/wreck.jpeg', block: blocks[1], font: '50px Georgia', color: 'black' },
  ];

  const [selectedBanner, setSelectedBanner] = useState(banners[0]);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [downloads, setDownloads] = useState(0);

  const { colorMode } = useColorMode();

  const input1Ref = useRef<HTMLInputElement>(null);
  const input2Ref = useRef<HTMLInputElement>(null);
  const input3Ref = useRef<HTMLInputElement>(null);

  console.log(downloads);

  const downloadImage = async () => {
    fetch('/api/logDownload', {
      method: 'POST',
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          updateDownloadCount();
        }
        const downloadLink = document.createElement('a');

        if (previewSrc) {
          downloadLink.href = previewSrc;
        }
        downloadLink.download = 'banner.png';

        document.body.appendChild(downloadLink);

        downloadLink.click();

        document.body.removeChild(downloadLink);
      });
  };

  const updateDownloadCount = async () => {
    fetch('/api/getDownload')
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if (data.success) {
          setDownloads(data.downloadCount);
        }
      });
  };

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
      const xPosition = (selectedBanner.block.segment - 1) * segmentWidth + segmentWidth - 50;

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

        const maxAllowableWidth = window.innerWidth * 0.35;

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
  }, [
    selectedBanner,
    input1Ref.current?.value,
    input2Ref.current?.value,
    input3Ref.current?.value,
  ]);

  useEffect(() => {
    updateDownloadCount();
  }, []);

  return (
    <Box maxWidth="80vw" mx="auto">
      <GTNavbar />
      <Container maxW="container.xl" paddingTop={5}>
        <Heading paddingBottom={10} fontSize={25}>
          Create a GT-themed LinkedIn Profile Banner
        </Heading>

        <HStack spacing={5} alignItems="flex-start" paddingBottom={10}>
          <VStack spacing={3} alignItems="flex-start" flex="1">
            <Heading fontSize={20}>Banner Text:</Heading>
            <VStack spacing={1} alignItems="flex-start" w="100%">
              <FormLabel htmlFor="name">Name:</FormLabel>
              <Input
                id="name"
                placeholder="Name"
                ref={input1Ref}
                onChange={() => generateImage()}
                borderColor={colorMode === 'dark' ? 'gray.300' : 'gray.600'}
              />
              <Text fontSize={10}>Your Name: This will appear the largest on the banner</Text>
            </VStack>

            <VStack spacing={1} alignItems="flex-start" w="100%">
              <FormLabel htmlFor="major">Subject/Concentration/Major:</FormLabel>
              <Input
                id="major"
                placeholder="Major"
                ref={input2Ref}
                onChange={() => generateImage()}
                borderColor={colorMode === 'dark' ? 'gray.300' : 'gray.600'}
              />

              <Text fontSize={10}>Example: ISyE @ GT</Text>
            </VStack>
          </VStack>

          <VStack spacing={6} flex="1">
            <Heading fontSize={20}>Choose a template:</Heading>
            <Flex wrap="wrap">
              {banners.map((banner, index) => (
                <Box
                  key={index}
                  border={selectedBanner.src === banner.src ? '2px solid black' : ''}
                  flexBasis={['100%', '50%', '50%']}
                  maxWidth={['100%', '50%', '50%']}
                  boxSizing="border-box"
                  padding="5px"
                >
                  <ChakraImage
                    src={banner.src}
                    alt={`Banner ${index}`}
                    width="100%"
                    height={30}
                    objectFit="cover"
                    cursor="pointer"
                    onClick={() => setSelectedBanner(banner)}
                  />
                </Box>
              ))}
            </Flex>
          </VStack>
        </HStack>
        {previewSrc && (
          <VStack spacing={3}>
            <Text fontSize="xl" fontWeight="semibold">
              Your LinkedIn Banner:
            </Text>
            <ChakraImage src={previewSrc} alt="Generated Banner" boxSize="50%" />
            <HStack spacing={10}>
              <Text fontSize="sm" fontWeight={'semibold'}>
                All Time Downloads: {downloads}
              </Text>
              <Button onClick={downloadImage}>Download Your Banner</Button>
            </HStack>
          </VStack>
        )}
      </Container>
    </Box>
  );
}
