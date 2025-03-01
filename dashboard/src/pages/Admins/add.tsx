import React, { useState, useRef, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/stores/hooks";
import Button from "../../base-components/Button";
import {
  FormInput,
  FormLabel,
  FormSelect,
} from "../../base-components/Form";
import LoadingIcon from "../../base-components/LoadingIcon";
import { StateGetAllRole } from "../../redux/stores/api/roles/getAll";
import { StateCreateAdmin } from "../../redux/stores/api/Admin/create";
import { ActionCreateAdmin } from "../../redux/action/api/users/add";
import { ActionGetRoles } from "../../redux/action/api/role/getAll";

const Main: React.FC = () => {
  const dispatch = useAppDispatch();

  // Global states
  const [type, setType] = useState<'percentage' | 'value'>('percentage');
  const stateCreateAdmin = useAppSelector(StateCreateAdmin);
  const stateGetAllRole = useAppSelector(StateGetAllRole);


  // Local states
  const roles = stateGetAllRole?.data?.data || [];

  useEffect(() => {
    dispatch(ActionGetRoles());
  }, []);
  const [formValues, setFormValues] = useState({
    name: "",
    username: "",
    password: "",
    phoneNumber: { 
      number: "" 
    },
    role: "",
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
    if (!formValues.password) newErrors = "Password is required";
    if (!formValues.role) newErrors = "Role is required";
    if (!formValues.phoneNumber.number) newErrors = "Phone Number is required";
    if (!formValues.username) newErrors = "Username is required";
    if (!formValues.name) newErrors = "Name is required";
    // if (!formValues.title.en) newErrors = "English Title is required";
    // if (!formValues.title.ar) newErrors = "Arabic Title is required";
    // if (!formValues.start) {
    //   newErrors = "Start Date is required";
    // } else if (formValues.start <= today) {
    //   newErrors = "Start Date must be in the future";
    // }
    // if (!formValues.end) {
    //   newErrors = "End Date is required";
    // } else if (formValues.end <= formValues.start) {
    //   newErrors = "End Date must be after the Start Date";
    // }
    // if (!formValues.couponCount) newErrors = "Coupon Count is required";
    // if (!formValues.userCount) newErrors = "User Count is required";
    // if (!formValues.percentageOrValue) {
    //   newErrors = type === "percentage" ? "Percentage is required" : "Value is required";
    // }
    // if (!formValues.promoCode) newErrors = "Promo Code is required";

    setErrors(newErrors);
    return newErrors === null;
  };

  const createCoupon = () => {
    if (validateForm()) {
      const formData = { 
        phoneNumber: { 
            number: formValues.phoneNumber.number,
          },
          name: formValues.name,
          username: formValues.username,
          password: formValues.password,
          role: formValues.role,
        };
      dispatch(ActionCreateAdmin({ formdata: formData })).then((data: any) => {
        if (data.error) {
          setErrors('Admin already exists');
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
      name: "",
      username: "",
      password: "",
      phoneNumber: { 
        number: "" 
      },
      role: "",
    });
  };

  return (
    <>
      <div className="flex items-center my-8">
        <h2 className="mr-auto text-lg font-medium">Add New Admin</h2>
      </div>

      <div>
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2 grid grid-cols-12 gap-5">
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-1" className="font-bold">Name</FormLabel>
              <FormInput
                id="modal-form-1"
                type="text"
                name="name"
                value={formValues.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-2" className="font-bold">Username</FormLabel>
              <FormInput
                id="modal-form-2"
                type="text"
                name="username"
                value={formValues.username}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="col-span-2 grid grid-cols-12 gap-5">
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-2" className="font-bold">Phone Number</FormLabel>
              <FormInput
                id="modal-form-2"
                type="text"
                name="end"
                value={formValues.phoneNumber.number}
                onChange={(e)=>{
                  setFormValues({
                    ...formValues,
                    phoneNumber: {
                     ...formValues.phoneNumber,
                      number: e.target.value,
                    }
                  })
                }}
              />
            </div>
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-2" className="font-bold">Password</FormLabel>
              <FormInput
                id="modal-form-2"
                type="password"
                name="password"
                value={formValues.password}
                onChange={handleInputChange}
              />
            </div>
            
          </div>
          <div className="col-span-2 grid grid-cols-12 gap-5">
          <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-6">Roles</FormLabel>
              <FormSelect id="modal-form-6" name="role" value={formValues.role} onChange={handleInputChange}>
                <option value="" disabled>(select role)</option>
                {roles.map((role:any) => (
                  <option key={role._id} value={role._id}>{role.key}</option>
                ))}
              </FormSelect>
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
            {stateCreateAdmin?.loading ? (
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
