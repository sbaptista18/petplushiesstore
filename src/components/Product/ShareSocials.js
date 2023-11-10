import styled from "styled-components";
import PropTypes from "prop-types";

import { ToKebabCase } from "fragments";

const ShareSocials = ({ item, page }) => {
  return (
    <Container>
      <Separator />
      <LinkContainer>
        <Link
          title="Click here to share to your Facebook feed"
          href={
            "https://www.facebook.com/sharer.php?u=https://www.petplushies.pt/" +
            page +
            "/" +
            (item.name ? ToKebabCase(item.name) : item.url)
          }
          target="_blank"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30">
            <path d="M13.333 11.667V13H12v2h1.333v6H16v-6h1.773L18 13h-2v-1.167c0-.54.053-.826.887-.826H18V9h-1.787c-2.133 0-2.88 1-2.88 2.667Z" />
            <Circle d="M15 0C6.716 0 0 6.716 0 15c0 8.284 6.716 15 15 15 8.284 0 15-6.716 15-15 0-8.284-6.716-15-15-15Zm0 28.636C7.469 28.636 1.364 22.531 1.364 15 1.364 7.469 7.469 1.364 15 1.364c7.531 0 13.636 6.105 13.636 13.636 0 7.531-6.105 13.636-13.636 13.636Z" />
          </svg>
        </Link>
        <Link
          title="Click here to share to tweet about this topic"
          href={
            "https://twitter.com/share?url=https://www.petplushies.pt/" +
            page +
            "/" +
            (item.name ? ToKebabCase(item.name) : item.url)
          }
          target="_blank"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30">
            <path d="M22.129 9.947a5.471 5.471 0 0 1-1.762.704 2.734 2.734 0 0 0-2.025-.901c-1.507-.012-2.742 1.244-2.768 2.816.001.218.026.435.075.647-2.22-.109-4.292-1.187-5.71-2.97a2.907 2.907 0 0 0-.379 1.408c0 .956.465 1.846 1.235 2.365a2.707 2.707 0 0 1-1.255-.36v.036c-.004 1.373.928 2.555 2.22 2.816-.407.113-.834.13-1.248.049.373 1.163 1.41 1.953 2.585 1.97a5.464 5.464 0 0 1-3.422 1.233A5.51 5.51 0 0 1 9 19.718a7.694 7.694 0 0 0 4.246 1.28c4.286.082 7.824-3.475 7.903-7.945l.001-.142v-.366a5.751 5.751 0 0 0 1.35-1.472 5.422 5.422 0 0 1-1.593.451 2.844 2.844 0 0 0 1.222-1.577Z" />
            <Circle d="M15 0C6.716 0 0 6.716 0 15c0 8.284 6.716 15 15 15 8.284 0 15-6.716 15-15 0-8.284-6.716-15-15-15Zm0 28.636C7.469 28.636 1.364 22.531 1.364 15 1.364 7.469 7.469 1.364 15 1.364c7.531 0 13.636 6.105 13.636 13.636 0 7.531-6.105 13.636-13.636 13.636Z" />
          </svg>
        </Link>
        <Link
          title="Click here to share in Pinterest"
          href={
            "https://pinterest.com/pin/create/button/?url=https://www.petplushies.pt/" +
            page +
            "/" +
            (item.name ? ToKebabCase(item.name) : item.url) +
            "&media=https://www.petplushies.pt/public/images" +
            item.picture +
            "&description=" +
            item.name
          }
          target="_blank"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            x="0"
            y="0"
            viewBox="0 0 512 512"
          >
            <path d="m252.975 151.273-14.895 1.862a105.988 105.988 0 0 0-26.996 8.96 95.07 95.07 0 0 0-43.404 47.36 89.507 89.507 0 0 0-2.676 11.636c-6.522 23.169 1.897 47.963 21.178 62.371 2.909 1.745 9.658 5.004 11.636.698a38.88 38.88 0 0 0 1.862-8.146 18.973 18.973 0 0 0 1.862-7.447c-.698-3.84-4.771-6.167-6.516-9.309a63.426 63.426 0 0 1-5.353-20.015v-3.375c.864-28.568 20.899-52.954 48.756-59.345a70.975 70.975 0 0 1 26.764-1.978l12.916 2.211a50.157 50.157 0 0 1 33.164 28.16 70.978 70.978 0 0 1 2.327 37.12c-1.28 5.353-1.047 10.007-2.676 14.895-5.935 18.036-14.662 34.909-34.327 39.331-10.696 2.795-21.804-2.784-25.949-13.033a17.57 17.57 0 0 1-1.513-10.007c3.375-14.662 8.378-27.695 11.636-42.356 4.014-10.849-1.526-22.898-12.375-26.913a20.758 20.758 0 0 0-1.705-.549c-13.498-3.258-23.855 9.309-27.462 17.455a48.053 48.053 0 0 0-2.327 27.113 47.674 47.674 0 0 1 4.189 12.451c-2.56 11.636-5.585 23.273-8.727 34.909-3.142 11.636-5.12 23.273-8.378 34.909-1.513 5.12-1.396 10.589-2.676 15.942v7.796a53.504 53.504 0 0 0 .815 18.502c.698 3.142 0 6.982 1.164 9.309a4.767 4.767 0 0 0 .815 2.909c4.771 0 11.636-12.684 13.731-16.291a145.955 145.955 0 0 0 11.636-22.691c3.142-7.331 3.607-15.476 6.051-23.273a94.666 94.666 0 0 0 5.236-19.898 16.984 16.984 0 0 0 7.215 7.796 48.64 48.64 0 0 0 38.516 7.796 69.817 69.817 0 0 0 41.193-24.902 109.168 109.168 0 0 0 16.058-31.535c1.978-5.818 2.327-12.335 3.84-18.502a78.08 78.08 0 0 0-5.702-44.567c-13.383-30.37-42.474-48.057-88.903-47.359z" />
            <Circle d="M256 0C114.615 0 0 114.615 0 256s114.615 256 256 256 256-114.615 256-256S397.385 0 256 0zm0 488.727C127.468 488.727 23.273 384.532 23.273 256S127.468 23.273 256 23.273 488.727 127.468 488.727 256 384.532 488.727 256 488.727z" />
          </svg>
        </Link>
      </LinkContainer>
    </Container>
  );
};

ShareSocials.propTypes = {
  item: PropTypes.object.isRequired,
  page: PropTypes.string.isRequired,
};

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  width: auto;
  flex-direction: column;
  align-items: center;
`;

const Separator = styled.div`
  width: 10%;
  height: 3px;
  background-color: var(--dark-gray);
  margin: 20px 0;
`;

const LinkContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Link = styled.a`
  border-radius: 50%;
  margin-right: 20px;
  transition: 0.1s;
  width: 30px;
  height: 30px;
  display: block;

  &:last-of-type {
    margin: 0;
  }

  & svg {
    fill: var(--dark-gray);
    width: 30px;
    height: 30px;
  }

  &:hover {
    background-color: var(--dark-gray);

    & svg {
      fill: var(--white);
    }
  }
`;

const Circle = styled.path`
  fill: var(--dark-gray);
`;

export default ShareSocials;
