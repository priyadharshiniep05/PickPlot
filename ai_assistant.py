import json
import logging

try:
    from ollama import chat
except ImportError:
    logging.warning("ollama package not installed. AI features will be disabled. Run pip install ollama")

def get_ai_route_analysis(grid, path, targets):
    """
    Sends the route context to local Ollama Llama 3.1 and returns optimization insights.
    If Ollama is not available or fails, returns a fallback message.
    """
    prompt = f'''Analyze this warehouse route:
    Grid: {grid}
    Path: {path}
    Targets: {targets}
    
    Provide optimization insights and explain the strategy. Keep the explanation concise and practical. 
    Focus on why avoiding obstacles and specific approaches to targets were taken based on the shortest path.
    '''
    
    try:
        response = chat(
            model='llama3.1',
            messages=[{
                'role': 'user', 
                'content': prompt
            }],
        )
        return response.message.content
    except Exception as e:
        logging.error(f"Error communicating with Ollama: {e}")
        return "AI analysis unavailable. Please assure Ollama is running locally with the llama3.1 model."

def analyze_warehouse_layout(grid):
    """
    Identifies bottlenecks and congestion zones based purely on the grid.
    """
    prompt = f'''Analyze this warehouse grid layout:
    Grid: {grid}
    (0 = Walkable path, 1 = Obstacle/Shelf)
    
    Identify potential bottlenecks, congestion zones, and comment on the overall layout efficiency. 
    Keep it concise and highlight the most problematic areas.
    '''
    
    try:
        response = chat(
            model='llama3.1',
            messages=[{'role': 'user', 'content': prompt}],
        )
        return response.message.content
    except Exception as e:
        return "AI analysis unavailable. Please assure Ollama is running locally with the llama3.1 model."
