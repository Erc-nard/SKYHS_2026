import { useGameStore } from '../store/gameStore'
import { DICT, CHARACTERS } from '../data/gameContent'

// DOGE 전체 시리즈 (원): 게임 구간(idx 0~11) + SNL 이후(idx 12~15)
// 날짜: 3/31 4/1 4/6 4/13 4/15 4/16 4/19 4/20 4/21 4/23 4/28 5/3  5/8  5/9  5/15 5/31
const DOGE_FULL     = [65, 77, 86, 121, 228, 467, 513, 395, 388, 295, 376, 539, 440, 380, 280, 200]
const DOGE_LABELS   = ['3/31','4/1','4/6','4/13','4/15','4/16','4/19','4/20','4/21','4/23','4/28','5/3','5/8','5/9','5/15','5/31']
const DOGE_ENTRY    = 77    // 4/01 진입가 (원)
const DOGE_INVESTED = 100   // 100만원
const DOGE_PLAYED   = 12    // idx 0~11이 게임 구간 (5/3까지)
const SNL_IDX       = 12    // 5/8 SNL 방영일

function buildChart() {
  const W = 320, H = 160, pad = { top: 14, right: 16, bottom: 24, left: 8 }
  const series = DOGE_FULL
  const min = Math.min(...series)
  const max = Math.max(...series)
  const xs = i => pad.left + (i / (series.length - 1)) * (W - pad.left - pad.right)
  const ys = p => pad.top + (1 - (p - min) / (max - min)) * (H - pad.top - pad.bottom)
  return { xs, ys, series, W, H }
}

function won(n) {
  return Math.round(Math.abs(n)).toLocaleString('ko-KR')
}

