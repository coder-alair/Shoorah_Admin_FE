import React from 'react';
import PropTypes from 'prop-types';

export default function Timer({ setTimeUp }) {
  const [countDown, setCountDown] = React.useState(0);
  const [runTimer, setRunTimer] = React.useState(true);

  React.useEffect(() => {
    let timerId;
    if (runTimer) {
      setCountDown(30);
      timerId = setInterval(() => {
        setCountDown((countDown) => countDown - 1);
      }, 1000);
    } else {
      clearInterval(timerId);
    }

    return () => clearInterval(timerId);
  }, [runTimer]);

  React.useEffect(() => {
    if (countDown < 0 && runTimer) {
      setTimeUp(true);
      setRunTimer(false);
      setCountDown(0);
    }
  }, [countDown, runTimer]);

  const seconds = String(countDown % 60).padStart(2, 0);
  const minutes = String(Math.floor(countDown / 60)).padStart(2, 0);
  return (
    <div className={'first-letter:text-right mr-1 mt-1 text-sm text-shoorah-secondary flex'}>
      Time Remaining: {minutes}:{seconds}
    </div>
  );
}

Timer.propTypes = {
  setTimeUp: PropTypes.func
};
