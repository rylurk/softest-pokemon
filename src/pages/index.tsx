import React, { useEffect, useState } from 'react';
import { getOptionsForVote } from '../utils/getRandomPokemon';
import { trpc } from '../utils/trpc';
import { inferQueryResponse } from './api/trpc/[trpc]';
import Image from 'next/image';
import Link from 'next/link';

const btn =
  'inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500';

export default function Home() {
  const [ids, setIds] = useState([0, 0]);
  const [first, second] = ids;

  useEffect(() => {
    setIds(getOptionsForVote());
  }, []);

  const firstPokemon = trpc.useQuery(['get-pokemon-by-id', { id: first }]);
  const secondPokemon = trpc.useQuery(['get-pokemon-by-id', { id: second }]);

  const voteMutation = trpc.useMutation(['cast-vote']);

  const voteForRoundest = (selected: number) => {
    if (selected === first) {
      voteMutation.mutate({ votedFor: first, votedAgainst: second });
    } else {
      voteMutation.mutate({ votedFor: second, votedAgainst: first });
    }

    setIds(getOptionsForVote());
  };

  const dataLoaded = !firstPokemon.isLoading && firstPokemon.data && !secondPokemon.isLoading && secondPokemon.data;

  return (
    <div className="h-screen w-screen flex flex-col justify-between items-center">
      <div className="text-2xl text-center py-20">
        Which <span className="text-red-400">Pokémon</span> is softer?
      </div>
      {dataLoaded && (
        <div className="flex justify-between max-w-2xl items-center">
          <PokemonListing pokemon={firstPokemon.data} vote={() => voteForRoundest(first)} />
          <div className="p-8">Vs</div>
          <PokemonListing pokemon={secondPokemon.data} vote={() => voteForRoundest(second)} />
        </div>
      )}
      {!dataLoaded && <img className="w-48" src="rings.svg" />}
      <div className="w-full text-xl text-center py-20">
        <Link href="/results">Results</Link>
      </div>
    </div>
  );
}

type PokemonFromServer = inferQueryResponse<'get-pokemon-by-id'>;

const PokemonListing: React.FC<{ pokemon: PokemonFromServer; vote: () => void }> = (props) => {
  return (
    <div className="w-64 h-64 flex flex-col items-center">
      <Image src={props.pokemon.spriteUrl} height="256" width="256" layout="fixed" />
      <div className="text-xl text-center capitalize mb-4">{props.pokemon.name}</div>
      <button className={btn} onClick={() => props.vote()}>
        Softer
      </button>
    </div>
  );
};
