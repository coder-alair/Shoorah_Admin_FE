import { PauseIcon, PlayIcon } from '@heroicons/react/24/outline';
import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const AudioPlayer = ({ audioPath, playing, onPlay, pauseHandler }) => {
  const audioRef = useRef(new Audio(audioPath));
  const [currentTime, setCurrentTime] = useState('00:00');

  useEffect(() => {
    if (playing) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
    return () => {
      audioRef.current.pause();
    };
  }, [playing]);

  useEffect(() => {
    if (audioRef.current) {
      const handler = () => {
        pauseHandler();
      };
      audioRef.current.addEventListener('ended', handler);
    }
  }, [audioRef.current]);

  window.setInterval(function () {
    setCurrentTime(
      moment().startOf('day').add(audioRef.current.currentTime, 'minutes').format('HH:mm')
    );
  }, 1000);

  return (
    <div>
      {playing ? (
        <div className="flex">
          <div className="flex text-[12px]">
            <span>{currentTime}</span>/
            <span>
              {moment().startOf('day').add(audioRef.current?.duration, 'minutes').format('HH:mm')}
            </span>
          </div>
          <PauseIcon
            onClick={() => pauseHandler()}
            className="w-[20px] ml-auto text-shoorah-secondary cursor-pointer"
          />
        </div>
      ) : (
        <div>
          <PlayIcon
            onClick={() => onPlay()}
            className="w-[20px] ml-auto text-shoorah-secondary cursor-pointer"
          />
        </div>
      )}
    </div>
  );
};
AudioPlayer.propTypes = {
  audioPath: PropTypes.any,
  playing: PropTypes.any,
  onPlay: PropTypes.func,
  pauseHandler: PropTypes.func
};
export default AudioPlayer;
