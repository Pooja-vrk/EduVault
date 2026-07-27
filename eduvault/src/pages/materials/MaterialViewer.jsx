import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import axios from "axios";
import { toast } from "react-toastify";
import { renderAsync } from "docx-preview";

import {
  FaArrowLeft,
  FaDownload,
  FaFileAlt,
} from "react-icons/fa";

import "./MaterialViewer.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function MaterialViewer() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Container used by docx-preview
  const docxContainerRef = useRef(null);

  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewLoading, setPreviewLoading] =
    useState(false);
  const [previewError, setPreviewError] =
    useState("");

  /* =========================================
     FETCH MATERIAL
  ========================================= */

  useEffect(() => {
    const fetchMaterial = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          `${API_URL}/api/materials/all`
        );

        const materials = Array.isArray(response.data)
          ? response.data
          : [];

        const selectedMaterial = materials.find(
          (item) =>
            String(item._id || item.id) === String(id)
        );

        if (!selectedMaterial) {
          toast.error("Material not found");
          navigate("/materials");
          return;
        }

        setMaterial(selectedMaterial);
      } catch (error) {
        console.error(
          "Material viewer error:",
          error
        );

        toast.error("Failed to load material");
      } finally {
        setLoading(false);
      }
    };

    fetchMaterial();
  }, [id, navigate]);

  /* =========================================
     GET FILE NAME
  ========================================= */

  const getFileName = () => {
    return (
      material?.fileName ||
      material?.originalName ||
      material?.filename ||
      material?.name ||
      "Untitled File"
    );
  };

  /* =========================================
     GET FILE URL
  ========================================= */
