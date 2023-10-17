import { extendTheme } from '@chakra-ui/react';

type ColorModeProps = {
  colorMode: 'dark' | 'light';
};
const config = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const theme = extendTheme({
  fonts: {
    body: 'Merriweather, serif',
    heading: 'Merriweather, serif',
  },
  config,
  colors: {
    brand: {
      900: '#1a365d',
      800: '#153e75',
    },
  },
  components: {
    Button: {
      baseStyle: {},
      variants: {},
      defaultProps: {},
    },
  },
  styles: {
    global: (props: ColorModeProps) => ({
      body: {
        color: props.colorMode === 'dark' ? 'white' : 'black',
        bg: props.colorMode === 'dark' ? '#54585A' : '#D6DBD4',
        transition: 'background-color 0.2s',
      },
    }),
  },
});

export default theme;
