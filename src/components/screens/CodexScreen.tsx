'use client';
import { useState, useMemo } from 'react';
import { NxCard, NxBtn, NxTag, NxInput, NxIcon, NxProgress } from '@/components/ui';
import { NxMobileHeader } from '@/components/layout/NxMobileHeader';
import { NxTabBar } from '@/components/layout/NxTabBar';
import { NxDesktopShell } from '@/components/layout/NxDesktopShell';
import { useT } from '@/contexts/I18nContext';
import { useApp } from '@/contexts/AppContext';
import { NEBULAE, boxOf } from '@/data/nebulae';
import type { Screen, SortKey } from '@/types';

interface CodexScreenProps {
  onNav: (s: Screen) => void;
  desktop?: boolean;
}

export function CodexScreen({ onNav, desktop }: CodexScreenProps) {
  const t = useT();
  const { words, deleteWords } = useApp();
  const [sel, setSel] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<SortKey>('default');
  const [search, setSearch] = useState('');
  const [tagFilter, setTagFilter] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    words.forEach(w => w.tags?.forEach(tag => set.add(tag)));
    return [...set].sort();
  }, [words]);

  const toggle = (id: string) => {
    setSel(prev => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  };

  const toggleAll = () => {
    setSel(prev =>
      prev.size === sorted.length ? new Set() : new Set(sorted.map(w => w.id))
    );
  };

  const handleDelete = () => {
    deleteWords([...sel]);
    setSel(new Set());
  };

  const SORTS: [SortKey, string][] = [
    ['default',  t('SORT_DEFAULT')],
    ['acc_asc',  t('SORT_ACC_ASC')],
    ['acc_desc', t('SORT_ACC_DESC')],
    ['att_desc', t('SORT_ATT_DESC')],
    ['az',       t('SORT_AZ')],
  ];

  const sorted = useMemo(() => {
    let arr = [...words];
    if (tagFilter) arr = arr.filter(w => w.tags?.includes(tagFilter));
    if (search) arr = arr.filter(w =>
      w.word.toLowerCase().includes(search.toLowerCase()) || w.meaning.includes(search)
    );
    if (sortBy === 'acc_asc')  arr.sort((a, b) => a.accuracy - b.accuracy);
    else if (sortBy === 'acc_desc') arr.sort((a, b) => b.accuracy - a.accuracy);
    else if (sortBy === 'att_desc') arr.sort((a, b) => b.attempts - a.attempts);
    else if (sortBy === 'az')       arr.sort((a, b) => a.word.localeCompare(b.word));
    return arr;
  }, [words, sortBy, search, tagFilter]);

  const allSelected = sorted.length > 0 && sel.size === sorted.length;
  const totalAttempts = words.reduce((s, w) => s + w.attempts, 0);

  // Tag filter chips (shared between mobile/desktop)
  const tagBar = allTags.length > 0 ? (
    <div style={{ display: 'flex', gap: 5, overflowX: 'auto', paddingBottom: 2, scrollbarWidth: 'none' }}>
      <span onClick={() => setTagFilter(null)} className="nx-clickable" style={{ flexShrink: 0 }}>
        <NxTag cyan={tagFilter === null}>ALL</NxTag>
      </span>
      {allTags.map(tag => (
        <span key={tag} onClick={() => setTagFilter(tag)} className="nx-clickable" style={{ flexShrink: 0 }}>
          <NxTag cyan={tagFilter === tag}>{tag}</NxTag>
        </span>
      ))}
    </div>
  ) : null;

  if (desktop) {
    return (
      <NxDesktopShell active="list" onNav={onNav}
        title={t('CODEX_HEAD')}
        sub={`${sorted.length}${tagFilter ? ` / ${words.length}` : ''} ${t('ENTRIES')} · ${totalAttempts} ${t('ATTEMPTS_COL')}`}
        right={sel.size > 0 ? (
          <>
            <span className="nx-mono" style={{ color: 'var(--ink-soft)' }}>{sel.size} {t('SELECTED')}</span>
            <NxBtn ghost onClick={toggleAll}>{t('SELECT_ALL')}</NxBtn>
            <NxBtn red onClick={handleDelete}>
              <NxIcon kind="trash" size={14} /> {t('DELETE')}
            </NxBtn>
          </>
        ) : (
          <>
            <NxBtn onClick={() => onNav('import')}><NxIcon kind="upload" size={14} /> {t('IMPORT')}</NxBtn>
            <NxBtn primary><NxIcon kind="plus" size={14} /> {t('NEW_ENTRY')}</NxBtn>
          </>
        )}>
        <NxCard style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
          {/* Sort + search bar */}
          <div style={{ padding: '10px 18px', borderBottom: '1px solid var(--line)', background: 'rgba(28,34,80,0.4)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="nx-overline" style={{ whiteSpace: 'nowrap' }}>{t('SORT_BY')}:</span>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', flex: 1 }}>
              {SORTS.map(([k, label]) => (
                <span key={k} onClick={() => setSortBy(k)} className="nx-clickable">
                  <NxTag cyan={sortBy === k}>{label}</NxTag>
                </span>
              ))}
            </div>
            <NxInput
              placeholder={t('SEARCH_PH')}
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: 200, padding: '5px 10px', fontSize: 12 }}
            />
          </div>
          {/* Tag filter bar */}
          {tagBar && (
            <div style={{ padding: '8px 18px', borderBottom: '1px solid var(--line)', background: 'rgba(28,34,80,0.25)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="nx-overline" style={{ whiteSpace: 'nowrap', color: 'var(--ink-mute)' }}>TAG:</span>
              {tagBar}
            </div>
          )}
          {/* Column headers */}
          <div style={{ display: 'grid', gridTemplateColumns: '40px 1.6fr 1.6fr 110px 150px 80px', padding: '10px 18px', borderBottom: '1px solid var(--line)', background: 'rgba(28,34,80,0.4)', gap: 12, alignItems: 'center' }}>
            <div
              onClick={toggleAll}
              className="nx-clickable"
              style={{ width: 16, height: 16, border: `1px solid ${allSelected ? 'var(--cyan)' : 'var(--line)'}`, borderRadius: 3, background: allSelected ? 'var(--cyan)' : 'transparent', color: 'var(--bg-0)', display: 'grid', placeItems: 'center', fontSize: 10, fontWeight: 900, boxShadow: allSelected ? '0 0 8px var(--cyan)' : 'none' }}>
              {allSelected && '✓'}
            </div>
            <span className="nx-overline">{t('WORD_COL')}</span>
            <span className="nx-overline">{t('MEANING_COL')}</span>
            <span className="nx-overline">{t('NEBULA_COL')}</span>
            <span className="nx-overline">{t('ACCURACY_COL')}</span>
            <span className="nx-overline">{t('ATTEMPTS_COL')}</span>
          </div>
          {/* Rows */}
          <div style={{ flex: 1, overflow: 'auto' }}>
            {sorted.length === 0 && (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 16, textAlign: 'center' }}>
                <NxIcon kind="list" size={40} color="var(--ink-mute)" />
                <div>
                  <div className="nx-h" style={{ fontSize: 16, color: 'var(--ink-soft)' }}>
                    {tagFilter ? `「${tagFilter}」タグの単語がありません` : '単語がありません'}
                  </div>
                  <div className="nx-overline" style={{ marginTop: 4 }}>// CSVをインポートして銀河を起動してください</div>
                </div>
                {!tagFilter && (
                  <NxBtn primary onClick={() => onNav('import')}>
                    <NxIcon kind="upload" size={14} /> インポート
                  </NxBtn>
                )}
              </div>
            )}
            {sorted.map((w) => {
              const checked = sel.has(w.id);
              const b = NEBULAE[boxOf(w.accuracy) - 1];
              return (
                <div key={w.id} onClick={() => toggle(w.id)} className="nx-clickable"
                  style={{ display: 'grid', gridTemplateColumns: '40px 1.6fr 1.6fr 110px 150px 80px', padding: '10px 18px', gap: 12, alignItems: 'center', borderBottom: '1px solid rgba(118,138,220,0.1)', background: checked ? 'rgba(92,232,255,0.05)' : 'transparent', transition: 'background 0.15s' }}>
                  <div style={{ width: 16, height: 16, border: `1px solid ${checked ? 'var(--cyan)' : 'var(--line-bright)'}`, borderRadius: 3, background: checked ? 'var(--cyan)' : 'transparent', color: 'var(--bg-0)', display: 'grid', placeItems: 'center', fontSize: 10, fontWeight: 900, boxShadow: checked ? '0 0 8px var(--cyan)' : 'none' }}>
                    {checked && '✓'}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{w.word}</div>
                    {w.tags && w.tags.length > 0 && (
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 3 }}>
                        {w.tags.map(tag => (
                          <span key={tag} style={{
                            fontSize: 9, padding: '1px 5px', borderRadius: 3,
                            border: `1px solid ${tag === tagFilter ? 'var(--cyan)' : 'rgba(92,232,255,0.3)'}`,
                            color: tag === tagFilter ? 'var(--cyan)' : 'var(--ink-mute)',
                            background: tag === tagFilter ? 'rgba(92,232,255,0.1)' : 'transparent',
                            fontFamily: 'var(--mono)', letterSpacing: '0.05em',
                          }}>{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <span style={{ color: 'var(--ink-soft)', fontSize: 14 }}>{w.meaning}</span>
                  <span style={{ fontFamily: 'var(--display)', fontSize: 11, letterSpacing: '0.1em', color: b.color, textShadow: `0 0 6px ${b.color}88` }}>{b.name.toUpperCase()}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <NxProgress value={w.accuracy} thin style={{ flex: 1 }} />
                    <span className="nx-mono" style={{ minWidth: 32, textAlign: 'right', color: w.accuracy >= 75 ? 'var(--green)' : w.accuracy >= 40 ? 'var(--amber)' : 'var(--red)' }}>{w.accuracy}%</span>
                  </div>
                  <span className="nx-mono">{w.correct_answers}/{w.attempts}{w.avgResponseMs != null ? ` · ${(w.avgResponseMs / 1000).toFixed(1)}s` : ''}</span>
                </div>
              );
            })}
          </div>
        </NxCard>
      </NxDesktopShell>
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <NxMobileHeader
        title={`${t('CODEX')} · ${t('CODEX_SUB')}`}
        sub={`${sorted.length}${tagFilter ? `/${words.length}` : ''} ${t('ENTRIES')} · ${sel.size} ${t('SELECTED')}`}
        left={<NxIcon kind="search" size={18} color="var(--ink-soft)" />}
        right={<NxIcon kind="plus" size={18} color="var(--cyan)" glow />}
      />
      <div style={{ padding: '10px 16px 6px' }}>
        <NxInput placeholder={t('SEARCH_PH')} value={search} onChange={e => setSearch(e.target.value)} style={{ padding: '7px 10px', fontSize: 13 }} />
      </div>
      {tagBar && (
        <div style={{ padding: '0 16px 6px' }}>
          {tagBar}
        </div>
      )}
      <div style={{ padding: '0 16px 8px' }}>
        <div className="nx-overline" style={{ marginBottom: 4 }}>{t('SORT_BY')}</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {SORTS.map(([k, label]) => (
            <span key={k} onClick={() => setSortBy(k)} className="nx-clickable">
              <NxTag cyan={sortBy === k}>{label}</NxTag>
            </span>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'auto', borderTop: '1px solid var(--line)' }}>
        {sorted.length === 0 && (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 14, padding: 32, textAlign: 'center' }}>
            <NxIcon kind="list" size={36} color="var(--ink-mute)" />
            <div>
              <div className="nx-h" style={{ fontSize: 15, color: 'var(--ink-soft)' }}>
                {tagFilter ? `「${tagFilter}」タグの単語がありません` : '単語がありません'}
              </div>
              <div className="nx-overline" style={{ marginTop: 4 }}>// CSVをインポートして銀河を起動</div>
            </div>
            {!tagFilter && (
              <NxBtn primary onClick={() => onNav('import')}>
                <NxIcon kind="upload" size={14} /> インポート
              </NxBtn>
            )}
          </div>
        )}
        {sorted.map((w) => {
          const checked = sel.has(w.id);
          const b = NEBULAE[boxOf(w.accuracy) - 1];
          return (
            <div key={w.id} onClick={() => toggle(w.id)} className="nx-clickable"
              style={{ display: 'grid', gridTemplateColumns: '22px 1fr 60px 80px', gap: 10, alignItems: 'center', padding: '10px 16px', borderBottom: '1px solid rgba(118,138,220,0.12)', background: checked ? 'rgba(92,232,255,0.06)' : 'transparent' }}>
              <div style={{ width: 16, height: 16, borderRadius: 3, border: '1px solid ' + (checked ? 'var(--cyan)' : 'var(--line)'), background: checked ? 'var(--cyan)' : 'transparent', color: 'var(--bg-0)', display: 'grid', placeItems: 'center', fontSize: 10, fontWeight: 900, boxShadow: checked ? '0 0 10px var(--cyan)' : 'none' }}>
                {checked && '✓'}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, lineHeight: 1.1 }}>{w.word}</div>
                <div className="nx-overline" style={{ marginTop: 2, textTransform: 'none', letterSpacing: 0, color: 'var(--ink-soft)', fontSize: 11 }}>{w.meaning}</div>
                {w.tags && w.tags.length > 0 && (
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 4 }}>
                    {w.tags.map(tag => (
                      <span key={tag} style={{
                        fontSize: 9, padding: '1px 5px', borderRadius: 3,
                        border: `1px solid ${tag === tagFilter ? 'var(--cyan)' : 'rgba(92,232,255,0.25)'}`,
                        color: tag === tagFilter ? 'var(--cyan)' : 'var(--ink-mute)',
                        background: tag === tagFilter ? 'rgba(92,232,255,0.1)' : 'transparent',
                        fontFamily: 'var(--mono)',
                      }}>{tag}</span>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="nx-mono" style={{ color: w.accuracy >= 75 ? 'var(--green)' : w.accuracy >= 40 ? 'var(--amber)' : 'var(--red)' }}>{w.accuracy}%</div>
                <div className="nx-overline" style={{ fontSize: 9 }}>{w.correct_answers}/{w.attempts}{w.avgResponseMs != null ? ` · ${(w.avgResponseMs / 1000).toFixed(1)}s` : ''}</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <NxTag style={{ color: b.color, borderColor: b.color + '88', background: b.color + '15' }}>{b.name.toUpperCase()}</NxTag>
              </div>
            </div>
          );
        })}
      </div>
      {sel.size > 0 && (
        <div style={{ padding: '10px 16px', borderTop: '1px solid var(--line)', background: 'rgba(255,92,122,0.08)', display: 'flex', gap: 10, alignItems: 'center' }}>
          <span className="nx-mono" style={{ flex: 1 }}>{sel.size} {t('SELECTED')}</span>
          <NxBtn ghost style={{ padding: '5px 10px' }} onClick={toggleAll}>{t('SELECT_ALL')}</NxBtn>
          <NxBtn red style={{ padding: '5px 12px' }} onClick={handleDelete}>
            <NxIcon kind="trash" size={14} /> {t('DELETE')}
          </NxBtn>
        </div>
      )}
      <NxTabBar active="list" onNav={onNav} />
    </div>
  );
}
