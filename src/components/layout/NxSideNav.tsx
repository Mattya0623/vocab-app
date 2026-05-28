'use client';
import { NxIcon } from '@/components/ui/NxIcon';
import { LevelAvatar } from '@/components/ui/LevelAvatar';
import { useT } from '@/contexts/I18nContext';
import { useApp } from '@/contexts/AppContext';
import { levelColor, levelTierName } from '@/lib/level';
import type { Screen } from '@/types';

const NAV_ITEMS: { id: Screen; labelKey: string; subKey: string; icon: Parameters<typeof NxIcon>[0]['kind'] }[] = [
  { id: 'maps',     labelKey: 'MAPS',     subKey: 'MAPS_SUB',     icon: 'orbit' },
  { id: 'timer',    labelKey: 'TIMER',    subKey: 'TIMER_SUB',    icon: 'clock' },
  { id: 'home',     labelKey: 'PLAY',     subKey: 'PLAY_SUB',     icon: 'sparkle' },
  { id: 'master',   labelKey: 'MASTER',   subKey: 'MASTER_SUB',   icon: 'medal' },
  { id: 'boxes',    labelKey: 'NEBULAE',  subKey: 'NEBULAE_SUB',  icon: 'star' },
  { id: 'list',     labelKey: 'CODEX',    subKey: 'CODEX_SUB',    icon: 'list' },
  { id: 'import',   labelKey: 'IMPORT',   subKey: 'IMPORT_SUB',   icon: 'upload' },
  { id: 'achieve',  labelKey: 'ACHIEVE',  subKey: 'ACHIEVE_SUB',  icon: 'medal' },
  { id: 'stats',    labelKey: 'PROFILE',  subKey: 'PROFILE_SUB',  icon: 'chart' },
  { id: 'settings', labelKey: 'SETTINGS', subKey: 'SETTINGS_SUB', icon: 'settings' },
];

interface NxSideNavProps {
  active?: Screen;
  onNav?: (s: Screen) => void;
}

export function NxSideNav({ active = 'home', onNav = () => {} }: NxSideNavProps) {
  const t = useT();
  const { level, xp, username, user } = useApp();

  return (
    <div className="nx-sidenav">
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 10px 14px', borderBottom: '1px solid var(--line)' }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid var(--cyan)', display: 'grid', placeItems: 'center', boxShadow: '0 0 16px -4px var(--cyan)' }}>
          <NxIcon kind="sparkle" size={16} color="var(--cyan)" glow />
        </div>
        <div>
          <div className="nx-h glow" style={{ fontSize: 18, lineHeight: 1, color: 'var(--cyan)' }}>VOCAB</div>
          <div className="nx-overline">β / constellation</div>
        </div>
      </div>

      {/* Nav items */}
      <div style={{ paddingTop: 12 }}>
        {NAV_ITEMS.map(it => {
          const on = active === it.id;
          return (
            <div key={it.id} className={`nx-navitem${on ? ' active' : ''}`} onClick={() => onNav(it.id)}>
              <NxIcon kind={it.icon} size={18} />
              <div style={{ flex: 1, lineHeight: 1.2, minWidth: 0 }}>
                <div className="nx-h" style={{ fontSize: 12, letterSpacing: '0.08em' }}>{t(it.labelKey)}</div>
                <div className="nx-overline" style={{ fontSize: 9, marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t(it.subKey)}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ flex: 1 }} />
      <div className="nx-divider" style={{ margin: '8px 0' }} />

      {/* Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 4px' }}>
        <LevelAvatar lv={level} size={36} />
        <div style={{ lineHeight: 1.2, minWidth: 0 }}>
          <div style={{ fontSize: 13 }}>{username || user?.displayName || 'ゲスト'}</div>
          <div className="nx-overline" style={{ whiteSpace: 'nowrap', color: levelColor(level) }}>
            {levelTierName(level)} · {xp} XP
          </div>
        </div>
      </div>
    </div>
  );
}
