import React, { useState, useEffect, useRef } from 'react';
import { Dialog } from '../../base-components/Headless';
import Lucide from '../../base-components/Lucide';
import Button from '../../base-components/Button';
import { useAppDispatch, useAppSelector } from '../../redux/stores/hooks';
import { Link, useNavigate } from 'react-router-dom';
import { FormInput, FormLabel} from '../../base-components/Form';
import { StateCreateCoupon } from '../../redux/stores/api/coupon/create';
import { StateUpdateCoupon } from '../../redux/stores/api/coupon/update';
import { StateGetCouponById } from '../../redux/stores/api/coupon/getById';
import { ActionUpdateCoupon } from '../../redux/action/api/coupon/update';
import { ActionGetCoupons } from '../../redux/action/api/coupon/getAll';
import { StateGetAllCoupons } from '../../redux/stores/api/coupon/getAll';
import LoadingIcon from '../../base-components/LoadingIcon';

const Main: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Global states
  const stateUpdateCoupon = useAppSelector(StateUpdateCoupon);
  const stateGetCouponById = useAppSelector(StateGetCouponById);

  const [formValues, setFormValues] = useState({
    start:'',
    end: '' ,
    couponCount:'',
    userCount:'',
});
  const [errors, setErrors] = useState<string|null>(null);
  const [actionRankId, setActionRankId] = useState<string>('');
  const [coupons, setCoupons] = useState([]);
  const [openEditModel, setOpenEditModel] = useState(false);
  const sendButtonRef = useRef(null);
  useEffect(() => {
    if(stateUpdateCoupon?.data)
    dispatch(ActionGetCoupons())
      .then(response => {
        if (response.payload) {
          setCoupons(response.payload.data);
        }
      });
      setOpenEditModel(false)
  }, [ stateUpdateCoupon?.data]);

  useEffect(() => {
    dispatch(ActionGetCoupons())
    .then(response => {
      if (response.payload) {
        setCoupons(response.payload.data);
      }
    });

  }, []);
  // Form handlers
  const handleInputChange = (e:any) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };
  const onUpdate = () => {
    dispatch(ActionUpdateCoupon({formdata:formValues , id:actionRankId}));
  };

  return (
    <>
    
      {/* Edit Rank  */}
      <Dialog open={openEditModel} onClose={() => setOpenEditModel(false)} initialFocus={sendButtonRef}>
        <Dialog.Panel>
          <Dialog.Title>
            <h2 className="mr-auto text-base font-medium">Edit Coupon</h2>
          </Dialog.Title>
          <Dialog.Description className="grid grid-cols-6 gap-4 gap-y-3">
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-2">Start Date</FormLabel>
              <FormInput id="modal-form-2" type="date" name="start" defaultValue={formValues.start} onChange={handleInputChange} />
            </div>
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-2">End Date</FormLabel>
              <FormInput id="modal-form-2" type="date" name="end" defaultValue={formValues.end} onChange={handleInputChange} />
            </div>
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-2">Coupon Count</FormLabel>
              <FormInput id="modal-form-2" type="number" name="couponCount" defaultValue={formValues.couponCount} onChange={handleInputChange} />
            </div>
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-2">User Count</FormLabel>
              <FormInput id="modal-form-2" type="number" name="userCount" defaultValue={formValues.userCount} onChange={handleInputChange} />
            </div>
          </Dialog.Description>
            {errors && <p className="text-danger text-center">{errors}</p>}
          <Dialog.Footer>
            <Button type="button" variant="outline-secondary" onClick={() => setOpenEditModel(false)} className="w-20 mr-1">
              Cancel
            </Button>
            <Button onClick={onUpdate} variant="primary" type="button" className="w-20" ref={sendButtonRef}>
            {stateUpdateCoupon?.loading ? (
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


      <div className="flex items-center mt-8">
        <h2 className="mr-auto text-lg font-medium">coupons</h2>
      </div>
      <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
         
        <Link to='/add-coupon'>
            <Button variant="primary" className="mr-2 mb-2 shadow-md">
            Add New Coupon
            </Button>
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {coupons.map((coupon:any, index:number) => (
          <div key={index} className="flex flex-col m-1 gap-5 intro-y box px-3 py-5 relative">
            <div className='absolute bg-slate-800 top-0 right-0 rounded-bl-full text-white font-black px-3 py-1'>
                {coupon.percentage} %
            </div>
            <div className='grid grid-cols-2'>
                <div className='font-bold'>
                    Coupon Name English: <span className='font-normal'>
                        {coupon.title.en} 
                    </span>
                </div>
                <div className='font-bold'>
                    Start Date: <span className='font-normal'>
                        {new Date(coupon.start).toISOString().split('T')[0]} 
                    </span>
                </div>
            </div>
            <div className='grid grid-cols-2'>
                <div className='font-bold'>
                    Coupon Name Arabic: <span className='font-normal'>
                        {coupon.title.ar} 
                    </span>
                </div>

                <div className='font-bold'>
                    End Date: <span className='font-normal'>
                        {new Date(coupon.end).toISOString().split('T')[0]} 
                    </span>
                </div>
            </div>
            <div className='grid grid-cols-2'>
            <div className='font-bold'>
                 Coupon Count: <span className='font-normal'>
                     {coupon.couponCount} 
                </span>
            </div>

            <div className='font-bold'>
                 User Count: <span className='font-normal'>
                     {coupon.userCount} 
                </span>
            </div>
            
            </div>
            <div className='grid grid-cols-2'>
            <div className='flex items-center justify-between'>
              <div className='font-bold'>
                  Promo Code: <span className='font-normal'>
                      {coupon.promoCode} 
                  </span>
              </div>
            <Button className='cursor-pointer' onClick={ () => {navigator.clipboard.writeText(coupon.promoCode)}  }>
              <Lucide icon="Copy" className="w-4 h-4 mr-1" />
            </Button>
            
            </div>
            </div>
            <div className='flex coupon-between items-center'>
              <div
                className="flex items-center text-cyan-600 cursor-pointer"
                onClick={(event) => {
                  event.preventDefault();
                  setOpenEditModel(true);
                  setActionRankId(coupon._id)
                  setFormValues({
                    start:new Date(coupon.start).toISOString().split('T')[0],
                    end: new Date(coupon.end).toISOString().split('T')[0] ,
                    couponCount:coupon.couponCount,
                    userCount:coupon.userCount,
                 })
                }}
              >
                    <Lucide icon="Edit" className="w-4 h-4 mr-1" />Edit
              </div>
              
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Main;
