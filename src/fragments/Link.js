import PropTypes from "prop-types";

function isExternalLink(url) {
  return url.includes("https://")
    ? new URL(url)
    : url.origin === window.location.origin;
}

const Link = ({ href, children, ...rest }) => {
  const isExternal = isExternalLink(href);
  if (isExternal) {
    return (
      <a
        href={href}
        title="Open this page in a new tab"
        target="_blank"
        rel="noopener noreferrer"
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <a href={href} title="Open page" {...rest}>
      {children}
    </a>
  );
};

Link.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.object.isRequired,
};

export default Link;
