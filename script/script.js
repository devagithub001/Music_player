import { data } from "../data/data.js";

// Declare global variables
let currId;
let curr_song;

// Audio context and variables
let audioCtx;
let audioBuffer;
let startTime = 0;
let endTime = 10;
document.addEventListener('DOMContentLoaded', function() {
  // Get the value of the id parameter from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  console.log(id);
  currId = parseInt(id); // Assign id to the global currId variable
  
  // Find the current song based on the ID
  curr_song = data.find(song => song.id === currId);
  
  // Call function to load audio file and draw waveform if curr_song exists
  if (curr_song) {
    loadAudioAndDrawWaveform();
  } else {
    console.error('Song with ID ' + currId + ' not found.');
  }
});
function loadAudioAndDrawWaveform() {
  // Fetch audio file and draw waveform
  fetch(`../data/${curr_song.file_location}`)
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => {
      // Decode audio data
      audioCtx = new AudioContext();
      return audioCtx.decodeAudioData(arrayBuffer);
    })
    .then(decodedData => {
      // Store decoded audio data
      audioBuffer = decodedData;
      drawWaveform();
    })
    .catch(error => console.error('Error loading audio file:', error));
}
// Initialize canvas and audio context
const canvas = document.getElementById('waveformCanvas');
const ctx = canvas.getContext('2d');

let endTimeCursorX = canvas.width / 2; // Initialize cursor position at the center

// Function to draw the waveform with end time cursor
function drawWaveform() {
    const width = canvas.width;
    const height = canvas.height;
    const channelData = audioBuffer.getChannelData(0);
    const step = Math.ceil(channelData.length / width);
    const amp = height / 5; // Adjust amplitude to control the waveform height
    const gap = 2; // Define the gap between waves

    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black'; // Set the waveform color

    for (let i = 0; i < width; i++) {
        let min = 1.0;
        let max = -1.0;
        for (let j = 0; j < step; j++) {
            const datum = channelData[(i * step) + j];
            if (datum < min) {
                min = datum;
            }
            if (datum > max) {
                max = datum;
            }
        }

        // Scale the waveform to fit the canvas height and center it vertically
        const scaledMin = (1 + min) * amp + height / 2;
        const scaledMax = (1 + max) * amp + height / 2;

        // Draw the waveform with a gap between waves
        ctx.moveTo(i, scaledMin);
        ctx.lineTo(i, scaledMax);
        i += gap;
    }

    // Draw the end time cursor line
    ctx.strokeStyle = 'white';
    ctx.moveTo(endTimeCursorX, 0);
    ctx.lineTo(endTimeCursorX, height);
    ctx.stroke();
}

// Add event listener to track cursor position and update end time cursor
// Add event listener to track cursor position and update end time cursor
// Add event listener to track cursor position and update end time cursor
canvas.addEventListener('mousemove', function(event) {
    const rect = canvas.getBoundingClientRect();
    let mouseX = event.clientX - rect.left;
    const width = canvas.width;

    // Ensure mouseX stays within the bounds of the canvas
    mouseX = Math.max(0, Math.min(width, mouseX));

    const duration = audioBuffer.duration;

    // Calculate the percentage of the waveform width that the cursor represents
    const percentage = mouseX / width;
    
    // Calculate the corresponding time in the audio based on the percentage
    endTime = duration * percentage;

    // Update the end time field
    document.getElementById('endTime').value = endTime.toFixed(2);

    // Update the end time cursor position
    endTimeCursorX = mouseX;

    drawWaveform(); // Redraw the waveform with updated cursor position
});

// Add event listener to select end time on click
canvas.addEventListener('click', function(event) {
    const rect = canvas.getBoundingClientRect();
    let mouseX = event.clientX - rect.left;
    const width = canvas.width;

    // Ensure mouseX stays within the bounds of the canvas
    mouseX = Math.max(0, Math.min(width, mouseX));

    const duration = audioBuffer.duration;

    // Calculate the percentage of the waveform width that the cursor represents
    const percentage = mouseX / width;
    
    // Calculate the corresponding time in the audio based on the percentage
    endTime = duration * percentage;

    // Update the end time field
    document.getElementById('endTime').value = endTime.toFixed(2);

    // Update the end time cursor position
    endTimeCursorX = mouseX;

    drawWaveform(); // Redraw the waveform with updated cursor position
});



  


  
  
  

// Function to update start and end time
function updateTimes() {
  startTime = parseFloat(document.getElementById('startTime').value);
  endTime = parseFloat(document.getElementById('endTime').value);
}

// Function to trim and download audio
// Function to trim and download audio
// Function to trim and download audio

