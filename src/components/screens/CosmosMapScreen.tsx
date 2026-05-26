'use client';
import { NxCard, NxBtn, NxTag, NxIcon } from '@/components/ui';
import { Constellation } from '@/components/ui';
import { NxMobileHeader } from '@/components/layout/NxMobileHeader';
import { NxTabBar } from '@/components/layout/NxTabBar';
import { NxDesktopShell } from '@/components/layout/NxDesktopShell';
import { useT } from '@/contexts/I18nContext';
import { useApp } from '@/contexts/AppContext';
import { MAPS, stageUnlockLevel, stageStatus, mapUnlocked, mapProgress } from '@/data/maps';
import type { Screen } from '@/types';

interface CosmosMapScreenProps {
  onNav: (s: Screen) => void;
  desktop?: boolean;
}

const STAGE_POSITIONS = [
  { x: 12, y: 80 }, { x: 28, y: 64 }, { x: 18, y: 46 }, { x: 38, y: 30 },
  { x: 58, y: 38 }, { x: 74, y: 56 }, { x: 64, y: 76 }, { x: 88, y: 22 },
];

function StageNode({ status, color, size = 56 }: { status: string; color: string; size?: number }) {
  const bg =
    status === 'completed' ? color :
    status === 'current'   ? color :
    'rgba(8, 10, 28, 0.85)';
  const border =
    status === 'completed' ? color :
    status === 'current'   ? color :
    'rgba(118, 138, 220, 0.4)';
  const shadow =
    status === 'completed' ? `0 0 14px ${color}` :
    status === 'current'   ? `0 0 22px ${color}, 0 0 40px ${color}88` :
    'none';
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: bg,
      border: `2px solid ${border}`,
      boxShadow: shadow,
      display: 'grid', placeItems: 'center',
      position: 'relative', flexShrink: 0,
    }}>
      {status === 'completed' && <NxIcon kind="check" size={size * 0.55} color="var(--bg-0)" />}
      {status === 'current' && <div className="nx-pulse" style={{ borderColor: color }} />}
      {status === 'locked' && (
        <div style={{
          width: size * 0.35, height: size * 0.28,
          border: '1.4px solid rgba(118,138,220,0.6)',
          borderRadius: 3, position: 'relative',
        }}>
          <div style={{
            position: 'absolute', top: -size * 0.18, left: '50%', transform: 'translateX(-50%)',
            width: size * 0.22, height: size * 0.18,
            border: '1.4px solid rgba(118,138,220,0.6)',
            borderBottom: 'none',
            borderRadius: '50% 50% 0 0',
          }} />
        </div>
      )}
    </div>
  );
}

