import React from 'react';
import { Box, Flex, Text, Link, useColorMode } from '@chakra-ui/react';

const GTFooter: React.FC = () => {
  const { colorMode } = useColorMode();

  return (
    <Flex
      as="footer"
      bg={colorMode === 'light' ? '#D6DBD4' : '#54585A'}
      p={{ base: 2, md: 4 }}
      alignItems="center"
      justifyContent="center"
      height="60px"
    >
      <Box>
        <Text fontSize={{ base: 'sm' }}>
          Made with{' '}
          <span role="img" aria-label="heart">
            ❤️
          </span>{' '}
          by
          <Link
            href="https://github.com/bat-kryptonyte"
            isExternal
            ml={2}
            color={colorMode === 'light' ? 'black' : 'white'}
          >
            @bat-kryptonyte
          </Link>
        </Text>
      </Box>
    </Flex>
  );
};

export default GTFooter;
