'use client';

import { useEffect } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

type Props = {
  spec: Record<string, any>,
};

function ReactSwagger({ spec }: Props) {
  useEffect(() => {
    // Suppress UNSAFE_ lifecycle warnings from swagger-ui-react
    // This is a known issue with the library that will be fixed in future versions
    const originalError = console.error;
    console.error = (...args) => {
      if (
        typeof args[0] === 'string' &&
        (args[0].includes('UNSAFE_componentWillReceiveProps') ||
         args[0].includes('RequestBodyEditor'))
      ) {
        // Suppress this specific warning
        return;
      }
      originalError.apply(console, args);
    };

    return () => {
      console.error = originalError;
    };
  }, []);

  return (
    <div style={{ width: '100%', maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
      <SwaggerUI spec={spec} />
    </div>
  );
}

export default ReactSwagger;