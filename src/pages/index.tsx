import { useEffect, useState } from 'react';
import { getOptionsForVote } from '../utils/getRandomPokemon';

export default function Home() {
  const [ids, setIds] = useState([0, 0]);
  const [first, second] = ids;

  useEffect(() => {
    setIds(getOptionsForVote());
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div className="text-2xl text-center">Which Pokémon is softer?</div>
      <div className="p-2" />
      <div className="border rounded p-8 flex justify-between max-w-2xl items-center">
        <div className="w-16 h-16 bg-red-800">{first}</div>
        <div className="p-8">Vs</div>
        <div className="w-16 h-16 bg-red-800">{second}</div>
      </div>
    </div>
  );
}
