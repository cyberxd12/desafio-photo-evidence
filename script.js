const video = document.getElementById('webcam');
const canvas = document.getElementById('canvas');
const captureBtn = document.getElementById('capture-btn');
const resultImg = document.getElementById('result-img');
const downloadLink = document.getElementById('download-link');

// Iniciar a câmera ao carregar a página
async function startApp() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: "environment" }, // Tenta usar a câmera traseira no celular
            audio: false 
        });
        video.srcObject = stream;
    } catch (err) {
        alert("Erro ao acessar a câmera. Certifique-se de dar permissão.");
        console.error(err);
    }
}

// Função para pegar a localização atual
function getLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject("Geolocalização não suportada pelo navegador.");
        }
        navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true
        });
    });
}

// Lógica de captura e carimbo
captureBtn.addEventListener('click', async () => {
    const ctx = canvas.getContext('2d');
    
    // Configura o tamanho do canvas para o tamanho real do vídeo
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // 1. Desenha o frame atual do vídeo no canvas
    // Nota: Removido o efeito espelho na captura final para o texto ficar legível
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    try {
        captureBtn.innerText = "Localizando...";
        const position = await getLocation();
        const { latitude, longitude } = position.coords;
        
        const agora = new Date();
        const dataStr = agora.toLocaleDateString('pt-BR');
        const horaStr = agora.toLocaleTimeString('pt-BR');

        // 2. Adiciona o Carimbo (Marca d'água)
        const padding = 20;
        const boxHeight = 120;
        
        // Fundo escuro para leitura do texto
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        ctx.fillRect(0, canvas.height - boxHeight, canvas.width, boxHeight);

        // Estilo do texto
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 24px Arial";
        
        ctx.fillText(`DATA: ${dataStr}`, padding, canvas.height - 85);
        ctx.fillText(`HORA: ${horaStr}`, padding, canvas.height - 55);
        ctx.fillText(`LAT: ${latitude.toFixed(6)} | LONG: ${longitude.toFixed(6)}`, padding, canvas.height - 25);

        // 3. Mostra o resultado na tela
        const dataURL = canvas.toDataURL('image/png');
        resultImg.src = dataURL;
        
        // Configura o download
        downloadLink.href = dataURL;
        downloadLink.download = `evidencia_${agora.getTime()}.png`;
        downloadLink.style.display = 'block';

        captureBtn.innerText = "Capturar Evidência";
    } catch (error) {
        alert("Erro ao obter localização: " + error.message);
        captureBtn.innerText = "Capturar Evidência";
    }
});

startApp();