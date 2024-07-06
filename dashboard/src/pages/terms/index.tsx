import { useEffect, useState } from "react";
import {
  PreviewComponent,
  Preview,
  Source,
  Highlight,
} from "../../base-components/PreviewComponent";
import { ClassicEditor } from "../../base-components/Ckeditor";
import { FormSwitch } from "../../base-components/Form";
import Button from "../../base-components/Button";
import { StateTerms } from "../../redux/stores/api/terms";
import { ActionUpdateTerms } from "../../redux/action/api/terms/update";
import { useAppDispatch , useAppSelector } from "../../redux/stores/hooks";
import { ActionGetTerms } from "../../redux/action/api/terms/get";


function Main() {
  const [editorData, setEditorData] = useState("");
  const [id, setid] = useState("");
  const state = useAppSelector(StateTerms)
  const dispatch = useAppDispatch()
  useEffect(()=>{
    dispatch(ActionGetTerms())
  },[])
  useEffect(()=>{
    if(state?.data?.data?.desc && state?.data?.data?._id){
      setEditorData(state.data.data.desc)
      setid(state.data.data._id)
    }
  },[JSON.stringify(state)])
  
return (
    <>
      <div className="flex items-center mt-8">
        <h2 className="mr-auto text-lg font-medium">Terms and condations</h2>
      </div>
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="col-span-12">
          <div className="p-5">
            <Preview>
              <ClassicEditor
                value={editorData}
                onChange={setEditorData}
              />
            </Preview>
            <Source>
              <Highlight>
                {`
              <ClassicEditor
                value={editorData}
                onChange={setEditorData}
              />
              `}
              </Highlight>
            </Source>
            <Button 
             
            className="w-24 my-2 mr-1" 
            disabled={!editorData.length} 
            onClick={()=>dispatch(ActionUpdateTerms({ formdata: {desc:editorData}, id: id }))}
            >
              update
            </Button>
          </div>

        </div>

        {/* END: Classic Editor */}
      </div>
    </>
  );
}

export default Main;
