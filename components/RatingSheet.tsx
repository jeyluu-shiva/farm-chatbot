import React, { useState } from 'react';
import { Star, X, Send } from 'lucide-react';

interface Props {
  onRate: (stars: number, feedback: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

export const RatingSheet: React.FC<Props> = ({ onRate, onClose, isOpen }) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen && !isSubmitted) return null;

  const handleSubmit = () => {
    onRate(rating, feedback);
    setIsSubmitted(true);
    // Auto close after showing thank you message
    setTimeout(() => {
      onClose();
      setIsSubmitted(false);
      setRating(0);
      setFeedback('');
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <div className="absolute bottom-20 left-4 right-4 bg-emerald-600 text-white p-4 rounded-2xl shadow-xl z-50 animate-fade-in text-center">
        <p className="font-bold text-lg">Cảm ơn đánh giá của bạn!</p>
        <p className="text-emerald-100 text-sm">Chúng tôi sẽ cải thiện tốt hơn.</p>
      </div>
    );
  }

  return (
    <div className="absolute bottom-[80px] left-4 right-4 bg-white border border-slate-100 p-5 rounded-2xl shadow-2xl z-50 animate-slide-up">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-bold text-slate-800 text-base">Cuộc trò chuyện này thế nào?</h3>
          <p className="text-xs text-slate-500">Giúp chúng tôi cải thiện chất lượng tư vấn</p>
        </div>
        <button 
          onClick={onClose}
          className="p-1 -mr-2 -mt-2 text-slate-400 hover:bg-slate-100 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Stars */}
      <div className="flex justify-center gap-3 my-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            className="transition-transform active:scale-110 focus:outline-none"
          >
            <Star 
              className={`w-8 h-8 ${rating >= star ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} 
            />
          </button>
        ))}
      </div>

      {/* Feedback Text - Show only if rated */}
      {rating > 0 && (
        <div className="animate-fade-in">
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Bạn có góp ý gì thêm không? (Tùy chọn)"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:border-emerald-500 focus:outline-none mb-3 resize-none h-20"
          />
          <button
            onClick={handleSubmit}
            className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold shadow-md shadow-emerald-200 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            Gửi đánh giá
          </button>
        </div>
      )}
    </div>
  );
};