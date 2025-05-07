import { useEffect, useState } from "react";
import {
  PreviewComponent,
  Preview,
  Source,
  Highlight,
} from "../../base-components/PreviewComponent";
import { ClassicEditor } from "../../base-components/Ckeditor";
import Button from "../../base-components/Button";
import { StateTerms } from "../../redux/stores/api/terms";
import { ActionUpdateTerms } from "../../redux/action/api/terms/update";
import { useAppDispatch, useAppSelector } from "../../redux/stores/hooks";
import { ActionGetTerms } from "../../redux/action/api/terms/get";

function Main() {
  const [editorDataEn, setEditorDataEn] = useState("");
  const [editorDataAr, setEditorDataAr] = useState("");
  const [id, setId] = useState("");
  const state = useAppSelector(StateTerms);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(ActionGetTerms());
  }, []);

  useEffect(() => {
    if (state?.data?.data?.desc && state?.data?.data?._id) {
      setEditorDataEn(state.data.data.desc.en || "");
      setEditorDataAr(state.data.data.desc.ar || "");
      setId(state.data.data._id);
    }
  }, [state?.data?.data?.desc, state?.data?.data?._id]);

  const handleUpdate = () => {
    dispatch(
      ActionUpdateTerms({
        formdata: {
          desc: {
            en: editorDataEn,
            ar: editorDataAr,
          },
        },
        id: id,
      })
    );
  };

  return (
    <>
      <div className="flex items-center mt-8">
        <h2 className="mr-auto text-lg font-medium">Terms and Conditions</h2>
      </div>
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="col-span-12">
          <div className="p-5">
            <h3 className="mb-2 font-semibold">English Content</h3>
            <Preview>
              <ClassicEditor value={editorDataEn} onChange={setEditorDataEn} />
            </Preview>

            <h3 className="mt-5 mb-2 font-semibold">Arabic Content</h3>
            <Preview>
              <ClassicEditor value={editorDataAr} onChange={setEditorDataAr} />
            </Preview>

            <Button
              className="w-24 my-4"
              disabled={!editorDataEn.length && !editorDataAr.length}
              onClick={handleUpdate}
            >
              Update
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Main;
