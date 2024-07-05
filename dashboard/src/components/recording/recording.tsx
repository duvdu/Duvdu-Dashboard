import React, { useState, useRef, useEffect } from 'react';
import Waveform from './audioRecordWave';

interface AudioRecorderProps {
  isstartRecording: boolean;
  recordingoutput: (audioUrl: string, audioBlob: Blob) => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ isstartRecording, recordingoutput }) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  useEffect(() => {
    if (isstartRecording && !isRecording) {
      startRecording();
    } else if (!isstartRecording && isRecording) {
      stopRecording();
    }
  }, [isstartRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.fftSize = 2048;
      const bufferLength = analyserRef.current.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);

      mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(audioUrl);
        if (recordingoutput) {
          recordingoutput(audioUrl, audioBlob);
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing the microphone', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      setIsRecording(false);
    }
  };

  return (
    <>
      {isRecording && analyserRef.current && dataArrayRef.current && (
        <Waveform analyser={analyserRef.current} dataArray={dataArrayRef.current} isRecording={isRecording} />
      )}
    </>
  );
};

export default AudioRecorder;
