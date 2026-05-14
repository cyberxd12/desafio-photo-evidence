const video = document.getElementById('webcam');
const canvas = document.getElementById('canvas');
const captureBtn = document.getElementById('capture-btn');
const resultImg = document.getElementById('result-img');
const downloadLink = document.getElementById('download-link');

async function startApp() {
    try {
        // "facingMode: user" para selfie, "environment" para câmera traseira
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: "user" }, 
            audio: false 
        });
        video.srcObject = stream;
        
        // Removemos qualquer espelhamento via código para garantir que
        // o que você vê é o que o canvas vai desenhar.
        video.style.transform = "scaleX(1)"; 
    } catch (err) {
        alert("Erro ao acessar a câmera.");
        console.error(err);
    }
}

function getLocation() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true
        });
    });
}

captureBtn.addEventListener('click', async () => {
    const ctx = canvas.getContext('2d');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Limpa o canvas antes de desenhar
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // DESENHA A IMAGEM (Sem inversão)
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    try {
        captureBtn.innerText = "Localizando...";
        const position = await getLocation();
        const { latitude, longitude } = position.coords;
        
        const agora = new Date();
        const dataStr = agora.toLocaleDateString('pt-BR');
        const horaStr = agora.toLocaleTimeString('pt-BR');

        // Carimbo (Marca d'água)
        const boxHeight = 120;
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        ctx.fillRect(0, canvas.height - boxHeight, canvas.width, boxHeight);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 24px Arial";
        ctx.fillText(`DATA: ${dataStr}`, 20, canvas.height - 85);
        ctx.fillText(`HORA: ${horaStr}`, 20, canvas.height - 55);
        ctx.fillText(`LAT: ${latitude.toFixed(6)} | LONG: ${longitude.toFixed(6)}`, 20, canvas.height - 25);

        const dataURL = canvas.toDataURL('image/png');
        resultImg.src = dataURL;
        
        downloadLink.href = dataURL;
        downloadLink.download = `evidencia_${agora.getTime()}.png`;
        downloadLink.style.display = 'block';

        captureBtn.innerText = "Capturar Evidência";
    } catch (error) {
        alert("Erro: " + error.message);
        captureBtn.innerText = "Capturar Evidência";
    }
});

startApp();
