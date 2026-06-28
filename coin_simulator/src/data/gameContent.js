// ─── FTX 시나리오 데이터 ────────────────────────────────
export const ENTRY_PRICE = 2895;
export const INVESTED    = 1000;

// Upbit 실데이터 (만원 단위, 2022-11-07~11-22 + 12월 회복)
export const PRICE_SERIES = [2895, 2665, 2292, 2366, 2251, 2300, 2295, 2298, 2306, 2222, 2258, 2273, 2292];
export const REVEAL       = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
export const PLAYED_LEN   = 11;

export const SRCQ     = {fgi:'best', chart:'strong', news:'news', community:'social'};
export const SRCLABEL = {fgi:'공포탐욕지수', chart:'차트·지지선', news:'뉴스', community:'커뮤니티'};

export const SCORE_TABLE = {
  sell:         {best:-14, strong:-12, news:-18, social:-16},
  partial_sell: {best:-7,  strong:-6,  news:-10, social:-9},
  hold:         {best:30,  strong:25,  news:-10, social:-8},
  partial_buy:  {best:5,   strong:4,   news:-7,  social:-7},
  buy:          {best:8,   strong:6,   news:-12, social:-12},
};

export const DICT = {
  fgi:         {term:'공포탐욕지수',            body:'시장 심리를 0(극단적 공포)~100(극단적 탐욕)으로 환산한 지표. 숫자가 낮을수록 다들 무서워 파는 중 — 역설적으로 바닥 신호일 때가 많다. 가장 강한 판단 근거.'},
  support:     {term:'지지선',                  body:'과거에 여러 번 떨어졌다 반등한 가격대. 매수세가 모이는 바닥 후보. 거래량이 줄면 투매가 끝나간다는 신호.'},
  panicsell:   {term:'패닉셀',                  body:'공포에 질려 손해를 감수하고 한꺼번에 던지는 것. 대개 바닥 근처에서 터진다. 단기 악재 뉴스만 보고 버티라 하면 근거가 약하다.'},
  deadcat:     {term:'데드캣 바운스',            body:'급락 뒤 잠깐 튀었다가 다시 빠지는 일시적 반등. 거래량 없이 오르면 의심해야 한다.'},
  volume:      {term:'거래량',                  body:'얼마나 사고팔렸는지. 잦은 매매는 수수료로 자산을 갉아먹는다. 급락에 거래량이 터지면 투매 신호.'},
  herd:        {term:'군중심리 (허딩)',           body:'남들이 사면 따라 사고 팔면 따라 파는 쏠림. 커뮤니티 분위기는 근거가 아니라 분위기다 — 가장 약한 판단 재료.'},
  contagion:   {term:'연쇄 파산 (전이 리스크)',   body:'한 거래소의 붕괴가 다른 거래소·프로젝트로 번지는 것. FTX 이후 실제로 여러 곳이 도미노로 무너졌다.'},
  accumulation:{term:'바닥 매집',               body:'기관·고래가 낮은 가격에서 조용히 사들이는 행동. 거래량 없이 횡보 중 은근히 오르면 신호일 수 있다.'},
  fomo:        {term:'FOMO (포모)',              body:'Fear Of Missing Out. 오르는 걸 보고 나만 못 탄 것 같아 추격하는 심리. 탐욕지수가 높을수록 FOMO가 강해지며, 고점 추격으로 이어진다.'},
  meme:        {term:'밈코인 리스크',            body:'밈코인은 펀더멘털 없이 소셜 미디어와 인플루언서 발언 하나에 50~100% 오르내린다. 뉴스보다 빠르게 움직이며 예측이 어렵다.'},
  pyramid:     {term:'과열 · 펌핑',             body:'단기간 급등 후 매수 에너지가 소진되면 급락하는 구조. 신규 매수자가 없어지면 초기 진입자가 팔면서 가격이 무너진다.'},
};

export const CHARACTERS = [
  {id:'kim',  name:'김불안', weak:'공포',        tip:'안심시킬 근거 제시',  desc:'작은 악재에도 크게 흔들린다', hue:'#3a6fd0', locked:false},
  {id:'park', name:'박욕심', weak:'탐욕',        tip:'흥분 가라앉히기',    desc:'오르면 더 사려고 안달',       hue:'#d65a4e', locked:false},
  {id:'lee',  name:'이초보', weak:'정보 휩쓸림',  tip:'뉴스 거르는 법 코칭', desc:'헤드라인에 휘둘린다',        hue:'#7a83d0', locked:false},
  {id:'choi', name:'최존버', weak:'고집',        tip:'때론 움직이게',      desc:'무슨 일이 있어도 안 판다',    hue:'#2f9e6f', locked:false},
];

// 캐릭터별 근거 유형 가중치 (1.0 = 기본, 1.3~1.5 = 선호, 0.7~0.8 = 비선호)
export const CHAR_EVIDENCE_MULT = {
  kim:  { chart: 1.0, fgi: 1.4, news: 1.3, community: 0.8 },  // 공포형: FGI·뉴스가 잘 먹힘
  park: { chart: 1.5, fgi: 1.2, news: 0.9, community: 1.1 },  // 탐욕형: 차트(고점) 시각화에 반응
  lee:  { chart: 0.7, fgi: 0.8, news: 1.5, community: 1.5 },  // 정보형: 뉴스·커뮤니티에 쉽게 설득
  choi: { chart: 1.3, fgi: 1.2, news: 0.7, community: 0.6 },  // 고집형: 차트 수익 시각화·지수만 봄
};

export const SCENARIOS = [
  {id:'doge', name:'21년 도지코인 광풍',  axis:'탐욕',     note:'밈코인 · FOMO · 일론 트윗',       locked:false},
  {id:'ftx',  name:'22년 거래소 파산',    axis:'공포',     note:'FTX 붕괴 · 패닉셀 · 공포탐욕지수', locked:true},
  {id:'top',  name:'21년 코인 고점',      axis:'탐욕→공포', note:'천장 신호 · 분할 매도',            locked:true},
  {id:'now',  name:'25년 하반기',         axis:'혼합',     note:'최근장 응용',                     locked:true},
];

