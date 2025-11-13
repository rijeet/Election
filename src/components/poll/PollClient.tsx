'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import type { PollDTO } from '@/types/poll';
import PollQuestionCard from './PollQuestionCard';
import { useFingerprint } from '@/hooks/useFingerprint';
import { useLanguagePreference } from '@/hooks/useLanguagePreference';
import { formatRelativeTime } from '@/lib/time';
import { Globe } from 'lucide-react';
import Link from 'next/link';

interface PollClientProps {
  poll: PollDTO;
}

const VOTE_STORAGE_PREFIX = 'poll-voted-';

interface VoteState {
  [questionIndex: number]: boolean;
}

export default function PollClient({ poll }: PollClientProps) {
  const fingerprint = useFingerprint();
  const { language, setLanguage, ready } = useLanguagePreference('bn');
  const [votesState, setVotesState] = useState<VoteState>({});
  const [optimisticPoll, setOptimisticPoll] = useState<PollDTO>(poll);
  const [isPending, startTransition] = useTransition();
  const [thankYou, setThankYou] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastUpdatedText, setLastUpdatedText] = useState<string>('');

  // Hydrate vote state from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(`${VOTE_STORAGE_PREFIX}${poll._id}`);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as VoteState;
        setVotesState(parsed);
      } catch {
        setVotesState({});
      }
    }
  }, [poll._id]);

  const updateLocalVotes = (nextState: VoteState) => {
    setVotesState(nextState);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(`${VOTE_STORAGE_PREFIX}${poll._id}`, JSON.stringify(nextState));
    }
  };

  const handleVote = (questionIndex: number, optionKey: string) => {
    if (votesState[questionIndex]) return;
    if (!fingerprint) {
      setErrorMessage(language === 'bn' ? 'দয়া করে পৃষ্ঠাটি পুনরায় লোড করুন' : 'Please wait while we prepare your device.');
      return;
    }
    setErrorMessage(null);
    startTransition(async () => {
      try {
        const res = await fetch('/api/poll/vote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pollId: poll._id,
            questionIndex,
            optionKey,
            fingerprint
          })
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({ error: 'Failed to vote' }));
          setErrorMessage(body.error || 'Failed to vote');
          return;
        }

        const json = await res.json();
        if (json.poll) {
          setOptimisticPoll(json.poll);
        }
        const nextState = { ...votesState, [questionIndex]: true };
        updateLocalVotes(nextState);
        setThankYou(questionIndex);
        setTimeout(() => setThankYou(null), 4000);
      } catch (error) {
        console.error(error);
        setErrorMessage(language === 'bn' ? 'ভোট গ্রহণ করা যায়নি' : 'Unable to record vote.');
      }
    });
  };

  const totalVotesPerQuestion = useMemo(() => {
    return optimisticPoll.questions.map(q => q.options.reduce((sum, option) => sum + option.votes, 0));
  }, [optimisticPoll.questions]);

  useEffect(() => {
    setLastUpdatedText(
      formatRelativeTime(optimisticPoll.updatedAt, language === 'bn' ? 'bn' : 'en')
    );
  }, [language, optimisticPoll.updatedAt]);

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-200">
        <div>
          <p className="text-xs sm:text-sm text-muted mb-1">
            {language === 'bn' ? 'সর্বশেষ আপডেট' : 'Last Updated'}: {lastUpdatedText}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-muted" />
          <button
            type="button"
            onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
            className="rounded-full border border-gray-300 bg-white px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 shadow-sm hover:border-brand-500 hover:text-brand-600 transition-colors"
          >
            {language === 'bn' ? 'English' : 'বাংলা'}
          </button>
        </div>
      </div>

      {ready && errorMessage && (
        <div className="rounded-xl border-2 border-danger-500/30 bg-danger-50 px-4 py-3 text-sm sm:text-base text-danger-600">
          {errorMessage}
        </div>
      )}

      <div className="space-y-6">
        {optimisticPoll.questions.map((question, index) => (
          <div key={index}>
            <PollQuestionCard
              question={question}
              language={language}
              totalVotesLabel={language === 'bn' ? 'মোট ভোট' : 'Total Votes'}
              totalVotes={totalVotesPerQuestion[index]}
              hasVoted={Boolean(votesState[index])}
              onVote={(optionKey) => handleVote(index, optionKey)}
            />
            {thankYou === index && (
              <p className="mt-2 text-sm sm:text-base font-medium text-brand-600">
                {language === 'bn' ? 'ধন্যবাদ! আপনার ভোট মূল্যবান।' : 'Thank you! Your vote matters.'}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="rounded-2xl border-2 border-gray-200 bg-white p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
          {language === 'bn' ? 'আরও জনমত জরিপ' : 'Explore more polls'}
        </h2>
        <p className="mt-2 text-sm sm:text-base text-muted mb-4">
          {language === 'bn'
            ? 'শীঘ্রই এখানে আরও জনমত জরিপ যোগ করা হবে।'
            : 'More public opinion polls will be added here soon.'}
        </p>
        <Link
          href="/polls"
          className="inline-flex items-center text-sm sm:text-base font-medium text-brand-600 hover:text-brand-700 transition-colors group"
        >
          <span>{language === 'bn' ? 'সমস্ত জরিপ দেখুন' : 'See all polls'}</span>
          <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {isPending && (
        <div className="text-sm text-gray-500">
          {language === 'bn' ? 'ভোটের তথ্য আপডেট হচ্ছে...' : 'Updating vote totals...'}
        </div>
      )}
    </div>
  );
}


