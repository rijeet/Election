'use client';

import React, { useState, useEffect } from 'react';

interface ConstituencyData {
  party: string;
  color: string;
  candidate: string;
  isWinner: boolean;
}

interface PartyInfo {
  name: string;
  color: string;
  seats: number;
}

interface ParliamentData {
  electionYear: string;
  constituencies: Record<number, ConstituencyData>;
  parties: PartyInfo[];
  totalSeats: number;
}

interface ParliamentSeatingChartProps {
  electionYear: string;
}

// Semi-circular parliament seating arrangement from Bangladesh_Parliament_1988.svg
const PARLIAMENT_CIRCLES = [
  { cx: 10.23, cy: 174.85, r: 4.12, constituency: 1 },
  { cx: 20.52, cy: 174.85, r: 4.12, constituency: 2 },
  { cx: 30.82, cy: 174.85, r: 4.12, constituency: 3 },
  { cx: 41.12, cy: 174.85, r: 4.12, constituency: 4 },
  { cx: 51.43, cy: 174.85, r: 4.12, constituency: 5 },
  { cx: 61.73, cy: 174.85, r: 4.12, constituency: 6 },
  { cx: 72.03, cy: 174.85, r: 4.12, constituency: 7 },
  { cx: 82.34, cy: 174.85, r: 4.12, constituency: 8 },
  { cx: 92.65, cy: 174.85, r: 4.12, constituency: 9 },
  { cx: 11.03, cy: 162.71, r: 4.12, constituency: 10 },
  { cx: 21.39, cy: 162.61, r: 4.12, constituency: 11 },
  { cx: 31.73, cy: 162.82, r: 4.12, constituency: 12 },
  { cx: 42.11, cy: 162.72, r: 4.12, constituency: 13 },
  { cx: 52.46, cy: 162.96, r: 4.12, constituency: 14 },
  { cx: 62.87, cy: 162.86, r: 4.12, constituency: 15 },
  { cx: 73.3, cy: 162.73, r: 4.12, constituency: 16 },
  { cx: 12.7, cy: 150.66, r: 4.12, constituency: 17 },
  { cx: 83.77, cy: 162.57, r: 4.12, constituency: 18 },
  { cx: 23.2, cy: 150.47, r: 4.12, constituency: 19 },
  { cx: 33.6, cy: 150.9, r: 4.12, constituency: 20 },
  { cx: 94.29, cy: 162.37, r: 4.12, constituency: 21 },
  { cx: 44.15, cy: 150.71, r: 4.12, constituency: 22 },
  { cx: 54.58, cy: 151.22, r: 4.12, constituency: 23 },
  { cx: 15.23, cy: 138.76, r: 4.12, constituency: 24 },
  { cx: 65.21, cy: 151.04, r: 4.12, constituency: 25 },
  { cx: 25.93, cy: 138.51, r: 4.12, constituency: 26 },
  { cx: 75.92, cy: 150.83, r: 4.12, constituency: 27 },
  { cx: 36.43, cy: 139.17, r: 4.12, constituency: 28 },
  { cx: 47.24, cy: 138.93, r: 4.12, constituency: 29 },
  { cx: 86.74, cy: 150.57, r: 4.12, constituency: 30 },
  { cx: 18.61, cy: 127.07, r: 4.12, constituency: 31 },
  { cx: 57.79, cy: 139.73, r: 4.12, constituency: 32 },
  { cx: 29.57, cy: 126.79, r: 4.12, constituency: 33 },
  { cx: 97.71, cy: 150.26, r: 4.12, constituency: 34 },
  { cx: 68.75, cy: 139.52, r: 4.12, constituency: 35 },
  { cx: 40.19, cy: 127.71, r: 4.12, constituency: 36 },
  { cx: 79.87, cy: 139.29, r: 4.12, constituency: 37 },
  { cx: 51.34, cy: 127.47, r: 4.12, constituency: 38 },
  { cx: 22.81, cy: 115.65, r: 4.12, constituency: 39 },
  { cx: 62.05, cy: 128.58, r: 4.12, constituency: 40 },
  { cx: 34.11, cy: 115.39, r: 4.12, constituency: 41 },
  { cx: 91.2, cy: 139.04, r: 4.12, constituency: 42 },
  { cx: 44.88, cy: 116.59, r: 4.12, constituency: 43 },
  { cx: 73.44, cy: 128.43, r: 4.12, constituency: 44 },
  { cx: 27.82, cy: 104.56, r: 4.12, constituency: 45 },
  { cx: 56.43, cy: 116.41, r: 4.12, constituency: 46 },
  { cx: 102.83, cy: 138.76, r: 4.12, constituency: 47 },
  { cx: 39.5, cy: 104.37, r: 4.12, constituency: 48 },
  { cx: 85.09, cy: 128.28, r: 4.12, constituency: 49 },
  { cx: 67.32, cy: 117.87, r: 4.12, constituency: 50 },
  { cx: 50.44, cy: 105.88, r: 4.12, constituency: 51 },
  { cx: 33.61, cy: 93.86, r: 4.12, constituency: 52 },
  { cx: 79.24, cy: 117.86, r: 4.12, constituency: 53 },
  { cx: 97.08, cy: 128.16, r: 4.12, constituency: 54 },
  { cx: 62.47, cy: 105.84, r: 4.12, constituency: 55 },
  { cx: 45.73, cy: 93.8, r: 4.12, constituency: 56 },
  { cx: 73.56, cy: 107.7, r: 4.12, constituency: 57 },
  { cx: 56.85, cy: 95.66, r: 4.12, constituency: 58 },
  { cx: 40.15, cy: 83.6, r: 4.12, constituency: 59 },
  { cx: 91.52, cy: 117.92, r: 4.12, constituency: 60 },
  { cx: 109.55, cy: 128.11, r: 4.12, constituency: 61 },
  { cx: 52.75, cy: 83.73, r: 4.12, constituency: 62 },
  { cx: 69.41, cy: 95.84, r: 4.12, constituency: 63 },
  { cx: 86.07, cy: 107.94, r: 4.12, constituency: 64 },
  { cx: 47.41, cy: 73.84, r: 4.12, constituency: 65 },
  { cx: 64.06, cy: 85.99, r: 4.12, constituency: 66 },
  { cx: 104.28, cy: 118.11, r: 4.12, constituency: 67 },
  { cx: 80.71, cy: 98.15, r: 4.12, constituency: 68 },
  { cx: 99.07, cy: 108.36, r: 4.12, constituency: 69 },
  { cx: 60.53, cy: 74.24, r: 4.12, constituency: 70 },
  { cx: 77.21, cy: 86.48, r: 4.12, constituency: 71 },
  { cx: 55.35, cy: 64.62, r: 4.12, constituency: 72 },
  { cx: 93.89, cy: 98.77, r: 4.12, constituency: 73 },
  { cx: 72.04, cy: 76.93, r: 4.12, constituency: 74 },
  { cx: 117.72, cy: 118.54, r: 4.12, constituency: 75 },
  { cx: 88.72, cy: 89.3, r: 4.12, constituency: 76 },
  { cx: 69.01, cy: 65.37, r: 4.12, constituency: 77 },
  { cx: 112.69, cy: 109.05, r: 4.12, constituency: 78 },
  { cx: 63.93, cy: 55.99, r: 4.12, constituency: 79 },
  { cx: 85.79, cy: 77.84, r: 4.12, constituency: 80 },
  { cx: 107.65, cy: 99.7, r: 4.12, constituency: 81 },
  { cx: 80.71, cy: 68.55, r: 4.12, constituency: 82 },
  { cx: 102.59, cy: 90.44, r: 4.12, constituency: 83 },
  { cx: 97.52, cy: 81.24, r: 4.12, constituency: 84 },
  { cx: 78.15, cy: 57.18, r: 4.12, constituency: 85 },
  { cx: 73.11, cy: 48, r: 4.12, constituency: 86 },
  { cx: 95.09, cy: 69.99, r: 4.12, constituency: 87 },
  { cx: 127.19, cy: 110.24, r: 4.12, constituency: 88 },
  { cx: 90.04, cy: 60.89, r: 4.12, constituency: 89 },
  { cx: 122.18, cy: 101.13, r: 4.12, constituency: 90 },
  { cx: 117.15, cy: 92.06, r: 4.12, constituency: 91 },
  { cx: 87.89, cy: 49.71, r: 4.12, constituency: 92 },
  { cx: 112.09, cy: 83.03, r: 4.12, constituency: 93 },
  { cx: 82.83, cy: 40.69, r: 4.12, constituency: 94 },
  { cx: 107.02, cy: 74.02, r: 4.12, constituency: 95 },
  { cx: 105.04, cy: 62.98, r: 4.12, constituency: 96 },
  { cx: 99.95, cy: 54.01, r: 4.12, constituency: 97 },
  { cx: 98.17, cy: 43.02, r: 4.12, constituency: 98 },
  { cx: 93.05, cy: 34.09, r: 4.12, constituency: 99 },
  { cx: 117.15, cy: 67.71, r: 4.12, constituency: 100 },
  { cx: 122.3, cy: 76.63, r: 4.12, constituency: 101 },
  { cx: 127.45, cy: 85.55, r: 4.12, constituency: 102 },
  { cx: 132.6, cy: 94.46, r: 4.12, constituency: 103 },
  { cx: 137.75, cy: 103.38, r: 4.12, constituency: 104 },
  { cx: 110.39, cy: 47.96, r: 4.12, constituency: 105 },
  { cx: 115.58, cy: 56.86, r: 4.12, constituency: 106 },
  { cx: 103.72, cy: 28.24, r: 4.12, constituency: 107 },
  { cx: 108.94, cy: 37.14, r: 4.12, constituency: 108 },
  { cx: 127.83, cy: 62.38, r: 4.12, constituency: 109 },
  { cx: 133.11, cy: 71.3, r: 4.12, constituency: 110 },
  { cx: 121.28, cy: 42.77, r: 4.12, constituency: 111 },
  { cx: 138.42, cy: 80.23, r: 4.12, constituency: 112 },
  { cx: 126.6, cy: 51.7, r: 4.12, constituency: 113 },
  { cx: 114.78, cy: 23.17, r: 4.12, constituency: 114 },
  { cx: 120.13, cy: 32.1, r: 4.12, constituency: 115 },
  { cx: 143.77, cy: 89.17, r: 4.12, constituency: 116 },
  { cx: 149.18, cy: 98.11, r: 4.12, constituency: 117 },
  { cx: 138.95, cy: 58.05, r: 4.12, constituency: 118 },
  { cx: 132.56, cy: 38.47, r: 4.12, constituency: 119 },
  { cx: 126.18, cy: 18.9, r: 4.12, constituency: 120 },
  { cx: 131.67, cy: 27.94, r: 4.12, constituency: 121 },
  { cx: 138.04, cy: 47.52, r: 4.12, constituency: 122 },
  { cx: 144.4, cy: 67.1, r: 4.12, constituency: 123 },
  { cx: 149.91, cy: 76.18, r: 4.12, constituency: 124 },
  { cx: 155.52, cy: 85.32, r: 4.12, constituency: 125 },
  { cx: 137.85, cy: 15.46, r: 4.12, constituency: 126 },
  { cx: 144.15, cy: 35.11, r: 4.12, constituency: 127 },
  { cx: 150.42, cy: 54.77, r: 4.12, constituency: 128 },
  { cx: 143.5, cy: 24.67, r: 4.12, constituency: 129 },
  { cx: 149.79, cy: 44.35, r: 4.12, constituency: 130 },
  { cx: 161.25, cy: 94.53, r: 4.12, constituency: 131 },
  { cx: 156.06, cy: 64.06, r: 4.12, constituency: 132 },
  { cx: 149.74, cy: 12.86, r: 4.12, constituency: 133 },
  { cx: 161.79, cy: 73.46, r: 4.12, constituency: 134 },
  { cx: 155.97, cy: 32.68, r: 4.12, constituency: 135 },
  { cx: 155.55, cy: 22.33, r: 4.12, constituency: 136 },
  { cx: 162.15, cy: 52.57, r: 4.12, constituency: 137 },
  { cx: 161.78, cy: 42.23, r: 4.12, constituency: 138 },
  { cx: 167.66, cy: 82.99, r: 4.12, constituency: 139 },
  { cx: 161.78, cy: 11.13, r: 4.12, constituency: 140 },
  { cx: 167.97, cy: 62.23, r: 4.12, constituency: 141 },
  { cx: 167.94, cy: 31.22, r: 4.12, constituency: 142 },
  { cx: 167.74, cy: 20.91, r: 4.12, constituency: 143 },
  { cx: 173.71, cy: 92.73, r: 4.12, constituency: 144 },
  { cx: 173.91, cy: 72.08, r: 4.12, constituency: 145 },
  { cx: 174.03, cy: 51.46, r: 4.12, constituency: 146 },
  { cx: 173.91, cy: 41.16, r: 4.12, constituency: 147 },
  { cx: 173.92, cy: 10.26, r: 4.12, constituency: 148 },
  { cx: 180, cy: 61.62, r: 4.12, constituency: 149 },
  { cx: 180, cy: 30.74, r: 4.12, constituency: 150 },
  { cx: 180, cy: 20.44, r: 4.12, constituency: 151 },
  { cx: 180, cy: 82.21, r: 4.12, constituency: 152 },
  { cx: 186.08, cy: 10.26, r: 4.12, constituency: 153 },
  { cx: 186.09, cy: 41.16, r: 4.12, constituency: 154 },
  { cx: 185.97, cy: 51.46, r: 4.12, constituency: 155 },
  { cx: 186.09, cy: 72.08, r: 4.12, constituency: 156 },
  { cx: 186.29, cy: 92.73, r: 4.12, constituency: 157 },
  { cx: 192.26, cy: 20.91, r: 4.12, constituency: 158 },
  { cx: 192.06, cy: 31.22, r: 4.12, constituency: 159 },
  { cx: 192.03, cy: 62.23, r: 4.12, constituency: 160 },
  { cx: 198.22, cy: 11.13, r: 4.12, constituency: 161 },
  { cx: 192.34, cy: 82.99, r: 4.12, constituency: 162 },
  { cx: 198.22, cy: 42.23, r: 4.12, constituency: 163 },
  { cx: 197.85, cy: 52.57, r: 4.12, constituency: 164 },
  { cx: 204.45, cy: 22.33, r: 4.12, constituency: 165 },
  { cx: 204.03, cy: 32.68, r: 4.12, constituency: 166 },
  { cx: 198.21, cy: 73.46, r: 4.12, constituency: 167 },
  { cx: 210.26, cy: 12.86, r: 4.12, constituency: 168 },
  { cx: 203.94, cy: 64.06, r: 4.12, constituency: 169 },
  { cx: 198.75, cy: 94.53, r: 4.12, constituency: 170 },
  { cx: 210.21, cy: 44.35, r: 4.12, constituency: 171 },
  { cx: 216.5, cy: 24.67, r: 4.12, constituency: 172 },
  { cx: 209.58, cy: 54.77, r: 4.12, constituency: 173 },
  { cx: 215.85, cy: 35.11, r: 4.12, constituency: 174 },
  { cx: 222.15, cy: 15.46, r: 4.12, constituency: 175 },
  { cx: 204.48, cy: 85.32, r: 4.12, constituency: 176 },
  { cx: 210.09, cy: 76.18, r: 4.12, constituency: 177 },
  { cx: 215.6, cy: 67.1, r: 4.12, constituency: 178 },
  { cx: 221.96, cy: 47.52, r: 4.12, constituency: 179 },
  { cx: 228.33, cy: 27.94, r: 4.12, constituency: 180 },
  { cx: 233.82, cy: 18.9, r: 4.12, constituency: 181 },
  { cx: 227.44, cy: 38.47, r: 4.12, constituency: 182 },
  { cx: 221.05, cy: 58.05, r: 4.12, constituency: 183 },
  { cx: 210.82, cy: 98.11, r: 4.12, constituency: 184 },
  { cx: 216.23, cy: 89.17, r: 4.12, constituency: 185 },
  { cx: 239.87, cy: 32.1, r: 4.12, constituency: 186 },
  { cx: 245.22, cy: 23.17, r: 4.12, constituency: 187 },
  { cx: 233.4, cy: 51.7, r: 4.12, constituency: 188 },
  { cx: 221.58, cy: 80.23, r: 4.12, constituency: 189 },
  { cx: 238.72, cy: 42.77, r: 4.12, constituency: 190 },
  { cx: 226.89, cy: 71.3, r: 4.12, constituency: 191 },
  { cx: 232.17, cy: 62.38, r: 4.12, constituency: 192 },
  { cx: 251.06, cy: 37.14, r: 4.12, constituency: 193 },
  { cx: 256.28, cy: 28.24, r: 4.12, constituency: 194 },
  { cx: 244.42, cy: 56.86, r: 4.12, constituency: 195 },
  { cx: 249.61, cy: 47.96, r: 4.12, constituency: 196 },
  { cx: 222.25, cy: 103.38, r: 4.12, constituency: 197 },
  { cx: 227.4, cy: 94.46, r: 4.12, constituency: 198 },
  { cx: 232.55, cy: 85.55, r: 4.12, constituency: 199 },
  { cx: 237.7, cy: 76.63, r: 4.12, constituency: 200 },
  { cx: 242.85, cy: 67.71, r: 4.12, constituency: 201 },
  { cx: 266.95, cy: 34.09, r: 4.12, constituency: 202 },
  { cx: 261.83, cy: 43.02, r: 4.12, constituency: 203 },
  { cx: 260.05, cy: 54.01, r: 4.12, constituency: 204 },
  { cx: 254.96, cy: 62.98, r: 4.12, constituency: 205 },
  { cx: 252.98, cy: 74.02, r: 4.12, constituency: 206 },
  { cx: 277.17, cy: 40.69, r: 4.12, constituency: 207 },
  { cx: 247.91, cy: 83.03, r: 4.12, constituency: 208 },
  { cx: 272.11, cy: 49.71, r: 4.12, constituency: 209 },
  { cx: 242.85, cy: 92.06, r: 4.12, constituency: 210 },
  { cx: 237.82, cy: 101.13, r: 4.12, constituency: 211 },
  { cx: 269.96, cy: 60.89, r: 4.12, constituency: 212 },
  { cx: 232.81, cy: 110.24, r: 4.12, constituency: 213 },
  { cx: 264.91, cy: 69.99, r: 4.12, constituency: 214 },
  { cx: 286.89, cy: 48, r: 4.12, constituency: 215 },
  { cx: 281.85, cy: 57.18, r: 4.12, constituency: 216 },
  { cx: 262.48, cy: 81.24, r: 4.12, constituency: 217 },
  { cx: 257.41, cy: 90.44, r: 4.12, constituency: 218 },
  { cx: 279.29, cy: 68.55, r: 4.12, constituency: 219 },
  { cx: 252.35, cy: 99.7, r: 4.12, constituency: 220 },
  { cx: 274.21, cy: 77.84, r: 4.12, constituency: 221 },
  { cx: 296.07, cy: 55.99, r: 4.12, constituency: 222 },
  { cx: 247.31, cy: 109.05, r: 4.12, constituency: 223 },
  { cx: 290.99, cy: 65.37, r: 4.12, constituency: 224 },
  { cx: 271.28, cy: 89.3, r: 4.12, constituency: 225 },
  { cx: 242.28, cy: 118.54, r: 4.12, constituency: 226 },
  { cx: 287.96, cy: 76.93, r: 4.12, constituency: 227 },
  { cx: 266.11, cy: 98.77, r: 4.12, constituency: 228 },
  { cx: 304.65, cy: 64.62, r: 4.12, constituency: 229 },
  { cx: 282.79, cy: 86.48, r: 4.12, constituency: 230 },
  { cx: 299.47, cy: 74.24, r: 4.12, constituency: 231 },
  { cx: 260.93, cy: 108.36, r: 4.12, constituency: 232 },
  { cx: 279.29, cy: 98.15, r: 4.12, constituency: 233 },
  { cx: 255.72, cy: 118.11, r: 4.12, constituency: 234 },
  { cx: 295.94, cy: 85.99, r: 4.12, constituency: 235 },
  { cx: 312.59, cy: 73.84, r: 4.12, constituency: 236 },
  { cx: 273.93, cy: 107.94, r: 4.12, constituency: 237 },
  { cx: 290.59, cy: 95.84, r: 4.12, constituency: 238 },
  { cx: 307.25, cy: 83.73, r: 4.12, constituency: 239 },
  { cx: 250.45, cy: 128.11, r: 4.12, constituency: 240 },
  { cx: 268.48, cy: 117.92, r: 4.12, constituency: 241 },
  { cx: 319.85, cy: 83.6, r: 4.12, constituency: 242 },
  { cx: 303.15, cy: 95.66, r: 4.12, constituency: 243 },
  { cx: 286.44, cy: 107.7, r: 4.12, constituency: 244 },
  { cx: 314.27, cy: 93.8, r: 4.12, constituency: 245 },
  { cx: 297.53, cy: 105.84, r: 4.12, constituency: 246 },
  { cx: 262.92, cy: 128.16, r: 4.12, constituency: 247 },
  { cx: 280.76, cy: 117.86, r: 4.12, constituency: 248 },
  { cx: 326.39, cy: 93.86, r: 4.12, constituency: 249 },
  { cx: 309.56, cy: 105.88, r: 4.12, constituency: 250 },
  { cx: 292.68, cy: 117.87, r: 4.12, constituency: 251 },
  { cx: 274.91, cy: 128.28, r: 4.12, constituency: 252 },
  { cx: 320.5, cy: 104.37, r: 4.12, constituency: 253 },
  { cx: 257.17, cy: 138.76, r: 4.12, constituency: 254 },
  { cx: 303.57, cy: 116.41, r: 4.12, constituency: 255 },
  { cx: 332.18, cy: 104.56, r: 4.12, constituency: 256 },
  { cx: 286.56, cy: 128.43, r: 4.12, constituency: 257 },
  { cx: 315.12, cy: 116.59, r: 4.12, constituency: 258 },
  { cx: 268.8, cy: 139.04, r: 4.12, constituency: 259 },
  { cx: 325.89, cy: 115.39, r: 4.12, constituency: 260 },
  { cx: 297.95, cy: 128.58, r: 4.12, constituency: 261 },
  { cx: 337.19, cy: 115.65, r: 4.12, constituency: 262 },
  { cx: 308.66, cy: 127.47, r: 4.12, constituency: 263 },
  { cx: 280.13, cy: 139.29, r: 4.12, constituency: 264 },
  { cx: 319.81, cy: 127.71, r: 4.12, constituency: 265 },
  { cx: 291.25, cy: 139.52, r: 4.12, constituency: 266 },
  { cx: 262.29, cy: 150.26, r: 4.12, constituency: 267 },
  { cx: 330.43, cy: 126.79, r: 4.12, constituency: 268 },
  { cx: 302.21, cy: 139.73, r: 4.12, constituency: 269 },
  { cx: 341.39, cy: 127.07, r: 4.12, constituency: 270 },
  { cx: 273.26, cy: 150.57, r: 4.12, constituency: 271 },
  { cx: 312.76, cy: 138.93, r: 4.12, constituency: 272 },
  { cx: 323.57, cy: 139.17, r: 4.12, constituency: 273 },
  { cx: 284.08, cy: 150.83, r: 4.12, constituency: 274 },
  { cx: 334.07, cy: 138.51, r: 4.12, constituency: 275 },
  { cx: 294.79, cy: 151.04, r: 4.12, constituency: 276 },
  { cx: 344.77, cy: 138.76, r: 4.12, constituency: 277 },
  { cx: 305.42, cy: 151.22, r: 4.12, constituency: 278 },
  { cx: 315.85, cy: 150.71, r: 4.12, constituency: 279 },
  { cx: 265.71, cy: 162.37, r: 4.12, constituency: 280 },
  { cx: 326.4, cy: 150.9, r: 4.12, constituency: 281 },
  { cx: 336.8, cy: 150.47, r: 4.12, constituency: 282 },
  { cx: 276.23, cy: 162.57, r: 4.12, constituency: 283 },
  { cx: 347.3, cy: 150.66, r: 4.12, constituency: 284 },
  { cx: 286.7, cy: 162.73, r: 4.12, constituency: 285 },
  { cx: 297.13, cy: 162.86, r: 4.12, constituency: 286 },
  { cx: 307.54, cy: 162.96, r: 4.12, constituency: 287 },
  { cx: 317.89, cy: 162.72, r: 4.12, constituency: 288 },
  { cx: 328.27, cy: 162.82, r: 4.12, constituency: 289 },
  { cx: 338.61, cy: 162.61, r: 4.12, constituency: 290 },
  { cx: 348.97, cy: 162.71, r: 4.12, constituency: 291 },
  { cx: 267.35, cy: 174.85, r: 4.12, constituency: 292 },
  { cx: 277.66, cy: 174.85, r: 4.12, constituency: 293 },
  { cx: 287.97, cy: 174.85, r: 4.12, constituency: 294 },
  { cx: 298.27, cy: 174.85, r: 4.12, constituency: 295 },
  { cx: 308.57, cy: 174.85, r: 4.12, constituency: 296 },
  { cx: 318.88, cy: 174.85, r: 4.12, constituency: 297 },
  { cx: 329.18, cy: 174.85, r: 4.12, constituency: 298 },
  { cx: 339.48, cy: 174.85, r: 4.12, constituency: 299 },
  { cx: 349.77, cy: 174.85, r: 4.12, constituency: 300 }
];

