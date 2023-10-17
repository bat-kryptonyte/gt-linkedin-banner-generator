import React from 'react';
import { Box, Flex, Link, Spacer, Image, IconButton, useColorMode } from '@chakra-ui/react';
import { FaGithub, FaMoon, FaSun } from 'react-icons/fa';

const GTNavbar: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Flex
      as="nav"
      bg={colorMode === 'light' ? '#D6DBD4' : '#54585A'}
      p={2}
      alignItems="center"
      height="80px"
    >
      <Box display="flex" alignItems="center" height="100%">
        <Link href="https://gatech.edu" isExternal mx={4}>
          <Image
            src="/gt-logo-oneline-white.svg"
            alt="Georgia Tech Logo"
            boxSize="250px"
            ml={5}
            fit="contain"
            filter={colorMode === 'light' ? 'invert(1)' : 'none'}
          />
        </Link>
      </Box>
      <Spacer paddingRight={50} />
      <Box display="flex" alignItems="center" height="100%">
        <Link
          href="https://github.com/bat-kryptonyte/gt-linkedin-banner-generator"
          isExternal
          mx={4}
        >
          <IconButton aria-label="Github" icon={<FaGithub />} bg="transparent" size={'lg'} />
        </Link>
        <IconButton
          aria-label="Toggle Color Mode"
          icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
          onClick={toggleColorMode}
          bg="transparent"
          size={'lg'}
        />
      </Box>
    </Flex>
  );
};

export default GTNavbar;
