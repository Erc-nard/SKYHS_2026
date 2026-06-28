import { useEffect, useState, useRef } from 'react'
import { useGameStore } from '../../store/gameStore'
import {
  TURNS, DOGE_TURNS, CHARACTERS, PRICE_SERIES, DOGE_PRICE_SERIES,
  ENTRY_PRICE, DOGE_ENTRY_PRICE, REVEAL, DOGE_REVEAL,
  SRCLABEL,
  getSystemPrompt, buildSayPrompt, buildDogeSayPrompt,
  buildReflectPrompt, buildDogeReflectPrompt,
} from '../../data/gameContent'
import { useClaude } from '../../hooks/useClaude'

const FACE_STYLES = {
  panic:    { eye: { width: '7px', height: '12px', background: '#fff', borderRadius: '50%' },    mouth: { width: '22px', height: '11px', borderTop: '3px solid #fff', borderRadius: '22px 22px 0 0' } },
  anxious:  { eye: { width: '8px', height: '9px',  background: '#fff', borderRadius: '50%' },    mouth: { width: '20px', height: '9px',  borderTop: '3px solid #fff', borderRadius: '20px 20px 0 0' } },
  neutral:  { eye: { width: '8px', height: '8px',  background: '#fff', borderRadius: '50%' },    mouth: { width: '20px', height: '3px',  background: '#fff', borderRadius: '2px' } },
  excited:  { eye: { width: '9px', height: '9px',  background: '#fff', borderRadius: '50%' },    mouth: { width: '22px', height: '10px', borderBottom: '3px solid #fff', borderRadius: '0 0 22px 22px' } },
  relieved: { eye: { width: '10px', height: '6px', background: '#fff', borderRadius: '0 0 10px 10px' }, mouth: { width: '20px', height: '9px', borderBottom: '3px solid #fff', borderRadius: '0 0 20px 20px' } },
  greedy:   { eye: { width: '11px', height: '11px', background: '#fff', borderRadius: '50%' },   mouth: { width: '26px', height: '13px', borderBottom: '4px solid #fff', borderRadius: '0 0 26px 26px' } },
}

function Avatar({ face, color, anim }) {
  const fs = FACE_STYLES[face] || FACE_STYLES.neutral
  return (
    <div style={{ width: '100px', height: '100px', borderRadius: '30px', background: color, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '11px', boxShadow: '0 10px 30px rgba(20,30,50,.14)', transition: 'background .5s', animation: anim !== 'none' ? anim : undefined }}>
      <div style={{ display: 'flex', gap: '16px' }}>
        <div style={fs.eye} /><div style={fs.eye} />
      </div>
      <div style={fs.mouth} />
    </div>
  )
}

function TypingDots() {
  return (
    <span style={{ display: 'inline-flex', gap: '4px', alignItems: 'center', height: '20px' }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#7a8395', animation: `floatUp .9s ease ${i * 0.2}s infinite` }} />
      ))}
    </span>
  )
}

const DIR_TAG = { sell:'매도', partial_sell:'분할매도', hold:'관망', partial_buy:'분할매수', buy:'매수' }
const WEIGHT_COLORS = ['#2f9e6f', '#3a6fd0', '#dd8a4a']
const WEIGHT_PCT    = ['100%', '50%', '25%']

