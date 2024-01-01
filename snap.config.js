const srcDir = path.join(__dirname, "../src");

// Example snap.config.js
module.exports = {
  webpack: (config, { stage }) => {
    if (stage === "build-html") {
      // Add your aliases to resolve during HTML generation
      config.resolve.alias = {
        "~": path.resolve(__dirname, srcDir),
        assets: path.resolve(__dirname, `${srcDir}/assets`),
        components: path.resolve(__dirname, `${srcDir}/components`),
        constants: path.resolve(__dirname, `${srcDir}/constants`),
        contracts: path.resolve(__dirname, `${srcDir}/contracts`),
        fragments: path.resolve(__dirname, `${srcDir}/fragments`),
        layout: path.resolve(__dirname, `${srcDir}/layout`),
        pages: path.resolve(__dirname, `${srcDir}/pages`),
        services: path.resolve(__dirname, `${srcDir}/services`),
        reducers: path.resolve(__dirname, `${srcDir}/reducers`),
        utils: path.resolve(__dirname, `${srcDir}/utils`),
        helpers: path.resolve(__dirname, `${srcDir}/helpers`),
        // ... other aliases
      };
      config.output.path = path.join(__dirname, "../dist");
    }
    return config;
  },
  dest: "./build", // Specify the build directory
  crawlDelay: 3000, // in milliseconds
  sourceMap: true,
  waitFor: ".ant-spin-spinning",
  puppeteerArgs: ["--no-sandbox", "--disable-setuid-sandbox"],
  // ... other React Snap configuration options
};
