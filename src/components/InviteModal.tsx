import React, { useState } from 'react';
import { TripMetadata, Member } from '../types/trip';
import { X, Copy, Check, QrCode, Key, Users, ArrowRight, UserPlus } from 'lucide-react';

interface InviteModalProps {
  metadata: TripMetadata;
  members: Member[];
  isOpen: boolean;
  onClose: () => void;
  onSimulateJoin: (name: string, major: string) => void;
}

export const InviteModal: React.FC<InviteModalProps> = ({
  metadata,
  members,
  isOpen,
  onClose,
  onSimulateJoin,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberMajor, setNewMemberMajor] = useState('');

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(metadata.inviteCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyInviteText = () => {
    const inviteText = `🎓【毕业旅行拼团集结令】\n我们正在发起「${metadata.title}」！\n📍 目的地：${metadata.destination}\n📅 出行日期：${metadata.startDate} ~ ${metadata.endDate} (${metadata.daysCount}天)\n🔑 专属房间口令：${metadata.inviteCode}\n打开毕游记输入口令，即可协同投票景点、确认空档日期并自动AA清账！大家快上车，毕业不散场！🎉`;
    navigator.clipboard.writeText(inviteText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleSimulateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;
    onSimulateJoin(newMemberName.trim(), newMemberMajor.trim() || '大学毕业生');
    setNewMemberName('');
    setNewMemberMajor('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-teal-50 text-teal-700 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">邀请室友 / 同学加入旅行团</h3>
              <p className="text-xs text-slate-500">邀请制私密小团，仅持有口令的同学方可加入</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 口令邀请卡 */}
        <div className="p-5 rounded-xl bg-slate-900 text-white space-y-3">
          <div className="flex items-center justify-between text-xs text-teal-300">
            <span>毕业拼团专属邀请码</span>
            <span>已集结 {members.length} 人</span>
          </div>

          <div className="flex items-center justify-between bg-white/10 p-3 rounded-lg border border-white/10">
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-amber-400" />
              <span className="text-2xl font-mono font-bold tracking-widest text-amber-300">
                {metadata.inviteCode}
              </span>
            </div>
            <button
              onClick={handleCopyCode}
              className="px-3 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-xs rounded-md transition-colors flex items-center gap-1"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? '已复制' : '复制口令'}</span>
            </button>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            把口令分享至寝室群或班级群，同学即可同步查看实时预算、景点心愿单并参与AA分摊。
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyInviteText}
            className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
          >
            {copiedText ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copiedText ? '邀请文案已复制！' : '复制微信群邀请文案'}</span>
          </button>
        </div>

        {/* 现场模拟：立即加入新团员测试 */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <UserPlus className="w-4 h-4 text-teal-600" />
            <span>现场模拟新成员扫码加入体验：</span>
          </div>
          <form onSubmit={handleSimulateSubmit} className="flex gap-2">
            <input
              type="text"
              required
              placeholder="同学姓名（如：陆小凡）"
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-teal-500 outline-none"
            />
            <input
              type="text"
              placeholder="专业（如：电气工程）"
              value={newMemberMajor}
              onChange={(e) => setNewMemberMajor(e.target.value)}
              className="w-28 px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-teal-500 outline-none"
            />
            <button
              type="submit"
              className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs rounded-lg shrink-0"
            >
              入团
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
