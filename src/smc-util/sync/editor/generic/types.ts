/* A Patch is an entry in the patches table, as represented
   in memory locally here.
*/

import { SyncTable } from "../../table/synctable";

export interface Patch {
  time: Date; // timestamp of when patch made
  patch: CompressedPatch /* compressed format patch (stored as a
                   JSON *string* in database, but array/object here) */;
  user_id: number /* 0-based integer "id" of user
                     syncstring table has id-->account_id map) */;
  snapshot?: string; // to_str() applied to the document at this point in time
  sent?: Date; // when patch actually sent, which may be later than when made
  prev?: Date; // timestamp of previous patch sent from this session
}

export interface Document {
  apply_patch(CompressedPatch): Document;
  make_patch(Document): CompressedPatch;
  is_equal(Document): boolean;
  to_str(): string;
}

export type CompressedPatch = any[];

/* This is what we need from the "client".
There's actually a completely separate client
that runs in the browser and one on the project,
but anything that has the following interface
might work... */
export interface Client {
  server_time: () => Date;
  is_user: () => boolean;
  is_project: () => boolean;
  dbg: (desc: string) => Function;
  mark_file: (
    opts: {
      project_id: string;
      path: string;
      action: string;
      ttl: number;
    }
  ) => void;
  query: (opts: { query: any; cb: Function }) => void;

  // Only required to work on project client.
  path_access: (opts: { path: string; mode: string; cb: Function }) => void;
  path_exists: (opts: { path: string; cb: Function }) => void;
  path_stat: (opts: { path: string; cb: Function }) => void;

  synctable2: (query:any, options:any, throttle_changes?:number) => SyncTable;
}

export interface DocType {
  type: string;
  patch_format?: number; // 0=string or 1=dbdoc, if given
}
