import { Instrument } from '../../common-leave-me';
import './ReelItem.css';
import { useEffect, useRef } from 'react';

function getStyle({ currentQuote, lastQuote }: {
  currentQuote: number,
  lastQuote: number
}) {
  if (currentQuote > lastQuote) {
    return 'green';
  } else if (currentQuote < lastQuote) {
    return 'red';
  } else {
    return 'grey';
  }
}

function calculateDifference({
  currentQuote,
  lastQuote
}: {
  currentQuote: number;
  lastQuote: number
}): string {
  const difference = (currentQuote / lastQuote - 1);
  if (isFinite(difference)) {
    return `${difference > 0 ? '+' : ''}${difference.toFixed(4)}%`;
  } else {
    return '0.0000%';
  }
}

export const ReelItem = (props: { instrument: Instrument }) => {
  const { instrument } = props;
  const ref = useRef<number>(0);

  useEffect(() => {
    ref.current = instrument.lastQuote;
  }, [ props.instrument.lastQuote ]);

  return (
    <div
      key={instrument.code}
      className='reel-item'
    >
      <div className='reel-item-icon'>
        {instrument.code === 'EURUSD' ? (
          <>
            <img
              className='image'
              src={`/${instrument.category}/USD.svg`}
              alt='USD'
            />
            <img
              className='image'
              src={`/${instrument.category}/EUR.svg`}
              alt='EUR'
            />
          </>
        ) : (
          <img
            alt={instrument.code}
            src={`/${instrument.category}/${instrument.code}.svg`}
          />
        )
        }
      </div>
      <div className={'reel-item-name'}>
        <span>{instrument.name}</span>
      </div>
      <div
        className={`reel-item-quote`}
        style={{
          color: getStyle({
            currentQuote: instrument.lastQuote,
            lastQuote: ref.current
          })
        }}
      >
        <div>
          {instrument.lastQuote.toFixed(1)}
        </div>
        <div>
          {calculateDifference({
            currentQuote: instrument.lastQuote,
            lastQuote: ref.current
          })}
        </div>
      </div>
    </div>
  );
};
