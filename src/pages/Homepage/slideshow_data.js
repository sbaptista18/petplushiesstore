import Slide1 from "assets/images/slideshow/slide1.jpg";
import { useTranslation } from "react-i18next";

const SlideshowData = () => {
  const { t } = useTranslation();

  const data = [
    {
      title: t("slideshowTitle"),
      image: Slide1,
      url: "/loja/peluche-personalizado",
    },
  ];

  return data;
};

export default SlideshowData;
