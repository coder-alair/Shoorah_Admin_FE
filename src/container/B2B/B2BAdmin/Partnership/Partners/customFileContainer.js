import { useRef, useEffect, useState } from "react";
import { FaUpload, FaRegFileImage, FaRegFile } from "react-icons/fa";

export function CustomDragDrop({
  ownerLicense,
  onUpload,
  onDelete,
  count,
  formats
}) {
  const dropContainer = useRef(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef(null);

  function handleDrop(e, type) {
    let files;
    if (type === "inputFile") {
      files = e.target.files[0];
    } else {
      e.preventDefault();
      e.stopPropagation();
      setDragging(false);
      files = e.dataTransfer.files[0];
    }
    onUpload(files);
  }

  useEffect(() => {
    function handleDragOver(e) {
      e.preventDefault();
      e.stopPropagation();
      setDragging(true);
    }
    function handleDragLeave(e) {
      e.preventDefault();
      e.stopPropagation();
      setDragging(false);
    }
    dropContainer.current.addEventListener("dragover", handleDragOver);
    dropContainer.current.addEventListener("drop", handleDrop);
    dropContainer.current.addEventListener("dragleave", handleDragLeave);

    return () => {
      if (dropContainer.current) {
        dropContainer.current.removeEventListener("dragover", handleDragOver);
        dropContainer.current.removeEventListener("drop", handleDrop);
        dropContainer.current.removeEventListener("dragleave", handleDragLeave);
      }
    };
  }, [ownerLicense]);

  return (
    <>
      {/* Container Drop */}
      <div
        className={`${
          dragging
            ? "border border-[#2B92EC] bg-[#EDF2FF]"
            : "border-dashed border-[#e0e0e0]"
        } flex items-center justify-center mx-auto text-center border-2 rounded-md mt-4 py-5 dark:bg-shoorah-darkBgColor`}
        ref={dropContainer}
      >
        <div className="flex-1 flex flex-col">
          <div className="mx-auto text-gray-400 mb-2">
            <FaUpload size={18} />
          </div>
          <div className="text-[12px] font-normal text-gray-500">
            <input
              className="opacity-0 hidden"
              type="file"
              multiple
              accept="image/*"
              ref={fileRef}
              onChange={(e) => handleDrop(e, "inputFile")}
            />
            <span
              className="text-[#4070f4] cursor-pointer"
              onClick={() => {
                fileRef.current.click();
              }}
            >
              Click to upload
            </span>{" "}
            or drag and drop
          </div>
          <div className="text-[10px] font-normal text-gray-500">
            Only two files PNG, JPG or JPEG
          </div>
        </div>
      </div>

      {/* {ownerLicense.length > 0 && ( */}
        <div className="mt-4 grid grid-cols-2 gap-y-4 gap-x-4">
         
        </div>
      {/* )} */}
    </>
  );
}
