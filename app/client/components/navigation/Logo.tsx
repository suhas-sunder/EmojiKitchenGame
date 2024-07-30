import { NavLink } from "react-router-dom";
import styles from "./styles/NavBar.module.css";

interface PropTypes {
  setShowMobileMenu: (value: boolean) => void;
}

//Used by NavBar.tsx component
function Logo({ setShowMobileMenu }: PropTypes) {
  return (
    <NavLink
      data-testid="logo-naviation-link"
      onClick={() => setShowMobileMenu(false)}
      aria-label="freetypingcamp.com logo as navigation link with highlight when hovered or clicked"
      to="/"
      className={`${styles.logo} relative flex items-center  font-overlock text-[1.25rem] font-black italic tracking-wider `}
    >
      <p
        className={`font-overlock text-xl italic font-bold  ${styles["logo-long"]}`}
      >
        EmojiKitchenGame
      </p>
      <p
        className={`font-overlock text-xl italic font-bold ${styles["logo-com"]}`}
      >
        .com
      </p>
    </NavLink>
  );
}

export default Logo;
