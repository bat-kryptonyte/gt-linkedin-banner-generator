import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { useColorMode } from '@chakra-ui/react';

import {
  AspectRatio,
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
  useBreakpointValue,
} from '@chakra-ui/react';
import { IconContext } from 'react-icons';
import { AiOutlineCloudDownload } from 'react-icons/ai';
import GTNavbar from '@/components/GTNavBar';
import GTFooter from '@/components/Footer';

export default function Home() {
  const blocks = [
    { position: 'top', segment: 5 },
    { position: 'bottom', segment: 6 },
    { position: 'top', segment: 6 },
    { position: 'top', segment: 2 },
  ];

  const banners = [
    { src: '/images/default-blue.jpeg', block: blocks[1], font: '75px Garamond', color: 'white' },
    { src: '/images/default.jpeg', block: blocks[0], font: '75px Verdana', color: '#003057' },
    { src: '/images/pool.jpeg', block: blocks[1], font: '75px Tahoma', color: 'white' },
    { src: '/images/tower.jpeg', block: blocks[2], font: '75px Georgia', color: 'white' },

    { src: '/images/cap.jpeg', block: blocks[1], font: '75px Georgia', color: 'white' },

    { src: '/images/wreck.jpeg', block: blocks[1], font: '75px Brush Script MT', color: 'black' },
  ];

  const [selectedBanner, setSelectedBanner] = useState(banners[0]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [previewSrc, setPreviewSrc] = useState<string>('');
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const img = new Image();
    img.onload = () => {
      if (img.width === 1584 && img.height === 396) {
        const reader = new FileReader();
        reader.onload = event => {
          const newBanner = {
            src: event.target?.result as string,
            block: blocks[1],
            font: '75px Garamond',
            color: 'white',
          };
          setSelectedBanner(newBanner);
        };
        reader.readAsDataURL(file);
      } else {
        alert('Please upload an image of size 1584x396.');
      }
    };
    img.src = URL.createObjectURL(file);
  };

  const boxSizeValue = useBreakpointValue({ base: '100%', md: '50%' });

  const resizeAndCropImage = (
    imageSrc: string,
    desiredWidth: number,
    desiredHeight: number,
    callback: (arg: string) => void,
  ) => {
    const img = new Image();
    img.src = imageSrc;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const aspectRatio = img.width / img.height;
      const newAspectRatio = desiredWidth / desiredHeight;

      let srcWidth,
        srcHeight,
        srcX = 0,
        srcY = 0;

      if (aspectRatio > newAspectRatio) {
        srcHeight = img.height;
        srcWidth = img.height * newAspectRatio;
        srcX = (img.width - srcWidth) / 2;
      } else {
        srcWidth = img.width;
        srcHeight = img.width / newAspectRatio;
        srcY = (img.height - srcHeight) / 2;
      }

      canvas.width = desiredWidth;
      canvas.height = desiredHeight;

      if (ctx)
        ctx.drawImage(img, srcX, srcY, srcWidth, srcHeight, 0, 0, desiredWidth, desiredHeight);
      callback(canvas.toDataURL('image/png'));
    };
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
      ctx.drawImage(img, 0, 0, 1584, 396);

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
        const isMobile = window.innerWidth <= 768;
        let currentSize = initialSize;
        let currentWidth = ctx.measureText(text).width;

        const maxAllowableWidth = isMobile ? window.innerWidth * 0.8 : window.innerWidth * 0.35;

        while (currentWidth > maxAllowableWidth && currentSize > 10) {
          currentSize -= 1;
          ctx.font = `${currentSize}px ${selectedBanner.font.split(' ').slice(1).join(' ')}`;
          currentWidth = ctx.measureText(text).width;
        }

        return currentSize;
      };

      const input1Value = input1Ref.current?.value || 'Name';
      const input2Value = input2Ref.current?.value || 'Major';

      ctx.fillStyle = selectedBanner.color;
      const adjustedFontSize1 = adjustFontSize(bannerFontSize, input1Ref.current?.value || '');
      ctx.font = `${adjustedFontSize1}px  ${selectedBanner.font.split(' ').slice(1).join(' ')}`;

      ctx.fillText(input1Value, xPosition - ctx.measureText(input1Value).width, yPosition);

      const adjustedFontSize2 = adjustFontSize(bannerFontSize / 2, input2Ref.current?.value || '');
      ctx.font = `${adjustedFontSize2}px  ${selectedBanner.font.split(' ').slice(1).join(' ')}`;

      ctx.fillText(input2Value, xPosition - ctx.measureText(input2Value).width, yPosition + 60);

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
        <Heading paddingBottom={3} fontSize={[21, 23, 25]}>
          Create a GT-themed LinkedIn Profile Banner
        </Heading>
        <Text paddingBottom={10}>
          Your profile background is the single largest element on your entire LinkedIn page and you
          can use it to professionally associate yourself with Tech! Customize a professional banner
          below and get noticed on LinkedIn:
        </Text>

        <Flex alignItems="flex-start" paddingBottom={10} wrap="wrap">
          <VStack
            spacing={3}
            alignItems="flex-start"
            width={['100%', '50%']}
            paddingRight={10}
            paddingBottom={10}
          >
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

          <VStack spacing={6} alignItems="flex-start" width={['100%', '50%']}>
            <Heading fontSize={20}>Choose a template:</Heading>
            <Flex wrap="wrap">
              {banners.map((banner, index) => (
                <Box
                  key={index}
                  border={
                    selectedIndex === index
                      ? `${colorMode === 'dark' ? '2px solid white' : '2px solid black'}`
                      : ''
                  }
                  borderRadius={5}
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
                    onClick={() => {
                      resizeAndCropImage(banner.src, 1584, 396, resizedImageSrc => {
                        const newBanner = {
                          ...banner,
                          src: resizedImageSrc,
                        };
                        setSelectedBanner(newBanner);
                        setSelectedIndex(index);
                      });
                    }}
                  />
                </Box>
              ))}
            </Flex>
            <Heading fontSize={20}>Upload Your Own Template:</Heading>
            <Input type="file" accept="image/*" onChange={handleImageUpload} />
          </VStack>
        </Flex>
        <VStack alignItems={['flex-start', 'center']} spacing={3} w="full">
          <Text fontSize="xl" fontWeight="semibold">
            Your LinkedIn Banner:
          </Text>
          <Box boxSize={boxSizeValue}>
            <AspectRatio ratio={1584 / 396}>
              <ChakraImage
                src={previewSrc}
                alt="Generated Banner"
                objectFit="cover"
                onContextMenu={e => e.preventDefault()}
              />
            </AspectRatio>
          </Box>
          <HStack spacing={10}>
            <Text fontSize={['xs', 'sm', 'md']} fontWeight={'semibold'}>
              All Time Downloads: {downloads}
            </Text>
            <Button
              fontSize={['xs', 'sm', 'md']}
              alignContent="space-between"
              onClick={downloadImage}
            >
              <IconContext.Provider
                value={{ color: `${colorMode === 'dark' ? 'white' : 'black'}` }}
              >
                <div style={{ marginRight: '8px' }}>
                  <AiOutlineCloudDownload />
                </div>
              </IconContext.Provider>
              Download Image
            </Button>
          </HStack>
        </VStack>

        <GTFooter />
      </Container>
    </Box>
  );
}
