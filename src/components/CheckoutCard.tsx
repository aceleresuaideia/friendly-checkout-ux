import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, TagIcon, ChevronDown, ChevronUp, Check } from 'lucide-react';
import Logo from './Logo';
import CreditCardForm from './CreditCardForm';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';

interface CheckoutCardProps {
  productName: string;
  price: number;
  installments: number;
}

const CheckoutCard: React.FC<CheckoutCardProps> = ({ 
  productName, 
  price, 
  installments 
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [couponOpen, setCouponOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'credit' | 'pix'>('credit');
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [useTwoCards, setUseTwoCards] = useState(false);

  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsComplete(true);
    }, 1500);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { 
        delay: custom * 0.1,
        duration: 0.4
      }
    })
  };

  return (
    <motion.div 
      className="w-full max-w-md mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={cardVariants}
    >
      <div className="p-5 border-b border-gray-100 flex items-center space-x-3">
        <Logo />
        <div className="flex flex-col items-start">
          <span className="text-xs text-gray-500 font-medium">Método Viver de Água</span>
          <h1 className="text-sm font-semibold">{productName}</h1>
        </div>
      </div>

      <div className="p-5 bg-checkout-yellow bg-opacity-10">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="font-semibold text-md">{installments}x de {formattedPrice}</span>
            <span className="text-xs text-gray-500">Ou R$ {(price * installments).toFixed(2)} à vista</span>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        <motion.div custom={0} variants={itemVariants} className="space-y-1">
          <label htmlFor="name" className="text-sm font-medium text-gray-700 block">
            Nome completo
          </label>
          <input
            id="name"
            type="text"
            className="checkout-input"
            placeholder="Digite seu nome completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </motion.div>
        
        <motion.div custom={1} variants={itemVariants} className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium text-gray-700 block">
            Seu email
          </label>
          <input
            id="email"
            type="email"
            className="checkout-input"
            placeholder="Digite seu email para receber a compra"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </motion.div>
        
        <motion.div custom={2} variants={itemVariants} className="space-y-1">
          <label htmlFor="confirmEmail" className="text-sm font-medium text-gray-700 block">
            Confirme seu email
          </label>
          <input
            id="confirmEmail"
            type="email"
            className="checkout-input"
            placeholder="Digite novamente seu email"
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
            required
          />
        </motion.div>
        
        <motion.div custom={3} variants={itemVariants} className="space-y-1">
          <label htmlFor="phone" className="text-sm font-medium text-gray-700 block">
            Celular
          </label>
          <div className="flex">
            <div className="flex items-center bg-gray-100 px-2 rounded-l-md border border-r-0 border-checkout-border">
              <span className="text-sm text-gray-600">+55</span>
            </div>
            <input
              id="phone"
              type="tel"
              className="checkout-input rounded-l-none"
              placeholder="(11) 98765-4321"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
        </motion.div>
        
        <motion.div custom={4} variants={itemVariants} className="pt-2">
          <button 
            type="button" 
            className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
            onClick={() => setCouponOpen(!couponOpen)}
          >
            <TagIcon size={16} className="mr-2" />
            Tem um cupom de desconto?
            {couponOpen ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />}
          </button>
          
          <div className={cn("mt-2 transition-all duration-300", couponOpen ? "h-14" : "h-0 overflow-hidden")}>
            <input
              type="text"
              className="checkout-input"
              placeholder="Digite seu código de cupom"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
          </div>
        </motion.div>
        
        <motion.div custom={5} variants={itemVariants} className="pt-4">
          <p className="text-sm font-medium text-gray-700 mb-3">Forma de pagamento</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              className={cn("payment-tab", paymentMethod === 'credit' && "active")}
              onClick={() => setPaymentMethod('credit')}
            >
              <CreditCard size={18} className="mr-1" />
              <span className="text-xs">Cartão de crédito</span>
            </button>
            <button
              type="button"
              className={cn("payment-tab", paymentMethod === 'pix' && "active")}
              onClick={() => setPaymentMethod('pix')}
            >
              <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.5 10L4.5 5L3 6.5L8 11.5L9.5 10Z" fill="currentColor"/>
                <path d="M14.5 10L19.5 5L21 6.5L16 11.5L14.5 10Z" fill="currentColor"/>
                <path d="M17 13.5L15.5 12L12 15.5L8.5 12L7 13.5L10.5 17L7 20.5L8.5 22L12 18.5L15.5 22L17 20.5L13.5 17L17 13.5Z" fill="currentColor"/>
              </svg>
              <span className="text-xs">Pix</span>
            </button>
          </div>
        </motion.div>
        
        {paymentMethod === 'credit' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="pt-4"
          >
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Switch
                    id="twoCards"
                    checked={useTwoCards}
                    onCheckedChange={setUseTwoCards}
                    className="mr-2"
                  />
                  <label htmlFor="twoCards" className="text-sm font-medium cursor-pointer">
                    Usar dois cartões
                  </label>
                </div>
              </div>
              
              <CreditCardForm />
              
              {useTwoCards && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 pt-4 border-t border-blue-100"
                >
                  <h3 className="text-sm font-medium mb-3">Segundo cartão</h3>
                  <CreditCardForm />
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
        
        {paymentMethod === 'pix' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="pt-4"
          >
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex flex-col items-center justify-center">
                <div className="bg-white p-4 rounded-md mb-3">
                  <svg width="150" height="150" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="500" height="500" fill="white"/>
                    <path d="M200 175L175 150L150 175L175 200L200 175Z" fill="black"/>
                    <path d="M150 325L175 350L200 325L175 300L150 325Z" fill="black"/>
                    <path d="M325 150L350 175L325 200L300 175L325 150Z" fill="black"/>
                    <path d="M350 325L325 350L300 325L325 300L350 325Z" fill="black"/>
                    <path d="M275 175H225V325H275V175Z" fill="black"/>
                    <path d="M325 225H175V275H325V225Z" fill="black"/>
                  </svg>
                </div>
                <p className="text-sm text-gray-600 mb-1">Escaneie o código QR com o aplicativo do seu banco</p>
                <button type="button" className="text-sm text-checkout-blue font-medium">
                  Copiar código PIX
                </button>
              </div>
            </div>
          </motion.div>
        )}
        
        <motion.div custom={7} variants={itemVariants} className="pt-4">
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-medium text-sm mb-2">Detalhes da compra</h3>
            <div className="flex justify-between text-sm">
              <span>{productName}</span>
              <span className="font-medium">{installments}x de {formattedPrice}</span>
            </div>
          </div>
        </motion.div>
        
        <motion.button
          custom={8}
          variants={itemVariants}
          className="w-full bg-checkout-green text-white font-medium py-3 rounded-md hover:bg-opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-checkout-green mt-4 flex items-center justify-center"
          type="submit"
          disabled={isLoading}
          whileTap={{ scale: 0.98 }}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processando...
            </span>
          ) : isComplete ? (
            <span className="flex items-center">
              <Check size={18} className="mr-1" />
              Compra realizada!
            </span>
          ) : (
            <span>Comprar agora</span>
          )}
        </motion.button>
        
        <motion.div custom={9} variants={itemVariants} className="text-xs text-gray-500 pt-3 space-y-2">
          <p>*Não compartilhamos seus dados com terceiros.</p>
          <p>Ao clicar em "Comprar agora", você declara que a economia do seu produto está em perfeito estado. Caso o desconto seja indisponível para esta compra. Contato nosso Support via (11) 2736337846 para mais informação.</p>
          <div className="flex items-center pt-2">
            <span className="font-medium mr-1">Pagamento seguro</span>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 1.33334C6.17392 1.33334 4.42216 2.03572 3.17157 3.28631C1.92099 4.53689 1.21861 6.28865 1.21861 8.11473C1.21861 9.94081 1.92099 11.6926 3.17157 12.9432C4.42216 14.1937 6.17392 14.8961 8 14.8961C9.82608 14.8961 11.5778 14.1937 12.8284 12.9432C14.079 11.6926 14.7814 9.94081 14.7814 8.11473C14.7814 6.28865 14.079 4.53689 12.8284 3.28631C11.5778 2.03572 9.82608 1.33334 8 1.33334ZM7.06667 11.448L4.11733 8.49867L4.88267 7.73334L7.06667 9.91734L11.884 5.1L12.6493 5.86534L7.06667 11.448Z" fill="#00A650"/>
            </svg>
          </div>
        </motion.div>
      </form>
      
      <div className="border-t border-gray-100 p-4 text-center text-xs text-gray-500">
        <p>© 2023 - Todos os direitos reservados</p>
      </div>
    </motion.div>
  );
};

export default CheckoutCard;
