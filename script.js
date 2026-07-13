const textInput = document.getElementById('text-input');
const canvas = document.getElementById('main-canvas');
const ctx = canvas.getContext('2d');
const CAT_BASE64 = "ここに1346.pngのCAT_BASE64を貼り付け";

const draw = () => {
    canvas.width = 300;
    canvas.height = 400;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // テキスト描画
    ctx.fillStyle = "#a3f7bf";
    ctx.font = "30px monospace";
    const lines = textInput.value.split('\n');
    lines.forEach((line, i) => ctx.fillText(line, 20, 50 + (i * 40)));

    // 猫描画
    const cat = new Image();
    cat.onload = () => {
        ctx.drawImage(cat, 50, 200, 200, 150);
    };
    cat.src = CAT_BASE64;
};

// 入力時に更新
textInput.addEventListener('input', draw);
// ダウンロード処理
document.getElementById('download-btn').addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'retro-art.png';
    link.href = canvas.toDataURL();
    link.click();
});

draw();
