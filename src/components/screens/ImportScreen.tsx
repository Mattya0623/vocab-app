'use client';
import { useState } from 'react';
import { NxCard, NxBtn, NxTag, NxInput, NxIcon } from '@/components/ui';
import { NxMobileHeader } from '@/components/layout/NxMobileHeader';
import { NxTabBar } from '@/components/layout/NxTabBar';
import { NxDesktopShell } from '@/components/layout/NxDesktopShell';
import { useT } from '@/contexts/I18nContext';
import { useApp } from '@/contexts/AppContext';
import type { Screen, Word } from '@/types';

const DEFAULT_CSV = '';

function parseCSV(text: string): Omit<Word, 'id'>[] {
  return text.split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => {
      const [word, meaning] = line.split(',').map(s => s.trim());
      if (!word || !meaning) return null;
      return { word, meaning, attempts: 0, correct_answers: 0, accuracy: 0 };
    })
    .filter((w): w is Omit<Word, 'id'> => w !== null);
}

interface ImportScreenProps {
  onNav: (s: Screen) => void;
  desktop?: boolean;
}

export function ImportScreen({ onNav, desktop }: ImportScreenProps) {
  const t = useT();
  const { addWords } = useApp();
  const [csv, setCsv] = useState(DEFAULT_CSV);
  const preview = parseCSV(csv);

  const handleAdd = () => {
    addWords(preview);
    onNav('list');
  };

  const importForm = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, height: desktop ? '100%' : undefined }}>
      <NxCard style={{ padding: desktop ? 20 : 14, display: 'flex', alignItems: 'center', gap: 16, borderStyle: 'dashed' }}>
        <NxIcon kind="upload" size={desktop ? 36 : 28} color="var(--cyan)" glow />
        <div style={{ flex: 1 }}>
          <div className="nx-h glow" style={{ fontSize: desktop ? 15 : 14, color: 'var(--cyan)' }}>{t('DROP_FILE')}</div>
          <div className="nx-overline" style={{ marginTop: 2 }}>.csv / .tsv / .txt — UTF-8</div>
        </div>
        <NxBtn>{t('BROWSE')}</NxBtn>
      </NxCard>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div className="nx-divider" style={{ flex: 1 }} />
        <span className="nx-overline">{t('OR_PASTE_BELOW')}</span>
        <div className="nx-divider" style={{ flex: 1 }} />
      </div>
      <NxInput area value={csv} onChange={e => setCsv(e.target.value)} style={{ flex: desktop ? '1' : undefined }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span className="nx-overline">{t('DELIMITER')}</span>
        <NxTag cyan>{t('COMMA')}</NxTag>
        <NxTag>{t('TAB')}</NxTag>
        <NxTag>{t('NEWLINE')}</NxTag>
        <span style={{ flex: 1, textAlign: 'right' }} className="nx-mono">{t('AUTO_COMMA')}</span>
      </div>
    </div>
  );

  const previewPanel = (
    <NxCard glow="cyan" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0, flex: desktop ? 1 : undefined }}>
      <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between' }}>
        <span className="nx-h glow" style={{ fontSize: 13, color: 'var(--cyan)' }}>{t('PREVIEW')}</span>
        <span className="nx-mono">{preview.length} NEW · 0 DUPE</span>
      </div>
      <div style={{ flex: 1, overflow: 'auto' }}>
        {preview.map((w, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr 70px', padding: '10px 18px', gap: 12, borderBottom: '1px solid rgba(118,138,220,0.1)', alignItems: 'center' }}>
            <span style={{ fontWeight: 600 }}>{w.word}</span>
            <span style={{ color: 'var(--ink-soft)' }}>{w.meaning}</span>
            <NxTag green>NEW</NxTag>
          </div>
        ))}
      </div>
      <div style={{ padding: 14, borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(28,34,80,0.4)' }}>
        <span className="nx-overline">{preview.length} 単語を追加 · 既存は影響しません</span>
        <NxBtn primary lg onClick={handleAdd}>{t('ADD_ACTION')}</NxBtn>
      </div>
    </NxCard>
  );

  if (desktop) {
    return (
      <NxDesktopShell active="import" onNav={onNav} title="IMPORT · 単語追加" sub="CSV · TSV · TEXT · UTF-8">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, height: '100%' }}>
          {importForm}
          {previewPanel}
        </div>
      </NxDesktopShell>
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <NxMobileHeader title="IMPORT" sub="CSV · TSV · TEXT" left={<div onClick={() => onNav('list')} style={{ cursor: 'pointer' }}><NxIcon kind="back" size={18} color="var(--ink-soft)" /></div>} />
      <div style={{ flex: 1, padding: 16, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {importForm}
        <NxCard glow="cyan" style={{ padding: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span className="nx-h glow" style={{ fontSize: 12, color: 'var(--cyan)' }}>{t('PREVIEW')}</span>
            <span className="nx-mono">{preview.length} NEW · 0 DUPE</span>
          </div>
          <div className="nx-divider" style={{ margin: '6px 0' }} />
          {preview.slice(0, 3).map((w, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, fontSize: 12, padding: '2px 0' }}>
              <span style={{ flex: 1, fontWeight: 600 }}>{w.word}</span>
              <span style={{ color: 'var(--ink-soft)' }}>{w.meaning}</span>
            </div>
          ))}
          {preview.length > 3 && <div className="nx-overline" style={{ marginTop: 4 }}>+ {preview.length - 3} more…</div>}
        </NxCard>
      </div>
      <div style={{ padding: 14, borderTop: '1px solid var(--line)', display: 'flex', gap: 10 }}>
        <NxBtn block ghost onClick={() => onNav('list')}>{t('CANCEL')}</NxBtn>
        <NxBtn primary lg block onClick={handleAdd}>+{preview.length} を追加 →</NxBtn>
      </div>
    </div>
  );
}
