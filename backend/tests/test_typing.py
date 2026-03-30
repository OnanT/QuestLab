import pytest
from modules.typing.services.typing_service import evaluate_typing, calculate_shell_reward

def test_evaluate_typing_accuracy():
    target = "The quick brown fox jumps over the lazy dog."
    typed = "The quick brown fox jumps over the lazy dog."
    time_ms = 10000 # 10 seconds
    
    result = evaluate_typing(typed, target, time_ms)
    
    assert result.accuracy == 100.0
    assert result.errors == 0
    assert result.passed is True

def test_evaluate_typing_with_errors():
    target = "The quick"
    typed = "The quock" # 1 error
    time_ms = 5000
    
    result = evaluate_typing(typed, target, time_ms)
    
    # 1 error in 9 chars = (9-1)/9 * 100 = 88.89
    assert result.accuracy == 88.89
    assert result.errors == 1
    assert result.passed is True

def test_evaluate_typing_incomplete():
    target = "The quick brown fox"
    typed = "The quick"
    time_ms = 5000
    
    result = evaluate_typing(typed, target, time_ms)
    
    # Target length is 19. Typed is 9. 
    # errors = 0 (for first 9) + length_diff (10) = 10 total errors
    # accuracy = (19-10)/19 * 100 = 47.37
    assert result.accuracy == 47.37
    assert result.passed is False

def test_evaluate_typing_wpm():
    target = "abcdefghijklmnopqrstuvwxy" # 25 chars = 5 words
    typed = target
    time_ms = 60000 # 1 minute
    
    result = evaluate_typing(typed, target, time_ms)
    
    assert result.wpm == 5.0

def test_calculate_shell_reward():
    # Below threshold
    assert calculate_shell_reward(79.0, 50) == 0
    
    # Basic reward
    assert calculate_shell_reward(85.0, 20) == 10
    
    # Speed bonuses
    assert calculate_shell_reward(90.0, 35) == 12 # 1.2x
    assert calculate_shell_reward(90.0, 45) == 15 # 1.5x
    assert calculate_shell_reward(90.0, 65) == 20 # 2.0x
