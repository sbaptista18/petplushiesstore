import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";

import favicon from "assets/images/favicon.png";

const SEOTags = ({ title, description, name, type, image }) => {
  const location = useLocation();
  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{title}</title>
      {favicon && <link rel="icon" href={favicon}></link>}
      <meta name="description" content={description} />
      {/* End standard metadata tags */}
      {/* Facebook tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {/* End Facebook tags */}
      {/* Twitter tags */}
      <meta name="twitter:creator" content={name} />
      <meta name="twitter:card" content={type} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {/* End Twitter tags */}

      <link
        rel="canonical"
        href={`https://petplushies.pt${
          location.pathname != "/" ? location.pathname : ""
        }`}
      />
      <meta property="og:image" content={image} />
    </Helmet>
  );
};

SEOTags.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  image: PropTypes.string,
};

export default SEOTags;
