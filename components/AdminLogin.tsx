
import React, { useState } from 'react';
import { ShieldCheck, Lock, AlertCircle } from 'lucide-react';

interface Props {
  onSuccess: () => void;
  onCancel: () => void;
}

export const AdminLogin: React.FC<Props> = ({ onSuccess, onCancel }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 授權碼驗證
    if (code === '2026') {
      onSuccess();
    } else {
      setError(true);
      setCode('');
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="bg-red-600 py-6 flex flex-col items-center">
          <ShieldCheck size={48} className="text-white mb-2" />
          <h2 className="text-white font-bold text-xl tracking-tight">HR 管理員身分驗證</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700">管理員授權碼</label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-3 text-slate-400" />
              <input 
                type="password" 
                value={code} 
                onChange={(e) => {
                  setCode(e.target.value);
                  setError(false);
                }}
                className={`w-full pl-12 pr-4 py-3 rounded-xl border outline-none transition-all ${error ? 'border-red-500 ring-2 ring-red-100' : 'border-slate-200 focus:ring-2 focus:ring-red-500'}`}
                placeholder="請輸入管理授權碼以繼續"
                autoFocus
              />
            </div>
            {error && <p className="text-xs text-red-500 flex items-center gap-1 pt-1"><AlertCircle size={12} /> 驗證失敗，請重新輸入。</p>}
          </div>
          <div className="flex gap-4">
            <button type="button" onClick={onCancel} className="flex-1 py-3 text-slate-500 font-medium hover:bg-slate-50 rounded-xl transition-colors">取消</button>
            <button type="submit" className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors">登入系統</button>
          </div>
        </form>
      </div>
    </div>
  );
};
