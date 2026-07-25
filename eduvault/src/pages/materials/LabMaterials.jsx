import { FaFlask } from "react-icons/fa";
import MaterialListPage from "./MaterialListPage";

export default function LabMaterials() {
  return (
    <MaterialListPage
      title="Lab Manual Materials"
      category="Lab Manual Materials"
      description="Access laboratory manuals, experiments, practical records and essential lab resources."
      icon={<FaFlask />}
      themeClass="lab-material-page"
    />
  );
}