from ollama import chat
import json
import time
from collections import deque

def llm_find_shortest_path(grid, start, targets):
    """Main AI pathfinding function"""
    
    grid_str = format_grid_for_llm(grid)
    
    prompt = f"""You are an expert pathfinding AI. Calculate the shortest warehouse route.

WAREHOUSE GRID:
{grid_str}

Legend: 0=walkable, 1=obstacle/shelf, 2=target item

START: Row {start[0]}, Column {start[1]}
TARGETS: {targets}

TASK: Find shortest path visiting all targets, avoiding obstacles.
MOVEMENT: Only UP/DOWN/LEFT/RIGHT (no diagonals)

RESPONSE FORMAT (JSON only, no markdown):
{{
    "reasoning": "brief explanation of your approach",
    "path": [[0,0], [0,1], [1,1]],
    "total_steps": 3,
    "targets_reached": 2
}}

Think carefully and provide the optimal path."""

    start_time = time.time()
    
    try:
        response = chat(
            model='llama3.1',
            messages=[{'role': 'user', 'content': prompt}],
        )
        
        result = extract_json(response['message']['content'])
        
        # Validate
        if not validate_path(grid, result.get('path', []), targets):
            print("⚠️ LLM path invalid, using BFS")
            result = bfs_fallback(grid, start, targets)
        
        result['execution_time_ms'] = int((time.time() - start_time) * 1000)
        result['ai_powered'] = True
        result['target_reached'] = result.get('targets_reached', 0) == len(targets)
        
        return result
        
    except Exception as e:
        print(f"❌ LLM failed: {e}, using BFS fallback")
        return bfs_fallback(grid, start, targets)


def format_grid_for_llm(grid):
    """Make grid readable for LLM"""
    lines = []
    for i, row in enumerate(grid):
        lines.append(f"Row {i}: {' '.join(map(str, row))}")
    return '\n'.join(lines)


def extract_json(text):
    """Extract JSON from LLM response"""
    # Remove markdown fences
    text = text.strip()
    if '```json' in text:
        text = text.split('```json')[1].split('```')[0]
    elif '```' in text:
        text = text.split('```')[1].split('```')[0]
    
    return json.loads(text.strip())


def validate_path(grid, path, targets):
    """Check if path is valid"""
    if not path or len(path) < 2:
        return False
    
    # Check consecutive moves are adjacent
    for i in range(len(path) - 1):
        r1, c1 = path[i]
        r2, c2 = path[i + 1]
        if abs(r1 - r2) + abs(c1 - c2) != 1:
            return False
    
    # Check no obstacles
    for r, c in path:
        if grid[r][c] == 1:
            return False
    
    # Check targets visited
    targets_set = set(map(tuple, targets))
    path_set = set(map(tuple, path))
    return targets_set.issubset(path_set)


def bfs_fallback(grid, start, targets):
    """Traditional BFS backup"""
    def bfs_single(grid, start, goal):
        queue = deque([(start, [start])])
        visited = {tuple(start)}
        
        while queue:
            (curr, path) = queue.popleft()
            
            if curr == goal:
                return path
            
            for dr, dc in [(-1,0), (1,0), (0,-1), (0,1)]:
                nr, nc = curr[0] + dr, curr[1] + dc
                
                if (0 <= nr < len(grid) and 0 <= nc < len(grid[0]) and
                    grid[nr][nc] != 1 and (nr, nc) not in visited):
                    visited.add((nr, nc))
                    queue.append(([nr, nc], path + [[nr, nc]]))
        
        return None
    
    # Connect all targets
    full_path = [list(start)]
    current = list(start)
    for target in targets:
        segment = bfs_single(grid, current, target)
        if segment:
            full_path.extend(segment[1:])
            current = target
    
    return {
        "reasoning": "BFS fallback used",
        "path": full_path,
        "total_steps": len(full_path) - 1,
        "targets_reached": len(targets),
        "ai_powered": False
    }
