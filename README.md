# PickPlot

An AI-integrated warehouse route optimization system that combines pathfinding algorithms with LLM intelligence via Ollama Llama3.1.

## Setup Instructions

1. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Ollama Setup:**
   - Install from [ollama.ai](https://ollama.ai/)
   - Pull the model:
     ```bash
     ollama pull llama3.1
     ```

3. **Run the Application:**
   ```bash
   python app.py
   ```
   Access the UI at `http://localhost:5000`

## Structure

- `app.py`: Flask application
- `pathfinder.py`: Core BFS / TSP pathfinding
- `ai_assistant.py`: Ollama LLM integration
- `static/`: Frontend visualizer and styles
- `templates/`: Bootstrap 5 UI
- `data/`: JSON schemas and examples
