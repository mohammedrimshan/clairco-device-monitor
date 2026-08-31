import { useState } from "react";
import { useDevices } from "../hooks/useDevices.js";
import { useCreateDevice } from "../hooks/useCreateDevice.js";
import { useUpdateDevice } from "../hooks/useUpdateDevice.js";
import { useDeleteDevice } from "../hooks/useDeleteDevice.js";
import { useDeviceSocket } from "../hooks/useDeviceSocket.js";
import { DeviceList } from "../components/devices/DeviceList.js";
import { DeviceForm } from "../components/devices/DeviceForm.js";
import { Modal } from "../components/common/Modal.js";
import { Loading } from "../components/common/Loading.js";
import { ErrorState } from "../components/common/ErrorState.js";
import { EmptyState } from "../components/common/EmptyState.js";
import type { Device, CreateDeviceInput } from "../types/device.js";

type FilterStatus = "ALL" | "ONLINE" | "OFFLINE";

export function Dashboard() {
  // Realtime hook initialized here once
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
          onSuccess: () => setIsFormOpen(false),
          onError: (err) => alert("Failed to update: " + err.message),
        }
      );
    } else {
      createMut.mutate(formData, {
        onSuccess: () => setIsFormOpen(false),
        onError: (err) => alert("Failed to create: " + err.message),
      });
    }
  };

  const handleConfirmDelete = () => {
    if (!deletingDevice) return;
    deleteMut.mutate(deletingDevice.id, {
      onSuccess: () => setIsDeleteOpen(false),
      onError: (err) => alert("Failed to delete: " + err.message),
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 md:p-8 max-w-7xl">
        <Loading />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto p-4 md:p-8 max-w-7xl">
        <ErrorState message={error?.message || "Failed to load devices"} />
      </div>
    );
  }

  const devices = data || [];
  const total = devices.length;
  const online = devices.filter((d) => d.status === "ONLINE").length;
  const offline = total - online;

  const filteredDevices = devices.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.deviceId.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8 max-w-7xl">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-6 border-gray-200">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Clairco Device Monitor
          </h1>
          <p className="text-gray-500 mt-1">
            Realtime MQTT device monitoring and offline alerts.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
        >
          + Add Device
        </button>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border bg-white shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            Total Devices
          </h3>
          <div className="text-3xl font-bold mt-2 text-gray-900">{total}</div>
        </div>
        <div className="rounded-xl border bg-white shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            Online
          </h3>
          <div className="text-3xl font-bold mt-2 text-green-600">{online}</div>
        </div>
        <div className="rounded-xl border bg-white shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            Offline
          </h3>
          <div className="text-3xl font-bold mt-2 text-red-600">{offline}</div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border shadow-sm">
        <input
          type="text"
          placeholder="Search by name or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:max-w-sm px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
          className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
        >
          <option value="ALL">All Statuses</option>
          <option value="ONLINE">Online</option>
          <option value="OFFLINE">Offline</option>
        </select>
      </div>

      <main>
        {filteredDevices.length === 0 ? (
          <EmptyState />
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
        title={editingDevice ? "Edit Device" : "Add Device"}
      >
        <DeviceForm
          device={editingDevice}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormOpen(false)}
          isLoading={createMut.isPending || updateMut.isPending}
        />
      </Modal>

      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Confirm Deletion"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete <strong>{deletingDevice?.name}</strong>?
            This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={() => setIsDeleteOpen(false)}
              className="px-4 py-2 border rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              disabled={deleteMut.isPending}
              className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 disabled:opacity-50"
            >
              {deleteMut.isPending ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
