import React, { useEffect, useState } from 'react'
import Pagination from "../../../base-components/Pagination";
import { FormSelect } from "../../../base-components/Form";
import Lucide from "../../../base-components/Lucide";
import Tippy from "../../../base-components/Tippy";
import Table from "../../../base-components/Table";
import Button from "../../../base-components/Button";
import { Dialog } from "../../../base-components/Headless";
import { useAppDispatch, useAppSelector } from '../../../redux/stores/hooks'
import { StateCancelledContracts } from '../../../redux/stores/api/contracts/cancelledContracts'
import { 
  ActionDeleteCancelledContract,
  ActionAcceptCancelledContract 
} from '../../../redux/action/api/contracts/cancelledContracts'
import { ActionGetCancelledContracts } from '../../../redux/action/api/contracts/getCancelled'

export default function CancelledContracts() {
  const dispatch = useAppDispatch()
  const stateCancelledContracts = useAppSelector(StateCancelledContracts)
  const data = stateCancelledContracts?.data?.data
  const paginationState = stateCancelledContracts?.data?.pagination
  const [limit, setLimit] = useState("10");
  const [page, setPage] = useState(1);
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const [acceptConfirmationModal, setAcceptConfirmationModal] = useState(false);
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(ActionGetCancelledContracts({limit, page}))
  }, [dispatch, limit, page])
  console.log({stateCancelledContracts})

  const handleDelete = async (id: string) => {
    setSelectedContractId(id);
    setDeleteConfirmationModal(true);
  };

  const handleAccept = async (id: string) => {
    setSelectedContractId(id);
    setAcceptConfirmationModal(true);
  };

  const confirmDelete = async () => {
    if (selectedContractId) {
      await dispatch(ActionDeleteCancelledContract(selectedContractId));
      dispatch(ActionGetCancelledContracts({ limit, page })); // Refresh the list
      setDeleteConfirmationModal(false);
    }
  };

  const confirmAccept = async () => {
    if (selectedContractId) {
      await dispatch(ActionAcceptCancelledContract(selectedContractId));
      dispatch(ActionGetCancelledContracts({ limit, page })); // Refresh the list
      setAcceptConfirmationModal(false);
    }
  };

  return (
    <>
      <h2 className="mt-10 text-lg font-medium intro-y">Cancelled Contracts</h2>
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="col-span-12 overflow-auto intro-y 2xl:overflow-visible">
          <Table className="border-spacing-y-[10px] border-separate -mt-2">
            <Table.Thead>
              <Table.Tr>
                <Table.Th className="border-b-0 whitespace-nowrap">
                  Service Provider
                </Table.Th>
                <Table.Th className="border-b-0 whitespace-nowrap">
                  Customer
                </Table.Th>
                <Table.Th className="border-b-0 whitespace-nowrap">
                  Contract Type
                </Table.Th>
                <Table.Th className="border-b-0 whitespace-nowrap">
                  Total Price
                </Table.Th>
                <Table.Th className="border-b-0 whitespace-nowrap">
                  Status
                </Table.Th>
                <Table.Th className="border-b-0 whitespace-nowrap">
                  Cancel Reason
                </Table.Th>
                <Table.Th className="border-b-0 whitespace-nowrap">
                  Actions
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data?.map((item: any, index: number) => (
                <Table.Tr key={index} className="intro-x">
                  {/* Service Provider */}
                  <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    <div className="flex items-center">
                      <div className="w-10 h-10 image-fit zoom-in">
                        <Tippy
                          as="img"
                          alt="Service Provider"
                          className="rounded-lg border-white shadow-[0px_0px_0px_2px_#fff,_1px_1px_5px_rgba(0,0,0,0.32)] dark:shadow-[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)]"
                          src={item.contract.sp.profileImage}
                          content={item.contract.sp.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="font-medium whitespace-nowrap">
                          {item.contract.sp.name}
                        </div>
                        <div className="text-slate-500 text-xs whitespace-nowrap">
                          {item.contract.sp.phoneNumber.number}
                        </div>
                      </div>
                    </div>
                  </Table.Td>

                  {/* Customer */}
                  <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    <div className="flex items-center">
                      <div className="w-10 h-10 image-fit zoom-in">
                        <Tippy
                          as="img"
                          alt="Customer"
                          className="rounded-lg border-white shadow-[0px_0px_0px_2px_#fff,_1px_1px_5px_rgba(0,0,0,0.32)] dark:shadow-[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)]"
                          src={item.contract.customer.profileImage}
                          content={item.contract.customer.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="font-medium whitespace-nowrap">
                          {item.contract.customer.name}
                        </div>
                        <div className="text-slate-500 text-xs whitespace-nowrap">
                          {item.contract.customer.phoneNumber.number}
                        </div>
                      </div>
                    </div>
                  </Table.Td>

                  {/* Contract Type */}
                  <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    <div className="capitalize">{item.contract.cycle}</div>
                  </Table.Td>

                  {/* Total Price */}
                  <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    ${item.contract.contract.totalPrice}
                  </Table.Td>

                  {/* Status */}
                  <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    <div className="flex items-center justify-center text-danger">
                      <Lucide icon="XCircle" className="w-4 h-4 mr-2" />
                      {item.contract.contract.status}
                    </div>
                  </Table.Td>

                  {/* Cancel Reason */}
                  <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {item.cancelReason}
                  </Table.Td>

                  
                        {/* Actions Column */}
                  <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                  {item.contract.contract.status === 'pending' && 
                    <div className="flex justify-center gap-2">
                      <Tippy content="Accept Cancellation">
                        <Button
                          variant="success"
                          onClick={() => handleAccept(item._id)}
                          className="px-2 py-1"
                        >
                          <Lucide icon="Check" className="w-4 h-4" />
                        </Button>
                      </Tippy>
                      <Tippy content="Delete Cancellation">
                        <Button
                          variant="danger"
                          onClick={() => handleDelete(item._id)}
                          className="px-2 py-1"
                        >
                          <Lucide icon="Trash2" className="w-4 h-4" />
                        </Button>
                      </Tippy>
                    </div>
                  }
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </div>

        {/* BEGIN: Pagination */}
        <div className="flex flex-wrap items-center col-span-12 intro-y sm:flex-row sm:flex-nowrap">
          {paginationState ? (
            <Pagination className="w-full sm:w-auto sm:mr-auto">
              <Pagination.Link onClick={() => setPage(1)}>
                <Lucide icon="ChevronsLeft" className="w-4 h-4" />
              </Pagination.Link>
              <Pagination.Link onClick={() => setPage(paginationState?.currentPage > 1 ? paginationState?.currentPage - 1 : 1)}>
                <Lucide icon="ChevronLeft" className="w-4 h-4" />
              </Pagination.Link>
              {Array.from({ length: paginationState?.totalPages }, (_, index) => (
                <div key={index} onClick={() => setPage(index + 1)}>
                  <Pagination.Link active={paginationState?.currentPage === index + 1}>
                    {index + 1}
                  </Pagination.Link>
                </div>
              ))}
              <Pagination.Link onClick={() => setPage(paginationState?.currentPage < paginationState?.totalPages ? paginationState?.currentPage + 1 : paginationState?.totalPages)}>
                <Lucide icon="ChevronRight" className="w-4 h-4" />
              </Pagination.Link>
              <Pagination.Link onClick={() => setPage(paginationState?.totalPages)}>
                <Lucide icon="ChevronsRight" className="w-4 h-4" />
              </Pagination.Link>
            </Pagination>
          ) : (
            <div className="w-full sm:w-auto sm:mr-auto" />
          )}
          <FormSelect className="w-20 mt-3 !box sm:mt-0" onChange={(e) => setLimit(e.target.value)}>
            <option>10</option>
            <option>25</option>
            <option>35</option>
            <option>50</option>
          </FormSelect>
        </div>
        {/* END: Pagination */}
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={deleteConfirmationModal}
        onClose={() => setDeleteConfirmationModal(false)}
      >
        <Dialog.Panel>
          <div className="p-5 text-center">
            <Lucide
              icon="XCircle"
              className="w-16 h-16 mx-auto mt-3 text-danger"
            />
            <div className="mt-5 text-3xl">Are you sure?</div>
            <div className="mt-2 text-slate-500">
              Do you really want to delete this cancelled contract?
              This process cannot be undone.
            </div>
          </div>
          <div className="px-5 pb-8 text-center">
            <Button
              variant="outline-secondary"
              type="button"
              onClick={() => setDeleteConfirmationModal(false)}
              className="w-24 mr-1"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              type="button"
              className="w-24"
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </div>
        </Dialog.Panel>
      </Dialog>

      {/* Accept Confirmation Modal */}
      <Dialog
        open={acceptConfirmationModal}
        onClose={() => setAcceptConfirmationModal(false)}
      >
        <Dialog.Panel>
          <div className="p-5 text-center">
            <Lucide
              icon="CheckCircle"
              className="w-16 h-16 mx-auto mt-3 text-success"
            />
            <div className="mt-5 text-3xl">Are you sure?</div>
            <div className="mt-2 text-slate-500">
              Do you really want to accept this cancelled contract?
            </div>
          </div>
          <div className="px-5 pb-8 text-center">
            <Button
              variant="outline-secondary"
              type="button"
              onClick={() => setAcceptConfirmationModal(false)}
              className="w-24 mr-1"
            >
              Cancel
            </Button>
            <Button
              variant="success"
              type="button"
              className="w-24"
              onClick={confirmAccept}
            >
              Accept
            </Button>
          </div>
        </Dialog.Panel>
      </Dialog>
    </>
  )
} 