import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Poll from '@/models/Poll';
import PollVote from '@/models/PollVote';

const SAMPLE_POLLS = [
  {
    slug: 'july-national-charter',
    title: {
      bn: 'জুলাই জাতীয় চার্টার ভোট',
      en: 'July National Charter Poll'
    },
    isGroup: false,
    questions: [
      {
        question: {
          bn: 'আপনি কি মনে করেন জুলাই জাতীয় চার্টার জনগণের প্রত্যাশা পূরণ করেছে?',
          en: "Do you think the July National Charter met the people's expectations?"
        },
        tooltip: {
          bn: 'এই প্রশ্নের মাধ্যমে আমরা জানতে চাই নাগরিকরা কতটা সন্তুষ্ট জুলাই চার্টারের প্রতিশ্রুতি বাস্তবায়নে।',
          en: "This question measures how satisfied citizens are with the July Charter’s promises."
        },
        options: [
          { key: 'yes', label: { bn: 'হ্যাঁ', en: 'Yes' }, votes: 123 },
          { key: 'no', label: { bn: 'না', en: 'No' }, votes: 98 },
          { key: 'none', label: { bn: 'নিরপেক্ষ', en: 'Neutral' }, votes: 34 }
        ]
      }
    ]
  },
  {
    slug: 'election-2026-opinion',
    title: {
      bn: 'নির্বাচন ২০২৬ জনমত জরিপ',
      en: 'Election 2026 Opinion Poll'
    },
    isGroup: true,
    questions: [
      {
        question: {
          bn: 'আপনি কি মনে করেন বর্তমান নির্বাচন কমিশন নিরপেক্ষ?',
          en: 'Do you believe the current Election Commission is neutral?'
        },
        tooltip: {
          bn: 'নির্বাচন কমিশনের স্বচ্ছতা নিয়ে নাগরিকদের ধারণা জানার চেষ্টা।',
          en: 'Measures citizens’ perception of the EC’s neutrality.'
        },
        options: [
          { key: 'yes', label: { bn: 'হ্যাঁ', en: 'Yes' }, votes: 54 },
          { key: 'no', label: { bn: 'না', en: 'No' }, votes: 72 },
          { key: 'none', label: { bn: 'নিরপেক্ষ', en: 'Not sure' }, votes: 19 }
        ]
      },
      {
        question: {
          bn: 'আপনি কি মনে করেন বিদেশী পর্যবেক্ষক থাকা উচিত?',
          en: 'Should there be foreign observers during the election?'
        },
        tooltip: {
          bn: 'আন্তর্জাতিক তদারকির বিষয়ে নাগরিকদের দৃষ্টিভঙ্গি।',
          en: 'Checks opinion on foreign oversight.'
        },
        options: [
          { key: 'yes', label: { bn: 'হ্যাঁ', en: 'Yes' }, votes: 88 },
          { key: 'no', label: { bn: 'না', en: 'No' }, votes: 31 },
          { key: 'none', label: { bn: 'নিরপেক্ষ', en: 'Neutral' }, votes: 22 }
        ]
      }
    ]
  }
];

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reset = searchParams.get('reset') === 'true';

    await connectDB();

    const slugs = SAMPLE_POLLS.map(p => p.slug);

    if (reset) {
      await Poll.deleteMany({ slug: { $in: slugs } });
      await PollVote.deleteMany({ pollId: { $exists: true } });
    }

    const results = [];
    for (const poll of SAMPLE_POLLS) {
      const updated = await Poll.findOneAndUpdate(
        { slug: poll.slug },
        { $set: poll },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      results.push(updated?.slug);
    }

    return NextResponse.json({
      success: true,
      inserted: results
    });
  } catch (error) {
    console.error('Poll seed error:', error);
    return NextResponse.json({ error: 'Failed to seed polls' }, { status: 500 });
  }
}


