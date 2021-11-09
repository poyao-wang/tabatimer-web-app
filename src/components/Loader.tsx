import React from "react";
import lottie from "lottie-web";
import loaderAnime from "../assets/animations/loader.json";

type LoaderProps = {
  size?: number;
};

const Loader: React.FC<LoaderProps> = () => {
  React.useEffect(() => {
    lottie.loadAnimation({
      container: document.querySelector("#loader") as Element,
      animationData: loaderAnime,
      renderer: "svg", // "canvas", "html"
      loop: true, // boolean
      autoplay: true, // boolean
    });
  }, []);

  return <div id="loader" />;
};

export default Loader;
