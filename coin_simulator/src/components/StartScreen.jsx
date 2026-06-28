import { useGameStore } from '../store/gameStore'

const DOGE_PTS = [65, 77, 86, 121, 228, 467, 513, 395, 388, 295]
const D_MIN = Math.min(...DOGE_PTS), D_MAX = Math.max(...DOGE_PTS)
const CW = 160, CH = 56
const D_COORDS = DOGE_PTS.map((v, i) => {
  const x = (i / (DOGE_PTS.length - 1)) * CW
  const y = CH - ((v - D_MIN) / (D_MAX - D_MIN)) * (CH - 4) - 2
  return `${x.toFixed(1)},${y.toFixed(1)}`
})
const D_LINE = `M${D_COORDS.join('L')}`
const D_AREA = `${D_LINE}L${CW},${CH}L0,${CH}Z`

export default function StartScreen() {
  const receive = useGameStore(s => s.actions.receive)

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f4f6f9',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
      fontFamily: 'Pretendard, system-ui, sans-serif',
      animation: 'fadeIn .4s ease',
    }}>

      {/* 상단 레이블 */}
      <div style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: '11px', letterSpacing: '.18em', color: '#9099a6',
        textTransform: 'uppercase', marginBottom: '36px',
      }}>
        Coin Emotion Game &nbsp;·&nbsp; 투자 감정 시뮬레이터
      </div>

      {/* 폰 목업 */}
      <div style={{
        width: '210px', height: '400px',
        borderRadius: '36px',
        background: '#1e232b',
        boxShadow: '0 24px 60px rgba(20,30,50,.18), 0 2px 8px rgba(20,30,50,.08)',
        padding: '3px',
        marginBottom: '36px',
        position: 'relative',
      }}>
        {/* 내부 스크린 */}
        <div style={{
          width: '100%', height: '100%',
          borderRadius: '33px',
          background: '#fff',
          overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
        }}>
          {/* 노치 */}
          <div style={{
            flexShrink: 0,
            height: '28px',
            background: '#1e232b',
            borderRadius: '0 0 18px 18px',
            margin: '0 auto',
            width: '72px',
          }} />

          <div style={{ flex: 1, padding: '12px 16px 16px', display: 'flex', flexDirection: 'column' }}>

            {/* 상태바 */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: '16px',
            }}>
              <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '9px', color: '#9099a6' }}>9:41</span>
              <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '9px', color: '#9099a6' }}>● ●</span>
            </div>

            {/* 발신자 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{
                width: '60px', height: '60px', borderRadius: '50%',
                background: '#f4f6f9',
                border: '2px solid #e4e7ec',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '26px', marginBottom: '8px',
              }}>
                😰
              </div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e232b' }}>김불안</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '3px' }}>
                <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#d65a4e', animation: 'pulseGrow 1.4s ease-in-out infinite' }} />
                <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '9px', color: '#9099a6' }}>패닉 중...</span>
              </div>
            </div>

            {/* 미니 차트 */}
            <div style={{
              background: '#f4f6f9', borderRadius: '10px',
              border: '1px solid #e4e7ec',
              padding: '8px 10px', marginBottom: '14px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '8px', color: '#9099a6' }}>COIN/KRW</span>
                <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '9px', fontWeight: 700, color: '#d65a4e' }}>-42%</span>
              </div>
              <svg viewBox={`0 0 ${CW} ${CH}`} style={{ width: '100%', height: '44px', display: 'block' }}>
                <defs>
                  <linearGradient id="sGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1e232b" stopOpacity="0.08" />
                    <stop offset="100%" stopColor="#1e232b" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={D_AREA} fill="url(#sGrad)" />
                <path d={D_LINE} fill="none" stroke="#1e232b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* 수신 버튼 */}
            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginTop: 'auto' }}>
              {/* 거절 (비활성) */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '50%',
                  background: '#f0f2f5', border: '1px solid #e4e7ec',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M17.48 12.57l-2.3 2.3c-.3.3-.74.4-1.12.24a15.1 15.1 0 01-4.5-3.17 15.1 15.1 0 01-3.17-4.5.98.98 0 01.24-1.12l2.3-2.3c.39-.38.39-1.02 0-1.41L6.7 1.22a1 1 0 00-1.41 0l-2.3 2.3C1.97 4.53 1.7 6 2.13 7.4a22.1 22.1 0 005.27 8.62 22.1 22.1 0 008.62 5.27c1.4.43 2.87.16 3.88-.85l2.3-2.3a1 1 0 000-1.41l-2.3-2.3a1 1 0 00-1.42-.06z" fill="#c8cdd4"/>
                    <line x1="3" y1="3" x2="21" y2="21" stroke="#c8cdd4" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <span style={{ fontSize: '9px', color: '#aab0ba' }}>거절</span>
              </div>

              {/* 수신 (CTA) */}
              <button
                onClick={receive}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px',
                  background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                }}
              >
                <div style={{
                  width: '52px', height: '52px', borderRadius: '50%',
                  background: '#2f9e6f',
                  boxShadow: '0 4px 16px rgba(47,158,111,.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'transform .15s, box-shadow .15s',
                }}
                onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(47,158,111,.4)' }}
                onMouseOut={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 16px rgba(47,158,111,.3)' }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.58.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C9.63 21 3 14.37 3 6c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.27 1.03l-2.2 2.2z" fill="white"/>
                  </svg>
                </div>
                <span style={{ fontSize: '9px', color: '#2f9e6f', fontWeight: 600 }}>수신</span>
              </button>
            </div>

          </div>

          {/* 홈바 */}
          <div style={{ height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '52px', height: '4px', borderRadius: '2px', background: '#e4e7ec' }} />
          </div>
        </div>
      </div>

      {/* 텍스트 */}
      <div style={{ textAlign: 'center', maxWidth: '320px', marginBottom: '28px' }}>
        <h1 style={{ fontSize: '21px', fontWeight: 700, color: '#1e232b', lineHeight: 1.45, margin: '0 0 10px' }}>
          "끝났어요… 지금 다 팔까요?"
        </h1>
        <p style={{ fontSize: '14px', color: '#707a88', lineHeight: 1.7, margin: 0 }}>
          패닉에 빠진 투자자를 근거 있는 조언으로 진정시켜라.
        </p>
      </div>

      {/* CTA 버튼 */}
      <button
        onClick={receive}
        style={{
          padding: '15px 40px', borderRadius: '13px',
          background: '#1e232b', color: '#fff',
          fontSize: '15px', fontWeight: 600,
          border: 'none', cursor: 'pointer',
          fontFamily: 'inherit',
          transition: 'background .15s, transform .15s',
        }}
        onMouseOver={e => { e.currentTarget.style.background = '#2c333f'; e.currentTarget.style.transform = 'translateY(-1px)' }}
        onMouseOut={e => { e.currentTarget.style.background = '#1e232b'; e.currentTarget.style.transform = '' }}
      >
        전화 받기 →
      </button>

      {/* 하단 메타 */}
      <div style={{
        marginTop: '20px',
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: '10px', color: '#c8cdd4', letterSpacing: '.08em',
      }}>
        실제 Upbit 데이터 기반 · Gemini AI 반응
      </div>

    </div>
  )
}
