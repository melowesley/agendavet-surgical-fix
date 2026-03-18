// Declarações de tipos globais para Deno (fallback para quem não tem a extensão instalada)
declare namespace Deno {
  export interface Env {
    get(key: string): string | undefined;
    toObject(): { [key: string]: string };
  }

  export const env: Env;

  export function serve(
    handler: (request: Request) => Response | Promise<Response>,
    options?: { port?: number }
  ): void;
}

// Declarações para módulos HTTP do Deno
declare module "https://deno.land/std@0.168.0/http/server.ts" {
  export function serve(
    handler: (request: Request) => Response | Promise<Response>,
    options?: { port?: number }
  ): void;
}

// Declarações para Supabase
declare module "https://esm.sh/@supabase/supabase-js@2" {
  export interface SupabaseClient {
    from(table: string): any;
    auth: any;
    storage: any;
    rpc(fn: string, params?: any): any;
  }

  export function createClient(
    supabaseUrl: string,
    supabaseKey: string,
    options?: any
  ): SupabaseClient;
}
