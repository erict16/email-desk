import DeskApp from "@/components/DeskApp";
import { loadBoard } from "@/lib/parse-board";

export default function HomePage() {
  const board = loadBoard();
  return <DeskApp board={board} />;
}
