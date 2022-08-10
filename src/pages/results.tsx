import { GetStaticProps } from 'next';
import Image from 'next/image';
import { prisma } from '../backend/utils/prisma';
import { AsyncReturnType } from './api/trpc/[trpc]';

const getPokemonInOrder = async () => {
  return await prisma.pokemon.findMany({
    orderBy: {
      VoteFor: { _count: 'desc' },
    },
    select: {
      id: true,
      name: true,
      spriteUrl: true,
      _count: {
        select: {
          VoteFor: true,
          VoteAgainst: true,
        },
      },
    },
  });
};

type PokemonQueryResult = AsyncReturnType<typeof getPokemonInOrder>;

const PokemonListing = (props: { pokemon: PokemonQueryResult[number] }) => {
  return (
    <div className="flex border-b p-2 items-center">
      <Image src={props.pokemon.spriteUrl} width={64} height={64} layout="fixed" />
      <div className="capitalize">{props.pokemon.name}</div>
    </div>
  );
};

export default function ResultsPage(props: { pokemon: PokemonQueryResult }) {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl p-4">Results</h2>
      <div className="flex flex-col w-full max-w-2xl border">
        {props.pokemon.map((p, index) => {
          return <PokemonListing pokemon={p} key={index} />;
        })}
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const pokemonOrdered = await getPokemonInOrder();
  return { props: { pokemon: pokemonOrdered }, revalidate: 60 };
};
