import type { Types, Document, SchemaTimestampsConfig } from "mongoose";

export type TDocument = Pick<Document<string>, "_id"> &
  Omit<SchemaTimestampsConfig, "currentTime">;

// export type TDocument = {
//   _id: Types.ObjectId;
// } & Omit<SchemaTimestampsConfig, "currentTime">;
