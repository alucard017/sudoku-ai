export function isValidSudoku(grid: number[][]): boolean {
  // Check rows
  for (let i = 0; i < 9; i++) {
    const seen = new Set<number>()
    for (let j = 0; j < 9; j++) {
      const cell = grid[i][j]
      if (cell !== 0) {
        if (seen.has(cell)) {
          return false
        }
        seen.add(cell)
      }
    }
  }

  // Check columns
  for (let j = 0; j < 9; j++) {
    const seen = new Set<number>()
    for (let i = 0; i < 9; i++) {
      const cell = grid[i][j]
      if (cell !== 0) {
        if (seen.has(cell)) {
          return false
        }
        seen.add(cell)
      }
    }
  }

  // Check 3x3 boxes
  for (let boxRow = 0; boxRow < 3; boxRow++) {
    for (let boxCol = 0; boxCol < 3; boxCol++) {
      const seen = new Set<number>()
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          const cell = grid[boxRow * 3 + i][boxCol * 3 + j]
          if (cell !== 0) {
            if (seen.has(cell)) {
              return false
            }
            seen.add(cell)
          }
        }
      }
    }
  }

  return true
}

export function getFilledCellsRange(difficulty: string): [number, number] {
  switch (difficulty) {
    case "Easy":
      return [35, 39]
    case "Moderate":
      return [30, 34]
    case "Hard":
      return [25, 29]
    default:
      return [30, 35]
  }
}

export function isBoardComplete(grid: number[][]): boolean {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (grid[i][j] === 0) {
        return false
      }
    }
  }
  return true
}
