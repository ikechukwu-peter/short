import { Schema, model, Document } from "mongoose";

interface IShorten extends Document {
  shorturl: string | undefined;
  created_at: Date | number;
  longurl: string;
  accessed: number;
}

const schema = new Schema<IShorten>({
  shorturl: {
    type: String,
    required: true,
    unique: true,
  },
  longurl: {
    type: String,
    required: true,
  },
  accessed: {
    type: Number,
    default: 0,
  },

  created_at: {
    type: Date,
    default: Date.now(),
  },
});

const ShortenModel = model<IShorten>("shorten", schema);

export default ShortenModel;
