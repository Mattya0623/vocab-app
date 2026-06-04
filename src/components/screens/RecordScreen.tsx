'use client';
import { useState } from 'react';
import { NxCard, NxIcon } from '@/components/ui';
import { NxMobileHeader } from '@/components/layout/NxMobileHeader';
import { NxTabBar } from '@/components/layout/NxTabBar';
import { NxDesktopShell } from '@/components/layout/NxDesktopShell';
import { useT } from '@/contexts/I18nContext';
import { useApp } from '@/contexts/AppContext';
import { getPrestige } from '@/lib/prestige';
import type { Screen, DayRecord } from '@/types';

interface RecordScreenProps {
  onNav: (s: Screen) => void;
  desktop?: boolean;
}

const WEEKDAYS_JA = ['月', '火', '水', '木', '金', '土', '日'];

function fmtYM(y: number, m: number) {
  return `${y}年${m + 1}月`;
}

function getDaysInMonth(y: number, m: number) {
  return new Date(y, m + 1, 0).getDate();
}

// Monday=0 offset for the first day of month
function getMonthStartOffset(y: number, m: number) {
  const dow = new Date(y, m, 1).getDay(); // 0=Sun
  return dow === 0 ? 6 : dow - 1;
}

function toKey(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

interface DayCellProps {
  day: number;
  record?: DayRecord;
  isToday: boolean;
  desktop: boolean;
}

function DayCell({ day, record, isToday, desktop }: DayCellProps) {
  const hasActivity = record && (record.answers > 0 || Object.keys(record.masters).length > 0);
  const masterEntries = record ? Object.entries(record.masters).filter(([, c]) => c > 0) : [];

  return (
    <div style={{
      borderRadius: 6,
      border: isToday
        ? '1px solid rgba(92,232,255,0.6)'
        : hasActivity
          ? '1px solid rgba(92,232,255,0.2)'
          : '1px solid rgba(118,138,220,0.12)',
      background: isToday ? 'rgba(92,232,255,0.06)' : hasActivity ? 'rgba(118,138,220,0.05)' : 'transparent',
      padding: desktop ? '6px 8px' : '4px 5px',
      minHeight: desktop ? 72 : 54,
      display: 'flex', flexDirection: 'column', gap: 3,
    }}>
      <div className="nx-mono" style={{
        fontSize: desktop ? 11 : 10,
        color: isToday ? 'var(--cyan)' : hasActivity ? 'var(--ink-soft)' : 'var(--ink-mute)',
        fontWeight: isToday ? 700 : undefined,
        textShadow: isToday ? '0 0 8px var(--cyan)' : undefined,
      }}>{day}</div>

      {record && record.answers > 0 && (
        <div className="nx-mono" style={{ fontSize: desktop ? 10 : 9, color: 'var(--cyan)' }}>
          📝 {record.answers}
        </div>
      )}

      {masterEntries.slice(0, desktop ? 3 : 2).map(([tag, count]) => {
        const totalClears = count; // clears on this day
        const p = getPrestige(1); // use gold as base for day display
        return (
          <div key={tag} className="nx-mono" style={{
            fontSize: desktop ? 9 : 8,
            color: p.color,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {p.emoji} {tag}{count > 1 ? ` ×${count}` : ''}
          </div>
        );
      })}
      {masterEntries.length > (desktop ? 3 : 2) && (
        <div className="nx-mono" style={{ fontSize: 8, color: 'var(--ink-mute)' }}>
          +{masterEntries.length - (desktop ? 3 : 2)}
        </div>
      )}
    </div>
  );
}

function MonthSummary({ log, y, m }: { log: Record<string, DayRecord>; y: number; m: number }) {
  let totalAnswers = 0;
  const tagClears: Record<string, number> = {};
  const days = getDaysInMonth(y, m);
  for (let d = 1; d <= days; d++) {
    const rec = log[toKey(y, m, d)];
    if (!rec) continue;
    totalAnswers += rec.answers;
    Object.entries(rec.masters).forEach(([tag, c]) => { tagClears[tag] = (tagClears[tag] ?? 0) + c; });
  }
  const masterEntries = Object.entries(tagClears).sort((a, b) => b[1] - a[1]);

  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
      <span className="nx-mono" style={{ fontSize: 11, color: 'var(--cyan)' }}>
        📝 {totalAnswers} 回答
      </span>
      {masterEntries.map(([tag, count]) => {
        const p = getPrestige(1);
        return (
          <span key={tag} className="nx-mono" style={{ fontSize: 10, color: p.color }}>
            {p.emoji} {tag} ×{count}
          </span>
        );
      })}
      {masterEntries.length === 0 && totalAnswers === 0 && (
        <span className="nx-overline" style={{ fontSize: 9, color: 'var(--ink-mute)' }}>この月のアクティビティなし</span>
      )}
    </div>
  );
}

export function RecordScreen({ onNav, desktop }: RecordScreenProps) {
  const t = useT();
  const { dailyLog, masteredTags } = useApp();
  const today = new Date();
  const [viewYear, setViewYear]   = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };

  const days      = getDaysInMonth(viewYear, viewMonth);
  const offset    = getMonthStartOffset(viewYear, viewMonth);
  const todayKey  = toKey(today.getFullYear(), today.getMonth(), today.getDate());

  const calendarContent = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: desktop ? 14 : 10 }}>
      {/* Month navigator */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div onClick={prevMonth} style={{ cursor: 'pointer', padding: 4 }}>
          <NxIcon kind="back" size={16} color="var(--ink-soft)" />
        </div>
        <div>
          <div className="nx-h" style={{ fontSize: desktop ? 18 : 15, textAlign: 'center', color: 'var(--cyan)' }}>
            {fmtYM(viewYear, viewMonth)}
          </div>
          <div style={{ marginTop: 4 }}>
            <MonthSummary log={dailyLog} y={viewYear} m={viewMonth} />
          </div>
        </div>
        <div onClick={nextMonth} style={{ cursor: 'pointer', padding: 4 }}>
          <NxIcon kind="arrow" size={16} color="var(--ink-soft)" />
        </div>
      </div>

      {/* Weekday header */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: desktop ? 6 : 4 }}>
        {WEEKDAYS_JA.map((d, i) => (
          <div key={d} className="nx-overline" style={{
            textAlign: 'center', fontSize: 9,
            color: i === 5 ? 'var(--cyan)' : i === 6 ? 'var(--red)' : 'var(--ink-mute)',
          }}>{d}</div>
        ))}
      </div>

      {/* Day cells */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: desktop ? 6 : 4 }}>
        {/* Offset empty cells */}
        {Array.from({ length: offset }).map((_, i) => <div key={`e${i}`} />)}
        {/* Day cells */}
        {Array.from({ length: days }).map((_, i) => {
          const d = i + 1;
          const key = toKey(viewYear, viewMonth, d);
          return (
            <DayCell
              key={key}
              day={d}
              record={dailyLog[key]}
              isToday={key === todayKey}
              desktop={!!desktop}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', paddingTop: 4, borderTop: '1px solid rgba(118,138,220,0.15)' }}>
        <span className="nx-overline" style={{ fontSize: 9, color: 'var(--ink-mute)' }}>
          📝 フラッシュカード回答数
        </span>
        <span className="nx-overline" style={{ fontSize: 9, color: 'var(--ink-mute)' }}>
          🏆 マスターモードクリア
        </span>
      </div>
    </div>
  );

  const title   = 'RECORD';
  const subText = `${Object.keys(masteredTags).length} MASTERED TAGS`;

  if (desktop) {
    return (
      <NxDesktopShell active="record" onNav={onNav} title={title} sub={subText}>
        <div style={{ height: '100%', overflow: 'auto' }}>
          <NxCard style={{ padding: 20 }}>
            {calendarContent}
          </NxCard>
        </div>
      </NxDesktopShell>
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <NxMobileHeader title={title} sub={subText}
        left={<div onClick={() => onNav('achieve')} style={{ cursor: 'pointer' }}><NxIcon kind="back" size={18} color="var(--ink-soft)" /></div>}
      />
      <div style={{ flex: 1, padding: '12px 16px', overflow: 'auto' }}>
        {calendarContent}
      </div>
      <NxTabBar active="record" onNav={onNav} />
    </div>
  );
}
