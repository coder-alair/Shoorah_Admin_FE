import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const FormAudioPlayer = ({ audio, setMin, setSec, flag }) => {
  const audioEl = useRef(null);

  const handleLoadedMetadata = () => {
    const video = audioEl.current;
    if (!video) return;
    let minutes = Math.floor(video.duration / 60);
    let extraSeconds = video.duration % 60;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    let sec = parseInt(extraSeconds);
    sec = sec < 10 ? '0' + sec : sec;
    setMin(minutes);
    setSec(sec);
  };

  function changeSource(url) {
    const video = document.getElementById('audio');
    video.src = url;
  }

  useEffect(() => {
    changeSource(audio);
  }, [audio]);

  return (
    <div className={flag ? 'mt-1' : 'mt-2'}>
      <audio
        id="audio"
        onLoadedMetadata={handleLoadedMetadata}
        ref={audioEl}
        controls
        className="h-[42px]"
        style={{ width: '-webkit-fill-available' }}
      >
        <source src={audio} type="audio/ogg" />
      </audio>
    </div>
  );
};

FormAudioPlayer.propTypes = {
  audio: PropTypes.any,
  setMin: PropTypes.func,
  setSec: PropTypes.func,
  flag: PropTypes.func
};

export default FormAudioPlayer;
