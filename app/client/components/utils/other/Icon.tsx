import React, { useState, useEffect } from "react";

// Define a mapping object for icon imports
const iconComponents: Record<
  string,
  () => Promise<{ default: React.ElementType }>
> = {
  eye: () => import("@mui/icons-material/VisibilityRounded"),
  mastery: () => import("@mui/icons-material/WorkspacePremiumRounded"),
  speed: () => import("@mui/icons-material/SpeedRounded"),
  suitcase: () => import("@mui/icons-material/BusinessCenterRounded"),
  law: () => import("@mui/icons-material/GavelRounded"),
  math: () => import("@mui/icons-material/CalculateRounded"),
  bee: () => import("@mui/icons-material/EmojiNatureRounded"),
  mountain: () => import("@mui/icons-material/TerrainRounded"),
  microscope: () => import("@mui/icons-material/BiotechRounded"),
  book: () => import("@mui/icons-material/MenuBookRounded"),
  paw: () => import("@mui/icons-material/PetsRounded"),
  quote: () => import("@mui/icons-material/FormatQuoteRounded"),
  eyeCrossed: () => import("@mui/icons-material/VisibilityOffRounded"),
  doubleArrowDown: () =>
    import("@mui/icons-material/KeyboardDoubleArrowDownRounded"),
  doubleArrowUp: () =>
    import("@mui/icons-material/KeyboardDoubleArrowUpRounded"),
  heart: () => import("@mui/icons-material/FavoriteRounded"),
  questionMark: () => import("@mui/icons-material/LiveHelpRounded"),
  save: () => import("@mui/icons-material/SaveRounded"),
  brokenHeart: () => import("@mui/icons-material/HeartBrokenRounded"),
  lockOpen: () => import("@mui/icons-material/LockOpenRounded"),
  lockClosed: () => import("@mui/icons-material/LockRounded"),
  graduationHat: () => import("@mui/icons-material/SchoolRounded"),
  gamepad: () => import("@mui/icons-material/GamepadRounded"),
  burgerOpen: () => import("@mui/icons-material/MenuRounded"),
  burgerClosed: () => import("@mui/icons-material/MenuOpenRounded"),
  trophy: () => import("@mui/icons-material/EmojiEventsRounded"),
  settingsSparkle: () => import("@mui/icons-material/SettingsSuggestRounded"),
  confetti: () => import("@mui/icons-material/CelebrationRounded"),
  starFull: () => import("@mui/icons-material/StarRounded"),
  starHalf: () => import("@mui/icons-material/StarHalfRounded"),
  starEmpty: () => import("@mui/icons-material/GradeOutlined"),
  plus: () => import("@mui/icons-material/AddRounded"),
  boxingGlove: () => import("@mui/icons-material/SportsMmaRounded"),
  chevron: () => import("@mui/icons-material/ExpandMoreRounded"),
  lightMode: () => import("@mui/icons-material/LightModeRounded"),
  darkMode: () => import("@mui/icons-material/DarkModeRounded"),
  keyboard: () => import("@mui/icons-material/KeyboardRounded"),
  article: () => import("@mui/icons-material/ArticleRounded"),
  threeDotsVertical: () => import("@mui/icons-material/MoreVertRounded"),
  closeBtn: () => import("@mui/icons-material/HighlightOffRounded"),
  info: () => import("@mui/icons-material/InfoRounded"),
  flame: () => import("@mui/icons-material/LocalFireDepartmentRounded"),
  profile: () => import("@mui/icons-material/PermIdentityRounded"),
  profileSettings: () => import("@mui/icons-material/ManageAccountsRounded"),
  profileImage: () => import("@mui/icons-material/WallpaperRounded"),
  achievements: () => import("@mui/icons-material/MilitaryTechRounded"),
  stats: () => import("@mui/icons-material/InsightsRounded"),
  sparkle: () => import("@mui/icons-material/AutoAwesomeRounded"),
  sparkleFill: () => import("@mui/icons-material/AutoAwesomeRounded"),
  circleCheckmark: () =>
    import("@mui/icons-material/PlaylistAddCheckCircleRounded"),
  paperQuill: () => import("@mui/icons-material/HistoryEduRounded"),
  clock: () => import("@mui/icons-material/AccessAlarmRounded"),
  upgrade: () => import("@mui/icons-material/SwitchAccessShortcutRounded"),
  leftArrow: () => import("@mui/icons-material/ArrowBackIosRounded"),
  horizontalLine: () => import("@mui/icons-material/HorizontalRuleRounded"),
  certificate: () => import("@mui/icons-material/VerifiedRounded"),
  rocket: () => import("@mui/icons-material/RocketLaunchRounded"),
  face: () => import("@mui/icons-material/FaceRetouchingNaturalRounded"),
  azLetters: () => import("@mui/icons-material/SortByAlphaRounded"),
  mouse: () => import("@mui/icons-material/PestControlRodentRounded"),
  bird: () => import("@mui/icons-material/FlutterDashRounded"),
  grass: () => import("@mui/icons-material/GrassRounded"),
  flower: () => import("@mui/icons-material/LocalFloristRounded"),
  sailing: () => import("@mui/icons-material/SailingRounded"),
  movie: () => import("@mui/icons-material/MovieFilterRounded"),
  cake: () => import("@mui/icons-material/CakeRounded"),
  copy: () => import("@mui/icons-material/ContentCopyRounded"),
  dice: () => import("@mui/icons-material/CasinoRounded"),
  deselect: () => import("@mui/icons-material/DoDisturbRounded"),
  viewPage: () => import("@mui/icons-material/OpenInNew"),
};

interface Props {
  title?: string;
  customStyle?: string;
  icon: string;
}

export default function Icon({ title, customStyle, icon }: Props) {
  const [mounted, setMounted] = useState(false);
  const [IconComponent, setIconComponent] = useState<React.ElementType | null>(
    null
  );

  useEffect(() => {
    const fetchIcon = async () => {
      if (iconComponents[icon]) {
        try {
          // Dynamically import the appropriate icon component
          const { default: importedIcon } = await iconComponents[icon]();
          setIconComponent(importedIcon);
          setMounted(true);
        } catch (error) {
          console.error(`Error importing ${icon} icon:`, error);
        }
      }
    };

    fetchIcon();
  }, [icon]);

  if (!mounted) {
    return null; // Return null during SSR to prevent hydration errors with MUI.
  }

  return (
    <i title={title || "default-star-icon"} className={`flex ${customStyle}`}>
      {IconComponent ? <IconComponent /> : null}
    </i>
  );
}
