from collections import deque
from itertools import permutations

def get_neighbors(current, grid):
    """
    Returns valid 4-directional neighbors for a given cell.
    """
    rows = len(grid)
    cols = len(grid[0]) if rows > 0 else 0
    r, c = current
    
    neighbors = []
    directions = [(-1, 0), (1, 0), (0, -1), (0, 1)] # Up, Down, Left, Right
    
    for dr, dc in directions:
        nr, nc = r + dr, c + dc
        if 0 <= nr < rows and 0 <= nc < cols:
            neighbors.append((nr, nc))
            
    return neighbors

def bfs_shortest_path(grid, start, goal):
    """
    Returns shortest path avoiding obstacles (1)
    Path includes both start and goal.
    Returns None if no path is found.
    """
    if start == goal:
        return [start]
        
    start_tuple = tuple(start)
    goal_tuple = tuple(goal)
    
    # Optional: if start or goal itself is an obstacle, handle appropriately.
    # We assume start and goal are valid based on the problem statement, 
    # but let's be safe.
    if grid[start_tuple[0]][start_tuple[1]] == 1:
        return None
        
    queue = deque([(start_tuple, [start_tuple])])
    visited = {start_tuple}
    
    while queue:
        current, path = queue.popleft()
        
        if current == goal_tuple:
            # Convert tuples back to lists for JSON serialization compatibility
            return [list(p) for p in path]
            
        for neighbor in get_neighbors(current, grid):
            nr, nc = neighbor
            # 1 is an obstacle.
            if neighbor not in visited and grid[nr][nc] != 1:
                visited.add(neighbor)
                queue.append((neighbor, path + [neighbor]))
    
    # If queue is empty and goal not reached
    return None

def calculate_route_distance(route, grid):
    """
    Calculates total distance (number of steps) for a full route, 
    visiting points in the specified sequence.
    Returns infinity if any leg of the route is impassable.
    """
    total_steps = 0
    full_path = [list(route[0])]
    
    for i in range(len(route) - 1):
        leg_path = bfs_shortest_path(grid, route[i], route[i+1])
        if leg_path is None:
            return float('inf'), None
            
        # Add leg path to full path, excluding the start of the leg to avoid duplicates
        full_path.extend(leg_path[1:])
        total_steps += len(leg_path) - 1
        
    return total_steps, full_path

def optimize_target_order(start, targets, grid):
    """
    Find best order to visit all targets (TSP solver).
    Start is fixed, targets are permuted.
    """
    start_tuple = tuple(start)
    target_tuples = [tuple(t) for t in targets]
    
    min_distance = float('inf')
    best_path = None
    
    for perm in permutations(target_tuples):
        route = [start_tuple] + list(perm)
        total_steps, full_path = calculate_route_distance(route, grid)
        
        if total_steps < min_distance:
            min_distance = total_steps
            best_path = full_path
            
    return best_path, min_distance
