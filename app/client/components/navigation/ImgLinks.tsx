// import Icon from "../../utils/Icon";

import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import styles from "./styles/ImgLinks.module.css";
import loadable from "@loadable/component";
import { useEffect } from "react";

const SparkleAnim = loadable(() => import("../shared/SparkleAnim"));

interface PropType {
  linkData: {
    img: { [key: string]: string };
    webpImgSrc: string;
    link: string;
    text: string;
  }[];
  customStyle: string;
}

//Used by Home.tsx and ProfileSummary.tsx components
function ImgLinks({ linkData, customStyle }: PropType) {
  useEffect(() => {
    SparkleAnim.load();
  }, []);

  return (
    <ul
      className={`${customStyle} grid max-w-[1060px] grid-cols-1 items-center justify-center gap-y-28 px-5 font-lato capitalize text-gray-500 sm:grid-cols-2 sm:gap-x-14 sm:gap-y-20 md:mx-auto md:grid-cols-3 md:gap-x-12 md:gap-y-24 lg:gap-16`}
    >
      {/* <Icon icon="sparkleFill" title="sparkle fill icon" customStyle="" /> Add floating sparkles on hover */}
      {linkData.map((data) => (
        <li
          key={uuidv4()}
          className={`${styles["link-list"]} h-[11.2em] w-[15em] hover:scale-[1.03]`}
        >
          <SparkleAnim>
            <Link
              to={data.link}
              className="z-[10] flex max-w-[15em] flex-col items-center justify-center rounded-lg border-2 bg-transparent bg-white px-5 py-6 pb-10   hover:border-sky-400 hover:text-sky-700 "
            >
              <picture className="flex min-h-[124px] min-w-[216px]">
                <source srcSet={data.webpImgSrc} type="image/webp"></source>
                <img
                  {...data.img}
                  loading="lazy"
                  className={`${styles["link-img"]} flex scale-110 rounded-md`}
                  width={216}
                  height={124}
                />
              </picture>
              <span className="absolute -bottom-4 flex items-center justify-center rounded-full border-2  border-defaultblue bg-defaultblue px-4 py-2 text-sm tracking-wider text-white md:text-[0.9rem]">
                {data.text.toString()}
              </span>
            </Link>
          </SparkleAnim>
        </li>
      ))}
    </ul>
  );
}

export default ImgLinks;
