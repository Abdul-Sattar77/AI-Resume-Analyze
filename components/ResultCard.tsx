"use client";
import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, Lightbulb, TrendingUp } from "lucide-react";

function ScoreRing({ value }: { value: number }) {
  const [animated, setAnimated] = useState(0);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const t = setTimeout(() => setAnimated(value), 100);
    return () => clearTimeout(t);
  }, [value]);

  const color = value >= 75 ? '#10b981' : value >= 50 ? '#f59e0b' : '#ef4444';
  const offset = circumference - (circumference * animated) / 100;

  return (
    <div style={{ position: 'relative', width: 140, height: 140, flexShrink: 0 }}>
      <svg width="140" height="140" viewBox="0 0 140 140" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="70" cy="70" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
        <circle
          cx="70" cy="70" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.22,1,0.36,1), stroke 0.5s ease' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: 32, fontWeight: 800, color: 'white', fontFamily: "'Playfair Display', serif", lineHeight: 1 }}>
          {animated}
        </span>
        <span style={{ fontSize: 11, color: '#475569', letterSpacing: '0.06em', marginTop: 2 }}>/ 100</span>
      </div>
    </div>
  );
}

function getScoreLabel(v: number) {
  if (v >= 80) return { label: 'Excellent Match', color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)' };
  if (v >= 60) return { label: 'Good Match', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)' };
  return { label: 'Needs Work', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)' };
}

export default function ResultCard({ data }: { data: any }) {
  const score = data.match_percentage ?? 0;
  const { label, color, bg, border } = getScoreLabel(score);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500&display=swap');

        .result-section {
          background: rgba(15,23,42,0.8);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          padding: 24px;
          margin-bottom: 14px;
          backdrop-filter: blur(20px);
          font-family: 'DM Sans', sans-serif;
        }

        .section-title {
          font-size: 11px; font-weight: 500; letter-spacing: 0.07em;
          text-transform: uppercase; color: #475569; margin-bottom: 16px;
          display: flex; align-items: center; gap: 8px;
        }

        .skill-pill {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 5px 12px; border-radius: 100px; font-size: 12px; font-weight: 500;
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.18);
          color: #fca5a5;
          margin: 0 6px 6px 0;
        }

        .suggestion-item {
          display: flex; gap: 12px; align-items: flex-start;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .suggestion-item:last-child { border-bottom: none; padding-bottom: 0; }

        .suggestion-num {
          width: 22px; height: 22px; border-radius: 50%; flex-shrink: 0;
          background: rgba(99,102,241,0.15); border: 1px solid rgba(99,102,241,0.25);
          display: flex; align-items: center; justify-content: center;
          font-size: 10px; font-weight: 600; color: #a5b4fc;
          margin-top: 1px;
        }

        .score-badge {
          display: inline-flex; align-items: center; padding: 4px 12px;
          border-radius: 100px; font-size: 12px; font-weight: 500;
          margin-top: 10px;
        }
      `}</style>

      {/* Score hero */}
      <div className="result-section" style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
          <ScoreRing value={score} />
          <div style={{ flex: 1, minWidth: 160 }}>
            <p className="section-title" style={{ marginBottom: 8 }}>
              <TrendingUp size={13} /> ATS Match Score
            </p>
            <div
              className="score-badge"
              style={{ background: bg, border: `1px solid ${border}`, color }}
            >
              {label}
            </div>
            <p style={{
              fontSize: 13.5, color: '#94a3b8', lineHeight: 1.75, marginTop: 14,
              fontWeight: 300,
            }}>
              {data.summary}
            </p>
          </div>
        </div>
      </div>

      {/* Missing Skills */}
      {data.missing_skills?.length > 0 && (
        <div className="result-section">
          <p className="section-title">
            <AlertCircle size={13} style={{ color: '#f87171' }} />
            Missing Skills
          </p>
          <div>
            {data.missing_skills.map((s: string, i: number) => (
              <span key={i} className="skill-pill">{s}</span>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      {data.suggestions?.length > 0 && (
        <div className="result-section" style={{ marginBottom: 0 }}>
          <p className="section-title">
            <Lightbulb size={13} style={{ color: '#fbbf24' }} />
            Recommended Improvements
          </p>
          <div>
            {data.suggestions.map((s: string, i: number) => (
              <div key={i} className="suggestion-item">
                <div className="suggestion-num">{i + 1}</div>
                <p style={{ fontSize: 13.5, color: '#94a3b8', lineHeight: 1.7, margin: 0, fontWeight: 300 }}>
                  {s}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}