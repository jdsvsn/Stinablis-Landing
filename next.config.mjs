import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js';

/** @type {import('next').NextConfig} */
export default (phase) => {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;
  
  return {
    // Separate build directories for dev and production to prevent 
    // concurrent compilation and cache overwrites from breaking the styles.
    distDir: isDev ? '.next-dev' : '.next',
  };
};
