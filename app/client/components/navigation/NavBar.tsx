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
      className={`text-white  ${
        showMobileMenu ? styles["mobile-nav"] : styles["main-nav"]
      } pr-14`}
    >
      {/* <li>
        {showMobileMenu && (
          <NavLink
            onClick={() => setShowMobileMenu(false)}
            to="/"
            className={`relative flex items-center justify-center gap-2 tracking-[0.1em]`}
          >
            Typing Test
            <Icon
              icon="speed"
              title="typing-test-icon"
              customStyle={`${styles.icon} text-white -translate-y-[0.07em] relative`}
            />
          </NavLink>
        )}
        <NavLink
          onClick={() => setShowMobileMenu(false)}
          to="/games"
          className="relative flex items-center justify-center gap-2 tracking-[0.1em]"
        >
          Games 🎲
        </NavLink>
      </li> */}
      <li>
        <NavLink
          onClick={() => setShowMobileMenu(false)}
          to="/emojis"
          className={`relative flex items-center justify-center gap-2 tracking-[0.1em] `}
        >
          <span className={`${styles.icon}`}> Emojis 😀</span>
        </NavLink>
      </li>

      <li>
        <NavLink
          onClick={() => setShowMobileMenu(false)}
          to="/text-faces"
          className={`relative flex items-center justify-center gap-2 tracking-[0.1em] ${styles.icon}`}
        >
          <span className={`${styles.icon}`}>Text ಥ_ಥ</span>
        </NavLink>
      </li>
      {/* <li>
        <NavLink
          onClick={() => setShowMobileMenu(false)}
          to="/tools"
          className="relative flex items-center justify-center gap-2 tracking-[0.1em]"
        >
          Tools 🪛
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
    const navElement = document.getElementById("nav");

    if (showMobileMenu && navElement) {
      navElement.style.zIndex = "1000";
    } else if (navElement) {
      navElement.style.zIndex = "0";
    }
  }, [showMobileMenu]);

  return (
    <nav
      className={`${styles.nav} relative left-0 right-0 top-0 bg-purple-800 font-nunito text-base tracking-widest text-white`}
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
            className="absolute bottom-0 left-0 right-0 top-24 min-h-[100vh] min-w-[100vw] bg-sky-950 bg-opacity-30"
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
              title="burger-closed-icon"
              customStyle={`flex relative justify-center items-center w-[3.324em] h-[3.324em] scale-125 mr-2 ${styles["burger-open"]}`}
              icon="burgerOpen"
            />
          ) : (
            <Icon
              title="burger-open-icon"
              customStyle={`flex relative justify-center items-center w-[3.324em] h-[3.324em] scale-125 mr-2 ${styles["burger-close"]}`}
              icon="burgerClosed"
            />
          )}
        </label>
      </div>
    </nav>
  );
}
