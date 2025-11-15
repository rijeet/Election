"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const FamilyMemberSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    occupation: { type: String, default: '' },
    nationality: { type: String, default: '' },
    img_url: { type: String, default: '' }
}, { _id: false });
const InfoCandidateSchema = new mongoose_1.Schema({
    id: { type: String, required: true, unique: true },
    constituency: { type: String, required: true },
    division: { type: String, default: '' },
    district: { type: String, default: '' },
    party: { type: String, required: true },
    candidate_name: { type: String, required: true },
    gender: { type: String, default: '' },
    personal_info: {
        occupation_category: { type: String, default: '' },
        profession_details: { type: String, default: '' },
        education_category: { type: String, default: '' },
        education_details: { type: String, default: '' }
    },
    income: { type: String, default: '' },
    tax: { type: String, default: '' },
    assets: { type: String, default: '' },
    liabilities: { type: String, default: '' },
    expenditure: { type: String, default: '' },
    controversial: [{
            NEWS: { type: String, default: '' },
            youtubes: [{ type: String }]
        }],
    family: {
        spouse: { type: FamilyMemberSchema, default: undefined },
        sons: { type: [FamilyMemberSchema], default: undefined },
        daughters: { type: [FamilyMemberSchema], default: undefined }
    },
    media: {
        img_url: { type: String, default: '' }
    },
    metadata: {
        created_at: { type: String, required: true },
        source: { type: String, required: true },
        record_index: { type: Number, required: true }
    }
}, {
    collection: 'info_candidate',
    timestamps: true
});
// Prevent model recompilation
exports.default = mongoose_1.default.models.InfoCandidate || mongoose_1.default.model('InfoCandidate', InfoCandidateSchema);
