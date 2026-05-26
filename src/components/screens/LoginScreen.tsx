'use client';
import { Constellation, NxCard, NxBtn, NxIcon } from '@/components/ui';
import { useT } from '@/contexts/I18nContext';
import type { Screen } from '@/types';

interface LoginScreenProps {
  onNav: (s: Screen) => void;
  desktop?: boolean;
}

export function LoginScreen({ onNav, desktop }: LoginScreenProps) {
  const t = useT();

  if (desktop) {
    return (
      <div style={{ position: 'relative', height: '100%', display: 'grid', placeItems: 'center', overflow: 'hidden' }}>
        <Constellation density={1.4} mode="wide" />
        <NxCard glow="cyan" bracket scan style={{ position: 'relative', zIndex: 1, padding: 40, width: 460, textAlign: 'center' }}>
          <div style={{ width: 96, height: 96, margin: '0 auto', borderRadius: '50%', background: 'radial-gradient(circle, rgba(92,232,255,0.4) 0%, transparent 70%)', display: 'grid', placeItems: 'center' }}>
            <NxIcon kind="sparkle" size={52} color="var(--cyan)" glow />
          </div>
          <div className="nx-h glow" style={{ fontSize: 56, letterSpacing: '0.18em', marginTop: 14 }}>VOCAB</div>
          <div className="nx-overline" style={{ marginTop: 4 }}>// LEXICON ⋅ CONSTELLATION ⋅ β</div>
          <div style={{ marginTop: 22, fontSize: 16, lineHeight: 1.5 }}>
            {t('TAGLINE_1')}<br /><span style={{ color: 'var(--mag)' }}>{t('TAGLINE_2')}</span>
          </div>
          <div style={{ marginTop: 26, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <NxBtn primary lg block onClick={() => onNav('maps')}>
              <NxIcon kind="google" size={18} /> {t('LOGIN_GOOGLE')}
            </NxBtn>
            <NxBtn ghost block onClick={() => onNav('maps')}>{t('LOGIN_GUEST')}</NxBtn>
          </div>
          <div className="nx-overline" style={{ marginTop: 18, fontSize: 9 }}>{t('LOGIN_FINE')}</div>
        </NxCard>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 28, gap: 18 }}>
      <Constellation density={1.1} mode="tall" />
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
        <div style={{ position: 'relative' }}>
          <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'radial-gradient(circle, rgba(92,232,255,0.4) 0%, rgba(92,232,255,0) 70%)', display: 'grid', placeItems: 'center', position: 'relative' }}>
            <NxIcon kind="sparkle" size={56} color="var(--cyan)" glow />
            <div className="nx-pulse" />
          </div>
        </div>
        <div>
          <div className="nx-h glow" style={{ fontSize: 56, letterSpacing: '0.18em', color: 'var(--cyan)', lineHeight: 1 }}>VOCAB</div>
          <div className="nx-overline" style={{ marginTop: 6, color: 'var(--ink-soft)' }}>// LEXICON ⋅ CONSTELLATION ⋅ β</div>
        </div>
        <NxCard glow="cyan" style={{ padding: 16, maxWidth: 320 }}>
          <div style={{ fontSize: 17, lineHeight: 1.5 }}>
            {t('TAGLINE_1')}<br /><span style={{ color: 'var(--mag)' }}>{t('TAGLINE_2')}</span>
          </div>
        </NxCard>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 320 }}>
          <NxBtn primary lg block onClick={() => onNav('maps')}>
            <NxIcon kind="google" size={18} /> {t('LOGIN_GOOGLE')}
          </NxBtn>
          <NxBtn ghost block onClick={() => onNav('maps')}>{t('LOGIN_GUEST')}</NxBtn>
        </div>
        <div className="nx-overline" style={{ fontSize: 9, color: 'var(--ink-mute)' }}>{t('LOGIN_FINE')}</div>
      </div>
    </div>
  );
}