export default function ChatPanel() {
  const turn              = useGameStore(s => s.turn)
  const phase             = useGameStore(s => s.phase)
  const stage             = useGameStore(s => s.stage)
  const advice            = useGameStore(s => s.advice)
  const result            = useGameStore(s => s.result)
  const blew              = useGameStore(s => s.blew)
  const char              = useGameStore(s => s.char)
  const scenario          = useGameStore(s => s.scenario)
  const selectedEvidences = useGameStore(s => s.selectedEvidences)
  const actions           = useGameStore(s => s.actions)

  const { generate, loading } = useClaude()

  const [geminiSay,     setGeminiSay]     = useState('')
  const [geminiReflect, setGeminiReflect] = useState('')
  const [reflectReady,  setReflectReady]  = useState(false)

  const prevTurnRef   = useRef(-1)
  const prevResultRef = useRef(null)

  const isDoge      = scenario === 'doge'
  const turns       = isDoge ? DOGE_TURNS  : TURNS
  const priceSeries = isDoge ? DOGE_PRICE_SERIES : PRICE_SERIES
  const entryPrice  = isDoge ? DOGE_ENTRY_PRICE  : ENTRY_PRICE
  const reveal      = isDoge ? DOGE_REVEAL : REVEAL

  const t        = turns[turn]
  const charData = CHARACTERS.find(c => c.id === char)
  const charName = charData?.name || ''

  // Turn 시작 → Gemini say 생성
  useEffect(() => {
    if (prevTurnRef.current === turn) return
    prevTurnRef.current = turn
    setGeminiSay('')
    setGeminiReflect('')
    setReflectReady(false)

    const price  = priceSeries[reveal[turn]]
    const pct    = (price / entryPrice - 1) * 100
    const prompt = isDoge ? buildDogeSayPrompt(turn, price, pct) : buildSayPrompt(turn, price, pct)
    const sys    = getSystemPrompt(char, scenario)
    generate(prompt, sys).then(text => { if (text) setGeminiSay(text) })
  }, [turn, generate, isDoge, char, scenario])

  // stage 3 도달 → Gemini reflect 생성
  useEffect(() => {
    if (!result || stage < 3 || reflectReady) return
    if (prevResultRef.current === result) return
    prevResultRef.current = result
    setReflectReady(true)

    const prompt = isDoge ? buildDogeReflectPrompt(result) : buildReflectPrompt(result)
    const sys    = getSystemPrompt(char, scenario)
    generate(prompt, sys).then(text => { if (text) setGeminiReflect(text) })
  }, [result, stage, reflectReady, generate, isDoge, char, scenario])

  const inResult = phase === 'result'

  const charHue = charData?.hue || '#3a6fd0'

  // Avatar 상태
  let face, color, anim = 'none', moodLabel
  if (inResult && stage >= 2) {
    const o = result?.outcome
    if (o === 'good')                        { color = '#2f9e6f'; face = 'relieved'; moodLabel = '합리적 판단 · 안도' }
    else if (o === 'near')                   { color = '#dd8a4a'; face = 'anxious';  moodLabel = '간신히 버팀' }
    else if (result?.panicAction === 'buy')  { color = '#d65a4e'; face = 'greedy';   moodLabel = 'FOMO 폭주'; anim = 'pulseGrow 1.2s infinite' }
    else                                     { color = '#2f64c8'; face = 'panic';    moodLabel = '패닉 · 투매'; anim = 'tremble .35s infinite' }
  } else if (inResult) {
    color = charHue
    face  = t.baseFace === 'panic' ? 'panic' : 'anxious'
    moodLabel = '판단 중…'
    if (t.baseFace === 'panic') anim = 'tremble .35s infinite'
  } else {
    color = charHue
    face  = t.baseFace
    moodLabel = t.baseMood
    if (t.baseFace === 'panic')   anim = 'tremble .35s infinite'
    if (t.baseFace === 'excited' || t.baseFace === 'greedy') anim = 'pulseGrow 1.2s infinite'
  }

  // 대사 결정 (Gemini 우선, 실패 시 하드코딩 폴백)
  let dialogue, isLoading = false
  if (inResult) {
    if (stage >= 3) {
      dialogue  = geminiReflect || result?.reflect || '…'
      isLoading = stage >= 3 && !geminiReflect && loading
    } else {
      isLoading = true
    }
  } else {
    dialogue  = geminiSay || t.say || '…'
    isLoading = !geminiSay && loading
  }

  // 행동 배너 — rational: 사용자 조언 따름, irrational: 페르소나 충동
  const DIR_ACTION = {
    sell:         { text: '전량 매도',   color: '#2f64c8', bg: '#e9eefb' },
    partial_sell: { text: '분할 매도',   color: '#3a6fd0', bg: '#edf0fb' },
    hold:         { text: '관망 유지',   color: '#27865e', bg: '#eaf6f0' },
    partial_buy:  { text: '분할 매수',   color: '#b05a1a', bg: '#fbf0e3' },
    buy:          { text: '추격 매수',   color: '#c0473d', bg: '#fbeceb' },
  }
  let actionText = '', actionColor = '', actionBg = ''
  if (inResult && result) {
    const pa = result.panicAction
    if (result.rational) {
      // 사용자 조언 방향으로 행동
      const d = DIR_ACTION[result.dir] || DIR_ACTION.hold
      actionText = `${d.text} — 조언 따름`
      actionColor = d.color; actionBg = d.bg
    } else if (result.outcome === 'near') {
      actionText = pa === 'buy' ? '추격매수 참음 (동요)' : '던질 뻔하다 보유 (동요)'
      actionColor = '#b67e1f'; actionBg = '#fbf3e3'
    } else if (pa === 'buy') {
      actionText = '풀매수 — FOMO 추격'; actionColor = '#c0473d'; actionBg = '#fbeceb'
    } else {
      actionText = '전량 매도 — 패닉셀'; actionColor = '#2f64c8'; actionBg = '#e9eefb'
    }
  }

  const chosenAdvice = advice ? t.advices.find(a => a.id === advice)?.label || '' : ''
  const nextLabel    = (blew || turn >= turns.length - 1) ? '결과 보기 →' : '다음 턴 →'

  return (
    <div style={{ background: '#fff', border: '1px solid #e4e7ec', borderRadius: '18px', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', overflow: 'hidden' }}>
      <div style={{ margin: '14px 0 6px' }}>
        <Avatar face={face} color={color} anim={anim} />
      </div>
      <div style={{ fontSize: '13px', fontWeight: 600, color: '#4e5a6e' }}>{charName}</div>

      {/* 말풍선 */}
      <div key={`${turn}-${inResult}-${stage}`} className="anim-fadeIn" style={{ position: 'relative', background: '#f4f6f9', borderRadius: '16px', padding: '17px 19px', marginTop: '18px', width: '100%', maxWidth: '470px', minHeight: '64px' }}>
        <div style={{ position: 'absolute', top: '-8px', left: '36px', width: '16px', height: '16px', background: '#f4f6f9', transform: 'rotate(45deg)' }} />
        {isLoading
          ? <TypingDots />
          : <div style={{ fontSize: '15.5px', lineHeight: 1.6, color: '#1e232b', wordBreak: 'keep-all', overflowWrap: 'break-word', whiteSpace: 'pre-wrap' }}>{dialogue}</div>
        }
      </div>

      <div style={{ flex: 1, minHeight: '14px' }} />

      {/* 조언 선택 */}
      {phase === 'advice' && (
        <div className="anim-fadeIn" style={{ width: '100%', maxWidth: '470px' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#606c7e', marginBottom: '9px' }}>① 어떤 조언을 건넬까요?</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {t.advices.map(a => (
              <button key={a.id} onClick={() => actions.pickAdvice(a.id)}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left', padding: '9px 13px', borderRadius: '11px', background: '#fff', border: '1.5px solid #e4e7ec', transition: 'border-color .15s,background .15s,transform .12s', cursor: 'pointer', fontFamily: 'inherit' }}
                onMouseOver={e => { e.currentTarget.style.borderColor='#1e232b'; e.currentTarget.style.background='#fafbfc'; e.currentTarget.style.transform='translateY(-1px)' }}
                onMouseOut={e => { e.currentTarget.style.borderColor='#e4e7ec'; e.currentTarget.style.background='#fff'; e.currentTarget.style.transform='' }}
              >
                <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '11px', fontWeight: 600, color: '#fff', background: '#1e232b', padding: '2px 8px', borderRadius: '6px', flexShrink: 0 }}>{DIR_TAG[a.dir] || a.tag}</span>
                <span style={{ fontSize: '13px', lineHeight: 1.45, color: '#2c333f' }}>{a.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 근거 선택 + 제출 */}
      {phase === 'evidence' && (
        <div className="anim-fadeIn" style={{ width: '100%', maxWidth: '470px' }}>
          {/* 선택된 조언 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '11px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', color: '#606c7e' }}>내 조언</span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#1e232b', background: '#eef2fb', border: '1px solid #cdd9f2', borderRadius: '20px', padding: '4px 12px' }}>"{chosenAdvice}"</span>
            <button onClick={actions.resetAdvice} style={{ fontSize: '11px', color: '#606c7e', marginLeft: 'auto', cursor: 'pointer', border: 'none', background: 'none' }}>조언 바꾸기</button>
          </div>

          {/* 선택된 근거 칩 */}
          {selectedEvidences.length === 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '15px 16px', borderRadius: '13px', background: '#f7faf8', border: '1.5px dashed #bfe3d0' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '9px', background: '#eaf6f0', color: '#2f9e6f', fontSize: '18px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>＋</div>
              <div style={{ fontSize: '13px', color: '#5b6470', lineHeight: 1.5 }}>② 왼쪽 패널에서 <b style={{ color: '#27865e' }}>＋ 근거</b> 버튼으로 근거를 선택하세요. (최대 3개)</div>
            </div>
          ) : (
            <div style={{ padding: '13px 14px', borderRadius: '13px', background: '#f7faf8', border: '1.5px solid #bfe3d0' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#27865e', marginBottom: '9px' }}>② 선택된 근거 (가중 합산)</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                {selectedEvidences.map((src, i) => (
                  <div key={src} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '10px', fontWeight: 700, color: '#fff', background: WEIGHT_COLORS[i], borderRadius: '5px', padding: '2px 6px', flexShrink: 0 }}>{WEIGHT_PCT[i]}</span>
                    <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#1e232b' }}>{SRCLABEL[src]}</span>
                    <button onClick={() => actions.toggleEvidence(src)} style={{ marginLeft: 'auto', fontSize: '11px', color: '#7a8395', cursor: 'pointer', border: 'none', background: 'none' }}>✕</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 제출 버튼 */}
          {selectedEvidences.length > 0 && (
            <button
              className="anim-fadeIn"
              onClick={actions.submitEvidence}
              style={{ width: '100%', marginTop: '10px', padding: '14px', borderRadius: '13px', background: '#1e232b', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer', border: 'none', fontFamily: 'inherit', transition: 'background .15s' }}
              onMouseOver={e => e.currentTarget.style.background = '#2c333f'}
              onMouseOut={e => e.currentTarget.style.background = '#1e232b'}
            >
              근거 제출하기 →
            </button>
          )}
        </div>
      )}

      {/* 행동 배너 */}
      {inResult && stage >= 2 && (
        <div className="anim-pop" style={{ width: '100%', maxWidth: '470px', display: 'flex', alignItems: 'center', gap: '11px', padding: '14px 16px', borderRadius: '13px', background: actionBg }}>
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '11px', fontWeight: 600, color: actionColor, background: '#fff', borderRadius: '7px', padding: '4px 8px', flexShrink: 0 }}>행동</div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: actionColor }}>{actionText}</div>
        </div>
      )}

      {/* 다음 버튼 */}
      {inResult && stage >= 3 && (
        <button className="anim-fadeIn" onClick={actions.next}
          style={{ width: '100%', maxWidth: '470px', marginTop: '10px', padding: '15px', borderRadius: '13px', background: '#1e232b', color: '#fff', fontSize: '15px', fontWeight: 600, transition: 'background .15s', cursor: 'pointer', border: 'none', fontFamily: 'inherit' }}
          onMouseOver={e => e.currentTarget.style.background = '#2c333f'}
          onMouseOut={e => e.currentTarget.style.background = '#1e232b'}
        >
          {nextLabel}
        </button>
      )}
    </div>
  )
}
