'use client';
import { NxCard, NxBtn, NxTag, NxIcon } from '@/components/ui';
import { NxMobileHeader } from '@/components/layout/NxMobileHeader';
import { NxTabBar } from '@/components/layout/NxTabBar';
import { NxDesktopShell } from '@/components/layout/NxDesktopShell';
import { useT, useI18n, LANGS } from '@/contexts/I18nContext';
import { useApp } from '@/contexts/AppContext';
import type { Screen } from '@/types';

interface SettingsScreenProps {
  onNav: (s: Screen) => void;
  desktop?: boolean;
}

export function SettingsScreen({ onNav, desktop }: SettingsScreenProps) {
  const t = useT();
  const { lang, reverse, setLang, setReverse } = useI18n();
  const { user, username, logout, words, deleteWords, showResult, setShowResult } = useApp();

  const toggle = (on: boolean, onClick: () => void, color = 'var(--cyan)') => (
    <div onClick={onClick} style={{
      width: 50, height: 28, borderRadius: 14,
      background: on ? color : 'rgba(8,10,28,0.7)',
      border: `1px solid ${on ? color : 'var(--line)'}`,
      boxShadow: on ? `0 0 16px ${color}` : 'none',
      position: 'relative', cursor: 'pointer', flexShrink: 0,
      transition: 'all 0.2s',
    }}>
      <div style={{
        position: 'absolute', top: 2, left: on ? 24 : 2,
        width: 22, height: 22, borderRadius: '50%',
        background: 'var(--bg-0)',
        boxShadow: '0 0 8px rgba(0,0,0,0.5)',
        transition: 'left 0.2s',
      }} />
    </div>
  );

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
          {toggle(reverse, () => setReverse(!reverse), 'var(--mag)')}
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
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="nx-h" style={{ fontSize: 14, color: 'var(--cyan)' }}>{t('SHOW_RESULT_LABEL')}</div>
            <div className="nx-mono" style={{ marginTop: 4, color: 'var(--ink-soft)', fontSize: 11, lineHeight: 1.5 }}>
              {t('SHOW_RESULT_DESC')}
            </div>
          </div>
          {toggle(showResult, () => setShowResult(!showResult))}
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
          }}>{(username || user?.displayName || 'G')[0].toUpperCase()}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14 }}>{username || user?.displayName || 'ゲスト'}</div>
            <div className="nx-overline">{user?.email ?? 'guest mode'}</div>
          </div>
        </div>
        <div onClick={logout} className="nx-clickable"
          style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid var(--line)' }}>
          <NxIcon kind="back" size={16} color="var(--ink-soft)" />
          <span style={{ flex: 1 }}>{t('SIGN_OUT')}</span>
          <NxIcon kind="arrow" size={14} color="var(--ink-mute)" />
        </div>
        <div onClick={() => {
            if (words.length === 0) return;
            if (window.confirm(t('DELETE_CONFIRM'))) deleteWords(words.map(w => w.id));
          }}
          className="nx-clickable"
          style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10, opacity: words.length === 0 ? 0.4 : 1 }}>
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
      <NxDesktopShell active="settings" onNav={onNav} title={t('SETTINGS')} sub={t('SETTINGS_HEAD')}>
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
      <NxTabBar active="settings" onNav={onNav} />
    </div>
  );
}
