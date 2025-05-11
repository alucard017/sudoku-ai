"use client";

import { motion } from "framer-motion";

interface MenuProps {
  onModeSelect: (mode: "mode1" | "mode2" | "mode3") => void;
  onDifficultySelect: (difficulty: number) => void;
  selectedDifficulty: number | null;
  showSelectDifficultyMessage: boolean;
  difficultyTexts: string[];
}

export default function Menu({
  onModeSelect,
  onDifficultySelect,
  selectedDifficulty,
  showSelectDifficultyMessage,
  difficultyTexts,
}: MenuProps) {
  const buttonVariants = {
    hover: { scale: 1.03, boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)" },
    tap: { scale: 0.97 },
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
      <motion.h1
        className="text-3xl font-bold text-center mb-8 text-rose-600"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        Sudoku AI
      </motion.h1>

      <div className="space-y-4">
        <motion.button
          className="w-full py-4 px-6 bg-gradient-to-r from-rose-400 to-rose-500 text-white rounded-xl shadow-md text-lg font-medium"
          onClick={() => onModeSelect("mode1")}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Mode 1: AI Agent Solves Randomly Generated Board
        </motion.button>

        <motion.button
          className="w-full py-4 px-6 bg-gradient-to-r from-teal-400 to-teal-500 text-white rounded-xl shadow-md text-lg font-medium"
          onClick={() => onModeSelect("mode2")}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Mode 2: AI Agent Solves User Generated Board
        </motion.button>

        <motion.button
          className="w-full py-4 px-6 bg-gradient-to-r from-purple-400 to-purple-500 text-white rounded-xl shadow-md text-lg font-medium"
          onClick={() => onModeSelect("mode3")}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Mode 3: User Solves Randomly Generated Board
        </motion.button>
      </div>

      <motion.div
        className="mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Select Difficulty:
        </h2>
        <div className="flex justify-around">
          {difficultyTexts.map((difficulty, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => onDifficultySelect(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div
                className={`w-6 h-6 rounded-full border-2 border-gray-400 flex items-center justify-center
                              ${
                                selectedDifficulty === index
                                  ? "bg-rose-500 border-rose-500"
                                  : "bg-white"
                              }`}
              >
                {selectedDifficulty === index && (
                  <motion.div
                    className="w-3 h-3 bg-white rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </div>
              <span className="text-lg font-medium">{difficulty}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {showSelectDifficultyMessage && (
        <motion.div
          className="mt-6 p-4 bg-red-100 text-red-700 rounded-lg text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          Please select a difficulty first!
        </motion.div>
      )}
    </div>
  );
}
