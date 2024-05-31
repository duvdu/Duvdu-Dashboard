import DarkModeSwitcher from "../../components/DarkModeSwitcher";
import MainColorSwitcher from "../../components/MainColorSwitcher";
import logoUrl from "../../assets/images/logo.svg";
import illustrationUrl from "../../assets/images/illustration.svg";
import { FormInput, FormCheck } from "../../base-components/Form";
import Button from "../../base-components/Button";
import clsx from "clsx";
import { useAppSelector, useAppDispatch } from "../../redux/stores/hooks";
import { selectAuthState, dataReducer } from "../../redux/stores/api/auth/auth";
import { useFormInputChange } from "../../redux/action/formInputChange";
import { selectFormState, updateFormData } from "../../redux/stores/form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import Toastify from "toastify-js";
import Notification from "../../base-components/Notification";
import Lucide from "../../base-components/Lucide";
import { useEffect } from "react";
import { ActionLogin } from "../../redux/action/api/auth/login/login";
import LoadingIcon from "../../base-components/LoadingIcon";
import { Navigate} from "react-router-dom";

function Main() {
  
  const authState = useAppSelector(selectAuthState)
  const formState = useAppSelector(selectFormState);
  const dispatch = useAppDispatch()
  const handleInputChange = useFormInputChange();
  const schema = yup
    .object({
      username: yup.string().required().min(4),
      password: yup.string().required().min(6),
    })
    .required();

  const {
    register,
    trigger,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const onSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await trigger();
    if (result) {
      dispatch(ActionLogin({ username: formState.username, password: formState.password }))
    }
  };

  useEffect(() => {
    if (authState.error) {
      const failedEl = document
        .querySelectorAll("#failed-notification-content")[0]
        .cloneNode(true) as HTMLElement;
      failedEl.classList.remove("hidden");
      Toastify({
        node: failedEl,
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
      }).showToast();
    } else if (authState.data) {
      // console.log("navigate")
      // navigate('/');
    }
  }, [authState.error, authState.data])
  if(authState.data) return <Navigate to="/"/>
  return (
    <>
      <div
        className={clsx([
          "-m-3 sm:-mx-8 p-3 sm:px-8 relative h-screen lg:overflow-hidden bg-primary xl:bg-white dark:bg-darkmode-800 xl:dark:bg-darkmode-600",
          "before:hidden before:xl:block before:content-[''] before:w-[57%] before:-mt-[28%] before:-mb-[16%] before:-ml-[13%] before:absolute before:inset-y-0 before:left-0 before:transform before:rotate-[-4.5deg] before:bg-primary/20 before:rounded-[100%] before:dark:bg-darkmode-400",
          "after:hidden after:xl:block after:content-[''] after:w-[57%] after:-mt-[20%] after:-mb-[13%] after:-ml-[13%] after:absolute after:inset-y-0 after:left-0 after:transform after:rotate-[-4.5deg] after:bg-primary after:rounded-[100%] after:dark:bg-darkmode-700",
        ])}
      >
        <DarkModeSwitcher />
        <MainColorSwitcher />
        <div className="container relative z-10 sm:px-10">
          <div className="block grid-cols-2 gap-4 xl:grid">
            {/* BEGIN: Login Info */}
            <div className="flex-col hidden min-h-screen xl:flex">
              <a href="" className="flex items-center pt-5 -intro-x">
                {/* <img
                  alt="DuvDu Admin DashBoard"
                  className="w-6"
                  src={logoUrl}
                /> */}
                <span className="ml-3 text-lg text-white"> DUVDU </span>
              </a>
              <div className="my-auto">
                <img
                  alt="DuvDu Admin DashBoard"
                  className="w-1/2 -mt-16 -intro-x"
                  src={illustrationUrl}
                />
                <div className="mt-10 text-4xl font-medium leading-tight text-white -intro-x">
                  A few more clicks to <br />
                  sign in to your account.
                </div>
                {/* <div className="mt-5 text-lg text-white -intro-x text-opacity-70 dark:text-slate-400">
                  Manage all your e-commerce accounts in one place
                </div> */}
              </div>
            </div>
            {/* END: Login Info */}
            {/* BEGIN: Login Form */}
            <div className="flex h-screen py-5 my-10 xl:h-auto xl:py-0 xl:my-0">
              <div className="w-full px-5 py-8 mx-auto my-auto bg-white rounded-md shadow-md xl:ml-20 dark:bg-darkmode-600 xl:bg-transparent sm:px-8 xl:p-0 xl:shadow-none sm:w-3/4 lg:w-2/4 xl:w-auto">
                <form className="validate-form" onSubmit={onSubmit}>
                  <h2 className="text-2xl font-bold text-center intro-x xl:text-3xl xl:text-left">
                    Sign In
                  </h2>
                  <div className="mt-2 text-center intro-x text-slate-400 xl:hidden">
                    A few more clicks to sign in to your account. Manage all your
                    e-commerce accounts in one place
                  </div>
                  <div className="mt-8 intro-x">
                    <FormInput
                      {...register("username")}
                      type="text"
                      className="block px-4 py-3 intro-x login__input min-w-full xl:min-w-[350px]"
                      placeholder="UserName"
                      value={formState.username || ''}
                      onChange={handleInputChange('username')}
                    />
                    {errors.username && (
                      <div className="mt-2 text-danger">
                        {typeof errors.username.message === "string" &&
                          errors.username.message}
                      </div>
                    )}
                    <FormInput
                      {...register("password")}
                      type="password"
                      className="block px-4 py-3 mt-4 intro-x login__input min-w-full xl:min-w-[350px]"
                      placeholder="Password"
                      value={formState.password || ''}
                      onChange={handleInputChange('password')}
                    />
                    {errors.password && (
                      <div className="mt-2 text-danger">
                        {typeof errors.password.message === "string" &&
                          errors.password.message}
                      </div>
                    )}
                  </div>
                  <div className="mt-5 text-center intro-x xl:mt-8 xl:text-left">
                    <Button
                      variant="primary"
                      type="submit"
                      className="w-full px-4 py-3 align-top xl:w-32 xl:mr-3"
                    >
                      {
                        authState.loading ?
                          <LoadingIcon 
                          color="white" 
                          icon="puff" 
                          className="w-4 h-4" /> :
                          <span>Login</span>
                      }
                    </Button>
                  </div>
                  <div className="mt-10 text-center intro-x xl:mt-24 text-slate-600 dark:text-slate-500 xl:text-left">
                  </div>
                </form>
              </div>
            </div>
            {/* END: Login Form */}
          </div>
        </div>
        <Notification
          id="success-notification-content"
          className="flex hidden"
        >
          <Lucide icon="CheckCircle" className="text-success" />
          <div className="ml-4 mr-4">
            <div className="font-medium">Registration success!</div>
            <div className="mt-1 text-slate-500">
              Please check your e-mail for further info!
            </div>
          </div>
        </Notification>
        {/* END: Success Notification Content */}
        {/* BEGIN: Failed Notification Content */}
        <Notification
          id="failed-notification-content"
          className="flex hidden"
        >
          <Lucide icon="XCircle" className="text-danger" />
          <div className="ml-4 mr-4">
            <div className="font-medium">failed!</div>
            <div className="mt-1 text-slate-500">
              {authState.error}
            </div>
          </div>
        </Notification>
      </div>
    </>
  );
}

export default Main;