document.querySelector('.downloadbtn').addEventListener('click',()=>trimAndDownloadAudio(true))
document.querySelector('.downloadbtn2').addEventListener('click',()=>trimAndDownloadAudio(false))
function trimAndDownloadAudio(type) {
    updateTimes();
  
    if (isNaN(startTime) || isNaN(endTime) || startTime >= endTime) {
      alert('Invalid start or end time.');
      return;
    }
    if(type){
      const duration = endTime - startTime;
    const source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioCtx.destination);
    source.start(0, startTime, duration);
  
    setTimeout(() => {
      source.stop();
      const offlineCtx = new OfflineAudioContext(1, Math.ceil(duration * audioBuffer.sampleRate), audioBuffer.sampleRate);
      const sourceBuffer = offlineCtx.createBufferSource();
      sourceBuffer.buffer = audioBuffer;
      sourceBuffer.connect(offlineCtx.destination);
      sourceBuffer.start(0, startTime, duration);
      offlineCtx.startRendering().then(renderedBuffer => {
        const audioBlob = bufferToBlob(renderedBuffer);
        const audioUrl = URL.createObjectURL(audioBlob);
        const link = document.createElement('a');
        link.href = audioUrl;
        link.download = 'trimmed_audio.mp3';
        link.click();
        URL.revokeObjectURL(audioUrl);
      });
    
    }, duration * 1000);
    }else{
      const duration = endTime - startTime;
    const source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioCtx.destination);
    // source.start(0, startTime, duration);
  
    setTimeout(() => {
      // source.stop();
      const offlineCtx = new OfflineAudioContext(1, Math.ceil(duration * audioBuffer.sampleRate), audioBuffer.sampleRate);
      const sourceBuffer = offlineCtx.createBufferSource();
      sourceBuffer.buffer = audioBuffer;
      sourceBuffer.connect(offlineCtx.destination);
      sourceBuffer.start(0, startTime, duration);
      offlineCtx.startRendering().then(renderedBuffer => {
        const audioBlob = bufferToBlob(renderedBuffer);
        const audioUrl = URL.createObjectURL(audioBlob);
        const link = document.createElement('a');
        link.href = audioUrl;
        link.download = 'trimmed_audio.mp3';
        link.click();
        URL.revokeObjectURL(audioUrl);
      });
    },1000);
    // }, duration * 1000);
    }
    
  }
  
  

// Function to convert audio buffer to blob
function bufferToBlob(buffer) {
  const numberOfChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const length = buffer.length;
  const audioData = [];
  
  for (let channel = 0; channel < numberOfChannels; channel++) {
    audioData.push(buffer.getChannelData(channel));
  }

  const interleaved = interleave(audioData);
  const dataView = encodeWAV(interleaved, numberOfChannels, sampleRate);
  const blob = new Blob([dataView], { type: 'audio/mp3' });
  return blob;
}

// Function to interleave audio data
function interleave(channelBuffer) {
  const numberOfChannels = channelBuffer.length;
  const length = channelBuffer[0].length;
  const result = new Float32Array(length * numberOfChannels);
  
  for (let i = 0; i < length; i++) {
    for (let channel = 0; channel < numberOfChannels; channel++) {
      result[i * numberOfChannels + channel] = channelBuffer[channel][i];
    }
  }

  return result;
}

// Function to encode WAV data
function encodeWAV(samples, numberOfChannels, sampleRate) {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);
  const sampleSize = 16 / 8;

  // RIFF identifier
  writeString(view, 0, 'RIFF');
  // RIFF chunk length
  view.setUint32(4, 36 + samples.length * 2, true);
  // RIFF type
  writeString(view, 8, 'WAVE');
  // format chunk identifier
  writeString(view, 12, 'fmt ');
  // format chunk length
  view.setUint32(16, 16, true);
  // sample format (1 is PCM)
  view.setUint16(20, 1, true);
  // number of channels
  view.setUint16(22, numberOfChannels, true);
  // sample rate
  view.setUint32(24, sampleRate, true);
  // byte rate (sample rate * block align)
  view.setUint32(28, sampleRate * numberOfChannels * sampleSize, true);
  // block align (number of channels * bytes per sample)
  view.setUint16(32, numberOfChannels * sampleSize, true);
  // bits per sample
  view.setUint16(34, sampleSize * 8, true);
  // data chunk identifier
  writeString(view, 36, 'data');
  // data chunk length
  view.setUint32(40, samples.length * 2, true);

  // write the PCM samples
  floatTo16BitPCM(view, 44, samples);

  return view;
}

// Helper functions to write data to DataView
function writeString(view, offset, string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

function floatTo16BitPCM(view, offset, input) {
  for (let i = 0; i < input.length; i++, offset += 2) {
    const sample = Math.max(-1, Math.min(1, input[i]));
    view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
  }
}