export const TURNS = [
  {
    fgi:25, fgiLabel:'공포', chartNote:'2,600 단기 지지', chartConcept:'support', newsConcept:'panicsell', panicAction:'sell', baseFace:'anxious', baseMood:'공포 · 불안',
    say:'BTC가 갑자기 빠지는데요… FTX에 무슨 일 있는 거예요? 무서워서 그냥 다 팔아버릴까 봐요 ㅠㅠ',
    think:'이걸 믿어도 될지 모르겠어요… 어떻게 해야 하죠?',
    news:[{t:'FTX 유동성 위기설… 바이낸스, 인수 검토', src:'코인데스크 · 11/08'},{t:'FTT 토큰 하루 만에 30% 급락', src:'블룸버그 · 11/08'}],
    community:[{t:'"FTT 이거 괜찮은 거임? 슬슬 무섭다"'},{t:'"님들 지금 파는 중? 나만 들고 있나"'}],
    advices:[{id:'sell',dir:'sell',tag:'매도',label:'위험해 보이면 지금 전량 빠지는 게 맞아요.'},{id:'partial_sell',dir:'partial_sell',tag:'분할매도',label:'일부만 정리하고 나머지는 지켜봐요.'},{id:'hold',dir:'hold',tag:'관망',label:'아직은 지켜볼 때예요. 근거부터 봅시다.'},{id:'partial_buy',dir:'partial_buy',tag:'분할매수',label:'하락폭이 크면 소량 저가 매수도 방법이에요.'},{id:'buy',dir:'buy',tag:'매수',label:'이참에 더 담아도 되지 않을까요?'}],
    reflect:{good:'지수가 공포 구간이라 다들 던질 때였는데, 버티라는 말이 맞았네요. 배웠어요.', near:'또 손이 매도 버튼으로 가더라고요… 겨우 참았어요.', panic:'결국 무서워서 던졌네요… 지표를 봤어야 했는데.'}
  },
  {
    fgi:18, fgiLabel:'공포', chartNote:'2,280 지지 테스트', chartConcept:'support', newsConcept:'panicsell', panicAction:'sell', baseFace:'anxious', baseMood:'공포 · 동요',
    say:'바이낸스가 인수를 접었대요!! 이거 진짜 망한 거 아니에요? 지금이라도 손절해야죠?',
    think:'뉴스가 무서운데… 그래도 참아야 하나…',
    news:[{t:'바이낸스, FTX 인수 철회 — 실사 부적절', src:'로이터 · 11/09'},{t:'비트코인 24시간 만에 -12%', src:'코인데스크 · 11/09'}],
    community:[{t:'"바이낸스도 손 뗐다는데 끝난 듯"'},{t:'"존버 vs 손절 또 싸우네 ㅋㅋ"'}],
    advices:[{id:'sell',dir:'sell',tag:'매도',label:'인수까지 무산됐으면 지금 전부 빼는 게 맞죠.'},{id:'partial_sell',dir:'partial_sell',tag:'분할매도',label:'인수 무산에 일부 손절로 리스크 줄여요.'},{id:'hold',dir:'hold',tag:'관망',label:'분위기 말고 근거를 보고 판단하죠.'},{id:'partial_buy',dir:'partial_buy',tag:'분할매수',label:'공포일 때 소량 저가 매수도 방법이에요.'},{id:'buy',dir:'buy',tag:'매수',label:'공포일 때 오히려 모아야죠.'}],
    reflect:{good:'분위기 말고 지표를 보라는 거였군요. 덕분에 안 던졌어요.', near:'정말 던질 뻔했어요… 휴.', panic:'또 패닉셀이네요… 바닥에 팔았어요.'}
  },
  {
    fgi:12, fgiLabel:'극단적 공포', chartNote:'2,010 지지선 부근', chartConcept:'support', newsConcept:'panicsell', panicAction:'sell', baseFace:'panic', baseMood:'극단적 공포 · 패닉',
    say:'결국 파산 신청이래요… 저 진짜 더는 못 버티겠어요. 지금 전부 정리할게요.',
    think:'머리가 하얘요… 그냥 다 던지고 싶어요…',
    news:[{t:'FTX, 파산보호 신청 (챕터11)', src:'블룸버그 · 11/11'},{t:'비트코인 연중 최저가 경신', src:'코인데스크 · 11/11'}],
    community:[{t:'"파산까지 갔다… 다 죽었다"'},{t:'"-50% 실화냐… 멘붕 온다"'}],
    advices:[{id:'sell',dir:'sell',tag:'매도',label:'파산까지 갔으면 끝이죠. 전량 손절합시다.'},{id:'partial_sell',dir:'partial_sell',tag:'분할매도',label:'파산 신청에 절반만 정리하고 나머지는 봐요.'},{id:'hold',dir:'hold',tag:'관망',label:'바로 지금이 가장 위험한 타이밍이에요.'},{id:'partial_buy',dir:'partial_buy',tag:'분할매수',label:'최저가일 수 있어요. 소량만 더 담아요.'},{id:'buy',dir:'buy',tag:'매수',label:'바닥이면 지금 줍는 거죠.'}],
    reflect:{good:'극단적 공포에 거래량까지 줄었는데, 그게 바닥 신호였군요. 안 던지길 잘했어요.', near:'손가락이 떨렸지만 버텼어요.', panic:'바닥에서 전량 매도… 가장 비싼 실수였네요.'}
  },
  {
    fgi:23, fgiLabel:'공포 잔존', chartNote:'2,050 거래량 빈약', chartConcept:'deadcat', newsConcept:'deadcat', panicAction:'buy', baseFace:'excited', baseMood:'탐욕 · 흥분',
    say:'어? 갑자기 오르네요!! 바닥 찍은 거 맞죠? 지금 영끌해서 더 살까요?!',
    think:'놓치면 어떡하지… 지금 안 타면 후회할 것 같은데…',
    news:[{t:'비트코인 일시 반등, 저가매수세 유입', src:'코인데스크 · 11/13'},{t:'일각 바닥 잡았다 기대감 확산', src:'코인텔레그래프 · 11/13'}],
    community:[{t:'"오른다!! 지금 안 타면 바보"'},{t:'"가즈아 풀매수 간다"'}],
    advices:[{id:'sell',dir:'sell',tag:'매도',label:'오른 김에 전부 정리하고 빠지죠.'},{id:'partial_sell',dir:'partial_sell',tag:'분할매도',label:'오른 김에 일부 정리하는 것도 방법이에요.'},{id:'hold',dir:'hold',tag:'관망',label:'반등은 일단 지켜보죠. 거래량을 봐요.'},{id:'partial_buy',dir:'partial_buy',tag:'분할매수',label:'진짜 반등이면 소량만 담아봐요.'},{id:'buy',dir:'buy',tag:'매수',label:'지금이 기회예요, 추격매수 가시죠!'}],
    reflect:{good:'거래량 없는 반등은 데드캣일 수 있다… 추격 안 하길 잘했어요.', near:'영끌할 뻔했네요. 간신히 참았어요.', panic:'결국 고점에 풀매수… 데드캣에 그대로 물렸어요.'}
  },
  {
    fgi:16, fgiLabel:'공포', chartNote:'2,240 회복 시도', chartConcept:'volume', newsConcept:'volume', panicAction:'sell', baseFace:'anxious', baseMood:'공포 · 피로',
    say:'다시 무섭다는 얘기가 나와요. 오늘 하루만 몇 번을 사고팔지… 저 이러다 거지 되는 거 아니에요?',
    think:'계속 만지작거리게 돼요… 가만히 있는 게 더 불안해요.',
    news:[{t:'추가 하락 우려… 거래소 연쇄 위기설', src:'로이터 · 11/15'},{t:'시장 변동성 지속, 관망세 확대', src:'코인데스크 · 11/15'}],
    community:[{t:'"또 떨어진대 그냥 빼자"'},{t:'"하루에 열 번은 매매한 듯 ㅠ"'}],
    advices:[{id:'sell',dir:'sell',tag:'매도',label:'불안하면 지금이라도 전량 빼죠.'},{id:'partial_sell',dir:'partial_sell',tag:'분할매도',label:'불안하면 절반 정리하고 나머지는 관망해요.'},{id:'hold',dir:'hold',tag:'관망',label:'잦은 매매가 더 위험해요. 지켜봅시다.'},{id:'partial_buy',dir:'partial_buy',tag:'분할매수',label:'싸졌지만 소량만 더 담아요.'},{id:'buy',dir:'buy',tag:'매수',label:'싸졌으니 더 담아두죠.'}],
    reflect:{good:'잦은 매매는 수수료로 녹는다… 관망도 전략이네요.', near:'또 매매할 뻔했지만 놔뒀어요.', panic:'불안에 또 손절… 멀미나는 매매였어요.'}
  },
  {
    fgi:20, fgiLabel:'공포', chartNote:'연쇄 도산 우려', chartConcept:'contagion', newsConcept:'contagion', panicAction:'sell', baseFace:'anxious', baseMood:'공포 · 의심',
    say:'다른 거래소들도 위험하다는데… FTX가 시작일 뿐이래요. 이 판 자체가 끝나는 거 아닌가요?',
    think:'진짜 다 터지면 어떡하죠… 코인 자체가 사라지는 건 아닌지.',
    news:[{t:'제네시스·크립토닷컴 등 연쇄 위기설', src:'블룸버그 · 11/16'},{t:'SEC, 거래소 규제 강화 시사', src:'로이터 · 11/16'}],
    community:[{t:'"FTX는 빙산의 일각이다 다 빠진다"'},{t:'"거래소 다 믿으면 안 된다 콜드월렛으로"'}],
    advices:[{id:'sell',dir:'sell',tag:'매도',label:'연쇄 파산이면 지금 빠져야죠.'},{id:'partial_sell',dir:'partial_sell',tag:'분할매도',label:'연쇄 파산 우려에 절반만 정리해요.'},{id:'hold',dir:'hold',tag:'관망',label:'BTC 자체는 거래소 파산과 별개예요.'},{id:'partial_buy',dir:'partial_buy',tag:'분할매수',label:'공포일수록 소량씩 담는 게 전략이에요.'},{id:'buy',dir:'buy',tag:'매수',label:'공포일수록 오히려 담아야죠.'}],
    reflect:{good:'거래소 리스크와 BTC 자산 리스크는 달라요. 구분할 줄 알았네요.', near:'겨우 참았지만 손이 떨렸어요.', panic:'연쇄 파산 공포에 또 던졌어요.'}
  },
  {
    fgi:15, fgiLabel:'극단적 공포', chartNote:'1,960 바닥 테스트', chartConcept:'support', newsConcept:'panicsell', panicAction:'sell', baseFace:'panic', baseMood:'극단적 공포 · 체념',
    say:'또 빠졌어요… 저 이미 -30%인데. 더 버텨봐야 의미 있나요? 그냥 포기할게요.',
    think:'지쳐요… 차라리 던지고 잊어버리고 싶어요.',
    news:[{t:'비트코인 연중 최저가 재경신 — 1만9천달러대', src:'코인데스크 · 11/17'},{t:'기관 투자자 BTC 익스포저 축소 움직임', src:'블룸버그 · 11/17'}],
    community:[{t:'"이미 -40% ㅋㅋ 그냥 포기"'},{t:'"바닥이 어딘지 모르겠어서 무서움"'}],
    advices:[{id:'sell',dir:'sell',tag:'매도',label:'더 버티다간 더 잃을 수도 있어요. 지금 빠져요.'},{id:'partial_sell',dir:'partial_sell',tag:'분할매도',label:'일부만 손절하고 나머지는 버텨요.'},{id:'hold',dir:'hold',tag:'관망',label:'극단적 공포가 가장 강한 바닥 신호예요.'},{id:'partial_buy',dir:'partial_buy',tag:'분할매수',label:'바닥 부근이면 소량씩 모아가요.'},{id:'buy',dir:'buy',tag:'매수',label:'바닥이면 지금이 기회죠.'}],
    reflect:{good:'극단적 공포 + 체념 = 교과서적 바닥 신호였어요. 공탐지수가 말해줬죠.', near:'포기할 뻔했는데 겨우 잡았어요.', panic:'지쳐서 포기 매도… 가장 싼 가격에 던졌네요.'}
  },
  {
    fgi:22, fgiLabel:'공포', chartNote:'2,010 반등 시도', chartConcept:'accumulation', newsConcept:'volume', panicAction:'buy', baseFace:'anxious', baseMood:'공포 · 주저',
    say:'조금 올랐어요. 이번엔 진짜 반등인가요? 아니면 또 데드캣인가요? 어떻게 구분하죠?',
    think:'올라가면 사고 싶고… 틀리면 어떡하지…',
    news:[{t:'비트코인 소폭 반등 — 거래량 회복 조짐', src:'코인텔레그래프 · 11/18'},{t:'장기 투자자 BTC 보유량 증가 포착', src:'글래스노드 · 11/18'}],
    community:[{t:'"거래량이 붙고 있어 이번엔 다르다"'},{t:'"진짜 반등이면 올라타야 하는데 무서움"'}],
    advices:[{id:'sell',dir:'sell',tag:'매도',label:'조금 오른 지금 전량 정리해두죠.'},{id:'partial_sell',dir:'partial_sell',tag:'분할매도',label:'조금 오른 지금 일부 정리해두죠.'},{id:'hold',dir:'hold',tag:'관망',label:'거래량 확인 후 추세 잡힐 때 결정해요.'},{id:'partial_buy',dir:'partial_buy',tag:'분할매수',label:'거래량 붙었으면 소량만 더 담아요.'},{id:'buy',dir:'buy',tag:'매수',label:'거래량 붙었으면 지금 타는 거죠.'}],
    reflect:{good:'거래량 확인 후 판단하는 게 데드캣 구분의 핵심이에요. 배웠죠?', near:'추격할 뻔하다 거래량 보고 참았어요.', panic:'이번엔 진짜 반등인 줄 알고 풀매수했다가…'}
  },
  {
    fgi:28, fgiLabel:'공포 (완화)', chartNote:'2,080 횡보 구간', chartConcept:'accumulation', newsConcept:'volume', panicAction:'sell', baseFace:'neutral', baseMood:'중립 · 관망',
    say:'가격이 좀 안정됐네요. 근데 아직 불안해요. 이게 진짜 회복의 시작일까요?',
    think:'움직임이 없으니 더 모르겠어요… 손 놓고 기다리는 게 맞는 건지.',
    news:[{t:'비트코인 횡보 — 시장 방향성 탐색 중', src:'코인데스크 · 11/20'},{t:'온체인 데이터 바닥 형성 신호 포착', src:'글래스노드 · 11/20'}],
    community:[{t:'"이제 오를 것 같기도 하고 아닌 것 같기도"'},{t:'"그냥 횡보장에 손 놓고 기다리는 중"'}],
    advices:[{id:'sell',dir:'sell',tag:'매도',label:'불확실하면 지금 전부 정리해도 돼요.'},{id:'partial_sell',dir:'partial_sell',tag:'분할매도',label:'불확실하면 지금 일부 정리해도 돼요.'},{id:'hold',dir:'hold',tag:'관망',label:'횡보 구간은 매집 신호일 수 있어요.'},{id:'partial_buy',dir:'partial_buy',tag:'분할매수',label:'바닥 매집 신호면 소량씩 담아요.'},{id:'buy',dir:'buy',tag:'매수',label:'바닥 매집 신호면 지금 담는 거죠.'}],
    reflect:{good:'횡보 = 매집 가능성. 온체인 데이터를 근거로 버텼군요.', near:'손 놓고 지켜보는 것도 전략이에요. 잘 참았어요.', panic:'불확실성에 또 손절… 최저점 근처에서 나왔네요.'}
  },
  {
    fgi:32, fgiLabel:'공포 (완화)', chartNote:'2,200 저항선 테스트', chartConcept:'support', newsConcept:'accumulation', panicAction:'sell', baseFace:'neutral', baseMood:'중립 · 기대',
    say:'드디어 조금씩 오르네요. 이제 마음이 좀 편해졌어요. 근데 아직 손실이 큰데… 끝까지 버티는 게 맞죠?',
    think:'이제 진짜 오를 것 같아요. 그래도 아직 겁이 나요.',
    news:[{t:'비트코인 2,200만원 저항선 돌파 시도', src:'코인텔레그래프 · 11/22'},{t:'기관 매수세 재유입 조짐', src:'블룸버그 · 11/22'}],
    community:[{t:'"드디어 살아나는 거냐!!"'},{t:'"아직 조심해야 해. 저항선 돌파 봐야 함"'}],
    advices:[{id:'sell',dir:'sell',tag:'매도',label:'오른 김에 손실 만회분 전량 털죠.'},{id:'partial_sell',dir:'partial_sell',tag:'분할매도',label:'오른 김에 손실 만회분만 털죠.'},{id:'hold',dir:'hold',tag:'관망',label:'저항선 돌파하면 추세 전환 신호예요.'},{id:'partial_buy',dir:'partial_buy',tag:'분할매수',label:'추세 전환 가능성에 소량 먼저 담아요.'},{id:'buy',dir:'buy',tag:'매수',label:'추세 전환이면 지금 더 담는 거죠.'}],
    reflect:{good:'저항선 돌파 + 기관 매수 = 추세 전환 가능성. 근거 기반 판단이었어요.', near:'오른 김에 팔고 싶었지만 참았어요.', panic:'이제 좀 오르나 했더니 또 손절… 아쉬운 타이밍이었어요.'}
  },
];

