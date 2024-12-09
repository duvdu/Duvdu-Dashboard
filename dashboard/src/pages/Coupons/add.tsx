import React, { useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/stores/hooks";
import Button from "../../base-components/Button";
import {
  FormInput,
  FormLabel,
} from "../../base-components/Form";
import { ActionCreateCoupon } from "../../redux/action/api/coupon/create";
import LoadingIcon from "../../base-components/LoadingIcon";
import { StateCreateCoupon } from "../../redux/stores/api/coupon/create";

const Main: React.FC = () => {
  const dispatch = useAppDispatch();

  // Global states
  const [type, setType] = useState<'percentage' | 'value'>('percentage');
  const stateCreateCoupon = useAppSelector(StateCreateCoupon);
  
  const [formValues, setFormValues] = useState({
    title: { en: "", ar: "" },
    promoCode: "",
    start: "",
    end: "",
    couponCount: "",
    userCount: "",
    percentageOrValue: "",
  });
  const [errors, setErrors] = useState<string | null>(null);
  const sendButtonRef = useRef(null);

  // Form handlers
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const validateForm = () => {
    let newErrors = null;
    const today = new Date().toISOString().split("T")[0];

    if (!formValues.title.en) newErrors = "English Title is required";
    if (!formValues.title.ar) newErrors = "Arabic Title is required";
    if (!formValues.start) {
      newErrors = "Start Date is required";
    } else if (formValues.start <= today) {
      newErrors = "Start Date must be in the future";
    }
    if (!formValues.end) {
      newErrors = "End Date is required";
    } else if (formValues.end <= formValues.start) {
      newErrors = "End Date must be after the Start Date";
    }
    if (!formValues.couponCount) newErrors = "Coupon Count is required";
    if (!formValues.userCount) newErrors = "User Count is required";
    if (!formValues.percentageOrValue) {
      newErrors = type === "percentage" ? "Percentage is required" : "Value is required";
    }
    if (!formValues.promoCode) newErrors = "Promo Code is required";

    setErrors(newErrors);
    return newErrors === null;
  };

  const createCoupon = () => {
    if (validateForm()) {
      const formData = { 
          title: { 
            en: formValues.title.en,
            ar: formValues.title.ar
          },
          promoCode: formValues.promoCode,
          start: formValues.start,
          end: formValues.end,
          couponCount: formValues.couponCount,
          userCount: formValues.userCount,
          [type]: formValues.percentageOrValue,
        };
      dispatch(ActionCreateCoupon({ formdata: formData })).then((data: any) => {
        if (data.error) {
          setErrors('Promo Code already exists');
          setTimeout(() => {
            setErrors('');
          }, 2000);
        } else {
          clear();
        }
      });
    }
  };

  const onSubmit = () => {
    createCoupon();
  };

  const clear = () => {
    setFormValues({
      title: { en: "", ar: "" },
      promoCode: "",
      start: "",
      end: "",
      couponCount: "",
      userCount: "",
      percentageOrValue: "",
    });
  };

  return (
    <>
      <div className="flex items-center my-8">
        <h2 className="mr-auto text-lg font-medium">Add New Coupon</h2>
      </div>

      <div>
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2 grid grid-cols-12 gap-5">
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-1" className="font-bold">Coupon Name English</FormLabel>
              <FormInput
                id="modal-form-1"
                type="text"
                name="title[en]"
                value={formValues.title.en}
                onChange={(e) => {
                  setFormValues({
                    ...formValues,
                    title: { ...formValues.title, en: e.target.value },
                  });
                }}
              />
            </div>
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-2" className="font-bold">Coupon Name Arabic</FormLabel>
              <FormInput
                id="modal-form-2"
                type="text"
                name="title[ar]"
                value={formValues.title.ar}
                onChange={(e) => {
                  setFormValues({
                    ...formValues,
                    title: { ...formValues.title, ar: e.target.value },
                  });
                }}
              />
            </div>
          </div>
          <div className="col-span-2 grid grid-cols-12 gap-5">
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-2" className="font-bold">Start Date</FormLabel>
              <FormInput
                id="modal-form-2"
                type="date"
                name="start"
                value={formValues.start}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-2" className="font-bold">End Date</FormLabel>
              <FormInput
                id="modal-form-2"
                type="date"
                name="end"
                value={formValues.end}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="col-span-2 grid grid-cols-12 gap-5">
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-2" className="font-bold">Coupon Count</FormLabel>
              <FormInput
                id="modal-form-2"
                type="number"
                name="couponCount"
                value={formValues.couponCount}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-2" className="font-bold">User Count</FormLabel>
              <FormInput
                id="modal-form-2"
                type="number"
                name="userCount"
                value={formValues.userCount}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="col-span-2 grid grid-cols-12 gap-5">
            <div className="col-span-12 sm:col-span-6">
              <div className="grid grid-cols-2">
                <div>
                  <input
                    id="percentage"
                    checked={type === "percentage"}
                    onChange={() => setType("percentage")}
                    type="radio"
                  />
                  <FormLabel htmlFor="percentage" className="font-bold">Percentage</FormLabel>
                </div>
                <div>
                  <input
                    id="value"
                    checked={type === "value"}
                    onChange={() => setType("value")}
                    type="radio"
                  />
                  <FormLabel htmlFor="value" className="font-bold">Value</FormLabel>
                </div>
              </div>
              <FormInput
                id="modal-form-2"
                type="number"
                name="percentageOrValue"
                value={formValues.percentageOrValue}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-2" className="font-bold">Promo Code</FormLabel>
              <FormInput
                id="modal-form-2"
                type="text"
                name="promoCode"
                value={formValues.promoCode}
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
