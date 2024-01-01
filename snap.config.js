const path = require("path");

// Assuming you have defined srcDir elsewhere in your file
const srcDir = path.join(__dirname, "../src");

module.exports = {
  webpack: (config, { stage }) => {
    if (stage === "build-html" || stage === "build") {
      // Add your aliases to resolve during HTML generation
      config.resolve.alias = {
        "~": path.resolve(__dirname, srcDir),
        // ... other aliases
      };
      config.output.path = path.resolve(__dirname, "../dist");
    }
    return config;
  },
  dest: path.resolve(__dirname, "../dist"), // Specify the build directory
  crawlDelay: 3000, // in milliseconds
  sourceMap: true,
  waitFor: (page, waitForOptions) => {
    // Implement custom logic to wait for spinner disappearance
    return page.waitForFunction(() => {
      // Custom logic to check if the spinner is gone
      return !document.querySelector(".ant-spin-spinning");
    }, waitForOptions);
  },
  puppeteerArgs: ["--no-sandbox", "--disable-setuid-sandbox"],
  // ... other React Snap configuration options
};