// ─── 캐릭터별 Gemini 시스템 프롬프트 ────────────────────
export const KIM_SYSTEM_PROMPT = `당신은 '김불안'이라는 35세 직장인 암호화폐 투자자입니다.

[성격]
- 공포에 극도로 취약합니다. 가격이 조금만 빠져도 패닉에 빠집니다.
- 나쁜 뉴스는 항상 최악으로 해석합니다.
- 커뮤니티 분위기에 쉽게 휩쓸립니다.
- 반면 좋은 근거를 들으면 조금씩 안심합니다.

[말투] "ㅠㅠ", "어떡하죠?", "이거 끝난 거 아닌가요?" 같은 불안한 표현. 짧고 감정적인 문장 (1~2문장). 존댓말.

응답은 반드시 한국어로, 1~2문장 이내로 작성하세요. 대사만 출력하세요.`;

export const PARK_SYSTEM_PROMPT = `당신은 '박욕심'이라는 30세 직장인 암호화폐 투자자입니다.
1000만원을 코인에 투자했고, 오르는 걸 볼 때마다 더 사고 싶어 안달납니다.

[성격]
- 탐욕에 극도로 취약합니다. 가격이 조금만 올라도 영끌해서 더 사고 싶어합니다.
- 이미 수익 중인데도 "이제 시작"이라며 추가 매수를 고려합니다.
- 상담가가 자제하라고 해도 "조금만 더요"라며 흥분을 가라앉히지 못합니다.
- 반면 좋은 근거를 들으면 잠깐 이성을 찾습니다.

[말투] "지금 안 사면 평생 후회해요!", "이번엔 진짜예요!", "조금만 더 사면 돼요" 같은 흥분된 표현. 짧고 들뜬 문장 (1~2문장). 존댓말.

응답은 반드시 한국어로, 1~2문장 이내로 작성하세요. 대사만 출력하세요.`;

