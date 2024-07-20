import React, { useState, useEffect, useRef } from 'react';
import { Dialog } from '../../base-components/Headless';
import Lucide from '../../base-components/Lucide';
import Button from '../../base-components/Button';
import { useAppDispatch, useAppSelector } from '../../redux/stores/hooks';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FormInput, FormLabel, FormSelect, FormSwitch } from '../../base-components/Form';
import { StateCreateRank } from '../../redux/stores/api/rank/create';
import { StateUpdateRank } from '../../redux/stores/api/rank/update';
import { StateGetRankById } from '../../redux/stores/api/rank/getById';
import { StateDeleteRank } from '../../redux/stores/api/rank/delete';
import { ActionCreateRank } from '../../redux/action/api/rank/create';
import { ActionUpdateRank } from '../../redux/action/api/rank/update';
import { ActionGetRanks } from '../../redux/action/api/rank/getAll';
import { ActionDeleteRank } from '../../redux/action/api/rank/delete';
import { ActionGetRankById } from '../../redux/action/api/rank/getById';
import { StateGetAllRanks } from '../../redux/stores/api/rank/getAll';
import LoadingIcon from '../../base-components/LoadingIcon';

const Main: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Global states
  const stateUpdateRank = useAppSelector(StateUpdateRank);
  const stateCreateRank = useAppSelector(StateCreateRank);
  const stateGetRankById = useAppSelector(StateGetRankById);
  const stateDeleteRank = useAppSelector(StateDeleteRank);
  const stateGetAllRanks = useAppSelector(StateGetAllRanks);
  // Local states
  const details = stateGetRankById?.data?.data || [];

  const [formValues, setFormValues] = useState({ rank: '', actionCount: '' , color:'' });
  const [errors, setErrors] = useState<string|null>(null);
  const [actionRankId, setActionRankId] = useState<string>('');
  const [status, setStatus] = useState(false);
  const [ranks, setRanks] = useState([]);
  const [deleteModalPreview, setDeleteModalPreview] = useState(false);
  const [openAddModel, setOpenAddModel] = useState(false);
  const [openEditModel, setOpenEditModel] = useState(false);
  const sendButtonRef = useRef(null);
  const deleteButtonRef = useRef(null);
  // Load ranks details
  useEffect(() => {
    if(stateDeleteRank?.data|| stateCreateRank?.data|| stateUpdateRank?.data)
    dispatch(ActionGetRanks())
      .then(response => {
        if (response.payload) {
          setRanks(response.payload.data);
        }
      });
      setOpenAddModel(false)
      setOpenEditModel(false)
  }, [stateDeleteRank?.data, stateCreateRank?.data, stateUpdateRank?.data]);

  useEffect(() => {
    dispatch(ActionGetRanks())
    .then(response => {
      if (response.payload) {
        setRanks(response.payload.data);
      }
    });

  }, []);


  useEffect(() => {
    if(openAddModel == false){
      setFormValues({rank: '', actionCount: '' , color:'' });
      // setErrors({});
    }
  }, [openAddModel]);
  // Form handlers
  const handleInputChange = (e:any) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const validateForm = () => {
    let newErrors = null;
    if (!formValues.rank) setErrors('Rank is required');
    if (!formValues.actionCount) setErrors('Action Count is required');
    if (!formValues.color) setErrors('Color is required');

    return newErrors === null;
  };

  const createRank = () => {
    if (validateForm()) {      
      dispatch(ActionCreateRank(formValues));
    }
  };
  const onUpdate = () => {
    dispatch(ActionUpdateRank({ rank:formValues.rank , actionCount:formValues.actionCount,color:formValues.color, rankId: actionRankId }));
  };

  const deleteRank = () => {
    if (actionRankId)
      dispatch(ActionDeleteRank(actionRankId));
  };

  const onSubmit = () => {
    createRank();
  };

  const onDelete = () => {
    setDeleteModalPreview(false);
    deleteRank();
    clear();
  };

  const clear = () => {
    setFormValues({ rank: '', actionCount: '' , color:''});
  };
  return (
    <>
     {/* Add Rank */}
      <Dialog open={openAddModel} onClose={() => setOpenAddModel(false)} initialFocus={sendButtonRef}>
        <Dialog.Panel>
          <Dialog.Title>
            <h2 className="mr-auto text-base font-medium">Add New Rank</h2>
          </Dialog.Title>
          <Dialog.Description className="grid grid-cols-6 gap-4 gap-y-3">
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-1">Rank</FormLabel>
              <FormInput id="modal-form-1" type="text" name="rank" value={formValues.rank} onChange={handleInputChange} />
            </div>
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-2">Count</FormLabel>
              <FormInput id="modal-form-2" type="number" name="actionCount" value={formValues.actionCount} onChange={handleInputChange} />
            </div>
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-2">Color</FormLabel>
              <FormInput id="modal-form-2" type="color" name="color" value={formValues.color} onChange={handleInputChange} />
            </div>
          </Dialog.Description>
            {errors && <p className="text-danger text-center">{errors}</p>}
          <Dialog.Footer>
            <Button type="button" variant="outline-secondary" onClick={() => setOpenAddModel(false)} className="w-20 mr-1">
              Cancel
            </Button>
            <Button onClick={onSubmit} variant="primary" type="button" className="w-20" ref={sendButtonRef}>
            {stateCreateRank?.loading ? (
                  <LoadingIcon icon="puff" className="w-4 h-4 mr-1" />
                ) : (
                  <>
              Add
              </>
              )}
            </Button>
          </Dialog.Footer>
        </Dialog.Panel>
      </Dialog>
    
      {/* Edit Rank  */}
      <Dialog open={openEditModel} onClose={() => setOpenEditModel(false)} initialFocus={sendButtonRef}>
        <Dialog.Panel>
          <Dialog.Title>
            <h2 className="mr-auto text-base font-medium">Edit Rank</h2>
          </Dialog.Title>
          <Dialog.Description className="grid grid-cols-6 gap-4 gap-y-3">
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-1">Rank</FormLabel>
              <FormInput id="modal-form-1" type="text" name="rank" defaultValue={formValues.rank} onChange={handleInputChange} />
            </div>
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-2">Count</FormLabel>
              <FormInput id="modal-form-2" type="number" name="actionCount" defaultValue={formValues.actionCount} onChange={handleInputChange} />
            </div>
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-2">Color</FormLabel>
              <FormInput id="modal-form-2" type="color" name="color" defaultValue={formValues.color} onChange={handleInputChange} />
            </div>
          </Dialog.Description>
            {errors && <p className="text-danger text-center">{errors}</p>}
          <Dialog.Footer>
            <Button type="button" variant="outline-secondary" onClick={() => setOpenEditModel(false)} className="w-20 mr-1">
              Cancel
            </Button>
            <Button onClick={onUpdate} variant="primary" type="button" className="w-20" ref={sendButtonRef}>
            {stateUpdateRank?.loading ? (
                  <LoadingIcon icon="puff" className="w-4 h-4 mr-1" />
                ) : (
                  <>
              Edit
              </>
            )}
            </Button>
          </Dialog.Footer>
        </Dialog.Panel>
      </Dialog>

      <Dialog open={deleteModalPreview} onClose={() => setDeleteModalPreview(false)} initialFocus={deleteButtonRef}>
        <Dialog.Panel>
          <div className="p-5 text-center">
            <Lucide icon="XCircle" className="w-16 h-16 mx-auto mt-3 text-danger" />
            <div className="mt-5 text-3xl">Are you sure?</div>
            <div className="mt-2 text-slate-500">
              Do you really want to delete these records? <br />
              This process cannot be undone.
            </div>
          </div>
          <div className="px-5 pb-8 text-center">
            <Button type="button" variant="outline-secondary" onClick={() => setDeleteModalPreview(false)} className="w-24 mr-1">
              Cancel
            </Button>
            <Button type="button" variant="danger" className="w-24" ref={deleteButtonRef} onClick={onDelete}>
              Delete
            </Button>
          </div>
        </Dialog.Panel>
      </Dialog>

      <div className="flex items-center mt-8">
        <h2 className="mr-auto text-lg font-medium">Ranks</h2>
      </div>
      <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
        <Button onClick={() => {
          setOpenAddModel(true)
          clear();
          }} variant="primary" className="mr-2 mb-2 shadow-md">
          Add New Rank
        </Button>
        <div className="hidden mx-auto md:block text-slate-500 md:hidden">
          Showing 1 to 10 of 150 entries
        </div>
        <div className="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0 hidden">
          <div className="relative w-56 text-slate-500">
            <FormInput type="text" className="w-56 pr-10 !box" placeholder="Search..." />
            <Lucide icon="Search" className="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3">
        {ranks.map((rank:any, index:number) => (
          <div key={index} style={{
            borderColor: rank.color ?? 'white',
            border:`solid 1px ${rank.color?? 'white'} `
          }} className="flex flex-col m-1 gap-5 intro-y box px-3 py-5">
            <div className="flex justify-between items-center">
              <div style={{
                color:rank.color
              }}
              className="mt-2 font-black ">
                {rank.rank}
              </div>
              <div style={{
                color:rank.color
              }}
              className="text-xl font-medium text-center ">{rank.actionCount}</div>
            </div>
            <div className='flex justify-between items-center'>
              <Link
                className="flex items-center text-danger"
                to="#"
                onClick={(event) => {
                  event.preventDefault();
                  setDeleteModalPreview(true);
                  setActionRankId(rank._id)
                }}
              >
                {actionRankId === rank._id && stateDeleteRank?.loading ? (
                  <LoadingIcon icon="puff" className="w-4 h-4 mr-1" />
                ) : (
                  <>
                    <Lucide icon="Trash2" className="w-4 h-4 mr-1" /> Delete
                  </>
                )}
              </Link>
              <Link
                className="flex items-center text-cyan-600"
                to="#"
                onClick={(event) => {
                  event.preventDefault();
                  setOpenEditModel(true);
                  setActionRankId(rank._id)
                  setFormValues({rank:rank.rank , actionCount:rank.actionCount , color:rank.color})
                }}
              >
                    <Lucide icon="Trash2" className="w-4 h-4 mr-1" /> Edit
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Main;
