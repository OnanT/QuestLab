import { useState, useEffect } from "react";
import { Progress } from "../ui/progress";
import { CheckCircle2, HelpCircle } from "lucide-react";

export default function MemoryMatch({ 
  config, 
  onScoreUpdate, 
  onComplete 
}) {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    initializeCards();
  }, [config]);

  const initializeCards = () => {
    if (!config || !config.pairs) return;
    
    let allCards = [];
    config.pairs.forEach((pair, index) => {
      // Add card A
      allCards.push({
        id: `${index}-a`,
        pairId: pair.id || index,
        content: pair.content_a || { type: "text", value: pair.a },
        isFlipped: false,
      });
      // Add card B
      allCards.push({
        id: `${index}-b`,
        pairId: pair.id || index,
        content: pair.content_b || { type: "text", value: pair.b },
        isFlipped: false,
      });
    });

    // Shuffle cards
    allCards = allCards.sort(() => Math.random() - 0.5);
    setCards(allCards);
    setFlipped([]);
    setSolved([]);
    setDisabled(false);
  };

  const handleCardClick = (card) => {
    if (disabled || flipped.includes(card.id) || solved.includes(card.pairId)) return;

    const newFlipped = [...flipped, card.id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setDisabled(true);
      const [firstId, secondId] = newFlipped;
      const firstCard = cards.find(c => c.id === firstId);
      const secondCard = cards.find(c => c.id === secondId);

      if (firstCard.pairId === secondCard.pairId) {
        // Match!
        setSolved([...solved, firstCard.pairId]);
        setFlipped([]);
        setDisabled(false);
        onScoreUpdate(20); // 20 points per match

        // Check for game completion
        if (solved.length + 1 === config.pairs.length) {
          setTimeout(onComplete, 1000);
        }
      } else {
        // No match
        setTimeout(() => {
          setFlipped([]);
          setDisabled(false);
        }, 1000);
      }
    }
  };

  const renderCardContent = (content) => {
    if (content.type === "image") {
      return <img src={content.value} alt="Card content" className="w-full h-full object-contain p-2" />;
    }
    return <span className="text-lg font-bold text-slate-800 text-center px-2">{content.value}</span>;
  };

  const progress = (solved.length / (config.pairs?.length || 1)) * 100;

  return (
    <div className="space-y-6">
      <div className="student-card p-6">
        <div className="mb-6">
          <div className="flex justify-between text-sm text-slate-500 mb-2 font-medium">
            <span>Pairs Found: {solved.length} of {config.pairs?.length || 0}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2 bg-slate-100" />
        </div>

        <div className={`grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4`}>
          {cards.map((card) => {
            const isCardFlipped = flipped.includes(card.id) || solved.includes(card.pairId);
            const isSolved = solved.includes(card.pairId);

            return (
              <div
                key={card.id}
                onClick={() => handleCardClick(card)}
                className={`
                  relative h-32 cursor-pointer transition-all duration-300 transform preserve-3d
                  ${isCardFlipped ? "rotate-y-180" : "hover:scale-105"}
                `}
              >
                {/* Front (Face Down) */}
                <div className={`
                  absolute inset-0 bg-teal-500 rounded-xl shadow-md flex items-center justify-center backface-hidden
                  ${isCardFlipped ? "opacity-0" : "opacity-100"}
                `}>
                  <HelpCircle className="w-10 h-10 text-white/50" />
                </div>

                {/* Back (Face Up) */}
                <div className={`
                  absolute inset-0 bg-white border-2 rounded-xl shadow-sm flex items-center justify-center backface-hidden rotate-y-180
                  ${isCardFlipped ? "opacity-100" : "opacity-0"}
                  ${isSolved ? "border-green-400 bg-green-50" : "border-teal-100"}
                `}>
                  {isSolved && (
                    <div className="absolute top-1 right-1">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    </div>
                  )}
                  {renderCardContent(card.content)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