export function CosmosMapScreen({ onNav, desktop }: CosmosMapScreenProps) {
  const t = useT();
  const { level, selectedMap, setSelectedMap } = useApp();
  const map = MAPS[selectedMap];
  const unlocked = mapUnlocked(selectedMap, level);
  const progress = mapProgress(selectedMap, level);

  if (desktop) {
    return (
      <NxDesktopShell active="maps" onNav={onNav}
        title={t('MAPS_HEAD')}
        sub={`MAP ${selectedMap + 1} / 10 · ${map.en.toUpperCase()} · ${progress} / 8 CLEARED`}
        right={<>
          <NxTag style={{ color: map.color, borderColor: map.color, background: map.color + '15' }}>
            {map.name}
          </NxTag>
          <NxBtn ghost onClick={() => setSelectedMap(Math.max(0, selectedMap - 1))}>
            <NxIcon kind="back" size={14} /> {t('PREV')}
          </NxBtn>
          <NxBtn primary onClick={() => setSelectedMap(Math.min(9, selectedMap + 1))}>
            {t('NEXT_MAP')} <NxIcon kind="arrow" size={14} />
          </NxBtn>
        </>}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 16, height: '100%', minHeight: 0 }}>
          <NxCard bracket style={{
            position: 'relative', overflow: 'hidden', padding: 0,
            background: `radial-gradient(ellipse at 50% 50%, ${map.color}1a 0%, transparent 60%)`,
          }}>
            <div style={{ position: 'absolute', inset: 0 }}>
              <Constellation density={1.8} mode="wide" />
            </div>

            <svg viewBox="0 0 100 100" preserveAspectRatio="none"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
              <path
                d={STAGE_POSITIONS.reduce((acc, p, i) => {
                  if (i === 0) return `M ${p.x} ${p.y}`;
                  const prev = STAGE_POSITIONS[i - 1];
                  const mx = (prev.x + p.x) / 2;
                  return acc + ` Q ${mx} ${prev.y} ${p.x} ${p.y}`;
                }, '')}
                fill="none" stroke={map.color} strokeWidth="0.35" strokeDasharray="1 1.5"
                opacity={unlocked ? 0.8 : 0.25} />
            </svg>

            <div style={{ position: 'absolute', left: 18, top: 16, right: 18, display: 'flex', alignItems: 'center', gap: 12, zIndex: 5 }}>
              <div className="nx-h glow" style={{ fontSize: 26, color: map.color, textShadow: `0 0 14px ${map.color}` }}>{map.name}</div>
              <div style={{ flex: 1 }} />
              {!unlocked && <NxTag red>🔒 LOCKED · LV {stageUnlockLevel(selectedMap, 0)}</NxTag>}
              <NxTag style={{ color: map.color, borderColor: map.color, background: map.color + '20' }}>{progress} / 8</NxTag>
            </div>

            {map.stages.map((s, i) => {
              const p = STAGE_POSITIONS[i];
              const status = unlocked ? stageStatus(selectedMap, i, level) : 'locked';
              const size = status === 'current' ? 56 : 48;
              return (
                <div key={i} style={{
                  position: 'absolute',
                  left: `${p.x}%`, top: `${p.y}%`,
                  transform: 'translate(-50%, -50%)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                }}>
                  <div style={{ position: 'relative' }}>
                    <StageNode status={status} color={map.color} size={size} />
                    <div style={{
                      position: 'absolute', top: -8, right: -10,
                      width: 22, height: 22, borderRadius: '50%',
                      background: 'var(--bg-0)',
                      border: `1.5px solid ${status === 'locked' ? 'var(--line)' : map.color}`,
                      display: 'grid', placeItems: 'center',
                      fontFamily: 'var(--display)', fontWeight: 900, fontSize: 11,
                      color: status === 'locked' ? 'var(--ink-mute)' : map.color,
                    }}>{i + 1}</div>
                  </div>
                  <div style={{
                    fontFamily: 'var(--display)', fontWeight: 700, fontSize: 11,
                    letterSpacing: '0.04em',
                    color: status === 'locked' ? 'var(--ink-mute)' : map.color,
                    textShadow: status !== 'locked' ? `0 0 6px ${map.color}` : 'none',
                    whiteSpace: 'nowrap', textAlign: 'center',
                    maxWidth: 110, overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>{s.name}</div>
                  <div className="nx-overline" style={{ fontSize: 8 }}>
                    {status === 'locked' ? `LV ${stageUnlockLevel(selectedMap, i)}` :
                     status === 'completed' ? 'CLEAR' : '挑戦中'}
                  </div>
                </div>
              );
            })}
          </NxCard>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minHeight: 0, overflow: 'hidden' }}>
            <NxCard style={{ padding: 12, flex: '0 0 auto' }}>
              <span className="nx-h glow" style={{ fontSize: 12, color: 'var(--cyan)' }}>{t('GALAXY_TOUR')}</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8 }}>
                {MAPS.map((m, i) => {
                  const up = mapUnlocked(i, level);
                  const p = mapProgress(i, level);
                  const on = i === selectedMap;
                  return (
                    <div key={i} onClick={() => setSelectedMap(i)} className="nx-clickable"
                      style={{
                        display: 'grid', gridTemplateColumns: '24px 1fr 50px 26px',
                        alignItems: 'center', gap: 8,
                        padding: '6px 10px', borderRadius: 7,
                        background: on ? `${m.color}1f` : 'transparent',
                        border: `1px solid ${on ? m.color : 'transparent'}`,
                        boxShadow: on ? `0 0 16px -6px ${m.color}` : 'none',
                        opacity: up ? 1 : 0.55,
                      }}>
                      <div style={{
                        width: 14, height: 14, borderRadius: '50%',
                        background: m.color, boxShadow: `0 0 8px ${m.color}`,
                        justifySelf: 'center',
                        opacity: up ? 1 : 0.4,
                      }} />
                      <div style={{ lineHeight: 1.15, minWidth: 0 }}>
                        <div className="nx-h" style={{
                          fontSize: 11, color: up ? m.color : 'var(--ink-mute)',
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        }}>MAP {i + 1}</div>
                        <div style={{ fontSize: 11, color: up ? 'var(--ink)' : 'var(--ink-mute)',
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        }}>{m.name}</div>
                      </div>
                      <span className="nx-mono" style={{ fontSize: 10, textAlign: 'right', color: up ? 'var(--ink-soft)' : 'var(--ink-mute)' }}>
                        {up ? `${p}/8` : '🔒'}
                      </span>
                      {on && <NxIcon kind="arrow" size={12} color={m.color} />}
                    </div>
                  );
                })}
              </div>
            </NxCard>
          </div>
        </div>
      </NxDesktopShell>
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <NxMobileHeader
        title={t('MAPS')}
        sub={`MAP ${selectedMap + 1} / 10 · ${map.en.toUpperCase()}`}
        glowColor="mag"
        left={<div onClick={() => setSelectedMap(Math.max(0, selectedMap - 1))} style={{ cursor: 'pointer', opacity: selectedMap > 0 ? 1 : 0.3 }}>
          <NxIcon kind="back" size={18} color="var(--ink-soft)" />
        </div>}
        right={<div onClick={() => setSelectedMap(Math.min(9, selectedMap + 1))} style={{ cursor: 'pointer', opacity: selectedMap < 9 ? 1 : 0.3 }}>
          <NxIcon kind="arrow" size={18} color="var(--ink-soft)" />
        </div>}
      />

      <div style={{ padding: '12px 16px 6px' }}>
        <div className="nx-h glow" style={{ fontSize: 22, color: map.color, textShadow: `0 0 12px ${map.color}` }}>{map.name}</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 6 }}>
          <div style={{ flex: 1, height: 6, borderRadius: 3, overflow: 'hidden', background: 'rgba(8,10,28,0.7)', border: '1px solid var(--line)' }}>
            <div style={{ width: `${(progress / 8) * 100}%`, height: '100%', background: map.color, boxShadow: `0 0 8px ${map.color}`, transition: 'width 0.3s' }} />
          </div>
          <span className="nx-mono" style={{ fontSize: 11, color: map.color }}>{progress} / 8</span>
        </div>
        {!unlocked && (
          <div style={{ marginTop: 6 }}>
            <NxTag red>🔒 LV {stageUnlockLevel(selectedMap, 0)} で解放</NxTag>
          </div>
        )}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '8px 16px 12px', position: 'relative' }}>
        <div style={{
          position: 'absolute', left: '50%', top: 12, bottom: 12, width: 1,
          background: `linear-gradient(180deg, ${map.color}33 0%, transparent 100%)`,
          transform: 'translateX(-50%)',
        }} />
        {map.stages.map((s, i) => {
          const status = unlocked ? stageStatus(selectedMap, i, level) : 'locked';
          const req = stageUnlockLevel(selectedMap, i);
          const isRight = i % 2 === 0;
          return (
            <div key={i} style={{
              display: 'grid',
              gridTemplateColumns: isRight ? '40px 1fr 8px' : '8px 1fr 40px',
              gap: 10, alignItems: 'center',
              padding: '8px 0',
              direction: isRight ? 'ltr' : 'rtl',
            }}>
              {isRight && (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <StageNode status={status} color={map.color} size={40} />
                </div>
              )}
              <div style={{ direction: 'ltr', textAlign: isRight ? 'left' : 'right', opacity: status === 'locked' ? 0.5 : 1 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: isRight ? 'flex-start' : 'flex-end', flexWrap: 'wrap' }}>
                  <span className="nx-mono" style={{ fontSize: 10, color: 'var(--ink-mute)' }}>STAGE {i + 1}</span>
                  <span className="nx-h" style={{ fontSize: 14, color: status === 'locked' ? 'var(--ink-soft)' : map.color }}>{s.name}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 1 }}>{s.sub}</div>
                <div style={{ marginTop: 4 }}>
                  {status === 'completed' && <NxTag green>CLEARED ✓</NxTag>}
                  {status === 'current'   && <NxTag cyan>挑戦中 ▶</NxTag>}
                  {status === 'locked'    && <NxTag red>🔒 LV {req}</NxTag>}
                </div>
              </div>
              {!isRight && (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <StageNode status={status} color={map.color} size={40} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{
        padding: '8px 16px 10px',
        borderTop: '1px solid var(--line)',
        background: 'rgba(4,5,26,0.6)',
        display: 'flex', gap: 6, justifyContent: 'center',
      }}>
        {MAPS.map((m, i) => {
          const up = mapUnlocked(i, level);
          const on = i === selectedMap;
          return (
            <div key={i} onClick={() => setSelectedMap(i)} className="nx-clickable"
              style={{
                width: on ? 26 : 10, height: 10,
                borderRadius: 5,
                background: on ? m.color : up ? 'rgba(118,138,220,0.4)' : 'rgba(118,138,220,0.15)',
                boxShadow: on ? `0 0 8px ${m.color}` : 'none',
                transition: 'all 0.2s',
              }} />
          );
        })}
      </div>
      <NxTabBar active="maps" onNav={onNav} />
    </div>
  );
}
