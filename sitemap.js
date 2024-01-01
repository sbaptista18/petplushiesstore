const fs = require("fs");
const { SitemapStream, streamToPromise } = require("sitemap");

// Define your website URL
const baseURL = "https://petplushies.pt";

const fetchProducts = async () => {
  try {
    const response = await fetch(
      `https://backoffice.petplushies.pt/wp-json/wc/v3/get_products`
    );
    const data = await response.json();
    return data.products;
  } catch (error) {
    return [];
  }
};

const fetchBlogPosts = async () => {
  try {
    const response = await fetch(
      "https://backoffice.petplushies.pt/wp-json/wc/v3/get_blog_posts"
    );
    const data = await response.json();
    return data.data;
  } catch (error) {
    return [];
  }
};

// Define a function to generate dynamic routes
const generateDynamicRoutes = async (route) => {
  try {
    let dynamicData;
    if (route === "loja") {
      dynamicData = await fetchProducts();
    } else {
      dynamicData = await fetchBlogPosts();
    }

    if (!Array.isArray(dynamicData)) {
      console.error(`Dynamic data for route '${route}' is not an array.`);
      return [];
    }

    // Map dynamic data to create dynamic routes
    if (route === "loja") {
      dynamicData = await fetchProducts();
      return dynamicData.map((item) => `/${route}/${item.url}`);
    } else {
      dynamicData = await fetchBlogPosts();
      return dynamicData.map((item) => `/${route}/${item.post_name}`);
    }
  } catch (error) {
    console.error(`Error generating dynamic routes for '${route}':`, error);
    return [];
  }
};

// Combine static and dynamic routes
const staticRoutes = [
  "/",
  "/sobre-nos",
  "/loja",
  "/contactos",
  "/politica-de-privacidade",
  "/envios-e-devolucoes",
  "/termos-e-condicoes",
  "/perguntas-frequentes",
  "/seguir-encomenda",
  "/mina-conta",
  "/carrinho",
  "/finalizar-compra",
  "/login",
  "/registar",
  "/recuperar-password",
  "/redefinir-password",
];

(async () => {
  const dynamicRoutesLoja = await generateDynamicRoutes("loja");
  const dynamicRoutesBlog = await generateDynamicRoutes("blog");

  // Concatenate all routes
  const allRoutes = [
    ...staticRoutes,
    ...dynamicRoutesLoja,
    ...dynamicRoutesBlog,
  ];

  // Generate URLs with full path
  const urls = allRoutes.map((route) => ({
    url: `${baseURL}${route}`,
    changefreq: "weekly",
    priority: 0.8,
  }));

  // Create a sitemap stream
  const stream = new SitemapStream({ hostname: baseURL });
  urls.forEach((url) => {
    stream.write(url);
  });
  stream.end();

  // Convert the stream to a string
  const sitemapString = await streamToPromise(stream);

  // Write the sitemap to a file
  fs.writeFileSync("./dist/sitemap.xml", sitemapString.toString());

  console.log("Sitemap generated successfully.");
})();
