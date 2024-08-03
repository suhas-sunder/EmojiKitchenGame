import { NavLink } from "react-router-dom";
import styles from "./styles/NavBar.module.css";
import { useLocation } from "@remix-run/react";

//Used by App.tsx component
function Footer() {
  const pathname = useLocation().pathname;

  return (
    <nav
      className={`${styles.nav} w-full ${ (pathname === "/" || pathname === "/copy-and-paste/text-faces" || pathname === "/copy-and-paste/emoji-copy-and-paste") && "fixed"} mt-[16em] bottom-0 flex gap-5 sm:gap-20 justify-center items-center py-1 sm:py-2 text-xs font-nunito  bg-purple-500 `}
    >
      <div className="flex text-purple-200 gap-1 font-bold tracking-widest">
        <span>&copy; 2024</span> <span className="hidden md:flex"> | </span>
        <span className="font-overlock hidden sm:flex">EmojiKitchenGame</span>
        <span className="font-overlock sm:hidden flex">EKG</span>
        <span className="hidden md:flex"> - All Rights Reserved.</span>
      </div>
      <ul className="flex max-w-[500px] items-center justify-around text-white">
        {/* <li className="hidden sm:flex">
          <NavLink to="/about" className="flex px-3 ">
            <span className={`${styles.icon} active:text-rose-300 `}>
              About
            </span>
          </NavLink>
        </li> */}
        <li className="hidden sm:flex">
          <NavLink to="/sitemap" className="flex px-3">
            <span className={`${styles.icon}`}>Sitemap</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/privacy-policy" className="flex px-3">
            <span className={`${styles.icon}`}>Privacy</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/cookies-policy" className="flex px-3">
            <span className={`${styles.icon}`}>Cookie</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/terms-of-service" className="flex px-3">
            <span className={`${styles.icon} hidden sm:flex`}>
              Terms Of Service
            </span>
            <span className={`${styles.icon} flex sm:hidden`}>Terms</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Footer;
