import { useState } from "react";
import { useDevices } from "@/hooks/useDevices";
import { useCreateDevice } from "@/hooks/useCreateDevice";
import { useUpdateDevice } from "@/hooks/useUpdateDevice";
import { useDeleteDevice } from "@/hooks/useDeleteDevice";
import { useDeviceSocket } from "@/hooks/useDeviceSocket";
import { DeviceList } from "@/components/devices/DeviceList";
import { DeviceForm } from "@/components/devices/DeviceForm";
import { Modal } from "@/components/common/Modal";
import { Loading } from "@/components/common/Loading";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import type { Device, CreateDeviceInput } from "@/types/device";
import { Plus, Search, Filter } from "lucide-react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/error";

type FilterStatus = "ALL" | "ONLINE" | "OFFLINE";

export function Devices() {
  useDeviceSocket();

  const { data, isLoading, isError, error } = useDevices();
  const createMut = useCreateDevice();
  const updateMut = useUpdateDevice();
  const deleteMut = useDeleteDevice();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("ALL");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | undefined>(undefined);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingDevice, setDeletingDevice] = useState<Device | undefined>(undefined);

  const handleOpenCreate = () => {
    setEditingDevice(undefined);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (device: Device) => {
    setEditingDevice(device);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (device: Device) => {
    setDeletingDevice(device);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = (formData: CreateDeviceInput) => {
    if (editingDevice) {
      updateMut.mutate(
        { id: editingDevice.id, data: formData },
        {
          onSuccess: (response) => {
            setIsFormOpen(false);
            toast.success(response.message);
          },
          onError: (err) => toast.error(getErrorMessage(err)),
        }
      );
    } else {
      createMut.mutate(formData, {
        onSuccess: (response) => {
          setIsFormOpen(false);
          toast.success(response.message);
        },
        onError: (err) => toast.error(getErrorMessage(err)),
      });
    }
  };

  const handleConfirmDelete = () => {
    if (!deletingDevice) return;
    deleteMut.mutate(deletingDevice.id, {
      onSuccess: (data) => {
        setIsDeleteOpen(false);
        toast.success(data.message || "Device deleted successfully");
      },
      onError: (err) => toast.error(getErrorMessage(err)),
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loading />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mt-8">
        <ErrorState message={error?.message || "Failed to load devices"} />
      </div>
    );
  }

  const devices = data || [];

  const filteredDevices = devices.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.deviceId.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Devices
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your IoT device inventory and configurations.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Device
        </button>
      </header>

      <div className="flex flex-col sm:flex-row gap-4 items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-colors"
          />
        </div>
        <div className="relative w-full sm:w-auto sm:ml-auto">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
            className="w-full pl-9 pr-8 py-2 appearance-none bg-gray-50 border border-gray-200 rounded-md text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-colors"
          >
            <option value="ALL">All Statuses</option>
            <option value="ONLINE">Online</option>
            <option value="OFFLINE">Offline</option>
          </select>
        </div>
      </div>

      <main>
        {filteredDevices.length === 0 ? (
          <div className="mt-8">
            <EmptyState />
          </div>
        ) : (
          <DeviceList
            devices={filteredDevices}
            onEdit={handleOpenEdit}
            onDelete={handleOpenDelete}
          />
        )}
      </main>

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingDevice ? "Edit Device Configuration" : "Register New Device"}
      >
        <div className="mt-4">
          <DeviceForm
            device={editingDevice}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
            isLoading={createMut.isPending || updateMut.isPending}
          />
        </div>
      </Modal>

      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Remove Device"
      >
        <div className="space-y-4 mt-4">
          <p className="text-sm text-gray-600 leading-relaxed">
            Are you sure you want to delete <strong>{deletingDevice?.name}</strong> (
            <span className="font-mono text-xs">{deletingDevice?.deviceId}</span>)? 
            This action cannot be undone and will stop all monitoring for this device.
          </p>
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
            <button
              onClick={() => setIsDeleteOpen(false)}
              className="px-4 py-2 border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              disabled={deleteMut.isPending}
              className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors shadow-sm"
            >
              {deleteMut.isPending ? "Removing..." : "Remove Device"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
