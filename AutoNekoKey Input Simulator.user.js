// ==UserScript==
// @name         AutoNekoKey Input Simulator
// @namespace    http://tampermonkey.net/
// @version      Release1.0.0
// @description  模拟打字助手：在禁止粘贴的网站自动键入文本。支持拟人节奏(猫娘？！)、随机错字(粗心了喵~)、标点转换、逐行、字符替换与多语言。开发者：绘河HUIHE
// @author       绘河HUIHE
// @match        http*://*/*
// @match        file://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

  /* ====== 主题色：仅浅粉色，底色随深浅模式变化 ====== */
  const C_PINK = '#ff9ec7';      // 浅粉主色
  const C_PINK_SOFT = '#ffd0e6'; // 浅粉边框/底色
  const C_PINK_BOX = '#ffe6f2';  // 浅粉输入框底色

  /* ====== 多语言字典 ====== */
  const LANG_NAMES = {
    'zh-hans': '简体中文', 'zh-hant': '繁體中文', 'en': 'English',
    'ja': '日本語', 'ko': '한국어', 'ru': 'Русский', 'fr': 'Français'
  };
  const LANGS = Object.keys(LANG_NAMES);

  const I18N = {
    'zh-hans': {
      title: 'AutoNekoKey Input Simulator', author: '绘河HUIHE',
      textLabel: '输入想让本喵键入的文本~', textPlaceholder: '把你的文字写/粘贴在这里，再放到目标输入框里喵~',
      catgirlLabel: '猫娘？！', catgirlCap: '拟人键入模式',
      carelessLabel: '粗心了喵~', carelessCap: '键入错误模拟',
      enterLabel: 'Enter喵~', enterCap: '完成后回车',
      punctEnLabel: '英文标点喵~', punctEnCap: '中文符号转英文',
      punctCnLabel: '中文标点喵~', punctCnCap: '英文符号转中文',
      lineLabel: '逐行喵~', lineCap: '逐行输入',
      replaceLabel: '替换喵~', replaceCap: '字符替换',
      timeLabel: '基准时间（毫秒）：', probLabel: '基准概率（单位%）：',
      freqTitle: '喵喵喵……', freqSub: '输入频率（毫秒）',
      prepTitle: '……喵？', prepSub: '准备时间（秒）',
      start: '开始键入', cancel: '取消', stop: '停止',
      statusEmpty: '先写点文本喵~', statusNoTarget: '请先把光标放到要输入的框里喵！',
      statusStopped: '已停止喵~', statusTyping: '本喵正在键入…',
      statusDone: '键入完成喵~ 🎉', statusPrep: '准备中…',
      footer: '开发者：绘河HUIHE，禁止用于盗版复制、考试作弊、违法犯罪！',
      agreeLink: '查看用户协议', agreeSuffix: '用户须知', confirm: '确认', dontRemind: '不再提醒',
      langLabel: '语言', aiNote: '除中文外的翻译是由AI制作的啦~，可能会出现偏差，请您见谅喵~❤',
      replaceAdd: '添加', replacePairA: '原字符', replacePairB: '替换为', replaceHint: '最多 1000 组',
      P1: '请您明确使用本插件的具体目的。我们拒绝向任何将本插件用于考试作弊、盗版复制、雇佣水军、输入敏感内容、扰乱公共秩序，或其他违反法律法规及平台规定的用户提供相关服务。',
      P2: 'AutoNekoKey Input Simulator 是一款非商业、非营利的开源插件。若您曾向任何商家付费购买本插件，很可能已遭遇欺诈；相关售后问题请直接联系该商家处理。',
      P3: '本插件采用 CC BY‑NC‑SA 4.0 协议授权，转载或分享时请注明作者：绘河HUIHE。',
      P4: '请您知悉，使用本工具可能产生意外后果。若因使用本插件导致账号封禁、内容失效等情况，由此产生的所有风险与损失均由您自行承担。',
      note: '当您开始使用本插件的任何功能，即表示您已阅读并同意本协议。',
      note2: '喵喵喵~ 同意协议之后就可以用啦~'
    },
    'zh-hant': {
      title: 'AutoNekoKey Input Simulator', author: '绘河HUIHE',
      textLabel: '輸入想讓本喵鍵入的文本~', textPlaceholder: '把你的文字寫/貼上在這裡，再放到目標輸入框裡喵~',
      catgirlLabel: '貓娘？！', catgirlCap: '擬人鍵入模式',
      carelessLabel: '粗心了喵~', carelessCap: '鍵入錯誤模擬',
      enterLabel: 'Enter喵~', enterCap: '完成後回車',
      punctEnLabel: '英文標點喵~', punctEnCap: '中文符號轉英文',
      punctCnLabel: '中文標點喵~', punctCnCap: '英文符號轉中文',
      lineLabel: '逐行喵~', lineCap: '逐行輸入',
      replaceLabel: '替換喵~', replaceCap: '字元替換',
      timeLabel: '基準時間（毫秒）：', probLabel: '基準機率（單位%）：',
      freqTitle: '喵喵喵……', freqSub: '輸入頻率（毫秒）',
      prepTitle: '……喵？', prepSub: '準備時間（秒）',
      start: '開始鍵入', cancel: '取消', stop: '停止',
      statusEmpty: '先寫點文本喵~', statusNoTarget: '請先把游標放到要輸入的框裡喵！',
      statusStopped: '已停止喵~', statusTyping: '本喵正在鍵入…',
      statusDone: '鍵入完成喵~ 🎉', statusPrep: '準備中…',
      footer: '開發者：绘河HUIHE，禁止用於盜版複製、考試作弊、違法犯罪！',
      agreeLink: '查看用戶協議', agreeSuffix: '用戶須知', confirm: '確認', dontRemind: '不再提醒',
      langLabel: '語言', aiNote: '除中文外的翻譯是由AI製作的啦~，可能會出現偏差，請您見諒喵~❤',
      replaceAdd: '添加', replacePairA: '原字元', replacePairB: '替換為', replaceHint: '最多 1000 組',
      P1: '請您明確使用本套件之具體目的。我們拒絕向任何將本套件用於考試作弊、盜版複製、僱用水軍、輸入敏感內容、擾亂公共秩序，或其他違反法律法規及平台規定之使用者提供相關服務。',
      P2: 'AutoNekoKey Input Simulator 是一款非商業、非營利之開源套件。若您曾向任何商家付費購買本套件，很可能已遭遇詐欺；相關售後問題請直接聯繫該商家處理。',
      P3: '本套件採用 CC BY‑NC‑SA 4.0 協議授權，轉載或分享時請註明作者：绘河HUIHE。',
      P4: '請您知悉，使用本工具可能產生意外後果。若因使用本套件導致帳號封禁、內容失效等情況，由此產生之所有風險與損失均由您自行承擔。',
      note: '當您開始使用本套件的任何功能，即表示您已閱讀並同意本協議。',
      note2: '喵喵喵~ 同意協議之後就可以用啦~'
    },
    'en': {
      title: 'AutoNekoKey Input Simulator', author: '绘河HUIHE',
      textLabel: 'Enter the text you want me to type, Meow~', textPlaceholder: 'Write or paste your text here, then place the cursor in the target box, Meow~',
      catgirlLabel: 'Catgirl?!', catgirlCap: 'Human-like typing',
      carelessLabel: 'Careless Meow~', carelessCap: 'Typo simulation',
      enterLabel: 'Enter Meow~', enterCap: 'Press Enter when done',
      punctEnLabel: 'EN Punct Meow~', punctEnCap: 'CN symbols → EN',
      punctCnLabel: 'CN Punct Meow~', punctCnCap: 'EN symbols → CN',
      lineLabel: 'Line Meow~', lineCap: 'Type line by line',
      replaceLabel: 'Replace Meow~', replaceCap: 'Character replace',
      timeLabel: 'Base time (ms):', probLabel: 'Base probability (%):',
      freqTitle: 'Meow meow meow……', freqSub: 'Input interval (ms)',
      prepTitle: '……Meow?', prepSub: 'Prep time (sec)',
      start: 'Start typing', cancel: 'Cancel', stop: 'Stop',
      statusEmpty: 'Type some text first, Meow~', statusNoTarget: 'Place the cursor in the input box first, Meow!',
      statusStopped: 'Stopped, Meow~', statusTyping: 'Meow is typing…',
      statusDone: 'Typing done, Meow~ 🎉', statusPrep: 'Preparing…',
      footer: 'Developer: 绘河HUIHE. Prohibited for piracy, exam cheating, or illegal activities!',
      agreeLink: 'View user agreement', agreeSuffix: 'User Agreement', confirm: 'Confirm', dontRemind: "Don't remind me again",
      langLabel: 'Language', aiNote: 'Translations other than Chinese were made by AI~ please forgive any deviations, Meow~❤',
      replaceAdd: 'Add', replacePairA: 'Original', replacePairB: 'Replace with', replaceHint: 'Up to 1000 pairs',
      P1: 'Please be clear about your specific purpose for using this plugin. We refuse to provide services to any user who uses AutoNekoKey Input Simulator for exam cheating, piracy/copyright infringement, hiring paid posters, entering sensitive content, disrupting public order, or any other violation of laws, regulations, or platform rules.',
      P2: 'AutoNekoKey Input Simulator is a non-commercial, non-profit open-source plugin. If you ever paid any merchant to purchase this plugin, you were likely scammed; for after-sales issues, please contact that merchant directly.',
      P3: 'This plugin is licensed under CC BY‑NC‑SA 4.0. When reposting or sharing, please credit the author: 绘河HUIHE.',
      P4: 'Please understand that using this tool may lead to unintended consequences. If using this plugin results in account bans, invalid content, etc., all resulting risks and losses are borne by you.',
      note: 'By starting to use any feature of this plugin, you acknowledge that you have read and agreed to this agreement.',
      note2: 'Meow meow meow~ You can use it once you have agreed to the agreement~'
    },
    'ja': {
      title: 'オートネコキー・インプット・シミュレーター', author: '绘河HUIHE',
      textLabel: 'このネコが入力するテキストを入力してくださいにゃ～', textPlaceholder: 'ここにテキストを書いたり貼り付けたりして、カーソルを対象の入力欄に置いてにゃ～',
      catgirlLabel: '猫娘？！', catgirlCap: '擬人入力モード',
      carelessLabel: 'うっかりにゃ～', carelessCap: 'タイプミスシミュレーション',
      enterLabel: 'Enterにゃ～', enterCap: '完了後にEnter',
      punctEnLabel: '英記号にゃ～', punctEnCap: '中記号→英記号',
      punctCnLabel: '中記号にゃ～', punctCnCap: '英記号→中記号',
      lineLabel: '行ごとにゃ～', lineCap: '行単位で入力',
      replaceLabel: '置換にゃ～', replaceCap: '文字置換',
      timeLabel: '基準時間（ミリ秒）：', probLabel: '基準確率（％）：',
      freqTitle: 'にゃにゃにゃ……', freqSub: '入力間隔（ミリ秒）',
      prepTitle: '……にゃ？', prepSub: '準備時間（秒）',
      start: '入力開始', cancel: 'キャンセル', stop: '停止',
      statusEmpty: 'まずテキストを入力してにゃ～', statusNoTarget: 'カーソルを入力欄に置いてにゃ～！',
      statusStopped: '停止しましたにゃ～', statusTyping: 'ネコが入力中…',
      statusDone: '入力完了にゃ～ 🎉', statusPrep: '準備中…',
      footer: '開発者：绘河HUIHE。海賊版複製・試験不正・違法行為の使用は禁止です！',
      agreeLink: '利用規約を表示', agreeSuffix: '利用規約', confirm: '同意する', dontRemind: '次回から表示しない',
      langLabel: '言語', aiNote: '中国語以外の翻訳はAIによって作成されました～、ずれがあるかもしれませんがご了承にゃ～❤',
      replaceAdd: '追加', replacePairA: '元の文字', replacePairB: '置換後', replaceHint: '最大1000組',
      P1: '本プラグインの使用目的を明確にしてください。試験不正、海賊版複製、サクラ雇い、機微な内容の入力、公序良俗の乱暴、その他法令やプラットフォーム規約に違反する用途にはサービスを提供しません。',
      P2: 'AutoNekoKey Input Simulator は非営利・非商業のオープンソースプラグインです。もし業者に代金を払って購入した場合、詐欺に遭っている可能性があります。アフターサポートはその業者に直接ご連絡ください。',
      P3: '本プラグインは CC BY‑NC‑SA 4.0 でライセンスされています。転載・共有する際は作者：绘河HUIHE を明記してください。',
      P4: '本ツールの使用により予期せぬ結果が生じる可能性があります。アカウント停止や内容無効などにより生じたすべてのリスクと損失は、利用者自身が負担します。',
      note: '本プラグインのいずれかの機能を使用開始した時点で、本規約を読み了解したものとみなします。',
      note2: 'にゃにゃにゃ～ 規約に同意すれば使えるようになるにゃ～'
    },
    'ko': {
      title: 'AutoNekoKey Input Simulator', author: '绘河HUIHE',
      textLabel: '이 고양이가 입력하게 할 텍스트를 넣어주세요냥~', textPlaceholder: '여기에 텍스트를 쓰거나 붙여넣고, 커서를 대상 입력란에 두세요냥~',
      catgirlLabel: '고양이소녀？！', catgirlCap: '의인화 입력 모드',
      carelessLabel: '실수냥~', carelessCap: '오타 시뮬레이션',
      enterLabel: 'Enter냥~', enterCap: '완료 후 Enter',
      punctEnLabel: '영문 부호냥~', punctEnCap: '중문 부호→영문',
      punctCnLabel: '중문 부호냥~', punctCnCap: '영문 부호→중문',
      lineLabel: '줄별냥~', lineCap: '줄 단위 입력',
      replaceLabel: '치환냥~', replaceCap: '문자 치환',
      timeLabel: '기준 시간(밀리초):', probLabel: '기준 확률(%):',
      freqTitle: '냥냥냥……', freqSub: '입력 간격(밀리초)',
      prepTitle: '……냥?', prepSub: '준비 시간(초)',
      start: '입력 시작', cancel: '취소', stop: '정지',
      statusEmpty: '먼저 텍스트를 입력하세요냥~', statusNoTarget: '커서를 입력란에 두세요냥!',
      statusStopped: '정지했어요냥~', statusTyping: '고양이가 입력 중…',
      statusDone: '입력 완료냥~ 🎉', statusPrep: '준비 중…',
      footer: '개발자: 绘河HUIHE. 해적판 복제·시험 부정·불법 행위 사용 금지!',
      agreeLink: '이용 약관 보기', agreeSuffix: '이용 약관', confirm: '확인', dontRemind: '다시 묻지 않음',
      langLabel: '언어', aiNote: '중국어 외의 번역은 AI가 만들었습니다~ 오차가 있을 수 있으니 양해 부탁드려요냥~❤',
      replaceAdd: '추가', replacePairA: '원래 문자', replacePairB: '바꿀 문자', replaceHint: '최대 1000쌍',
      P1: '본 플러그인의 사용 목적을 명확히 하세요. 시험 부정, 저작권 침해 복제, 불법 여론조작, 민감 내용 입력, 공공질서 훼손 등 법령이나 플랫폼 규정을 위반하는 용도에는 서비스를 제공하지 않습니다.',
      P2: 'AutoNekoKey Input Simulator는 비영리·비상업 오픈소스 플러그인입니다. 업체에 돈을 주고 구매했다면 사기일 가능성이 큽니다. 판매 후 문제는 해당 업체에 직접 문의하세요.',
      P3: '본 플러그인은 CC BY‑NC‑SA 4.0 라이선스입니다. 공유 시 저작자: 绘河HUIHE 를 표기하세요.',
      P4: '본 도구 사용으로 인해 예기치 않은 결과가 발생할 수 있습니다. 계정 정지나 내용 무효 등으로 인한 모든 위험과 손실은 이용자 본인이 부담합니다.',
      note: '본 플러그인의 어떤 기능이라도 사용을 시작하면 본 약관을 읽고 동의한 것으로 봅니다.',
      note2: '냥냥냥~ 약관에 동의하면 쓸 수 있어요~'
    },
    'ru': {
      title: 'AutoNekoKey Input Simulator', author: '绘河HUIHE',
      textLabel: 'Введите текст, который должен набрать этот котик~', textPlaceholder: 'Напишите или вставьте текст здесь, затем поместите курсор в нужное поле~',
      catgirlLabel: 'Кошкодевушка?!', catgirlCap: 'Аниро-ввод',
      carelessLabel: 'Неаккуратно~', carelessCap: 'Симуляция опечаток',
      enterLabel: 'Enter~', enterCap: 'Нажать Enter в конце',
      punctEnLabel: 'Англ. знаки~', punctEnCap: 'Кит. знаки→Англ.',
      punctCnLabel: 'Кит. знаки~', punctCnCap: 'Англ. знаки→Кит.',
      lineLabel: 'Построчно~', lineCap: 'Ввод по строкам',
      replaceLabel: 'Замена~', replaceCap: 'Замена символов',
      timeLabel: 'Базовое время (мс):', probLabel: 'Базовая вероятность (%):',
      freqTitle: 'Мяу мяу мяу……', freqSub: 'Интервал ввода (мс)',
      prepTitle: '……Мяу?', prepSub: 'Время подготовки (с)',
      start: 'Начать ввод', cancel: 'Отмена', stop: 'Стоп',
      statusEmpty: 'Сначала введите текст~', statusNoTarget: 'Сначала поместите курсор в поле ввода!',
      statusStopped: 'Остановлено~', statusTyping: 'Котик печатает…',
      statusDone: 'Ввод завершён~ 🎉', statusPrep: 'Подготовка…',
      footer: 'Разработчик: 绘河HUIHE. Запрещено для пиратства, списывания и незаконных целей!',
      agreeLink: 'Пользовательское соглашение', agreeSuffix: 'Пользовательское соглашение', confirm: 'Подтвердить', dontRemind: 'Больше не напоминать',
      langLabel: 'Язык', aiNote: 'Переводы, кроме китайского, сделаны ИИ~ возможны неточности, простите~❤',
      replaceAdd: 'Добавить', replacePairA: 'Исходный', replacePairB: 'Заменить на', replaceHint: 'До 1000 пар',
      P1: 'Чётко определите цель использования этого плагина. Мы отказываем в обслуживании пользователям, применяющим его для списывания на экзаменах, нарушения авторских прав, найма ботов, ввода чувствительного содержимого, нарушения общественного порядка или иных нарушений законов и правил платформы.',
      P2: 'AutoNekoKey Input Simulator — некоммерческий бесплатный плагин с открытым кодом. Если вы платили какому-либо продавцу за его покупку, вы, вероятно, стали жертвой обмана; по послепродажным вопросам обращайтесь напрямую к этому продавцу.',
      P3: 'Плагин распространяется под лицензией CC BY‑NC‑SA 4.0. При перепубликации укажите автора: 绘河HUIHE.',
      P4: 'Учтите, что использование этого инструмента может привести к непредвиденным последствиям. Все риски и убытки (блокировка аккаунта, недействительность содержимого и т.д.) несёт пользователь.',
      note: 'Начав использовать любую функцию плагина, вы подтверждаете, что прочитали и согласны с этим соглашением.',
      note2: 'Мяу мяу мяу~ После согласия с соглашением можно пользоваться~'
    },
    'fr': {
      title: 'AutoNekoKey Input Simulator', author: '绘河HUIHE',
      textLabel: 'Saisissez le texte que ce chat doit taper~', textPlaceholder: 'Écrivez ou collez votre texte ici, puis placez le curseur dans le champ cible~',
      catgirlLabel: 'Chaton fille ?!', catgirlCap: 'Saisie réaliste',
      carelessLabel: 'Maladroit~', carelessCap: 'Simulation de fautes',
      enterLabel: 'Enter~', enterCap: 'Entrée à la fin',
      punctEnLabel: 'Ponct. EN~', punctEnCap: 'Signes ZH→EN',
      punctCnLabel: 'Ponct. ZH~', punctCnCap: 'Signes EN→ZH',
      lineLabel: 'Ligne par ligne~', lineCap: 'Saisie par lignes',
      replaceLabel: 'Remplacer~', replaceCap: 'Remplacement',
      timeLabel: 'Temps de base (ms) :', probLabel: 'Probabilité de base (%) :',
      freqTitle: 'Miaou miaou miaou……', freqSub: 'Intervalle (ms)',
      prepTitle: '……Miaou ?', prepSub: 'Temps de prép. (s)',
      start: 'Commencer', cancel: 'Annuler', stop: 'Arrêter',
      statusEmpty: 'Saisissez d\'abord du texte~', statusNoTarget: 'Placez d\'abord le curseur dans le champ~',
      statusStopped: 'Arrêté~', statusTyping: 'Le chat tape…',
      statusDone: 'Saisie terminée~ 🎉', statusPrep: 'Préparation…',
      footer: 'Développeur : 绘河HUIHE. Interdit pour le piratage, la triche et les activités illégales !',
      agreeLink: 'Voir le contrat', agreeSuffix: 'Contrat utilisateur', confirm: 'Confirmer', dontRemind: 'Ne plus rappeler',
      langLabel: 'Langue', aiNote: 'Les traductions hors chinois sont générées par IA~ veuillez excuser les écarts~❤',
      replaceAdd: 'Ajouter', replacePairA: 'Original', replacePairB: 'Remplacer par', replaceHint: 'Max 1000 paires',
      P1: 'Veuillez être clair sur l\'usage prévu de ce plugin. Nous refusons tout service à quiconque l\'utilise pour la triche aux examens, la contrefaçon, le recrutement de faux comptes, la saisie de contenus sensibles, le trouble de l\'ordre public ou toute autre violation des lois ou règles de la plateforme.',
      P2: 'AutoNekoKey Input Simulator est un plugin open-source non commercial et à but non lucratif. Si vous avez payé un revendeur pour l\'obtenir, vous avez probablement été escroqué ; pour le support, contactez directement ce revendeur.',
      P3: 'Ce plugin est sous licence CC BY‑NC‑SA 4.0. En le partageant, citez l\'auteur : 绘河HUIHE.',
      P4: 'Sachez que l\'usage de cet outil peut entraîner des conséquences imprévues. Tout risque ou perte (bannissement de compte, contenu invalidé, etc.) relève de votre seule responsabilité.',
      note: 'En utilisant une quelconque fonction du plugin, vous confirmez avoir lu et accepté ce contrat.',
      note2: 'Miaou miaou miaou~ Une fois le contrat accepté, c\'est bon~'
    }
  };

  let curLang = GM_getValue('neko_lang', detectLang());
  function detectLang() {
    const l = (navigator.language || 'en').toLowerCase();
    if (l.startsWith('zh')) return (l.includes('hant') || l.includes('tw') || l.includes('hk') || l.includes('mo')) ? 'zh-hant' : 'zh-hans';
    if (l.startsWith('en')) return 'en';
    if (l.startsWith('ja')) return 'ja';
    if (l.startsWith('ko')) return 'ko';
    if (l.startsWith('ru')) return 'ru';
    if (l.startsWith('fr')) return 'fr';
    return 'en';
  }
  function t(k) {
    const d = I18N[curLang];
    if (d && d[k] != null) return d[k];
    return I18N['en'][k] != null ? I18N['en'][k] : k;
  }

  /* ====== 标点转换映射 ====== */
  const CN2EN = {
    '，': ',', '。': '.', '、': ',', '（': '(', '）': ')',
    '［': '[', '］': ']', '｛': '{', '｝': '}', '＜': '<', '＞': '>',
    '：': ':', '；': ';', '？': '?', '！': '!', '“': '"', '”': '"',
    '‘': "'", '’': "'", '『': '"', '』': '"', '「': '"', '」': '"',
    '【': '[', '】': ']', '《': '<', '》': '>', '～': '~', '·': '.',
    '…': '...', '＼': '\\', '／': '/', '　': ' '
  };
  const EN2CN = {
    ',': '，', '.': '。', '(': '（', ')': '）', '[': '［', ']': '］',
    '{': '｛', '}': '｝', '<': '＜', '>': '＞', ':': '：', ';': '；',
    '?': '？', '!': '！', '"': '“', "'": '‘', '\\': '＼', '/': '／', '~': '～'
  };
  function convertPunct(text, dir) {
    const map = dir === 'cn2en' ? CN2EN : EN2CN;
    let out = '';
    for (const ch of text) out += (map[ch] !== undefined ? map[ch] : ch);
    return out;
  }

  /* ====== 注入样式 ====== */
  const style = document.createElement('style');
  style.textContent = `
    #neko-fab, #neko-panel, #neko-panel * { box-sizing: border-box; }

    #neko-fab {
      position: fixed; right: 24px; bottom: 24px; z-index: 2147483647;
      width: 56px; height: 56px; border-radius: 50%;
      background: ${C_PINK}; color: #fff; font-size: 26px; line-height: 56px;
      text-align: center; cursor: grab; user-select: none;
      box-shadow: 0 6px 18px rgba(255, 158, 199, .5); transition: transform .15s ease;
    }
    #neko-fab:active { cursor: grabbing; transform: scale(.92); }
    #neko-fab .neko-badge {
      position: absolute; top: -6px; right: -6px; min-width: 22px; height: 22px;
      padding: 0 5px; border-radius: 11px; background: #ff6fae;
      font-size: 12px; line-height: 22px; font-weight: 700; color: #fff;
      box-shadow: 0 2px 6px rgba(0,0,0,.25);
    }

    #neko-panel {
      position: fixed; right: 24px; bottom: 96px; z-index: 2147483647;
      width: 320px; max-width: calc(100vw - 32px); border-radius: 18px; overflow: hidden;
      display: flex; flex-direction: column;
      font-family: -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif;
      box-shadow: 0 12px 40px rgba(170, 80, 130, .3);
      background: ${C_PINK_BOX}; color: #5a2a45;
    }
    #neko-panel[hidden] { display: none; }

    #neko-header {
      display: flex; align-items: center; gap: 6px; padding: 10px 14px;
      background: ${C_PINK}; color: #fff; font-weight: 700; cursor: grab; user-select: none;
    }
    #neko-header:active { cursor: grabbing; }
    #neko-header .neko-title { flex: 1; font-size: 14px; }
    #neko-header .neko-close {
      width: 24px; height: 24px; border-radius: 50%; text-align: center;
      line-height: 22px; font-size: 18px; cursor: pointer; background: rgba(255,255,255,.25);
    }
    #neko-header .neko-close:hover { background: rgba(255,255,255,.45); }

    #neko-body { padding: 14px; flex: 1 1 auto; min-height: 0; overflow: hidden; }
    /* 屏幕过小、非选项卡部分也放不下时：整面板 body 滚动 */
    #neko-panel.neko-scroll-all #neko-body { overflow-y: auto; }
    .neko-label { font-size: 13px; font-weight: 700; margin-bottom: 6px; color: #c75b94; }
    #neko-text {
      width: 100%; height: 80px; resize: vertical; padding: 8px 10px;
      border: 2px solid ${C_PINK_SOFT}; border-radius: 10px; font-size: 13px;
      outline: none; color: #5a2a45; background: #fff; font-family: inherit;
    }
    #neko-text:focus { border-color: ${C_PINK}; }

    .neko-toggles { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px; overflow-y: auto; }
    .neko-toggle-col { flex: 1 1 calc(50% - 3px); display: flex; flex-direction: column; gap: 4px; }
    .neko-toggle {
      display: flex; align-items: center; justify-content: space-between;
      gap: 6px; padding: 8px 8px; border-radius: 12px;
      background: ${C_PINK_BOX}; border: 1px solid ${C_PINK_SOFT};
      font-size: 12px; font-weight: 700; color: #c75b94;
    }
    .neko-toggle.disabled { opacity: .45; }
    .neko-toggle.disabled .neko-switch { pointer-events: none; }
    .neko-caption { font-size: 10px; color: #c79bb6; text-align: center; line-height: 1.3; }
    .neko-switch { position: relative; width: 42px; height: 22px; flex: 0 0 auto; }
    .neko-switch input { display: none; }
    .neko-switch .track {
      position: absolute; inset: 0; border-radius: 11px; background: #e6c6d8;
      transition: background .2s; cursor: pointer;
    }
    .neko-switch .thumb {
      position: absolute; top: 3px; left: 3px; width: 16px; height: 16px;
      border-radius: 50%; background: #fff; transition: transform .2s; box-shadow: 0 1px 3px rgba(0,0,0,.3);
    }
    .neko-switch input:checked ~ .track { background: ${C_PINK}; }
    .neko-switch input:checked ~ .thumb { transform: translateX(20px); }

    .neko-slider-wrap { margin-top: 10px; }
    .neko-slider-label { font-size: 12px; font-weight: 700; color: #c75b94; margin-bottom: 4px; }
    .neko-slider-label span { color: #ff6fae; }
    .neko-slider-wrap input[type=range] { width: 100%; accent-color: ${C_PINK}; cursor: pointer; }
    .neko-slider-wrap[hidden] { display: none; }

    .neko-row { display: flex; gap: 10px; margin-top: 12px; }
    .neko-box { flex: 1; padding: 8px 10px; border-radius: 12px; background: ${C_PINK_BOX}; border: 1px solid ${C_PINK_SOFT}; }
    .neko-box.disabled { opacity: .45; }
    .neko-box-title { font-size: 14px; font-weight: 700; color: #ff6fae; }
    .neko-box-sub { font-size: 11px; color: #c79bb6; margin: 2px 0 6px; }
    /* 逐行开启时，频率输入框提示已 ×10 */
    .neko-box.x10 .neko-box-sub::after { content: ' ×10'; color: #ff6fae; font-weight: 700; }
    .neko-box input {
      width: 100%; padding: 6px 8px; border: 2px solid ${C_PINK_SOFT};
      border-radius: 8px; font-size: 14px; text-align: center; outline: none;
      background: #fff; color: #5a2a45; font-family: inherit;
    }
    .neko-box input:focus { border-color: ${C_PINK}; }
    .neko-box input:disabled { background: #f3e8ee; cursor: not-allowed; }

    #neko-start {
      width: 100%; margin-top: 14px; padding: 10px; border: none; border-radius: 12px;
      background: ${C_PINK}; color: #fff; font-size: 15px; font-weight: 700; cursor: pointer;
      box-shadow: 0 4px 14px rgba(255, 158, 199, .5); transition: filter .15s;
    }
    #neko-start:hover { filter: brightness(1.05); }
    #neko-start:disabled { filter: grayscale(.3) brightness(.97); cursor: default; }

    #neko-status { margin-top: 10px; min-height: 18px; text-align: center; font-size: 12px; color: #c75b94; font-weight: 600; }

    #neko-footer {
      margin-top: 8px; padding: 8px 10px; border-top: 1px dashed ${C_PINK_SOFT};
      font-size: 10px; line-height: 1.4; color: #c79bb6; text-align: center;
    }

    /* 语言选择 + AI 小字 */
    .neko-lang-block { margin-top: 10px; }
    .neko-lang-row { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #c75b94; }
    .neko-lang-row select {
      flex: 1; padding: 4px 6px; border: 2px solid ${C_PINK_SOFT}; border-radius: 8px;
      background: #fff; color: #5a2a45; font-family: inherit; outline: none;
    }
    .neko-ainote { margin-top: 4px; font-size: 9.5px; line-height: 1.4; color: #c79bb6; }
    /* 用户协议底部小字 + 删除线 */
    .neko-aigen { margin-top: 10px; font-size: 10px; line-height: 1.5; color: #c79bb6; }
    .neko-del { text-decoration: line-through; }

    .neko-agree-link {
      margin-top: 8px; font-size: 10px; text-align: center; color: #c79bb6;
      cursor: pointer; text-decoration: underline; user-select: none;
    }
    .neko-agree-link:hover { color: #ff6fae; }

    /* 替换对 UI */
    .neko-mini-btn {
      width: 100%; margin-top: 8px; padding: 6px; border: none; border-radius: 8px;
      background: ${C_PINK}; color: #fff; font-size: 13px; font-weight: 700; cursor: pointer;
    }
    .neko-pair { display: flex; align-items: center; gap: 6px; margin-top: 6px; }
    .neko-pair input {
      width: 42px; text-align: center; padding: 4px; border: 2px solid ${C_PINK_SOFT};
      border-radius: 6px; font-size: 13px; background: #fff; color: #5a2a45; font-family: inherit;
    }
    .neko-pair span { color: #c79bb6; }
    .neko-pair-del {
      width: 22px; height: 22px; border: none; border-radius: 50%; background: #ffd0e6;
      color: #c75b94; cursor: pointer; font-weight: 700; line-height: 22px; flex: 0 0 auto;
    }

    /* ====== 深色模式 ====== */
    @media (prefers-color-scheme: dark) {
      #neko-fab { background: #3d2350; box-shadow: 0 6px 18px rgba(0,0,0,.5); }
      #neko-fab .neko-badge { background: #ff6fae; }
      #neko-panel { background: #2a1736; color: #e8d5f0; box-shadow: 0 12px 40px rgba(0,0,0,.6); }
      #neko-header { background: #4a2a5e; color: #f5dceb; }
      .neko-label { color: #ffb3d9; }
      #neko-text { background: #3a2350; color: #f5dceb; border-color: #5a3a72; }
      #neko-text:focus { border-color: ${C_PINK}; }
      .neko-toggle, .neko-box { background: #3a2350; border-color: #5a3a72; color: #ffb3d9; }
      .neko-box input { background: #2a1736; color: #f5dceb; border-color: #5a3a72; }
      .neko-box input:disabled { background: #241430; }
      .neko-slider-label { color: #ffb3d9; }
      .neko-slider-label span { color: #ff8fc7; }
      #neko-start { background: #c77da8; box-shadow: 0 4px 14px rgba(0,0,0,.4); }
      #neko-status { color: #ffb3d9; }
      #neko-footer { color: #b89bc8; border-top-color: #5a3a72; }
      .neko-caption { color: #b89bc8; }
      .neko-switch .track { background: #5a3a72; }
      .neko-lang-row { color: #ffb3d9; }
      .neko-lang-row select { background: #3a2350; color: #f5dceb; border-color: #5a3a72; }
      .neko-ainote { color: #b89bc8; }
      #neko-modal-body .neko-aigen { color: #b89bc8; }
      .neko-agree-link { color: #b89bc8; }
      .neko-agree-link:hover { color: #ffb3d9; }
      .neko-pair input { background: #3a2350; color: #f5dceb; border-color: #5a3a72; }
      .neko-pair-del { background: #5a3a72; color: #ffb3d9; }
    }

    /* ====== 首次用户须知弹窗 ====== */
    #neko-modal-mask {
      position: fixed; inset: 0; z-index: 2147483647;
      background: rgba(40, 20, 50, .55);
      display: flex; align-items: center; justify-content: center; padding: 16px;
    }
    #neko-modal-mask[hidden] { display: none; }
    #neko-modal {
      width: 380px; max-width: 100%; max-height: 82vh; overflow-y: auto;
      background: ${C_PINK_BOX}; color: #5a2a45; border-radius: 16px;
      box-shadow: 0 16px 50px rgba(120, 60, 100, .5);
      font-family: -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif;
    }
    #neko-modal-title {
      padding: 14px 16px; font-size: 15px; font-weight: 800; text-align: center;
      color: #fff; background: ${C_PINK}; border-radius: 16px 16px 0 0;
    }
    #neko-modal-body { padding: 14px 16px; font-size: 12.5px; line-height: 1.7; }
    #neko-modal-body p { margin: 0 0 10px; }
    #neko-modal-body .neko-note { color: #c75b94; font-weight: 700; }
    #neko-modal-body .neko-note2 { color: #ff6fae; font-weight: 700; text-align: center; }
    #neko-modal .neko-lang-row { margin-top: 10px; }
    #neko-modal-foot {
      display: flex; align-items: center; justify-content: space-between;
      gap: 10px; padding: 12px 16px; border-top: 1px dashed ${C_PINK_SOFT};
    }
    .neko-dont { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #c75b94; cursor: pointer; }
    .neko-dont input { width: 15px; height: 15px; accent-color: ${C_PINK}; cursor: pointer; }
    #neko-confirm {
      padding: 8px 22px; border: none; border-radius: 10px; background: ${C_PINK};
      color: #fff; font-size: 14px; font-weight: 700; cursor: pointer;
      box-shadow: 0 4px 12px rgba(255, 158, 199, .5);
    }
    #neko-confirm:hover { filter: brightness(1.05); }
    @media (prefers-color-scheme: dark) {
      #neko-modal { background: #2a1736; color: #e8d5f0; box-shadow: 0 16px 50px rgba(0,0,0,.6); }
      #neko-modal-title { background: #4a2a5e; }
      #neko-modal-body .neko-note { color: #ffb3d9; }
      #neko-modal-body .neko-note2 { color: #ff8fc7; }
      #neko-modal-foot { border-top-color: #5a3a72; }
      .neko-dont { color: #ffb3d9; }
    }
  `;
  document.head.appendChild(style);

  /* ====== 构建悬浮按钮 ====== */
  const fab = document.createElement('div');
  fab.id = 'neko-fab';
  fab.innerHTML = '🐱<span class="neko-badge" hidden></span>';
  document.body.appendChild(fab);

  /* ====== 构建主面板 ====== */
  const panel = document.createElement('div');
  panel.id = 'neko-panel';
  panel.hidden = true;
  panel.innerHTML = `
    <div id="neko-header">
      <span>🐱</span>
      <span class="neko-title" data-i18n="title">AutoNekoKey Input Simulator</span>
      <span class="neko-close" title="×">×</span>
    </div>
    <div id="neko-body">
      <div class="neko-label" data-i18n="textLabel">输入想让本喵键入的文本~</div>
      <textarea id="neko-text" data-i18n-ph="textPlaceholder"></textarea>

      <div class="neko-toggles">
        <div class="neko-toggle-col">
          <label class="neko-toggle"><span data-i18n="catgirlLabel">猫娘？！</span>
            <label class="neko-switch"><input type="checkbox" id="neko-catgirl"><span class="track"></span><span class="thumb"></span></label></label>
          <div class="neko-caption" data-i18n="catgirlCap">拟人键入模式</div>
        </div>
        <div class="neko-toggle-col">
          <label class="neko-toggle"><span data-i18n="carelessLabel">粗心了喵~</span>
            <label class="neko-switch"><input type="checkbox" id="neko-careless"><span class="track"></span><span class="thumb"></span></label></label>
          <div class="neko-caption" data-i18n="carelessCap">键入错误模拟</div>
        </div>
        <div class="neko-toggle-col">
          <label class="neko-toggle"><span data-i18n="enterLabel">Enter喵~</span>
            <label class="neko-switch"><input type="checkbox" id="neko-enter"><span class="track"></span><span class="thumb"></span></label></label>
          <div class="neko-caption" data-i18n="enterCap">完成后回车</div>
        </div>
        <div class="neko-toggle-col">
          <label class="neko-toggle"><span data-i18n="punctEnLabel">英文标点喵~</span>
            <label class="neko-switch"><input type="checkbox" id="neko-punct-en"><span class="track"></span><span class="thumb"></span></label></label>
          <div class="neko-caption" data-i18n="punctEnCap">中文符号转英文</div>
        </div>
        <div class="neko-toggle-col">
          <label class="neko-toggle"><span data-i18n="punctCnLabel">中文标点喵~</span>
            <label class="neko-switch"><input type="checkbox" id="neko-punct-cn"><span class="track"></span><span class="thumb"></span></label></label>
          <div class="neko-caption" data-i18n="punctCnCap">英文符号转中文</div>
        </div>
        <div class="neko-toggle-col">
          <label class="neko-toggle"><span data-i18n="lineLabel">逐行喵~</span>
            <label class="neko-switch"><input type="checkbox" id="neko-line"><span class="track"></span><span class="thumb"></span></label></label>
          <div class="neko-caption" data-i18n="lineCap">逐行输入</div>
        </div>
        <div class="neko-toggle-col">
          <label class="neko-toggle"><span data-i18n="replaceLabel">替换喵~</span>
            <label class="neko-switch"><input type="checkbox" id="neko-replace"><span class="track"></span><span class="thumb"></span></label></label>
          <div class="neko-caption" data-i18n="replaceCap">字符替换</div>
        </div>
      </div>

      <div class="neko-slider-wrap" id="neko-time-wrap" hidden>
        <div class="neko-slider-label"><span data-i18n="timeLabel">基准时间（毫秒）：</span><span id="neko-time-val">100</span></div>
        <input type="range" id="neko-time" min="0" max="7" step="1" value="2">
      </div>

      <div class="neko-slider-wrap" id="neko-prob-wrap" hidden>
        <div class="neko-slider-label"><span data-i18n="probLabel">基准概率（单位%）：</span><span id="neko-prob-val">0</span></div>
        <input type="range" id="neko-prob" min="0" max="30" step="1" value="0">
      </div>

      <div class="neko-slider-wrap" id="neko-replace-wrap" hidden>
        <div class="neko-slider-label"><span data-i18n="replaceHint">最多 1000 组</span></div>
        <div id="neko-replace-list"></div>
        <button id="neko-replace-add" class="neko-mini-btn" data-i18n="replaceAdd">添加</button>
      </div>

      <div class="neko-row">
        <div class="neko-box" id="neko-freq-box">
          <div class="neko-box-title" data-i18n="freqTitle">喵喵喵……</div>
          <div class="neko-box-sub" data-i18n="freqSub">输入频率（毫秒）</div>
          <input id="neko-freq" type="number" value="80" min="10" step="10">
        </div>
        <div class="neko-box">
          <div class="neko-box-title" data-i18n="prepTitle">……喵？</div>
          <div class="neko-box-sub" data-i18n="prepSub">准备时间（秒）</div>
          <input id="neko-prep" type="number" value="3" min="0" step="1">
        </div>
      </div>

      <button id="neko-start">开始键入</button>
      <div id="neko-status"></div>

      <div class="neko-lang-block">
        <div class="neko-lang-row"><span data-i18n="langLabel">语言</span><select id="neko-lang"></select></div>
        <div class="neko-ainote" data-i18n="aiNote"></div>
      </div>

      <div id="neko-footer" data-i18n="footer">开发者：绘河HUIHE，禁止用于盗版复制、考试作弊、违法犯罪！</div>
      <div class="neko-agree-link" id="neko-agree-link" data-i18n="agreeLink">查看用户协议</div>
    </div>
  `;
  document.body.appendChild(panel);

  /* ====== 构建用户须知弹窗 ====== */
  const modal = document.createElement('div');
  modal.id = 'neko-modal-mask';
  modal.hidden = true;
  modal.innerHTML = `
    <div id="neko-modal">
      <div id="neko-modal-title">AutoNekoKey Input Simulator 用户须知</div>
      <div id="neko-modal-body">
        <p data-i18n="P1"></p>
        <p data-i18n="P2"></p>
        <p data-i18n="P3"></p>
        <p data-i18n="P4"></p>
        <p class="neko-note" data-i18n="note"></p>
        <p class="neko-note2" data-i18n="note2"></p>
        <div class="neko-lang-row"><span data-i18n="langLabel">语言</span><select id="neko-lang-modal"></select></div>
        <div class="neko-ainote" data-i18n="aiNote"></div>
        <p class="neko-aigen" id="neko-aigen"></p>
      </div>
      <div id="neko-modal-foot">
        <label class="neko-dont"><input type="checkbox" id="neko-dont"><span data-i18n="dontRemind">不再提醒</span></label>
        <button id="neko-confirm" data-i18n="confirm">确认</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  /* ====== 元素引用 ====== */
  const elText = panel.querySelector('#neko-text');
  const elFreq = panel.querySelector('#neko-freq');
  const elPrep = panel.querySelector('#neko-prep');
  const elFreqBox = panel.querySelector('#neko-freq-box');
  const elStart = panel.querySelector('#neko-start');
  const elStatus = panel.querySelector('#neko-status');
  const elBadge = fab.querySelector('.neko-badge');
  const header = panel.querySelector('#neko-header');
  const headerTitle = panel.querySelector('.neko-title');
  const closeBtn = panel.querySelector('.neko-close');

  const elCatgirl = panel.querySelector('#neko-catgirl');
  const elCareless = panel.querySelector('#neko-careless');
  const elEnter = panel.querySelector('#neko-enter');
  const elPunctEn = panel.querySelector('#neko-punct-en');
  const elPunctCn = panel.querySelector('#neko-punct-cn');
  const elLine = panel.querySelector('#neko-line');
  const elReplace = panel.querySelector('#neko-replace');

  const elTimeWrap = panel.querySelector('#neko-time-wrap');
  const elTime = panel.querySelector('#neko-time');
  const elTimeVal = panel.querySelector('#neko-time-val');
  const elProbWrap = panel.querySelector('#neko-prob-wrap');
  const elProb = panel.querySelector('#neko-prob');
  const elProbVal = panel.querySelector('#neko-prob-val');
  const elReplaceWrap = panel.querySelector('#neko-replace-wrap');
  const elReplaceList = panel.querySelector('#neko-replace-list');
  const elReplaceAdd = panel.querySelector('#neko-replace-add');

  const elLang = panel.querySelector('#neko-lang');
  const elLangModal = modal.querySelector('#neko-lang-modal');
  const modalTitle = modal.querySelector('#neko-modal-title');

  const elDont = modal.querySelector('#neko-dont');
  const elConfirm = modal.querySelector('#neko-confirm');

  const BASE_TIMES = [20, 50, 100, 250, 500, 1000, 2000, 4000]; // 基准时间挡位

  /* ====== 设置持久化 ====== */
  let replacePairs = [];
  function defaultSettings() {
    return { catgirl: false, careless: false, enter: false, punctEn: false, punctCn: false, line: false, replace: false, freq: 80, prep: 3, timeIdx: 2, prob: 0, replacePairs: [] };
  }
  let settings = GM_getValue('neko_settings', null) || defaultSettings();
  // 补全可能缺失的字段
  settings = Object.assign(defaultSettings(), settings);
  if (!Array.isArray(settings.replacePairs)) settings.replacePairs = [];
  replacePairs = settings.replacePairs.slice(0, 1000);

  function saveSettings() {
    settings = {
      catgirl: elCatgirl.checked, careless: elCareless.checked, enter: elEnter.checked,
      punctEn: elPunctEn.checked, punctCn: elPunctCn.checked, line: elLine.checked, replace: elReplace.checked,
      freq: +elFreq.value, prep: +elPrep.value, timeIdx: +elTime.value, prob: +elProb.value, replacePairs: replacePairs.slice()
    };
    GM_setValue('neko_settings', settings);
  }

  /* ====== 多语言应用 ====== */
  function fillLangSelect(sel) {
    sel.innerHTML = LANGS.map(l => `<option value="${l}">${LANG_NAMES[l]}</option>`).join('');
    sel.value = curLang;
  }

  // 用户协议底部小字（含删除线的「猫娘」对应词），按语言提供
  const AI_GEN = {
    'zh-hans': '此项目程序内容由<span class="neko-del">猫娘</span>AI生成，可能存在些许问题，请您见谅喵~',
    'zh-hant': '此專案程式內容由<span class="neko-del">貓娘</span>AI生成，可能存在些許問題，請您見諒喵~',
    'en': 'The program content of this project was generated by <span class="neko-del">catgirl</span> AI; minor issues may exist, please forgive me, Meow~',
    'ja': 'このプロジェクトのプログラム内容は<span class="neko-del">猫娘</span>AIによって生成されており、多少の問題があるかもしれません。ご了承くださいにゃ～',
    'ko': '이 프로젝트의 프로그램 내용은 <span class="neko-del">고양이소녀</span> AI가 생성했으며, 약간의 문제가 있을 수 있으니 양해 부탁드려요냥~',
    'ru': 'Программное содержимое этого проекта сгенерировано ИИ <span class="neko-del">кошкодевушка</span>; возможны небольшие недочёты, простите~',
    'fr': 'Le contenu du programme de ce projet a été généré par l’IA <span class="neko-del">chat-girl</span> ; de légers problèmes sont possibles, veuillez nous excuser~'
  };

  function applyLang() {
    document.querySelectorAll('#neko-panel [data-i18n], #neko-modal [data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
    headerTitle.textContent = t('title');
    modalTitle.textContent = t('title') + ' ' + t('agreeSuffix');
    const aigenEl = modal.querySelector('#neko-aigen');
    if (aigenEl) aigenEl.innerHTML = AI_GEN[curLang] || AI_GEN['en'];
    if (phase === 'idle' || phase === 'done') elStart.textContent = t('start');
    renderReplaceList();
    layoutPanel(); // 语言切换可能改变换行/高度
  }
  function onLangChange(l) {
    curLang = l;
    GM_setValue('neko_lang', l);
    elLang.value = l; elLangModal.value = l;
    applyLang();
  }
  elLang.addEventListener('change', e => onLangChange(e.target.value));
  elLangModal.addEventListener('change', e => onLangChange(e.target.value));

  /* ====== 替换对 UI ====== */
  function renderReplaceList() {
    elReplaceList.innerHTML = '';
    replacePairs.forEach((pair, idx) => {
      const row = document.createElement('div');
      row.className = 'neko-pair';
      const a = document.createElement('input');
      a.className = 'neko-pair-a'; a.maxLength = 1; a.placeholder = t('replacePairA'); a.value = pair.a || '';
      const arr = document.createElement('span'); arr.textContent = '→';
      const b = document.createElement('input');
      b.className = 'neko-pair-b'; b.maxLength = 1; b.placeholder = t('replacePairB'); b.value = pair.b || '';
      const del = document.createElement('button');
      del.className = 'neko-pair-del'; del.textContent = '×'; del.title = '×';
      a.addEventListener('input', () => { replacePairs[idx].a = a.value; saveSettings(); });
      b.addEventListener('input', () => { replacePairs[idx].b = b.value; saveSettings(); });
      del.addEventListener('click', () => { replacePairs.splice(idx, 1); saveSettings(); renderReplaceList(); });
      row.append(a, arr, b, del);
      elReplaceList.appendChild(row);
    });
  }
  elReplaceAdd.addEventListener('click', () => {
    if (replacePairs.length >= 1000) return;
    replacePairs.push({ a: '', b: '' });
    saveSettings(); renderReplaceList();
    const last = elReplaceList.querySelector('.neko-pair:last-child .neko-pair-a');
    if (last) last.focus();
  });

  /* ====== 冲突 / 失效逻辑 ====== */
  function syncCatgirlUI() {
    elTimeWrap.hidden = !elCatgirl.checked;
    elFreqBox.classList.toggle('disabled', elCatgirl.checked);
    elFreq.disabled = elCatgirl.checked;
  }

  function refreshControls() {
    const c = elCareless.checked;
    // 粗心模式开启时，英文标点 / 中文标点 / 逐行 失效（禁用并关闭）
    [elPunctEn, elPunctCn, elLine].forEach(el => {
      el.disabled = c;
      if (c) el.checked = false;
      const col = el.closest('.neko-toggle');
      if (col) col.classList.toggle('disabled', c);
    });
    elReplaceWrap.hidden = !elReplace.checked;
    elFreqBox.classList.toggle('x10', elLine.checked); // 逐行时频率间隔 ×10 提示
  }

  elCatgirl.addEventListener('change', () => {
    syncCatgirlUI();
    if (elCatgirl.checked) elLine.checked = false; // 与逐行互斥
    refreshControls();
    saveSettings();
  });
  elCareless.addEventListener('change', () => {
    elProbWrap.hidden = !elCareless.checked;
    refreshControls();
    saveSettings();
  });
  elEnter.addEventListener('change', saveSettings);
  elPunctEn.addEventListener('change', () => {
    if (elPunctEn.checked) { elPunctCn.checked = false; elReplace.checked = false; }
    refreshControls(); saveSettings();
  });
  elPunctCn.addEventListener('change', () => {
    if (elPunctCn.checked) { elPunctEn.checked = false; elReplace.checked = false; }
    refreshControls(); saveSettings();
  });
  elLine.addEventListener('change', () => {
    if (elLine.checked) elCatgirl.checked = false; // 与拟人互斥
    syncCatgirlUI();
    refreshControls();
    saveSettings();
  });
  elReplace.addEventListener('change', () => {
    if (elReplace.checked) { elPunctEn.checked = false; elPunctCn.checked = false; }
    refreshControls(); saveSettings();
  });
  elTime.addEventListener('input', () => { elTimeVal.textContent = BASE_TIMES[+elTime.value]; saveSettings(); });
  elProb.addEventListener('input', () => { elProbVal.textContent = elProb.value; saveSettings(); });

  /* ====== 拖动逻辑 ====== */
  function makeDraggable(handle, target) {
    let sx, sy, ox, oy, dragging = false;
    handle.addEventListener('pointerdown', (e) => {
      if (e.target.closest('.neko-close')) return;
      dragging = true;
      sx = e.clientX; sy = e.clientY;
      const r = target.getBoundingClientRect();
      ox = r.left; oy = r.top;
      handle.setPointerCapture(e.pointerId);
    });
    handle.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      let nx = ox + (e.clientX - sx);
      let ny = oy + (e.clientY - sy);
      nx = Math.max(0, Math.min(window.innerWidth - target.offsetWidth, nx));
      ny = Math.max(0, Math.min(window.innerHeight - target.offsetHeight, ny));
      target.style.left = nx + 'px';
      target.style.top = ny + 'px';
      target.style.right = 'auto';
      target.style.bottom = 'auto';
    });
    handle.addEventListener('pointerup', (e) => {
      dragging = false;
      try { handle.releasePointerCapture(e.pointerId); } catch (_) {}
    });
  }
  makeDraggable(fab, fab);
  makeDraggable(header, panel);

  /* ====== 面板自适应布局 ======
     规则：最高 800px；超过则「选项卡」区域内部滚动；屏幕高度 < 800 时自适应；
     若连非选项卡部分都放不下，则整面板 body 滚动。 */
  function layoutPanel() {
    if (panel.hidden) return;
    const toggles = panel.querySelector('.neko-toggles');
    const header = panel.querySelector('#neko-header');
    const body = panel.querySelector('#neko-body');

    // 先解除约束，测量自然高度
    panel.style.maxHeight = 'none';
    panel.style.height = 'auto';
    panel.classList.remove('neko-scroll-all');
    toggles.style.maxHeight = 'none';
    toggles.style.overflowY = 'visible';

    const bodyStyle = getComputedStyle(body);
    const bodyPadTB = parseFloat(bodyStyle.paddingTop) + parseFloat(bodyStyle.paddingBottom);
    const headerH = header.offsetHeight;

    // 隐藏选项卡，测量「非选项卡部分」自然高度（含 body 内边距）
    toggles.style.display = 'none';
    const othersNatural = body.scrollHeight;
    toggles.style.display = '';
    const othersContent = othersNatural - bodyPadTB;

    const margin = 16;
    const avail = Math.min(800, Math.max(220, window.innerHeight - margin));
    const availBodyContent = avail - headerH - bodyPadTB;

    panel.style.maxHeight = avail + 'px';

    if (availBodyContent < othersContent + 8) {
      // 连非选项卡部分都放不下 → 整面板滚动
      panel.classList.add('neko-scroll-all');
      toggles.style.maxHeight = 'none';
      toggles.style.overflowY = 'visible';
    } else {
      // 非选项卡部分能放下 → 选项卡内部滚动（其余固定）
      const toggleMax = Math.max(60, (availBodyContent - othersContent) - 12);
      toggles.style.maxHeight = toggleMax + 'px';
      toggles.style.overflowY = 'auto';
    }

    // 垂直方向夹在视口内
    const rect = panel.getBoundingClientRect();
    if (rect.top < 4 || rect.bottom > window.innerHeight - 4) {
      panel.style.top = Math.max(4, window.innerHeight - panel.offsetHeight - 4) + 'px';
      panel.style.bottom = 'auto';
    }
  }
  window.addEventListener('resize', layoutPanel);

  /* ====== 捕获 / 还原光标目标 ====== */
  let storedTarget = null;
  let storedRange = null;

  function captureTarget() {
    const el = document.activeElement;
    if (!el || el === fab || el === panel || panel.contains(el) || modal.contains(el)) return;
    storedTarget = el;
    if (el.isContentEditable) {
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) storedRange = sel.getRangeAt(0).cloneRange();
    } else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      storedRange = { start: el.selectionStart, end: el.selectionEnd };
    }
  }

  function restoreTarget() {
    if (!storedTarget || !document.contains(storedTarget)) return;
    storedTarget.focus();
    if (storedTarget.isContentEditable && storedRange && storedRange.cloneRange) {
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(storedRange);
    } else if ((storedTarget.tagName === 'INPUT' || storedTarget.tagName === 'TEXTAREA') && storedRange) {
      try { storedTarget.setSelectionRange(storedRange.start, storedRange.end); } catch (_) {}
    }
  }

  fab.addEventListener('click', () => {
    if (panel.hidden) { captureTarget(); panel.hidden = false; layoutPanel(); elText.focus(); }
    else { panel.hidden = true; }
  });
  closeBtn.addEventListener('click', () => { panel.hidden = true; });
  panel.querySelector('#neko-agree-link').addEventListener('click', () => { modal.hidden = false; });

  /* ====== 在光标处插入单个字符（含换行/Enter） ====== */
  function setNativeValue(element, value) {
    const proto = element.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    const setter = Object.getOwnPropertyDescriptor(proto, 'value').set;
    setter.call(element, value);
  }

  // 稳健地插入换行（Enter）：文本框直接写值；富文本优先 insertLineBreak，失败则手动插入 <br>
  function insertNewline() {
    const el = document.activeElement;
    if (!el) return;
    if (el.isContentEditable) {
      el.focus();
      let ok = false;
      try { ok = document.execCommand('insertLineBreak'); } catch (_) { ok = false; }
      if (!ok) {
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0) {
          const range = sel.getRangeAt(0);
          range.deleteContents();
          const br = document.createElement('br');
          const zws = document.createTextNode('\u200b'); // 零宽占位，保证后续字符落在下一行
          range.insertNode(zws);
          range.insertNode(br);
          range.setStartAfter(zws);
          range.collapse(true);
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }
      return;
    }
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      const start = el.selectionStart != null ? el.selectionStart : el.value.length;
      const end = el.selectionEnd != null ? el.selectionEnd : el.value.length;
      setNativeValue(el, el.value.slice(0, start) + '\n' + el.value.slice(end));
      const pos = start + 1;
      try { el.setSelectionRange(pos, pos); } catch (_) {}
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  function insertChar(ch) {
    const el = document.activeElement;
    if (!el) return;
    if (ch === '\n') { insertNewline(); return; }
    if (el.isContentEditable) { el.focus(); document.execCommand('insertText', false, ch); return; }
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      const start = el.selectionStart != null ? el.selectionStart : el.value.length;
      const end = el.selectionEnd != null ? el.selectionEnd : el.value.length;
      const val = el.value;
      const newVal = val.slice(0, start) + ch + val.slice(end);
      setNativeValue(el, newVal);
      const pos = start + ch.length;
      try { el.setSelectionRange(pos, pos); } catch (_) {}
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
      return;
    }
    document.execCommand('insertText', false, ch);
  }

  /* ====== 随机错字引擎（粗心了喵~） ====== */
  const CONFUSE_MAP = {
    '(': ')', ')': '(', '[': ']', ']': '[',
    ',': '，', '，': ',', '.': '。', '。': '.',
    '\\': '/', '/': '\\', '、': '，', '·': '.', '`': "'"
  };
  function isPunct3_1(c) { return Object.prototype.hasOwnProperty.call(CONFUSE_MAP, c); }
  function isPunct(c) { return /[，。、；：！？….,;:!?()\[\]【】{}<>《》"'”’`·\\/]/.test(c); }

  function buildTypoText(text, kPct) {
    if (kPct <= 0) return text;
    const k = kPct / 100;
    const k2 = k / 3, k3 = k / 5;
    let out = '', i = 0; const n = text.length;
    while (i < n) {
      const c = text[i];
      if (/[A-Za-z0-9]/.test(c)) {
        let j = i;
        while (j < n && /[A-Za-z0-9]/.test(text[j])) j++;
        let word = text.slice(i, j);
        word = word.split('').map(ch => ((ch === '0' || ch === 'O') && Math.random() < k) ? (ch === '0' ? 'O' : '0') : ch).join('');
        if (word.length >= 2 && Math.random() < k2) {
          const p = Math.floor(Math.random() * (word.length - 1));
          word = word.slice(0, p) + word[p + 1] + word[p] + word.slice(p + 2);
        }
        out += word; i = j; continue;
      }
      if (isPunct3_1(c)) { if (Math.random() < k) { out += CONFUSE_MAP[c]; i++; continue; } out += c; i++; continue; }
      if (isPunct(c)) {
        if (Math.random() < k3) { if (Math.random() < 0.5) out += c + c; i++; continue; }
        out += c; i++; continue;
      }
      out += c; i++;
    }
    return out;
  }

  /* ====== 文本处理管线 ====== */
  function processText(text) {
    if (elReplace.checked) {
      for (const p of replacePairs) { if (p.a) text = text.split(p.a).join(p.b); }
    }
    if (elPunctEn.checked) text = convertPunct(text, 'cn2en');
    else if (elPunctCn.checked) text = convertPunct(text, 'en2cn');
    if (elCareless.checked) text = buildTypoText(text, +elProb.value);
    return text;
  }

  /* ====== 键入状态机 ====== */
  let phase = 'idle';
  let typeTimer = null, countTimer = null;

  function nextInterval() {
    let base;
    if (elCatgirl.checked) {
      const k = BASE_TIMES[+elTime.value];
      base = k / 2 + Math.random() * (2 * k - k / 2); // 均匀 [k/2, 2k]
    } else {
      base = Math.max(10, parseInt(elFreq.value, 10) || 80); // 用户输入的频率间隔
      if (elLine.checked) base *= 10; // 逐行：仅对用户输入的间隔 ×10
    }
    return base;
  }

  function beginTyping() {
    const raw = elText.value;
    if (!raw) { elStatus.textContent = t('statusEmpty'); return; }

    const prep = Math.max(0, parseFloat(elPrep.value) || 0);
    const cur = document.activeElement;
    const inPanel = panel.contains(cur) || cur === fab || modal.contains(cur);
    const target = inPanel ? storedTarget : cur;
    if (!target) { elStatus.textContent = t('statusNoTarget'); return; }
    storedTarget = target;

    panel.hidden = true;
    restoreTarget();

    phase = 'counting';
    elStart.textContent = t('cancel');
    elStart.disabled = false;
    elBadge.hidden = false;

    if (prep <= 0) { startTypeLoop(raw); return; }
    let remain = prep;
    elBadge.textContent = Math.ceil(remain);
    elStatus.textContent = `${t('statusPrep')} ${remain.toFixed(1)}s`;
    countTimer = setInterval(() => {
      remain -= 0.1;
      if (remain <= 0) { clearInterval(countTimer); startTypeLoop(raw); }
      else { elBadge.textContent = Math.ceil(remain); elStatus.textContent = `${t('statusPrep')} ${remain.toFixed(1)}s`; }
    }, 100);
  }

  function startTypeLoop(raw) {
    const text = processText(raw);
    phase = 'typing';
    elBadge.hidden = true;
    elStart.textContent = t('stop');
    elStart.disabled = false;
    elStatus.textContent = t('statusTyping');

    restoreTarget();

    // 逐行：按换行拆分为「行内字符 + 行间 Enter」序列
    const lines = text.split('\n');
    const seq = [];
    lines.forEach((line, idx) => {
      for (const ch of line) seq.push(ch);
      if (idx < lines.length - 1) seq.push('\n'); // 行间发送 Enter
    });
    if (elEnter.checked) seq.push('\n'); // 完成后额外回车

    let i = 0;
    const step = () => {
      if (phase !== 'typing') return;
      if (i >= seq.length) {
        phase = 'done';
        elStart.textContent = t('start');
        elStatus.textContent = t('statusDone');
        elBadge.hidden = true;
        return;
      }
      insertChar(seq[i++]);
      typeTimer = setTimeout(step, nextInterval());
    };
    step();
  }

  function stopTyping() {
    clearTimeout(typeTimer);
    clearInterval(countTimer);
    phase = 'done';
    elStart.textContent = t('start');
    elStart.disabled = false;
    elBadge.hidden = true;
    elStatus.textContent = t('statusStopped');
  }

  elStart.addEventListener('click', () => {
    if (phase === 'idle' || phase === 'done') beginTyping();
    else if (phase === 'counting' || phase === 'typing') stopTyping();
  });

  panel.addEventListener('keydown', (e) => e.stopPropagation());

  /* ====== 初始化 ====== */
  function showAgreement() { modal.hidden = false; }
  elConfirm.addEventListener('click', () => {
    if (elDont.checked) GM_setValue('neko_dont_remind', true);
    modal.hidden = true;
  });
  if (!GM_getValue('neko_dont_remind', false)) showAgreement();

  // 应用已保存的设置
  elCatgirl.checked = settings.catgirl;
  elCareless.checked = settings.careless;
  elEnter.checked = settings.enter;
  elPunctEn.checked = settings.punctEn;
  elPunctCn.checked = settings.punctCn;
  elLine.checked = settings.line;
  elReplace.checked = settings.replace;
  elFreq.value = settings.freq;
  elPrep.value = settings.prep;
  elTime.value = settings.timeIdx;
  elProb.value = settings.prob;
  elTimeVal.textContent = BASE_TIMES[settings.timeIdx];
  elProbVal.textContent = settings.prob;
  syncCatgirlUI();
  elProbWrap.hidden = !elCareless.checked;
  refreshControls();
  renderReplaceList();
  fillLangSelect(elLang);
  fillLangSelect(elLangModal);
  applyLang();
})();
