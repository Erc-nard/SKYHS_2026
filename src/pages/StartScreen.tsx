import { useGameStore } from '@/store/gameStore'

export default function StartScreen() {
  const setScreen = useGameStore((s) => s.setScreen)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 px-4 text-center">
      <p className="text-zinc-400 text-sm tracking-widest uppercase">코인 투자 감정 분석 게임</p>
      <h1 className="text-3xl md:text-5xl font-bold leading-tight">
        만약 내가 코인 투자를 한다면<br />
        <span className="text-yellow-400">성공할 수 있을까?</span>
      </h1>
      <p className="text-zinc-400 max-w-md">
        차트만 보고 내린 결정과 군중의 감정을 본 뒤 바꾼 결정을 비교해,
        당신이 시장의 감정에 얼마나 휩쓸리는 사람인지 진단합니다.
      </p>
      <button
        onClick={() => setScreen('scenario')}
        className="mt-4 px-10 py-4 bg-yellow-400 text-black font-bold text-lg rounded-full hover:bg-yellow-300 transition-colors"
      >
        시작하기
      </button>
    </div>
  )
}
