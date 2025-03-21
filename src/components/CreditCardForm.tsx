
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

const CreditCardForm = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpMonth, setCardExpMonth] = useState('');
  const [cardExpYear, setCardExpYear] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  
  const monthInputRef = useRef<HTMLSelectElement>(null);
  const yearInputRef = useRef<HTMLSelectElement>(null);
  const cvvInputRef = useRef<HTMLInputElement>(null);
  
  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };
  
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardNumber(e.target.value);
    setCardNumber(formattedValue.substring(0, 19));
  };
  
  const handleCvvFocus = () => {
    setIsCardFlipped(true);
    setFocusedField('cvv');
  };
  
  const handleCvvBlur = () => {
    setIsCardFlipped(false);
    setFocusedField(null);
  };
  
  // Generate options for month and year selects
  const months = Array.from({ length: 12 }, (_, i) => {
    const monthNum = i + 1;
    return { value: monthNum.toString().padStart(2, '0'), label: monthNum.toString().padStart(2, '0') };
  });
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => {
    const year = currentYear + i;
    return { value: year.toString().slice(-2), label: year.toString() };
  });
  
  return (
    <div className="space-y-4">
      {/* Credit Card Preview */}
      <div className="relative h-44 w-full perspective-1000">
        <motion.div 
          className={cn(
            "absolute w-full h-full transform-style-3d transition-transform duration-500",
            isCardFlipped ? "rotate-y-180" : ""
          )}
          initial={false}
          animate={{ rotateY: isCardFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Front of the card */}
          <div className="absolute w-full h-full backface-hidden rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 p-4 text-white shadow-md overflow-hidden">
            <div className="h-full flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="w-12 h-8 bg-gray-700 rounded-md flex items-center justify-center">
                  <CreditCard size={20} className="text-gray-300" />
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-400">Cartão de crédito</div>
                </div>
              </div>
              
              <div className="relative">
                <div className={cn(
                  "text-xl tracking-widest transition-all duration-200 min-h-6",
                  focusedField === 'number' ? "text-white" : "text-gray-300"
                )}>
                  {cardNumber || '•••• •••• •••• ••••'}
                </div>
              </div>
              
              <div className="flex justify-between items-end">
                <div className="flex-1">
                  <div className="text-xs text-gray-400 mb-1">Nome do titular</div>
                  <div className={cn(
                    "text-sm uppercase tracking-wider transition-all duration-200 min-h-5",
                    focusedField === 'name' ? "text-white" : "text-gray-300"
                  )}>
                    {cardName || 'NOME DO TITULAR'}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-xs text-gray-400 mb-1">Validade</div>
                  <div className={cn(
                    "text-sm transition-all duration-200",
                    focusedField === 'expiry' ? "text-white" : "text-gray-300"
                  )}>
                    {cardExpMonth || 'MM'}/{cardExpYear || 'AA'}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-5 -skew-x-12 animate-shimmer"></div>
          </div>
          
          {/* Back of the card */}
          <div className="absolute w-full h-full backface-hidden rotate-y-180 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 text-white shadow-md overflow-hidden">
            <div className="h-12 w-full bg-gray-700 mt-4"></div>
            <div className="px-6 mt-6">
              <div className="bg-gray-600 h-10 flex items-center justify-end pr-3 rounded">
                <div className={cn(
                  "text-sm transition-all duration-200",
                  focusedField === 'cvv' ? "text-white" : "text-gray-300"
                )}>
                  {cardCvv || 'CVV'}
                </div>
              </div>
              <div className="mt-6 text-xs text-gray-400 text-right">
                O código de segurança está no verso do cartão
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Card Form */}
      <div className="space-y-3 mt-4">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">
            Número do cartão
          </label>
          <input
            type="text"
            className="checkout-input cc-number-input"
            placeholder="Digite o número do cartão"
            value={cardNumber}
            onChange={handleCardNumberChange}
            maxLength={19}
            onFocus={() => setFocusedField('number')}
            onBlur={() => setFocusedField(null)}
          />
        </div>
        
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">
            Nome do titular
          </label>
          <input
            type="text"
            className="checkout-input"
            placeholder="Digite o nome impresso no cartão"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            onFocus={() => setFocusedField('name')}
            onBlur={() => setFocusedField(null)}
          />
        </div>
        
        <div className="flex space-x-4">
          <div className="w-1/2">
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Mês / Ano
            </label>
            <div className="flex space-x-2">
              <select
                ref={monthInputRef}
                className="checkout-input"
                value={cardExpMonth}
                onChange={(e) => setCardExpMonth(e.target.value)}
                onFocus={() => setFocusedField('expiry')}
                onBlur={() => setFocusedField(null)}
              >
                <option value="" disabled>Mês</option>
                {months.map(month => (
                  <option key={month.value} value={month.value}>{month.label}</option>
                ))}
              </select>
              
              <select
                ref={yearInputRef}
                className="checkout-input"
                value={cardExpYear}
                onChange={(e) => setCardExpYear(e.target.value)}
                onFocus={() => setFocusedField('expiry')}
                onBlur={() => setFocusedField(null)}
              >
                <option value="" disabled>Ano</option>
                {years.map(year => (
                  <option key={year.value} value={year.value}>{year.label}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="w-1/2">
            <label className="text-sm font-medium text-gray-700 block mb-1 flex items-center">
              CVV 
              <span className="ml-1 text-gray-500 inline-flex items-center cursor-help" title="Código de segurança">
                <Info size={14} />
              </span>
            </label>
            <input
              ref={cvvInputRef}
              type="text"
              className="checkout-input"
              placeholder="CVV"
              maxLength={4}
              value={cardCvv}
              onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').substring(0, 4))}
              onFocus={handleCvvFocus}
              onBlur={handleCvvBlur}
            />
          </div>
        </div>
        
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">
            Número de parcelas
          </label>
          <select className="checkout-input">
            <option>12x de R$ 50,57</option>
            <option>6x de R$ 101,14</option>
            <option>3x de R$ 202,28</option>
            <option>2x de R$ 303,42</option>
            <option>1x de R$ 606,84</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default CreditCardForm;
