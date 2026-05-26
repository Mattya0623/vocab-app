'use client';
import { NxCard, NxBtn, NxTag, NxProgress, NxIcon } from '@/components/ui';
import { NxMobileHeader } from '@/components/layout/NxMobileHeader';
import { useT } from '@/contexts/I18nContext';
import type { Screen } from '@/types';

interface ResultScreenProps {
  ok: boolean;
  onNav: (s: Screen) => void;
  onNext: () => void;
  onExit?: () => void;
  sessionLabel?: string | null;
}

export function ResultScreen({ ok, onNav, onNext, onExit, sessionLabel }: ResultScreenProps) {
  const t = useT();

  return (
    <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <NxMobileHeader
        title={ok ? t('RESULT_OK_TITLE') : t('RESULT_NG_TITLE')}
        sub={sessionLabel || (ok ? '+1 XP · STREAK 5' : t('STREAK_RESET'))}
        glowColor={ok ? 'cyan' : 'mag'}
        left={onExit && <div onClick={onExit} style={{ cursor: 'pointer' }}><NxIcon kind="back" size={18} color="var(--ink-soft)" /></div>}
        right={onExit && <NxBtn ghost style={{ padding: '3px 8px', fontSize: 10 }} onClick={onExit}>{t('EXIT_SESSION')}</NxBtn>}
      />
      <div style={{ flex: 1, padding: 18, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 18 }}>
        <div style={{ textAlign: 'center', position: 'relative' }}>
          <div style={{
            width: 110, height: 110, margin: '0 auto', borderRadius: '50%',
            background: `radial-gradient(circle, ${ok ? 'rgba(92,255,157,0.35)' : 'rgba(255,92,122,0.35)'} 0%, transparent 70%)`,
            display: 'grid', placeItems: 'center', position: 'relative',
          }}>
            <div style={{
              width: 78, height: 78, borderRadius: '50%',
              border: `1.4px solid ${ok ? 'var(--green)' : 'var(--red)'}`,
              display: 'grid', placeItems: 'center',
              boxShadow: `0 0 30px ${ok ? 'var(--green)' : 'var(--red)'}`,
            }}>
              <NxIcon kind={ok ? 'check' : 'x'} size={42} color={ok ? 'var(--green)' : 'var(--red)'} glow />
            </div>
            {ok && <div className="nx-pulse" style={{ borderColor: 'var(--green)' }} />}
          </div>
          <div className="nx-h" style={{
            fontSize: 28, marginTop: 18,
            color: ok ? 'var(--green)' : 'var(--red)',
            textShadow: `0 0 16px ${ok ? 'rgba(92,255,157,0.6)' : 'rgba(255,92,122,0.5)'}`,
          }}>{ok ? t('RESULT_OK_LINE') : t('RESULT_NG_LINE')}</div>
          <div className="nx-overline" style={{ marginTop: 4 }}>{ok ? t('SIGNAL_LOCKED') : t('SIGNAL_LOST')}</div>
        </div>

        {ok ? (
          <>
            <NxCard bracket="amber" style={{ padding: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div className="nx-h glow" style={{ fontSize: 26 }}>apple</div>
                <NxTag amber>POLARIS · N6</NxTag>
              </div>
              <div style={{ marginTop: 6, fontSize: 16 }}>= りんご</div>
              <div className="nx-divider" style={{ margin: '10px 0' }} />
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <NxTag green>ACC 92% ▲</NxTag>
                <NxTag>ATT 13</NxTag>
                <NxTag cyan>+1 XP</NxTag>
              </div>
            </NxCard>
            <div style={{ textAlign: 'center', color: 'var(--amber)' }}>
              <span className="nx-mono" style={{ fontSize: 14, letterSpacing: '0.08em' }}>▲ 5 {t('STREAK')} · {t('NEXT_MILESTONE')}</span>
              <NxProgress value={50} amber style={{ marginTop: 8 }} />
            </div>
          </>
        ) : (
          <NxCard glow="red" style={{ padding: 14 }}>
            <div className="nx-h" style={{ fontSize: 24 }}>meticulous</div>
            <div className="nx-mono" style={{ marginTop: 4 }}>{t('YOUR_ANSWER')} · 不明瞭にする</div>
            <div className="nx-divider" style={{ margin: '10px 0' }} />
            <div className="nx-overline">{t('CORRECT_MEANING')}</div>
            <div style={{ fontSize: 22, marginTop: 4, color: 'var(--cyan)', textShadow: '0 0 12px rgba(92,232,255,0.5)' }}>
              几帳面な
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
              <NxTag red>ACC 33% ▼</NxTag>
              <NxTag>ATT 9</NxTag>
              <NxTag mag>ALTAIR · N2</NxTag>
            </div>
          </NxCard>
        )}
      </div>
      <div style={{ padding: 14, borderTop: '1px solid var(--line)', background: 'rgba(4,5,26,0.6)', display: 'flex', gap: 10 }}>
        {!ok && <NxBtn block ghost>{t('RETRY')}</NxBtn>}
        <NxBtn primary lg block onClick={onNext}>{t('NEXT')} → <NxIcon kind="arrow" size={16} /></NxBtn>
      </div>
    </div>
  );
}
