import styles from "./styles/Footer.module.css";
import { NavLink } from "react-router-dom";
//Used by App.tsx component
function Footer() {
  return (
    <nav
      className={`w-full mt-[16em] bottom-0 flex gap-5 sm:gap-20 justify-center items-center py-1 sm:py-2 text-xs text-white  bg-purple-500 `}
    >
      <div className="flex text-purple-300">
        <span>&copy; 2024 | EmojiTypingGame</span>{" "}
        <span className="hidden sm:flex"> - All Rights Reserved.</span>
      </div>
      <ul className=" flex max-w-[500px] items-center gap-5 justify-around">
        <div className="hidden sm:flex gap-5">
          <li>
            <NavLink to="/games">
              <span className={`${styles.icon}`}>Games</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/emojis">
              <span className={`${styles.icon}`}>Emojis</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/text_faces">
              <span className={`${styles.icon}`}>Text Faces</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/tools">
              <span className={`${styles.icon}`}>Tools</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/about">
              <span className={`${styles.icon}`}>About</span>
            </NavLink>
          </li>
        </div>
        <li>
          <NavLink to="/privacypolicy">
            <span className={`${styles.icon}`}>Privacy</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/cookiespolicy">
            <span className={`${styles.icon}`}>Cookie</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/termsofservice">
            <span className={`${styles.icon} hidden sm:flex`}>Terms Of Service</span>
            
            <span className={`${styles.icon} flex sm:hidden`}>Terms</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Footer;
