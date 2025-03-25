import React, { useState, useEffect, useRef } from 'react';
import { Dialog, Menu, Tab } from '../../base-components/Headless';
import clsx from 'clsx';
import Lucide from '../../base-components/Lucide';
import Button from '../../base-components/Button';
import LoadingIcon from '../../base-components/LoadingIcon';
import { useAppDispatch, useAppSelector } from '../../redux/stores/hooks';
import { ActionCreateRole } from '../../redux/action/api/role/create';
import { StateCreateRole } from '../../redux/stores/api/roles/create';
import { ActionUpdateRole } from '../../redux/action/api/role/update';
import { StateUpdateRole } from '../../redux/stores/api/roles/update';
import { useNavigate, useParams } from 'react-router-dom';
import { ActionDeleteRole } from '../../redux/action/api/role/delete';
import { ActionGetRoleById } from '../../redux/action/api/role/getById';
import { ActionGetRoles } from '../../redux/action/api/role/getAll';
import { StateGetAllRole } from '../../redux/stores/api/roles/getAll';
import { StateGetRoleById } from '../../redux/stores/api/roles/getById';
import Tippy from '../../base-components/Tippy';
import { StateDeleteRole } from '../../redux/stores/api/roles/delete';
import { FormInput, FormLabel } from '../../base-components/Form';

type PermissionRole = {
  [key: string]: string[];
};

interface Role {
  key: string;
  permissions: string[];
}

const SpeficIcon: React.FC<{ name: string }> = ({ name }) => {
  return (
    <div className="size-4 flex justify-center items-center">
      <div className="relative">
        <div className="-translate-x-[.85px] absolute top-0 left-0 w-[1.7px] h-[6px] bg-[#B4BBC8]"></div>
        <div
          className={`translate-y-[.85px] absolute bottom-0 left-0 h-[1.7px] w-[6px] transform transition-all duration-300 ${name === 'minus' ? 'bg-transparent' : 'bg-[#B4BBC8]'
            }`}
        ></div>
        <div className="-translate-x-[.85px] absolute bottom-0 left-0 w-[1.7px] h-[6px] bg-[#B4BBC8]"></div>
        <div
          className={`translate-y-[.85px] absolute bottom-0 right-0 h-[1.7px] w-[6px] transform transition-all duration-300 ${name === 'minus' ? 'bg-transparent' : 'bg-[#B4BBC8]'
            }`}
        ></div>
      </div>
    </div>
  );
};

