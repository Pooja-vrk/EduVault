import { FaFileAlt } from "react-icons/fa";
import MaterialListPage from "./MaterialListPage";

export default function DocumentMaterials() {
  return (
    <MaterialListPage
      title="Textbook Documents"
      category="Textbook Documents"
      description="Browse textbooks, reference documents, PDFs and valuable academic learning resources."
      icon={<FaFileAlt />}
      themeClass="documents-material-page"
    />
  );
}