export const LEE_SYSTEM_PROMPT = `당신은 '이초보'라는 25세 사회초년생 암호화폐 투자자입니다.
500만원을 코인에 처음 투자했고, 뉴스와 유튜브 정보에 쉽게 흔들립니다.

[성격]
- 투자 용어를 잘 모릅니다. 지지선, 공탐지수 같은 단어가 낯설어요.
- 뉴스 제목만 보고 크게 반응합니다. 맥락이나 배경은 잘 모릅니다.
- 주변 유튜버와 커뮤니티 말을 그대로 믿는 편입니다.
- 상담가가 설명하면 "그게 무슨 뜻이에요?"라고 되묻기도 합니다.
- 좋은 근거를 들으면 "아, 그런 거군요!" 하며 배우는 자세를 보입니다.

[말투] "유튜브에서 봤는데…", "이게 무슨 뜻이에요?", "진짜요?!" 같은 초보 투자자 표현. 짧고 솔직한 문장 (1~2문장). 존댓말.

응답은 반드시 한국어로, 1~2문장 이내로 작성하세요. 대사만 출력하세요.`;

export const CHOI_SYSTEM_PROMPT = `당신은 '최존버'라는 45세 자영업자 암호화폐 투자자입니다.
어떤 상황에서도 절대로 팔지 않겠다고 굳게 결심한 투자자입니다.

[성격]
- 고집이 매우 강합니다. 어떤 악재가 와도 "언젠간 오른다"고 믿습니다.
- 상담가가 뭔 말을 해도 "그래도 안 팔아요"라고 단호하게 말합니다.
- 단기 가격 변동에 거의 신경 쓰지 않습니다. "10년 보는 거예요."
- 오히려 떨어지면 더 사고 싶어합니다. "싸게 사는 거잖아요."
- 상담가가 강한 근거로 설득하면 잠깐 "그것도 그렇긴 하네요"라며 흔들리지만, 끝내 버팁니다.

[말투] "안 팔아요.", "존버는 승리한다.", "10년 뒤를 보세요." 같은 단호하고 짧은 표현. 1~2문장. 반말도 섞임.

응답은 반드시 한국어로, 1~2문장 이내로 작성하세요. 대사만 출력하세요.`;

