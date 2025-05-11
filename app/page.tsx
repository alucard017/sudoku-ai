"use client";

import { useState, useEffect } from "react";
import Menu from "@/components/menu";
import SudokuBoard from "@/components/sudoku-board";
import { generateRandomPuzzle, solveSudoku } from "@/lib/sudoku";
import {
  isValidSudoku,
  getFilledCellsRange,
  isBoardComplete,
} from "@/lib/sudoku-utils";
import { motion, AnimatePresence } from "framer-motion";

export default function SudokuGame() {
  const [gameState, setGameState] = useState<
    "menu" | "mode1" | "mode2" | "mode3"
  >("menu");
  const [selectedDifficulty, setSelectedDifficulty] = useState<number | null>(
    null
  );
  const [puzzle, setPuzzle] = useState<number[][]>([]);
  const [userInputGrid, setUserInputGrid] = useState<number[][]>([]);
  const [initialGrid, setInitialGrid] = useState<number[][]>([]);
  const [solvedPuzzle, setSolvedPuzzle] = useState<number[][] | null>(null);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(
    null
  );
  const [elapsedTime, setElapsedTime] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showSelectDifficultyMessage, setShowSelectDifficultyMessage] =
    useState(false);

  const difficultyTexts = ["Easy", "Moderate", "Hard"];

  useEffect(() => {
    if (gameState !== "menu" && selectedDifficulty !== null) {
      const newPuzzle = generateRandomPuzzle(
        difficultyTexts[selectedDifficulty]
      );
      setPuzzle(newPuzzle);
      setUserInputGrid(JSON.parse(JSON.stringify(newPuzzle)));
      setInitialGrid(JSON.parse(JSON.stringify(newPuzzle)));
      setSolvedPuzzle(null);
      setElapsedTime(null);
      setErrorMessage(null);
    }
  }, [gameState, selectedDifficulty]);

  const handleMenuSelection = (mode: "mode1" | "mode2" | "mode3") => {
    if (selectedDifficulty === null) {
      setShowSelectDifficultyMessage(true);
      return;
    }
    setShowSelectDifficultyMessage(false);
    setGameState(mode);
  };

  const handleDifficultySelection = (difficulty: number) => {
    setSelectedDifficulty(difficulty);
    setShowSelectDifficultyMessage(false);
  };

  const handleSolveBoard = () => {
    setElapsedTime(null);

    if (gameState === "mode2") {
      const [minCells, maxCells] = getFilledCellsRange(
        difficultyTexts[selectedDifficulty!]
      );
      const filledCells = puzzle.flat().filter((cell) => cell !== 0).length;

      if (filledCells < minCells || filledCells > maxCells) {
        setErrorMessage(
          `Please enter between ${minCells} and ${maxCells} cells for ${
            difficultyTexts[selectedDifficulty!]
          } difficulty.`
        );
        return;
      }

      if (!isValidSudoku(puzzle)) {
        setErrorMessage("Invalid Sudoku Input. Please Check Game Constraints");
        return;
      }
    }

    const start = performance.now();
    const solved = solveSudoku(gameState === "mode2" ? puzzle : userInputGrid);
    const end = performance.now();

    if (solved) {
      setElapsedTime((end - start) / 1000);
      console.log(`Board solved in ${(end - start) / 1000} seconds.`);

      if (gameState === "mode1" || gameState === "mode2") {
        setPuzzle(solved);
      } else {
        setSolvedPuzzle(solved);
      }
      setErrorMessage(null);
    } else {
      setErrorMessage("The puzzle is unsolvable.");
    }
  };

  const handleResetBoard = () => {
    if (gameState === "mode2") {
      setPuzzle(
        Array(9)
          .fill(0)
          .map(() => Array(9).fill(0))
      );
    } else {
      const newPuzzle = generateRandomPuzzle(
        difficultyTexts[selectedDifficulty!]
      );
      setPuzzle(newPuzzle);
      setUserInputGrid(JSON.parse(JSON.stringify(newPuzzle)));
      setInitialGrid(JSON.parse(JSON.stringify(newPuzzle)));
    }
    setSolvedPuzzle(null);
    setElapsedTime(null);
    setErrorMessage(null);
  };

  const handleCellClick = (row: number, col: number) => {
    if (
      gameState === "mode2" ||
      (gameState === "mode3" && initialGrid[row][col] === 0)
    ) {
      setSelectedCell([row, col]);
    }
  };

  const handleKeyPress = (key: string) => {
    if (!selectedCell) return;

    const [row, col] = selectedCell;

    if (
      gameState === "mode2" ||
      (gameState === "mode3" && initialGrid[row][col] === 0)
    ) {
      if (key >= "1" && key <= "9") {
        const newValue = Number.parseInt(key);
        if (gameState === "mode2") {
          const newPuzzle = [...puzzle];
          newPuzzle[row][col] = newValue;
          setPuzzle(newPuzzle);
        } else {
          const newUserInputGrid = [...userInputGrid];
          newUserInputGrid[row][col] = newValue;
          setUserInputGrid(newUserInputGrid);

          if (isBoardComplete(newUserInputGrid)) {
            const solved = solveSudoku(newUserInputGrid);
            if (solved) {
              setSolvedPuzzle(solved);
              setErrorMessage(
                "Congratulations! You have successfully solved the puzzle."
              );
            } else {
              setErrorMessage("The puzzle is unsolvable.");
            }
          }
        }
      } else if (key === "Backspace" || key === "Delete") {
        if (gameState === "mode2") {
          const newPuzzle = [...puzzle];
          newPuzzle[row][col] = 0;
          setPuzzle(newPuzzle);
        } else {
          const newUserInputGrid = [...userInputGrid];
          newUserInputGrid[row][col] = 0;
          setUserInputGrid(newUserInputGrid);
        }
      }
    }
  };

  const handleBackToMenu = () => {
    setGameState("menu");
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 to-teal-100 flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {gameState === "menu" ? (
          <motion.div
            key="menu"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Menu
              onModeSelect={handleMenuSelection}
              onDifficultySelect={handleDifficultySelection}
              selectedDifficulty={selectedDifficulty}
              showSelectDifficultyMessage={showSelectDifficultyMessage}
              difficultyTexts={difficultyTexts}
            />
          </motion.div>
        ) : (
          <motion.div
            key="game"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col md:flex-row gap-8 items-center"
          >
            <SudokuBoard
              board={gameState === "mode3" ? userInputGrid : puzzle}
              initialBoard={initialGrid}
              selectedCell={selectedCell}
              onCellClick={handleCellClick}
              onKeyPress={handleKeyPress}
              gameMode={gameState}
              solvedPuzzle={solvedPuzzle}
            />

            <div className="flex flex-col gap-4 w-full md:w-64">
              <div className="bg-white p-4 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold text-rose-600 mb-2">
                  {gameState === "mode1"
                    ? "AI Solves Random Board"
                    : gameState === "mode2"
                    ? "AI Solves Your Board"
                    : "You Solve Random Board"}
                </h2>
                <p className="text-sm font-medium mb-1">
                  Difficulty: {difficultyTexts[selectedDifficulty!]}
                </p>

                {gameState === "mode2" && (
                  <p className="text-xs text-gray-600 mb-4">
                    {`Enter between ${
                      getFilledCellsRange(
                        difficultyTexts[selectedDifficulty!]
                      )[0]
                    } and 
                    ${
                      getFilledCellsRange(
                        difficultyTexts[selectedDifficulty!]
                      )[1]
                    } cells`}
                  </p>
                )}

                {elapsedTime !== null && (
                  <p className="text-sm font-medium text-teal-600 mb-4">
                    Solved in {elapsedTime.toFixed(3)} seconds
                  </p>
                )}

                <div className="flex flex-col gap-2">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="bg-rose-500 text-white py-2 px-4 rounded-lg shadow hover:bg-rose-600 transition-colors"
                    onClick={handleSolveBoard}
                  >
                    {gameState === "mode3"
                      ? "Start Solve Board"
                      : "Solve Board"}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="bg-teal-500 text-white py-2 px-4 rounded-lg shadow hover:bg-teal-600 transition-colors"
                    onClick={handleResetBoard}
                  >
                    {gameState === "mode2" ? "Reset Board" : "Randomize Board"}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg shadow hover:bg-gray-300 transition-colors"
                    onClick={handleBackToMenu}
                  >
                    Back to Menu
                  </motion.button>
                </div>
              </div>

              {gameState === "mode3" && (
                <div className="bg-white p-4 rounded-xl shadow-lg">
                  <h3 className="text-lg font-semibold text-rose-600 mb-2">
                    Instructions
                  </h3>
                  <p className="text-sm text-gray-700">
                    Click on cells to select them, then use number keys (1-9) to
                    fill in values. Use Backspace or Delete to clear a cell.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                      bg-white p-6 rounded-xl shadow-xl border-2 border-red-500 max-w-md w-full"
          >
            <p className="text-center text-rose-600 font-bold">
              {errorMessage}
            </p>
            <button
              className="mt-4 bg-red-500 text-white py-1 px-4 rounded-lg mx-auto block"
              onClick={() => setErrorMessage(null)}
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
