import { inferProcedureOutput } from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { AppRouter, appRouter } from '../../../backend/router';

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => null,
});

export type inferQueryResponse<TRouteKey extends keyof AppRouter['_def']['queries']> = inferProcedureOutput<
  AppRouter['_def']['queries'][TRouteKey]
>;

export type AsyncReturnType<T extends (...args: any) => Promise<any>> = T extends (...args: any) => Promise<infer R>
  ? R
  : any;
