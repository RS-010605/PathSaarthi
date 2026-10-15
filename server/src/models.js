import mongoose from "mongoose";
const { Schema, model } = mongoose;
const RoadmapStepSchema = new Schema(
  {
    id: String,
    title: { type: String, required: true },
    description: String,
    sequence: { type: Number, default: 1 },
    prerequisites: [String],
    skillIds: [String],
    resourceIds: [String],
    requirementType: { type: String, default: "recommended" },
  },
  { _id: false },
);
const ResourceSchema = new Schema(
  {
    title: String,
    url: String,
    language: String,
    type: String,
    verified: { type: Boolean, default: false },
  },
  { _id: false },
);
const CareerSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    industry: String,
    responsibilities: [Schema.Types.Mixed],
    qualifications: [Schema.Types.Mixed],
    skills: [Schema.Types.Mixed],
    roadmap: [RoadmapStepSchema],
    resources: [ResourceSchema],
    trending: { type: Boolean, default: false },
    trendingPriority: { type: Number, default: 99 },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    contentStatus: String,
    languages: [String],
  },
  { timestamps: true, strict: false },
);
const ContributionSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    type: String,
    careerId: String,
    title: { type: String, required: true },
    proposed: String,
    explanation: String,
    sourceUrl: String,
    contributor: String,
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "reviewed"],
      default: "pending",
      index: true,
    },
    reviewNotes: String,
    reviewedAt: Date,
    applicationStatus: { type: String, default: "not_applied" },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true, strict: false },
);
export const Career = mongoose.models.Career || model("Career", CareerSchema);
export const Contribution =
  mongoose.models.Contribution || model("Contribution", ContributionSchema);
