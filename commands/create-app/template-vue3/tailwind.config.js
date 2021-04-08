module.exports = {
  purge: {
    mode: "layers",
    layers: ["utilities"],
    content: ["./src/**/*.{vue,js,ts,jsx,tsx}"],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {},
  variants: {},
  plugins: [],
};
