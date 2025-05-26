import { useEffect, useState } from "react";
import { Preview } from "../../base-components/PreviewComponent";
import { ClassicEditor } from "../../base-components/Ckeditor";
import Button from "../../base-components/Button";
import { StateTerms } from "../../redux/stores/api/terms";
import { ActionUpdateTerms } from "../../redux/action/api/terms/update";
import { useAppDispatch, useAppSelector } from "../../redux/stores/hooks";
import { ActionGetTerms } from "../../redux/action/api/terms/get";

function Main() {
  const [tab, setTab] = useState("terms");
  const [langTab, setLangTab] = useState<"en" | "ar">("en");
  const [isLoading, setIsLoading] = useState(false);

  const [editorState, setEditorState] = useState<{
    desc: { en: string; ar: string };
    refundPolicy: { en: string; ar: string };
    privacyPolicy: { en: string; ar: string };
  }>({
    desc: { en: "", ar: "" },
    refundPolicy: { en: "", ar: "" },
    privacyPolicy: { en: "", ar: "" },
  });

  const [id, setId] = useState("");
  const state = useAppSelector(StateTerms);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(ActionGetTerms());
  }, []);

  useEffect(() => {
    const data = state?.data?.data;
    if (data && data._id) {
      setEditorState({
        desc: {
          en: data.desc?.en || "",
          ar: data.desc?.ar || "",
        },
        refundPolicy: {
          en: data.refundPolicy?.en || "",
          ar: data.refundPolicy?.ar || "",
        },
        privacyPolicy: {
          en: data.privacyPolicy?.en || "",
          ar: data.privacyPolicy?.ar || "",
        },
      });
      setId(data._id);
    }
  }, [state?.data?.data]);

  const handleUpdate = async () => {
    try {
      setIsLoading(true);
      await dispatch(
        ActionUpdateTerms({
          formdata: editorState,
          id,
        })
      ).unwrap();
    } catch (error) {
      console.error("Update failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditorChange = (
    key: "desc" | "refundPolicy" | "privacyPolicy",
    lang: "en" | "ar",
    value: string
  ) => {
    setEditorState((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [lang]: value,
      },
    }));
  };

  const renderEditor = (key: "desc" | "refundPolicy" | "privacyPolicy") => (
    <>
      <div className="flex gap-4 border-b mb-4">
        <button
          onClick={() => setLangTab("en")}
          className={`pb-2 border-b-2 ${
            langTab === "en"
              ? "!border-primary text-primary"
              : "border-transparent text-gray-500"
          }`}
        >
          English
        </button>
        <button
          onClick={() => setLangTab("ar")}
          className={`pb-2 border-b-2 ${
            langTab === "ar"
              ? "!border-primary text-primary"
              : "border-transparent text-gray-500"
          }`}
        >
          Arabic
        </button>
      </div>

      <Preview>
        <ClassicEditor
          value={editorState[key][langTab]}
          onChange={(val) => handleEditorChange(key, langTab, val)}
        />
      </Preview>
    </>
  );

  return (
    <>
      <div className="flex items-center justify-between mt-8 mb-4">
        <h2 className="text-lg font-medium">Legal Documents Management</h2>
        <Button className="w-24 flex items-center justify-center" onClick={handleUpdate} disabled={isLoading}>
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            "Update"
          )}
        </Button>
      </div>

      {/* TabBar for Sections */}
      <div className="flex gap-4 border-b mb-6">
        <button
          onClick={() => setTab("terms")}
          className={`pb-2 border-b-2 ${
            tab === "terms"
              ? "!border-primary text-primary"
              : "border-transparent text-gray-500"
          }`}
        >
          Terms & Conditions
        </button>
        <button
          onClick={() => setTab("refund")}
          className={`pb-2 border-b-2 ${
            tab === "refund"
              ? "!border-primary text-primary"
              : "border-transparent text-gray-500"
          }`}
        >
          Refund Policy
        </button>
        <button
          onClick={() => setTab("privacy")}
          className={`pb-2 border-b-2 ${
            tab === "privacy"
              ? "!border-primary text-primary"
              : "border-transparent text-gray-500"
          }`}
        >
          Privacy Policy
        </button>
      </div>

      <div className="p-5">
        {tab === "terms" && renderEditor("desc")}
        {tab === "refund" && renderEditor("refundPolicy")}
        {tab === "privacy" && renderEditor("privacyPolicy")}
      </div>
    </>
  );
}

export default Main;
