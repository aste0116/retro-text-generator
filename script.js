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

// 1361.pngの比率を完全に再現する500x500の正方形キャンバス
const CANVAS_SIZE = 500;
canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;

let backgroundImage = null;

// タイトル3回素早くタップで管理モード表示/非表示
let clickCount = 0;
let clickTimeout;

secretTrigger.addEventListener('click', () => {
    clickCount++;
    clearTimeout(clickTimeout);
    
    if (clickCount === 3) {
        adminUi.classList.toggle('hidden');
        clickCount = 0;
    } else {
        clickTimeout = setTimeout(() => {
            clickCount = 0;
        }, 500);
    }
});

// 管理モード画像読み込み
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

resetBtn.addEventListener('click', () => {
    imageInput.value = '';
    backgroundImage = null;
    draw();
});

textInput.addEventListener('input', draw);

// 🎨 1361.pngの黄金比率描画ロジック
function draw() {
    // 背景を暗いグレー（#1a1a1a）で塗りつぶす
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    
    // 1. 先にキャラクター（猫）を下部中央に大きく描画する
    if (backgroundImage) {
        ctx.imageSmoothingEnabled = false; // ドットをクッキリさせる
        
        // 1361.pngのサイズ感（横幅を約340pxにしてドカンと下部に配置）
        const targetWidth = 340;
        const scale = targetWidth / backgroundImage.width;
        const targetHeight = backgroundImage.height * scale;
        
        const x = (CANVAS_SIZE - targetWidth) / 2;
        // ぴったり一番下に密着させて、1361.pngの「下から飛び出してる感」を出す
        const y = CANVAS_SIZE - targetHeight; 
        
        ctx.drawImage(backgroundImage, x, y, targetWidth, targetHeight);
    }
    
    // 2. 文字を上から大きく「中央揃え」で描画する
    const lines = textInput.value.split('\n');
    const fontSize = 90; // 画面いっぱいに広がるド迫力サイズ（1361.png準拠）
    
    ctx.font = `bold ${fontSize}px 'DotGothic16', sans-serif`;
    ctx.textAlign = 'center'; // 文字は中央揃え
    ctx.textBaseline = 'top';
    
    const lineHeight = fontSize * 1.05; // 行間をギュッと詰める
    
    // 文字全体の描画スタート位置（上部に適度な余白）
    const startY = 20; 
    
    // 超極太のフチ取り設定（1361.pngのあのドロッとした太いフチ）
    ctx.strokeStyle = '#31243b'; 
    ctx.lineWidth = 24; // 圧倒的なフチの太さ
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    
    // 文字の塗りつぶし（ミントグリーン）
    ctx.fillStyle = '#a3f7bf';
    
    // フチを先に全部描いてから、中身を上に塗る（綺麗に重なるプロの手順）
    lines.forEach((line, index) => {
        const x = CANVAS_SIZE / 2;
        const y = startY + (index * lineHeight);
        ctx.strokeText(line, x, y);
    });
    
    lines.forEach((line, index) => {
        const x = CANVAS_SIZE / 2;
        const y = startY + (index * lineHeight);
        ctx.fillText(line, x, y);
    });
}

// 画像生成
downloadBtn.addEventListener('click', () => {
    const dataUrl = canvas.toDataURL('image/png');
    resultImg.src = dataUrl;
    resultWrap.style.with = '100%';
    resultWrap.style.display = 'block';
    resultWrap.scrollIntoView({ behavior: 'smooth' });
});

// フォント読み込み完了を待ってから描画
document.fonts.ready.then(() => { draw(); });
draw();