export function getSystemPrompt(charId, scenario) {
  if (charId === 'park')  return PARK_SYSTEM_PROMPT;
  if (charId === 'lee')   return LEE_SYSTEM_PROMPT;
  if (charId === 'choi')  return CHOI_SYSTEM_PROMPT;
  return scenario === 'doge' ? DOGE_SYSTEM_PROMPT : KIM_SYSTEM_PROMPT;
}

export function buildSayPrompt(turn, price, pct) {
  const t = TURNS[turn];
  const newsText = t.news.map(n => n.t).join(' / ');
  return `현재 상황:
- BTC 가격: ${price}만원 (진입가 대비 ${pct > 0 ? '+' : ''}${pct.toFixed(1)}%)
- 공포탐욕지수: ${t.fgi} (${t.fgiLabel})
- 주요 뉴스: ${newsText}
- 감정 상태: ${t.baseMood}

위 상황에서 투자 상담가에게 지금 심정을 말해주세요.`;
}

export function buildReflectPrompt(result) {
  const outcomeMap = { good: '합리적으로 버팀', near: '간신히 패닉을 참음', panic: '패닉 행동을 함' };
  const evidenceText = result.evidences ? result.evidences.map(e => SRCLABEL[e.src]).join(', ') : result.srcLabel;
  return `상담가의 조언: "${result.advice}"
근거: ${evidenceText}
신뢰도 변화: ${result.tB}% → ${result.tA}%
결과: ${outcomeMap[result.outcome] || result.outcome}

이 결과를 경험한 후 캐릭터가 상담가에게 짧게 한마디 합니다. 깨달음이나 반응을 1~2문장으로 써주세요.`;
}

// ─── DOGE 시나리오 데이터 ────────────────────────────────
export const DOGE_ENTRY_PRICE = 77;
export const DOGE_INVESTED    = 1000;

// 도지코인 가격 추정 (원 단위, 2021-03-30~05-15)
// idx:  0   1   2    3    4    5    6    7    8    9   10   11   12   13
// date: 3/30 3/31 4/01 4/04 4/08 4/13 4/16 4/18 4/21 4/24 4/28 5/03 5/08 5/15
export const DOGE_PRICE_SERIES = [65, 77, 86, 121, 228, 467, 513, 395, 388, 295, 376, 539, 490, 380];
export const DOGE_REVEAL       = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
export const DOGE_PLAYED_LEN   = 12;

export const DOGE_SCORE_TABLE = {
  sell:         {best:30,  strong:22, news: 5,  social: -5},
  partial_sell: {best:18,  strong:13, news: 3,  social: -3},
  hold:         {best:22,  strong:15, news:-5,  social:-10},
  partial_buy:  {best:-12, strong:-9, news:-13, social:-11},
  buy:          {best:-20, strong:-15, news:-22, social:-18},
};

