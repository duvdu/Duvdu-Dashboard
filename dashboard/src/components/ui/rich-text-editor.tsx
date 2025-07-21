import { Editor } from "@tinymce/tinymce-react";
import { forwardRef } from "react";

// Import TinyMCE
import "tinymce/tinymce";

// Import the default icons
import "tinymce/icons/default";

// Import themes
import "tinymce/themes/silver";

// Import plugins
import "tinymce/plugins/advlist";
import "tinymce/plugins/anchor";
import "tinymce/plugins/autolink";
import "tinymce/plugins/charmap";
import "tinymce/plugins/code";
import "tinymce/plugins/fullscreen";
import "tinymce/plugins/image";
import "tinymce/plugins/insertdatetime";
import "tinymce/plugins/link";
import "tinymce/plugins/lists";
import "tinymce/plugins/media";
import "tinymce/plugins/preview";
import "tinymce/plugins/searchreplace";
import "tinymce/plugins/table";
import "tinymce/plugins/visualblocks";
import "tinymce/plugins/wordcount";

// Import skin and model
import "tinymce/models/dom";
import "tinymce/skins/ui/oxide/skin.min.css";

export interface RichTextEditorProps {
  value?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  disabled?: boolean;
  height?: number | string;
}

export const RichTextEditor = forwardRef<any, RichTextEditorProps>(
  ({ value, onChange, placeholder, disabled, height = 500 }, ref) => {
    return (
      <Editor
        ref={ref}
        value={value}
        disabled={disabled}
        init={{
          height,
          menubar: false,
          skin: false,
          content_css: false,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "wordcount",
          ],
          toolbar:
            "undo redo | blocks fontsize | " +
            "bold italic forecolor backcolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "link image media | removeformat ",
          fontsize_formats:
            "8pt 10pt 12pt 14pt 16pt 18pt 20pt 24pt 28pt 32pt 36pt 48pt 60pt 72pt",
          image_title: true,
          automatic_uploads: true,
          file_picker_types: "image",
          file_picker_callback: function (callback, value, meta) {
            if (meta.filetype === "image") {
              const input = document.createElement("input");
              input.setAttribute("type", "file");
              input.setAttribute("accept", "image/*");

              input.onchange = function (this: HTMLInputElement) {
                const file = this.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = function (e) {
                    callback(e.target?.result as string, {
                      alt: file.name,
                    });
                  };
                  reader.readAsDataURL(file);
                }
              };

              input.click();
            }
          },
          content_style:
            "body { font-family: -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif; font-size: 14px; margin: 1rem; }",
          placeholder,
          branding: false,
          promotion: false,
        }}
        onEditorChange={(content) => {
          onChange?.(content);
        }}
      />
    );
  }
);

RichTextEditor.displayName = "RichTextEditor";
