'use client';

import { useMemo } from 'react';
import { HelpCircle } from 'lucide-react';
import type { PollQuestion, LocaleKey } from '@/types/poll';

interface PollQuestionCardProps {
  question: PollQuestion;
  language: LocaleKey;
  totalVotesLabel: string;
  totalVotes: number;
  hasVoted: boolean;
  onVote: (optionKey: string) => void;
}

export default function PollQuestionCard({
  question,
  language,
  totalVotesLabel,
  totalVotes,
  hasVoted,
  onVote
}: PollQuestionCardProps) {
  const tooltipText = question.tooltip?.[language];
  const options = question.options;

  const optionPercentages = useMemo(() => {
    const total = totalVotes > 0 ? totalVotes : question.options.reduce((sum, option) => sum + option.votes, 0);
    return question.options.map(option => {
      if (total === 0) return 0;
      return Math.round((option.votes / total) * 100);
    });
  }, [question.options, totalVotes]);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-start gap-3">
        <h3 className="text-lg font-semibold text-gray-900">
          {question.question[language]}
        </h3>
        {tooltipText && (
          <div className="relative group">
            <HelpCircle className="h-5 w-5 text-gray-400" aria-hidden="true" />
            <div className="absolute left-6 top-0 z-20 hidden w-72 rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-700 shadow-lg group-hover:block">
              {tooltipText}
            </div>
          </div>
        )}
      </div>

      <div className="text-xs text-gray-500 mt-2">
        {totalVotesLabel}: {totalVotes.toLocaleString(language === 'bn' ? 'bn-BD' : 'en-US')}
      </div>

      <div className="mt-4 space-y-3">
        {options.map((option, index) => (
          <button
            key={option.key}
            type="button"
            onClick={() => onVote(option.key)}
            disabled={hasVoted}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-left transition hover:border-green-400 hover:bg-green-50 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100"
          >
            <div className="flex items-center justify-between text-sm font-medium text-gray-700">
              <span>{option.label[language]}</span>
              <span>{option.votes.toLocaleString(language === 'bn' ? 'bn-BD' : 'en-US')}</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-green-500 transition-all duration-700 ease-out"
                style={{ width: `${optionPercentages[index]}%` }}
              />
            </div>
          </button>
        ))}
      </div>

      {hasVoted && (
        <div className="mt-4 rounded-md bg-green-100 px-3 py-2 text-sm font-medium text-green-700">
          ✅ আপনার ভোট গ্রহণ করা হয়েছে
        </div>
      )}
    </div>
  );
}


