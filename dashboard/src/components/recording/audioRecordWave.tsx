import React, { useEffect, useRef } from 'react';

interface WaveformProps {
  analyser: AnalyserNode;
  dataArray: Uint8Array;
  isRecording: boolean;
}

const Waveform: React.FC<WaveformProps> = ({ analyser, dataArray, isRecording }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (isRecording) {
      drawWaveform();
    }
  }, [isRecording]);

  const drawWaveform = () => {
    if (!canvasRef.current || !analyser || !dataArray) return;

    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');
    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    const draw = () => {
      if (!analyser || !dataArray) return;

      requestAnimationFrame(draw);

      analyser.getByteTimeDomainData(dataArray);

      if (canvasCtx) {
        canvasCtx.fillStyle = 'rgb(255, 255, 255)';
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

        canvasCtx.beginPath();

        const sliceWidth = WIDTH * 1.0 / analyser.frequencyBinCount;
        let x = 0;

        for (let i = 0; i < analyser.frequencyBinCount; i++) {
          const v = dataArray[i] / 128.0;
          const y = v * HEIGHT / 2;

          if (i === 0) {
            canvasCtx.moveTo(x, y);
          } else {
            canvasCtx.lineTo(x, y);
          }

          x += sliceWidth;
        }

        canvasCtx.lineTo(canvas.width, canvas.height / 2);
        canvasCtx.stroke();
      }
    };

    draw();
  };

  return <canvas ref={canvasRef} width="300" height="50"></canvas>;
};

export default Waveform;
