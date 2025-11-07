// For tests (Vitest) skip loading PostCSS plugins which may require
// a full build environment. Vitest sets process.env.VITEST.
const config = {
  plugins: process.env.VITEST ? [] : ["@tailwindcss/postcss"],
};

export default config;