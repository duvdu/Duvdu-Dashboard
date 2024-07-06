import React, { useState, useEffect, useRef } from 'react';
import { Dialog } from '../../base-components/Headless';
import Lucide from '../../base-components/Lucide';
import Button from '../../base-components/Button';
import { useAppDispatch, useAppSelector } from '../../redux/stores/hooks';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { StateGetAllRole } from '../../redux/stores/api/roles/getAll';
import { FormInput, FormLabel, FormSelect, FormSwitch } from '../../base-components/Form';
import { StateCreateplan } from '../../redux/stores/api/plan/create';
import { StateUpdatePlan } from '../../redux/stores/api/plan/update';
import { StateGetPlanById } from '../../redux/stores/api/plan/getById';
import { StateDeletePlan } from '../../redux/stores/api/plan/delete';
import { ActionCreatePlan } from '../../redux/action/api/plan/create';
import { ActionUpdatePlan } from '../../redux/action/api/plan/update';
import { ActionGetPlans } from '../../redux/action/api/plan/getAll';
import { ActionDeletePlan } from '../../redux/action/api/plan/delete';
import { ActionGetPlanById } from '../../redux/action/api/plan/getById';
import { ActionGetRoles } from '../../redux/action/api/role/getAll';
import { StateGetAllPlan } from '../../redux/stores/api/plan/getAll';
import LoadingIcon from '../../base-components/LoadingIcon';

