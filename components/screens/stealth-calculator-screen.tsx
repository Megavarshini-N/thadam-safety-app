"use client";

import { useState } from 'react';
import { useApp } from '@/lib/app-context';

export function StealthCalculatorScreen() {
  const { setCurrentScreen, updateSettings } = useApp();
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);
  const [titlePressCount, setTitlePressCount] = useState(0);
  const [titlePressTimer, setTitlePressTimer] = useState<NodeJS.Timeout | null>(null);

  const handleTitlePress = () => {
    if (titlePressTimer) {
      clearTimeout(titlePressTimer);
    }

    const newCount = titlePressCount + 1;
    setTitlePressCount(newCount);

    if (newCount >= 3) {
      // Unlock THADAM
      updateSettings({ stealthMode: false });
      setCurrentScreen('home');
      setTitlePressCount(0);
      return;
    }

    const timer = setTimeout(() => {
      setTitlePressCount(0);
    }, 1000);
    setTitlePressTimer(timer);
  };

  const handleNumber = (num: string) => {
    if (waitingForNewValue) {
      setDisplay(num);
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleDecimal = () => {
    if (waitingForNewValue) {
      setDisplay('0.');
      setWaitingForNewValue(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleOperation = (op: string) => {
    const current = parseFloat(display);
    
    if (previousValue !== null && operation && !waitingForNewValue) {
      const result = calculate(previousValue, current, operation);
      setDisplay(String(result));
      setPreviousValue(result);
    } else {
      setPreviousValue(current);
    }
    
    setOperation(op);
    setWaitingForNewValue(true);
  };

  const calculate = (a: number, b: number, op: string): number => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '×': return a * b;
      case '÷': return b !== 0 ? a / b : 0;
      default: return b;
    }
  };

  const handleEquals = () => {
    if (previousValue === null || operation === null) return;
    
    const current = parseFloat(display);
    const result = calculate(previousValue, current, operation);
    
    setDisplay(String(result));
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewValue(true);
  };

  const handleClear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewValue(false);
  };

  const handleToggleSign = () => {
    setDisplay(String(-parseFloat(display)));
  };

  const handlePercent = () => {
    setDisplay(String(parseFloat(display) / 100));
  };

  const Button = ({ 
    value, 
    onClick, 
    className = '',
    isOperation = false,
    isActive = false
  }: { 
    value: string; 
    onClick: () => void; 
    className?: string;
    isOperation?: boolean;
    isActive?: boolean;
  }) => (
    <button
      onClick={onClick}
      className={`
        aspect-square rounded-full text-2xl font-medium
        flex items-center justify-center transition-all
        active:scale-95
        ${isOperation 
          ? isActive 
            ? 'bg-white text-[#EE44FF]' 
            : 'bg-[#EE44FF] text-white hover:bg-[#EE44FF]/80'
          : className}
      `}
    >
      {value}
    </button>
  );

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header - tap 3 times to unlock */}
      <button
        onClick={handleTitlePress}
        className="py-4 text-center"
      >
        <h1 className="text-gray-400 text-lg">Calculator</h1>
      </button>

      {/* Display */}
      <div className="flex-1 flex items-end justify-end px-6 pb-4">
        <span className="text-white text-6xl font-light truncate">
          {display.length > 9 ? Number(display).toExponential(4) : display}
        </span>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-4 gap-3 p-4 pb-8">
        <Button 
          value="AC" 
          onClick={handleClear} 
          className="bg-gray-400 text-black hover:bg-gray-300"
        />
        <Button 
          value="+/-" 
          onClick={handleToggleSign} 
          className="bg-gray-400 text-black hover:bg-gray-300"
        />
        <Button 
          value="%" 
          onClick={handlePercent} 
          className="bg-gray-400 text-black hover:bg-gray-300"
        />
        <Button 
          value="÷" 
          onClick={() => handleOperation('÷')} 
          isOperation 
          isActive={operation === '÷'}
        />

        <Button 
          value="7" 
          onClick={() => handleNumber('7')} 
          className="bg-gray-700 text-white hover:bg-gray-600"
        />
        <Button 
          value="8" 
          onClick={() => handleNumber('8')} 
          className="bg-gray-700 text-white hover:bg-gray-600"
        />
        <Button 
          value="9" 
          onClick={() => handleNumber('9')} 
          className="bg-gray-700 text-white hover:bg-gray-600"
        />
        <Button 
          value="×" 
          onClick={() => handleOperation('×')} 
          isOperation 
          isActive={operation === '×'}
        />

        <Button 
          value="4" 
          onClick={() => handleNumber('4')} 
          className="bg-gray-700 text-white hover:bg-gray-600"
        />
        <Button 
          value="5" 
          onClick={() => handleNumber('5')} 
          className="bg-gray-700 text-white hover:bg-gray-600"
        />
        <Button 
          value="6" 
          onClick={() => handleNumber('6')} 
          className="bg-gray-700 text-white hover:bg-gray-600"
        />
        <Button 
          value="-" 
          onClick={() => handleOperation('-')} 
          isOperation 
          isActive={operation === '-'}
        />

        <Button 
          value="1" 
          onClick={() => handleNumber('1')} 
          className="bg-gray-700 text-white hover:bg-gray-600"
        />
        <Button 
          value="2" 
          onClick={() => handleNumber('2')} 
          className="bg-gray-700 text-white hover:bg-gray-600"
        />
        <Button 
          value="3" 
          onClick={() => handleNumber('3')} 
          className="bg-gray-700 text-white hover:bg-gray-600"
        />
        <Button 
          value="+" 
          onClick={() => handleOperation('+')} 
          isOperation 
          isActive={operation === '+'}
        />

        <button
          onClick={() => handleNumber('0')}
          className="col-span-2 rounded-full bg-gray-700 text-white text-2xl font-medium hover:bg-gray-600 h-20 flex items-center pl-8 transition-all active:scale-95"
        >
          0
        </button>
        <Button 
          value="." 
          onClick={handleDecimal} 
          className="bg-gray-700 text-white hover:bg-gray-600"
        />
        <Button 
          value="=" 
          onClick={handleEquals} 
          isOperation
        />
      </div>
    </div>
  );
}
