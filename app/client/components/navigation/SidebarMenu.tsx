import { useNavigate } from "react-router-dom";
import { useEffect, useLayoutEffect } from "react";
import styles from "./styles/SidebarMenu.module.css";
import loadable from "@loadable/component";
import useLoadAnimation from "../../hooks/useLoadAnimation";

const Icon = loadable(() => import("../../../utils/other/Icon"));
function SidebarMenu({ displayMenuItem, setDisplayMenuItem, menuData }) {
  const navigate = useNavigate();

  const handleMenuAction = (index: number) => {
    menuData[index].url && navigate(menuData[index].url); //If a url is provided, redirect to url
  };

  const { fadeAnim } = useLoadAnimation();

  const pathname = location.pathname;

  //Ensure the appropriate menu tab/item is highlighted based on pathname
  useEffect(() => {
    const index = menuData.findIndex((data) => data.url === pathname);

    setDisplayMenuItem(index); //Update state with menu item being displayed
  }, [menuData, pathname, setDisplayMenuItem]);

  useLayoutEffect(() => {
    Icon.load();
  }, []);

  return (
    <nav>
      <ul
        className={`${styles["scrollbar"]} scrollbar-thumb-rounded flex w-full min-w-[13em] overflow-y-hidden rounded-t-2xl  rounded-tr-none md:min-h-[24em] md:w-auto md:flex-col md:rounded-l-2xl`}
      >
        {menuData.map((data, index) => (
          <li key={data.id} className={`${fadeAnim} flex w-full`}>
            <button
              className={` ${
                index === displayMenuItem
                  ? "bg-white text-defaultblue"
                  : "bg-slate-200 text-slate-950"
              } ${index === 0 && "rounded-tl-2xl"} ${
                index === menuData.length - 1 &&
                "rounded-tr-2xl md:rounded-bl-2xl md:rounded-tr-none"
              } group flex w-full cursor-pointer flex-col items-center gap-4 px-4 py-3 font-nunito hover:bg-white hover:text-defaultblue sm:px-2 sm:py-5 md:flex-row md:px-6 `}
              onClick={() => handleMenuAction(index)}
            >
              <span>
                <Icon
                  icon={data.icon}
                  title={`${data.icon}-icon`}
                  customStyle={`${
                    index === displayMenuItem
                      ? "text-sky-600"
                      : "text-slate-950"
                  } group-hover:text-sky-600`}
                />
              </span>
              <span className="whitespace-nowrap text-xs sm:flex md:text-base">
                {data.title}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default SidebarMenu;
