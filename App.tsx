
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Editor from './components/Editor';
import Preview from './components/Preview';
import { ResumeData, initialData } from './types';

const App: React.FC = () => {
  const [data, setData] = useState<ResumeData>(() => {
    const saved = localStorage.getItem('resume-data');
    return saved ? JSON.parse(saved) : initialData;
  });

  // 좌측 패널 너비 상태 (퍼센트 단위)
  const [leftWidth, setLeftWidth] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('resume-data', JSON.stringify(data));
  }, [data]);

  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback((e: MouseEvent) => {
    if (isResizing && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
      
      // 최소 20%, 최대 80%로 제한
      if (newWidth >= 20 && newWidth <= 80) {
        setLeftWidth(newWidth);
      }
    }
  }, [isResizing]);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', stopResizing);
      // 드래그 중 텍스트 선택 방지
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    }
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [isResizing, resize, stopResizing]);

  const handlePrint = () => {
    window.print();
  };

  const handleReset = () => {
    if (confirm('모든 데이터를 초기화하시겠습니까?')) {
      setData(initialData);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 no-print">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white p-2 rounded-lg shadow-blue-200 shadow-lg">
            <i className="fa-solid fa-file-invoice text-xl"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">AI Resume Pro</h1>
            <p className="text-xs text-slate-500 font-medium">Professional Builder</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={handleReset}
            className="text-slate-500 hover:text-slate-800 text-sm font-medium px-4 py-2"
          >
            초기화
          </button>
          <button 
            onClick={handlePrint}
            className="bg-slate-900 text-white px-6 py-2.5 rounded-lg hover:bg-slate-800 transition-all shadow-md flex items-center gap-2 text-sm font-bold"
          >
            <i className="fa-solid fa-file-pdf"></i>
            PDF로 저장
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main ref={containerRef} className="flex-1 flex overflow-hidden relative">
        {/* Editor Side */}
        <div 
          className="overflow-y-auto bg-white border-r border-slate-200 no-print h-full"
          style={{ width: `${leftWidth}%` }}
        >
          <Editor data={data} onChange={setData} />
        </div>

        {/* Resizer Handle */}
        <div 
          onMouseDown={startResizing}
          className={`no-print w-1.5 h-full cursor-col-resize hover:bg-blue-400 active:bg-blue-600 transition-colors z-20 absolute top-0 bottom-0`}
          style={{ left: `calc(${leftWidth}% - 3px)` }}
        />

        {/* Preview Side */}
        <div 
          className="h-full overflow-y-auto bg-slate-100 p-8 flex justify-center items-start transition-[width]"
          style={{ width: `${100 - leftWidth}%` }}
        >
          <div className="origin-top transition-transform duration-200" style={{ transform: `scale(${Math.min(1, (100 - leftWidth) / 50)})` }}>
            <Preview data={data} />
          </div>
        </div>
      </main>

      {/* Footer / Status */}
      <footer className="bg-white border-t border-slate-200 py-2 px-6 flex justify-between items-center text-[10px] text-slate-400 uppercase tracking-widest no-print">
        <span>© 2024 AI Resume Pro • All changes autosaved</span>
        <div className="flex gap-4">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Online</span>
          <span>Build version 1.0.2</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
