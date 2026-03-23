"use client";

import { useState } from 'react';
import { useApp } from '@/lib/app-context';
import { ScreenHeader } from '@/components/screen-header';
import { 
  Users, 
  Plus, 
  Trash2, 
  Phone,
  Star,
  TestTube,
  X,
  Check,
  UserPlus
} from 'lucide-react';

const avatarColors = ['#C7A0E8', '#B57EDC', '#EE44FF', '#D3B3FF', '#A982CF', '#9B5DC9'];
const relationships = ['Mother', 'Father', 'Spouse', 'Sibling', 'Friend', 'Relative', 'Other'];

export function GuardiansScreen() {
  const { 
    settings, 
    guardians, 
    addGuardian, 
    removeGuardian,
    triggerPreSOS
  } = useApp();
  
  const [isAddingGuardian, setIsAddingGuardian] = useState(false);
  const [newGuardian, setNewGuardian] = useState({
    name: '',
    phoneNumber: '',
    relationship: '',
    isEmergencyContact: true,
  });
  const [selectedColor, setSelectedColor] = useState(avatarColors[0]);
  const [testingSOS, setTestingSOS] = useState<string | null>(null);

  const handleSaveGuardian = () => {
    if (!newGuardian.name || !newGuardian.phoneNumber) return;
    
    addGuardian({
      ...newGuardian,
      avatarColor: selectedColor,
    });
    
    setIsAddingGuardian(false);
    setNewGuardian({
      name: '',
      phoneNumber: '',
      relationship: '',
      isEmergencyContact: true,
    });
    setSelectedColor(avatarColors[0]);
  };

  const handleTestSOS = (guardianId: string) => {
    setTestingSOS(guardianId);
    setTimeout(() => {
      setTestingSOS(null);
    }, 2000);
  };

  const handleCancelAdd = () => {
    setIsAddingGuardian(false);
    setNewGuardian({
      name: '',
      phoneNumber: '',
      relationship: '',
      isEmergencyContact: true,
    });
  };

  return (
    <div className="min-h-screen bg-[#0D021F] relative overflow-hidden">
      <div className="absolute bottom-20 left-0 w-[300px] h-[300px] bg-[#C7A0E8]/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="relative z-10 max-w-md mx-auto px-4 py-6 pb-24">
        <ScreenHeader title="Guardians" subtitle="Your emergency contacts" />

        {/* Status Card */}
        <div className="glass-card rounded-2xl p-4 mb-4 border border-[#C7A0E8]/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#C7A0E8]/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-[#C7A0E8]" />
              </div>
              <div>
                <h3 className={`${settings.elderMode ? 'text-xl' : 'text-lg'} font-semibold text-white`}>
                  {guardians.length} Guardian{guardians.length !== 1 ? 's' : ''}
                </h3>
                <p className="text-[#DAD0EE] text-sm">
                  {guardians.filter(g => g.isEmergencyContact).length} emergency contacts
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Add Guardian Form */}
        {isAddingGuardian ? (
          <div className="glass-card rounded-2xl p-5 mb-4 border border-[#C7A0E8]/50 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Add Guardian</h3>
              <button onClick={handleCancelAdd} className="p-2 rounded-lg hover:bg-[#2A1248]">
                <X className="w-5 h-5 text-[#DAD0EE]" />
              </button>
            </div>

            {/* Avatar Color */}
            <div className="mb-4">
              <label className="text-[#DAD0EE] text-sm mb-2 block">Avatar Color</label>
              <div className="flex gap-2">
                {avatarColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 rounded-full transition-all ${
                      selectedColor === color ? 'ring-2 ring-white ring-offset-2 ring-offset-[#1A0733]' : ''
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Name */}
            <div className="mb-4">
              <label className="text-[#DAD0EE] text-sm mb-2 block">Name</label>
              <input
                type="text"
                value={newGuardian.name}
                onChange={(e) => setNewGuardian({ ...newGuardian, name: e.target.value })}
                placeholder="e.g., Sarah (Mom)"
                className="w-full px-4 py-3 rounded-xl bg-[#2A1248] border border-[#3D1A5C] text-white placeholder:text-[#DAD0EE]/50 focus:outline-none focus:border-[#C7A0E8]"
              />
            </div>

            {/* Phone */}
            <div className="mb-4">
              <label className="text-[#DAD0EE] text-sm mb-2 block">Phone Number</label>
              <input
                type="tel"
                value={newGuardian.phoneNumber}
                onChange={(e) => setNewGuardian({ ...newGuardian, phoneNumber: e.target.value })}
                placeholder="+1 234-567-8901"
                className="w-full px-4 py-3 rounded-xl bg-[#2A1248] border border-[#3D1A5C] text-white placeholder:text-[#DAD0EE]/50 focus:outline-none focus:border-[#C7A0E8]"
              />
            </div>

            {/* Relationship */}
            <div className="mb-4">
              <label className="text-[#DAD0EE] text-sm mb-2 block">Relationship</label>
              <div className="flex flex-wrap gap-2">
                {relationships.map((rel) => (
                  <button
                    key={rel}
                    onClick={() => setNewGuardian({ ...newGuardian, relationship: rel })}
                    className={`px-3 py-2 rounded-xl text-sm transition-all ${
                      newGuardian.relationship === rel 
                        ? 'bg-[#C7A0E8] text-[#0D021F]' 
                        : 'bg-[#2A1248] text-[#DAD0EE]'
                    }`}
                  >
                    {rel}
                  </button>
                ))}
              </div>
            </div>

            {/* Emergency Contact Toggle */}
            <div className="mb-4 p-3 rounded-xl bg-[#2A1248] border border-[#3D1A5C]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-[#C7A0E8]" />
                  <span className="text-white text-sm">Emergency Contact</span>
                </div>
                <button
                  onClick={() => setNewGuardian({ ...newGuardian, isEmergencyContact: !newGuardian.isEmergencyContact })}
                  className={`w-12 h-7 rounded-full transition-all ${
                    newGuardian.isEmergencyContact ? 'bg-[#C7A0E8]' : 'bg-[#3D1A5C]'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    newGuardian.isEmergencyContact ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              <p className="text-[#DAD0EE]/60 text-xs mt-2">
                Emergency contacts are notified first during SOS
              </p>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSaveGuardian}
              disabled={!newGuardian.name || !newGuardian.phoneNumber}
              className={`w-full py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all ${
                newGuardian.name && newGuardian.phoneNumber 
                  ? 'bg-gradient-to-r from-[#C7A0E8] to-[#B57EDC] text-white' 
                  : 'bg-[#2A1248] text-[#DAD0EE]/50 cursor-not-allowed'
              }`}
            >
              <Check className="w-5 h-5" />
              Save Guardian
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsAddingGuardian(true)}
            className="w-full py-4 rounded-2xl glass-card border border-[#C7A0E8]/30 text-white font-semibold flex items-center justify-center gap-2 hover:bg-[#2A1248] transition-colors mb-4"
          >
            <UserPlus className="w-5 h-5 text-[#C7A0E8]" />
            Add New Guardian
          </button>
        )}

        {/* Guardians List */}
        <h3 className={`${settings.elderMode ? 'text-xl' : 'text-lg'} font-semibold text-white mb-3`}>
          Your Guardians
        </h3>
        
        <div className="space-y-3">
          {guardians.length === 0 ? (
            <div className="glass-card rounded-2xl p-8 border border-[#3D1A5C] text-center">
              <Users className="w-12 h-12 text-[#DAD0EE]/30 mx-auto mb-3" />
              <p className="text-[#DAD0EE]">No guardians yet</p>
              <p className="text-[#DAD0EE]/60 text-sm mt-1">
                Add trusted contacts to receive your SOS alerts
              </p>
            </div>
          ) : (
            guardians.map((guardian) => (
              <div 
                key={guardian.id} 
                className="glass-card rounded-2xl p-4 border border-[#C7A0E8]/30"
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold"
                    style={{ backgroundColor: guardian.avatarColor }}
                  >
                    {guardian.name[0]}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-white font-medium">{guardian.name}</h4>
                      {guardian.isEmergencyContact && (
                        <Star className="w-4 h-4 text-[#C7A0E8] fill-[#C7A0E8]" />
                      )}
                    </div>
                    <p className="text-[#DAD0EE] text-sm">{guardian.phoneNumber}</p>
                    <p className="text-[#DAD0EE]/60 text-xs">{guardian.relationship}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#3D1A5C]">
                  <button
                    onClick={() => handleTestSOS(guardian.id)}
                    disabled={testingSOS === guardian.id}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                      testingSOS === guardian.id 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-[#2A1248] text-[#DAD0EE] hover:bg-[#3D1A5C]'
                    }`}
                  >
                    {testingSOS === guardian.id ? (
                      <>
                        <Check className="w-4 h-4" />
                        Test Sent!
                      </>
                    ) : (
                      <>
                        <TestTube className="w-4 h-4" />
                        Test SOS
                      </>
                    )}
                  </button>
                  
                  <button
                    className="py-2.5 px-4 rounded-xl bg-[#2A1248] text-[#DAD0EE] hover:bg-[#3D1A5C] transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => removeGuardian(guardian.id)}
                    className="py-2.5 px-4 rounded-xl hover:bg-[#EE44FF]/20 text-[#DAD0EE] hover:text-[#EE44FF] transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
