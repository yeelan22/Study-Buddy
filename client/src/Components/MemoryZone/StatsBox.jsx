import React from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import {
  CircleGauge,
  Brain,
  Flame,
  Repeat2,
  CheckCheck,
  Hourglass,
  Award,
} from 'lucide-react';

export function StatsBox({ schedule = [] }) {
  const todayStr = new Date().toDateString();

  const dueToday = schedule.filter(
    (s) => new Date(s.nextDue).toDateString() === todayStr
  );
  const overdue = schedule.filter((s) => new Date(s.nextDue) < new Date());

  // Sort topics by closest interval (you can change this logic later)
  const weakestTopics = schedule
    .slice()
    .sort((a, b) => new Date(a.nextDue) - new Date(b.nextDue))
    .slice(0, 2)
    .map((s) => s.title);

  const stats = {
    totalNotes: schedule.length,
    reviewedNotes: schedule.length - overdue.length,
    flashcardsReviewed: schedule.length * 10, // Placeholder logic
    avgSession: '5m 12s',
    reviewToday: dueToday.length,
    highRisk: overdue.length,
    weakestTopics,
    ratingDist: {
      Easy: 52,
      Medium: 33,
      Hard: 15,
    },
    bestTopic: schedule[Math.floor(Math.random() * schedule.length)]?.title || '-',
    streakDays: 7,
  };

  const ratingChartData = Object.entries(stats.ratingDist).map(
    ([level, value]) => ({
      level,
      value,
    })
  );

  return (
    <div className="card card-hover p-6 w-full h-full flex flex-col gap-6">
      <h3 className="heading-2 mb-2">Revision Stats</h3>

      {/* Progress Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
        <StatItem icon={<CheckCheck size={18} />} label="Total Notes" value={stats.totalNotes} />
        <StatItem icon={<Repeat2 size={18} />} label="Reviewed Notes" value={stats.reviewedNotes} />
        <StatItem icon={<CircleGauge size={18} />} label="Flashcards Reviewed" value={stats.flashcardsReviewed} />
        <StatItem icon={<Hourglass size={18} />} label="Avg Session" value={stats.avgSession} />
        <StatItem icon={<Flame size={18} />} label="Streak Days" value={`${stats.streakDays}`} />
        <StatItem icon={<Award size={18} />} label="Best Topic" value={stats.bestTopic} />
      </div>

      {/* Forgetting Risk */}
      <div>
        <h4 className="heading-2 mb-2">Forgetting Risk</h4>
        <ul className="text-sm list-disc pl-5 text-gray-400 space-y-1">
          <li>{stats.reviewToday} notes due for review today</li>
          <li>{stats.highRisk} notes are at high forgetting risk</li>
          <li>Weakest Topics: {stats.weakestTopics.join(', ') || 'N/A'}</li>
        </ul>
      </div>

      {/* Rating Distribution Chart */}
      <div>
        <h4 className="heading-2 mb-2"> Flashcard Ratings</h4>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={ratingChartData}>
            <XAxis dataKey="level" stroke="#ccc" />
            <Tooltip />
            <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function StatItem({ icon, label, value }) {
  return (
    <div className="inner-card px-4 py-3 flex items-center gap-3">
      <div className="text-blue">{icon}</div>
      <div className="flex flex-col">
        <span className="text-sm text-gray-500">{label}</span>
        <span className="font-bold dark:font-semibold text-charcoal dark:text-white">{value}</span>
      </div>
    </div>
  );
}
