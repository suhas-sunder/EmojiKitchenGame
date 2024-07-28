import React, { useState, useEffect } from "react";

// Define a mapping object for icon imports
const iconComponents: Record<
  string,
  () => Promise<{ default: React.ElementType }>
> = {
  eye: () => import("@mui/icons-material/VisibilityTwoTone"),
  mastery: () => import("@mui/icons-material/WorkspacePremiumTwoTone"),
  speed: () => import("@mui/icons-material/SpeedTwoTone"),
  suitcase: () => import("@mui/icons-material/BusinessCenterTwoTone"),
  law: () => import("@mui/icons-material/GavelTwoTone"),
  math: () => import("@mui/icons-material/CalculateTwoTone"),
  bee: () => import("@mui/icons-material/EmojiNatureTwoTone"),
  mountain: () => import("@mui/icons-material/TerrainTwoTone"),
  microscope: () => import("@mui/icons-material/BiotechTwoTone"),
  book: () => import("@mui/icons-material/MenuBookTwoTone"),
  paw: () => import("@mui/icons-material/PetsTwoTone"),
  quote: () => import("@mui/icons-material/FormatQuoteTwoTone"),
  eyeCrossed: () => import("@mui/icons-material/VisibilityOffTwoTone"),
  doubleArrowDown: () =>
    import("@mui/icons-material/KeyboardDoubleArrowDownTwoTone"),
  doubleArrowUp: () =>
    import("@mui/icons-material/KeyboardDoubleArrowUpTwoTone"),
  heart: () => import("@mui/icons-material/FavoriteTwoTone"),
  questionMark: () => import("@mui/icons-material/LiveHelpTwoTone"),
  save: () => import("@mui/icons-material/SaveTwoTone"),
  brokenHeart: () => import("@mui/icons-material/HeartBrokenTwoTone"),
  lockOpen: () => import("@mui/icons-material/LockOpenTwoTone"),
  lockClosed: () => import("@mui/icons-material/LockTwoTone"),
  graduationHat: () => import("@mui/icons-material/SchoolTwoTone"),
  gamepad: () => import("@mui/icons-material/GamepadTwoTone"),
  burgerOpen: () => import("@mui/icons-material/MenuTwoTone"),
  burgerClosed: () => import("@mui/icons-material/MenuOpenTwoTone"),
  trophy: () => import("@mui/icons-material/EmojiEventsTwoTone"),
  settingsSparkle: () => import("@mui/icons-material/SettingsSuggestTwoTone"),
  confetti: () => import("@mui/icons-material/CelebrationTwoTone"),
  starFull: () => import("@mui/icons-material/StarTwoTone"),
  starHalf: () => import("@mui/icons-material/StarHalfTwoTone"),
  starEmpty: () => import("@mui/icons-material/GradeOutlined"),
  plus: () => import("@mui/icons-material/AddTwoTone"),
  boxingGlove: () => import("@mui/icons-material/SportsMmaTwoTone"),
  chevron: () => import("@mui/icons-material/ExpandMoreTwoTone"),
  lightMode: () => import("@mui/icons-material/LightModeTwoTone"),
  darkMode: () => import("@mui/icons-material/DarkModeTwoTone"),
  keyboard: () => import("@mui/icons-material/KeyboardTwoTone"),
  article: () => import("@mui/icons-material/ArticleTwoTone"),
  threeDotsVertical: () => import("@mui/icons-material/MoreVertTwoTone"),
  closeBtn: () => import("@mui/icons-material/HighlightOffTwoTone"),
  info: () => import("@mui/icons-material/InfoTwoTone"),
  flame: () => import("@mui/icons-material/LocalFireDepartmentTwoTone"),
  profile: () => import("@mui/icons-material/PermIdentityTwoTone"),
  profileSettings: () => import("@mui/icons-material/ManageAccountsTwoTone"),
  profileImage: () => import("@mui/icons-material/WallpaperTwoTone"),
  achievements: () => import("@mui/icons-material/MilitaryTechTwoTone"),
  stats: () => import("@mui/icons-material/InsightsTwoTone"),
  sparkle: () => import("@mui/icons-material/AutoAwesomeTwoTone"),
  sparkleFill: () => import("@mui/icons-material/AutoAwesomeTwoTone"),
  circleCheckmark: () =>
    import("@mui/icons-material/PlaylistAddCheckCircleTwoTone"),
  paperQuill: () => import("@mui/icons-material/HistoryEduTwoTone"),
  clock: () => import("@mui/icons-material/AccessAlarmTwoTone"),
  upgrade: () => import("@mui/icons-material/SwitchAccessShortcutTwoTone"),
  leftArrow: () => import("@mui/icons-material/ArrowBackIosTwoTone"),
  horizontalLine: () => import("@mui/icons-material/HorizontalRuleTwoTone"),
  certificate: () => import("@mui/icons-material/VerifiedTwoTone"),
  rocket: () => import("@mui/icons-material/RocketLaunchTwoTone"),
  face: () => import("@mui/icons-material/FaceRetouchingNaturalTwoTone"),
  azLetters: () => import("@mui/icons-material/SortByAlphaTwoTone"),
  mouse: () => import("@mui/icons-material/PestControlRodentTwoTone"),
  bird: () => import("@mui/icons-material/FlutterDashTwoTone"),
  grass: () => import("@mui/icons-material/GrassTwoTone"),
  flower: () => import("@mui/icons-material/LocalFloristTwoTone"),
  sailing: () => import("@mui/icons-material/SailingTwoTone"),
  movie: () => import("@mui/icons-material/MovieFilterTwoTone"),
  cake: () => import("@mui/icons-material/CakeTwoTone"),
};

interface Props {
  title?: string;
  customStyle?: string;
  icon: string;
}

export default function Icon({ title, customStyle, icon }: Props) {
  const [mounted, setMounted] = useState(false);
  const [IconComponent, setIconComponent] = useState<React.ElementType | null>(
    null,
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
