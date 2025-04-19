import { Schema, model, models } from "mongoose";

const spaceSchema = new Schema({
  code: { 
    type: String, 
    required: true 
  },
  cropType: {
    type: String, 
    default: null 
  },
  cropNFT: { 
    type: String,
    default: null
  },
  soil: { 
    type: String,
    required: true
  },
  occupied: { 
    type: Boolean, 
    default: false 
  },
  owner: { 
    type: String, 
    default: null
  },
  plantingDate: { 
    type: Date, 
    default: null 
  },
  growthDuration: { 
    type: String, 
    default: null 
  },
  harvest: {
    type: Boolean, 
    default: false 
  },
}, { timestamps: true });

const Space = models.Space || model('Space', spaceSchema);

export default Space;