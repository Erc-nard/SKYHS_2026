import { useGameStore } from '../store/gameStore'
import { CHARACTERS, SCENARIOS } from '../data/gameContent'

export default function SelectScreen() {
  const char      = useGameStore(s => s.char)
  const scenario  = useGameStore(s => s.scenario)
  const actions   = useGameStore(s => s.actions)

  const selCharName  = CHARACTERS.find(c => c.id === char)?.name  || ''
  const selScenName  = SCENARIOS.find(s => s.id === scenario)?.name || ''

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '54px 24px 40px', animation: 'fadeIn .4s ease' }}>
      {/* 뒤로가기 */}
      <button
        onClick={actions.restart}
        style={{ position: 'fixed', top: '20px', left: '20px', display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '10px', background: 'rgba(30,35,43,.06)', border: '1px solid #e4e7ec', color: '#707a88', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'background .15s, color .15s', zIndex: 100 }}
        onMouseOver={e => { e.currentTarget.style.background = '#1e232b'; e.currentTarget.style.color = '#fff' }}
        onMouseOut={e => { e.currentTarget.style.background = 'rgba(30,35,43,.06)'; e.currentTarget.style.color = '#707a88' }}
      >
        ← 처음으로
      </button>

      <div style={{ width: '920px', maxWidth: '100%' }}>
        <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '12px', letterSpacing: '.16em', color: '#9099a6', textTransform: 'uppercase' }}>Step 1 · 의뢰 선택</div>
        <h1 style={{ fontSize: '28px', fontWeight: 700, margin: '8px 0 4px' }}>누구의, 어떤 패닉을 다룰까요?</h1>
        <p style={{ fontSize: '14px', color: '#707a88', margin: '0 0 26px' }}>
          데모에서는 <b style={{ color: '#1e232b' }}>김불안 · 22년 거래소 파산</b> 한 판을 끝까지 플레이할 수 있어요. 나머지는 곧 공개됩니다.
        </p>

        {/* Characters */}
        <div style={{ fontSize: '13px', fontWeight: 600, color: '#707a88', marginBottom: '12px' }}>투자자 (페르소나)</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginBottom: '34px' }}>
          {CHARACTERS.map(c => {
            const active = char === c.id && !c.locked
            return (
              <button
                key={c.id}
                onClick={() => !c.locked && actions.selChar(c.id)}
                style={{
                  position: 'relative', textAlign: 'left', padding: '18px', borderRadius: '16px',
                  background: '#fff', border: `1.5px solid ${active ? '#1e232b' : '#e4e7ec'}`,
                  opacity: c.locked ? 0.5 : 1,
                  boxShadow: active ? '0 4px 16px rgba(20,30,50,.10)' : '0 1px 3px rgba(20,30,50,.04)',
                  transition: 'transform .15s,border-color .15s,box-shadow .15s',
                  cursor: c.locked ? 'default' : 'pointer',
                }}
                onMouseOver={e => { if (!c.locked) e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseOut={e => { e.currentTarget.style.transform = '' }}
              >
                <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: c.hue, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '5px', marginBottom: '13px' }}>
                  <div style={{ display: 'flex', gap: '7px' }}>
                    <div style={{ width: '5px', height: '6px', background: '#fff', borderRadius: '50%' }} />
                    <div style={{ width: '5px', height: '6px', background: '#fff', borderRadius: '50%' }} />
                  </div>
                  <div style={{ width: '13px', height: '5px', borderTop: '2px solid #fff', borderRadius: '13px 13px 0 0' }} />
                </div>
                <div style={{ fontSize: '16px', fontWeight: 700 }}>{c.name}</div>
                <div style={{ display: 'inline-block', margin: '6px 0 9px', padding: '2px 8px', borderRadius: '20px', background: 'rgba(30,35,43,.06)', fontSize: '11px', fontWeight: 600, color: '#5b6470' }}>
                  약점 · {c.weak}
                </div>
                <div style={{ fontSize: '12.5px', color: '#707a88', lineHeight: 1.5 }}>{c.desc}</div>
                <div style={{ fontSize: '12px', color: '#1e232b', marginTop: '8px', fontWeight: 600 }}>공략 — {c.tip}</div>
                {c.locked && (
                  <div style={{ position: 'absolute', top: '14px', right: '14px', fontFamily: "'IBM Plex Mono',monospace", fontSize: '10px', letterSpacing: '.05em', color: '#aab0ba', background: '#fff', border: '1px solid #e4e7ec', borderRadius: '20px', padding: '3px 8px' }}>SOON</div>
                )}
              </button>
            )
          })}
        </div>

        {/* Scenarios */}
        <div style={{ fontSize: '13px', fontWeight: 600, color: '#707a88', marginBottom: '12px' }}>시나리오 (실제 사건)</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginBottom: '36px' }}>
          {SCENARIOS.map(s => {
            const active = scenario === s.id && !s.locked
            return (
              <button
                key={s.id}
                onClick={() => !s.locked && actions.selScen(s.id)}
                style={{
                  position: 'relative', textAlign: 'left', padding: '16px', borderRadius: '14px',
                  background: '#fff', border: `1.5px solid ${active ? '#1e232b' : '#e4e7ec'}`,
                  opacity: s.locked ? 0.5 : 1,
                  transition: 'transform .15s',
                  cursor: s.locked ? 'default' : 'pointer',
                }}
                onMouseOver={e => { if (!s.locked) e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseOut={e => { e.currentTarget.style.transform = '' }}
              >
                <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '11px', color: '#9099a6' }}>감정축 · {s.axis}</div>
                <div style={{ fontSize: '14.5px', fontWeight: 700, margin: '5px 0 7px' }}>{s.name}</div>
                <div style={{ fontSize: '12px', color: '#707a88', lineHeight: 1.5 }}>{s.note}</div>
                {s.locked && (
                  <div style={{ position: 'absolute', top: '13px', right: '13px', fontFamily: "'IBM Plex Mono',monospace", fontSize: '10px', color: '#aab0ba', background: '#fff', border: '1px solid #e4e7ec', borderRadius: '20px', padding: '3px 8px' }}>SOON</div>
                )}
              </button>
            )
          })}
        </div>

        {/* Start bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', border: '1px solid #e4e7ec', borderRadius: '16px', padding: '18px 22px', boxShadow: '0 1px 3px rgba(20,30,50,.05)' }}>
          <div>
            <div style={{ fontSize: '12px', color: '#9099a6' }}>선택된 의뢰</div>
            <div style={{ fontSize: '16px', fontWeight: 700, marginTop: '3px' }}>{selCharName} &nbsp;·&nbsp; {selScenName}</div>
          </div>
          <button
            onClick={actions.startGame}
            style={{ padding: '15px 30px', borderRadius: '12px', background: '#1e232b', color: '#fff', fontSize: '15px', fontWeight: 600, transition: 'background .15s,transform .15s', cursor: 'pointer', border: 'none', fontFamily: 'inherit' }}
            onMouseOver={e => { e.currentTarget.style.background = '#2c333f'; e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseOut={e => { e.currentTarget.style.background = '#1e232b'; e.currentTarget.style.transform = '' }}
          >
            상담 시작 &nbsp;→
          </button>
        </div>
      </div>
    </div>
  )
}
