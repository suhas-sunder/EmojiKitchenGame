import { NavLink } from "react-router-dom";
import styles from "./styles/NavBar.module.css";
import LogoImg from "../../../client/assets/images/logo_img.png";

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
      className={`${styles.logo} relative flex items-center  font-overlock text-[1.25rem] font-black italic tracking-wider gap-3`}
    >
      <img
        width={50}
        height={50}
        src={LogoImg}
        alt="logo depicting a chef cooking with emoji as ingredients"
      />
      <div className="flex">
        <p
          className={`font-overlock text-sm sm:text-xl italic font-bold  ${styles["logo-long"]}`}
        >
          EmojiKitchenGame
        </p>
        <p
          className={`font-overlock text-sm sm:text-xl italic font-bold ${styles["logo-com"]}`}
        >
          .com
        </p>
      </div>
    </NavLink>
  );
}

export default Logo;
