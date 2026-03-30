from dataclasses import dataclass
from typing import List, Optional

@dataclass
class TypingResult:
    accuracy: float
    wpm: float
    errors: int
    passed: bool

def evaluate_typing(input_text: str, target: str, time_ms: int) -> TypingResult:
    """
    Evaluates typing performance and calculates stats.
    - input_text: The text typed by the user.
    - target: The expected text.
    - time_ms: Time taken in milliseconds.
    """
    if time_ms <= 0:
        # Avoid division by zero, though in practice time should always be positive
        return TypingResult(accuracy=0.0, wpm=0.0, errors=len(target), passed=False)

    # Basic accuracy: compare characters at each position
    char_count = min(len(input_text), len(target))
    errors = sum(1 for i in range(char_count) if input_text[i] != target[i])
    
    # Penalize for incomplete or extra characters
    length_diff = abs(len(target) - len(input_text))
    total_errors = errors + length_diff

    # Accuracy percentage based on target length
    accuracy = max(0.0, (len(target) - total_errors) / len(target) * 100)
    
    # WPM: (characters / 5) / (minutes)
    # Standard WPM assumes 5 characters = 1 word
    words = len(input_text) / 5
    minutes = time_ms / 60000
    wpm = words / minutes if minutes > 0 else 0.0

    return TypingResult(
        accuracy=round(accuracy, 2),
        wpm=round(wpm, 2),
        errors=total_errors,
        passed=accuracy >= 80.0  # Threshold of 80% to pass
    )

def calculate_shell_reward(accuracy: float, wpm: float) -> int:
    """
    Calculates the number of shells awarded based on performance.
    """
    if accuracy < 80.0:
        return 0
    
    base_reward = 10
    
    # Speed bonus multipliers
    multiplier = 1.0
    if wpm >= 60:
        multiplier = 2.0
    elif wpm >= 40:
        multiplier = 1.5
    elif wpm >= 30:
        multiplier = 1.2
        
    return int(base_reward * multiplier)