const getFileUrl = () => {
  return (
    material?.filePath ||
    material?.fileUrl ||
    material?.url ||
    material?.path ||
    null
  );
};
  /* =========================================
     GET FILE EXTENSION
  ========================================= */

  const getExtension = () => {
    const fileName = getFileName();

    if (!fileName.includes(".")) {
      return "";
    }

    return (
      fileName
        .split(".")
        .pop()
        ?.toLowerCase() || ""
    );
  };

  const fileUrl = material
    ? getFileUrl()
    : null;

  const extension = material
    ? getExtension()
    : "";

  /* =========================================
     DOCX PREVIEW
  ========================================= */

  useEffect(() => {
    if (
      !material ||
      extension !== "docx" ||
      !fileUrl
    ) {
      return;
    }

    let cancelled = false;

    const renderDocxFile = async () => {
      try {
        setPreviewLoading(true);
        setPreviewError("");

        /*
          Download DOCX as binary data
        */

        const response = await axios.get(
          fileUrl,
          {
            responseType: "arraybuffer",
          }
        );

        if (
          cancelled ||
          !docxContainerRef.current
        ) {
          return;
        }

        /*
          Clear previous rendered document
        */

        docxContainerRef.current.innerHTML = "";

        /*
          Render DOCX inside React page
        */

        await renderAsync(
          response.data,
          docxContainerRef.current,
          null,
          {
            className: "docx",
            inWrapper: true,
            ignoreWidth: false,
            ignoreHeight: false,
            ignoreFonts: false,
            breakPages: true,
            ignoreLastRenderedPageBreak: true,
            experimental: false,
            trimXmlDeclaration: true,
            useBase64URL: false,
          }
        );
      } catch (error) {
        console.error(
          "DOCX preview error:",
          error
        );

        if (!cancelled) {
          setPreviewError(
            "Unable to preview this DOCX file."
          );

          toast.error(
            "Failed to load DOCX preview"
          );
        }
      } finally {
        if (!cancelled) {
          setPreviewLoading(false);
        }
      }
    };

    renderDocxFile();

    return () => {
      cancelled = true;
    };
  }, [material, extension, fileUrl]);

  /* =========================================
     DOWNLOAD FILE
  ========================================= */

  const handleDownload = async () => {
    if (!fileUrl) {
      toast.error("File URL not found");
      return;
    }

    try {
      /*
        Fetch file as Blob so the browser
        downloads instead of opening it.
      */

      const response = await axios.get(
        fileUrl,
        {
          responseType: "blob",
        }
      );

      const blobUrl =
        window.URL.createObjectURL(
          response.data
        );

      const link =
        document.createElement("a");

      link.href = blobUrl;
      link.download = getFileName();

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(
        blobUrl
      );
    } catch (error) {
      console.error(
        "Download error:",
        error
      );

      toast.error(
        "Failed to download file"
      );
    }
  };

  /* =========================================
     LOADING SCREEN
  ========================================= */

  if (loading) {
    return (
      <div className="viewer-loading">
        <div className="viewer-spinner"></div>

        <h2>
          Loading material...
        </h2>
      </div>
    );
  }

  if (!material) {
    return null;
  }

  /* =========================================
     FILE TYPES
  ========================================= */

  const imageTypes = [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "webp",
    "svg",
  ];

  const unsupportedTypes = [
    "doc",
    "ppt",
    "pptx",
    "xls",
    "xlsx",
  ];

  /* =========================================
     RENDER PREVIEW
  ========================================= */

  const renderPreview = () => {
    /*
      PDF
    */

    if (extension === "pdf" && fileUrl) {
      return (
        <iframe
          src={fileUrl}
          title={getFileName()}
          className="material-preview-frame"
        />
      );
    }

    /*
      TXT
    */

    if (extension === "txt" && fileUrl) {
      return (
        <iframe
          src={fileUrl}
          title={getFileName()}
          className="material-preview-frame"
        />
      );
    }

    /*
      IMAGES
    */

    if (
      imageTypes.includes(extension) &&
      fileUrl
    ) {
      return (
        <div className="image-preview-container">
          <img
            src={fileUrl}
            alt={getFileName()}
            className="material-image-preview"
          />
        </div>
      );
    }

    /*
      DOCX
    */

    if (extension === "docx") {
      return (
        <div className="docx-preview-wrapper">
          {previewLoading && (
            <div className="docx-preview-loading">
              <div className="viewer-spinner"></div>

              <h2>
                Preparing DOCX preview...
              </h2>
            </div>
          )}

          {previewError && (
            <div className="unsupported-preview">
              <FaFileAlt />

              <h2>
                Preview failed
              </h2>

              <p>
                {previewError}
              </p>

              <button
                type="button"
                onClick={handleDownload}
              >
                <FaDownload />
                Download File
              </button>
            </div>
          )}

          <div
            ref={docxContainerRef}
            className="docx-preview-container"
          />
        </div>
      );
    }

    /*
      PPT, PPTX, DOC, XLS, XLSX
    */

    if (
      unsupportedTypes.includes(extension)
    ) {
      return (
        <div className="unsupported-preview">
          <FaFileAlt />

          <h2>
            Preview not available yet
          </h2>

          <p>
            {extension.toUpperCase()} preview
            support has not been added yet.
            You can still download the file.
          </p>

          <button
            type="button"
            onClick={handleDownload}
          >
            <FaDownload />
            Download File
          </button>
        </div>
      );
    }

    /*
      UNKNOWN FILE TYPE
    */

    return (
      <div className="unsupported-preview">
        <FaFileAlt />

        <h2>
          Preview not available
        </h2>

        <p>
          This file type cannot currently be
          previewed inside EduVault.
        </p>

        <button
          type="button"
          onClick={handleDownload}
        >
          <FaDownload />
          Download File
        </button>
      </div>
    );
  };

  /* =========================================
     PAGE
  ========================================= */

  return (
    <div className="material-viewer-page">
      <div className="viewer-header">
        <button
          type="button"
          className="viewer-back-btn"
          onClick={() =>
            navigate("/materials")
          }
        >
          <FaArrowLeft />
          Back
        </button>

        <div className="viewer-file-info">
          <FaFileAlt />

          <div>
            <h1>
              {getFileName()}
            </h1>

            <p>
              {material.category}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="viewer-download-btn"
          onClick={handleDownload}
        >
          <FaDownload />
          Download
        </button>
      </div>

      <div className="viewer-content">
        {renderPreview()}
        
      </div>
    </div>
  );
}