const Main: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Global states
  const stateUpdatePlan = useAppSelector(StateUpdatePlan);
  const stateCreatePlan = useAppSelector(StateCreateplan);
  const stateGetPlanById = useAppSelector(StateGetPlanById);
  const stateDeletePlan = useAppSelector(StateDeletePlan);
  const stateGetAllRole = useAppSelector(StateGetAllRole);
  const stateGetAllPlan = useAppSelector(StateGetAllPlan);


  // Local states
  const roles = stateGetAllRole?.data?.data || [];
  // const plans = new Array(10).fill(null); // Create an array with 10 elements
  const details = stateGetPlanById?.data?.data || [];

  const [formValues, setFormValues] = useState({ key: '', title: '', role: '' });
  const [errors, setErrors] = useState(null);
  const [actionPlanId, setActionPlanId] = useState<string | null>(null);
  const [status, setStatus] = useState(false);
  const [plans, setPlans] = useState([]);
  const [deleteModalPreview, setDeleteModalPreview] = useState(false);
  const [headerFooterModalPreview, setHeaderFooterModalPreview] = useState(false);
  const sendButtonRef = useRef(null);
  const deleteButtonRef = useRef(null);
  // Load plans and plan details

  useEffect(() => {
    if(stateDeletePlan.data|| stateCreatePlan.data|| stateUpdatePlan.data)
    dispatch(ActionGetPlans())
      .then(response => {
        if (response.payload) {
          setPlans(response.payload.data);
        }
      });
  }, [stateDeletePlan.data, stateCreatePlan.data, stateUpdatePlan.data]);

  useEffect(() => {
    dispatch(ActionGetRoles());
  }, []);


  useEffect(() => {
    if(headerFooterModalPreview == false){
      setFormValues({ key: '', title: '', role: '' });
      setErrors({});
    }
  }, [headerFooterModalPreview]);

  // useEffect(() => {
  //   if(stateDeletePlan|| stateCreatePlan|| stateUpdatePlan){
  //   dispatch(ActionGetPlans());
  //   setHeaderFooterModalPreview(false)}
  // }, [stateDeletePlan, stateCreatePlan, stateUpdatePlan]);

  // useEffect(() => {
  //   if (id) {
  //     dispatch(ActionGetPlanById(id));
  //   }
  // }, [id]);

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const validateForm = () => {
    const newErrors = null;

    if (!formValues.key) newErrors.key = 'Key is required';
    if (!formValues.title) newErrors.title = 'Title is required';
    if (!formValues.role) newErrors.role = 'Role is required';

    setErrors(newErrors);

    // If there are no errors, return true
    return Object.keys(newErrors).length === 0;
  };

  const createPlan = () => {
    if (validateForm()) {
      dispatch(ActionCreatePlan(formValues));
    }
  };

  const updatePlan = (id: string, currentStatus: boolean) => {
    dispatch(ActionUpdatePlan({ ...formValues, roleId: id, status: currentStatus }));
  };

  const deletePlan = () => {
    if (actionPlanId)
      dispatch(ActionDeletePlan(actionPlanId));
  };

  const onSubmit = () => {
    createPlan();
  };

  const onDelete = () => {
    setDeleteModalPreview(false);
    deletePlan();
    clear();
  };

  const goToMainPlan = () => {
    navigate('/plan');
    clear();
  };

  const clear = () => {
    setFormValues({ key: '', title: '', role: '' });
  };
  const handleStatusChange = (planId: string, currentStatus: boolean) => {
    setActionPlanId(planId);
    updatePlan(planId, !currentStatus);
  };

  return (
    <>
      <Dialog open={headerFooterModalPreview} onClose={() => setHeaderFooterModalPreview(false)} initialFocus={sendButtonRef}>
        <Dialog.Panel>
          <Dialog.Title>
            <h2 className="mr-auto text-base font-medium">Add New Plan</h2>
          </Dialog.Title>
          <Dialog.Description className="grid grid-cols-6 gap-4 gap-y-3">
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-1">Title</FormLabel>
              <FormInput id="modal-form-1" type="text" name="key" value={formValues.key} onChange={handleInputChange} />
              {errors?.key && <p className="text-danger">{errors.key}</p>}
            </div>
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-2">Description</FormLabel>
              <FormInput id="modal-form-2" type="text" name="title" value={formValues.title} onChange={handleInputChange} />
              {errors?.title && <p className="text-danger">{errors.title}</p>}
            </div>
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-6">Roles</FormLabel>
              <FormSelect id="modal-form-6" name="role" value={formValues.role} onChange={handleInputChange}>
                <option value="" disabled>(select role)</option>
                {roles.map(role => (
                  <option key={role._id} value={role._id}>{role.key}</option>
                ))}
              </FormSelect>
              {errors?.role && <p className="text-danger">{errors.role}</p>}
            </div>
          </Dialog.Description>
          <Dialog.Footer>
            <Button type="button" variant="outline-secondary" onClick={() => setHeaderFooterModalPreview(false)} className="w-20 mr-1">
              Cancel
            </Button>
            <Button onClick={onSubmit} variant="primary" type="button" className="w-20" ref={sendButtonRef}>
              Add
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
        <h2 className="mr-auto text-lg font-medium">Plans</h2>
      </div>
      <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
        <Button onClick={() => setHeaderFooterModalPreview(true)} variant="primary" className="mr-2 mb-2 shadow-md">
          Add New Plan
          {
            stateCreatePlan.loading &&
            <LoadingIcon icon="puff" className="ml-3" />
          }
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
        {plans.map((plan, index) => (
          <div key={index} className="flex flex-col m-1 intro-y box lg:flex-row">
            <div className="flex-1 px-5 py-16 intro-y">
              <Lucide icon="CreditCard" className="block w-12 h-12 mx-auto text-primary" />
              <div className="mt-10 text-xl font-medium text-center">{plan.key}</div>
              <div className="mt-5 text-center text-slate-600 dark:text-slate-500 hidden">
                1 Domain <span className="mx-1">•</span> 10 Users <span className="mx-1">•</span> 20 Copies
              </div>
              <div className="px-10 mx-auto mt-2 text-center text-slate-500">
                {plan.title}
              </div>
              <div className="px-4 py-3 mx-auto mt-8 flex justify-center items-center gap-3 whitespace-nowrap h-14">
                <div className='flex flex-col justify-end h-full'>
                  <label>Active Status</label>
                </div>
                <div className='flex flex-col justify-center h-full'>
                  {actionPlanId === plan._id && stateUpdatePlan.loading ? (
                    <LoadingIcon icon="puff" className="ml-3" />
                  ) : (
                    <FormSwitch className="mt-2">
                      <FormSwitch.Input checked={plan.status} type="checkbox" onChange={() => handleStatusChange(plan._id, plan.status)} />
                    </FormSwitch>
                  )}
                </div>
              </div>
              <Button variant="primary" rounded type="button" className="block px-4 py-3 mx-auto mt-8 hidden">
                PURCHASE NOW
              </Button>
              <Link
                className="flex items-center text-danger"
                to="#"
                onClick={(event) => {
                  event.preventDefault();
                  setDeleteModalPreview(true);
                  setActionPlanId(plan._id)
                }}
              >
                {actionPlanId === plan._id && stateDeletePlan.loading ? (
                  <LoadingIcon icon="puff" className="w-4 h-4 mr-1" />
                ) : (
                  <>
                    <Lucide icon="Trash2" className="w-4 h-4 mr-1" /> Delete
                  </>
                )}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Main;
