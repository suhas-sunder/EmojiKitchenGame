// Define SVG components
const CopyIcon = () => (
  <svg
    className="flex justify-center items-center"
    focusable="false"
    aria-hidden="true"
    viewBox="0 0 24 24"
    data-testid="ContentCopyRoundedIcon"
  >
    <path d="M15 20H5V7c0-.55-.45-1-1-1s-1 .45-1 1v13c0 1.1.9 2 2 2h10c.55 0 1-.45 1-1s-.45-1-1-1m5-4V4c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h9c1.1 0 2-.9 2-2m-2 0H9V4h9z"></path>
  </svg>
);

const DiceIcon = () => (
  <svg
    className="flex justify-center items-center"
    focusable="false"
    aria-hidden="true"
    viewBox="0 0 24 24"
    data-testid="CasinoRoundedIcon"
  >
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2M7.5 18c-.83 0-1.5-.67-1.5-1.5S6.67 15 7.5 15s1.5.67 1.5 1.5S8.33 18 7.5 18m0-9C6.67 9 6 8.33 6 7.5S6.67 6 7.5 6 9 6.67 9 7.5 8.33 9 7.5 9m4.5 4.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5m4.5 4.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5m0-9c-.83 0-1.5-.67-1.5-1.5S15.67 6 16.5 6s1.5.67 1.5 1.5S17.33 9 16.5 9"></path>
  </svg>
);

const DoNotDisturbRounded = () => (
  <svg
    className="flex justify-center items-center"
    focusable="false"
    aria-hidden="true"
    viewBox="0 0 24 24"
    data-testid="DoNotDisturbRoundedIcon"
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 18c-4.42 0-8-3.58-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31C15.55 19.37 13.85 20 12 20m6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.69 4.9"></path>
  </svg>
);

const FavoriteRoundedIcon = () => (
  <svg
    className="flex justify-center items-center"
    focusable="false"
    aria-hidden="true"
    viewBox="0 0 24 24"
    data-testid="FavoriteRoundedIcon"
  >
    <path d="M13.35 20.13c-.76.69-1.93.69-2.69-.01l-.11-.1C5.3 15.27 1.87 12.16 2 8.28c.06-1.7.93-3.33 2.34-4.29 2.64-1.8 5.9-.96 7.66 1.1 1.76-2.06 5.02-2.91 7.66-1.1 1.41.96 2.28 2.59 2.34 4.29.14 3.88-3.3 6.99-8.55 11.76z"></path>
  </svg>
);

const ViewPageIcon = () => (
  <svg
    className="flex justify-center items-center"
    focusable="false"
    aria-hidden="true"
    viewBox="0 0 24 24"
    data-testid="ViewPageIcon"
  >
    <path d="M18 19H6c-.55 0-1-.45-1-1V6c0-.55.45-1 1-1h5c.55 0 1-.45 1-1s-.45-1-1-1H5c-1.11 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-6c0-.55-.45-1-1-1s-1 .45-1 1v5c0 .55-.45 1-1 1M14 4c0 .55.45 1 1 1h2.59l-9.13 9.13c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L19 6.41V9c0 .55.45 1 1 1s1-.45 1-1V4c0-.55-.45-1-1-1h-5c-.55 0-1 .45-1 1"></path>
  </svg>
);

// Define a mapping object for icon components
const iconComponents = {
  copy: CopyIcon,
  dice: DiceIcon,
  heart: FavoriteRoundedIcon,
  deselect: DoNotDisturbRounded,
  viewPage: ViewPageIcon,
};

// Define the type for icon names
type IconName = keyof typeof iconComponents;

interface Props {
  title?: string;
  customStyle?: string;
  icon: IconName;
}

export default function Icon({ title, customStyle, icon }: Props) {
  const IconComponent = iconComponents[icon];

  if (!IconComponent) {
    return null;
  }

  return (
    <i
      title={title || "default-star-icon"}
      className={`flex justify-center items-center min-w-5 ${customStyle}`}
    >
      <IconComponent />
    </i>
  );
}
