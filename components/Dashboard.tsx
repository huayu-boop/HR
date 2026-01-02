
import React, { useState, useEffect } from 'react';
import { EmployeeData, AIInsight } from '../types';
import { analyzeEmployeeData, getMarketInsights } from '../services/geminiService';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  Brain, UserCheck, LayoutDashboard, Globe, Filter, Trash2, 
  Copy, CheckCheck, Lightbulb, Compass, UserMinus, UserPlus, ArrowLeftRight, AlertCircle, TrendingUp, UserCog, Ghost, Save, MessageSquareText, RefreshCw, RotateCcw
} from 'lucide-react';

interface Props {
  employees: EmployeeData[];
  onDeleteEmployee: (email: string) => void;
  onUpdateStatus: (email: string, newStatus: 'Active' | 'Resigned' | 'Hidden') => void;
  onUpdateNotes: (email: string, notes: string) => void;
  onResetData: () => void;
}

export const Dashboard: React.FC<Props> = ({ employees, onDeleteEmployee, onUpdateStatus, onUpdateNotes, onResetData }) => {
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Resigned' | 'Hidden'>('Active');
  const [selectedEmp, setSelectedEmp] = useState<EmployeeData | null>(null);
  const [insight, setInsight] = useState<AIInsight | null>(null);
  const [strategy, setStrategy] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [tempNotes, setTempNotes] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Vercel 渲染優化：確保 DOM 完全穩定後再掛載圖表
  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const filtered = employees.filter(e => {
    const deptMatch = selectedDept === 'All' || e.department === selectedDept;
    const statusMatch = statusFilter === 'All' || e.status === statusFilter;
    return deptMatch && statusMatch;
  });

  const activeCount = employees.filter(e => e.status === 'Active').length;
  const resignedCount = employees.filter(e => e.status === 'Resigned').length;
  const hiddenCount = employees.filter(e => e.status === 'Hidden').length;
  
  const avgExp = filtered.length > 0 
    ? (filtered.reduce((sum, e) => sum + e.totalExperienceYears, 0) / filtered.length).toFixed(1)
    : '0';
    
  const languageCount: Record<string, number> = {};
  filtered.forEach(e => {
    if (e.languages) {
      e.languages.forEach(l => languageCount[l] = (languageCount[l] || 0) + 1);
    }
  });
  const langData = Object.entries(languageCount).map(([name, value]) => ({ name, value }));

  useEffect(() => {
    if (employees.length === 0) return;
    const loadStrategy = async () => {
      const data = await getMarketInsights(employees);
      setStrategy(data);
    };
    loadStrategy();
  }, [employees.length]);

  useEffect(() => {
    if (selectedEmp) {
      setTempNotes(selectedEmp.notes || '');
      setSaveStatus('idle');
    }
  }, [selectedEmp?.email]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAnalyze = async (emp: EmployeeData) => {
    setLoading(true);
    setSelectedEmp(emp);
    const result = await analyzeEmployeeData(emp);
    setInsight(result);
    setLoading(false);
  };

  const handleSaveNotes = () => {
    if (selectedEmp) {
      setSaveStatus('saving');
      onUpdateNotes(selectedEmp.email, tempNotes);
      setTimeout(() => {
        setSaveStatus('saved');
        setSelectedEmp({ ...selectedEmp, notes: tempNotes });
      }, 500);
    }
  };

  const handleMoveStatus = (email: string, newStatus: 'Active' | 'Resigned' | 'Hidden') => {
    onUpdateStatus(email, newStatus);
    if (selectedEmp?.email === email) {
      setSelectedEmp(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 flex items-center gap-3 tracking-tighter">
            <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-100"><LayoutDashboard size={28} /></div>
            人才戰略中心
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-6 text-[11px] font-black uppercase tracking-widest">
            <span className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">在職 {activeCount}</span>
            <span className="flex items-center gap-2 text-slate-400 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">離職 {resignedCount}</span>
            <span className="flex items-center gap-2 text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100"><Ghost size={14}/> 儲備 {hiddenCount}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <button onClick={onResetData} className="flex items-center gap-2 bg-white border border-slate-200 px-5 py-3 rounded-2xl text-xs font-black text-slate-400 hover:text-red-600 hover:border-red-100 transition-all shadow-sm">
            <RotateCcw size={14} /> 重置數據
          </button>

          <div className="flex bg-slate-200/50 p-1.5 rounded-2xl border border-slate-200">
            {['Active', 'Resigned', 'Hidden', 'All'].map((s) => (
              <button key={s} onClick={() => setStatusFilter(s as any)} className={`px-5 py-2.5 rounded-xl text-[10px] font-black transition-all ${statusFilter === s ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-800'}`}>
                {s === 'Active' ? '在職' : s === 'Resigned' ? '離職' : s === 'Hidden' ? '已隱藏' : '全部'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-2xl border border-slate-200 shadow-sm">
            <Filter size={16} className="text-slate-400" />
            <select value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)} className="bg-transparent text-sm font-bold text-slate-700 outline-none pr-4 cursor-pointer">
              <option value="All">所有部門</option>
              {Array.from(new Set(employees.map(e => e.department))).map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: '平均年資', value: `${avgExp} 年`, color: 'indigo', icon: TrendingUp },
          { label: '全球化語言', value: Object.keys(languageCount).length, color: 'emerald', icon: Globe },
          { label: '人才穩定度', value: activeCount > 0 ? '穩定' : 'N/A', color: 'amber', icon: UserCheck },
          { label: '儲備資源率', value: `${((hiddenCount / Math.max(1, employees.length)) * 100).toFixed(0)}%`, color: 'indigo', icon: Ghost }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
            <div className="relative z-10">
              <div className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{stat.label}</div>
              <div className={`text-5xl font-black text-${stat.color}-600 tracking-tighter`}>{stat.value}</div>
            </div>
            <stat.icon size={80} className={`absolute -right-4 -bottom-4 text-${stat.color}-600 opacity-[0.05] group-hover:scale-125 group-hover:rotate-12 transition-all duration-700`} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8 min-w-0">
          <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <h3 className="text-xl font-bold text-slate-800 mb-10 flex items-center gap-3">
              <div className="bg-indigo-600 w-2 h-8 rounded-full shadow-lg shadow-indigo-100"></div>
              企業核心人才語言分佈 (數據同步完成)
            </h3>
            {/* 解決圖表寬度錯誤：父級容器必須有固定的高度且 min-width: 0 */}
            <div className="w-full relative block min-w-0" style={{ height: '350px' }}>
              {isMounted && langData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%" debounce={50}>
                  <BarChart data={langData} layout="vertical" margin={{ left: 10, right: 30, top: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="6 6" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" hide />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      width={100} 
                      axisLine={false} 
                      tickLine={false} 
                      style={{ fontWeight: '800', fontSize: '12px', fill: '#64748b' }} 
                    />
                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)' }} />
                    <Bar dataKey="value" fill="#4f46e5" radius={[0, 16, 16, 0]} barSize={32} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-100 rounded-[2rem] bg-slate-50/50">
                  <AlertCircle size={40} className="mb-4 opacity-20 animate-pulse" />
                  <span className="text-sm font-black uppercase tracking-widest italic">正在校準數據視覺化引擎...</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-900 rounded-[3rem] border border-slate-800 shadow-2xl overflow-hidden">
            <div className="p-10 border-b border-white/5 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-4">
                <div className="bg-indigo-500 p-3 rounded-2xl text-white shadow-lg shadow-indigo-500/20"><Brain size={32} /></div>
                <div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">AI 戰略級全域洞察</h3>
                  <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.3em] mt-1">Strategic Global Intelligence</p>
                </div>
              </div>
              <button onClick={() => copyToClipboard(strategy, 'strategy')} className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black transition-all border ${copiedId === 'strategy' ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-transparent border-white/20 text-white hover:bg-white/10'}`}>
                {copiedId === 'strategy' ? <CheckCheck size={18} /> : <Copy size={18} />}
                {copiedId === 'strategy' ? '已複製' : '複製戰略'}
              </button>
            </div>
            <div className="p-10">
              <div className="text-indigo-100/80 leading-relaxed font-medium text-base whitespace-pre-wrap">
                {strategy || "Gemini 3 Pro 正在讀取最新的修改紀錄並生成下一季戰略建議..."}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8 min-w-0">
          <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm h-full flex flex-col relative overflow-hidden">
            <h3 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-3">
              <UserCheck size={24} className="text-indigo-600" />
              企業精英名冊
            </h3>
            <div className="space-y-4 mb-8 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar flex-grow">
              {filtered.map((emp) => (
                <div key={emp.email} className="relative group">
                  <button
                    onClick={() => handleAnalyze(emp)}
                    className={`w-full text-left p-6 rounded-[2rem] border-2 transition-all flex items-center gap-5 ${selectedEmp?.email === emp.email ? 'bg-indigo-600 border-indigo-600 text-white shadow-2xl scale-[1.02]' : 'bg-slate-50 border-transparent hover:border-indigo-100 hover:bg-white'} ${emp.status === 'Hidden' ? 'opacity-60 grayscale-[0.5]' : ''}`}
                  >
                    <div className="relative">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl ${selectedEmp?.email === emp.email ? 'bg-white/20' : 'bg-indigo-100 text-indigo-600'}`}>{emp.fullName[0]}</div>
                      <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-[4px] border-white shadow-sm ${emp.status === 'Active' ? 'bg-emerald-500' : emp.status === 'Resigned' ? 'bg-slate-400' : 'bg-indigo-900'}`} />
                    </div>
                    <div className="flex-grow overflow-hidden pr-6">
                      <div className="font-black text-base truncate flex items-center gap-2">
                        {emp.fullName}
                        {emp.status === 'Hidden' && <Ghost size={12} className="text-indigo-600"/>}
                      </div>
                      <div className={`text-xs font-bold truncate ${selectedEmp?.email === emp.email ? 'text-indigo-100' : 'text-slate-400'}`}>{emp.position} · {emp.department}</div>
                    </div>
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); onDeleteEmployee(emp.email); }} className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all p-3 rounded-xl bg-white text-rose-500 shadow-xl border border-rose-50 hover:bg-rose-50"><Trash2 size={18} /></button>
                </div>
              ))}
            </div>

            {selectedEmp && (
              <div className="animate-in fade-in zoom-in duration-500 space-y-8 pt-8 border-t border-slate-100">
                <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200 shadow-inner group/notes">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3 text-slate-500">
                      <MessageSquareText size={20} />
                      <span className="text-[11px] font-black uppercase tracking-[0.2em]">HR 戰略備註庫</span>
                    </div>
                    <button 
                      onClick={handleSaveNotes} 
                      disabled={saveStatus === 'saving'}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[11px] font-black transition-all shadow-md ${tempNotes !== (selectedEmp.notes || '') ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}
                    >
                      {saveStatus === 'saving' ? <RefreshCw size={14} className="animate-spin"/> : saveStatus === 'saved' ? <CheckCheck size={14}/> : <Save size={14} />}
                      {saveStatus === 'saving' ? '儲存中' : saveStatus === 'saved' ? '已儲存' : '儲存修改'}
                    </button>
                  </div>
                  <textarea 
                    value={tempNotes}
                    onChange={(e) => { setTempNotes(e.target.value); setSaveStatus('idle'); }}
                    placeholder="輸入對該精英的戰略觀察..."
                    className="w-full bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-700 leading-relaxed min-h-[120px] outline-none"
                  />
                  <div className="mt-4 pt-4 border-t border-slate-200/50 flex justify-between items-center">
                    <div className="text-[10px] text-slate-400 italic font-medium flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></div>
                      變更將與全域戰略分析引擎同步
                    </div>
                    <button onClick={() => handleAnalyze(selectedEmp)} className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors font-black text-xs">
                      <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                      重新策略分析
                    </button>
                  </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl">
                  <div className="flex items-center gap-2 mb-6 text-slate-400">
                    <UserCog size={20} />
                    <span className="text-[11px] font-black uppercase tracking-widest">人員生命週期控制盒</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <button onClick={() => handleMoveStatus(selectedEmp.email, 'Active')} className={`flex flex-col items-center justify-center gap-3 py-4 rounded-2xl font-black text-[10px] transition-all border ${selectedEmp.status === 'Active' ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-800 border-slate-700 text-slate-500 hover:text-white'}`}><UserPlus size={20} />在職</button>
                    <button onClick={() => handleMoveStatus(selectedEmp.email, 'Resigned')} className={`flex flex-col items-center justify-center gap-3 py-4 rounded-2xl font-black text-[10px] transition-all border ${selectedEmp.status === 'Resigned' ? 'bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-500/20' : 'bg-slate-800 border-slate-700 text-slate-500 hover:text-white'}`}><UserMinus size={20} />離職</button>
                    <button onClick={() => handleMoveStatus(selectedEmp.email, 'Hidden')} className={`flex flex-col items-center justify-center gap-3 py-4 rounded-2xl font-black text-[10px] transition-all border ${selectedEmp.status === 'Hidden' ? 'bg-white text-slate-900 shadow-lg' : 'bg-slate-800 border-slate-700 text-slate-500 hover:text-white'}`}><Ghost size={20} />隱藏</button>
                  </div>
                </div>

                {!loading && insight && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="bg-white p-7 rounded-[2rem] border border-indigo-100 shadow-sm relative overflow-hidden group/card">
                      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover/card:opacity-10 transition-opacity"><Lightbulb size={64} className="text-indigo-600" /></div>
                      <div className="flex items-center gap-3 text-indigo-500 mb-4"><Lightbulb size={20} /><span className="text-xs font-black uppercase tracking-widest">個人潛力解析</span></div>
                      <p className="text-sm text-slate-700 leading-relaxed font-bold relative z-10">{insight.talentSummary}</p>
                    </div>
                    <div className="bg-white p-7 rounded-[2rem] border border-emerald-100 shadow-sm relative overflow-hidden group/card">
                      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover/card:opacity-10 transition-opacity"><Compass size={64} className="text-emerald-600" /></div>
                      <div className="flex items-center gap-3 text-emerald-500 mb-4"><Compass size={20} /><span className="text-xs font-black uppercase tracking-widest">戰略建議方向</span></div>
                      <p className="text-sm text-slate-700 leading-relaxed font-bold relative z-10">{insight.onboardingAdvice}</p>
                    </div>
                  </div>
                )}

                {loading && (
                  <div className="py-20 flex flex-col items-center gap-6">
                    <div className="relative">
                      <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-50 border-t-indigo-600 shadow-2xl" />
                      <Brain size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-600" />
                    </div>
                    <p className="text-xs font-black text-slate-400 animate-pulse tracking-widest uppercase">Gemini 3 Pro 正在校準戰略庫...</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
