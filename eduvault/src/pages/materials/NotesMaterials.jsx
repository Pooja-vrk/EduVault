import { FaBookOpen } from "react-icons/fa";
import MaterialListPage from "./MaterialListPage";

export default function NotesMaterials() {
  return (
    <MaterialListPage
      title="Lecture Notes"
      category="Lecture Notes"
      description="Access organized lecture notes, handwritten notes and important academic study resources."
      icon={<FaBookOpen />}
      themeClass="notes-material-page"
    />
  );
}