const Main: React.FC = () => {
  const [openCategories, setOpenCategories] = useState<string[]>([]);
  const [categories, setCategories] = useState<Role[]>([]);
  const dispatch = useAppDispatch()
  const navigate = useNavigate();

  /////////////// global Used ////////////////////
  const stateCreateRole = useAppSelector(StateCreateRole)
  const stateUpdateeRole = useAppSelector(StateUpdateRole)
  const stateGetAllRole = useAppSelector(StateGetAllRole)
  const stateGetRoleById = useAppSelector(StateGetRoleById)
  const stateDeleteRole = useAppSelector(StateDeleteRole)
  const { id } = useParams();

  /////////////// get roleById and roles ////////////////////
  const data = stateGetAllRole?.data?.data || []
  const details = stateGetRoleById?.data?.data || []

  useEffect(() => {
    setKey(details.key)
    setfeatures(details.permissions)
  }, [details?.key])


  useEffect(() => {
    dispatch(ActionGetRoles())
  }, [stateDeleteRole, stateCreateRole])
  useEffect(() => {
    if (id) {
      dispatch(ActionGetRoleById(id))
    }
  }, [id])

  /////////////// end of get Role ////////////////////
  /////////////// end of get Role ////////////////////
  /////////////// create Role ////////////////////
  const [newKey, setNewKey] = useState("");
  const [newfeatures, setNewfeatures] = useState<string[]>([]);
  const createRole = () => {
    if (newKey.length > 0)
      dispatch(ActionCreateRole({ key: newKey, features: newfeatures }))
  }

  /////////////// end of create Role ////////////////////
  /////////////// update Role ////////////////////
  const [key, setKey] = useState("");
  const [features, setfeatures] = useState<string[]>([]);

  const updateRole = () => {
    if (key.length > 0 && id)
      dispatch(ActionUpdateRole({ key: key, features: features, roleId: id }))
  }
  /////////////// end of update Role ////////////////////
  /////////////// delete Role ////////////////////
  const [idToDelete, setIdToDelete] = useState("");
  const deleteRole = () => {
    if (idToDelete)
      dispatch(ActionDeleteRole(idToDelete))
  }
  /////////////// end of update Role ////////////////////
  ///////////////////////////////  controles ////////////////////////////////////////////

  const onSubmit = () => {
    if (id) updateRole()
    else createRole()
  }



  const changed = () => {
    return true
  }

  useEffect(() => {
    const fetchData = async () => {
      const permissionsData: PermissionRole = {
        auth: [
          "resetPassword",
          "updatePhoneNumber",
          "changePassword",
          "updateProfile",
        ],
        bookmarks: ["bookmarks"],
        category: [
          "create-category",
          "update-category",
          "update-category",
          "remove-category",
          "get-gategories-admin",
        ],
        ticket: [
          "create ticket",
          "get-ticket",
          "get-all-tickets",
          "remove-ticket",
          "update-ticket",
        ],
        terms: ["create-term", "update-term"],
        plans: [
          "get plan",
          "create plan",
          "get all plans",
          "remove plan",
          "update plan",
        ],
        roles: [
          "get role",
          "get roles",
          "create role",
          "update role",
          "update role",
          "remove role",
        ],
        portfolioPost: [
          "create portfolio project",
          "update portfolio project",
          "remove portfolio project",
          "get crm portfolio projects",
          "get analysis handler",
        ],
        copyrights: [
          "create copyright project",
          "update copyright project",
          "remove copyright project",
          "get crm copyright projects",
          "get copyright analysis handler",
        ],
        studioBooking: [
          "create studio project",
          "update studio project",
          "remove studio project",
          "get crm studio projects",
          "get studio analysis handler",
        ],
        booking: ["booking"],
      };

      const formattedCategories = Object.keys(permissionsData).map((key) => ({
        key,
        permissions: permissionsData[key],
      }));

      setCategories(formattedCategories);
    };

    fetchData();
  }, []);

  const [openRoles, setOpenRoles] = useState<{ [key: string]: boolean }>({
    auth:true,
    bookmarks:true,
    category:true,
    ticket: true,
    terms: true,
    plans: true,
    roles:true,
    portfolioPost: true,
    copyrights: true,
    studioBooking:true,
    booking: true,
  });
  console.log({openRoles})
  const toggleRole = (roleKey: string) => {
    setOpenRoles((prev) => ({
      ...prev,
      [roleKey]: !prev[roleKey],
    }));
  };
  const showChatBox = (id: string) => {
    navigate(`/roles/${id}`)
  };
  const toggleFeature = (permission: string) => {
    if (id)
      setfeatures((prev) =>
        prev.includes(permission)
          ? prev.filter((feature) => feature !== permission)
          : [...prev, permission]
      );
    else
      setNewfeatures((prev) =>
        prev.includes(permission)
          ? prev.filter((feature) => feature !== permission)
          : [...prev, permission]
      );
  };

  const handleChange = (event : any) => {
    setNewKey(event.target.value);
  };
  const onDelete = () => {
    setDeleteModalPreview(false);
    deleteRole()
    clear()
  }
  const onAdd = () => {
    setDeleteModalPreview(false);
    onSubmit()
  }

  const goToMainRole = () => {
    navigate('/roles')
    clear()
  }
  const clear = () => {
    setKey("")
    setNewKey("")
    setfeatures([])
    setNewfeatures([])

  }

  const [deleteModalPreview, setDeleteModalPreview] = useState(false);
  const [headerFooterModalPreview, setHeaderFooterModalPreview] = useState(false);
  const sendButtonRef = useRef(null);
  const deleteButtonRef = useRef(null);

  return (
    <>
      {/* END: Modal Toggle */}
      {/* BEGIN: Modal Content */}
      <Dialog open={deleteModalPreview} onClose={() => {
        setDeleteModalPreview(false);
      }}
        initialFocus={deleteButtonRef}
      >
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
            <Button type="button"  onClick={() => {
              setDeleteModalPreview(false);
            }}
              className="w-24 mr-1"
            >
              Cancel
            </Button>
            <Button type="button" variant="danger" className="w-24" ref={deleteButtonRef} onClick={onDelete}>
              Delete
            </Button>
          </div>
        </Dialog.Panel>
      </Dialog>
      {/* BEGIN: Modal Toggle */}
      {/* END: Modal Toggle */}
      {/* BEGIN: Modal Content */}
      <Dialog open={headerFooterModalPreview} onClose={() => {
        setHeaderFooterModalPreview(false);
      }}
        initialFocus={sendButtonRef}
      >
        <Dialog.Panel>
          <Dialog.Description className="grid grid-cols-12 gap-4 gap-y-3">
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-1">
                Add New Key
              </FormLabel>
              <FormInput id="modal-form-1" type="text" placeholder="EX. Moderator" onChange={handleChange} value={newKey} />
            </div>
          </Dialog.Description>
          <Dialog.Footer>
            <Button type="button"  onClick={() => {
              setHeaderFooterModalPreview(false);
            }}
              className="w-20 mr-1"
            >
              Cancel
            </Button>
            <Button  type="button" className="w-20" ref={sendButtonRef} onClick={onAdd}>
              Add
            </Button>
          </Dialog.Footer>
        </Dialog.Panel>
      </Dialog>
      {/* END: Modal Content */}
      <div className="flex items-center mt-5">
        <h2 className="mr-auto text-lg font-medium">Roles</h2>
      </div>
      <div className="grid grid-cols-12 gap-5 mt-5 intro-y">
        {/* BEGIN: Chat Side Menu */}
        <Tab.Group className="col-span-12 lg:col-span-4 2xl:col-span-3">

          {
            id &&
            <Button  className="mr-2 shadow-md" onClick={goToMainRole}>
              Add New Role
            </Button>
          }
          <div className={`${id && 'pt-1 mt-4'} pr-1 overflow-y-auto h-[525px] scrollbar-hidden`}>
            <ul className='flex flex-col gap-4'>
              {data && data.map((item: any) => (
                <li key={item._id}>
                  <div
                    key={item._id}
                    className={clsx({
                      "intro-x cursor-pointer box relative flex items-center p-5":
                        true,
                      "": item._id,
                    })}
                    onClick={() => showChatBox(item._id)}>
                    <div className="flex-none w-12 h-12 mr-1 image-fit">

                    </div>
                    <div className="ml-2 overflow-hidden">
                      <div className="flex items-center">
                        <a  className="font-medium">
                          {item.key}
                          <Tippy
                            onClick={() => {
                              setDeleteModalPreview(true),
                                setIdToDelete(item._id)
                            }}
                            content="Remove record message"
                            className="absolute top-3 right-3 flex items-center justify-center w-5 h-5 -mt-2 -mr-2 text-white rounded-full bg-danger"
                          >
                            <div>
                              <Lucide icon="X" className="w-4 h-4" />
                            </div>
                          </Tippy>

                        </a>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Tab.Group>
        <div className="col-span-12 intro-y lg:col-span-8 2xl:col-span-9">
          <div className="h-[525px] box overflow-y-scroll scrollbar-hidden">
            <ul>
              {categories.map((role) => {
                return (
                  <li key={role.key} className="cursor-pointer">
                    <div
                      className="flex w-full gap-10 items-center px-5 py-1"
                      onClick={() => toggleRole(role.key)}
                    >
                      <span className="text-[#4F5E7B] font-semibold text-xl">
                        {role.key}
                      </span>
                    </div>
                    {openRoles[role.key] && (
                      <ul className="pl-5">
                        {role.permissions.map((permission, index) => (
                          <li key={index} className="p-2">
                            <label className='flex items-center gap-2'>
                              <input
                                type="checkbox"
                                className='p-2 bg-slate-500 rounded'
                                checked={(id ? features : newfeatures)?.includes(permission)}
                                onChange={() => toggleFeature(permission)}
                              />
                              {permission}
                            </label>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
          {
            (id && changed()) &&
            <div className='w-full flex justify-end'>
              <Button onClick={onSubmit} type="button"  className="w- mt-2" >
                Save Changes
                {
                  stateCreateRole.loading || stateUpdateeRole.loading &&
                  <LoadingIcon icon="puff" className="ml-3" />
                }
              </Button>
            </div>
          }
          {
            (!id) &&
            <div className='w-full flex justify-end'>
              <Button disabled={newfeatures.length == 0}
                type="button"  className="w-24 mt-2 whitespace-nowrap"
                onClick={() => {
                  setHeaderFooterModalPreview(true);
                }}
              >
                Add New Key
                {
                  stateCreateRole.loading || stateUpdateeRole.loading &&
                  <LoadingIcon icon="puff" className="ml-3" />
                }
              </Button>
            </div>
          }
        </div>
      </div>
    </>
  );
};

export default Main;
