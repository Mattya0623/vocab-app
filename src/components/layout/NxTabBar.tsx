'use client';
import { NxIcon } from '@/components/ui';
import { useT } from '@/contexts/I18nContext';
import type { Screen } from '@/types';

const TAB_ITEMS: { id: Screen; labelKey: string; icon: Parameters<typeof NxIcon>[0]['kind'] }[] = [
  { id: 'maps',  labelKey: 'MAPS',    icon: 'orbit' },
  { id: 'home',  labelKey: 'PLAY',    icon: 'sparkle' },
  { id: 'boxes', labelKey: 'NEBULAE', icon: 'star' },
  { id: 'list',  labelKey: 'CODEX',   icon: 'list' },
  { id: 'stats', labelKey: 'PROFILE', icon: 'user' },
];

interface NxTabBarProps {
  active?: Screen;
  onNav?: (s: Screen) => void;
}

export function NxTabBar({ active = 'home', onNav = () => {} }: NxTabBarProps) {
  const t = useT();
  return (
    <div className="nx-tabbar">
      {TAB_ITEMS.map(it => (
        <div key={it.id} className={active === it.id ? 'active' : ''} onClick={() => onNav(it.id)}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
            <NxIcon kind={it.icon} size={18} glow={active === it.id} />
          </div>
          <div>{t(it.labelKey)}</div>
        </div>
      ))}
    </div>
  );
}
