import { useGameStore } from '../../store/gameStore'
import { PRICE_SERIES, DOGE_PRICE_SERIES, ENTRY_PRICE, DOGE_ENTRY_PRICE, INVESTED, CHARACTERS, REVEAL, DOGE_REVEAL, SRCLABEL } from '../../data/gameContent'

function trustColor(t) {
  return t < 40 ? '#d65a4e' : t < 70 ? '#dd8a4a' : '#2f9e6f'
}

const WEIGHT_COLORS = ['#2f9e6f', '#3a6fd0', '#dd8a4a']
const WEIGHT_PCT    = ['100%', '50%', '25%']

export default function StatusPanel() {
  const turn     = useGameStore(s => s.turn)
  const trust    = useGameStore(s => s.trust)
  const phase    = useGameStore(s => s.phase)
  const stage    = useGameStore(s => s.stage)
  const result   = useGameStore(s => s.result)
  const blew     = useGameStore(s => s.blew)
  const tradeIdx = useGameStore(s => s.tradeIdx)
  const char     = useGameStore(s => s.char)
  const scenario = useGameStore(s => s.scenario)

  const isDoge      = scenario === 'doge'
  const priceSeries = isDoge ? DOGE_PRICE_SERIES : PRICE_SERIES
  const entryPrice  = isDoge ? DOGE_ENTRY_PRICE  : ENTRY_PRICE
  const reveal      = isDoge ? DOGE_REVEAL       : REVEAL
  const priceUnit   = isDoge ? '원' : '만원'

  const charData  = CHARACTERS.find(c => c.id === char)
  const charName  = charData?.name || ''
  const inResult  = phase === 'result'
  const r         = result

  const tColor = trustColor(trust)

  const curRevealIdx = reveal[turn]
  const curPrice     = priceSeries[curRevealIdx]
  const lockedPrice  = tradeIdx != null ? priceSeries[tradeIdx] : null
  const valPrice     = blew ? lockedPrice : curPrice
  const assetVal     = INVESTED * ((valPrice || entryPrice) / entryPrice)
  const pnlVal       = assetVal - INVESTED
  const pnlPct       = ((valPrice || entryPrice) / entryPrice - 1) * 100
  const won = n => Math.round(Math.abs(n)).toLocaleString('ko-KR')

  const pnlStr = `${pnlVal >= 0 ? '+' : '-'}${won(pnlVal)}만원 (${pnlPct >= 0 ? '+' : ''}${pnlPct.toFixed(1)}%)`

  const diceWaiting = !inResult || stage < 1
  const diceReady   = inResult && stage >= 1

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '13px', overflowY: 'auto', paddingRight: '2px' }}>

      {/* Trust card */}
      <div style={{ background: '#fff', border: '1px solid #e4e7ec', borderRadius: '16px', padding: '17px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#3d4858', whiteSpace: 'nowrap' }}>신뢰도</div>
          <div style={{ fontSize: '11px', color: '#606c7e' }}>합리적 판단 확률</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', margin: '10px 0 12px' }}>
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '38px', fontWeight: 600, color: tColor, lineHeight: 1, transition: 'color .4s' }}>{trust}</div>
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '18px', fontWeight: 600, color: tColor }}>%</div>
        </div>
        <div style={{ height: '8px', borderRadius: '6px', background: '#eef0f3', overflow: 'hidden' }}>
          <div style={{ height: '100%', borderRadius: '6px', background: tColor, width: `${trust}%`, transition: 'width .6s cubic-bezier(.4,0,.2,1),background .4s' }} />
        </div>

        {inResult && r && (
          <div className="anim-fadeIn" style={{ marginTop: '14px', paddingTop: '13px', borderTop: '1px solid #f0f2f5' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#606c7e', marginBottom: '8px' }}>정합성 판정</div>
            <div style={{ fontSize: '12px', color: '#3d4858', lineHeight: 1.55 }}>
              조언 <b style={{ color: '#1e232b' }}>"{r.advice}"</b>
            </div>

            {/* 멀티근거 분해 */}
            {r.evidences && r.evidences.length > 0 ? (
              <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {r.evidences.map((e, i) => (
                  <div key={e.src} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '9px', fontWeight: 700, color: '#fff', background: WEIGHT_COLORS[i], borderRadius: '4px', padding: '2px 5px', flexShrink: 0 }}>{WEIGHT_PCT[i]}</span>
                    <span style={{ fontSize: '11.5px', color: '#3d4858', flex: 1 }}>{SRCLABEL[e.src]}</span>
                    <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '11px', fontWeight: 700, color: e.weightedDelta >= 0 ? '#27865e' : '#c0473d' }}>
                      {e.weightedDelta >= 0 ? '+' : ''}{e.weightedDelta}
                    </span>
                  </div>
                ))}
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginTop: '3px', paddingTop: '6px', borderTop: '1px solid #f0f2f5' }}>
                  <span style={{ fontSize: '11px', color: '#606c7e', flex: 1, fontWeight: 600 }}>합계</span>
                  <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '13px', fontWeight: 700, color: r.delta >= 0 ? '#27865e' : '#c0473d', background: r.delta >= 0 ? '#eaf6f0' : '#fbeceb', borderRadius: '7px', padding: '2px 8px' }}>
                    {r.delta >= 0 ? '+' : ''}{r.delta}%
                  </span>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '14px', color: '#606c7e' }}>{r.tB}% → {r.tA}%</span>
                <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '13px', fontWeight: 700, color: r.delta >= 0 ? '#27865e' : '#c0473d', background: r.delta >= 0 ? '#eaf6f0' : '#fbeceb', borderRadius: '7px', padding: '2px 8px' }}>
                  {r.delta >= 0 ? '+' : ''}{r.delta}%
                </span>
              </div>
            )}

            {r.evidences && r.evidences.length > 0 && (
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '12px', color: '#606c7e', marginTop: '6px' }}>
                {r.tB}% → {r.tA}%
              </div>
            )}
          </div>
        )}
      </div>

      {/* Dice card */}
      <div style={{ background: '#fff', border: '1px solid #e4e7ec', borderRadius: '16px', padding: '17px' }}>
        <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#3d4858', marginBottom: '6px' }}>확률 주사위</div>

        {diceWaiting && (
          <div style={{ fontSize: '12px', color: '#7a8395', lineHeight: 1.55, padding: '6px 0' }}>
            근거를 제출하면, 신뢰도만큼의 확률로 합리적 판단을 굴립니다. 100%는 없어요.
          </div>
        )}

        {diceReady && r && (
          <div className="anim-fadeIn">
            <div style={{ position: 'relative', height: '10px', borderRadius: '6px', marginTop: '8px', background: `linear-gradient(90deg,#2f9e6f ${r.tA}%,#e4b3ad ${r.tA}%)`, overflow: 'visible' }}>
              <div style={{
                position: 'absolute', top: '-6px', width: '6px', height: '22px', borderRadius: '4px',
                background: '#1e232b', border: '2px solid #fff', boxShadow: '0 2px 5px rgba(0,0,0,.3)',
                left: `${Math.round(r.roll)}%`, transform: 'translateX(-50%)',
                animation: 'diceShake .7s ease-out',
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'IBM Plex Mono',monospace", fontSize: '10px', color: '#7a8395', marginTop: '9px' }}>
              <span style={{ color: '#2f9e6f' }}>합리 {r.tA}%</span>
              <span style={{ color: '#c0473d' }}>비합리</span>
            </div>
            <div style={{ marginTop: '11px', fontSize: '13px', fontWeight: 700, color: r.rational ? '#27865e' : '#c0473d' }}>
              {r.rational ? '합리적 판단 — 통과' : '비합리 — 흔들림'}
            </div>
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '11px', color: '#606c7e', marginTop: '3px' }}>
              주사위 {Math.round(r.roll)} {r.rational ? '<' : '≥'} 신뢰도 {r.tA}
            </div>
          </div>
        )}
      </div>

      {/* Asset card */}
      <div style={{ background: '#fff', border: '1px solid #e4e7ec', borderRadius: '16px', padding: '17px' }}>
        <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#3d4858', marginBottom: '13px' }}>{charName}의 자산</div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '9px' }}>
          <span style={{ fontSize: '12px', color: '#4e5a6e' }}>평가금액</span>
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '18px', fontWeight: 600, whiteSpace: 'nowrap' }}>
            {won(assetVal)}<span style={{ fontSize: '11px', color: '#606c7e', fontWeight: 400 }}> 만원</span>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '9px' }}>
          <span style={{ fontSize: '12px', color: '#4e5a6e' }}>평가손익</span>
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '14px', fontWeight: 600, color: pnlVal >= 0 ? '#2f9e6f' : '#d65a4e', whiteSpace: 'nowrap' }}>
            {pnlStr}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid #f0f2f5' }}>
          <span style={{ fontSize: '12px', color: '#4e5a6e' }}>진입가</span>
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '13px', color: '#606c7e' }}>
            {entryPrice.toLocaleString('ko-KR')} {priceUnit}
          </span>
        </div>

        {blew && (
          <div style={{ marginTop: '12px', padding: '9px 11px', borderRadius: '9px', background: '#fbeceb', fontSize: '12px', fontWeight: 600, color: '#c0473d' }}>
            {tradeIdx != null && result?.panicAction === 'buy' ? '고점 추격매수 · 물림' : '전량 매도됨 · 손실 확정'}
          </div>
        )}
      </div>
    </div>
  )
}
