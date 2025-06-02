import React, { useState, useEffect, useRef } from 'react';
import { Dialog } from '../../../base-components/Headless';
import Lucide from '../../../base-components/Lucide';
import Button from '../../../base-components/Button';
import { useAppDispatch, useAppSelector } from '../../../redux/stores/hooks';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FormInput, FormLabel, FormSelect, FormSwitch } from '../../../base-components/Form';
import { StateGetComplaintById } from '../../../redux/stores/api/complaint/getById';
import { StateGetAllComplaints } from '../../../redux/stores/api/complaint/getAll';
import LoadingIcon from '../../../base-components/LoadingIcon';
import { ActionGetComplaints } from '../../../redux/action/api/complaint/getAll';
import { ActionGetComplaintById } from '../../../redux/action/api/complaint/getById';
import { ActionUpdateComplaints } from '../../../redux/action/api/complaint/update';
import { StateUpdateCompliant } from '../../../redux/stores/api/complaint/update';
const Main: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Global states
  const stateUpdateCompliant = useAppSelector(StateUpdateCompliant);
  const stateGetComplaintById = useAppSelector(StateGetComplaintById);
  const stateGetAllComplaints = useAppSelector(StateGetAllComplaints);
  // Local states
  const details = stateGetComplaintById?.data?.data || [];
  const [formValues, setFormValues] = useState({  feedback: '' });
  const [errors, setErrors] = useState<string|null>(null);
  const [actionComplaintId, setActionComplaintId] = useState<string>('');
  const [complaints, setComplaints] = useState([]);
  const [openEditModel, setOpenEditModel] = useState(false);
  const sendButtonRef = useRef(null);
  // Load complaint details
  useEffect(() => {
    if( stateUpdateCompliant?.data){
      dispatch(ActionGetComplaints())
        .then(response => {
          if (response.payload) {
            setComplaints(response.payload.data);
          }
        });
        setOpenEditModel(false)
    }
  }, [ stateUpdateCompliant?.data]);
  useEffect(() => {
    dispatch(ActionGetComplaints())
    .then(response => {
      if (response.payload) {
        setComplaints(response.payload.data);
      }
    });

  }, []);

  // Form handlers
  const handleInputChange = (e:any) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const onUpdate = () => {
    dispatch(ActionUpdateComplaints({ feedback:formValues.feedback , complaintId: actionComplaintId }));
  };

  const clear = () => {
    setFormValues({ feedback: '' });
  };
  const handleUpdateRank = (rankId: string, rank:string, actionCount: number|string) => {
    // setActionComplaintId(rankId);
    // updateRank(rankId, rank ,actionCount );
  };

  return (
    <>
    
      {/* Edit Rank  */}
      <Dialog open={openEditModel} onClose={() => setOpenEditModel(false)} initialFocus={sendButtonRef}>
        <Dialog.Panel>
          <Dialog.Title>
            <h2 className="mr-auto text-base font-medium">Feedback</h2>
          </Dialog.Title>
          <Dialog.Description className="grid grid-cols-6 gap-4 gap-y-3">
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-1">Feedback</FormLabel>
              <FormInput id="modal-form-1" type="text" name="feedback" defaultValue={formValues.feedback} onChange={handleInputChange} />
            </div>
          </Dialog.Description>
            {errors && <p className="text-danger text-center">{errors}</p>}
          <Dialog.Footer>
            <Button type="button" variant="outline-secondary" onClick={() => setOpenEditModel(false)} className="w-20 mr-1">
              Cancel
            </Button>
            <Button onClick={onUpdate} variant="primary" type="button" className="w-20" ref={sendButtonRef}>
            { stateUpdateCompliant?.loading 
                ? (
                  <LoadingIcon icon="puff" className="w-4 h-4 mr-1" />
                ) : (
              'Feedback'
            )}
            </Button>
          </Dialog.Footer>
        </Dialog.Panel>
      </Dialog>


      <div className="flex items-center mt-8">
        <h2 className="mr-auto text-lg font-medium">Complaints</h2>
      </div>
      <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
        <div className="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0 hidden">
          <div className="relative w-56 text-slate-500">
            <FormInput type="text" className="w-56 pr-10 !box" placeholder="Search..." />
            <Lucide icon="Search" className="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3">
        {complaints.map((complaint:any, index:number) => (
            <div key={index} className="flex flex-col m-1 gap-5 intro-y box px-3 py-5">
              <div className="flex items-center justify-between lg:flex-row">
                <div className='flex items-center justify-between'>
                  <div className="w-24 h-24 lg:w-12 lg:h-12 image-fit lg:mr-1">
                    <img
                      alt="DuvDu Admin DashBoard"
                      className="rounded-full"
                      src={complaint.reporter.profileImage}
                    />
                  </div>
                  <div className="mt-3 text-center lg:ml-2 lg:mr-auto lg:text-left lg:mt-0">
                    <a href="" className="font-medium">
                      {complaint.reporter.name}
                    </a>
                  </div>
                </div>
                <div className='font-medium border px-2 py-1 rounded-md'>
                  {complaint.ref}
                </div>
              </div>
              <div className="text-xl font-medium">{complaint.desc}</div>
              <div className="mt-2 font-black text-slate-500">
                {complaint.state.feedback}
              </div>
            {/* <div className='flex justify-between items-center'>
              <Link
                className="flex items-center text-danger"
                to="#"
                onClick={(event) => {
                  event.preventDefault();
                  setOpenEditModel(true);
                  setActionComplaintId(complaint._id)
                  setFormValues({ feedback:complaint.state.feedback})
                }}
              >
                  <>
                    <Lucide icon="Edit" className="w-4 h-4 mr-1" /> Feedback
                  </>
              </Link>
            </div> */}
          </div>
        ))}
      </div>
    </>
  );
};

export default Main;