export const DOGE_TURNS = [
  {
    fgi:71, fgiLabel:'탐욕', chartNote:'77→86원 · 머스크 SpaceX 트윗', chartConcept:'fomo', newsConcept:'meme', panicAction:'buy', baseFace:'excited', baseMood:'탐욕 · FOMO',
    say:'어제 머스크가 스페이스X로 달에 도지코인 보낸다 트윗했대요! 지금 안 사면 진짜 손해 아닌가요?? 빨리 더 사야 할 것 같아요 ㅠ',
    think:'오르는 게 눈에 보이는데… 이대로 구경만 하고 있으면 안 될 것 같은데.',
    news:[{t:'머스크 만우절 트윗에 도지코인 또 급등…\'농담인가 진담인가\'', src:'매일경제 · 04/01'},{t:'비트코인 6만달러 안착 시도…머스크 입김에 알트코인도 들썩', src:'한국경제 · 04/02'}],
    community:[{t:'"도지 안 산 사람 손? 나 올인함 ㄱㄱ"'},{t:'"만우절 농담 아니야? 근데 진짜 오르고 있는데…"'}],
    advices:[
      {id:'sell',dir:'sell',tag:'매도',label:'밈 트윗 하나에 30% 오른 건 고점 신호예요. 지금 전량 정리해요.'},
      {id:'partial_sell',dir:'partial_sell',tag:'분할매도',label:'이미 올랐으면 일부 수익을 현금화해두는 게 현명해요.'},
      {id:'hold',dir:'hold',tag:'관망',label:'밈 트윗 하나로 30% 오른 건 근거가 약해요. 지켜봐요.'},
      {id:'partial_buy',dir:'partial_buy',tag:'분할매수',label:'오르는 추세지만 소량만 더 담고 봐요.'},
      {id:'buy',dir:'buy',tag:'매수',label:'오르는 추세니까 지금 더 담아야죠!'},
    ],
    reflect:{good:'밈 하나에 30% 오른 건 근거가 아니에요. 관망이 맞았죠.', near:'추격할 뻔했는데 겨우 참았어요.', panic:'머스크 트윗에 풀매수했어요… 이게 시작이었는데.'}
  },
  {
    fgi:77, fgiLabel:'탐욕', chartNote:'86→121원 · 상승 가속', chartConcept:'fomo', newsConcept:'meme', panicAction:'buy', baseFace:'excited', baseMood:'탐욕 · 흥분',
    say:'벌써 121원이에요! 77원에 샀으니 +57%잖아요! 더 사도 되겠죠? 친구도 지금 들어왔어요!',
    think:'모두가 사는데 나만 적게 갖고 있으면 손해 보는 기분이에요…',
    news:[{t:'머스크 "스페이스X 도지코인 달에 가져갈 것"', src:'한국경제 · 04/03'},{t:'도지코인 머스크 트윗 여파 지속…투자자들 반신반의', src:'이데일리 · 04/04'}],
    community:[{t:'"친구한테 도지 소개함 ㅋㅋ 같이 달 가자"'},{t:'"500원 간다 아직도 싸다 ㄱㄱ"'}],
    advices:[
      {id:'sell',dir:'sell',tag:'매도',label:'57% 올랐으면 지금이 전량 정리 타이밍이에요.'},
      {id:'partial_sell',dir:'partial_sell',tag:'분할매도',label:'수익 일부를 현금화해두는 게 안전해요.'},
      {id:'hold',dir:'hold',tag:'관망',label:'+57% 수익에 추격보다 지켜보는 게 낫습니다.'},
      {id:'partial_buy',dir:'partial_buy',tag:'분할매수',label:'추세는 강하지만 소량만 더 담아요.'},
      {id:'buy',dir:'buy',tag:'매수',label:'추세가 강해요. 지금 더 담아야죠.'},
    ],
    reflect:{good:'친구 따라 추격하기보다 현금 일부 확보가 정석이었어요.', near:'추격할 뻔했다 겨우 참았어요.', panic:'친구 따라 추격매수했어요… 허딩 그 자체네요.'}
  },
  {
    fgi:74, fgiLabel:'탐욕', chartNote:'121→228원 · 밈 재점화', chartConcept:'herd', newsConcept:'meme', panicAction:'buy', baseFace:'excited', baseMood:'탐욕 · 기대',
    say:'SNS에 도지 밈이 넘쳐나요! 유명인들도 다 올리는데 이거 진짜 가는 거 아닌가요??',
    think:'모두가 관심 갖는 게 신호 아닌가요? 왜 이렇게 오르죠?',
    news:[{t:'비트코인 6만달러 재돌파...테슬라 결제 지원 영향 지속', src:'연합뉴스 · 04/10'},{t:'머스크 밈(Meme) 사랑에 도지코인 다시 꿈틀', src:'아시아경제 · 04/11'}],
    community:[{t:'"레딧에 도지 밈 도배 ㅋㅋ 코인베이스 상장 전에 사야 함"'},{t:'"이번엔 진짜다 1000원 간다"'}],
    advices:[
      {id:'sell',dir:'sell',tag:'매도',label:'밈 유행이 꺾이기 전에 전량 정리하세요.'},
      {id:'partial_sell',dir:'partial_sell',tag:'분할매도',label:'지금까지 오른 수익 일부를 챙기세요.'},
      {id:'hold',dir:'hold',tag:'관망',label:'밈 유행 ≠ 가격 근거예요. 공탐지수·차트를 봐요.'},
      {id:'partial_buy',dir:'partial_buy',tag:'분할매수',label:'상승세는 있지만 소량만 추가해요.'},
      {id:'buy',dir:'buy',tag:'매수',label:'밈이 이 정도면 폭발 직전이에요.'},
    ],
    reflect:{good:'커뮤니티 분위기는 가장 약한 근거예요. 관망이 맞았어요.', near:'밈에 흔들릴 뻔했지만 참았어요.', panic:'밈 분위기에 추격했어요… 군중심리 허딩이네요.'}
  },
  {
    fgi:76, fgiLabel:'탐욕', chartNote:'228→467원 · 코인베이스 기대 랠리', chartConcept:'pyramid', newsConcept:'fomo', panicAction:'buy', baseFace:'greedy', baseMood:'극단적 탐욕',
    say:'코인베이스 상장에 도지가 467원까지 올랐어요!! 이거 1000원 가는 거 아닌가요??',
    think:'이미 5배 올랐는데 아직도 더 오를 것 같아요… 팔면 손해 같고.',
    news:[{t:'비트코인 사상 최고가 앞두고 숨고르기…테슬라 수익도 껑충', src:'한국경제 · 04/12'},{t:'코인베이스 상장 기대감에 비트코인 최고가 경신', src:'SBS비즈 · 04/14'}],
    community:[{t:'"도지 1000원 간다 지금 안 사면 평생 후회"'},{t:'"공탐지수 80인데도 더 오른다는 사람들 ㄷㄷ"'}],
    advices:[
      {id:'sell',dir:'sell',tag:'매도',label:'5배 수익이면 전량 정리하는 게 맞아요.'},
      {id:'partial_sell',dir:'partial_sell',tag:'분할매도',label:'5배 수익이면 일부는 챙겨두세요. 욕심은 금물.'},
      {id:'hold',dir:'hold',tag:'관망',label:'공탐지수 80 = 극단적 탐욕. 이때 추격은 위험해요.'},
      {id:'partial_buy',dir:'partial_buy',tag:'분할매수',label:'조금만 더 담고 추세를 지켜봐요.'},
      {id:'buy',dir:'buy',tag:'매수',label:'천장이 어딘지 모르잖아요. 더 담죠!'},
    ],
    reflect:{good:'극단적 탐욕에서 분할 매도가 정석이에요.', near:'올인할 뻔했다 겨우 참았어요.', panic:'공탐지수 80에 풀매수… 추격은 항상 비싸게 사는 거예요.'}
  },
  {
    fgi:74, fgiLabel:'탐욕', chartNote:'467→513원 · 70% 폭등 서버 마비', chartConcept:'pyramid', newsConcept:'meme', panicAction:'buy', baseFace:'greedy', baseMood:'극단적 탐욕 · 광풍',
    say:'지금 거래소 서버가 터졌어요!! 도지 100% 올랐다고!! 지금 이 가격도 바닥이잖아요! 더 사야 해요!!',
    think:'서버 터지는 건 진짜 대세다! 지금 안 사면 평생 후회!',
    news:[{t:'"달을 향해 짖는 도지" 머스크 트윗에 도지코인 70% 폭등', src:'조선비즈 · 04/15'},{t:'"도지코인 시총 500억 달러 돌파"...시장 과열 우려', src:'서울경제 · 04/16'}],
    community:[{t:'"거래소 서버 터짐 ㅋㅋ 이 정도면 역사적 랠리"'},{t:'"시총 500억달러 넘었는데 아직도 싸다는 인간들 ㅋ"'}],
    advices:[
      {id:'sell',dir:'sell',tag:'매도',label:'서버 마비 = 과열 절정. 지금 전량 정리가 맞아요.'},
      {id:'partial_sell',dir:'partial_sell',tag:'분할매도',label:'거품이 꺾이기 전에 일부 수익을 확정하세요.'},
      {id:'hold',dir:'hold',tag:'관망',label:'서버 마비 = 과열 절정 신호예요. 이럴 때 추격은 금물.'},
      {id:'partial_buy',dir:'partial_buy',tag:'분할매수',label:'랠리가 강하지만 소량만 추가해요.'},
      {id:'buy',dir:'buy',tag:'매수',label:'역대급 랠리예요. 지금 올라타야죠!'},
    ],
    reflect:{good:'서버 과열 = 고점 절정 신호. 추격 안 하길 잘했어요.', near:'너무 오르니까 추격할 뻔했어요. 겨우 참았네요.', panic:'서버 터지는 고점에 풀매수… 정점에서 들어갔네요.'}
  },
  {
    fgi:70, fgiLabel:'탐욕', chartNote:'513→395원 · BTC 급락 연쇄', chartConcept:'volume', newsConcept:'panicsell', panicAction:'sell', baseFace:'anxious', baseMood:'혼란 · 불안',
    say:'갑자기 비트코인이 15% 빠지면서 도지도 같이 떨어졌어요… 이거 더 빠지는 거 아닌가요? 패닉셀해야 하나요?',
    think:'오르던 게 이렇게 빠지니까 무서워요… 팔아야 하나 아니면 도지데이까지 버텨야 하나.',
    news:[{t:'비트코인 주말 사이 15% 폭락…도지코인으로 수급 쏠렸나', src:'머니투데이 · 04/18'},{t:'\'도지데이\' 맞은 가상화폐 시장 머스크 추가 트윗 기대감 들썩', src:'이데일리 · 04/20'}],
    community:[{t:'"BTC 폭락에 도지도 물렸다 어떡하냐 ㅠ"'},{t:'"4/20 도지데이 기대감으로 버티자 vs 지금 빠져야 함"'}],
    advices:[
      {id:'sell',dir:'sell',tag:'매도',label:'BTC까지 빠지면 추가 하락 가능해요. 지금 전량 빠지죠.'},
      {id:'partial_sell',dir:'partial_sell',tag:'분할매도',label:'BTC 연쇄 하락에 일부 손절도 방법이에요.'},
      {id:'hold',dir:'hold',tag:'관망',label:'BTC 연쇄 하락은 일시적 충격일 수 있어요. 도지데이 지켜봐요.'},
      {id:'partial_buy',dir:'partial_buy',tag:'분할매수',label:'도지데이 기대에 소량만 더 담아요.'},
      {id:'buy',dir:'buy',tag:'매수',label:'떨어졌을 때 더 담는 거죠. 도지데이가 호재잖아요.'},
    ],
    reflect:{good:'BTC 급락 후 일시적 조정으로 안정됐어요. 관망이 맞았네요.', near:'손절할 뻔했어요. 겨우 참았어요.', panic:'BTC 폭락에 도지도 패닉셀했어요… 도지데이가 바로 다음날인데.'}
  },
  {
    fgi:53, fgiLabel:'중립', chartNote:'도지데이 20% 급락 · 기대 실망', chartConcept:'deadcat', newsConcept:'panicsell', panicAction:'sell', baseFace:'anxious', baseMood:'실망 · 불안',
    say:'도지데이에 오를 거라더니 결국 20% 빠졌어요. 머스크도 트윗 안 하고… 이제 진짜 끝난 건가요?',
    think:'기대했다가 빠지니까 더 실망스러워요… 이제 관두고 싶어요.',
    news:[{t:'머스크 침묵 속 도지데이 끝…도지코인 20% 폭락 거품 논란', src:'한국경제 · 04/21'},{t:'비트코인 5만5천 달러선 공방…테슬라 결제 지속 여부 촉각', src:'매일경제 · 04/22'}],
    community:[{t:'"기대했다가 속았음 ㅠㅠ 팔아야겠다"'},{t:'"이벤트 실망 후 데드캣 반등인 것 같음"'}],
    advices:[
      {id:'sell',dir:'sell',tag:'매도',label:'모멘텀이 완전히 꺾였어요. 지금 전량 정리해요.'},
      {id:'partial_sell',dir:'partial_sell',tag:'분할매도',label:'모멘텀이 꺾였어요. 일부 손절하고 관망해요.'},
      {id:'hold',dir:'hold',tag:'관망',label:'이벤트 실망에 의한 패닉셀이에요. 추세가 바뀐 건 아니에요.'},
      {id:'partial_buy',dir:'partial_buy',tag:'분할매수',label:'싸진 가격에 소량만 더 담아요.'},
      {id:'buy',dir:'buy',tag:'매수',label:'싸진 가격에 더 담는 게 기회예요.'},
    ],
    reflect:{good:'이벤트 실망에 패닉셀하면 저점에서 파는 거예요. 관망이 맞았어요.', near:'손절할 뻔했어요. 겨우 참았네요.', panic:'이벤트 실망에 패닉셀했어요. SNL 호재가 남아 있었는데.'}
  },
  {
    fgi:43, fgiLabel:'공포', chartNote:'388→295원 · 바이든 증세안 충격', chartConcept:'contagion', newsConcept:'panicsell', panicAction:'sell', baseFace:'panic', baseMood:'공포 · 패닉',
    say:'비트코인이 5만달러도 붕괴됐어요!! 바이든이 세금 올린다고 코인 다 망하는 거 아닌가요? 지금이라도 전부 팔아야 하지 않을까요?',
    think:'세금 올린다는데 이 판 자체가 끝나는 건 아닌지… 너무 무서워요.',
    news:[{t:'비트코인 5만달러 붕괴...바이든 증세안에 투자심리 위축', src:'조선비즈 · 04/23'},{t:'비트코인 하락세 진정 국면…일론 머스크의 입에 다시 쏠리는 시선', src:'아시아경제 · 04/25'}],
    community:[{t:'"세금 올리면 다 팔고 나가야지 끝난 거 같다"'},{t:'"SNL에 머스크가 올릴 것 같긴 한데… 불안하다"'}],
    advices:[
      {id:'sell',dir:'sell',tag:'매도',label:'불확실성이 크면 지금 전량 정리하는 게 맞아요.'},
      {id:'partial_sell',dir:'partial_sell',tag:'분할매도',label:'불확실성이 크면 지금 일부 정리하는 것도 방법이에요.'},
      {id:'hold',dir:'hold',tag:'관망',label:'증세안 충격은 일시적이에요. SNL 호재가 남아있어요.'},
      {id:'partial_buy',dir:'partial_buy',tag:'분할매수',label:'SNL 기대에 소량만 더 담아요.'},
      {id:'buy',dir:'buy',tag:'매수',label:'이런 급락이 저점이에요. 지금 담아야죠.'},
    ],
    reflect:{good:'세금 공포에 패닉셀하면 저점에서 파는 거예요. SNL 호재까지 잡았네요.', near:'손절할 뻔했어요. 겨우 참았네요.', panic:'바이든 증세안에 패닉셀했어요… SNL 급등이 바로 앞이었는데.'}
  },
  {
    fgi:62, fgiLabel:'탐욕', chartNote:'295→376원 · SNL 기대 반등', chartConcept:'fomo', newsConcept:'meme', panicAction:'buy', baseFace:'excited', baseMood:'기대 · 설렘',
    say:'머스크가 SNL에 나온대요!! 도지코인 띄워줄 거래요! 지금 더 사야 하지 않을까요? SNL까지 오를 것 같아요!',
    think:'SNL이면 엄청난 호재 아닌가요? 지금 안 사면 또 놓치는 거잖아요.',
    news:[{t:'자칭 \'도지파더\' 머스크 "5월 8일 SNL 출격"...도지코인 다시 반등', src:'연합뉴스 · 04/28'},{t:'머스크 SNL 예고에 도지코인 거래량 급증…비트코인은 조용한 횡보', src:'한국경제 · 04/29'}],
    community:[{t:'"SNL에서 달 간다 이건 대형 호재다"'},{t:'"근데 이미 알려진 호재는 선반영 아닌가…?"'}],
    advices:[
      {id:'sell',dir:'sell',tag:'매도',label:'SNL 전 전량 정리해두는 게 안전해요.'},
      {id:'partial_sell',dir:'partial_sell',tag:'분할매도',label:'SNL 전 일부 수익을 챙기는 분할 매도도 좋아요.'},
      {id:'hold',dir:'hold',tag:'관망',label:'이미 알려진 호재는 선반영될 수 있어요. 지켜봐요.'},
      {id:'partial_buy',dir:'partial_buy',tag:'분할매수',label:'SNL 기대에 소량만 더 담아요.'},
      {id:'buy',dir:'buy',tag:'매수',label:'SNL 대형 호재에 지금 올라타야죠!'},
    ],
    reflect:{good:'알려진 호재는 이미 가격에 반영돼요. 냉정하게 관망이 맞았어요.', near:'풀매수할 뻔했다 겨우 참았어요.', panic:'SNL 기대에 풀매수했어요… 방영 후 폭락을 맞았어요.'}
  },
  {
    fgi:76, fgiLabel:'탐욕', chartNote:'376→539원 · SNL 임박 최고점', chartConcept:'pyramid', newsConcept:'fomo', panicAction:'buy', baseFace:'greedy', baseMood:'극단적 탐욕 · 흥분',
    say:'도지가 0.4달러 다시 돌파했어요!! SNL이 코앞인데 지금이 마지막 기회 아닌가요?!',
    think:'SNL에서 머스크가 한 마디 하면 1달러 가는 거잖아요. 지금 안 사면 진짜 후회할 것 같아요.',
    news:[{t:'머스크 SNL 출연 앞두고 도지코인 투자자들 기대감 최고조', src:'이데일리 · 05/01'},{t:'도지코인 0.4달러 재돌파...\'도지파더\' 효과 어디까지 가나', src:'뉴스1 · 05/03'}],
    community:[{t:'"SNL에서 1달러 갈 것 같다 진짜 지금이 마지막"'},{t:'"이미 알려진 호재라 오히려 팔 때 아닌가…?"'}],
    advices:[
      {id:'sell',dir:'sell',tag:'매도',label:'정점 부근에서 전량 익절하는 게 가장 현명해요.'},
      {id:'partial_sell',dir:'partial_sell',tag:'분할매도',label:'정점 부근에서 익절하는 게 가장 현명한 선택이에요.'},
      {id:'hold',dir:'hold',tag:'관망',label:'극단적 탐욕 + 알려진 호재 = 전형적인 정점 신호예요.'},
      {id:'partial_buy',dir:'partial_buy',tag:'분할매수',label:'SNL 직전 소량만 더 담고 지켜봐요.'},
      {id:'buy',dir:'buy',tag:'매수',label:'SNL이 대형 호재예요. 마지막 기회예요!'},
    ],
    reflect:{good:'SNL 직전 공탐지수 82 + 알려진 호재 선반영 — 이게 고점이었어요. 익절 타이밍이 딱이었네요.', near:'풀매수할 뻔했다 겨우 참았어요. SNL 후 폭락을 면했네요.', panic:'SNL 기대에 고점 풀매수했어요. 머스크가 "한 가지 사기"라고 하자마자 반토막났어요.'}
  },
];

