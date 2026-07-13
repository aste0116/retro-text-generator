// 【設定】デフォルトで自動読み込みする猫の画像ファイル名です。
// GitHubのリポジトリに、この名前（cat.png）で猫のドット絵画像を一緒にアップロードしてください。
const DEFAULT_IMAGE_URL = 'cat.png'; 

const canvas = document.getElementById('preview-canvas');
const ctx = canvas.getContext('2d');
const textInput = document.getElementById('text-input');
const downloadBtn = document.getElementById('download-btn');
const resultWrap = document.getElementById('result-wrap');
const resultImg = document.getElementById('result-img');
const secretTrigger = document.getElementById('secret-trigger');
const adminUi = document.getElementById('admin-ui');
const imageInput = document.getElementById('image-input');
const resetBtn = document.getElementById('reset-btn');

// Canvasの基本サイズ（正方形）
const CANVAS_SIZE = 500;
canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;

let backgroundImage = null;

// 起動時にデフォルトの猫画像を自動で読み込む
const defaultImg = new Image();
defaultImg.onload = () => {
    backgroundImage = defaultImg;
    draw();
};
defaultImg.onerror = () => {
    console.log("デフォルト画像（" + DEFAULT_IMAGE_URL + "）が見つからないため、テキストのみで初期描画します。");
    draw();
};
defaultImg.src = DEFAULT_IMAGE_URL;

// タイトルをタップすると【管理モード】が切り替わる隠し機能
secretTrigger.addEventListener('click', () => {
    adminUi.classList.toggle('hidden');
});

// 管理モードで画像が選ばれたとき
imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            backgroundImage = img;
            draw();
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

// クリアボタン（デフォルトの画像に戻す）
resetBtn.addEventListener('click', () => {
    imageInput.value = '';
    backgroundImage = defaultImg;
    draw();
});

// テキスト入力時に自動で再描画
textInput.addEventListener('input', draw);

// 描画処理
function draw() {
    // 1. キャンバスの背景を画像と同じダークグレー（#191919）で塗りつぶす
    ctx.fillStyle = '#191919';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    
    // 2. 背景画像（猫）があれば「下部中央」にドット絵として描画
    if (backgroundImage) {
        // 画像の横幅をキャンバスの80%の大きさに調整
        const displayWidth = CANVAS_SIZE * 0.8;
        const scale = displayWidth / backgroundImage.width;
        const displayHeight = backgroundImage.height * scale;
        
        // 左右中央、下端ぴったりに配置
        const x = (CANVAS_SIZE - displayWidth) / 2;
        const y = CANVAS_SIZE - displayHeight;
        
        // ドット絵をくっきり表示する設定
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(backgroundImage, x, y, displayWidth, displayHeight);
    }
    
    // 3. テキストの描画設定
    const lines = textInput.value.split('\n');
    const fontSize = 64; 
    ctx.font = `${fontSize}px 'DotGothic16', sans-serif`;
    
    // 文字の配置基準を「左上」に変更
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    
    const lineHeight = fontSize * 1.2;
    const margin = 30; // 左上からの余白（ピクセル単位）
    
    // 太い紫色の縁取り設定
    ctx.strokeStyle = '#31243b'; 
    ctx.lineWidth = 16;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    
    // 文字の中身（ミントグリーン）
    ctx.fillStyle = '#a3f7bf';
    
    // 各行を描画
    lines.forEach((line, index) => {
        // X座標は左余白、Y座標は上余白＋行ごとの高さ
        const x = margin;
        const y = margin + (index * lineHeight);
        
        ctx.strokeText(line, x, y);
        ctx.fillText(line, x, y);
    });
}

// 画像をつくるボタンが押されたとき
downloadBtn.addEventListener('click', () => {
    const dataUrl = canvas.toDataURL('image/png');
    resultImg.src = dataUrl;
    resultWrap.style.display = 'block';
    resultWrap.scrollIntoView({ behavior: 'smooth' });
});

// 初回描画（フォント読み込みを待って実行）
document.fonts.ready.then(() => { draw(); });
draw();
