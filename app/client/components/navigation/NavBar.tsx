/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useEffect, useState, useCallback } from "react";
import { NavLink } from "react-router-dom";
import styles from "./styles/NavBar.module.css";
import Icon from "../utils/other/Icon";
import Logo from "./Logo";

interface PropType {
  showMobileMenu?: boolean;
  isLoggedIn?: boolean;
  setShowMobileMenu: (value: boolean) => void;
}

function MainLinks({ showMobileMenu, setShowMobileMenu }: PropType) {
  const handleLinkClick = () => setShowMobileMenu(false);

  return (
    <ul
      id={showMobileMenu ? "mobile-links" : "main-links"}
      className={`text-white text-xs justify-center items-center text-center ${
        showMobileMenu ? styles["mobile-nav"] : styles["main-nav"]
      }`}
    >
      <li className="flex w-full lg:w-auto">
        <NavLink
          onClick={handleLinkClick}
          to="/emoji-combos"
          className="relative flex items-center justify-center w-full lg:w-auto py-4 hover:bg-purple-500 lg:hover:bg-transparent lg:py-3 tracking-[0.1em]"
        >
          <span className="text-xl">😀</span>
          <span className={`${styles.icon} hidden xl:flex`}> Emoji Combos</span>
          <span className={`${styles.icon} xl:hidden`}>Combos</span>
        </NavLink>
      </li>
      <li className="flex w-full lg:w-auto">
        <NavLink
          onClick={handleLinkClick}
          to="/copy-and-paste/text-faces"
          className="relative flex items-center justify-center w-full lg:w-auto py-4 hover:bg-purple-500 lg:hover:bg-transparent lg:py-3 tracking-[0.1em]"
        >
          <span className={`${styles.icon}`}>ಥ_ಥ Text Faces</span>
        </NavLink>
      </li>
      <li className="flex w-full lg:w-auto">
        <NavLink
          onClick={handleLinkClick}
          to="/copy-and-paste/emoji-copy-and-paste"
          className="relative flex items-center justify-center w-full lg:w-auto py-4 hover:bg-purple-500 lg:hover:bg-transparent lg:py-3 tracking-[0.1em]"
        >
          <span className="text-xl">✂️</span>
          <span className={`${styles.icon} hidden xl:flex`}> Emoji Copy and Paste</span>
          <span className={`${styles.icon} xl:hidden`}>Copy & Paste</span>
        </NavLink>
      </li>
    </ul>
  );
}

export default function NavBar() {
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);

  const handleResize = useCallback(() => {
    setShowMobileMenu(false);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  useEffect(() => {
    document.body.classList.toggle("overflow-y-hidden", showMobileMenu);
  }, [showMobileMenu]);

  return (
    <nav className={`${styles.nav} fixed left-0 right-0 top-0 bg-purple-800 font-nunito text-base tracking-widest z-20 text-white`}>
      <div className={`${styles["fade-in-nav"]} m-auto flex max-w-[1400px] px-5 items-center justify-between`}>
        <Logo setShowMobileMenu={setShowMobileMenu} />
        <MainLinks showMobileMenu={showMobileMenu} setShowMobileMenu={setShowMobileMenu} />
        {showMobileMenu && (
          <button
            onClick={() => setShowMobileMenu(false)}
            className="absolute bottom-0 left-0 right-0 top-[3.15em] min-h-[100vh] min-w-[100vw] bg-purple-950 bg-opacity-30"
          />
        )}
        <input id="burger" type="checkbox" checked={showMobileMenu} readOnly className="relative hidden" />
        <label
          htmlFor="burger"
          data-testid="burger-icons"
          onClick={() => setShowMobileMenu(prev => !prev)}
          className={`${styles["burger-label"]} relative hover:cursor-pointer`}
        >
          {showMobileMenu ? (
            <Icon
              title="burger-open-icon"
              customStyle={`flex relative fill-white justify-center items-center w-7 scale-125 mr-2 ${styles["burger-close"]}`}
              icon="burgerOpen"
            />
          ) : (
            <Icon
              title="burger-closed-icon"
              customStyle={`flex fill-white relative justify-center items-center w-7 scale-125 mr-2 ${styles["burger-open"]}`}
              icon="burgerClosed"
            />
          )}
        </label>
      </div>
    </nav>
  );
}
