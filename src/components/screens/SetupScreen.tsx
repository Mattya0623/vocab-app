'use client';
import { useState } from 'react';
import { Constellation, NxCard, NxBtn, NxInput, NxIcon } from '@/components/ui';
import { useApp } from '@/contexts/AppContext';

export function SetupScreen() {
  const { saveUsername, user } = useApp();
  const [name, setName]       = useState(user?.displayName?.split(' ')[0] ?? '');
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = async () => {
    const trimmed = name.trim();
    if (!trimmed) { setError('アカウント名を入力してください'); return; }
    if (trimmed.length > 20) { setError('20文字以内で入力してください'); return; }
    setSaving(true);
    await saveUsername(trimmed);
  };

  return (
    <div style={{
      position: 'relative', height: '100%', overflow: 'hidden',
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
      alignItems: 'center', padding: 28,
    }}>
      <Constellation density={1.1} mode="tall" />
      <NxCard glow="cyan" bracket scan style={{
        position: 'relative', zIndex: 1,
        padding: 32, width: '100%', maxWidth: 360,
      }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(92,232,255,0.35) 0%, transparent 70%)',
            display: 'grid', placeItems: 'center', margin: '0 auto 14px',
          }}>
            <NxIcon kind="user" size={36} color="var(--cyan)" glow />
          </div>
          <div className="nx-h glow" style={{ fontSize: 20, letterSpacing: '0.14em' }}>
            ACCOUNT SETUP
          </div>
          <div className="nx-overline" style={{ marginTop: 6 }}>
            // アカウント名を決めてください
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <NxInput
            placeholder="例: Yamada（20文字以内）"
            value={name}
            onChange={e => { setName((e.target as HTMLInputElement).value); setError(''); }}
            onKeyDown={e => { if (e.key === 'Enter') handleSubmit(); }}
            maxLength={20}
            autoFocus
          />
          {error && (
            <div style={{ color: 'var(--red)', fontSize: 12, textAlign: 'center' }}>
              {error}
            </div>
          )}
          <NxBtn primary lg block onClick={handleSubmit} disabled={saving || !name.trim()}>
            {saving
              ? <><NxIcon kind="sparkle" size={16} /> 保存中…</>
              : '// START'}
          </NxBtn>
        </div>
      </NxCard>
    </div>
  );
}
