import React, { useState, useEffect, useRef } from "react";
import { Dialog } from "../../base-components/Headless";
import Button from "../../base-components/Button";
import { useAppDispatch, useAppSelector } from "../../redux/stores/hooks";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FormInput,
  FormLabel,
} from "../../base-components/Form";
import { StateCreateCoupon } from "../../redux/stores/api/coupon/create";
import { StateGetCouponById } from "../../redux/stores/api/coupon/getById";
import { ActionCreateCoupon } from "../../redux/action/api/coupon/create";
import { StateGetAllCoupons } from "../../redux/stores/api/coupon/getAll";
import LoadingIcon from "../../base-components/LoadingIcon";

const Main: React.FC = () => {
  const dispatch = useAppDispatch();

  // Global states
  const stateCreateCoupon = useAppSelector(StateCreateCoupon);

  const [formValues, setFormValues] = useState({
    title: {
      en: "",
      ar: "",
    },
    promoCode: "",
    start: "",
    end: "",
    couponCount: "",
    userCount: "",
    percentage: "",
  });
  const [errors, setErrors] = useState<string | null>(null);
  const [openAddModel, setOpenAddModel] = useState(false);
  const sendButtonRef = useRef(null);

  // Form handlers
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };
  const validateForm = () => {
    let newErrors = null;
    if (!formValues.title.en) setErrors("English Title is required");
    if (!formValues.title.ar) setErrors("Arabic Title is required");
    if (!formValues.start) setErrors("Start Date is required");
    if (!formValues.end) setErrors("End Date is required");
    if (!formValues.couponCount) setErrors("Coupon Count is required");
    if (!formValues.userCount) setErrors("User Count is required");
    if (!formValues.percentage) setErrors("Percentage is required");
    if (!formValues.promoCode) setErrors("Promo Code is required");

    return newErrors === null;
  };

  const createCoupon = () => {
    if (validateForm()) {
      dispatch(ActionCreateCoupon({ formdata: formValues }));
      clear()
    }
  };
  const onSubmit = () => {
    createCoupon();
  };

    const clear = () => {
      setFormValues
        ({
            title: {
              en: "",
              ar: "",
            },
            promoCode: "",
            start: "",
            end: "",
            couponCount: "",
            userCount: "",
            percentage: "",
          });
          // setErrors({});
    };
  return (
    <>

      <div className="flex items-center mt-8">
        <h2 className="mr-auto text-lg font-medium">Add New Coupon</h2>
      </div>

      <div>
        <div className="grid grid-cols-2 gap-4 gap-y-2">
          <div className="col-span-2 grid grid-cols-12 gap-3">
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-1" className="font-bold">Coupon English</FormLabel>
              <FormInput
                id="modal-form-1"
                type="text"
                name="title[en]"
                onChange={(e)=>{
                    setFormValues({...formValues , title:{
                        ...formValues.title , 
                        en: e.target.value
                    }})
                }}
              />
            </div>
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-2" className="font-bold">Coupon Arabic</FormLabel>
              <FormInput
                id="modal-form-2"
                type="text"
                name="title[ar]"
                onChange={(e)=>{
                    setFormValues({...formValues , title:{
                        ...formValues.title , 
                        ar: e.target.value
                    }})
                }}
              />
            </div>
          </div>
          <div className="col-span-2 grid grid-cols-12 gap-3">
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-2" className="font-bold">Start</FormLabel>
              <FormInput
                id="modal-form-2"
                type="date"
                name="start"
                onChange={handleInputChange}
              />
            </div>
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-2" className="font-bold">End</FormLabel>
              <FormInput
                id="modal-form-2"
                type="date"
                name="end"
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="col-span-2 grid grid-cols-12 gap-3">
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-2" className="font-bold">Coupon Count</FormLabel>
              <FormInput
                id="modal-form-2"
                type="number"
                name="couponCount"
                onChange={handleInputChange}
              />
            </div>
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-2" className="font-bold">User Count</FormLabel>
              <FormInput
                id="modal-form-2"
                type="number"
                name="userCount"
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="col-span-2 grid grid-cols-12 gap-3">
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-2" className="font-bold">Percentage</FormLabel>
              <FormInput
                id="modal-form-2"
                type="text"
                name="percentage"
                onChange={handleInputChange}
              />
            </div>
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-2" className="font-bold">Promo Code</FormLabel>
              <FormInput
                id="modal-form-2"
                type="text"
                name="promoCode"
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
        {errors && <p className="text-danger text-center">{errors}</p>}
        <div className="pt-5">
          <Button
            onClick={onSubmit}
            variant="primary"
            type="button"
            className="w-20"
            ref={sendButtonRef}
          >
            {stateCreateCoupon?.loading ? (
              <LoadingIcon icon="puff" className="w-4 h-4 mr-1" />
            ) : (
              <>Add</>
            )}
          </Button>
        </div>
      </div>
    </>
  );
};

export default Main;
