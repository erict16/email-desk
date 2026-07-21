import Board from "@/components/Board";
import { loadBoard } from "@/lib/parse-board";

export default function HomePage() {
  const board = loadBoard();
  return <Board board={board} />;
}
