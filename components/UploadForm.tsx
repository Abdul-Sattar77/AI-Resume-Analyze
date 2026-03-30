"use client";
import { useState, useRef } from "react";
import { Loader2, Sparkles, FileText, X } from "lucide-react";

export default function UploadForm({ onResult }: { onResult: (data: any) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAnalyze = async () => {
    if (!file || !jd.trim()) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("jobDescription", jd);

    try {
      const res = await fetch("/api/v1/analyze", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Analysis failed");
      onResult(data);
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.type === "application/pdf") setFile(dropped);
  };

  return (
    <>
      <style>{`
        .upload-zone {
          border: 1.5px dashed rgba(255,255,255,0.1);
          border-radius: 16px;
          padding: 24px 16px;
          text-align: center;
          cursor: pointer;
          transition: all 0.25s ease;
          background: rgba(255,255,255,0.02);
          margin-bottom: 14px;
        }
        .upload-zone:hover, .upload-zone.drag { 
          border-color: rgba(59,130,246,0.4);
          background: rgba(59,130,246,0.04);
        }
        .upload-zone.has-file {
          border-color: rgba(16,185,129,0.3);
          background: rgba(16,185,129,0.04);
        }

        .jd-textarea {
          width: 100%;
          height: 128px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          padding: 14px 16px;
          color: #e2e8f0;
          font-size: 13.5px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          line-height: 1.65;
          resize: none;
          outline: none;
          transition: border-color 0.2s;
          margin-bottom: 14px;
        }
        .jd-textarea::placeholder { color: #334155; }
        .jd-textarea:focus { border-color: rgba(59,130,246,0.35); background: rgba(59,130,246,0.03); }

        .analyze-btn {
          width: 100%;
          padding: 14px;
          border-radius: 14px;
          border: none;
          font-size: 14px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: -0.01em;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: all 0.25s ease;
          position: relative; overflow: hidden;
        }
        .analyze-btn:not(:disabled) {
          background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
          color: white;
        }
        .analyze-btn:not(:disabled):hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(59,130,246,0.3);
        }
        .analyze-btn:not(:disabled):active { transform: translateY(0); }
        .analyze-btn:disabled {
          background: rgba(255,255,255,0.05);
          color: #334155;
          cursor: not-allowed;
        }
        .analyze-btn.ready:not(:disabled) { animation: ready-pulse 3s ease infinite; }
        @keyframes ready-pulse {
          0%, 100% { box-shadow: 0 4px 20px rgba(59,130,246,0.25); }
          50% { box-shadow: 0 4px 32px rgba(99,102,241,0.4); }
        }

        .field-label {
          font-size: 11px; font-weight: 500; letter-spacing: 0.07em;
          text-transform: uppercase; color: #475569; margin-bottom: 8px; display: block;
        }

        .file-chip {
          display: flex; align-items: center; gap: 10;
          background: rgba(16,185,129,0.1);
          border: 1px solid rgba(16,185,129,0.2);
          border-radius: 10px; padding: 10px 14px;
          font-size: 13px; color: #34d399;
        }
        .remove-btn {
          margin-left: auto; background: none; border: none;
          color: #64748b; cursor: pointer; padding: 0;
          display: flex; align-items: center;
          transition: color 0.2s;
        }
        .remove-btn:hover { color: #ef4444; }

        .char-count {
          font-size: 11px; color: #1e293b; text-align: right; margin-top: -10px; margin-bottom: 14px;
        }
      `}</style>

      {/* File Upload */}
      <div style={{ marginBottom: 14 }}>
        <span className="field-label">Resume (PDF)</span>
        {file ? (
          <div className="file-chip">
            <FileText size={15} style={{ flexShrink: 0 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, marginLeft: 8 }}>
              {file.name}
            </span>
            <button className="remove-btn" onClick={() => setFile(null)}>
              <X size={14} />
            </button>
          </div>
        ) : (
          <div
            className={`upload-zone${dragOver ? ' drag' : ''}`}
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".pdf"
              style={{ display: 'none' }}
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <div style={{ fontSize: 22, marginBottom: 8 }}>📄</div>
            <p style={{ fontSize: 13, color: '#475569', marginBottom: 2 }}>
              Drop your PDF here or <span style={{ color: '#60a5fa' }}>browse</span>
            </p>
            <p style={{ fontSize: 11, color: '#1e293b' }}>PDF files only</p>
          </div>
        )}
      </div>

      {/* JD Input */}
      <div>
        <span className="field-label">Job Description</span>
        <textarea
          className="jd-textarea"
          placeholder="Paste the full job description here — the more detail, the better the analysis..."
          value={jd}
          onChange={(e) => setJd(e.target.value)}
        />
        <div className="char-count">{jd.length > 0 ? `${jd.length} chars` : ''}</div>
      </div>

      {/* Button */}
      <button
        className={`analyze-btn${file && jd.trim() ? ' ready' : ''}`}
        onClick={handleAnalyze}
        disabled={loading || !file || !jd.trim()}
      >
        {loading ? (
          <>
            <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
            Analyzing your resume...
          </>
        ) : (
          <>
            <Sparkles size={16} />
            Analyze Resume
          </>
        )}
      </button>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}