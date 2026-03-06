import json
from pathfinder import bfs_shortest_path, optimize_target_order

test_cases = [
    {
        "name": "Single Target Map",
        "input": {
            "grid": [[0,0,1], [1,0,1], [0,2,0]],
            "start": [0,0],
            "targets": [[2,1]]
        },
        "expected_steps": 3,
        "expected_target_reached": True
    },
    {
        "name": "Unreachable Target",
        "input": {
            "grid": [[0,1,2], [0,1,0], [0,1,0]],
            "start": [0,0],
            "targets": [[0,2]]
        },
        "expected_target_reached": False
    },
    {
        "name": "Multi-Target TSP Scenario",
        "input": {
            "grid": [
                [0, 0, 1, 0, 0], 
                [1, 0, 1, 0, 1], 
                [0, 0, 0, 0, 0],
                [0, 1, 1, 1, 0],
                [0, 2, 0, 2, 0]
            ],
            "start": [0, 0],
            "targets": [[4, 1], [4, 3]]
        },
        "expected_target_reached": True
    }
]

def run_tests():
    passed = 0
    for idx, tc in enumerate(test_cases):
        print(f"\nRunning Test {idx+1}: {tc['name']}")
        grid = tc['input']['grid']
        start = tc['input']['start']
        targets = tc['input']['targets']
        path, total_steps = optimize_target_order(start, targets, grid)
        print(f"  Debug: path={path}, total_steps={total_steps}")
        
        reached = (total_steps != float('inf'))
        print(f"  Expected Reached: {tc['expected_target_reached']} | Actual Reached: {reached}")
        if 'expected_steps' in tc and reached:
            print(f"  Expected Steps: {tc['expected_steps']} | Actual Steps: {total_steps}")
            print(f"  Path Executed: {path}")
            
        # VERY BASIC VALIDATION
        if reached == tc['expected_target_reached']:
            if reached and 'expected_steps' in tc and total_steps != tc['expected_steps']:
                print("  => FAILED constraint on steps")
            else:
                passed += 1
                print("  => PASSED")
        else:
            print("  => FAILED constraint on reachability")

    print(f"\nTotal Tests Passed: {passed}/{len(test_cases)}")

if __name__ == '__main__':
    run_tests()
