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
  console.log('useInstruments fired', instrumentSymbols);

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
  id: string;
}

function InstrumentReel({ instrumentSymbols, id }: InstrumentReelProps) {
  /**
   * ❌ Please do not edit this
   */
  const instruments = useInstruments(instrumentSymbols);

  console.log({ instruments });

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
        {instruments.map((instrument) => (
          <ReelItem
            key={instrument.code}
            instrument={instrument}
          />
        ))}
      </div>
      <div className='instrument-reel'>
        <p>ID: {id}</p>
      </div>
    </div>
  );
}

export default InstrumentReel;
