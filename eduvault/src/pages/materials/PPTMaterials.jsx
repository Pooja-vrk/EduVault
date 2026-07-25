import { FaFilePowerpoint } from "react-icons/fa";
import MaterialListPage from "./MaterialListPage";

export default function PPTMaterials() {
  return (
    <MaterialListPage
      title="PowerPoint PPTs"
      category="PowerPoint PPTs"
      description="Explore presentation slides, seminar PPTs and classroom presentations uploaded to EduVault."
      icon={<FaFilePowerpoint />}
      themeClass="ppt-material-page"
    />
  );
}