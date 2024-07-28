// import { NavLink } from "react-router-dom";

import styles from "./styles/Footer.module.css";
import { NavLink } from "react-router-dom";
import loadable from "@loadable/component";
import { useLayoutEffect } from "react";

const Logo = loadable(() => import("./Logo"));
const LogoutBtn = loadable(() => import("./LogoutBtn"));

interface PropType {
  isAuthenticated: boolean;
}

//Used by App.tsx component
function Footer({ isAuthenticated }: PropType) {
  useLayoutEffect(() => {
    Logo.load();
    LogoutBtn.load();
  }, []);

  return (
    <>
      <nav
        className={`${styles.nav} m-5 flex w-3/4 flex-col items-center justify-evenly `}
      >
        <div className="mr-auto flex pt-3">
          <Logo setShowMobileMenu={() => {}} />
        </div>
        <ul
          className={`${
            isAuthenticated
              ? "md:grid-cols-6 lg:grid-cols-8"
              : "mb-11  md:grid-cols-7"
          } grid grid-cols-2 gap-x-14 gap-y-6 sm:grid-cols-4`}
        >
          <li className="flex w-full hover:text-defaultgreen">
            <NavLink to="/">
              <span className={`${styles.icon} whitespace-nowrap`}>
                Typing Test
              </span>
            </NavLink>
          </li>
          <li className="flex w-full hover:text-defaultgreen">
            <NavLink to="/lessons">
              <span className={`${styles.icon}`}>Lessons</span>
            </NavLink>
          </li>
          <li className="flex w-full hover:text-defaultgreen">
            <NavLink to="/games">
              <span className={`${styles.icon}`}>Games</span>
            </NavLink>
          </li>
          <li className="flex w-full hover:text-defaultgreen">
            <NavLink to="/learn">
              <span className={`${styles.icon}`}>Learn</span>
            </NavLink>
          </li>
          {isAuthenticated && (
            <>
              <li className="flex w-full hover:text-defaultgreen">
                <NavLink to="/profile/summary">
                  <span className={`${styles.icon}`}>Profile</span>
                </NavLink>
              </li>
              <li className="flex w-full hover:text-defaultgreen">
                <NavLink to="/profile/stats">
                  <span className={`${styles.icon}`}>Stats</span>
                </NavLink>
              </li>
              <li className="flex w-full hover:text-defaultgreen">
                <NavLink to="/profile/img">
                  <span className={`${styles.icon}`}>Images</span>
                </NavLink>
              </li>
              <li className="flex w-full hover:text-defaultgreen">
                <NavLink to="/profile/themes">
                  <span className={`${styles.icon}`}>Themes</span>
                </NavLink>
              </li>
              <li className="flex w-full hover:text-defaultgreen">
                <NavLink to="/profile/account">
                  <span className={`${styles.icon}`}>Account</span>
                </NavLink>
              </li>
            </>
          )}
          {!isAuthenticated && (
            <>
              <li className="flex w-full hover:text-defaultgreen">
                <NavLink to="/login">
                  <span className={`${styles.icon}`}>Login</span>
                </NavLink>
              </li>
              <li className="flex w-full hover:text-defaultgreen">
                <NavLink to="/register">
                  <span className={`${styles.icon}`}>Register</span>
                </NavLink>
              </li>
            </>
          )}
          <li className="flex w-full hover:text-defaultgreen">
            <NavLink to="/sitemap">
              <span className={`${styles.icon}`}>Sitemap</span>
            </NavLink>
          </li>
        </ul>
        {isAuthenticated && (
          <LogoutBtn
            customStyle="my-12 hover:border-defaultgreen hover:text-defaultgreen"
            iconStyle=""
          />
        )}
        <ul className="mx-auto flex w-full max-w-[500px] items-center justify-around ">
          <li>
            <NavLink to="/privacypolicy">
              <span className={`${styles.icon}`}>Privacy Policy</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/cookiespolicy">
              <span className={`${styles.icon}`}>Cookie Policy</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/termsofservice">
              <span className={`${styles.icon}`}>Terms Of Service</span>
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className="w-full bg-slate-800 py-5">
        <span>&copy;</span> 2023 | FreeTypingCamp - All Rights Reserved.
      </div>
    </>
  );
}

export default Footer;