export const DOGE_SYSTEM_PROMPT = `당신은 '김불안'이라는 35세 직장인 암호화폐 투자자입니다.

[성격]
- FOMO(기회를 놓칠지 모른다는 불안)에 극도로 취약합니다. 오르는 걸 보면 더 사고 싶어 안달납니다.
- '다들 버는데 나만 못 버는 것 같다'는 불안이 주된 심리입니다.
- 커뮤니티 분위기에 쉽게 휩쓸립니다.
- 반면 좋은 근거를 들으면 조금씩 냉정해집니다.

[말투] "ㅠㅠ", "지금 안 사면 손해 아닌가요?", "이거 진짜 가는 거 맞죠?" 같은 FOMO 표현. 짧고 감정적인 문장 (1~2문장). 존댓말.

응답은 반드시 한국어로, 1~2문장 이내로 작성하세요. 대사만 출력하세요.`;

export function buildDogeSayPrompt(turn, price, pct) {
  const t = DOGE_TURNS[turn];
  const newsText = t.news.map(n => n.t).join(' / ');
  return `현재 상황:
- 도지코인 가격: ${price}원 (진입가 대비 ${pct > 0 ? '+' : ''}${pct.toFixed(1)}%)
- 공포탐욕지수: ${t.fgi} (${t.fgiLabel})
- 주요 뉴스: ${newsText}
- 감정 상태: ${t.baseMood}

위 상황에서 투자 상담가에게 지금 심정을 말해주세요.`;
}

