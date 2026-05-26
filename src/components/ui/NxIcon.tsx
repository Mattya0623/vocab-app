'use client';

type IconKind =
  | 'home' | 'orbit' | 'list' | 'chart' | 'plus' | 'trash' | 'check' | 'x'
  | 'upload' | 'arrow' | 'back' | 'star' | 'flame' | 'book' | 'medal' | 'google'
  | 'settings' | 'search' | 'dots' | 'sparkle' | 'bolt' | 'user';

interface NxIconProps {
  kind?: IconKind;
  size?: number;
  color?: string;
  glow?: boolean;
}

export function NxIcon({ kind = 'sparkle', size = 18, color = 'currentColor', glow = false }: NxIconProps) {
  const common = {
    fill: 'none' as const,
    stroke: 'currentColor' as const,
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  const paths: Record<IconKind, React.ReactNode> = {
    home:  <><path d="M3 11 L12 4 L21 11" {...common}/><path d="M5 10 V20 H19 V10" {...common}/></>,
    orbit: <><circle cx="12" cy="12" r="3" {...common}/><ellipse cx="12" cy="12" rx="9" ry="4" {...common}/></>,
    list:  <path d="M5 7 H19 M5 12 H19 M5 17 H14" {...common}/>,
    chart: <><path d="M4 19 H20" {...common}/><rect x="6" y="11" width="2.5" height="8" {...common}/><rect x="11" y="7" width="2.5" height="12" {...common}/><rect x="16" y="14" width="2.5" height="5" {...common}/></>,
    plus:  <path d="M12 5 V19 M5 12 H19" {...common}/>,
    trash: <path d="M5 7 H19 M9 7 V5 H15 V7 M7 7 L8 20 H16 L17 7" {...common}/>,
    check: <path d="M5 12 L10 17 L19 7" {...common}/>,
    x:     <path d="M6 6 L18 18 M18 6 L6 18" {...common}/>,
    upload:<path d="M12 4 V15 M7 9 L12 4 L17 9 M5 18 H19" {...common}/>,
    arrow: <path d="M6 12 H18 M13 7 L18 12 L13 17" {...common}/>,
    back:  <path d="M18 12 H6 M11 7 L6 12 L11 17" {...common}/>,
    star:  <path d="M12 4 L14.5 10 L21 10.5 L16 14.5 L17.5 21 L12 17.5 L6.5 21 L8 14.5 L3 10.5 L9.5 10 Z" {...common}/>,
    flame: <path d="M12 3 C12 7 17 9 17 14 A5 5 0 0 1 7 14 C7 11 9 11 9 8 C10 9 11 9 12 9 Z" {...common}/>,
    book:  <><path d="M4 5 C8 4 11 5 12 6 C13 5 16 4 20 5 V19 C16 18 13 19 12 20 C11 19 8 18 4 19 Z" {...common}/><path d="M12 6 V20" {...common}/></>,
    medal: <><circle cx="12" cy="14" r="5" {...common}/><path d="M8 9 L6 3 H10 L12 9 M16 9 L18 3 H14 L12 9" {...common}/></>,
    google:<><circle cx="12" cy="12" r="8" {...common}/><path d="M12 12 H16 A4 4 0 1 1 12 8" {...common}/></>,
    settings:<><circle cx="12" cy="12" r="3" {...common}/><path d="M12 3 V6 M12 18 V21 M3 12 H6 M18 12 H21 M5.5 5.5 L7.5 7.5 M16.5 16.5 L18.5 18.5 M5.5 18.5 L7.5 16.5 M16.5 7.5 L18.5 5.5" {...common}/></>,
    search:<><circle cx="11" cy="11" r="6" {...common}/><path d="M15 15 L20 20" {...common}/></>,
    dots:  <><circle cx="6" cy="12" r="1.4" fill="currentColor"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/><circle cx="18" cy="12" r="1.4" fill="currentColor"/></>,
    sparkle:<><path d="M12 3 V9 M12 15 V21 M3 12 H9 M15 12 H21 M5.5 5.5 L9 9 M15 15 L18.5 18.5 M5.5 18.5 L9 15 M15 9 L18.5 5.5" {...common}/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></>,
    bolt:  <path d="M13 3 L5 14 H11 L9 21 L19 9 H13 Z" {...common}/>,
    user:  <><circle cx="12" cy="8" r="4" {...common}/><path d="M4 20 C4 16 8 14 12 14 C16 14 20 16 20 20" {...common}/></>,
  };

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      style={{ color, filter: glow ? `drop-shadow(0 0 6px ${color})` : undefined, flexShrink: 0 }}
    >
      {paths[kind]}
    </svg>
  );
}
