'use client';
import { NxCard, NxBtn, NxTag, NxIcon } from '@/components/ui';
import { NxMobileHeader } from '@/components/layout/NxMobileHeader';
import { NxTabBar } from '@/components/layout/NxTabBar';
import { NxDesktopShell } from '@/components/layout/NxDesktopShell';
import { useT, useI18n, LANGS } from '@/contexts/I18nContext';
import type { Screen } from '@/types';

interface SettingsScreenProps {
  onNav: (s: Screen) => void;
  desktop?: boolean;
}

export function SettingsScreen({ onNav, desktop }: SettingsScreenProps) {
  const t = useT();
  const { lang, reverse, setLang, setReverse } = useI18n();

  const studySection = (
    <div>
      <div className="nx-overline" style={{ marginBottom: 6 }}>// {t('STUDY_SECTION')}</div>
      <NxCard glow="cyan" bracket style={{ padding: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="nx-h" style={{ fontSize: 14, color: 'var(--cyan)' }}>{t('REVERSE_LABEL')}</div>
            <div className="nx-mono" style={{ marginTop: 4, color: 'var(--ink-soft)', fontSize: 11, lineHeight: 1.5 }}>
              {t('REVERSE_DESC')}
            </div>
          </div>
          <div onClick={() => setReverse(!reverse)}
            style={{
              width: 50, height: 28, borderRadius: 14,
              background: reverse ? 'var(--mag)' : 'rgba(8,10,28,0.7)',
              border: '1px solid ' + (reverse ? 'var(--mag)' : 'var(--line)'),
              boxShadow: reverse ? '0 0 16px var(--mag)' : 'none',
              position: 'relative', cursor: 'pointer', flexShrink: 0,
              transition: 'all 0.2s',
            }}>
            <div style={{
              position: 'absolute', top: 2, left: reverse ? 24 : 2,
              width: 22, height: 22, borderRadius: '50%',
              background: 'var(--bg-0)',
              boxShadow: '0 0 8px rgba(0,0,0,0.5)',
              transition: 'left 0.2s',
            }} />
          </div>
        </div>
        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px',
          background: 'rgba(8,10,28,0.5)', borderRadius: 8, border: '1px solid var(--line)' }}>
          <NxTag cyan>{reverse ? 'JA' : 'EN'}</NxTag>
          <NxIcon kind="arrow" size={14} color="var(--mag)" />
          <NxTag mag>{reverse ? 'EN' : 'JA'}</NxTag>
          <span className="nx-mono" style={{ marginLeft: 'auto', fontSize: 10 }}>
            {reverse ? t('REVERSE_ARROW_ON') : t('REVERSE_ARROW')}
          </span>
        </div>
      </NxCard>
    </div>
  );

  const langSection = (
    <div>
      <div className="nx-overline" style={{ marginBottom: 6 }}>// {t('LANG_SECTION')}</div>
      <NxCard glow="mag" bracket="mag" style={{ padding: 14 }}>
        <div className="nx-h mag-glow" style={{ fontSize: 14, color: 'var(--mag)' }}>{t('LANG_LABEL')}</div>
        <div className="nx-mono" style={{ marginTop: 4, marginBottom: 10, color: 'var(--ink-soft)', fontSize: 11, lineHeight: 1.5 }}>
          {t('LANG_DESC')}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {LANGS.map(L => {
            const on = lang === L.value;
            return (
              <div key={L.value} onClick={() => setLang(L.value)} className="nx-clickable"
                style={{
                  padding: '12px 10px', borderRadius: 8, textAlign: 'center',
                  border: '1px solid ' + (on ? 'var(--mag)' : 'var(--line)'),
                  background: on ? 'rgba(255,92,224,0.10)' : 'rgba(8,10,28,0.4)',
                  boxShadow: on ? '0 0 18px -6px var(--mag)' : 'none',
                }}>
                <div className="nx-h" style={{ fontSize: 11, color: on ? 'var(--mag)' : 'var(--ink-soft)' }}>{L.short}</div>
                <div style={{ marginTop: 4, fontSize: 14, color: on ? 'var(--ink)' : 'var(--ink-soft)' }}>{L.label}</div>
              </div>
            );
          })}
        </div>
      </NxCard>
    </div>
  );

  const accountSection = (
    <div>
      <div className="nx-overline" style={{ marginBottom: 6 }}>// {t('ACCOUNT_SECTION')}</div>
      <NxCard style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--line)' }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--cyan), var(--mag))',
            display: 'grid', placeItems: 'center',
            color: 'var(--bg-0)', fontFamily: 'var(--display)', fontWeight: 900,
          }}>Y</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14 }}>Yamada</div>
            <div className="nx-overline">yamada@gmail.com</div>
          </div>
        </div>
        <div onClick={() => onNav('login')} className="nx-clickable"
          style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid var(--line)' }}>
          <NxIcon kind="back" size={16} color="var(--ink-soft)" />
          <span style={{ flex: 1 }}>{t('SIGN_OUT')}</span>
          <NxIcon kind="arrow" size={14} color="var(--ink-mute)" />
        </div>
        <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <NxIcon kind="trash" size={16} color="var(--red)" />
          <div style={{ flex: 1 }}>
            <div style={{ color: 'var(--red)', fontSize: 14 }}>{t('DELETE_DATA')}</div>
            <div className="nx-overline" style={{ fontSize: 9 }}>{t('DANGER_DESC')}</div>
          </div>
        </div>
      </NxCard>
    </div>
  );

  if (desktop) {
    return (
      <NxDesktopShell active="stats" onNav={onNav} title={t('SETTINGS')} sub={t('SETTINGS_HEAD')}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignContent: 'start' }}>
          {studySection}
          {langSection}
          <div style={{ gridColumn: '1 / 3' }}>{accountSection}</div>
          <div className="nx-overline" style={{ gridColumn: '1 / 3', textAlign: 'center', fontSize: 9, color: 'var(--ink-mute)' }}>
            VOCAB β · v0.2.0 · 2026-05
          </div>
        </div>
      </NxDesktopShell>
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <NxMobileHeader title={t('SETTINGS')} sub={t('SETTINGS_HEAD')}
        left={<div onClick={() => onNav('home')} style={{ cursor: 'pointer' }}>
          <NxIcon kind="back" size={18} color="var(--ink-soft)" />
        </div>} />
      <div style={{ flex: 1, padding: 16, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {studySection}
        {langSection}
        {accountSection}
        <div className="nx-overline" style={{ textAlign: 'center', fontSize: 9, color: 'var(--ink-mute)' }}>
          VOCAB β · v0.2.0 · 2026-05
        </div>
      </div>
      <NxTabBar active="stats" onNav={onNav} />
    </div>
  );
}
