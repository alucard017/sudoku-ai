"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface SudokuBoardProps {
  board: number[][];
  initialBoard: number[][];
  selectedCell: [number, number] | null;
  onCellClick: (row: number, col: number) => void;
  onKeyPress: (key: string) => void;
  gameMode: string;
  solvedPuzzle: number[][] | null;
}

export default function SudokuBoard({
  board,
  initialBoard,
  selectedCell,
  onCellClick,
  onKeyPress,
  gameMode,
  solvedPuzzle,
}: SudokuBoardProps) {
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key >= "1" && e.key <= "9") ||
        e.key === "Backspace" ||
        e.key === "Delete"
      ) {
        onKeyPress(e.key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onKeyPress]);

  useEffect(() => {
    if (boardRef.current) {
      boardRef.current.focus();
    }
  }, []);

  const highlightConflicts = (row: number, col: number, value: number) => {
    if (gameMode !== "mode3" || !solvedPuzzle || value === 0) return false;

    if (value !== solvedPuzzle[row][col]) {
      return true;
    }

    for (let c = 0; c < 9; c++) {
      if (c !== col && board[row][c] === value) {
        return true;
      }
    }

    for (let r = 0; r < 9; r++) {
      if (r !== row && board[r][col] === value) {
        return true;
      }
    }

    const subgridRow = Math.floor(row / 3) * 3;
    const subgridCol = Math.floor(col / 3) * 3;

    for (let r = subgridRow; r < subgridRow + 3; r++) {
      for (let c = subgridCol; c < subgridCol + 3; c++) {
        if ((r !== row || c !== col) && board[r][c] === value) {
          return true;
        }
      }
    }

    return false;
  };

  return (
    <motion.div
      ref={boardRef}
      className="bg-white rounded-xl shadow-xl p-4 select-none"
      tabIndex={0}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <div className="grid grid-cols-9 gap-1">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isInitial = initialBoard[rowIndex][colIndex] !== 0;
            const isSelected =
              selectedCell &&
              selectedCell[0] === rowIndex &&
              selectedCell[1] === colIndex;
            const isConflict = highlightConflicts(rowIndex, colIndex, cell);

            const isTopEdge = rowIndex % 3 === 0;
            const isLeftEdge = colIndex % 3 === 0;
            const isRightEdge = colIndex % 3 === 2;
            const isBottomEdge = rowIndex % 3 === 2;

            return (
              <motion.div
                key={`${rowIndex}-${colIndex}`}
                className={`
                  w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center 
                  font-bold text-lg relative cursor-pointer
                  ${isInitial ? "bg-gray-100" : "bg-white"}
                  ${
                    isTopEdge
                      ? "border-t-2 border-gray-800"
                      : "border-t border-gray-300"
                  }
                  ${
                    isLeftEdge
                      ? "border-l-2 border-gray-800"
                      : "border-l border-gray-300"
                  }
                  ${
                    isRightEdge
                      ? "border-r-2 border-gray-800"
                      : "border-r border-gray-300"
                  }
                  ${
                    isBottomEdge
                      ? "border-b-2 border-gray-800"
                      : "border-b border-gray-300"
                  }
                  ${rowIndex === 8 ? "border-b-2 border-gray-800" : ""}
                  ${colIndex === 8 ? "border-r-2 border-gray-800" : ""}
                  ${rowIndex === 0 ? "border-t-2 border-gray-800" : ""}
                  ${colIndex === 0 ? "border-l-2 border-gray-800" : ""}
                `}
                onClick={() => onCellClick(rowIndex, colIndex)}
                whileHover={
                  !isInitial ? { backgroundColor: "#f0f9ff" } : undefined
                }
                animate={
                  isSelected ? { backgroundColor: "#fef3c7" } : undefined
                }
              >
                {cell !== 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`
                      ${isInitial ? "text-gray-800" : "text-rose-600"}
                      ${isConflict ? "text-red-500" : ""}
                    `}
                  >
                    {cell}
                  </motion.span>
                )}
                {isConflict && (
                  <motion.div
                    className="absolute inset-0 border-2 border-red-500 rounded-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.div>
            );
          })
        )}
      </div>
      <div className="mt-4 md:hidden">
        {selectedCell && (
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <motion.button
                key={num}
                className="bg-gray-100 hover:bg-gray-200 w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onKeyPress(num.toString())}
              >
                {num}
              </motion.button>
            ))}
            <motion.button
              className="bg-gray-100 hover:bg-gray-200 w-12 h-12 rounded-lg flex items-center justify-center col-span-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onKeyPress("Backspace")}
            >
              Clear
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