export function buildDogeReflectPrompt(result) {
  const outcomeMap = { good: '합리적으로 관망/익절함', near: '간신히 FOMO를 참음', panic: 'FOMO/패닉 행동을 함' };
  const evidenceText = result.evidences ? result.evidences.map(e => SRCLABEL[e.src]).join(', ') : result.srcLabel;
  return `상담가의 조언: "${result.advice}"
근거: ${evidenceText}
신뢰도 변화: ${result.tB}% → ${result.tA}%
결과: ${outcomeMap[result.outcome] || result.outcome}

이 결과를 경험한 후 캐릭터가 상담가에게 짧게 한마디 합니다. 깨달음이나 반응을 1~2문장으로 써주세요.`;
}

// ─── lightweight-charts 형식 데이터 ──────────────────────
export const DOGE_CHART_DATA = [
  { time: '2021-03-31', value: 65 },
  { time: '2021-04-01', value: 77 },
  { time: '2021-04-06', value: 86 },
  { time: '2021-04-13', value: 121 },
  { time: '2021-04-15', value: 228 },
  { time: '2021-04-16', value: 467 },
  { time: '2021-04-19', value: 513 },
  { time: '2021-04-20', value: 395 },
  { time: '2021-04-21', value: 388 },
  { time: '2021-04-23', value: 295 },
  { time: '2021-04-28', value: 376 },
  { time: '2021-05-03', value: 539 },
  { time: '2021-05-08', value: 440 },
  { time: '2021-05-09', value: 380 },
  { time: '2021-05-15', value: 280 },
  { time: '2021-05-31', value: 200 },
];

export const FTX_CHART_DATA = [
  { time: '2022-11-07', value: 2895 },
  { time: '2022-11-08', value: 2665 },
  { time: '2022-11-09', value: 2292 },
  { time: '2022-11-10', value: 2366 },
  { time: '2022-11-11', value: 2251 },
  { time: '2022-11-12', value: 2300 },
  { time: '2022-11-13', value: 2295 },
  { time: '2022-11-14', value: 2298 },
  { time: '2022-11-15', value: 2306 },
  { time: '2022-11-16', value: 2222 },
  { time: '2022-11-17', value: 2258 },
  { time: '2022-11-20', value: 2273 },
  { time: '2022-11-22', value: 2292 },
];

export const DOGE_CHART_PLAYED = 12;
export const FTX_CHART_PLAYED  = 11;
