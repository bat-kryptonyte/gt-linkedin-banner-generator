import React from 'react';
import {
  Box,
  Flex,
  Link,
  Spacer,
  Image,
  IconButton,
  useColorMode,
  useBreakpointValue,
} from '@chakra-ui/react';
import { FaGithub, FaMoon, FaSun } from 'react-icons/fa';

const GTNavbar: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const logoBoxSize = useBreakpointValue({ base: '150px', md: '250px' });

  return (
    <Flex
      as="nav"
      bg={colorMode === 'light' ? '#D6DBD4' : '#54585A'}
      p={{ base: 1, md: 2 }}
      alignItems="center"
      height="80px"
    >
      <Box display="flex" alignItems="center" height="100%">
        <Link href="https://gatech.edu" isExternal mx={2}>
          <Image
            src="/gt-logo-oneline-white.svg"
            alt="Georgia Tech Logo"
            boxSize={logoBoxSize}
            fit="contain"
            filter={colorMode === 'light' ? 'invert(1)' : 'none'}
          />
        </Link>
      </Box>
      <Spacer paddingRight={{ base: 2, md: 50 }} />
      <Box display="flex" alignItems="center" height="100%">
        <Link
          href="https://github.com/bat-kryptonyte/gt-linkedin-banner-generator"
          isExternal
          mx={2}
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
