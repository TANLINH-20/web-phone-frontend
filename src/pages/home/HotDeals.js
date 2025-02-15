import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const HotDeals = () => {
  const [endDate, setEndDate] = useState('2024-7-31');
  const [timerDays, setTimerDays] = useState('00');
  const [timerHours, setTimerHours] = useState('00');
  const [timerMinutes, setTimerMinutes] = useState('00');
  const [timerSeconds, setTimerSeconds] = useState('00');

  let interval = useRef();

  const startTimer = () => {
    const countDownDate = new Date(endDate).getTime();

    interval.current = setInterval(() => {
      const now = new Date().getTime();
      const distance = countDownDate - now;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (distance < 0) {
        // Stop timer
        clearInterval(interval.current);
      } else {
        // Update timer
        setTimerDays(days);
        setTimerHours(hours);
        setTimerMinutes(minutes);
        setTimerSeconds(seconds);
      }
    }, 1000);
  };

  useEffect(() => {
    const fetchEndDate = async () => {
      try {
        const result = await axios.get('http://127.0.0.1:8000/api/product/hot-deal');
        setEndDate(result.data.ends);
      } catch (error) {
        console.log(error);
      }
    };

    fetchEndDate();

    if (endDate) {
      startTimer();
    }

    return () => {
      clearInterval(interval.current);
    };
  }, [endDate]);

  return (
    <div id="hot-deal" className="section">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="hot-deal">
              <ul className="hot-deal-countdown">
                <li>
                  <div>
                    <h3>{timerDays}</h3>
                    <span>days</span>
                  </div>
                </li>
                <li>
                  <div>
                    <h3>{timerHours}</h3>
                    <span>Hours</span>
                  </div>
                </li>
                <li>
                  <div>
                    <h3>{timerMinutes}</h3>
                    <span>Mins</span>
                  </div>
                </li>
                <li>
                  <div>
                    <h3>{timerSeconds}</h3>
                    <span>Secs</span>
                  </div>
                </li>
              </ul>
              <h2 className="text-uppercase">hot deal this week</h2>
              <p>New Collection Up to 50% OFF</p>
              <Link className="primary-btn cta-btn" to={'/'}>Shop now</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotDeals;
