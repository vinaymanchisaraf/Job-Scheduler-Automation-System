import { useEffect, useState } from "react";
import { getJobs, createJob, runJob } from "./api";

export default function App() {
  const [jobs, setJobs] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [priority, setPriority] = useState("Low");
  const [payload, setPayload] = useState("");
  const [loading, setLoading] = useState(false);

  const loadJobs = async () => {
    const data = await getJobs();
    setJobs(data);
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleCreate = async () => {
    if (!taskName.trim()) {
      alert("Task name is required");
      return;
    }

    let parsedPayload;
    try {
      parsedPayload = JSON.parse(payload);
    } catch {
      parsedPayload = { value: payload };
    }

    try {
      setLoading(true);
      await createJob({ taskName, priority, payload: parsedPayload });
      setTaskName("");
      setPayload("");
      await loadJobs();
    } finally {
      setLoading(false);
    }
  };

  const handleRun = async (id) => {
    await runJob(id);
    await loadJobs();
    setTimeout(loadJobs, 3500);
  };

  const statusBadge = (status) => {
    if (status === "completed") return "bg-green-100 text-green-700";
    if (status === "running") return "bg-yellow-100 text-yellow-700";
    return "bg-gray-100 text-gray-700";
  };

  const priorityBadge = (priority) => {
    if (priority === "High") return "text-red-600 font-semibold";
    if (priority === "Medium") return "text-orange-600 font-semibold";
    return "text-green-600 font-semibold";
  };

  return (
   <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-10">


      {/* Decorative background blobs */}
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-pink-400 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-yellow-400 rounded-full blur-3xl opacity-30"></div>

      {/* Main content */}
      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-bold mb-10 text-white">

          Job Scheduler Dashboard
        </h1>

        {/* Create Job Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-10">
          <h2 className="text-xl font-semibold mb-6 text-gray-700">
            Create New Job
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <input
              className="border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Task Name"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
            />

            <select
              className="border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>

            <textarea
              className="border rounded-lg px-4 py-3 md:col-span-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Payload (email or JSON)"
              rows="3"
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
            />

            <button
              onClick={handleCreate}
              disabled={loading}
              className="md:col-span-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-lg font-semibold transition shadow-lg"
            >
              {loading ? "Creating Job..." : "Create Job"}
            </button>
          </div>
        </div>

        {/* Jobs Table */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="text-left px-6 py-4">Task</th>
                <th className="text-left px-6 py-4">Priority</th>
                <th className="text-left px-6 py-4">Status</th>
                <th className="text-center px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {jobs.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-10 text-gray-500">
                    No jobs created yet
                  </td>
                </tr>
              )}

              {jobs.map((job) => (
                <tr
                  key={job.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {job.taskName}
                  </td>
                  <td className={`px-6 py-4 ${priorityBadge(job.priority)}`}>
                    {job.priority}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-4 py-1 rounded-full text-sm ${statusBadge(
                        job.status
                      )}`}
                    >
                      {job.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {job.status === "pending" ? (
                      <button
                        onClick={() => handleRun(job.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-5 py-1.5 rounded-lg transition shadow-sm"
                      >
                        Run
                      </button>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
