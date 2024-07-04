import React, { useState, useEffect } from 'react';
import APIService from '../services/APIService';

interface AudioRecorderProps {
  onMottoChange: (newMotto: string) => void;
}

function AudioRecorder({ onMottoChange }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorderInstance, setMediaRecorderInstance] = useState<MediaRecorder | null>(null);
  const [recordedAudioBlob, setRecordedAudioBlob] = useState<Blob | null>(null);

  useEffect(() => {
    if (isRecording) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          const recorder = new MediaRecorder(stream);
          recorder.start();
          setMediaRecorderInstance(recorder);

          const audioChunks: Blob[] = [];
          recorder.ondataavailable = event => {
            audioChunks.push(event.data);
          };

          recorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            setRecordedAudioBlob(audioBlob);
          };
        })
        .catch(error => console.error('Error recording audio:', error));
    }
  }, [isRecording]);

  const handleStopRecording = () => {
    if (mediaRecorderInstance) {
      mediaRecorderInstance.stop();
      setIsRecording(false);
    }
  };

  const handleUploadAudio = () => {
    if (recordedAudioBlob) {
      const formData = new FormData();
      formData.append('audio', recordedAudioBlob, 'audio.webm');
      console.log(...formData.entries()); // Log FormData contents

      const apiService = APIService;
      apiService.request('/upload', 'POST', formData, true)
        .then(response => {
          onMottoChange(response.motto);
        })
        .catch(error => console.error('Error uploading audio:', error));
    }
  };

  return (
    <div>
      {isRecording ? (
        <button onClick={handleStopRecording}>Stop Recording</button>
      ) : (
        <button onClick={() => setIsRecording(true)}>Record (New) Motto</button>
      )}
      {recordedAudioBlob && (
        <button onClick={handleUploadAudio}>Upload Audio</button>
      )}
    </div>
  );
};

export default AudioRecorder;
