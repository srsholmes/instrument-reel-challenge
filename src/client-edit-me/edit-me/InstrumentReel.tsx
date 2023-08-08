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

function getDuplicates(instruments: Instrument[]): Instrument[] {
  if (instruments.length >= 7 || instruments.length === 0) return instruments;
  let duplicates: Instrument[] = [ ...instruments ];
  while (duplicates.length < 8) {
    duplicates = duplicates.concat(instruments);
  }
  console.log({ duplicates })
  return duplicates;
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

  return (
    <div className={'reels'}>
      <div>
        <h1>Instrument Reel</h1>
      </div>
      <div className={'reel-wrapper'}>
        <div
          style={{
            animation: `scroll 21000ms linear infinite`
          }}
          className={'reels-scroller'}
        >
          {instruments.map((instrument) => (
            <ReelItem
              key={instrument.code}
              instrument={instrument}
            />
          ))}
          {getDuplicates(instruments).map((instrument, index) => (
            <ReelItem
              key={index}
              instrument={instrument}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default InstrumentReel;
