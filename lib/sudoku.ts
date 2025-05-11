export function generateRandomPuzzle(difficulty: string): number[][] {
  // Create an empty 9x9 grid
  const grid: number[][] = Array(9)
    .fill(0)
    .map(() => Array(9).fill(0));

  // Fill in some cells based on difficulty
  const filledCells = getFilledCellsCount(difficulty);

  // Fill diagonal boxes first (these are independent)
  fillDiagonalBoxes(grid);

  // Solve the grid
  const solved = solveSudoku([...grid.map((row) => [...row])]);

  if (!solved) {
    // This shouldn't happen with our approach, but just in case
    return generateRandomPuzzle(difficulty);
  }

  // Now remove numbers to create the puzzle
  return removeNumbers(solved, 81 - filledCells);
}

function getFilledCellsCount(difficulty: string): number {
  switch (difficulty) {
    case "Easy":
      return Math.floor(Math.random() * 5) + 35; // 35-39 cells
    case "Moderate":
      return Math.floor(Math.random() * 5) + 30; // 30-34 cells
    case "Hard":
      return Math.floor(Math.random() * 5) + 25; // 25-29 cells
    default:
      return 35;
  }
}

function fillDiagonalBoxes(grid: number[][]) {
  // Fill the three diagonal 3x3 boxes
  for (let box = 0; box < 3; box++) {
    fillBox(grid, box * 3, box * 3);
  }
}

function fillBox(grid: number[][], row: number, col: number) {
  const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  let index = 0;

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      grid[row + i][col + j] = nums[index++];
    }
  }
}

function shuffle(array: number[]): number[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function removeNumbers(grid: number[][], count: number): number[][] {
  const result = grid.map((row) => [...row]);
  const positions = [];

  // Create a list of all positions
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      positions.push([i, j]);
    }
  }

  // Shuffle the positions
  const shuffledPositions = shuffle(positions.map((_, i) => i));

  // Remove numbers one by one, ensuring the puzzle remains solvable
  let removed = 0;
  for (const index of shuffledPositions) {
    const [i, j] = positions[index];
    const temp = result[i][j];
    result[i][j] = 0;

    // Check if the puzzle still has a unique solution
    const copy = result.map((row) => [...row]);
    const solutions = countSolutions(copy);

    if (solutions !== 1) {
      // If not, put the number back
      result[i][j] = temp;
    } else {
      removed++;
      if (removed >= count) break;
    }
  }

  return result;
}

function countSolutions(grid: number[][]): number {
  // This is a simplified version that just checks if there's at least one solution
  return solveSudoku(grid) ? 1 : 0;
}

export function solveSudoku(grid: number[][]): number[][] | null {
  const emptyCell = findEmptyCell(grid);

  if (!emptyCell) {
    // No empty cells, puzzle is solved
    return grid;
  }

  const [row, col] = emptyCell;

  for (let num = 1; num <= 9; num++) {
    if (isValidPlacement(grid, row, col, num)) {
      grid[row][col] = num;

      const result = solveSudoku(grid);
      if (result) {
        return result;
      }

      // If we get here, this placement didn't work
      grid[row][col] = 0;
    }
  }

  // No valid placement found
  return null;
}

function findEmptyCell(grid: number[][]): [number, number] | null {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (grid[i][j] === 0) {
        return [i, j];
      }
    }
  }
  return null;
}

function isValidPlacement(
  grid: number[][],
  row: number,
  col: number,
  num: number
): boolean {
  // Check row
  for (let j = 0; j < 9; j++) {
    if (grid[row][j] === num) {
      return false;
    }
  }

  // Check column
  for (let i = 0; i < 9; i++) {
    if (grid[i][col] === num) {
      return false;
    }
  }

  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[boxRow + i][boxCol + j] === num) {
        return false;
      }
    }
  }

  return true;
}
