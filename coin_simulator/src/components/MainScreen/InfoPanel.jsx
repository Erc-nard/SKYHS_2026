import { useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import { TURNS, DOGE_TURNS, REVEAL, DOGE_REVEAL, PRICE_SERIES, DOGE_PRICE_SERIES, DICT, DOGE_CHART_DATA, FTX_CHART_DATA, DOGE_CHART_PLAYED, FTX_CHART_PLAYED, CHAR_EVIDENCE_MULT, CHARACTERS } from '../../data/gameContent'
import PriceChart from './PriceChart'
import ChartModal from './ChartModal'

const WEIGHT_LABELS = ['1st', '2nd', '3rd']

function PrefBadge({ mult, hue }) {
  if (mult >= 1.3) return (
    <span style={{ fontSize:'9.5px', color: hue, fontWeight:700, border:`1px solid ${hue}55`, borderRadius:'4px', padding:'1px 5px', opacity:.9 }}>선호</span>
  )
  if (mult <= 0.8) return (
    <span style={{ fontSize:'9.5px', color:'#bbb', fontWeight:600, border:'1px solid #e4e7ec', borderRadius:'4px', padding:'1px 5px' }}>비선호</span>
  )
  return null
}

function HelpPopup({ helpKey, actions }) {
  if (!helpKey || !DICT[helpKey]) return null
  return (
    <div className="anim-pop" style={{
      background: '#f7f9fc', border: '1px solid #e4e7ec', borderRadius: '14px', padding: '14px',
      marginTop: '8px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#3a6fd0' }}>{DICT[helpKey].term}</div>
        <button onClick={actions.closeHelp} style={{ fontSize: '11px', color: '#606c7e', cursor: 'pointer', border: 'none', background: 'none' }}>닫기 ✕</button>
      </div>
      <div style={{ fontSize: '12.5px', color: '#3d4858', lineHeight: 1.6, marginTop: '7px' }}>{DICT[helpKey].body}</div>
    </div>
  )
}

function PanelCard({ title, glowColor, onToggle, onHelp, onExpand, evidencePhase, src, selectedEvidences, helpKey, help, actions, prefMult, charHue, children }) {
  const idx        = evidencePhase ? selectedEvidences.indexOf(src) : -1
  const isSelected = idx >= 0
  const canAdd     = selectedEvidences.length < 3
  const btnBg      = isSelected ? '#1e232b' : (canAdd ? '#2f9e6f' : '#b0b7c1')
  const btnLabel   = isSelected ? `${WEIGHT_LABELS[idx]} ✓` : '＋ 근거'

  return (
    <div>
      <div style={{
        background: '#fff',
        border: `1.5px solid ${isSelected ? '#1e232b' : glowColor}`,
        borderRadius: '16px', padding: '15px',
        transition: 'border-color .25s',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#3d4858' }}>{title}</div>
              {evidencePhase && prefMult != null && <PrefBadge mult={prefMult} hue={charHue} />}
            </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            {onExpand && (
              <button onClick={onExpand} style={{ fontSize: '13px', color: '#7a8395', cursor: 'pointer', border: 'none', background: 'none', padding: '2px 4px', lineHeight: 1 }} title="크게보기">↗</button>
            )}
            {evidencePhase && (
              <button
                onClick={onToggle}
                disabled={!isSelected && !canAdd}
                style={{
                  padding: '4px 10px', borderRadius: '8px', background: btnBg, color: '#fff',
                  fontSize: '11px', fontWeight: 700, whiteSpace: 'nowrap', cursor: !isSelected && !canAdd ? 'default' : 'pointer',
                  border: 'none', fontFamily: 'inherit', transition: 'background .15s',
                }}
              >{btnLabel}</button>
            )}
            <button onClick={onHelp} style={{ fontSize: '12px', color: '#7a8395', cursor: 'pointer', border: 'none', background: 'none' }}>ⓘ</button>
          </div>
        </div>
        {children}
      </div>
      {help === helpKey && <HelpPopup helpKey={helpKey} actions={actions} />}
    </div>
  )
}

export default function InfoPanel() {
  const turn              = useGameStore(s => s.turn)
  const phase             = useGameStore(s => s.phase)
  const help              = useGameStore(s => s.help)
  const scenario          = useGameStore(s => s.scenario)
  const char              = useGameStore(s => s.char)
  const selectedEvidences = useGameStore(s => s.selectedEvidences)
  const actions           = useGameStore(s => s.actions)
  const [chartExpanded, setChartExpanded] = useState(false)

  const charData  = CHARACTERS.find(c => c.id === char)
  const charHue   = charData?.hue || '#606c7e'
  const charMult  = CHAR_EVIDENCE_MULT[char] || {}

  const isDoge      = scenario === 'doge'
  const turns       = isDoge ? DOGE_TURNS  : TURNS
  const reveal      = isDoge ? DOGE_REVEAL : REVEAL
  const priceSeries = isDoge ? DOGE_PRICE_SERIES : PRICE_SERIES
  const coinLabel   = isDoge ? 'DOGE/KRW' : 'BTC/KRW'
  const chartData   = isDoge ? DOGE_CHART_DATA : FTX_CHART_DATA
  const chartPlayed = isDoge ? DOGE_CHART_PLAYED : FTX_CHART_PLAYED
  const revealedCount = (reveal[turn] ?? 2) + 1

  const t             = turns[turn]
  const evidencePhase = phase === 'evidence'
  const evGlow        = evidencePhase ? '#bfe3d0' : '#e4e7ec'

  const revealLen  = reveal[turn]
  const lastPrice  = priceSeries[revealLen]
  const prevPrice  = turn > 0 ? priceSeries[reveal[turn - 1]] : priceSeries[0]
  const chg        = ((lastPrice / prevPrice) - 1) * 100
  const down       = lastPrice < prevPrice
  const lineColor  = down ? '#3a6fd0' : '#d65a4e'
  const fgiColor   = t.fgi < 30 ? '#3a6fd0' : t.fgi < 55 ? '#2f9e6f' : '#d65a4e'
  const priceUnit  = isDoge ? '원' : '만원'
  const won = n => Math.round(n).toLocaleString('ko-KR')

  const selCount = selectedEvidences.length

  const chartHelpKey    = t.chartConcept
  const newsHelpKey     = t.newsConcept

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', paddingRight: '2px' }}>
      {evidencePhase && (
        <div className="anim-fadeIn" style={{
          fontFamily: "'IBM Plex Mono',monospace", fontSize: '11px', letterSpacing: '.03em',
          color: '#27865e', background: '#eaf6f0', border: '1px solid #bfe3d0', borderRadius: '9px', padding: '9px 11px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span>＋ 버튼으로 근거를 선택하세요 (최대 3개, 가중 합산)</span>
          <span style={{ fontWeight: 700, color: selCount > 0 ? '#1e232b' : '#7a8395' }}>{selCount}/3</span>
        </div>
      )}

      {/* Chart */}
      <PanelCard
        title={`${coinLabel} · ${t.chartNote}`} glowColor={evGlow}
        evidencePhase={evidencePhase} src="chart"
        selectedEvidences={selectedEvidences}
        onToggle={() => actions.toggleEvidence('chart')}
        onHelp={() => help === chartHelpKey ? actions.closeHelp() : actions.openHelp(chartHelpKey)}
        onExpand={() => setChartExpanded(true)}
        helpKey={chartHelpKey} help={help} actions={actions}
        prefMult={charMult.chart} charHue={charHue}
      >
        <PriceChart
          revealedCount={revealedCount}
          scenario={scenario}
        />
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: '7px' }}>
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '17px', fontWeight: 600, whiteSpace: 'nowrap' }}>
            {won(lastPrice)}<span style={{ fontSize: '11px', color: '#606c7e', fontWeight: 400 }}> {priceUnit}</span>
          </div>
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '13px', fontWeight: 600, color: lineColor }}>
            {chg >= 0 ? '+' : ''}{chg.toFixed(1)}%
          </div>
        </div>
      </PanelCard>

      {/* FGI */}
      <PanelCard
        title="공포탐욕지수" glowColor={evGlow}
        evidencePhase={evidencePhase} src="fgi"
        selectedEvidences={selectedEvidences}
        onToggle={() => actions.toggleEvidence('fgi')}
        onHelp={() => help === 'fgi' ? actions.closeHelp() : actions.openHelp('fgi')}
        helpKey="fgi" help={help} actions={actions}
        prefMult={charMult.fgi} charHue={charHue}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '27px', fontWeight: 600, color: fgiColor }}>{t.fgi}</div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: fgiColor }}>{t.fgiLabel}</div>
        </div>
        <div style={{ position: 'relative', height: '7px', borderRadius: '6px', marginTop: '11px', background: 'linear-gradient(90deg,#3a6fd0,#2f9e6f 50%,#d65a4e)' }}>
          <div style={{
            position: 'absolute', top: '-3px', width: '4px', height: '13px', borderRadius: '3px',
            background: '#1e232b', border: '2px solid #fff', boxShadow: '0 1px 3px rgba(0,0,0,.25)',
            left: `${t.fgi}%`, transform: 'translateX(-50%)', transition: 'left .5s',
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'IBM Plex Mono',monospace", fontSize: '10px', color: '#7a8395', marginTop: '7px' }}>
          <span>0 공포</span><span>탐욕 100</span>
        </div>
      </PanelCard>

      {/* News */}
      <PanelCard
        title="이 시점의 뉴스" glowColor={evGlow}
        evidencePhase={evidencePhase} src="news"
        selectedEvidences={selectedEvidences}
        onToggle={() => actions.toggleEvidence('news')}
        onHelp={() => help === newsHelpKey ? actions.closeHelp() : actions.openHelp(newsHelpKey)}
        helpKey={newsHelpKey} help={help} actions={actions}
        prefMult={charMult.news} charHue={charHue}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {t.news.map((n, i) => (
            <div key={i} style={{ borderLeft: '2px solid #e4e7ec', paddingLeft: '11px' }}>
              <div style={{ fontSize: '12.5px', fontWeight: 600, lineHeight: 1.45 }}>{n.t}</div>
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '10.5px', color: '#7a8395', marginTop: '3px' }}>{n.src}</div>
            </div>
          ))}
        </div>
      </PanelCard>

      {/* Community */}
      <PanelCard
        title="커뮤니티" glowColor={evGlow}
        evidencePhase={evidencePhase} src="community"
        selectedEvidences={selectedEvidences}
        onToggle={() => actions.toggleEvidence('community')}
        onHelp={() => help === 'herd' ? actions.closeHelp() : actions.openHelp('herd')}
        helpKey="herd" help={help} actions={actions}
        prefMult={charMult.community} charHue={charHue}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
          {t.community.map((c, i) => (
            <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#e8ebef', flexShrink: 0, marginTop: '1px' }} />
              <div style={{ fontSize: '12px', color: '#3d4858', lineHeight: 1.45 }}>{c.t}</div>
            </div>
          ))}
        </div>
      </PanelCard>

      <ChartModal
        open={chartExpanded}
        onClose={() => setChartExpanded(false)}
        revealedCount={revealedCount}
        scenario={scenario}
      />
    </div>
  )
}
