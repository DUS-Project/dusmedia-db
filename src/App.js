import { ChakraProvider } from '@chakra-ui/react';
import NewsEditor from './NewsEditor';

function App() {

  return (
    <ChakraProvider>
      <NewsEditor />
    </ChakraProvider>
  )
};

export default App;


