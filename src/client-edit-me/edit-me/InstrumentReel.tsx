/**
 * ☑️ You can edit MOST of this file to add your own styles.
 */

/**
 * ✅ You can add/edit these imports
 */
import { Instrument, InstrumentSymbol } from '../../common-leave-me';
import { InstrumentSocketClient } from './InstrumentSocketClient';
import './InstrumentReel.css';
import { useEffect, useId, useRef, useState } from 'react';
import { ReelItem } from './ReelItem';

/**
 * ❌ Please do not edit this
 */
const client = new InstrumentSocketClient();

/**
 * ❌ Please do not edit this hook name & args
 */
function useInstruments(instrumentSymbols: InstrumentSymbol[]) {
  /**
   * ✅ You can edit inside the body of this hook
   */

  const ref = useRef<string | null>(null);
  const id = useId();
  const [ instruments, setInstruments ] = useState<Instrument[]>([]);

  useEffect(() => {
    if (!ref.current) {
      ref.current = id;
      client.addReel({
        instrumentSymbols,
        id: ref.current,
        setInstruments
      });
    }

    return () => {
      if (ref.current !== null) {
        client.removeReel({ id: ref.current });
        ref.current = null;
      }
    };
  }, []);

  return instruments;
}

export interface InstrumentReelProps {
  instrumentSymbols: InstrumentSymbol[];
}

function InstrumentReel({ instrumentSymbols }: InstrumentReelProps) {
  /**
   * ❌ Please do not edit this
   */
  const instruments = useInstruments(instrumentSymbols);

  /**
   * ✅ You can edit from here down in this component.
   * Please feel free to add more components to this file or other files if you want to.
   */

  const wrapper = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const [ animate, setAnimate ] = useState<boolean>(false);

  useEffect(() => {
    if (!scroller.current || !wrapper.current) return;
    const wrapperWidth = wrapper.current.getBoundingClientRect().width;
    const items = wrapper.current.querySelectorAll('.reel-item-instrument');
    let itemsWidth = 0;
    items.forEach((item) => {
      itemsWidth += item.getBoundingClientRect().width;
    });
    if (itemsWidth > wrapperWidth) {
      const totalWidth = itemsWidth * 2;
      const difference = totalWidth - wrapperWidth;
      const speed = difference / 50;
      scroller.current.style.setProperty('--animation-duration', `${speed}s`);
      setAnimate(true);

    } else {
      setAnimate(false);
    }
  }, [ instruments ]);

  return (
    <div className={'reels'}>
      <div
        ref={wrapper}
        className={'reel-wrapper'}
      >
        <div
          ref={scroller}
          className={`reels-scroller ${animate ? 'animation' : 'no-animation'}`}
        >
          {instruments.map((instrument) => (
            <ReelItem
              isDuplicate={false}
              instrument={instrument}
            />
          ))}
          {
            animate ? (
              instruments.map((instrument, index) => (
                <>
                  <ReelItem
                    isDuplicate={true}
                    instrument={instrument}
                  />
                </>
              ))
            ) : null
          }

        </div>
      </div>
    </div>
  );
}

export default InstrumentReel;
