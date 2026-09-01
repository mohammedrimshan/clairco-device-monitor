import { useDevices } from "@/hooks/useDevices";
import { useDeviceSocket } from "@/hooks/useDeviceSocket";
import { Loading } from "@/components/common/Loading";
import { ErrorState } from "@/components/common/ErrorState";
import { StatCard } from "@/components/dashboard/StatCard";
import { DeviceStatusChart } from "@/components/dashboard/DeviceStatusChart";
import { DeviceHealthList } from "@/components/dashboard/DeviceHealthList";
import { Server, CheckCircle, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

export function Dashboard() {
  // Realtime hook initialized here once
  useDeviceSocket();

  const { data, isLoading, isError, error } = useDevices();

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
        <ErrorState message={error?.message || "Failed to load dashboard data"} />
      </div>
    );
  }

  const devices = data || [];
  const total = devices.length;
  const online = devices.filter((d) => d.status === "ONLINE").length;
  const offline = total - online;

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Overview
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Monitor the realtime health and status of your IoT devices.
          </p>
        </div>
        <Link
          to="/devices"
          className="inline-flex items-center justify-center px-4 py-2 bg-white border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-colors"
        >
          Manage Devices
        </Link>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          title="Total Devices"
          value={total}
          icon={<Server className="w-5 h-5 text-indigo-500" />}
        />
        <StatCard
          title="Online Devices"
          value={online}
          valueClassName="text-green-600"
          icon={<CheckCircle className="w-5 h-5 text-green-500" />}
        />
        <StatCard
          title="Offline Devices"
          value={offline}
          valueClassName="text-red-600"
          icon={<AlertCircle className="w-5 h-5 text-red-500" />}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="col-span-1 lg:col-span-2 rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Device Distribution</h2>
            <p className="text-sm text-gray-500 mt-1">Current online vs offline status</p>
          </div>
          <div className="p-6 flex-1 flex flex-col items-center justify-center">
            <DeviceStatusChart online={online} offline={offline} />
          </div>
        </div>

        <div className="col-span-1 rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Device Health</h2>
            <p className="text-sm text-gray-500 mt-1">Recent status indicators</p>
          </div>
          <div className="p-6 flex-1">
            <DeviceHealthList devices={devices} />
          </div>
        </div>
      </div>
    </div>
  );
}