export default function ParliamentSeatingChart({ electionYear }: ParliamentSeatingChartProps) {
  const [parliamentData, setParliamentData] = useState<ParliamentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredSeat, setHoveredSeat] = useState<number | null>(null);

  useEffect(() => {
    const fetchParliamentData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/parliament-visualization?year=${electionYear}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch parliament data');
        }
        
        const data = await response.json();
        setParliamentData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching parliament data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchParliamentData();
  }, [electionYear]);

  const getSeatColor = (constituencyNumber: number): string => {
    if (!parliamentData) return '#f0f0f0';
    
    const constituencyData = parliamentData.constituencies[constituencyNumber];
    return constituencyData?.color || '#f0f0f0';
  };

  const getSeatInfo = (constituencyNumber: number) => {
    if (!parliamentData) return null;
    
    return parliamentData.constituencies[constituencyNumber] || null;
  };

  // Group seats by party for better visual organization
  const getGroupedSeats = () => {
    if (!parliamentData) return PARLIAMENT_CIRCLES;
    
    // Create a mapping of party to seats
    const partySeats: Record<string, Array<{cx: number, cy: number, r: number, constituency: number, party: string, color: string}>> = {};
    
    PARLIAMENT_CIRCLES.forEach(circle => {
      const seatInfo = parliamentData.constituencies[circle.constituency];
      if (seatInfo) {
        const party = seatInfo.party;
        if (!partySeats[party]) {
          partySeats[party] = [];
        }
        partySeats[party].push({
          ...circle,
          party: seatInfo.party,
          color: seatInfo.color
        });
      }
    });
    
    // Sort parties by seat count (descending)
    const sortedParties = Object.entries(partySeats)
      .sort(([,a], [,b]) => b.length - a.length);
    
    // Create grouped arrangement
    const groupedSeats: Array<{cx: number, cy: number, r: number, constituency: number, party: string, color: string}> = [];
    let currentIndex = 0;
    
    sortedParties.forEach(([party, seats]) => {
      seats.forEach(seat => {
        // Use the original circle position but assign new constituency number for grouping
        const originalCircle = PARLIAMENT_CIRCLES[currentIndex % PARLIAMENT_CIRCLES.length];
        groupedSeats.push({
          cx: originalCircle.cx,
          cy: originalCircle.cy,
          r: originalCircle.r,
          constituency: seat.constituency,
          party: seat.party,
          color: seat.color
        });
        currentIndex++;
      });
    });
    
    return groupedSeats;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading parliament data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!parliamentData) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">No data available</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">
          {parliamentData.electionYear} Election - Parliament Seating Chart
        </h2>
        <p className="text-gray-600">
          Total Seats: {parliamentData.totalSeats}
        </p>
      </div>

      {/* Party Legend */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Party Results</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {parliamentData.parties.map((party, index) => (
            <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
              <div 
                className="w-4 h-4 rounded"
                style={{ backgroundColor: party.color }}
              ></div>
              <div className="text-sm">
                <div className="font-medium">{party.name}</div>
                <div className="text-gray-600">{party.seats} seats</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Parliament Seating Chart - Semi-circular arrangement */}
      <div className="border rounded-lg p-4 bg-white">
        <svg 
          viewBox="0 0 360 185" 
          className="w-full h-auto"
          style={{ maxHeight: '500px' }}
        >
          {/* Total seats text */}
          <text 
            x="180" 
            y="175" 
            style={{
              fontSize: '36px',
              fontWeight: 'bold',
              textAlign: 'center',
              textAnchor: 'middle',
              fontFamily: 'sans-serif'
            }}
          >
            300
          </text>
          
          {/* Parliament circles in grouped arrangement by party */}
          {getGroupedSeats().map((seat, index) => {
            const isHovered = hoveredSeat === seat.constituency;
            
            return (
              <g key={index}>
                <circle
                  cx={seat.cx}
                  cy={seat.cy}
                  r={seat.r}
                  fill={seat.color}
                 
                 
                 
                />
              </g>
            );
          })}
        </svg>
      </div>

     
      
    </div>
  );
}