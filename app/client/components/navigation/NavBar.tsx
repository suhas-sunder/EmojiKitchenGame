/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "./styles/NavBar.module.css";
import Icon from "../utils/other/Icon";
import Logo from "./Logo";

interface PropType {
  showMobileMenu?: boolean;
  isLoggedIn?: boolean;
  setShowMobileMenu: (value: boolean) => void;
}

// Main navigation links for nav bar
function MainLinks({ showMobileMenu, setShowMobileMenu }: PropType) {
  return (
    <ul
      id={showMobileMenu ? "mobile-links" : "main-links"}
      className={`text-white text-xs  justify-center items-center text-center ${
        showMobileMenu ? styles["mobile-nav"] : styles["main-nav"]
      } `}
    >
      {/* <li className="flex w-full lg:w-auto">
        <NavLink
          onClick={() => setShowMobileMenu(false)}
          to="/games"
          className={`relative flex items-center justify-center w-full lg:w-auto py-4 hover:bg-purple-500 lg:hover:bg-transparent lg:py-3 tracking-[0.1em] `}
        >
          <span className="text-xl">🀄</span>
          <span className={`${styles.icon}`}>Games</span>
        </NavLink>
      </li> */}
      <li>
        <NavLink
          onClick={() => setShowMobileMenu(false)}
          to="/emoji-combos"
          className={`relative flex items-center justify-center w-full lg:w-auto py-4 hover:bg-purple-500 lg:hover:bg-transparent lg:py-3 tracking-[0.1em] `}
        >
          <span className="text-xl">😀</span>
          <span className={`${styles.icon} hidden xl:flex`}> Emoji Combos</span>
          <span className={`${styles.icon} xl:hidden`}>Combos</span>
        </NavLink>
      </li>
      <li>
        <NavLink
          onClick={() => setShowMobileMenu(false)}
          to="/text-faces"
          className={`relative flex items-center justify-center w-full lg:w-auto py-4 hover:bg-purple-500 lg:hover:bg-transparent lg:py-3 tracking-[0.1em] `}
        >
          <span className={`${styles.icon}`}>ಥ_ಥ Text Faces</span>
        </NavLink>
      </li>
      <li>
        <NavLink
          onClick={() => setShowMobileMenu(false)}
          to="/emoji-copy-and-paste"
          className={`relative flex items-center justify-center w-full lg:w-auto py-4 hover:bg-purple-500 lg:hover:bg-transparent lg:py-3 tracking-[0.1em] `}
        >
          <span className="text-xl">✂️</span>
          <span className={`${styles.icon} hidden xl:flex`}>
            {" "}
            Emoji Copy and Paste
          </span>
          <span className={`${styles.icon} xl:hidden`}>Copy & Paste</span>
        </NavLink>
      </li>
      {/* <li>
        <NavLink
          onClick={() => setShowMobileMenu(false)}
          to="/emoji-generator"
          className={`relative flex items-center justify-center w-full lg:w-auto py-4 hover:bg-purple-500 lg:hover:bg-transparent lg:py-3 tracking-[0.1em] `}
        >
          <span className="text-xl">💀</span>
          <span className={`${styles.icon}`}>Generator</span>
        </NavLink>
      </li>
      <li>
        <NavLink
          onClick={() => setShowMobileMenu(false)}
          to="/blog"
          className={`relative flex items-center justify-center w-full lg:w-auto py-4 hover:bg-purple-500 lg:hover:bg-transparent lg:py-3 tracking-[0.1em] `}
        >
          <span className="text-xl">🫠</span>
          <span className={`${styles.icon}`}>Blog</span>
        </NavLink>
      </li>
      <li>
        <NavLink
          onClick={() => setShowMobileMenu(false)}
          to="/login"
          className={`relative flex items-center justify-center w-full lg:w-auto py-4 hover:bg-purple-500 lg:hover:bg-transparent lg:py-3 tracking-[0.1em] `}
        >
          <span className="text-xl">🔓</span>
          <span className={`${styles.icon}`}>Account</span>
        </NavLink>
      </li> */}
      {/* These are the drop-down login/signup links */}
      {/* <li>
        <NavLink
          onClick={() => setShowMobileMenu(false)}
          to="/games"
          className={`relative flex items-center justify-center  tracking-[0.1em] `}
        >
          <span className="text-xl">🗝️</span>
          <span className={`${styles.icon}`}>Login</span>
        </NavLink>
      </li>
      <li>
        <NavLink
          onClick={() => setShowMobileMenu(false)}
          to="/games"
          className={`relative flex items-center justify-center  tracking-[0.1em] `}
        >
          <span className="text-xl">✒️</span>
          <span className={`${styles.icon}`}>Sign Up</span>
        </NavLink>
      </li> */}
    </ul>
  );
}

//Used by App.tsx component
export default function NavBar() {
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);

  // Close burger menu whenever screen is resized
  useEffect(() => {
    const handleResize = () => {
      setShowMobileMenu(false);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Handles mobile nav bar menu order. Useful when modal is open and nav-bar needs to remain at the very top.
  useEffect(() => {
    const bodyElement = document.getElementsByTagName("body");

    if (showMobileMenu && bodyElement) {
      bodyElement[0].classList.add("overflow-y-hidden");
    } else {
      bodyElement[0].classList.remove("overflow-y-hidden");
    }
  }, [showMobileMenu]);

  return (
    <nav
      className={`${styles.nav} relative left-0 right-0 top-0 bg-purple-800 font-nunito text-base tracking-widest z-20 text-white`}
    >
      <div
        className={`${styles["fade-in-nav"]} m-auto flex  max-w-[1400px] px-5 items-center justify-between`}
      >
        <Logo setShowMobileMenu={setShowMobileMenu} />
        <MainLinks
          showMobileMenu={showMobileMenu}
          setShowMobileMenu={setShowMobileMenu}
        />
        {showMobileMenu && (
          <button
            onClick={() => setShowMobileMenu(false)}
            className="absolute bottom-0 left-0 right-0 top-[3.15em] min-h-[100vh] min-w-[100vw] bg-purple-950 bg-opacity-30"
          />
        )}
        <input
          id="burger"
          type="checkbox"
          checked={showMobileMenu}
          readOnly
          className="relative hidden"
        />
        <label
          htmlFor="burger"
          data-testid="burger-icons"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
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
