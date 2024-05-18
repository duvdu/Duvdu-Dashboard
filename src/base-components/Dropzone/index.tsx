import React, { createRef, useEffect } from "react";
import DropzoneJs, { DropzoneOptions } from "dropzone";

export interface DropzoneElement extends HTMLDivElement {
  dropzone: DropzoneJs;
}

export interface DropzoneProps
  extends React.PropsWithChildren,
    React.ComponentPropsWithoutRef<"div"> {
  options: DropzoneOptions;
  getRef: (el: DropzoneElement) => void;
  onFileAdded?: (file: DropzoneJs.DropzoneFile) => void; // New prop
}

function Dropzone(props: DropzoneProps) {
  const fileUploadRef = createRef<DropzoneElement>();

  useEffect(() => {
    if (fileUploadRef.current) {
      props.getRef(fileUploadRef.current);
      const dropzoneInstance = new DropzoneJs(fileUploadRef.current, props.options);

      if (props.onFileAdded) {
        dropzoneInstance.on("addedfile", props.onFileAdded);
      }
    }
  }, [props.options, props.children]);

  const { options, getRef, onFileAdded, ...computedProps } = props;
  return (
    <div
      {...computedProps}
      ref={fileUploadRef}
      className="[&.dropzone]:border-2 [&.dropzone]:border-dashed dropzone [&.dropzone]:border-darkmode-200/60 [&.dropzone]:dark:bg-darkmode-600 [&.dropzone]:dark:border-white/5"
    >
      <div className="dz-message">{props.children}</div>
    </div>
  );
}

Dropzone.defaultProps = {
  options: {},
  getRef: () => {},
  onFileAdded: () => {}, // Default prop
};

export default Dropzone;
