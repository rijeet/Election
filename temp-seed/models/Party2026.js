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
// Mongoose Schema
const Party2026Schema = new mongoose_1.Schema({
    party: {
        name: { type: String, required: true, unique: true },
        abbreviation: { type: String, required: true },
        leader: { type: String, required: true },
        symbol: {
            name: { type: String, required: true },
            image_url: { type: String, required: true }
        }
    },
    alliance: {
        name: { type: String, required: true },
        type: { type: String, required: true },
        member_parties: [{ type: String }]
    },
    manifesto: {
        election_year: { type: Number, required: true, default: 2026 },
        highlights: [{ type: String }],
        full_document_url: { type: String, default: '' }
    }
}, {
    collection: 'party2026',
    timestamps: true
});
// Prevent model recompilation
exports.default = mongoose_1.default.models.Party2026 || mongoose_1.default.model('Party2026', Party2026Schema);
