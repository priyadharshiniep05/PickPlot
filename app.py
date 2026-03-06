from flask import Flask, request, jsonify, render_template
import ai_pathfinder
import time

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/calculate', methods=['POST'])
def calculate_route():
    try:
        data = request.json
        print(f"📥 Input: {data}")
        
        grid = data['grid']
        start = data['start']
        targets = data['targets']
        
        # USE LLAMA3.1 AS THE BRAIN
        result = ai_pathfinder.llm_find_shortest_path(grid, start, targets)
        
        print(f"📤 Output: {result}")
        
        return jsonify(result), 200
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            "error": str(e),
            "path": [],
            "total_steps": 0,
            "target_reached": False
        }), 500

if __name__ == '__main__':
    print("🚀 Starting PickPlot AI Pathfinder...")
    print("🧠 Llama3.1 is the brain!")
    app.run(debug=True, host='0.0.0.0', port=5001)
