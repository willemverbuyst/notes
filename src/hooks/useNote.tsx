import { useOutletContext } from "react-router-dom";
import { Note } from "../types";

function useNote() {
  return useOutletContext<Note>();
}

export default useNote;