export default function EndingScreen() {
  const hist       = useGameStore(s => s.hist)
  const trust      = useGameStore(s => s.trust)
  const startTrust = useGameStore(s => s.startTrust)
  const blew       = useGameStore(s => s.blew)
  const tradeIdx   = useGameStore(s => s.tradeIdx)
  const opened     = useGameStore(s => s.opened)
  const result     = useGameStore(s => s.result)
  const char       = useGameStore(s => s.char)
  const actions    = useGameStore(s => s.actions)

  const charName = CHARACTERS.find(c => c.id === char)?.name || '김불안'

  // ─── 차트 ───────────────────────────────────────────
  const { xs, ys, series, W, H } = buildChart()

  const playedPts = series.slice(0, DOGE_PLAYED)
    .map((p, i) => `${xs(i).toFixed(1)},${ys(p).toFixed(1)}`).join(' ')

  const futurePts = series.slice(DOGE_PLAYED - 1)
    .map((p, i) => `${xs(i + DOGE_PLAYED - 1).toFixed(1)},${ys(p).toFixed(1)}`).join(' ')

  // 게임 종료 도트
  const dotIdx   = blew ? (tradeIdx ?? DOGE_PLAYED - 1) : DOGE_PLAYED - 1
  const dotColor = blew ? '#d65a4e' : '#27865e'

  // SNL 수직선 x 위치
  const snlX = xs(SNL_IDX)
  const snlY = ys(series[SNL_IDX])

  // ─── 자산 계산 ────────────────────────────────────────
  const presentPrice  = series[DOGE_PLAYED - 1]    // 539원 (5/3)
  const snlPrice      = series[SNL_IDX]             // 440원 (5/8)
  const monthEndPrice = series[series.length - 1]   // 200원 (5/31)

  const presentPnl  = DOGE_INVESTED * (presentPrice / DOGE_ENTRY) - DOGE_INVESTED
  const snlPnl      = DOGE_INVESTED * (snlPrice / DOGE_ENTRY) - DOGE_INVESTED
  const monthEndPnl = DOGE_INVESTED * (monthEndPrice / DOGE_ENTRY) - DOGE_INVESTED

  const lockedPrice = tradeIdx != null ? series[tradeIdx] : null
  const lockedPnl   = lockedPrice != null ? DOGE_INVESTED * (lockedPrice / DOGE_ENTRY) - DOGE_INVESTED : null

  // ─── 근거 통계 (다중근거 호환) ─────────────────────────
  const allEvidences = hist.flatMap(h =>
    h.evidences ? h.evidences : (h.q ? [{ q: h.q }] : [])
  )
  const total      = Math.max(1, allEvidences.length)
  const strongCount = allEvidences.filter(e => e.q === 'best' || e.q === 'strong').length
  const socialCount = allEvidences.filter(e => e.q === 'social' || e.q === 'news').length
  const strongPct  = Math.round(strongCount / total * 100)
  const socialPct  = Math.round(socialCount / total * 100)
  const goodCombo  = hist.filter(h => (h.totalDelta ?? h.delta ?? 0) > 0).length
  const coherence  = Math.round(goodCombo / Math.max(1, hist.length) * 100)
  const trustGain  = (trust ?? startTrust) - startTrust
  const buyBlow    = blew && result?.panicAction === 'buy'

  // ─── SNL 에필로그 (trust 기반 3단계) ────────────────────
  let epilogue
  if (trust >= 70) {
    epilogue = {
      emoji: '🎯',
      title: `${charName}, 고점을 피했습니다`,
      story: `당신의 설득을 믿은 ${charName}은(는) SNL 방영 전날 분할 익절에 성공했습니다. 5월 8일 머스크는 SNL 무대에서 도지코인을 '허슬'이라 불렀고, 가격은 방영 직후 -30%를 기록했습니다. 그는 이미 수익권에 있었습니다.`,
      note: 'SNL 방영 후 DOGE: 539 → 380원 (-29%)',
      color: '#27865e', bg: '#e7f4ee',
    }
  } else if (trust >= 40) {
    epilogue = {
      emoji: '⚖️',
      title: '아슬아슬하게 반은 지켰습니다',
      story: `${charName}은(는) 일부만 익절하고 남은 포지션을 유지한 채 SNL을 맞이했습니다. 방영 후 도지코인은 -30% 폭락했지만, 미리 팔아둔 절반 덕에 원금은 지킬 수 있었습니다.`,
      note: 'SNL 방영 후 DOGE: 539 → 380원 (-29%)',
      color: '#b67e1f', bg: '#fbf3e3',
    }
  } else {
    epilogue = {
      emoji: '📉',
      title: 'SNL의 날, 함께 폭락했습니다',
      story: `설득에 실패한 ${charName}은(는) SNL 직전까지 풀포지션을 유지했습니다. 머스크가 '허슬'이라 한마디 하자 도지코인은 -30%로 추락했고, 그는 결국 고점 대비 큰 손실을 입었습니다.`,
      note: 'SNL 방영 후 DOGE: 539 → 380원 (-29%)',
      color: '#c0473d', bg: '#fbeceb',
    }
  }

  // ─── Verdict ─────────────────────────────────────────
  let verdictTitle, verdictSub, verdictColor, verdictBg
  let mirrorTitle, mirrorBody, mirrorIrony

  if (blew && buyBlow) {
    verdictColor = '#c0473d'; verdictBg = '#fbeceb'
    verdictTitle = 'FOMO를 막지 못했습니다'
    verdictSub   = `결정적 순간 ${charName}의 FOMO를 막지 못했고, 그는 고점에서 추격매수를 단행했습니다.`
    mirrorTitle  = '당신도 그 분위기에 휩쓸렸습니다'
    mirrorBody   = `강한 근거 대신 커뮤니티 반응이나 뉴스 분위기를 근거로 댄 순간이 많았습니다. 머스크 트윗 하나에 휩쓸리는 건 ${charName}만이 아니었어요.`
    mirrorIrony  = '공탐지수가 85를 넘었을 때, 당신은 무슨 근거를 댔나요?'
  } else if (blew) {
    verdictColor = '#c0473d'; verdictBg = '#fbeceb'
    verdictTitle = '패닉을 막지 못했습니다'
    verdictSub   = `조정 국면에서 ${charName}의 패닉셀을 막지 못했습니다. SNL 카탈리스트가 남아있었는데도요.`
    mirrorTitle  = '공포도 탐욕만큼 비이성적입니다'
    mirrorBody   = "하락할 때 '손절하는 게 맞지 않을까' 싶어지는 건 자연스럽습니다. 그 감각이 당신 근거 선택에도 영향을 미쳤을 거예요."
    mirrorIrony  = '바닥에서 던지는 건 고점에서 사는 것만큼 비싼 실수입니다.'
  } else if (coherence >= 60) {
    verdictColor = '#27865e'; verdictBg = '#e7f4ee'
    verdictTitle = '설득에 성공했습니다'
    verdictSub   = `${charName}은(는) 끝까지 이성을 유지했어요. 강한 근거로 신뢰도를 높게 유지한 당신 덕분입니다.`
    mirrorTitle  = '당신은 공탐지수로 말했습니다'
    mirrorBody   = "탐욕장 한복판에서 '지표를 보자'고 말하는 건 쉽지 않습니다. 분위기보다 숫자로 설득한 당신이 있었기에 김불안은 SNL 전날 익절할 수 있었습니다."
    mirrorIrony  = "그런데 — 똑같은 상황이 '당신의' 계좌였다면, 이만큼 근거대로 움직일 수 있었을까요?"
  } else {
    verdictColor = '#b67e1f'; verdictBg = '#fbf3e3'
    verdictTitle = '아슬아슬하게 버텼습니다'
    verdictSub   = `${charName}은(는) 가까스로 사고를 면했어요. 다만 강한 근거보다 분위기에 기댄 순간이 많았습니다.`
    mirrorTitle  = '운과 근거 사이'
    mirrorBody   = "몇 번은 공탐지수와 차트로, 몇 번은 뉴스 분위기로 설득했습니다. 이번엔 주사위가 맞았지만, 다음엔 분위기 근거를 한 번 더 골랐을 때 어떻게 될지 모릅니다."
    mirrorIrony  = '남에겐 "숫자를 보라"고 했죠. 그 말, 다음엔 당신 선택에도 적용해보세요.'
  }

  // 표시할 손익
  const stat1Val   = blew
    ? `${(lockedPnl ?? 0) >= 0 ? '+' : '-'}${won(lockedPnl ?? 0)}만원`
    : `+${won(presentPnl)}만원`
  const stat1Color = blew ? '#d65a4e' : (presentPnl >= 0 ? '#27865e' : '#d65a4e')
  const stat1Label = blew ? (buyBlow ? '확정 손실 (고점 물림)' : '확정 손실 (패닉셀)') : '5/3 기준 평가수익'

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', padding: '48px 24px', background: '#f7f9fc' }}>
      <div style={{ width: '700px', maxWidth: '100%', animation: 'fadeIn .45s ease' }}>

        <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '12px', letterSpacing: '.16em', color: '#9099a6', textTransform: 'uppercase', textAlign: 'center', marginBottom: '4px' }}>
          Game Over · DOGE 2021
        </div>

        {/* ───── 0. SNL 에필로그 ───── */}
        <div style={{ background: epilogue.bg, border: `1.5px solid ${epilogue.color}22`, borderRadius: '20px', padding: '24px 28px', marginTop: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <span style={{ fontSize: '28px' }}>{epilogue.emoji}</span>
            <div>
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '10px', letterSpacing: '.12em', color: epilogue.color, textTransform: 'uppercase', marginBottom: '3px' }}>SNL 에필로그 · 2021.05.08</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: epilogue.color }}>{epilogue.title}</div>
            </div>
          </div>
          <p style={{ fontSize: '14px', lineHeight: 1.75, color: '#2c333f', margin: '0 0 12px' }}>{epilogue.story}</p>
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '11px', color: epilogue.color, background: `${epilogue.color}18`, borderRadius: '8px', padding: '7px 12px', display: 'inline-block' }}>
            {epilogue.note}
          </div>
        </div>

        {/* ───── 1. 결과 카드 ───── */}
        <div style={{ background: '#fff', border: '1px solid #e4e7ec', borderRadius: '20px', padding: '28px', marginTop: '16px', boxShadow: '0 1px 3px rgba(20,30,50,.05)' }}>
          <div style={{ display: 'inline-block', padding: '4px 11px', borderRadius: '20px', background: verdictBg, fontSize: '12px', fontWeight: 700, color: verdictColor }}>① 결과</div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, margin: '12px 0 6px', color: verdictColor }}>{verdictTitle}</h2>
          <p style={{ fontSize: '14px', color: '#707a88', margin: '0 0 20px', lineHeight: 1.6 }}>{verdictSub}</p>

          {/* 차트 */}
          <div style={{ background: '#f7f9fc', borderRadius: '14px', padding: '16px', marginBottom: '18px' }}>
            <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: '100%', height: `${H}px`, display: 'block', overflow: 'visible' }}>
              {/* 에필로그 점선 (빨강) */}
              <polyline points={futurePts} fill="none" stroke="#FF4444" strokeWidth="1.8" strokeDasharray="4 4" strokeLinejoin="round" />
              {/* 게임 구간 실선 */}
              <polyline points={playedPts} fill="none" stroke="#1e232b" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" />
              {/* SNL 수직선 */}
              <line x1={snlX.toFixed(1)} y1="0" x2={snlX.toFixed(1)} y2={H} stroke="#FF4444" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
              {/* SNL 도트 */}
              <circle cx={snlX.toFixed(1)} cy={snlY.toFixed(1)} r="4" fill="#FF4444" stroke="#fff" strokeWidth="2" />
              {/* SNL 라벨 */}
              <text x={snlX + 4} y="12" fontSize="9" fill="#FF4444" fontFamily="'IBM Plex Mono',monospace">SNL</text>
              {/* 게임 종료 도트 */}
              <circle cx={xs(dotIdx).toFixed(1)} cy={ys(series[dotIdx]).toFixed(1)} r="5" fill={dotColor} stroke="#fff" strokeWidth="2" />
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'IBM Plex Mono',monospace", fontSize: '10px', color: '#aab0ba', marginTop: '6px' }}>
              <span>3/31 진입</span>
              <span style={{ color: dotColor }}>{blew ? (buyBlow ? 'FOMO 풀매수' : '패닉셀') : '5/3 보유 중'}</span>
              <span style={{ color: '#FF4444' }}>5/8 SNL -29%</span>
            </div>
          </div>

          {/* 수치 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            <div style={{ background: '#f7f9fc', borderRadius: '13px', padding: '14px' }}>
              <div style={{ fontSize: '11px', color: '#707a88' }}>{stat1Label}</div>
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '18px', fontWeight: 600, color: stat1Color, marginTop: '5px' }}>{stat1Val}</div>
            </div>
            <div style={{ background: '#f7f9fc', borderRadius: '13px', padding: '14px' }}>
              <div style={{ fontSize: '11px', color: '#707a88' }}>SNL 당일 (5/8)</div>
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '18px', fontWeight: 600, color: snlPnl >= 0 ? '#27865e' : '#d65a4e', marginTop: '5px' }}>+{won(snlPnl)}만원</div>
            </div>
            <div style={{ background: '#f7f9fc', borderRadius: '13px', padding: '14px' }}>
              <div style={{ fontSize: '11px', color: '#707a88' }}>5월 말 버텼다면</div>
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '18px', fontWeight: 600, color: '#2f64c8', marginTop: '5px' }}>+{won(monthEndPnl)}만원</div>
            </div>
          </div>
        </div>

        {/* ───── 2. 거울 카드 ───── */}
        <div style={{ background: '#1e232b', borderRadius: '20px', padding: '28px', marginTop: '16px', color: '#fff' }}>
          <div style={{ display: 'inline-block', padding: '4px 11px', borderRadius: '20px', background: 'rgba(255,255,255,.12)', fontSize: '12px', fontWeight: 700 }}>② 거울</div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, margin: '13px 0 12px' }}>{mirrorTitle}</h2>
          <p style={{ fontSize: '14px', lineHeight: 1.75, color: '#d4d8de', margin: '0 0 16px' }}>{mirrorBody}</p>
          <div style={{ padding: '14px 16px', borderRadius: '13px', background: 'rgba(255,255,255,.06)', fontSize: '13px', lineHeight: 1.65, color: '#fff', marginBottom: '16px' }}>
            {mirrorIrony}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1, textAlign: 'center', background: 'rgba(255,255,255,.06)', borderRadius: '11px', padding: '13px' }}>
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '20px', fontWeight: 600, color: '#7bdcaf' }}>{strongPct}%</div>
              <div style={{ fontSize: '11px', color: '#aab0ba', marginTop: '4px' }}>강한 근거 (공탐·차트)</div>
            </div>
            <div style={{ flex: 1, textAlign: 'center', background: 'rgba(255,255,255,.06)', borderRadius: '11px', padding: '13px' }}>
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '20px', fontWeight: 600, color: '#f0b366' }}>{socialPct}%</div>
              <div style={{ fontSize: '11px', color: '#aab0ba', marginTop: '4px' }}>분위기 근거 (뉴스·커뮤니티)</div>
            </div>
            <div style={{ flex: 1, textAlign: 'center', background: 'rgba(255,255,255,.06)', borderRadius: '11px', padding: '13px' }}>
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '20px', fontWeight: 600, color: '#c8a8f0' }}>{trustGain >= 0 ? '+' : ''}{trustGain}%p</div>
              <div style={{ fontSize: '11px', color: '#aab0ba', marginTop: '4px' }}>신뢰도 변화</div>
            </div>
          </div>
        </div>

        {/* ───── 3. 학습 리포트 ───── */}
        <div style={{ background: '#fff', border: '1px solid #e4e7ec', borderRadius: '20px', padding: '28px', marginTop: '16px', boxShadow: '0 1px 3px rgba(20,30,50,.05)' }}>
          <div style={{ display: 'inline-block', padding: '4px 11px', borderRadius: '20px', background: '#eef2fb', fontSize: '12px', fontWeight: 700, color: '#3a6fd0' }}>③ 학습 리포트</div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, margin: '13px 0 14px' }}>이번 판 성적표</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '18px' }}>
            <div style={{ background: '#f7f9fc', borderRadius: '13px', padding: '15px' }}>
              <div style={{ fontSize: '12px', color: '#707a88' }}>정합성 감각</div>
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '20px', fontWeight: 600, color: '#3a6fd0', marginTop: '5px' }}>{coherence}%</div>
              <div style={{ fontSize: '11px', color: '#9099a6', marginTop: '4px' }}>설득이 실제로 도움된 비율</div>
            </div>
            <div style={{ background: '#f7f9fc', borderRadius: '13px', padding: '15px' }}>
              <div style={{ fontSize: '12px', color: '#707a88' }}>최종 신뢰도</div>
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '20px', fontWeight: 600, color: trust >= 60 ? '#27865e' : trust >= 40 ? '#b67e1f' : '#d65a4e', marginTop: '5px' }}>{trust}%</div>
              <div style={{ fontSize: '11px', color: '#9099a6', marginTop: '4px' }}>시작: {startTrust}% → 종료: {trust}%</div>
            </div>
          </div>

          <div style={{ fontSize: '13px', fontWeight: 700, color: '#5b6470', marginBottom: '10px' }}>
            마주친 개념 — {opened.length}개
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '18px' }}>
            {Object.entries(DICT).map(([k, v]) => {
              const isOpen = opened.includes(k)
              return (
                <div key={k} style={{ display: 'flex', alignItems: 'center', gap: '11px', padding: '11px 14px', borderRadius: '12px', background: isOpen ? '#f3f9f5' : '#f7f8fa' }}>
                  <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: isOpen ? '#27865e' : '#c8cdd4', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', flexShrink: 0 }}>
                    {isOpen ? '✓' : '·'}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: isOpen ? '#1e232b' : '#9099a6' }}>{v.term}</div>
                    <div style={{ fontSize: '11px', color: '#9099a6', lineHeight: 1.45, marginTop: '2px' }}>{v.body}</div>
                  </div>
                </div>
              )
            })}
          </div>

          <div style={{ padding: '14px 17px', borderRadius: '13px', background: '#f7f9fc', fontSize: '13px', color: '#5b6470', lineHeight: 1.6, marginBottom: '18px' }}>
            DOGE 광풍은 2021년 4~5월에 실제로 일어난 일입니다.<br />
            다음엔 <b style={{ color: '#1e232b' }}>'22년 FTX 파산'</b> 시나리오에서 <b style={{ color: '#1e232b' }}>공포장</b>도 경험해보세요.
          </div>

          <button
            onClick={actions.restart}
            style={{ width: '100%', padding: '15px', borderRadius: '13px', background: '#1e232b', color: '#fff', fontSize: '15px', fontWeight: 600, transition: 'background .15s', cursor: 'pointer', border: 'none', fontFamily: 'inherit' }}
            onMouseOver={e => e.currentTarget.style.background = '#2c333f'}
            onMouseOut={e => e.currentTarget.style.background = '#1e232b'}
          >
            다시 플레이 ↺
          </button>
        </div>

      </div>
    </div>
  )
}
